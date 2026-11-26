import { load as loadYAML, YAMLException } from 'js-yaml'

/**
 * Разбор документа для инструмента json-tools.
 *
 * Раньше любой сломанный JSON уходил в запасной YAML-разбор, а YAML прощает
 * почти всё: `{a: 1}`, `{'a': 1}`, `[1, 2,]`, `{"a": undefined}`. Инструмент
 * отвечал «JSON корректен» на невалидные данные. Теперь документ, который
 * начинается со скобки, проверяется только как JSON, а YAML пробуем лишь для
 * текста, который на JSON не похож.
 */

export interface ParseError {
	format: 'json' | 'yaml'
	message: string
	position: number
	line: number
	column: number
	/** Строка документа, в которой ошибка, для показа с указателем. */
	lineText: string
}

export type ParseResult =
	| { ok: true; data: unknown; format: 'json' | 'yaml'; warnings: string[] }
	| { ok: false; error: ParseError }

export function lineAndColumn(source: string, position: number) {
	const before = source.slice(0, position).split('\n')
	const line = before.length
	const column = before[before.length - 1].length + 1
	const lineText = source.split('\n')[line - 1] ?? ''
	return { line, column, lineText }
}

class LocatedError extends Error {
	constructor(
		message: string,
		public position: number
	) {
		super(message)
	}
}

/**
 * Ищет первую синтаксическую ошибку JSON и объясняет её по-русски.
 * Возвращает null, если документ корректен. Нужен потому, что сообщения
 * JSON.parse различаются в Chrome, Firefox и Safari, а Safari и часть
 * сообщений Chrome вообще не называют позицию.
 */
export function findJsonError(
	source: string
): { message: string; position: number } | null {
	let i = 0
	const n = source.length
	const fail = (message: string, position = i): never => {
		throw new LocatedError(message, position)
	}
	const skipWs = () => {
		while (i < n && ' \t\n\r'.includes(source[i])) i++
	}
	const readWord = () => {
		const match = /[A-Za-z_$][\w$]*/y
		match.lastIndex = i
		const m = match.exec(source)
		return m ? m[0] : ''
	}
	const lineOf = (position: number) => lineAndColumn(source, position).line

	const bareWord = () => {
		const start = i
		const word = readWord()
		if (word === 'undefined' || word === 'NaN' || word === 'Infinity') {
			fail(`Значения ${word} в JSON нет: используйте null или число`, start)
		}
		const lower = word.toLowerCase()
		if (lower === 'true' || lower === 'false' || lower === 'null') {
			fail(`Пишется строчными буквами: ${lower}`, start)
		}
		if (word) {
			fail('Строку нужно взять в двойные кавычки', start)
		}
		fail(`Неожиданный символ «${source[start]}»`, start)
	}

	const string = () => {
		const start = i
		i++
		for (;;) {
			if (i >= n) fail('Строка не закрыта: нет закрывающей кавычки', start)
			const c = source[i]
			if (c === '"') {
				i++
				return
			}
			if (c === '\\') {
				const next = source[i + 1]
				if (next !== undefined && '"\\/bfnrt'.includes(next)) {
					i += 2
					continue
				}
				if (
					next === 'u' &&
					/^[0-9a-fA-F]{4}$/.test(source.slice(i + 2, i + 6))
				) {
					i += 6
					continue
				}
				fail(
					'Неверная escape-последовательность: после \\ допустимы " \\ / b f n r t или uXXXX',
					i
				)
			}
			if (c === '\n' || c === '\r') {
				fail(
					'Перенос строки внутри строки: закройте кавычку или замените перенос на \\n',
					i
				)
			}
			if (c < ' ') {
				fail(
					'Управляющий символ (например, таб) внутри строки: замените на \\t',
					i
				)
			}
			i++
		}
	}

	const number = () => {
		const start = i
		const re = /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/y
		re.lastIndex = i
		const m = re.exec(source)
		if (!m) fail('Неверная запись числа', start)
		i = start + m![0].length
		const next = source[i]
		if (m![1] === '0' && next !== undefined && /\d/.test(next)) {
			fail('Число не может начинаться с нуля: 01 нужно записать как 1', start)
		}
		if (next !== undefined && /[\d.eE]/.test(next)) {
			fail('Неверная запись числа', start)
		}
	}

	const value = (): void => {
		skipWs()
		if (i >= n) fail('Документ оборвался: не хватает значения')
		const c = source[i]
		if (c === '{') return object()
		if (c === '[') return array()
		if (c === '"') return string()
		if (c === '-' || (c >= '0' && c <= '9')) return number()
		if (c === "'") fail('Одинарные кавычки в JSON не разрешены, нужны двойные')
		if (c === '/' || c === '#') fail('Комментарии в JSON не разрешены')
		if (c === '}' || c === ']') fail('Здесь ожидалось значение')
		for (const literal of ['true', 'false', 'null']) {
			if (
				source.startsWith(literal, i) &&
				!/[\w$]/.test(source[i + literal.length] ?? '')
			) {
				i += literal.length
				return
			}
		}
		bareWord()
	}

	const object = () => {
		const open = i
		i++
		skipWs()
		if (source[i] === '}') {
			i++
			return
		}
		for (;;) {
			skipWs()
			const c = source[i]
			if (i >= n) {
				fail(`Не закрыта фигурная скобка {, открытая в строке ${lineOf(open)}`)
			}
			if (c === '}') fail('Лишняя запятая перед }')
			if (c === "'")
				fail('Одинарные кавычки в JSON не разрешены, нужны двойные')
			if (c === '/' || c === '#') fail('Комментарии в JSON не разрешены')
			if (c !== '"') {
				if (readWord()) fail('Ключ нужно взять в двойные кавычки')
				fail('Здесь ожидался ключ в двойных кавычках')
			}
			string()
			skipWs()
			if (source[i] !== ':') fail('После ключа нужно двоеточие')
			i++
			value()
			skipWs()
			if (i >= n) {
				fail(`Не закрыта фигурная скобка {, открытая в строке ${lineOf(open)}`)
			}
			if (source[i] === ',') {
				i++
				continue
			}
			if (source[i] === '}') {
				i++
				return
			}
			if (source[i] === ']') fail('Объект закрыт квадратной скобкой, нужна }')
			fail('Пропущена запятая между полями')
		}
	}

	const array = () => {
		const open = i
		i++
		skipWs()
		if (source[i] === ']') {
			i++
			return
		}
		for (;;) {
			skipWs()
			if (source[i] === ']') fail('Лишняя запятая перед ]')
			if (source[i] === ',') fail('Две запятые подряд: между ними нет значения')
			value()
			skipWs()
			if (i >= n) {
				fail(
					`Не закрыта квадратная скобка [, открытая в строке ${lineOf(open)}`
				)
			}
			if (source[i] === ',') {
				i++
				continue
			}
			if (source[i] === ']') {
				i++
				return
			}
			if (source[i] === '}') fail('Массив закрыт фигурной скобкой, нужна ]')
			fail('Пропущена запятая между элементами')
		}
	}

	try {
		value()
		skipWs()
		if (i < n) {
			fail(
				'После конца документа есть лишние символы. Если это несколько объектов, оберните их в массив [ ]'
			)
		}
		return null
	} catch (error) {
		if (error instanceof LocatedError) {
			return { message: error.message, position: error.position }
		}
		throw error
	}
}

/** Целые длиннее 2^53 JSON.parse молча округляет: 12345678901234567890 → 12345678901234567000. */
function hasUnsafeIntegers(source: string): boolean {
	let found = false
	try {
		JSON.parse(source, function (
			this: unknown,
			_key,
			value,
			context?: { source?: string }
		) {
			if (
				typeof value === 'number' &&
				context?.source &&
				/^-?\d+$/.test(context.source) &&
				!Number.isSafeInteger(value)
			) {
				found = true
			}
			return value
		} as (this: unknown, key: string, value: unknown) => unknown)
	} catch {
		return false
	}
	return found
}

function looksLikeJson(source: string) {
	return /^\s*[[{]/.test(source)
}

export function parseDocument(raw: string): ParseResult {
	// BOM из файлов, сохранённых в Windows, ломает JSON.parse.
	const source = raw.replace(/^﻿/, '')

	let jsonFailed = false
	try {
		const data = JSON.parse(source)
		const warnings = hasUnsafeIntegers(source)
			? [
					'В документе есть целые числа длиннее 15–16 цифр. В результате они округлены: такие ID лучше хранить строками.'
				]
			: []
		return { ok: true, data, format: 'json', warnings }
	} catch {
		jsonFailed = true
	}

	const jsonError = () => {
		const found = findJsonError(source)
		const position = found?.position ?? 0
		return {
			ok: false as const,
			error: {
				format: 'json' as const,
				message: found?.message ?? 'Ошибка в JSON',
				position,
				...lineAndColumn(source, position)
			}
		}
	}

	if (jsonFailed && looksLikeJson(source)) return jsonError()

	try {
		const data = loadYAML(source)
		// Скаляр («просто текст») YAML разбирает успешно, но это не документ,
		// а сломанный JSON или случайный текст.
		if (data === null || typeof data !== 'object') return jsonError()
		return { ok: true, data, format: 'yaml', warnings: [] }
	} catch (error) {
		// Текст с «ключ: значение» на строках это явно YAML, показываем его ошибку.
		if (error instanceof YAMLException && /^\s*[\w"'-][^\n]*:/m.test(source)) {
			const mark = error.mark as { position?: number } | undefined
			const position = Math.min(mark?.position ?? 0, source.length)
			return {
				ok: false,
				error: {
					format: 'yaml',
					message: `Ошибка в YAML: ${error.reason}`,
					position,
					...lineAndColumn(source, position)
				}
			}
		}
		return jsonError()
	}
}

export interface JsonStructure {
	objects: number
	arrays: number
	strings: number
	numbers: number
	booleans: number
	nulls: number
	totalKeys: number
	maxDepth: number
}

export function analyzeStructure(data: unknown): JsonStructure {
	const s: JsonStructure = {
		objects: 0,
		arrays: 0,
		strings: 0,
		numbers: 0,
		booleans: 0,
		nulls: 0,
		totalKeys: 0,
		maxDepth: 0
	}
	const walk = (node: unknown, depth: number) => {
		if (node === null) s.nulls++
		else if (typeof node === 'boolean') s.booleans++
		else if (typeof node === 'number') s.numbers++
		else if (typeof node === 'string') s.strings++
		else if (Array.isArray(node)) {
			s.arrays++
			s.maxDepth = Math.max(s.maxDepth, depth + 1)
			node.forEach(item => walk(item, depth + 1))
		} else if (typeof node === 'object') {
			s.objects++
			s.maxDepth = Math.max(s.maxDepth, depth + 1)
			const values = Object.values(node as Record<string, unknown>)
			s.totalKeys += values.length
			values.forEach(item => walk(item, depth + 1))
		}
	}
	walk(data, 0)
	return s
}

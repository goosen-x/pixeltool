/**
 * Проверка синтаксиса JavaScript настоящим парсером (acorn + acorn-jsx).
 *
 * Раньше инструмент проверял код через `new Function`, и это не работало:
 * import/export и JSX падали всегда, номер строки всегда был 1:1, а сообщения
 * шли от движка браузера по-английски. acorn даёт точную позицию ошибки,
 * умеет ES-модули, JSX и разные версии языка.
 *
 * Код не выполняется, только разбирается.
 */

import { Parser, type Options, type Token as AcornToken } from 'acorn'

/** В типах acorn у токена нет value, хотя в рантайме оно есть. */
type Token = AcornToken & { value?: unknown }
import jsx from 'acorn-jsx'

export type JsVersion = 'es5' | 'es6' | 'es2020' | 'latest'

export interface JsSyntaxError {
	/** Сообщение по-русски. */
	message: string
	/** Исходное сообщение парсера, без позиции. */
	raw: string
	/** Строка с 1. */
	line: number
	/** Столбец с 1. */
	column: number
	/** Смещение от начала кода, для перевода курсора. */
	offset: number
	/** Подсказка, что поправить. */
	hint?: string
}

export interface JsStats {
	functions: number
	variables: number
	classes: number
	imports: number
	exports: number
}

export interface JsCheckResult {
	valid: boolean
	error?: JsSyntaxError
	/** Код разобран как ES-модуль (есть import/export или await вне функций). */
	module: boolean
	warnings: string[]
	stats?: JsStats
}

const JsxParser = Parser.extend(jsx())

const ECMA: Record<JsVersion, Options['ecmaVersion']> = {
	es5: 5,
	es6: 2015,
	es2020: 2020,
	latest: 'latest'
}

const KEYWORDS = [
	'function',
	'return',
	'const',
	'let',
	'var',
	'if',
	'else',
	'for',
	'while',
	'switch',
	'case',
	'break',
	'continue',
	'class',
	'extends',
	'import',
	'export',
	'default',
	'async',
	'await',
	'try',
	'catch',
	'finally',
	'throw',
	'typeof',
	'instanceof',
	'new',
	'delete'
]

interface ParseError extends Error {
	pos: number
	loc?: { line: number; column: number }
}

function parse(code: string, version: JsVersion, module: boolean) {
	return JsxParser.parse(code, {
		ecmaVersion: ECMA[version],
		sourceType: module ? 'module' : 'script',
		locations: true
	})
}

/** Переводит сообщение acorn на русский. */
function translate(raw: string): string {
	const rules: [RegExp, (m: RegExpMatchArray) => string][] = [
		[/^Unexpected token$/, () => 'Неожиданный символ'],
		[/^Unexpected character '(.+)'$/, m => `Недопустимый символ «${m[1]}»`],
		[/^Unterminated string constant$/, () => 'Строка не закрыта кавычкой'],
		[
			/^Unterminated template$/,
			() => 'Шаблонная строка не закрыта обратной кавычкой `'
		],
		[/^Unterminated comment$/, () => 'Комментарий /* не закрыт */'],
		[
			/^Unterminated regular expression$/,
			() => 'Регулярное выражение не закрыто /'
		],
		[
			/^Invalid regular expression flag$/,
			() => 'Неизвестный флаг регулярного выражения'
		],
		[
			/^Invalid regular expression: (.+)$/,
			m => `Ошибка в регулярном выражении: ${m[1]}`
		],
		[
			/^Identifier '(.+)' has already been declared$/,
			m => `Переменная «${m[1]}» уже объявлена`
		],
		[
			/^'import' and 'export' may appear only with 'sourceType: module'$/,
			() => 'import и export допустимы только на верхнем уровне модуля'
		],
		[/^'return' outside of function$/, () => 'return вне функции'],
		[/^Unsyntactic break$/, () => 'break вне цикла или switch'],
		[/^Unsyntactic continue$/, () => 'continue вне цикла'],
		[
			/^Assigning to rvalue$/,
			() => 'Слева от = стоит то, чему нельзя присвоить значение'
		],
		[
			/^The keyword '(.+)' is reserved$/,
			m => `Слово «${m[1]}» в этой версии JavaScript зарезервировано`
		],
		[
			/^Unexpected keyword '(.+)'$/,
			m => `Ключевое слово «${m[1]}» здесь не к месту`
		],
		[
			/^Unexpected reserved word$/,
			() => 'Зарезервированное слово здесь не к месту'
		],
		[
			/^'with' in strict mode$/,
			() => 'with запрещён в строгом режиме и в модулях'
		],
		[
			/^Expected corresponding JSX closing tag for (.+)$/,
			m => `Закрывающий тег не совпадает с открывающим ${m[1]}`
		],
		[/^Unterminated JSX contents$/, () => 'JSX-тег не закрыт'],
		[
			/^Private field '(.+)' must be declared in an enclosing class$/,
			m => `Приватное поле «${m[1]}» не объявлено в классе`
		],
		[
			/^Cannot use keyword 'await' outside an async function$/,
			() => 'await вне async-функции'
		],
		[
			/^Octal literal in strict mode$/,
			() => 'Восьмеричное число вида 0123 запрещено в строгом режиме'
		],
		[
			/^Comma is not permitted after the rest element$/,
			() => 'После ...rest не может быть запятой'
		],
		[/^Missing initializer in const declaration$/, () => 'У const нет значения']
	]
	for (const [re, fn] of rules) {
		const m = raw.match(re)
		if (m) return fn(m)
	}
	return raw
}

/** Расстояние Левенштейна, для подсказки об опечатке в ключевом слове. */
function distance(a: string, b: string): number {
	const dp = Array.from({ length: b.length + 1 }, (_, i) => i)
	for (let i = 1; i <= a.length; i++) {
		let prev = dp[0]
		dp[0] = i
		for (let j = 1; j <= b.length; j++) {
			const tmp = dp[j]
			dp[j] = Math.min(
				dp[j] + 1,
				dp[j - 1] + 1,
				prev + (a[i - 1] === b[j - 1] ? 0 : 1)
			)
			prev = tmp
		}
	}
	return dp[b.length]
}

function typoHint(code: string, offset: number): string | undefined {
	// Слова на строке ошибки до её места: «fucntion f()» ломается на «f»,
	// а виновато слово перед ним.
	const lineStart = code.lastIndexOf('\n', offset - 1) + 1
	const words = code.slice(lineStart, offset + 1).match(/[A-Za-z]+/g) ?? []
	for (const word of words.reverse()) {
		if (KEYWORDS.includes(word) || word.length < 4) continue
		const kw = KEYWORDS.find(
			k => Math.abs(k.length - word.length) <= 1 && distance(word, k) <= 2
		)
		if (kw) return `Похоже на опечатку: «${word}» вместо «${kw}».`
	}
	return undefined
}

function unexpectedTokenHint(code: string, offset: number): string {
	if (offset >= code.trimEnd().length) {
		return 'Код оборвался раньше времени: проверьте, все ли скобки и кавычки закрыты.'
	}
	const typo = typoHint(code, offset)
	if (typo) return typo

	const lineStart = code.lastIndexOf('\n', offset - 1) + 1
	const before = code.slice(lineStart, offset)
	const opened =
		(before.match(/\(/g) ?? []).length - (before.match(/\)/g) ?? []).length
	if (opened > 0) return 'В этой строке не закрыта круглая скобка «(».'

	const ch = code[offset]
	if (ch === '}' || ch === ')' || ch === ']') {
		return `Лишняя «${ch}» или не хватает открывающей пары выше.`
	}
	return `Парсер не ожидал «${code.slice(offset).match(/^\S+/)?.[0] ?? ch}» в этом месте. Обычно перед ним пропущена запятая, скобка или оператор.`
}

function toError(e: unknown, code: string): JsSyntaxError {
	const err = e as ParseError
	const raw = String(err.message).replace(/\s*\(\d+:\d+\)$/, '')
	const offset = typeof err.pos === 'number' ? err.pos : 0
	const line = err.loc?.line ?? 1
	const column = (err.loc?.column ?? 0) + 1
	let hint: string | undefined
	if (raw === 'Unexpected token') hint = unexpectedTokenHint(code, offset)
	else if (raw === 'Unterminated string constant')
		hint =
			'Строка не переносится на новую строку. Для многострочного текста используйте `обратные кавычки`.'
	else if (/^Identifier/.test(raw))
		hint =
			'Одно имя нельзя объявить дважды через let, const, class или import в одной области видимости. Уберите повтор или переименуйте.'
	let message = translate(raw)
	const token = code.slice(offset).match(/^[\w$]+|^\S/)?.[0]
	if (raw === 'Unexpected token' && token) message += ` «${token}»`
	else if (raw === 'Unexpected token') message = 'Код неожиданно закончился'
	return { message, raw, line, column, offset, hint }
}

function tryParse(code: string, version: JsVersion) {
	try {
		return { ast: parse(code, version, false), module: false }
	} catch (scriptErr) {
		try {
			return { ast: parse(code, version, true), module: true }
		} catch (moduleErr) {
			// Обе попытки упали: показываем ту, что продвинулась дальше. Для кода
			// с import это ошибка модуля, а не «import только в модулях».
			const s = (scriptErr as ParseError).pos ?? 0
			const m = (moduleErr as ParseError).pos ?? 0
			return { error: m > s ? moduleErr : scriptErr }
		}
	}
}

function countStats(ast: unknown): JsStats {
	const stats: JsStats = {
		functions: 0,
		variables: 0,
		classes: 0,
		imports: 0,
		exports: 0
	}
	const stack: unknown[] = [ast]
	while (stack.length) {
		const node = stack.pop()
		if (!node || typeof node !== 'object') continue
		if (Array.isArray(node)) {
			stack.push(...node)
			continue
		}
		const type = (node as { type?: string }).type
		switch (type) {
			case 'FunctionDeclaration':
			case 'FunctionExpression':
			case 'ArrowFunctionExpression':
				stats.functions++
				break
			case 'VariableDeclarator':
				stats.variables++
				break
			case 'ClassDeclaration':
			case 'ClassExpression':
				stats.classes++
				break
			case 'ImportDeclaration':
				stats.imports++
				break
			case 'ExportNamedDeclaration':
			case 'ExportDefaultDeclaration':
			case 'ExportAllDeclaration':
				stats.exports++
				break
		}
		for (const [key, value] of Object.entries(node)) {
			if (key === 'loc') continue
			if (value && typeof value === 'object') stack.push(value)
		}
	}
	return stats
}

/** Предупреждения по токенам, чтобы не реагировать на текст в строках и комментариях. */
function collectWarnings(code: string, module: boolean): string[] {
	const tokens: Token[] = []
	try {
		for (const t of JsxParser.tokenizer(code, {
			ecmaVersion: 'latest',
			sourceType: module ? 'module' : 'script'
		}))
			tokens.push(t)
	} catch {
		// Токенизатор без JSX может споткнуться о разметку, тогда без предупреждений.
		return []
	}
	const warnings: string[] = []
	const has = (pred: (t: Token, i: number) => boolean) => tokens.some(pred)

	if (
		has(
			(t, i) =>
				t.value === 'console' &&
				tokens[i + 1]?.type.label === '.' &&
				tokens[i + 2]?.value === 'log'
		)
	)
		warnings.push('Есть console.log: не забудьте убрать перед публикацией.')
	if (has(t => t.type.keyword === 'debugger'))
		warnings.push(
			'Есть debugger: код остановится, если открыты инструменты разработчика.'
		)
	if (has(t => t.type.keyword === 'var'))
		warnings.push(
			'Есть var: в современном коде вместо него обычно пишут let или const.'
		)
	if (
		has(
			t =>
				t.type.label === '==/!=/===/!==' &&
				(t.value === '==' || t.value === '!=')
		)
	)
		warnings.push(
			'Есть == или !=: они приводят типы (0 == "" даёт true), надёжнее === и !==.'
		)
	return warnings
}

export function checkJsSyntax(
	code: string,
	version: JsVersion = 'latest'
): JsCheckResult {
	const parsed = tryParse(code, version)

	if ('error' in parsed) {
		const error = toError(parsed.error, code)
		if (version !== 'latest' && !('error' in tryParse(code, 'latest'))) {
			error.hint =
				`Этот синтаксис появился после ${version.toUpperCase()}. ` +
				'Если код не должен работать в старых браузерах, выберите «Latest».'
		}
		return { valid: false, error, module: false, warnings: [] }
	}

	return {
		valid: true,
		module: parsed.module,
		warnings: collectWarnings(code, parsed.module),
		stats: countStats(parsed.ast)
	}
}

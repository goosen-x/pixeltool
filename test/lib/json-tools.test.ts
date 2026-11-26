import { describe, expect, it } from 'vitest'
import {
	analyzeStructure,
	findJsonError,
	parseDocument
} from '@/lib/json-tools'

const errorOf = (source: string) => {
	const result = parseDocument(source)
	if (result.ok) throw new Error(`ожидалась ошибка для ${source}`)
	return result.error
}

describe('parseDocument: сломанный JSON не выдаётся за корректный', () => {
	it.each([
		['{"a": 1,}', 'Лишняя запятая перед }', 9],
		['[1, 2,]', 'Лишняя запятая перед ]', 7],
		["{'a': 1}", 'Одинарные кавычки', 2],
		['{a: 1}', 'Ключ нужно взять в двойные кавычки', 2],
		['{"a": undefined}', 'undefined', 7],
		['{"a": NaN}', 'NaN', 7],
		['{"a": 01}', 'не может начинаться с нуля', 7],
		['{"a": True}', 'строчными буквами: true', 7],
		['{"a": 1 "b": 2}', 'Пропущена запятая', 9],
		['{"a": 1}}', 'лишние символы', 9],
		['// комментарий\n{"a": 1}', 'Комментарии', 1]
	])('%s', (source, message, column) => {
		const error = errorOf(source)
		expect(error.format).toBe('json')
		expect(error.message).toContain(message)
		expect(error.column).toBe(column)
	})

	it('незакрытая скобка указывает строку открытия', () => {
		const error = errorOf('{\n  "a": [1, 2\n}')
		expect(error.message).toBe('Массив закрыт фигурной скобкой, нужна ]')
		expect(error.line).toBe(3)

		const cut = errorOf('{\n  "a": 1')
		expect(cut.message).toContain('открытая в строке 1')
	})

	it('строка и столбец на многострочном документе', () => {
		const error = errorOf('{\n  "name": "Анна",\n  "age": 30,\n}')
		expect(error).toMatchObject({ line: 4, column: 1, lineText: '}' })
	})

	it('таб внутри строки', () => {
		expect(errorOf('{"a": "x\ty"}').message).toContain('Управляющий символ')
	})
})

describe('parseDocument: корректные документы', () => {
	it('JSON', () => {
		const result = parseDocument('{"a": [1, 2.5e3, true, null, "\\u0410"]}')
		expect(result).toMatchObject({
			ok: true,
			format: 'json',
			data: { a: [1, 2500, true, null, 'А'] }
		})
	})

	it('BOM в начале файла не мешает', () => {
		expect(parseDocument('﻿{"a": 1}')).toMatchObject({ ok: true })
	})

	it('YAML распознаётся как YAML', () => {
		const result = parseDocument('name: Анна\nage: 30\ntags:\n  - a\n  - b')
		expect(result).toMatchObject({
			ok: true,
			format: 'yaml',
			data: { name: 'Анна', age: 30, tags: ['a', 'b'] }
		})
	})

	it('ошибка в YAML показывается как ошибка YAML', () => {
		const error = errorOf('name: Анна\n  age: 30')
		expect(error.format).toBe('yaml')
		expect(error.line).toBe(2)
	})

	it('обычный текст не считается документом', () => {
		expect(errorOf('привет').format).toBe('json')
	})
})

describe('findJsonError согласован с JSON.parse', () => {
	it.each([
		'{}',
		'[]',
		'"строка"',
		'-0.5e-10',
		'{"a":{"b":[{"c":"\\"\\\\\\/\\b\\f\\n\\r\\t"}]}}',
		' \n[1 , 2]\n '
	])('корректно: %s', source => {
		expect(() => JSON.parse(source)).not.toThrow()
		expect(findJsonError(source)).toBeNull()
	})

	it.each([
		'',
		'[',
		'{"a"}',
		'{"a":}',
		'[1,,2]',
		'"\\x"',
		'1.',
		'-',
		'{"a":1]'
	])('ошибка: %j', source => {
		expect(() => JSON.parse(source)).toThrow()
		expect(findJsonError(source)).not.toBeNull()
	})
})

describe('предупреждения и структура', () => {
	it('предупреждает об округлении длинных целых', () => {
		const result = parseDocument('{"id": 12345678901234567890}')
		expect(result.ok && result.warnings.length).toBe(1)
		const plain = parseDocument('{"id": 123, "x": 1.5}')
		expect(plain.ok && plain.warnings).toEqual([])
	})

	it('считает узлы и глубину', () => {
		expect(analyzeStructure({ a: [1, 'x', { b: null }], c: false })).toEqual({
			objects: 2,
			arrays: 1,
			strings: 1,
			numbers: 1,
			booleans: 1,
			nulls: 1,
			totalKeys: 3,
			maxDepth: 3
		})
	})
})

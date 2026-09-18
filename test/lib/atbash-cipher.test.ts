import { describe, it, expect } from 'vitest'
import {
	ATBASH_ALPHABETS,
	atbashTransform,
	detectAlphabet,
	hasForeignLetters
} from '@/lib/utils/atbash-cipher'

describe('атбаш: базовое зеркалирование', () => {
	it('меняет местами первую и последнюю буквы латиницы', () => {
		expect(atbashTransform('A', 'latin')).toBe('Z')
		expect(atbashTransform('Z', 'latin')).toBe('A')
	})

	it('меняет местами первую и последнюю буквы кириллицы', () => {
		expect(atbashTransform('А', 'cyrillic')).toBe('Я')
		expect(atbashTransform('Я', 'cyrillic')).toBe('А')
	})

	it('среднюю букву алфавита с нечётной длиной оставляет на месте', () => {
		// В латинице (26 букв) середины нет, в кириллице (33 буквы) есть:
		// буква номер 16 (с нуля, считая от А) — «П», зеркало 32-16=16, сама себя
		expect(ATBASH_ALPHABETS.cyrillic[16]).toBe('П')
		expect(atbashTransform('П', 'cyrillic')).toBe('П')
	})
})

describe('atbashTransform', () => {
	it('шифрует латиницу классическим примером HELLO → SVOOL', () => {
		expect(atbashTransform('HELLO', 'latin')).toBe('SVOOL')
	})

	it('шифрует кириллицу', () => {
		expect(atbashTransform('ПРИВЕТ', 'cyrillic')).toBe('ПОЦЭЪМ')
	})

	it('сохраняет регистр', () => {
		expect(atbashTransform('Hello', 'latin')).toBe('Svool')
		expect(atbashTransform('Привет', 'cyrillic')).toBe('Поцэъм')
	})

	it('не трогает цифры, пробелы и знаки препинания', () => {
		expect(atbashTransform('Hello, World! 123', 'latin')).toBe(
			'Svool, Dliow! 123'
		)
	})

	it('самообратен: применить дважды — вернуть исходный текст', () => {
		const original = 'Съешь ещё этих мягких французских булок'
		const once = atbashTransform(original, 'cyrillic')
		const twice = atbashTransform(once, 'cyrillic')
		expect(twice).toBe(original)
	})

	it('пустая строка даёт пустую строку', () => {
		expect(atbashTransform('', 'latin')).toBe('')
	})
})

describe('алфавиты переиспользованы из шифра Цезаря', () => {
	it('латиница из 26 букв, кириллица из 33 — вместе с Ё', () => {
		expect(ATBASH_ALPHABETS.latin.length).toBe(26)
		expect(ATBASH_ALPHABETS.cyrillic.length).toBe(33)
		expect(ATBASH_ALPHABETS.cyrillic).toContain('Ё')
	})
})

describe('вспомогательные функции определения алфавита', () => {
	it('detectAlphabet отличает кириллицу от латиницы', () => {
		expect(detectAlphabet('привет', 'latin')).toBe('cyrillic')
		expect(detectAlphabet('hello', 'cyrillic')).toBe('latin')
	})

	it('hasForeignLetters находит буквы не из выбранного алфавита', () => {
		expect(hasForeignLetters('hello мир', 'latin')).toBe(true)
		expect(hasForeignLetters('hello world', 'latin')).toBe(false)
	})
})

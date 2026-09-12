import { describe, it, expect } from 'vitest'
import {
	CAESAR_ALPHABETS,
	alphabetSize,
	caesarBruteForce,
	caesarShift,
	decryptCaesar,
	detectAlphabet,
	encryptCaesar,
	hasForeignLetters,
	normalizeShift
} from '@/lib/utils/caesar-cipher'

describe('алфавиты', () => {
	it('латиница из 26 букв, кириллица из 33 — вместе с Ё', () => {
		expect(alphabetSize('latin')).toBe(26)
		expect(alphabetSize('cyrillic')).toBe(33)
		expect(CAESAR_ALPHABETS.cyrillic).toContain('Ё')
	})

	it('в алфавитах нет повторов', () => {
		for (const alphabet of Object.values(CAESAR_ALPHABETS)) {
			expect(new Set(alphabet).size).toBe(alphabet.length)
		}
	})
})

describe('normalizeShift', () => {
	it('приводит отрицательный сдвиг к положительному', () => {
		expect(normalizeShift(-3, 'latin')).toBe(23)
		expect(normalizeShift(-3, 'cyrillic')).toBe(30)
	})

	it('полный оборот равен нулю', () => {
		expect(normalizeShift(26, 'latin')).toBe(0)
		expect(normalizeShift(33, 'cyrillic')).toBe(0)
		expect(normalizeShift(29, 'latin')).toBe(3)
	})
})

describe('encryptCaesar', () => {
	// Сдвиг на три позиции — тот самый, которым, по «Жизни двенадцати цезарей»
	// Светония, пользовался Гай Юлий Цезарь в переписке
	it('шифрует латиницу классическим сдвигом 3', () => {
		expect(encryptCaesar('VENI VIDI VICI', 3, 'latin')).toBe('YHQL YLGL YLFL')
	})

	it('переносит конец алфавита в начало', () => {
		expect(encryptCaesar('XYZ', 3, 'latin')).toBe('ABC')
		expect(encryptCaesar('ЭЮЯ', 3, 'cyrillic')).toBe('АБВ')
	})

	it('шифрует кириллицу', () => {
		expect(encryptCaesar('ПРИВЕТ', 3, 'cyrillic')).toBe('ТУЛЕЗХ')
	})

	it('сохраняет регистр', () => {
		expect(encryptCaesar('Привет', 3, 'cyrillic')).toBe('Тулезх')
		expect(encryptCaesar('Hello', 3, 'latin')).toBe('Khoor')
	})

	it('ROT13 — это сдвиг на половину латинского алфавита', () => {
		expect(encryptCaesar('Hello, World!', 13, 'latin')).toBe('Uryyb, Jbeyq!')
	})

	it('пробелы, цифры и знаки не трогает', () => {
		expect(encryptCaesar('a-b 1!', 1, 'latin')).toBe('b-c 1!')
	})

	it('буквы чужого алфавита проходят насквозь', () => {
		expect(encryptCaesar('ABC АБВ', 1, 'latin')).toBe('BCD АБВ')
		expect(encryptCaesar('ABC АБВ', 1, 'cyrillic')).toBe('ABC БВГ')
	})

	it('нулевой сдвиг и полный оборот оставляют текст как есть', () => {
		expect(encryptCaesar('Привет', 0, 'cyrillic')).toBe('Привет')
		expect(encryptCaesar('Привет', 33, 'cyrillic')).toBe('Привет')
		expect(encryptCaesar('Hello', 26, 'latin')).toBe('Hello')
	})

	it('пустая строка даёт пустой результат', () => {
		expect(encryptCaesar('', 5, 'latin')).toBe('')
	})
})

describe('decryptCaesar', () => {
	it('возвращает исходный текст при том же ключе', () => {
		const source = 'Съешь же ещё этих мягких французских булок, да выпей чаю'
		for (let shift = 0; shift < 33; shift++) {
			expect(
				decryptCaesar(
					encryptCaesar(source, shift, 'cyrillic'),
					shift,
					'cyrillic'
				)
			).toBe(source)
		}
	})

	it('расшифровка — это сдвиг в обратную сторону', () => {
		expect(decryptCaesar('YHQL', 3, 'latin')).toBe(
			caesarShift('YHQL', -3, 'latin')
		)
		expect(decryptCaesar('ТУЛЕЗХ', 3, 'cyrillic')).toBe('ПРИВЕТ')
	})

	it('ROT13 обратен самому себе', () => {
		expect(encryptCaesar('Uryyb', 13, 'latin')).toBe('Hello')
	})
})

describe('caesarBruteForce', () => {
	it('перебирает все ключи, кроме нулевого', () => {
		expect(caesarBruteForce('ABC', 'latin')).toHaveLength(25)
		expect(caesarBruteForce('АБВ', 'cyrillic')).toHaveLength(32)
	})

	it('среди вариантов есть верный', () => {
		const guesses = caesarBruteForce('ТУЛЕЗХ', 'cyrillic')
		expect(guesses.find(guess => guess.shift === 3)?.text).toBe('ПРИВЕТ')
	})

	it('ключи идут подряд от 1', () => {
		const guesses = caesarBruteForce('ABC', 'latin')
		expect(guesses.map(guess => guess.shift)).toEqual(
			Array.from({ length: 25 }, (_, index) => index + 1)
		)
	})
})

describe('detectAlphabet', () => {
	it('переключается на кириллицу, когда её больше', () => {
		expect(detectAlphabet('Привет', 'latin')).toBe('cyrillic')
	})

	it('переключается на латиницу, когда её больше', () => {
		expect(detectAlphabet('Hello', 'cyrillic')).toBe('latin')
	})

	it('при ничьей оставляет выбранный алфавит', () => {
		expect(detectAlphabet('', 'latin')).toBe('latin')
		expect(detectAlphabet('12345', 'cyrillic')).toBe('cyrillic')
		expect(detectAlphabet('ab аб', 'cyrillic')).toBe('cyrillic')
	})
})

describe('hasForeignLetters', () => {
	it('замечает буквы, которые останутся нетронутыми', () => {
		expect(hasForeignLetters('ABC АБВ', 'latin')).toBe(true)
		expect(hasForeignLetters('ABC АБВ', 'cyrillic')).toBe(true)
		expect(hasForeignLetters('ABC 123', 'latin')).toBe(false)
		expect(hasForeignLetters('АБВ, да!', 'cyrillic')).toBe(false)
	})

	it('повторный вызов даёт тот же ответ', () => {
		expect(hasForeignLetters('ABC', 'cyrillic')).toBe(true)
		expect(hasForeignLetters('ABC', 'cyrillic')).toBe(true)
	})
})

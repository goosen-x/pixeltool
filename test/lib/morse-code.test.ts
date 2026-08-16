import { describe, it, expect } from 'vitest'
import { textToMorse, morseToText } from '@/lib/utils/morse-code'

describe('textToMorse', () => {
	it('конвертирует английский текст', () => {
		expect(textToMorse('SOS', 'en')).toBe('... --- ...')
	})

	it('конвертирует русский текст', () => {
		expect(textToMorse('ПРИВЕТ', 'ru')).toBe('.--. .-. .. .-- . -')
	})

	it('регистр не важен', () => {
		expect(textToMorse('sos', 'en')).toBe(textToMorse('SOS', 'en'))
	})

	it('разделяет слова через « / »', () => {
		expect(textToMorse('HI YOU', 'en')).toBe('.... .. / -.-- --- ..-')
	})

	it('цифры общие для обоих языков', () => {
		expect(textToMorse('123', 'en')).toBe('.---- ..--- ...--')
		expect(textToMorse('123', 'ru')).toBe('.---- ..--- ...--')
	})

	it('неизвестные символы пропускаются', () => {
		expect(textToMorse('A#B', 'en')).toBe('.- -...')
	})

	it('пустая строка даёт пустой результат', () => {
		expect(textToMorse('', 'en')).toBe('')
	})
})

describe('morseToText', () => {
	it('конвертирует морзе в английский текст', () => {
		expect(morseToText('... --- ...', 'en')).toBe('SOS')
	})

	it('конвертирует морзе в русский текст', () => {
		expect(morseToText('.--. .-. .. .-- . -', 'ru')).toBe('ПРИВЕТ')
	})

	it('« / » восстанавливает пробел между словами', () => {
		expect(morseToText('.... .. / -.-- --- ..-', 'en')).toBe('HI YOU')
	})

	it('лишние пробелы между символами не мешают разбору', () => {
		expect(morseToText('...   ---   ...', 'en')).toBe('SOS')
	})

	it('неизвестный код превращается в "?"', () => {
		expect(morseToText('... .-.-.-.-.-', 'en')).toBe('S?')
	})

	it('round-trip: текст → морзе → текст', () => {
		const original = 'HELLO WORLD'
		expect(morseToText(textToMorse(original, 'en'), 'en')).toBe(original)
	})
})

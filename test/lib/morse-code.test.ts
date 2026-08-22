import { describe, it, expect } from 'vitest'
import {
	textToMorse,
	morseToText,
	detectTextLang,
	detectMorseLang
} from '@/lib/utils/morse-code'

describe('textToMorse', () => {
	it('конвертирует английский текст', () => {
		expect(textToMorse('SOS')).toBe('... --- ...')
	})

	it('конвертирует русский текст', () => {
		expect(textToMorse('ПРИВЕТ')).toBe('.--. .-. .. .-- . -')
	})

	it('регистр не важен', () => {
		expect(textToMorse('sos')).toBe(textToMorse('SOS'))
	})

	it('разделяет слова через « / »', () => {
		expect(textToMorse('HI YOU')).toBe('.... .. / -.-- --- ..-')
	})

	it('цифры общие для обоих языков', () => {
		expect(textToMorse('123')).toBe('.---- ..--- ...--')
	})

	it('неизвестные символы пропускаются', () => {
		expect(textToMorse('A#B')).toBe('.- -...')
	})

	it('пустая строка даёт пустой результат', () => {
		expect(textToMorse('')).toBe('')
	})

	it('смешанный текст кодирует обе части без потерь', () => {
		expect(textToMorse('HI ПРИВЕТ')).toBe(
			'.... .. / .--. .-. .. .-- . -'
		)
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
		expect(morseToText(textToMorse(original), 'en')).toBe(original)
	})
})

describe('detectTextLang', () => {
	it('определяет русский по кириллице', () => {
		expect(detectTextLang('Привет', 'en')).toBe('ru')
	})

	it('определяет английский по латинице', () => {
		expect(detectTextLang('Hello', 'ru')).toBe('en')
	})

	it('на цифрах без букв оставляет текущий язык', () => {
		expect(detectTextLang('123', 'ru')).toBe('ru')
		expect(detectTextLang('123', 'en')).toBe('en')
	})

	it('на смешанном тексте побеждает большинство букв', () => {
		expect(detectTextLang('Hi Привет', 'en')).toBe('ru')
	})
})

describe('detectMorseLang', () => {
	// Русская таблица — надмножество английской: все 26 кодов латинских букв
	// одновременно валидны и как русские (просто означают другую букву), а
	// у русской есть ещё 6 уникальных кодов (Я, Ч, Ш, Ъ, Э, Ю). Поэтому
	// «доказать» английский через отсутствие «?» невозможно в принципе —
	// только русский, через код, которого в английской таблице просто нет.
	it('уникальный русский код перевешивает даже при текущем en', () => {
		expect(detectMorseLang('.-.-', 'en')).toBe('ru') // Я
	})

	it('код, общий для обеих таблиц, оставляет текущий язык', () => {
		expect(detectMorseLang('... --- ...', 'en')).toBe('en') // SOS = ССС
		expect(detectMorseLang('... --- ...', 'ru')).toBe('ru')
	})

	it('на равном числе "?" оставляет текущий язык', () => {
		expect(detectMorseLang('.---- ..--- ...--', 'ru')).toBe('ru')
		expect(detectMorseLang('.---- ..--- ...--', 'en')).toBe('en')
	})
})

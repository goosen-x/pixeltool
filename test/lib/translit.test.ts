import { describe, expect, it } from 'vitest'
import {
	RUSSIAN_ALPHABET,
	TABLES,
	convert,
	toSlug,
	transliterate
} from '@/lib/translit'

describe('таблицы', () => {
	it('в каждой схеме есть все 33 буквы', () => {
		for (const table of Object.values(TABLES)) {
			for (const letter of RUSSIAN_ALPHABET) {
				expect(table[letter], letter).toBeDefined()
			}
		}
		expect(RUSSIAN_ALPHABET).toHaveLength(33)
	})

	// Приложение к приказу МВД России от 31.12.2019 № 996 (garant.ru,
	// документ 73680659): строки 7, 12, 24, 25, 28, 30, 32, 33.
	it('загранпаспорт совпадает с таблицей приказа МВД № 996', () => {
		const t = TABLES.passport
		expect([
			t['ё'],
			t['й'],
			t['х'],
			t['ц'],
			t['щ'],
			t['ъ'],
			t['ю'],
			t['я']
		]).toEqual(['e', 'i', 'kh', 'ts', 'shch', 'ie', 'iu', 'ia'])
		expect(t['ь']).toBe('')
	})
})

describe('загранпаспорт', () => {
	it('Юлия → IULIIA, как в новых загранпаспортах', () => {
		expect(convert('Юлия', 'passport', { uppercase: true })).toBe('IULIIA')
	})

	it('ФИО целиком', () => {
		expect(convert('Щукин Пётр Ильич', 'passport', { uppercase: true })).toBe(
			'SHCHUKIN PETR ILICH'
		)
		expect(transliterate('Подъячев Хабибуллин', 'passport')).toBe(
			'Podieiachev Khabibullin'
		)
	})

	it('Й и Ы', () => {
		expect(transliterate('Андрей Рыжов', 'passport')).toBe('Andrei Ryzhov')
	})
})

describe('ГОСТ 7.79-2000, система Б', () => {
	it('ц: c перед i, e, y, j, иначе cz', () => {
		expect(transliterate('цирк', 'gost')).toBe('cirk')
		expect(transliterate('цех', 'gost')).toBe('cex')
		expect(transliterate('цыплёнок', 'gost')).toBe('cy`plyonok')
		expect(transliterate('лицо', 'gost')).toBe('liczo')
		expect(transliterate('конец', 'gost')).toBe('konecz')
		expect(transliterate('Цюрих', 'gost')).toBe('Cyurix')
	})

	it('знаки и буквы с грависом', () => {
		expect(transliterate('объём', 'gost')).toBe('ob``yom')
		expect(transliterate('мэр', 'gost')).toBe('me`r')
		expect(transliterate('щи', 'gost')).toBe('shhi')
		expect(transliterate('конь', 'gost')).toBe('kon`')
	})
})

describe('регистр', () => {
	it('заглавная многобуквенная замена в начале слова', () => {
		expect(transliterate('Щука', 'passport')).toBe('Shchuka')
		expect(transliterate('Жанна', 'gost')).toBe('Zhanna')
	})

	it('слово капсом остаётся капсом', () => {
		expect(transliterate('ЩУКА', 'passport')).toBe('SHCHUKA')
		expect(transliterate('ЮЛЯ', 'passport')).toBe('IULIA')
		expect(transliterate('ДОЖДЬ', 'passport')).toBe('DOZHD')
	})

	it('одиночная заглавная буква', () => {
		expect(transliterate('Я иду', 'gost')).toBe('Ya idu')
		expect(transliterate('Ю. Щ.', 'passport')).toBe('Iu. Shch.')
	})
})

describe('прочие символы', () => {
	it('латиница, цифры и переносы строк не трогаются', () => {
		expect(transliterate('iPhone 15\nи Мак', 'gost')).toBe('iPhone 15\ni Mak')
	})

	it('пустая строка', () => {
		expect(convert('', 'gost')).toBe('')
		expect(convert('', 'url')).toBe('')
	})
})

describe('адрес страницы', () => {
	it('заголовок в ЧПУ', () => {
		expect(toSlug('Как выбрать ламинат: 5 советов!')).toBe(
			'kak-vybrat-laminat-5-sovetov'
		)
		expect(toSlug('Щёлково, съезд — 2026')).toBe('schelkovo-sezd-2026')
		expect(toSlug('  Хорошая  цена  ')).toBe('horoshaya-cena')
	})

	it('построчно', () => {
		expect(convert('Привет мир\nЁжик', 'url')).toBe('privet-mir\nezhik')
	})

	it('строка без букв и цифр даёт пустой адрес', () => {
		expect(toSlug('— !!! —')).toBe('')
	})
})

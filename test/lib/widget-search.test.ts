import { describe, it, expect } from 'vitest'
import {
	searchWidgets,
	normalizeSearchText,
	switchKeyboardLayout
} from '@/lib/utils/widget-search'
import { publicWidgets } from '@/lib/constants/widgets'

/** Первый результат по запросу — удобнее читать в ожиданиях, чем массив. */
function top(query: string): string | undefined {
	return searchWidgets(publicWidgets, query)[0]?.id
}

function ids(query: string, limit = 5): string[] {
	return searchWidgets(publicWidgets, query, { limit }).map(w => w.id)
}

describe('normalizeSearchText', () => {
	it('приводит регистр и «ё» к «е»', () => {
		expect(normalizeSearchText('Счётчик')).toBe('счетчик')
	})

	it('пунктуация становится пробелом', () => {
		expect(normalizeSearchText('QR-код, генератор!')).toBe('qr код генератор')
	})
})

describe('switchKeyboardLayout', () => {
	it('перекладывает латиницу на кириллицу по клавишам', () => {
		expect(switchKeyboardLayout('gfhjkm')).toBe('пароль')
	})
})

describe('searchWidgets', () => {
	it('пустой запрос не даёт выдачи', () => {
		expect(searchWidgets(publicWidgets, '   ')).toEqual([])
	})

	it('находит инструмент по точному названию', () => {
		expect(top('генератор паролей')).toBe('password-generator')
	})

	it('порядок слов не важен', () => {
		// Ровно та поломка, из-за которой поиск считали сломанным: подстрока
		// целиком находилась только при том же порядке слов, что в заголовке.
		expect(top('паролей генератор')).toBe('password-generator')
	})

	it('находит по началу слова, а не только по целому слову', () => {
		expect(ids('парол')).toContain('password-generator')
	})

	it('«ё» и «е» взаимозаменяемы', () => {
		expect(ids('счетчик')).toEqual(ids('счётчик'))
		expect(ids('счетчик')).toContain('text-counter')
	})

	it('находит по тегу, которого нет в заголовке', () => {
		// В заголовке «Сумма прописью» слова «пропись» достаточно, а вот
		// латинского «base64» в русских заголовках не бывает вовсе.
		expect(ids('base64')).toContain('base64-encoder')
	})

	it('находит по описанию, если в заголовке слова нет', () => {
		const found = ids('морзе', 10)
		expect(found.length).toBeGreaterThan(0)
	})

	it('спасает забытую раскладку', () => {
		// «gfhjkm» — это «пароль», набранный в латинской раскладке.
		expect(top('gfhjkm')).toBe('password-generator')
	})

	it('несуществующий запрос даёт пустую выдачу, а не весь каталог', () => {
		expect(searchWidgets(publicWidgets, 'ъъъфывапролдж')).toEqual([])
	})

	it('слова из разных полей засчитываются вместе', () => {
		// «pdf» есть в названии категории и путях, «объединить» — в заголовке.
		expect(ids('объединить pdf')).toContain('merge-pdf')
	})

	it('limit ограничивает выдачу', () => {
		expect(
			searchWidgets(publicWidgets, 'калькулятор', { limit: 3 })
		).toHaveLength(3)
	})

	it('точное совпадение с началом заголовка идёт первым', () => {
		const found = searchWidgets(publicWidgets, 'конвертер валют')
		expect(found[0]?.id).toBe('currency-converter')
	})

	it('находит инструменты, которых не было в старом словаре поиска', () => {
		// Ради этого всё и затевалось: 103 из 119 инструментов раньше лежали
		// в глобальном поиске под сырым translationKey и не искались по-русски.
		expect(ids('телевизор')).toContain('tv-size')
		expect(ids('стакан')).toContain('grams-to-cups')
		expect(ids('затирка', 10)).toContain('tile-calculator')
	})

	it('каждый инструмент находится по своему полному названию', () => {
		// Страховка от того, чтобы какой-нибудь тул снова выпал из поиска.
		const missing: string[] = []
		for (const widget of publicWidgets) {
			const found = searchWidgets(publicWidgets, widget.title ?? '', {
				limit: 50
			})
			if (!found.some(w => w.id === widget.id)) missing.push(widget.id)
		}
		expect(missing).toEqual([])
	})
})

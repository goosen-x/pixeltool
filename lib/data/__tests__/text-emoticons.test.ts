import { describe, expect, it } from 'vitest'
import {
	EMOTICON_CATEGORIES,
	EMOTICON_LABELS,
	allEmoticons,
	searchEmoticons
} from '../text-emoticons'

const texts = (list: { text: string }[]) => list.map(e => e.text)

describe('text-emoticons: данные', () => {
	it('у каждого смайлика есть русская подпись', () => {
		for (const category of EMOTICON_CATEGORIES) {
			for (const emoticon of category.emoticons) {
				expect(EMOTICON_LABELS[emoticon.name], emoticon.text).toBeTruthy()
			}
		}
	})

	it('внутри одной категории смайлики не повторяются', () => {
		for (const category of EMOTICON_CATEGORIES) {
			const list = texts(category.emoticons)
			expect(new Set(list).size, category.id).toBe(list.length)
		}
	})

	it('«Все» показывает каждый смайлик один раз', () => {
		const list = texts(allEmoticons())
		expect(new Set(list).size).toBe(list.length)
		expect(list).toContain('ʕ•ᴥ•ʔ')
	})
})

describe('searchEmoticons', () => {
	it('пустой запрос отдаёт всю коллекцию', () => {
		expect(searchEmoticons('  ')).toEqual(allEmoticons())
	})

	it('находит по форме слова и синониму', () => {
		expect(texts(searchEmoticons('грустный'))).toContain('(╥﹏╥)')
		expect(texts(searchEmoticons('плачет'))).toContain('(T_T)')
		expect(texts(searchEmoticons('котик'))).toContain('(=^･ω･^=)')
		expect(texts(searchEmoticons('Сердечко'))).toContain('<3')
	})

	it('не путает ё и е', () => {
		expect(texts(searchEmoticons('весёлый'))).toEqual(
			texts(searchEmoticons('веселый'))
		)
	})

	it('злые не попадают в поиск котиков', () => {
		expect(texts(searchEmoticons('кот'))).not.toContain('(╬ಠ益ಠ)')
	})

	it('ищет по самим символам', () => {
		expect(texts(searchEmoticons('T_T'))).toContain('(T_T)')
		expect(texts(searchEmoticons('┻━┻')).length).toBeGreaterThan(0)
	})

	it('на бессмыслицу отдаёт пустой список', () => {
		expect(searchEmoticons('абырвалг')).toEqual([])
	})
})

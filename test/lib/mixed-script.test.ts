import { describe, it, expect } from 'vitest'
import {
	analyzeText,
	fixText,
	scriptOf,
	CYRILLIC_TO_LATIN,
	LATIN_TO_CYRILLIC
} from '@/lib/utils/mixed-script'

const fix = (text: string) => {
	const result = analyzeText(text)
	return fixText(text, result.issues)
}

describe('scriptOf', () => {
	it('различает алфавиты', () => {
		expect(scriptOf('а')).toBe('cyrillic')
		expect(scriptOf('a')).toBe('latin')
		expect(scriptOf('1')).toBeNull()
		expect(scriptOf(' ')).toBeNull()
	})
})

describe('analyzeText', () => {
	it('находит латинскую букву в русском слове', () => {
		const result = analyzeText('пaроль') // «a» латинская

		expect(result.issues).toHaveLength(1)
		expect(result.issues[0].char).toBe('a')
		expect(result.issues[0].from).toBe('latin')
		expect(result.issues[0].suggestion).toBe('а')
		expect(result.words[0].dominant).toBe('cyrillic')
	})

	it('находит кириллицу в латинском слове', () => {
		const result = analyzeText('pаssword') // «а» кириллическая

		expect(result.issues).toHaveLength(1)
		expect(result.issues[0].from).toBe('cyrillic')
		expect(result.issues[0].suggestion).toBe('a')
		expect(result.words[0].dominant).toBe('latin')
	})

	it('не трогает слова из одного алфавита', () => {
		expect(analyzeText('купить iPhone сегодня').issues).toHaveLength(0)
		expect(analyzeText('обычный русский текст').issues).toHaveLength(0)
		expect(analyzeText('plain english text').issues).toHaveLength(0)
	})

	it('определяет алфавит по бесспорным буквам, а не по большинству', () => {
		// «сoy»: двойников (с, o, y) больше, чем бесспорных букв — ни одной.
		// А в «пaроль» бесспорные п, л, ь перевешивают одинокую латинскую «a».
		expect(analyzeText('пaроль').words[0].dominant).toBe('cyrillic')
		expect(analyzeText('lатin').words[0].dominant).toBe('latin')
	})

	it('помечает букву без пары как неисправимую', () => {
		// латинская «i» в русском слове: украинскую «і» подставлять нельзя
		const result = analyzeText('сiстема')
		const issue = result.issues.find(i => i.char === 'i')

		expect(issue).toBeDefined()
		expect(issue?.suggestion).toBeNull()
		expect(result.fixable).toBeLessThan(result.issues.length)
	})

	it('помечает двуязычное слово, но замен по нему не предлагает', () => {
		// «adminистратора»: бесспорные буквы есть у обоих алфавитов (d, m, i, n
		// и и, т), значит слово составлено намеренно, а не испорчено.
		const result = analyzeText('adminистратора')

		expect(result.words).toHaveLength(1)
		expect(result.words[0].ambiguous).toBe(true)
		expect(result.issues.length).toBeGreaterThan(0)
		expect(result.fixable).toBe(0)
	})

	it('обычное заражённое слово двуязычным не считает', () => {
		expect(analyzeText('пaроль').words[0].ambiguous).toBe(false)
		expect(analyzeText('pаssword').words[0].ambiguous).toBe(false)
	})

	it('двуязычное слово переживает исправление без изменений', () => {
		const text = 'вход adminистратора'
		expect(fixText(text, analyzeText(text).issues)).toBe(text)
	})

	it('считает несколько заражённых слов', () => {
		const result = analyzeText('пaроль и лoгин')

		expect(result.words).toHaveLength(2)
		expect(result.issues).toHaveLength(2)
	})

	it('даёт позиции, указывающие на нужный символ', () => {
		const text = 'мой пaроль'
		const result = analyzeText(text)

		expect(text[result.issues[0].index]).toBe('a')
	})
})

describe('fixText', () => {
	it('чинит русское слово', () => {
		expect(fix('пaроль')).toBe('пароль')
	})

	it('чинит латинское слово', () => {
		expect(fix('pаssword')).toBe('password')
	})

	it('оставляет буквы без пары как есть', () => {
		const fixed = fix('сiстема')
		expect(fixed).toContain('i')
	})

	it('не портит текст, в котором всё в порядке', () => {
		const text = 'обычный текст с англицизмом iPhone и числом 42'
		expect(fix(text)).toBe(text)
	})

	it('не сдвигает замену из-за эмодзи в начале строки', () => {
		// суррогатная пара занимает две единицы UTF-16 — на этом ломается
		// индексация по кодовым точкам
		expect(fix('🙂 пaроль')).toBe('🙂 пароль')
		expect(fix('🙂🙂🙂 лoгин')).toBe('🙂🙂🙂 логин')
	})

	it('результат чистый — повторный разбор ничего не находит', () => {
		const fixed = fix('пaроль и лoгин от сaйта')
		expect(analyzeText(fixed).issues).toHaveLength(0)
	})
})

describe('таблицы двойников', () => {
	it('замена на кириллицу всегда обратима', () => {
		// Проверяем именно это направление: LATIN_TO_CYRILLIC — то, чем чинится
		// русское слово, и подставленная буква обязана распознаваться обратно.
		// Наоборот утверждать нельзя: и «Н», и «Һ» выглядят как латинская «H»,
		// поэтому прямая карта много-к-одному, и у «H» русский вариант ровно
		// один — «Н».
		for (const [lat, cyr] of Object.entries(LATIN_TO_CYRILLIC)) {
			expect(CYRILLIC_TO_LATIN[cyr]).toBe(lat)
		}
	})

	it('в нижнем регистре только семь бесспорных пар', () => {
		const lower = Object.keys(LATIN_TO_CYRILLIC).filter(
			c => c === c.toLowerCase()
		)
		expect(lower.sort()).toEqual(['a', 'c', 'e', 'o', 'p', 'x', 'y'])
	})
})

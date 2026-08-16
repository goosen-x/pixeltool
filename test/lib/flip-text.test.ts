import { describe, it, expect } from 'vitest'
import { flipUpsideDown, reverseText } from '@/lib/utils/flip-text'

describe('reverseText', () => {
	it('переворачивает порядок символов без замены глифов', () => {
		expect(reverseText('hello')).toBe('olleh')
	})

	it('пустая строка остаётся пустой', () => {
		expect(reverseText('')).toBe('')
	})

	it('работает с кириллицей как есть', () => {
		expect(reverseText('привет')).toBe('тевирп')
	})
})

describe('flipUpsideDown', () => {
	it('переворачивает и заменяет латинские буквы на глифы', () => {
		// h→ɥ, e→ǝ, l→l, l→l, o→o, затем реверс порядка символов
		expect(flipUpsideDown('hello')).toBe('ollǝɥ')
	})

	it('регистр не важен — строчные и заглавные дают предсказуемый результат', () => {
		expect(flipUpsideDown('sos')).toBe(flipUpsideDown('SOS'))
	})

	it('цифры тоже переворачиваются', () => {
		// 1→Ɩ, 2→ᄅ, 3→Ɛ, затем реверс порядка
		expect(flipUpsideDown('123')).toBe('ƐᄅƖ')
	})

	it('порядок символов реверсируется', () => {
		const result = flipUpsideDown('ab')
		// b идёт первым, a — последним, раз строка перевёрнута
		expect(result[0]).toBe(flipUpsideDown('b'))
		expect(result[result.length - 1]).toBe(flipUpsideDown('a'))
	})

	it('символы без глифа (кириллица) остаются как есть, но порядок меняется', () => {
		expect(flipUpsideDown('ав')).toBe('ва')
	})

	it('пустая строка остаётся пустой', () => {
		expect(flipUpsideDown('')).toBe('')
	})
})

import { describe, it, expect } from 'vitest'
import {
	analyzeDocument,
	scoreOf,
	looksLikeWholePage,
	type Check
} from '@/lib/html-analysis/analyze'

const check = (severity: 'error' | 'warning'): Check => ({
	id: 'x',
	severity,
	title: '',
	detail: '',
	count: 1
})

function category(html: string, key: string) {
	return analyzeDocument(html).categories.find(c => c.key === key)!
}

function hasCheck(html: string, key: string, id: string): boolean {
	return category(html, key).checks.some(c => c.id === id)
}

describe('scoreOf', () => {
	it('снимает 15 за ошибку и 5 за предупреждение', () => {
		expect(scoreOf([])).toBe(100)
		expect(scoreOf([check('error')])).toBe(85)
		expect(scoreOf([check('warning')])).toBe(95)
		expect(scoreOf([check('error'), check('warning')])).toBe(80)
	})

	it('не уходит ниже нуля', () => {
		expect(scoreOf(Array(10).fill(check('error')))).toBe(0)
	})
})

describe('looksLikeWholePage', () => {
	it('распознаёт страницу по doctype/html/title', () => {
		expect(looksLikeWholePage('<!DOCTYPE html><html></html>')).toBe(true)
		expect(looksLikeWholePage('<title>x</title>')).toBe(true)
	})

	it('фрагмент — не страница', () => {
		expect(looksLikeWholePage('<div><p>hi</p></div>')).toBe(false)
	})
})

describe('доступность', () => {
	it('ловит картинку без alt', () => {
		expect(hasCheck('<img src="a.png">', 'accessibility', 'img-no-alt')).toBe(
			true
		)
	})

	it('пустой alt допустим (декоративная)', () => {
		expect(
			hasCheck('<img src="a.png" alt="">', 'accessibility', 'img-no-alt')
		).toBe(false)
	})

	it('ловит поле без подписи', () => {
		expect(
			hasCheck('<input type="text">', 'accessibility', 'field-no-label')
		).toBe(true)
	})

	it('поле с label по for — не проблема', () => {
		const html = '<label for="n">Имя</label><input id="n" type="text">'
		expect(hasCheck(html, 'accessibility', 'field-no-label')).toBe(false)
	})

	it('ловит дубли id', () => {
		expect(
			hasCheck(
				'<div id="a"></div><div id="a"></div>',
				'accessibility',
				'dup-id'
			)
		).toBe(true)
	})

	it('ловит ссылку без текста', () => {
		expect(hasCheck('<a href="/"></a>', 'accessibility', 'empty-control')).toBe(
			true
		)
	})

	it('ссылка с aria-label — не проблема', () => {
		expect(
			hasCheck(
				'<a href="/" aria-label="Домой"></a>',
				'accessibility',
				'empty-control'
			)
		).toBe(false)
	})

	it('нет lang только для целой страницы', () => {
		expect(
			hasCheck(
				'<!DOCTYPE html><html><body></body></html>',
				'accessibility',
				'no-lang'
			)
		).toBe(true)
		// фрагмент — не ругаемся на lang
		expect(hasCheck('<div>hi</div>', 'accessibility', 'no-lang')).toBe(false)
	})
})

describe('семантика', () => {
	it('целая страница без main — ошибка', () => {
		expect(
			hasCheck(
				'<!DOCTYPE html><html><body><div>x</div></body></html>',
				'semantics',
				'no-main'
			)
		).toBe(true)
	})

	it('фрагмент без main — не ошибка', () => {
		expect(hasCheck('<div>x</div>', 'semantics', 'no-main')).toBe(false)
	})

	it('ловит b/i', () => {
		expect(hasCheck('<p><b>жирно</b></p>', 'semantics', 'legacy-bi')).toBe(true)
	})

	it('<i class> (иконка) не считается', () => {
		expect(hasCheck('<i class="icon"></i>', 'semantics', 'legacy-bi')).toBe(
			false
		)
	})
})

describe('заголовки', () => {
	it('пропуск уровня h2→h4', () => {
		expect(hasCheck('<h2>a</h2><h4>b</h4>', 'headings', 'heading-skip')).toBe(
			true
		)
	})

	it('несколько h1', () => {
		expect(hasCheck('<h1>a</h1><h1>b</h1>', 'headings', 'multiple-h1')).toBe(
			true
		)
	})
})

describe('итог', () => {
	it('чистый фрагмент — 100 по всем категориям', () => {
		const report = analyzeDocument(
			'<section><h2>Заголовок</h2><p>Текст со <strong>смыслом</strong>.</p></section>'
		)
		expect(report.overall).toBe(100)
		expect(report.isWholePage).toBe(false)
	})

	it('считает статистику', () => {
		const report = analyzeDocument('<div><img src="a"><a href="/">x</a></div>')
		expect(report.stats.images).toBe(1)
		expect(report.stats.links).toBe(1)
		expect(report.stats.elements).toBeGreaterThan(0)
	})
})

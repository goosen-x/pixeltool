import { describe, it, expect } from 'vitest'
import { parseArticleMarkdown } from '@/lib/seo/internal-links'

describe('parseArticleMarkdown', () => {
	it('считает bare-line ссылку на тул CTA-карточкой', () => {
		const content = `Текст статьи.\n\n/tools/random-number-generator\n`
		const result = parseArticleMarkdown(content)
		expect(result.toolLinks).toEqual([
			{ slug: 'random-number-generator', kind: 'cta' }
		])
	})

	it('считает markdown-ссылку, единственную в параграфе, CTA-карточкой', () => {
		const content = `Текст.\n\n[Генератор чисел](/tools/random-number-generator)\n`
		const result = parseArticleMarkdown(content)
		expect(result.toolLinks).toEqual([
			{ slug: 'random-number-generator', kind: 'cta' }
		])
	})

	it('считает ссылку внутри абзаца с другим текстом инлайн-упоминанием', () => {
		const content = `Используй [генератор чисел](/tools/random-number-generator) для этого.\n`
		const result = parseArticleMarkdown(content)
		expect(result.toolLinks).toEqual([
			{ slug: 'random-number-generator', kind: 'inline' }
		])
	})

	it('собирает ссылки на другие статьи блога', () => {
		const content = `См. также [статью](/blog/chto-takoe-json) и [эту](/blog/chto-takoe-jwt).\n`
		const result = parseArticleMarkdown(content)
		expect(result.blogSlugs.sort()).toEqual([
			'chto-takoe-json',
			'chto-takoe-jwt'
		])
	})

	it('не путает inline и CTA в одной статье', () => {
		const content =
			`Сначала [ссылка в тексте](/tools/qr-scanner) с продолжением.\n\n` +
			`/tools/qr-scanner\n`
		const result = parseArticleMarkdown(content)
		expect(result.toolLinks).toEqual([
			{ slug: 'qr-scanner', kind: 'cta' },
			{ slug: 'qr-scanner', kind: 'inline' }
		])
	})

	it('захватывает малформированные ссылки на тулы вместо того чтобы их игнорировать', () => {
		const content = `Текст с [ссылкой на тул](/tools/foo/bar/baz) в нём.\n`
		const result = parseArticleMarkdown(content)
		expect(result.toolLinks).toEqual([
			{ slug: 'foo/bar/baz', kind: 'inline' }
		])
	})
})

import { describe, it, expect } from 'vitest'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
	parseArticleMarkdown,
	parseArticle,
	findBlogLinksInSource,
	buildLinkGraph
} from '@/lib/seo/internal-links'

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
		expect(result.toolLinks).toEqual([{ slug: 'foo/bar/baz', kind: 'inline' }])
	})
})

describe('parseArticle', () => {
	it('читает frontmatter и slug из имени файла', () => {
		const raw = `---
title: 'Тестовая статья'
related:
  - chto-takoe-json
  - chto-takoe-jwt
---

/tools/random-number-generator
`
		const article = parseArticle('/repo/_posts/test-article.md', raw)
		expect(article.slug).toBe('test-article')
		expect(article.title).toBe('Тестовая статья')
		expect(article.relatedSlugs).toEqual(['chto-takoe-json', 'chto-takoe-jwt'])
		expect(article.toolLinks).toEqual([
			{ slug: 'random-number-generator', kind: 'cta' }
		])
	})

	it('related по умолчанию — пустой массив', () => {
		const raw = `---\ntitle: 'Без related'\n---\n\nТекст.\n`
		const article = parseArticle('/repo/_posts/no-related.md', raw)
		expect(article.relatedSlugs).toEqual([])
	})
})

describe('findBlogLinksInSource', () => {
	it('находит slug из href на /blog/', () => {
		const source = `
			<Link href='/blog/kak-provesti-rozygrysh-sluchaynym-chislom'>
				Как провести розыгрыш
			</Link>
		`
		expect(findBlogLinksInSource(source)).toEqual([
			'kak-provesti-rozygrysh-sluchaynym-chislom'
		])
	})

	it('дедуплицирует повторные упоминания одного slug', () => {
		const source = `href='/blog/foo' ... href="/blog/foo"`
		expect(findBlogLinksInSource(source)).toEqual(['foo'])
	})

	it('возвращает пустой массив, если ссылок на /blog/ нет', () => {
		expect(
			findBlogLinksInSource('export default function X() { return null }')
		).toEqual([])
	})
})

describe('buildLinkGraph', () => {
	it('собирает статьи и ссылки тул→статья из временной директории', () => {
		const repoRoot = mkdtempSync(join(tmpdir(), 'link-graph-'))
		const postsDir = join(repoRoot, '_posts')
		const toolDir = join(repoRoot, 'app/tools/(widget)/fake-tool')
		mkdirSync(postsDir, { recursive: true })
		mkdirSync(toolDir, { recursive: true })

		writeFileSync(
			join(postsDir, 'fake-article.md'),
			`---\ntitle: 'Фейковая статья'\n---\n\n/tools/fake-tool\n`
		)
		writeFileSync(
			join(toolDir, 'FakeToolSeo.tsx'),
			`export const x = <a href='/blog/fake-article'>статья</a>`
		)

		try {
			const graph = buildLinkGraph(repoRoot)
			expect(graph.articles).toHaveLength(1)
			expect(graph.articles[0].slug).toBe('fake-article')
			expect(graph.toolBlogLinks.get('fake-tool')).toEqual(['fake-article'])
		} finally {
			rmSync(repoRoot, { recursive: true, force: true })
		}
	})
})

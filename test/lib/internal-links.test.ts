import { describe, it, expect } from 'vitest'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
	parseArticleMarkdown,
	parseArticle,
	findBlogLinksInSource,
	buildLinkGraph,
	runChecks,
	type LinkGraph
} from '@/lib/seo/internal-links'
import { widgets } from '@/lib/constants/widgets'

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

	it('toolBlogLinks должна индексироваться по PATH, не по ID (демо на реальном виджете)', () => {
		// svg-encoder — реальный виджет, где id !== path
		const svgEncoderWidget = widgets.find(w => w.id === 'svg-encoder')
		expect(svgEncoderWidget).toBeDefined()
		expect(svgEncoderWidget!.id).toBe('svg-encoder')
		expect(svgEncoderWidget!.path).toBe('svg-to-base64-encoder')
		expect(svgEncoderWidget!.id).not.toBe(svgEncoderWidget!.path)

		const repoRoot = mkdtempSync(join(tmpdir(), 'link-graph-id-path-'))
		const postsDir = join(repoRoot, '_posts')
		// Использираем PATH как имя директории, не ID
		const toolDir = join(repoRoot, 'app/tools/(widget)/svg-to-base64-encoder')
		mkdirSync(postsDir, { recursive: true })
		mkdirSync(toolDir, { recursive: true })

		writeFileSync(
			join(postsDir, 'base64-article.md'),
			`---\ntitle: 'О Base64'\n---\n\nСтатья про кодирование.\n`
		)
		writeFileSync(
			join(toolDir, 'SvgEncoderSeo.tsx'),
			`export const seo = href('/blog/base64-article')`
		)

		try {
			const graph = buildLinkGraph(repoRoot)

			// В tools.find должна быть запись с id='svg-encoder' и path='svg-to-base64-encoder'
			const tool = graph.tools.find(t => t.id === 'svg-encoder')
			expect(tool).toBeDefined()
			expect(tool!.path).toBe('svg-to-base64-encoder')

			// toolBlogLinks ДОЛЖНА быть заполнена по PATH, не по ID
			// Если бы мы попробовали получить по ID, получили бы undefined
			expect(graph.toolBlogLinks.get('svg-encoder')).toBeUndefined()
			expect(graph.toolBlogLinks.get('svg-to-base64-encoder')).toEqual([
				'base64-article'
			])
		} finally {
			rmSync(repoRoot, { recursive: true, force: true })
		}
	})
})

function fakeGraph(overrides: Partial<LinkGraph> = {}): LinkGraph {
	return {
		tools: [{ id: 'a', path: 'tool-a', title: 'Tool A' }],
		articles: [],
		toolBlogLinks: new Map(),
		...overrides
	}
}

describe('runChecks', () => {
	it('находит битую ссылку статья→тул', () => {
		const graph = fakeGraph({
			articles: [
				{
					slug: 'article-a',
					title: 'A',
					relatedSlugs: [],
					toolLinks: [{ slug: 'no-such-tool', kind: 'cta' }],
					blogSlugs: []
				}
			]
		})
		const report = runChecks(graph)
		expect(report.issues).toContainEqual({
			severity: 'error',
			message: 'Битая ссылка: _posts/article-a.md → /tools/no-such-tool (тула не существует)'
		})
	})

	it('находит дубль CTA на один тул внутри статьи', () => {
		const graph = fakeGraph({
			articles: [
				{
					slug: 'article-a',
					title: 'A',
					relatedSlugs: [],
					toolLinks: [
						{ slug: 'tool-a', kind: 'cta' },
						{ slug: 'tool-a', kind: 'cta' }
					],
					blogSlugs: []
				}
			]
		})
		const report = runChecks(graph)
		expect(report.issues).toContainEqual({
			severity: 'error',
			message: 'Дубль CTA: _posts/article-a.md — 2 карточки на /tools/tool-a'
		})
	})

	it('находит orphan-тул как warning', () => {
		const report = runChecks(fakeGraph())
		expect(report.issues).toContainEqual({
			severity: 'warning',
			message: 'Orphan-тул: tool-a (Tool A) — ни одна статья не ссылается'
		})
	})

	it('находит асимметричный related как warning', () => {
		const graph = fakeGraph({
			articles: [
				{
					slug: 'article-a',
					title: 'A',
					relatedSlugs: ['article-b'],
					toolLinks: [{ slug: 'tool-a', kind: 'inline' }],
					blogSlugs: []
				},
				{
					slug: 'article-b',
					title: 'B',
					relatedSlugs: [],
					toolLinks: [{ slug: 'tool-a', kind: 'inline' }],
					blogSlugs: []
				}
			]
		})
		const report = runChecks(graph)
		expect(report.issues).toContainEqual({
			severity: 'warning',
			message: 'Асимметричный related: article-a.md → article-b.md, обратной ссылки нет'
		})
	})

	it('не находит проблем в полностью согласованном графе', () => {
		const graph = fakeGraph({
			toolBlogLinks: new Map([
				['tool-a', ['article-a']]
			]),
			articles: [
				{
					slug: 'article-a',
					title: 'A',
					relatedSlugs: [],
					toolLinks: [{ slug: 'tool-a', kind: 'inline' }],
					blogSlugs: []
				}
			]
		})
		const report = runChecks(graph)
		expect(report.issues).toEqual([])
	})
})

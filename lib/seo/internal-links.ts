import { unified } from 'unified'
import remarkParse from 'remark-parse'
import { visit } from 'unist-util-visit'
import type { Root, Paragraph, Text, Link } from 'mdast'
import matter from 'gray-matter'
import path from 'node:path'

export interface ToolLinkOccurrence {
	slug: string
	kind: 'cta' | 'inline'
}

export interface ArticleLinks {
	toolLinks: ToolLinkOccurrence[]
	blogSlugs: string[]
}

/**
 * Для bare-text: строгая валидация. Совпадает с `text.match(/^\/tools\/[\w-]+$/)`
 * из lib/remark-plugins/remark-tool-link.ts (без слеша в конце).
 */
function extractSlugFromBareText(text: string): string | null {
	const match = text.match(/^\/tools\/([\w-]+)$/)
	return match ? match[1] : null
}

/**
 * Для link href: свободная валидация. Совпадает с `href.startsWith('/tools/')`
 * и `href.startsWith('/blog/')` из рендерера — не требуем ничего о том,
 * что идёт дальше префикса (даже /tools/foo/bar или /tools/foo?x=y считаются валидными).
 * Это гарантирует, что малформированные ссылки не исчезают, а попадают в results
 * для последующей проверки в runChecks.
 */
function extractSlugFromHref(
	href: string,
	prefix: '/tools/' | '/blog/'
): string | null {
	if (!href.startsWith(prefix)) return null
	return href.slice(prefix.length)
}

/**
 * Повторяет ровно ту же логику, что рендерер блога использует для решения
 * «рисовать большую CTA-карточку или обычную ссылку» — см.
 * lib/remark-plugins/remark-tool-link.ts: карточка рисуется только если
 * ссылка на /tools/ — единственный дочерний узел своего параграфа.
 */
export function parseArticleMarkdown(content: string): ArticleLinks {
	const tree = unified().use(remarkParse).parse(content) as Root
	const toolLinks: ToolLinkOccurrence[] = []
	const ctaLinkNodes = new Set<Link>()
	const blogSlugs = new Set<string>()

	visit(tree, 'paragraph', (node: Paragraph) => {
		if (node.children.length !== 1) return
		const child = node.children[0]

		if (child.type === 'text') {
			const slug = extractSlugFromBareText((child as Text).value.trim())
			if (slug) toolLinks.push({ slug, kind: 'cta' })
			return
		}

		if (child.type === 'link') {
			const linkNode = child as Link
			const slug = extractSlugFromHref(linkNode.url, '/tools/')
			if (slug) {
				toolLinks.push({ slug, kind: 'cta' })
				ctaLinkNodes.add(linkNode)
			}
		}
	})

	visit(tree, 'link', (node: Link) => {
		const toolSlug = extractSlugFromHref(node.url, '/tools/')
		if (toolSlug && !ctaLinkNodes.has(node)) {
			toolLinks.push({ slug: toolSlug, kind: 'inline' })
		}

		const blogSlug = extractSlugFromHref(node.url, '/blog/')
		if (blogSlug) blogSlugs.add(blogSlug)
	})

	return { toolLinks, blogSlugs: [...blogSlugs] }
}

export interface Article {
	slug: string
	title: string
	relatedSlugs: string[]
	toolLinks: ToolLinkOccurrence[]
	blogSlugs: string[]
}

export function parseArticle(filePath: string, rawContent: string): Article {
	const { data, content } = matter(rawContent)
	const { toolLinks, blogSlugs } = parseArticleMarkdown(content)

	return {
		slug: path.basename(filePath, '.md'),
		title: typeof data.title === 'string' ? data.title : '',
		relatedSlugs: Array.isArray(data.related) ? data.related : [],
		toolLinks,
		blogSlugs
	}
}

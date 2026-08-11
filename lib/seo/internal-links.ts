import { unified } from 'unified'
import remarkParse from 'remark-parse'
import { visit } from 'unist-util-visit'
import type { Root, Paragraph, Text, Link } from 'mdast'

export interface ToolLinkOccurrence {
	slug: string
	kind: 'cta' | 'inline'
}

export interface ArticleLinks {
	toolLinks: ToolLinkOccurrence[]
	blogSlugs: string[]
}

function slugFromHref(href: string, prefix: '/tools/' | '/blog/'): string | null {
	if (!href.startsWith(prefix)) return null
	const match = href.slice(prefix.length).match(/^([\w-]+)\/?$/)
	return match ? match[1] : null
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
			const slug = slugFromHref((child as Text).value.trim(), '/tools/')
			if (slug) toolLinks.push({ slug, kind: 'cta' })
			return
		}

		if (child.type === 'link') {
			const linkNode = child as Link
			const slug = slugFromHref(linkNode.url, '/tools/')
			if (slug) {
				toolLinks.push({ slug, kind: 'cta' })
				ctaLinkNodes.add(linkNode)
			}
		}
	})

	visit(tree, 'link', (node: Link) => {
		const toolSlug = slugFromHref(node.url, '/tools/')
		if (toolSlug && !ctaLinkNodes.has(node)) {
			toolLinks.push({ slug: toolSlug, kind: 'inline' })
		}

		const blogSlug = slugFromHref(node.url, '/blog/')
		if (blogSlug) blogSlugs.add(blogSlug)
	})

	return { toolLinks, blogSlugs: [...blogSlugs] }
}

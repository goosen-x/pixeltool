import { unified } from 'unified'
import remarkParse from 'remark-parse'
import { visit } from 'unist-util-visit'
import type { Root, Paragraph, Text, Link } from 'mdast'
import matter from 'gray-matter'
import path from 'node:path'
import fs from 'node:fs'
import { widgets } from '@/lib/constants/widgets'

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

export function findBlogLinksInSource(source: string): string[] {
	const slugs = new Set<string>()
	const regex = /\/blog\/([\w-]+)/g
	let match: RegExpExecArray | null

	while ((match = regex.exec(source))) {
		slugs.add(match[1])
	}

	return [...slugs]
}

export interface ToolInfo {
	id: string
	path: string
	title: string
}

export interface LinkGraph {
	tools: ToolInfo[]
	articles: Article[]
	toolBlogLinks: Map<string, string[]>
}

export function loadTools(): ToolInfo[] {
	return widgets.map(w => ({ id: w.id, path: w.path, title: w.title || w.id }))
}

export function loadArticles(postsDir: string): Article[] {
	if (!fs.existsSync(postsDir)) return []

	return fs
		.readdirSync(postsDir)
		.filter(name => name.endsWith('.md'))
		.map(name => {
			const filePath = path.join(postsDir, name)
			return parseArticle(filePath, fs.readFileSync(filePath, 'utf-8'))
		})
}

function walkTsxFiles(dir: string): string[] {
	const results: string[] = []
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const fullPath = path.join(dir, entry.name)
		if (entry.isDirectory()) {
			results.push(...walkTsxFiles(fullPath))
		} else if (entry.name.endsWith('.tsx')) {
			results.push(fullPath)
		}
	}
	return results
}

export function loadToolBlogLinks(toolsRootDir: string): Map<string, string[]> {
	const map = new Map<string, string[]>()
	if (!fs.existsSync(toolsRootDir)) return map

	for (const entry of fs.readdirSync(toolsRootDir, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue

		const toolDir = path.join(toolsRootDir, entry.name)
		const blogSlugs = new Set<string>()

		for (const file of walkTsxFiles(toolDir)) {
			const source = fs.readFileSync(file, 'utf-8')
			findBlogLinksInSource(source).forEach(slug => blogSlugs.add(slug))
		}

		if (blogSlugs.size > 0) {
			map.set(entry.name, [...blogSlugs])
		}
	}

	return map
}

export function buildLinkGraph(repoRoot: string): LinkGraph {
	return {
		tools: loadTools(),
		articles: loadArticles(path.join(repoRoot, '_posts')),
		toolBlogLinks: loadToolBlogLinks(path.join(repoRoot, 'app/tools/(widget)'))
	}
}

#!/usr/bin/env tsx
// scripts/link-graph.ts
//
// Выгружает карту сайта как граф: узлы (хабы категорий, тулы, SEO-подстраницы,
// статьи) и рёбра (членство в категории, recommendedTools, ссылки из статей,
// ссылки из тулов в блог, related между статьями).
//
// Источник правды тот же, что у check:internal-links — lib/seo/internal-links.ts,
// плюс реестр виджетов и константы подстраниц. Ничего не парсится по HTML.
//
// Если рядом лежат выгрузки боевой БД (docs/stats/*.csv, снимаются вручную
// по ssh — наружу база не опубликована), к узлам подмешиваются просмотры и
// оценки. Файлов нет — граф собирается без них, это не ошибка.
//
//   pnpm link-graph            → docs/seo/link-graph.json
//   pnpm link-graph --stdout   → в stdout
import fs from 'node:fs'
import path from 'node:path'

import { buildLinkGraph } from '../lib/seo/internal-links'
import {
	widgets,
	widgetCategories,
	devSubcategories
} from '../lib/constants/widgets'
import { TOOL_SUBPAGE_FAMILIES } from '../lib/seo/tool-subpages'

type NodeKind =
	| 'catalog'
	| 'category'
	| 'subcategory'
	| 'tool'
	| 'subpage'
	| 'article'
	| 'blogIndex'

type EdgeKind =
	| 'category' // тул → хаб категории (членство)
	| 'subcategory' // тул → хаб css/html/javascript
	| 'recommends' // тул → тул, явный recommendedTools
	| 'subpage' // SEO-подстраница → родительский тул
	| 'cta' // статья → тул, карточка
	| 'inline' // статья → тул, ссылка в тексте
	| 'related' // статья → статья, frontmatter related
	| 'blogInline' // статья → статья, ссылка в тексте
	| 'toolToBlog' // тул → статья
	| 'index' // индекс блога → статья

interface PageStats {
	views: number
	ratingSum: number
	ratingCount: number
}

/**
 * Минимальный разбор CSV из psql --csv. Поля здесь — идентификаторы и целые
 * числа, кавычек и запятых внутри значений не бывает, поэтому полноценный
 * парсер не нужен; появятся — эту функцию придётся менять.
 */
function readStatsCsv(filePath: string): Map<string, PageStats> {
	const stats = new Map<string, PageStats>()
	if (!fs.existsSync(filePath)) return stats

	const lines = fs.readFileSync(filePath, 'utf-8').trim().split('\n')
	for (const line of lines.slice(1)) {
		const [key, views, ratingSum, ratingCount] = line.split(',')
		if (!key) continue
		stats.set(key, {
			views: Number(views) || 0,
			ratingSum: Number(ratingSum) || 0,
			ratingCount: Number(ratingCount) || 0
		})
	}
	return stats
}

interface SearchStats {
	impressions: number
	clicks: number
	ctr: number
	position: number | null
}

/**
 * Выгрузка `webmaster_url_stats` из боевой БД: показы, клики, CTR и средняя
 * позиция в Яндексе по странице за период. Ключ — путь (`/tools/draw-lots`),
 * он же `GraphNode.url`, поэтому сводится напрямую без карты идентификаторов.
 */
function readSearchCsv(filePath: string): Map<string, SearchStats> {
	const stats = new Map<string, SearchStats>()
	if (!fs.existsSync(filePath)) return stats

	const lines = fs.readFileSync(filePath, 'utf-8').trim().split('\n')
	for (const line of lines.slice(1)) {
		const [path, , , impressions, clicks, ctr, position] = line.split(',')
		if (!path) continue
		stats.set(path, {
			impressions: Number(impressions) || 0,
			clicks: Number(clicks) || 0,
			ctr: Number(ctr) || 0,
			position: position ? Number(position) : null
		})
	}
	return stats
}

interface GraphNode {
	id: string
	kind: NodeKind
	label: string
	url: string
	/** Ключ кластера: категория тула, категория родителя у подстраницы, 'blog' у статей. */
	cluster: string
	subcategory?: string
	demo?: boolean
	searchVolume?: number
	tags?: string[]
	parent?: string
	/** Просмотры из боевой БД, all-time. Нет строки — поля нет. */
	views?: number
	/** Средняя звезда, 1–5. Считается только при ratingCount > 0. */
	rating?: number
	ratingCount?: number
	/** Показы в Яндексе за период выгрузки. */
	impressions?: number
	clicks?: number
	ctr?: number
	/** Средняя позиция. Ниже 10 — вторая страница выдачи. */
	position?: number
}

interface GraphEdge {
	source: string
	target: string
	kind: EdgeKind
}

const CLUSTER_BLOG = 'blog'
const CLUSTER_ROOT = 'root'

function main(): void {
	const repoRoot = process.cwd()
	const link = buildLinkGraph(repoRoot)
	const toolStats = readStatsCsv(
		path.join(repoRoot, 'docs/stats/tool_stats.csv')
	)
	const blogStats = readStatsCsv(
		path.join(repoRoot, 'docs/stats/blog_stats.csv')
	)
	const searchStats = readSearchCsv(
		path.join(repoRoot, 'docs/stats/webmaster_url_stats.csv')
	)

	const applyStats = (
		node: GraphNode,
		stats: PageStats | undefined
	): GraphNode => {
		if (!stats) return node
		node.views = stats.views
		if (stats.ratingCount > 0) {
			node.rating = Number((stats.ratingSum / stats.ratingCount).toFixed(2))
			node.ratingCount = stats.ratingCount
		}
		return node
	}

	const nodes: GraphNode[] = []
	const edges: GraphEdge[] = []
	const seenNodes = new Set<string>()

	const addNode = (node: GraphNode): void => {
		if (seenNodes.has(node.id)) return
		seenNodes.add(node.id)
		nodes.push(node)
	}
	const addEdge = (source: string, target: string, kind: EdgeKind): void => {
		edges.push({ source, target, kind })
	}

	// --- Хабы каталога -------------------------------------------------------
	addNode({
		id: 'hub:tools',
		kind: 'catalog',
		label: 'Каталог',
		url: '/tools',
		cluster: CLUSTER_ROOT
	})
	addNode({
		id: 'hub:blog',
		kind: 'blogIndex',
		label: 'Блог',
		url: '/blog',
		cluster: CLUSTER_BLOG
	})

	for (const [key, title] of Object.entries(widgetCategories)) {
		addNode({
			id: `cat:${key}`,
			kind: 'category',
			label: title,
			url: `/tools/${key}`,
			cluster: key
		})
		addEdge('hub:tools', `cat:${key}`, 'category')
	}

	for (const [key, title] of Object.entries(devSubcategories)) {
		addNode({
			id: `sub:${key}`,
			kind: 'subcategory',
			label: title,
			url: `/tools/${key}`,
			cluster: 'development'
		})
		addEdge('cat:development', `sub:${key}`, 'subcategory')
	}

	// --- Тулы ----------------------------------------------------------------
	// Ключ узла — path (то, что стоит в URL). id из реестра расходится с path
	// примерно у одиннадцати тулов, а ссылки из статей приходят по path.
	// В recommendedTools встречаются и id, и path — в реестре это разные строки
	// примерно у одиннадцати тулов, и оба написания там реально используются.
	const toolRefToPath = new Map<string, string>()
	for (const widget of widgets) {
		toolRefToPath.set(widget.id, widget.path)
		toolRefToPath.set(widget.path, widget.path)
	}

	for (const widget of widgets) {
		// Ключ статистики — id из реестра, а не path: счётчик просмотров пишется
		// по id тула, и у одиннадцати тулов эти строки не совпадают.
		addNode(
			applyStats(
				{
					id: `tool:${widget.path}`,
					kind: 'tool',
					label: widget.title || widget.id,
					url: `/tools/${widget.path}`,
					cluster: widget.category,
					subcategory: widget.subcategory,
					demo: widget.demo === true,
					searchVolume: widget.searchVolume,
					tags: widget.tags
				},
				toolStats.get(widget.id)
			)
		)
		addEdge(`cat:${widget.category}`, `tool:${widget.path}`, 'category')
		if (widget.subcategory) {
			addEdge(`sub:${widget.subcategory}`, `tool:${widget.path}`, 'subcategory')
		}
	}

	for (const widget of widgets) {
		for (const recommendedId of widget.recommendedTools ?? []) {
			const targetPath = toolRefToPath.get(recommendedId)
			// Битые recommendedTools оставляем видимыми: узел-призрак лучше
			// молчаливой потери ребра — иначе дыра в карте не заметна.
			if (!targetPath) {
				addNode({
					id: `missing:${recommendedId}`,
					kind: 'tool',
					label: `${recommendedId} (нет такого тула)`,
					url: '',
					cluster: 'missing'
				})
				addEdge(`tool:${widget.path}`, `missing:${recommendedId}`, 'recommends')
				continue
			}
			addEdge(`tool:${widget.path}`, `tool:${targetPath}`, 'recommends')
		}
	}

	// --- SEO-подстраницы -----------------------------------------------------
	const widgetByPath = new Map(widgets.map(w => [w.path, w]))

	for (const family of TOOL_SUBPAGE_FAMILIES) {
		const parent = widgetByPath.get(family.parentPath)
		if (!parent) {
			throw new Error(
				`Семейство подстраниц ссылается на несуществующий тул: ${family.parentPath}`
			)
		}
		for (const item of family.items) {
			const id = `page:${family.parentPath}/${item.slug}`
			addNode({
				id,
				kind: 'subpage',
				label: item.label,
				url: `/tools/${family.parentPath}/${item.slug}`,
				cluster: parent.category,
				searchVolume: item.searchVolume,
				parent: `tool:${family.parentPath}`
			})
			addEdge(`tool:${family.parentPath}`, id, 'subpage')
		}
	}

	// --- Статьи --------------------------------------------------------------
	for (const article of link.articles) {
		addNode(
			applyStats(
				{
					id: `post:${article.slug}`,
					kind: 'article',
					label: article.title || article.slug,
					url: `/blog/${article.slug}`,
					cluster: CLUSTER_BLOG
				},
				blogStats.get(article.slug)
			)
		)
		// Не 'related': это членство в индексе, а не смысловая связь между
		// статьями. Иначе 52 служебных ребра подмешиваются к настоящим related.
		addEdge('hub:blog', `post:${article.slug}`, 'index')
	}

	const articleSlugs = new Set(link.articles.map(a => a.slug))
	const toolPaths = new Set(widgets.map(w => w.path))

	/**
	 * Ссылка из статьи ведёт либо на тул (`/tools/qr-generator`), либо на
	 * SEO-подстраницу (`/tools/unit-converter/shagi-v-km`) — второй случай
	 * даёт слаг из двух сегментов. Считать такой слаг битым нельзя: именно
	 * на этом спотыкается check:internal-links, выдавая 59 ложных ошибок.
	 */
	const resolveToolTarget = (slug: string): string | null => {
		if (toolPaths.has(slug)) return `tool:${slug}`
		if (seenNodes.has(`page:${slug}`)) return `page:${slug}`
		return null
	}

	for (const article of link.articles) {
		for (const toolLink of article.toolLinks) {
			let target = resolveToolTarget(toolLink.slug)
			if (!target) {
				target = `tool:${toolLink.slug}`
				addNode({
					id: target,
					kind: 'tool',
					label: `${toolLink.slug} (битая ссылка)`,
					url: '',
					cluster: 'missing'
				})
			}
			addEdge(`post:${article.slug}`, target, toolLink.kind)
		}
		for (const slug of article.relatedSlugs) {
			if (!articleSlugs.has(slug)) continue
			addEdge(`post:${article.slug}`, `post:${slug}`, 'related')
		}
		for (const slug of article.blogSlugs) {
			if (!articleSlugs.has(slug)) continue
			addEdge(`post:${article.slug}`, `post:${slug}`, 'blogInline')
		}
	}

	for (const [toolPath, slugs] of link.toolBlogLinks) {
		if (!toolPaths.has(toolPath)) continue
		for (const slug of slugs) {
			if (!articleSlugs.has(slug)) continue
			addEdge(`tool:${toolPath}`, `post:${slug}`, 'toolToBlog')
		}
	}

	// --- Выгрузка ------------------------------------------------------------
	const clusters = [
		...Object.entries(widgetCategories).map(([key, title]) => ({
			key,
			title,
			kind: 'category' as const
		})),
		{ key: CLUSTER_BLOG, title: 'Блог', kind: 'blog' as const },
		{ key: CLUSTER_ROOT, title: 'Каталог', kind: 'root' as const },
		{ key: 'missing', title: 'Битые ссылки', kind: 'missing' as const }
	]

	// Поисковая статистика сводится по url, а не по id, поэтому проставляется
	// одним проходом в конце — после того как все узлы собраны.
	for (const node of nodes) {
		const search = searchStats.get(node.url)
		if (!search) continue
		node.impressions = search.impressions
		node.clicks = search.clicks
		node.ctr = search.ctr
		if (search.position !== null) node.position = search.position
	}

	const payload = {
		generatedAt: new Date().toISOString(),
		clusters,
		nodes,
		edges
	}

	const json = JSON.stringify(payload, null, '\t')

	if (process.argv.includes('--stdout')) {
		process.stdout.write(json)
		return
	}

	const outPath = path.join(repoRoot, 'docs/seo/link-graph.json')
	fs.mkdirSync(path.dirname(outPath), { recursive: true })
	fs.writeFileSync(outPath, json + '\n')

	const byKind = nodes.reduce<Record<string, number>>((acc, node) => {
		acc[node.kind] = (acc[node.kind] ?? 0) + 1
		return acc
	}, {})
	const edgesByKind = edges.reduce<Record<string, number>>((acc, edge) => {
		acc[edge.kind] = (acc[edge.kind] ?? 0) + 1
		return acc
	}, {})

	const withViews = nodes.filter(n => n.views !== undefined).length
	const withSearch = nodes.filter(n => n.impressions !== undefined).length
	console.log(`Граф выгружен: ${path.relative(repoRoot, outPath)}`)
	console.log(
		withViews > 0
			? `Статистика БД подмешана к ${withViews} узлам`
			: 'Статистика БД не найдена (docs/stats/*.csv) — граф без просмотров'
	)
	if (withSearch > 0) {
		console.log(`Поисковая статистика Яндекса: ${withSearch} страниц`)
	}
	console.log(`Узлы (${nodes.length}):`, byKind)
	console.log(`Рёбра (${edges.length}):`, edgesByKind)
}

main()

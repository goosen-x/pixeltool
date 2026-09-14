#!/usr/bin/env node
// scripts/link-graph-embed.mjs
//
// Вшивает свежий docs/seo/link-graph.json в страницу docs/seo/link-graph.html.
// Страница самодостаточна (одним файлом её можно открыть или опубликовать),
// поэтому данные лежат внутри неё, а не тянутся запросом.
//
// Формат внутри страницы компактный: узлы полями в одну букву, рёбра —
// тройками индексов. На 276 узлах и 1025 рёбрах это 25 КБ вместо 190.
//
//   pnpm link-graph && node scripts/link-graph-embed.mjs
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const jsonPath = path.join(root, 'docs/seo/link-graph.json')
const htmlPath = path.join(root, 'docs/seo/link-graph.html')

const graph = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))

const nodeIndex = new Map(graph.nodes.map((n, i) => [n.id, i]))
const kinds = [...new Set(graph.edges.map(e => e.kind))]

const payload = {
	generatedAt: graph.generatedAt,
	kinds,
	clusters: graph.clusters,
	nodes: graph.nodes.map(n => {
		const out = { i: n.id, k: n.kind, l: n.label, u: n.url, c: n.cluster }
		if (n.searchVolume) out.sv = n.searchVolume
		if (n.parent) out.p = n.parent
		if (n.views !== undefined) out.v = n.views
		if (n.rating) { out.r = n.rating; out.rc = n.ratingCount }
		if (n.impressions !== undefined) {
			out.imp = n.impressions
			out.clk = n.clicks
			out.ct = n.ctr
			if (n.position !== undefined) out.pos = n.position
		}
		return out
	}),
	edges: graph.edges
		.map(e => [nodeIndex.get(e.source), nodeIndex.get(e.target), kinds.indexOf(e.kind)])
		// Ребро в несуществующий узел молча ломает раскладку, поэтому режем здесь,
		// а не в браузере: в JSON такого быть не должно, но проверка стоит дёшево.
		.filter(([a, b]) => a !== undefined && b !== undefined)
}

const html = fs.readFileSync(htmlPath, 'utf-8')
const open = '<script id="graph-data" type="application/json">'
const close = '</script>'
const start = html.indexOf(open)
if (start === -1) throw new Error('В link-graph.html нет блока <script id="graph-data">')
const from = start + open.length
const to = html.indexOf(close, from)

// </script> внутри строки данных закрыл бы тег раньше времени. В слагах и
// заголовках такого нет, но экранируем на случай будущих текстов.
const json = JSON.stringify(payload).replace(/<\//g, '<\\/')

fs.writeFileSync(htmlPath, html.slice(0, from) + json + html.slice(to))

console.log(
	`Вшито в ${path.relative(root, htmlPath)}: ` +
		`${payload.nodes.length} узлов, ${payload.edges.length} рёбер, ${(json.length / 1024).toFixed(1)} КБ`
)

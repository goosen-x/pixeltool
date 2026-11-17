/**
 * Рендер схем Hairline в PNG без dev-сервера: сцена — чистая функция,
 * поэтому её можно собрать в Node, обернуть в SVG с палитрой движка и
 * сфотографировать браузером.
 *
 *   NODE_PATH=<папка с playwright> npx tsx scripts/hairline-preview.ts <cases.json> <out-dir>
 *
 * playwright не зависимость проекта: берётся из NODE_PATH.
 *
 * cases.json — массив { name, module, export, key?, dims: [{key, letter,
 * meters, text}], active? }. module — путь от корня репозитория без
 * расширения (lib/hairline/figures/geometry), export — имя экспорта;
 * если экспорт — словарь фигур, key выбирает фигуру.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'
import { createRequire } from 'module'
import { fitScene, type FigureDef } from '../lib/hairline/scene-kit'

type Case = {
	name: string
	module: string
	export: string
	key?: string
	dims: Array<{
		key: string
		letter: string
		meters: number | null
		text: string
	}>
	active?: string | null
	dark?: boolean
}

const LIGHT = {
	plate: '#ffffff',
	hi: '#3b82f6',
	edge: '#5f6470',
	mid: '#8a8f99',
	lo: '#cfd2d8'
}
const DARK = {
	plate: '#0f172a',
	hi: '#3b82f6',
	edge: '#aab2c0',
	mid: '#6b7280',
	lo: '#334155'
}

async function main() {
	const [casesPath, outDir] = process.argv.slice(2)
	const cases: Case[] = JSON.parse(readFileSync(casesPath, 'utf8'))
	mkdirSync(outDir, { recursive: true })
	// require через createRequire учитывает NODE_PATH (у import() в ESM его нет),
	// а имя модуля строкой не даёт tsc искать типы playwright в проекте
	const pw = 'playwright'
	const { chromium } = createRequire(resolve('package.json'))(pw)
	const browser = await chromium.launch({ channel: 'chrome' })
	const page = await browser.newPage({
		viewport: { width: 500, height: 400 },
		deviceScaleFactor: 2
	})
	for (const c of cases) {
		const mod = await import(resolve(c.module))
		const exp = mod[c.export]
		const def: FigureDef = c.key ? exp[c.key] : exp
		const raw: Record<string, number> = {}
		for (const d of c.dims) raw[d.key] = d.meters ?? 1
		const text = (l: { key: string; text?: string }) => {
			if (l.text !== undefined) return l.text
			const d = c.dims.find(x => x.key === l.key)
			return d ? `${d.letter} = ${d.text}` : ''
		}
		const scene = fitScene(def, def.display(raw), c.active ?? null, text)
		const p = c.dark ? DARK : LIGHT
		const css = `
			body{margin:0;background:${p.plate}}
			svg{width:500px;height:400px;display:block}
			path{fill:${p.plate};stroke:${p.mid};stroke-width:1.1;vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round}
			.nf{fill:none}.fo{stroke:none}.sil{stroke:${p.edge}}.hi{stroke:${p.hi}}.lo{stroke:${p.lo}}.dash{stroke-dasharray:1 3}
			text{font:500 12.5px Inter,system-ui,sans-serif;fill:${p.edge};stroke:${p.plate};stroke-width:4px;paint-order:stroke}
			text.on{fill:${p.hi}}`
		let defs = ''
		const paths = scene.ops
			.map((o, i) => {
				let clip = ''
				if (o.clip) {
					defs += `<clipPath id="c${i}"><path d="${o.clip}"/></clipPath>`
					clip = ` clip-path="url(#c${i})"`
				}
				return `<path d="${o.d}" class="${o.cls}"${o.rule ? ` fill-rule="${o.rule}"` : ''}${clip}/>`
			})
			.join('')
		const texts = scene.labels
			.map(
				l =>
					`<text x="${l.x.toFixed(1)}" y="${l.y.toFixed(1)}" text-anchor="${l.anchor}" class="${l.key === c.active ? 'on' : ''}">${text(l)}</text>`
			)
			.join('')
		const html = `<!doctype html><style>${css}</style><svg viewBox="0 0 400 320"><defs>${defs}</defs>${paths}${texts}</svg>`
		await page.setContent(html)
		await page.screenshot({ path: join(outDir, `${c.name}.png`) })
		writeFileSync(join(outDir, `${c.name}.html`), html)
	}
	await browser.close()
	console.log(`готово: ${cases.length} шт. в ${outDir}`)
}

main().catch(e => {
	console.error(e)
	process.exit(1)
})

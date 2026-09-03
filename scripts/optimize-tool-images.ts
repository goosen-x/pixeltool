#!/usr/bin/env tsx
/**
 * Разовая оптимизация скриншотов инструментов.
 * Исходники (1672x941 webp) лежат вне репозитория; на выходе по два webp на
 * тул — 1200w и 800w — в public/images/tools/<file>-{1200,800}.webp, где file
 * берётся из toolScreenshots (транслит русского запроса). Под responsive
 * srcset в <ToolScreenshot>.
 *
 * Запуск: npx tsx scripts/optimize-tool-images.ts [<src-dir>]
 */
import * as fs from 'fs'
import * as path from 'path'
import sharp from 'sharp'
import { widgets } from '../lib/constants/widgets'
import { toolScreenshots } from '../lib/constants/tool-screenshots'

const SRC_DIR =
	process.argv[2] ||
	'/Users/dmitryborisenko/Documents/Codex/2026-09-02/new-chat/outputs/pixeltool-tool-images'

const OUT_DIR = path.join(process.cwd(), 'public/images/tools')
const WIDTHS = [1200, 800] as const
const QUALITY = 78

/**
 * Точное имя исходника, когда он не совпадает с tool-<path>.webp — например
 * перерисованные версии с суффиксом. Ключ — widget.path.
 */
const SRC_OVERRIDES: Record<string, string> = {
	'base64-encoder': 'tool-base64-encoder-fixed.webp',
	'car-region-codes': 'tool-car-region-codes-fixed.webp',
	'dice-roller': 'tool-dice-roller-fixed-v2.webp',
	'qr-generator': 'tool-qr-generator-fixed.webp',
	'random-number-generator': 'tool-random-number-generator-fixed-v5.webp',
	'typing-speed-test': 'tool-typing-speed-test-fixed.webp',
	'magic-ball': 'tool-magic-ball-fixed-v2.webp',
	'draw-lots': 'tool-draw-lots-fixed-v4.webp'
}

/** Ищет исходник: сначала override, затем tool-<path>.webp, затем tool-<id>.webp. */
function findSource(widgetPath: string): string | null {
	const override = SRC_OVERRIDES[widgetPath]
	if (override) {
		const p = path.join(SRC_DIR, override)
		if (fs.existsSync(p)) return p
	}

	const byPath = path.join(SRC_DIR, `tool-${widgetPath}.webp`)
	if (fs.existsSync(byPath)) return byPath

	const widget = widgets.find(w => w.path === widgetPath)
	if (widget) {
		const byId = path.join(SRC_DIR, `tool-${widget.id}.webp`)
		if (fs.existsSync(byId)) return byId
	}
	return null
}

async function main() {
	if (!fs.existsSync(SRC_DIR)) {
		console.error(`Нет папки с исходниками: ${SRC_DIR}`)
		process.exit(1)
	}
	fs.mkdirSync(OUT_DIR, { recursive: true })

	const problems: string[] = []
	let count = 0

	for (const [widgetPath, shot] of Object.entries(toolScreenshots)) {
		if (!widgets.some(w => w.path === widgetPath)) {
			problems.push(`${widgetPath}: нет виджета с таким path`)
			continue
		}
		const input = findSource(widgetPath)
		if (!input) {
			problems.push(`${widgetPath}: не найден исходник tool-${widgetPath}.webp`)
			continue
		}

		for (const w of WIDTHS) {
			const out = path.join(OUT_DIR, `${shot.file}-${w}.webp`)
			await sharp(input)
				.resize({ width: w, withoutEnlargement: true })
				.webp({ quality: QUALITY })
				.toFile(out)
			const kb = (fs.statSync(out).size / 1024).toFixed(0)
			console.log(`${shot.file}-${w}.webp  ${kb} КБ`)
		}
		count++
	}

	console.log(`\nГотово: ${count} тулов, ${count * 2} файлов`)
	if (problems.length) {
		console.error(`\nПроблемы (${problems.length}):`)
		problems.forEach(p => console.error(`  ${p}`))
		process.exit(1)
	}
}

main()

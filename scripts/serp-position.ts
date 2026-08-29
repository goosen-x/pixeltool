#!/usr/bin/env tsx
/**
 * Позиции сайта в Яндексе и Google по фразам тулов.
 *
 *   pnpm serp --built                        все построенные тулы из реестра
 *   pnpm serp "калькулятор бетона"           произвольные фразы
 *   pnpm serp --built --pages 5 --tsv out.tsv
 *
 * Флаги:
 *   --built          взять фразы из реестра виджетов (title каждого тула)
 *   --pages <n>      сколько страниц выдачи просматривать, по умолчанию 3 (топ-30)
 *   --site <домен>   чью позицию искать, по умолчанию pixeltool.pro
 *   --tsv <path>     записать результат в TSV
 *   --json           сырой JSON вместо таблицы
 *
 * Яндекс работает на ключе Вордстата (YANDEX_API_KEY/YANDEX_FOLDER_ID).
 * Google требует GOOGLE_SEARCH_API_KEY и GOOGLE_CSE_ID — без них колонка
 * остаётся пустой, см. lib/seo/serp.ts.
 */

import { writeFileSync } from 'fs'
import { config as loadEnv } from 'dotenv'
import { publicWidgets } from '../lib/constants/widgets'
import {
	findInGoogle,
	findInYandex,
	readSerpConfig,
	type SerpPosition
} from '../lib/seo/serp'

loadEnv({ path: '.env.local' })

/** Пауза между запросами: Search API считает квоту по секундам. */
const REQUEST_DELAY_MS = 700

interface Row {
	phrase: string
	tool: string
	yandex: SerpPosition
	google: SerpPosition | null
}

function delay(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms))
}

function parseArgs(argv: string[]) {
	const phrases: string[] = []
	let built = false
	let pages = 3
	let site = 'pixeltool.pro'
	let tsv: string | null = null
	let json = false

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i]
		if (arg === '--built') built = true
		else if (arg === '--pages') pages = Number(argv[++i])
		else if (arg === '--site') site = argv[++i]
		else if (arg === '--tsv') tsv = argv[++i]
		else if (arg === '--json') json = true
		else if (arg.startsWith('--')) throw new Error(`Неизвестный флаг: ${arg}`)
		else phrases.push(arg)
	}

	if (!built && phrases.length === 0) {
		throw new Error('Задайте фразы или --built')
	}
	if (!Number.isFinite(pages) || pages < 1 || pages > 10) {
		throw new Error('--pages должен быть числом от 1 до 10')
	}

	return { phrases, built, pages, site, tsv, json }
}

/** Позицию ищем по заголовку тула — это и есть головная фраза, под которую он сделан. */
function builtPhrases(): Array<{ phrase: string; tool: string }> {
	return publicWidgets
		.filter(w => w.title)
		.map(w => ({ phrase: w.title as string, tool: w.path }))
}

function formatPosition(p: SerpPosition | null, pages: number): string {
	if (!p) return '—'
	return p.position === null ? `>${pages * 10}` : String(p.position)
}

async function main(): Promise<void> {
	const options = parseArgs(process.argv.slice(2))
	const config = readSerpConfig()

	const targets = options.built
		? builtPhrases()
		: options.phrases.map(phrase => ({ phrase, tool: '' }))

	if (!config.googleApiKey || !config.googleCseId) {
		console.error(
			'! Google не измеряется: нет GOOGLE_SEARCH_API_KEY и/или GOOGLE_CSE_ID\n'
		)
	}

	const rows: Row[] = []

	for (const [index, target] of targets.entries()) {
		if (index > 0) await delay(REQUEST_DELAY_MS)
		process.stderr.write(`[${index + 1}/${targets.length}] ${target.phrase}\r`)

		try {
			const yandex = await findInYandex(
				config,
				target.phrase,
				options.site,
				options.pages
			)
			const google = await findInGoogle(
				config,
				target.phrase,
				options.site,
				options.pages
			)
			rows.push({ ...target, yandex, google })
		} catch (error) {
			// Одна сорвавшаяся фраза не должна ронять прогон по остальным.
			console.error(
				`\n  ✖ ${target.phrase}: ${error instanceof Error ? error.message : String(error)}`
			)
		}
	}
	process.stderr.write('\n')

	if (options.json) {
		console.log(JSON.stringify(rows, null, 2))
	} else {
		console.log(
			`\n${'фраза'.padEnd(42)} ${'Яндекс'.padStart(7)} ${'Google'.padStart(7)}   топ-3 Яндекса`
		)
		console.log('-'.repeat(100))
		for (const row of rows) {
			console.log(
				row.phrase.slice(0, 41).padEnd(42),
				formatPosition(row.yandex, options.pages).padStart(7),
				formatPosition(row.google, options.pages).padStart(7),
				' ',
				row.yandex.top.slice(0, 3).join(', ')
			)
		}
	}

	if (options.tsv) {
		const header = 'phrase\ttool\tyandex\tgoogle\tyandex_top10\n'
		const body = rows
			.map(row =>
				[
					row.phrase,
					row.tool,
					row.yandex.position ?? '',
					row.google?.position ?? '',
					row.yandex.top.join(' ')
				].join('\t')
			)
			.join('\n')
		writeFileSync(options.tsv, header + body + '\n')
		console.error(`\n  TSV записан: ${options.tsv}`)
	}
}

main().catch((error: unknown) => {
	console.error(
		`\n✖ ${error instanceof Error ? error.message : String(error)}\n`
	)
	process.exit(1)
})

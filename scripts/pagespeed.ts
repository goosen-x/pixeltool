#!/usr/bin/env tsx
/**
 * Прогон PageSpeed Insights по страницам тулов.
 *
 *   pnpm pagespeed                          все публичные виджеты, мобильная стратегия
 *   pnpm pagespeed --strategy desktop       десктопная стратегия
 *   pnpm pagespeed --filter qr --limit 5    подмножество по подстроке пути
 *   pnpm pagespeed --url https://pixeltool.pro/blog
 *   pnpm pagespeed --csv reports/psi.csv    выгрузка таблицы в CSV
 *
 * Флаги:
 *   --strategy <mobile|desktop>  устройство, по умолчанию mobile
 *   --url <url>                  проверить конкретный адрес (можно повторять)
 *   --filter <подстрока>         только виджеты, чей путь содержит подстроку
 *   --limit <n>                  ограничить число адресов
 *   --base <url>                 базовый домен, по умолчанию https://pixeltool.pro
 *   --csv <path>                 записать результат в CSV
 *   --json                       выдать сырой JSON вместо таблицы
 *   --no-cache                   игнорировать кэш и сходить в API заново
 *
 * Ключ API берётся из PAGESPEED_API_KEY в .env.local. Без ключа запросы тоже
 * проходят, но квота считается на IP и на общих адресах она часто уже выбрана,
 * поэтому 429 без ключа это норма, а не поломка скрипта.
 *
 * Ответы кэшируются в .cache/pagespeed на сутки: один прогон по 50 тулам это
 * 50 запросов, и упереться в квоту повторным запуском легко.
 */

import {
	readFileSync,
	writeFileSync,
	mkdirSync,
	existsSync,
	statSync
} from 'fs'
import { join, dirname } from 'path'
import { config as loadEnv } from 'dotenv'
import { publicWidgets } from '../lib/constants/widgets'

loadEnv({ path: '.env.local' })

const API = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'
const CACHE_DIR = '.cache/pagespeed'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000
/** Пауза между запросами: с ключом квота 240/мин, без ключа заметно меньше. */
const REQUEST_DELAY_MS = 1200
const MAX_RETRIES = 4

type Strategy = 'mobile' | 'desktop'

interface Options {
	strategy: Strategy
	urls: string[]
	filter: string | null
	limit: number | null
	base: string
	csv: string | null
	json: boolean
	useCache: boolean
}

interface Metrics {
	url: string
	strategy: Strategy
	score: number | null
	lcp: number | null
	cls: number | null
	tbt: number | null
	fcp: number | null
	si: number | null
	/** Полевые данные CrUX, если Google их накопил по этому адресу. */
	fieldLcp: number | null
	fieldInp: number | null
	fieldCls: number | null
	cached: boolean
}

function parseArgs(argv: string[]): Options {
	const options: Options = {
		strategy: 'mobile',
		urls: [],
		filter: null,
		limit: null,
		base: process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro',
		csv: null,
		json: false,
		useCache: true
	}

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i]

		if (arg === '--strategy') {
			const value = argv[++i]
			if (value !== 'mobile' && value !== 'desktop') {
				throw new Error(`Неизвестная стратегия: ${value}`)
			}
			options.strategy = value
		} else if (arg === '--url') {
			options.urls.push(argv[++i])
		} else if (arg === '--filter') {
			options.filter = argv[++i]
		} else if (arg === '--limit') {
			options.limit = Number(argv[++i])
		} else if (arg === '--base') {
			options.base = argv[++i].replace(/\/$/, '')
		} else if (arg === '--csv') {
			options.csv = argv[++i]
		} else if (arg === '--json') {
			options.json = true
		} else if (arg === '--no-cache') {
			options.useCache = false
		} else if (arg.startsWith('-')) {
			throw new Error(`Неизвестный флаг: ${arg}`)
		}
	}

	return options
}

function collectUrls(options: Options): string[] {
	if (options.urls.length > 0) return options.urls

	let widgets = publicWidgets
	if (options.filter) {
		const needle = options.filter.toLowerCase()
		widgets = widgets.filter(widget =>
			widget.path.toLowerCase().includes(needle)
		)
	}

	const urls = widgets.map(widget => `${options.base}/tools/${widget.path}`)
	return options.limit ? urls.slice(0, options.limit) : urls
}

function cachePath(url: string, strategy: Strategy): string {
	const slug = Buffer.from(`${url}|${strategy}`)
		.toString('base64url')
		.slice(0, 100)
	return join(CACHE_DIR, `${slug}.json`)
}

function readCache(path: string): Metrics | null {
	if (!existsSync(path)) return null
	if (Date.now() - statSync(path).mtimeMs > CACHE_TTL_MS) return null

	try {
		return JSON.parse(readFileSync(path, 'utf-8')) as Metrics
	} catch {
		return null
	}
}

function delay(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms))
}

/** Ответ PSI большой, из него нужны только эти ветки. */
interface PsiResponse {
	lighthouseResult?: {
		categories?: { performance?: { score?: number } }
		audits?: Record<string, { numericValue?: number } | undefined>
	}
	loadingExperience?: {
		metrics?: Record<string, { percentile?: number } | undefined>
	}
}

/** Лабораторная метрика: числовое значение аудита Lighthouse в миллисекундах. */
function audit(data: PsiResponse, id: string): number | null {
	const value = data.lighthouseResult?.audits?.[id]?.numericValue
	return typeof value === 'number' ? value : null
}

/** Полевая метрика CrUX: 75-й перцентиль по реальным пользователям. */
function field(data: PsiResponse, id: string): number | null {
	const value = data.loadingExperience?.metrics?.[id]?.percentile
	return typeof value === 'number' ? value : null
}

async function fetchMetrics(
	url: string,
	strategy: Strategy,
	apiKey: string | undefined
): Promise<Metrics> {
	const params = new URLSearchParams({ url, strategy, category: 'performance' })
	if (apiKey) params.set('key', apiKey)

	let lastError = ''

	for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
		const response = await fetch(`${API}?${params.toString()}`)

		if (response.ok) {
			const data = (await response.json()) as PsiResponse
			const score = data.lighthouseResult?.categories?.performance?.score
			return {
				url,
				strategy,
				score: typeof score === 'number' ? Math.round(score * 100) : null,
				lcp: audit(data, 'largest-contentful-paint'),
				cls: audit(data, 'cumulative-layout-shift'),
				tbt: audit(data, 'total-blocking-time'),
				fcp: audit(data, 'first-contentful-paint'),
				si: audit(data, 'speed-index'),
				fieldLcp: field(data, 'LARGEST_CONTENTFUL_PAINT_MS'),
				fieldInp: field(data, 'INTERACTION_TO_NEXT_PAINT'),
				fieldCls: field(data, 'CUMULATIVE_LAYOUT_SHIFT_SCORE'),
				cached: false
			}
		}

		lastError = `HTTP ${response.status}`

		// 429 и 5xx лечатся ожиданием, остальные коды повторять смысла нет.
		if (response.status !== 429 && response.status < 500) break
		if (attempt === MAX_RETRIES) break

		const backoff = REQUEST_DELAY_MS * Math.pow(3, attempt)
		console.error(
			`  ${lastError}, повтор через ${Math.round(backoff / 1000)} с (попытка ${attempt + 1} из ${MAX_RETRIES})`
		)
		await delay(backoff)
	}

	throw new Error(lastError)
}

function ms(value: number | null): string {
	if (value === null) return '  n/a'
	return value >= 1000
		? `${(value / 1000).toFixed(1)} с`.padStart(6)
		: `${Math.round(value)} мс`.padStart(6)
}

function cls(value: number | null): string {
	return value === null ? ' n/a' : value.toFixed(3).padStart(5)
}

function printTable(rows: Metrics[], base: string): void {
	const sorted = [...rows].sort((a, b) => (a.score ?? 101) - (b.score ?? 101))

	console.log('\n  score  LCP     TBT     CLS    FCP     SI      страница')
	console.log('  ' + '-'.repeat(78))

	for (const row of sorted) {
		const score = (row.score === null ? 'n/a' : String(row.score)).padStart(5)
		const path = row.url.replace(base, '') + (row.cached ? ' (кэш)' : '')
		console.log(
			`  ${score}  ${ms(row.lcp)}  ${ms(row.tbt)}  ${cls(row.cls)}  ${ms(row.fcp)}  ${ms(row.si)}  ${path}`
		)
	}

	const scored = sorted.filter(row => row.score !== null)
	if (scored.length > 0) {
		const avg = Math.round(
			scored.reduce((sum, row) => sum + (row.score ?? 0), 0) / scored.length
		)
		const bad = scored.filter(row => (row.score ?? 0) < 90).length
		console.log(
			`\n  Средний score: ${avg}, ниже 90: ${bad} из ${scored.length}`
		)
	}

	const withField = sorted.filter(row => row.fieldLcp !== null)
	if (withField.length > 0) {
		console.log('\n  Полевые данные CrUX (75-й перцентиль):')
		for (const row of withField) {
			console.log(
				`  LCP ${ms(row.fieldLcp)}  INP ${ms(row.fieldInp)}  CLS ${cls(row.fieldCls ? row.fieldCls / 100 : null)}  ${row.url.replace(base, '')}`
			)
		}
	}
}

function writeCsv(path: string, rows: Metrics[]): void {
	const header =
		'url,strategy,score,lcp_ms,tbt_ms,cls,fcp_ms,si_ms,field_lcp_ms,field_inp_ms,field_cls'
	const lines = rows.map(row =>
		[
			row.url,
			row.strategy,
			row.score ?? '',
			row.lcp === null ? '' : Math.round(row.lcp),
			row.tbt === null ? '' : Math.round(row.tbt),
			row.cls === null ? '' : row.cls.toFixed(3),
			row.fcp === null ? '' : Math.round(row.fcp),
			row.si === null ? '' : Math.round(row.si),
			row.fieldLcp ?? '',
			row.fieldInp ?? '',
			row.fieldCls === null ? '' : (row.fieldCls / 100).toFixed(3)
		].join(',')
	)

	mkdirSync(dirname(path), { recursive: true })
	writeFileSync(path, [header, ...lines].join('\n') + '\n')
	console.log(`\n  CSV записан: ${path}`)
}

async function main(): Promise<void> {
	const options = parseArgs(process.argv.slice(2))
	const apiKey = process.env.PAGESPEED_API_KEY
	const urls = collectUrls(options)

	if (urls.length === 0) {
		console.error('Нечего проверять: список адресов пуст.')
		process.exit(1)
	}

	console.log(
		`Проверяю ${urls.length} адресов, стратегия ${options.strategy}, ключ ${apiKey ? 'есть' : 'не задан'}.`
	)

	const rows: Metrics[] = []
	const failed: string[] = []

	for (const [index, url] of urls.entries()) {
		const path = cachePath(url, options.strategy)
		const cached = options.useCache ? readCache(path) : null

		if (cached) {
			rows.push({ ...cached, cached: true })
			continue
		}

		if (index > 0) await delay(REQUEST_DELAY_MS)

		process.stderr.write(`[${index + 1}/${urls.length}] ${url}\n`)

		try {
			const metrics = await fetchMetrics(url, options.strategy, apiKey)
			mkdirSync(CACHE_DIR, { recursive: true })
			writeFileSync(path, JSON.stringify(metrics, null, 2))
			rows.push(metrics)
		} catch (error) {
			failed.push(`${url}: ${(error as Error).message}`)
		}
	}

	if (options.json) {
		console.log(JSON.stringify(rows, null, 2))
	} else {
		printTable(rows, options.base)
	}

	if (options.csv) writeCsv(options.csv, rows)

	if (failed.length > 0) {
		console.error(`\n  Не удалось получить ${failed.length} адресов:`)
		for (const line of failed.slice(0, 10)) console.error(`  ${line}`)

		if (!apiKey && failed.some(line => line.includes('429'))) {
			console.error(
				'\n  Похоже на исчерпанную анонимную квоту: она считается на IP.\n' +
					'  Ключ берётся бесплатно в Google Cloud (PageSpeed Insights API),\n' +
					'  дальше PAGESPEED_API_KEY=... в .env.local и повторный запуск.'
			)
		}

		if (rows.length === 0) process.exit(1)
	}
}

main().catch((error: unknown) => {
	console.error(
		`\n✖ ${error instanceof Error ? error.message : String(error)}\n`
	)
	process.exit(1)
})

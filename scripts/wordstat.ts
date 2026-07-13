#!/usr/bin/env tsx
/**
 * Сбор частотности запросов через Wordstat API.
 *
 *   pnpm wordstat "конвертер цветов" "html дерево"
 *   pnpm wordstat --file lib/seo/phrases.txt --region 213
 *   pnpm wordstat "css градиент" --json > out.json
 *
 * Флаги:
 *   --file <path>   список фраз, по одной в строке (# — комментарий)
 *   --region <id>   регион, по умолчанию 225 (Россия); 213 — Москва
 *   --top <n>       сколько вложенных фраз запрашивать, по умолчанию 50
 *   --json          выдать сырой JSON вместо таблицы
 *   --no-cache      игнорировать кэш и сходить в API заново
 *
 * Ответы кэшируются в .cache/wordstat на 7 дней: квота — 100 запросов в час,
 * поэтому повторный прогон по той же семантике не должен её жечь.
 */

import {
	readFileSync,
	writeFileSync,
	mkdirSync,
	existsSync,
	statSync
} from 'fs'
import { join } from 'path'
import { config as loadEnv } from 'dotenv'
import {
	getTopRequests,
	readWordstatConfig,
	REGION_RUSSIA,
	type TopRequestsResult,
	type WordstatConfig
} from '../lib/seo/wordstat'

loadEnv({ path: '.env.local' })

const CACHE_DIR = '.cache/wordstat'
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000
/** 100 запросов в час — держим паузу с запасом. */
const REQUEST_DELAY_MS = 1500

interface Options {
	phrases: string[]
	region: string
	top: number
	json: boolean
	useCache: boolean
}

function parseArgs(argv: string[]): Options {
	const phrases: string[] = []
	let region = REGION_RUSSIA
	let top = 50
	let json = false
	let useCache = true

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i]

		if (arg === '--file') {
			const path = argv[++i]
			if (!path) throw new Error('--file требует путь к файлу')
			phrases.push(...readPhrasesFile(path))
		} else if (arg === '--region') {
			region = argv[++i] ?? REGION_RUSSIA
		} else if (arg === '--top') {
			top = Number(argv[++i])
			if (!Number.isFinite(top) || top < 1 || top > 2000) {
				throw new Error('--top должен быть числом от 1 до 2000')
			}
		} else if (arg === '--json') {
			json = true
		} else if (arg === '--no-cache') {
			useCache = false
		} else if (arg.startsWith('--')) {
			throw new Error(`Неизвестный флаг: ${arg}`)
		} else {
			phrases.push(arg)
		}
	}

	if (phrases.length === 0) {
		throw new Error(
			'Не задано ни одной фразы. Пример: pnpm wordstat "конвертер цветов"'
		)
	}

	return { phrases, region, top, json, useCache }
}

function readPhrasesFile(path: string): string[] {
	return readFileSync(path, 'utf-8')
		.split('\n')
		.map(line => line.trim())
		.filter(line => line.length > 0 && !line.startsWith('#'))
}

function cachePath(phrase: string, region: string, top: number): string {
	const slug = Buffer.from(`${phrase}|${region}|${top}`)
		.toString('base64url')
		.slice(0, 100)
	return join(CACHE_DIR, `${slug}.json`)
}

function readCache(path: string): TopRequestsResult | null {
	if (!existsSync(path)) return null
	if (Date.now() - statSync(path).mtimeMs > CACHE_TTL_MS) return null

	try {
		return JSON.parse(readFileSync(path, 'utf-8')) as TopRequestsResult
	} catch {
		return null
	}
}

function writeCache(path: string, data: TopRequestsResult): void {
	mkdirSync(CACHE_DIR, { recursive: true })
	writeFileSync(path, JSON.stringify(data, null, 2))
}

function delay(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms))
}

async function collect(
	config: WordstatConfig,
	options: Options
): Promise<
	Array<{ phrase: string; data: TopRequestsResult; cached: boolean }>
> {
	const collected: Array<{
		phrase: string
		data: TopRequestsResult
		cached: boolean
	}> = []

	for (const [index, phrase] of options.phrases.entries()) {
		const path = cachePath(phrase, options.region, options.top)
		const cached = options.useCache ? readCache(path) : null

		if (cached) {
			collected.push({ phrase, data: cached, cached: true })
			continue
		}

		if (index > 0) await delay(REQUEST_DELAY_MS)

		const data = await getTopRequests(config, phrase, {
			numPhrases: options.top,
			regions: [options.region]
		})

		writeCache(path, data)
		collected.push({ phrase, data, cached: false })
	}

	return collected
}

function printTable(
	collected: Array<{ phrase: string; data: TopRequestsResult; cached: boolean }>
): void {
	for (const { phrase, data, cached } of collected) {
		const suffix = cached ? ' (из кэша)' : ''
		console.log(
			`\n▸ ${phrase} — ${data.totalCount.toLocaleString('ru-RU')} показов/мес${suffix}`
		)

		const top = data.results.slice(0, 15)
		for (const item of top) {
			const count = item.count.toLocaleString('ru-RU').padStart(9)
			console.log(`  ${count}  ${item.phrase}`)
		}

		if (data.associations.length > 0) {
			const also = data.associations
				.slice(0, 8)
				.map(item => item.phrase)
				.join(', ')
			console.log(`  ищут также: ${also}`)
		}
	}
}

async function main(): Promise<void> {
	const options = parseArgs(process.argv.slice(2))
	const config = readWordstatConfig()
	const collected = await collect(config, options)

	if (options.json) {
		console.log(JSON.stringify(collected, null, 2))
	} else {
		printTable(collected)
	}
}

main().catch((error: unknown) => {
	console.error(
		`\n✖ ${error instanceof Error ? error.message : String(error)}\n`
	)
	process.exit(1)
})

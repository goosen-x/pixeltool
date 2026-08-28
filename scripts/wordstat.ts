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
	WordstatError,
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

interface Collected {
	phrase: string
	data: TopRequestsResult
	cached: boolean
}

interface CollectResult {
	collected: Collected[]
	/** Фразы, которые API так и не отдал: прогон продолжается без них. */
	skipped: string[]
}

async function collect(
	config: WordstatConfig,
	options: Options
): Promise<CollectResult> {
	const collected: Collected[] = []
	const skipped: string[] = []

	for (const [index, phrase] of options.phrases.entries()) {
		const path = cachePath(phrase, options.region, options.top)
		const cached = options.useCache ? readCache(path) : null

		if (cached) {
			collected.push({ phrase, data: cached, cached: true })
			continue
		}

		if (index > 0) await delay(REQUEST_DELAY_MS)

		// Сколько вложенных фраз просить, API решает по каждой фразе отдельно:
		// на «нумерология по дате рождения» 15 отдаётся мгновенно, а 20 уже не
		// укладывается в двадцатисекундный бюджет сервиса и приходит 499. Ступени
		// подобраны так, чтобы сначала пробовать заказанное, а потом отступать.
		const ladder = [options.top, 25, 15, 10].filter(
			(value, position, all) =>
				value <= options.top && all.indexOf(value) === position
		)

		let data: TopRequestsResult | null = null
		let lastError: unknown = null

		for (const numPhrases of ladder) {
			try {
				data = await getTopRequests(config, phrase, {
					numPhrases,
					regions: [options.region]
				})
				if (numPhrases !== options.top) {
					console.error(
						`  ! ${phrase}: API не отдал ${options.top} вложенных фраз, взято ${numPhrases}`
					)
				}
				break
			} catch (error) {
				lastError = error
				// Отступать по лестнице имеет смысл только когда сервис не справился
				// с объёмом. Неверный ключ или битый запрос от этого не починятся.
				if (!(error instanceof WordstatError) || !error.retryable) throw error
				await delay(REQUEST_DELAY_MS)
			}
		}

		if (!data) {
			// Одна тяжёлая фраза не должна ронять прогон по всей семантике:
			// остальные уже посчитанные фразы дороже, чем эта одна.
			const message =
				lastError instanceof Error ? lastError.message : String(lastError)
			console.error(`  ✖ ${phrase}: пропущена — ${message.slice(0, 120)}`)
			skipped.push(phrase)
			continue
		}

		writeCache(path, data)
		collected.push({ phrase, data, cached: false })
	}

	return { collected, skipped }
}

function printTable(collected: Collected[]): void {
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
	const { collected, skipped } = await collect(config, options)

	if (options.json) {
		console.log(JSON.stringify(collected, null, 2))
	} else {
		printTable(collected)
	}

	if (skipped.length > 0) {
		console.error(
			`\n✖ Не удалось получить ${skipped.length} из ${options.phrases.length}: ${skipped.join(', ')}`
		)
	}

	// Ненулевой код только если не получено вообще ничего: частичный результат
	// — рабочий, на нём можно строить семантику дальше.
	if (collected.length === 0) process.exit(1)
}

main().catch((error: unknown) => {
	console.error(
		`\n✖ ${error instanceof Error ? error.message : String(error)}\n`
	)
	process.exit(1)
})

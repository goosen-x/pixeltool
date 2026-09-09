// Общее состояние переобхода: что мы уже объявляли поисковикам и с какой
// датой изменения. Используют оба скрипта — indexnow.mjs (Яндекс/Bing,
// автоматически в CI) и reindex-diff.ts (Google, руками в Search Console),
// чтобы они не разъезжались в том, что считать новым.
//
// Зачем состояние вообще: раньше indexnow.mjs слал в IndexNow ВСЕ URL из
// sitemap на каждый push. Когда каждый деплой объявляет весь сайт
// изменившимся, слово «изменилось» обесценивается — ровно та же логика, что
// в комментарии про lastmod в app/sitemap.ts. Шлём дельту.
//
// Снапшоты хранятся в S3 (state/, не exchange/ — это рабочее состояние
// проекта, а не материал для второго агента) и дублируются локально, чтобы
// дифф работал одинаково с любой машины: раньше файл лежал только в
// gitignore'нутом docs/seo/ и со второго компьютера все URL выглядели новыми.
// У каждого потребителя свой ключ, см. INDEXNOW_STATE и GOOGLE_STATE.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

import { readS3Config, getObject, putObject } from './s3-state.mjs'

/**
 * У каждого потребителя своё состояние, и это принципиально: раньше снапшот
 * был общий, и IndexNow (отрабатывает в CI на каждый деплой) успевал записать
 * его первым — reindex-diff после этого показывал пустой список, потому что
 * всё уже числилось объявленным. Два независимых ключа убирают эту гонку.
 *
 * @typedef {{s3Key: string, localPath: string}} StateLocation
 */

/** Состояние IndexNow (Яндекс/Bing, автоматически в CI). */
export const INDEXNOW_STATE = {
	s3Key: 'state/pixeltool/sitemap-snapshot.tsv',
	localPath: 'docs/seo/sitemap-snapshot.txt'
}

/** Состояние ручного переобхода в Google Search Console. */
export const GOOGLE_STATE = {
	s3Key: 'state/pixeltool/google-recrawl-snapshot.tsv',
	localPath: 'docs/seo/google-recrawl-snapshot.tsv'
}

/** Сколько дней считать страницу «недавно изменённой», когда состояния ещё
 *  нет. Нужно только на первом запуске и при недоступном S3: без него выбор
 *  был бы между «молчать» и «слать все 240», и оба варианта плохие. */
const FRESH_DAYS = 7

/**
 * @typedef {{url: string, lastmod: string}} SitemapEntry
 * @typedef {{entries: SitemapEntry[], source: 's3' | 'local' | 'none'}} LoadedSnapshot
 */

/**
 * Забирает sitemap и вытаскивает пары <loc>/<lastmod>.
 * lastmod необязателен: если его нет, страница участвует только в проверке
 * «новая или нет», в проверку «изменилась» не попадает.
 * @returns {Promise<SitemapEntry[]>}
 */
export async function fetchSitemapEntries(siteUrl) {
	const res = await fetch(`${siteUrl}/sitemap.xml`)
	if (!res.ok) {
		throw new Error(`Не удалось загрузить sitemap.xml: ${res.status}`)
	}
	const xml = await res.text()

	const entries = []
	for (const block of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
		const loc = block[1].match(/<loc>(.*?)<\/loc>/)?.[1]
		if (!loc) continue
		const lastmod = block[1].match(/<lastmod>(.*?)<\/lastmod>/)?.[1] ?? ''
		// Дата приходит то как 2026-08-27, то как полный ISO — сравнивать
		// надо календарный день, иначе пересборка с новым временем выглядит
		// изменением контента.
		entries.push({ url: loc, lastmod: lastmod.slice(0, 10) })
	}

	if (entries.length === 0) {
		// Старый формат sitemap без обёртки <url> — не молчим, а падаем:
		// пустой список тут всегда означает сломанный парсинг.
		throw new Error('sitemap.xml не содержит ни одного <url> — проверь URL')
	}
	return entries
}

/** Снапшот — TSV «url<TAB>lastmod». Строки без табуляции понимаются как
 *  старый формат (голый список URL): дата неизвестна, страница считается
 *  известной, но не изменившейся, пока дата не запишется на следующем
 *  сохранении. Так переход на новый формат не выстреливает пачкой из 240. */
export function parseSnapshot(text) {
	const entries = []
	for (const rawLine of text.split('\n')) {
		const line = rawLine.trim()
		if (!line || line.startsWith('#')) continue
		const [url, lastmod = ''] = line.split('\t')
		if (url) entries.push({ url, lastmod: lastmod.trim() })
	}
	return entries
}

export function serializeSnapshot(entries) {
	const sorted = [...entries].sort((a, b) => a.url.localeCompare(b.url))
	return (
		'# url\tlastmod — что уже объявлено поисковикам. Правится скриптами,\n' +
		'# не руками: scripts/indexnow.mjs и scripts/reindex-diff.ts.\n' +
		sorted.map(entry => `${entry.url}\t${entry.lastmod}`).join('\n') +
		'\n'
	)
}

/**
 * Читает снапшот: сначала S3 (общий для всех машин), при недоступности —
 * локальную копию. Никогда не бросает: отсутствие состояния — рабочая
 * ситуация, а не сбой.
 * @returns {Promise<LoadedSnapshot>}
 */
export async function loadSnapshot(state) {
	const config = readS3Config()
	if (config) {
		try {
			const text = await getObject(config, state.s3Key)
			if (text !== null) {
				return { entries: parseSnapshot(text), source: 's3' }
			}
		} catch (error) {
			console.warn(
				`Снапшот из S3 не прочитан (${error.message}), беру локальный`
			)
		}
	}

	if (existsSync(state.localPath)) {
		const text = readFileSync(state.localPath, 'utf8')
		return { entries: parseSnapshot(text), source: 'local' }
	}
	return { entries: [], source: 'none' }
}

/**
 * Сохраняет снапшот в S3 и локально. Возвращает список того, куда реально
 * записалось, — вызывающий это печатает, чтобы «состояние не сохранилось»
 * не оставалось незамеченным.
 * @returns {Promise<string[]>}
 */
export async function saveSnapshot(entries, state) {
	const text = serializeSnapshot(entries)
	const saved = []

	const config = readS3Config()
	if (config) {
		try {
			await putObject(config, state.s3Key, text)
			saved.push('S3')
		} catch (error) {
			console.warn(`Снапшот в S3 не записан: ${error.message}`)
		}
	}

	try {
		mkdirSync(dirname(state.localPath), { recursive: true })
		writeFileSync(state.localPath, text, 'utf8')
		saved.push(state.localPath)
	} catch (error) {
		console.warn(`Снапшот локально не записан: ${error.message}`)
	}

	return saved
}

function isFresh(lastmod, today = new Date()) {
	if (!lastmod) return false
	const changed = Date.parse(lastmod)
	if (Number.isNaN(changed)) return false
	return (today.getTime() - changed) / 86400000 <= FRESH_DAYS
}

/**
 * Дельта относительно снапшота.
 *
 * Без снапшота (первый запуск, S3 недоступен) отправлять нечего сравнивать,
 * поэтому берём страницы, изменённые за последние FRESH_DAYS дней: это и не
 * молчание, и не залп по всему сайту.
 *
 * @param {SitemapEntry[]} current
 * @param {SitemapEntry[]} previous
 * @returns {{isFirstRun: boolean, added: SitemapEntry[], changed: SitemapEntry[], removed: string[], toSubmit: SitemapEntry[]}}
 */
export function computeDelta(current, previous, today = new Date()) {
	const before = new Map(previous.map(entry => [entry.url, entry.lastmod]))

	if (before.size === 0) {
		const fresh = current.filter(entry => isFresh(entry.lastmod, today))
		return {
			isFirstRun: true,
			added: [],
			changed: [],
			removed: [],
			toSubmit: fresh
		}
	}

	const added = []
	const changed = []
	for (const entry of current) {
		if (!before.has(entry.url)) {
			added.push(entry)
			continue
		}
		const knownLastmod = before.get(entry.url)
		// Пустая известная дата — наследие старого формата снапшота. Считать
		// это изменением нельзя: иначе первый же запуск после миграции
		// отправит весь сайт.
		if (knownLastmod && entry.lastmod && entry.lastmod !== knownLastmod) {
			changed.push(entry)
		}
	}

	const currentUrls = new Set(current.map(entry => entry.url))
	const removed = previous
		.map(entry => entry.url)
		.filter(url => !currentUrls.has(url))

	return {
		isFirstRun: false,
		added,
		changed,
		removed,
		toSubmit: [...added, ...changed]
	}
}

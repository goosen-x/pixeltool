/**
 * Позиция сайта в выдаче Яндекса и Google по фразе.
 *
 * Яндекс — Search API v2 того же облачного сервисного аккаунта, что и Вордстат
 * (роль `search-api.webSearch.user`, см. lib/seo/wordstat.ts): ключ и folderId
 * берутся из тех же переменных, отдельной настройки не нужно.
 *
 * Google — Custom Search JSON API. Он требует двух вещей, которых у проекта
 * пока нет: включённого customsearch в облачном проекте (сейчас ключ отдаёт
 * 403 «Requests to this API are blocked») и идентификатора программируемого
 * поисковика cx. Пока их нет, гугловая половина возвращает null, а не врёт
 * выдуманным числом.
 */

const YANDEX_API = 'https://searchapi.api.cloud.yandex.net/v2/web/search'
const GOOGLE_API = 'https://www.googleapis.com/customsearch/v1'

/** Результатов на странице выдачи у обоих движков. */
const PER_PAGE = 10

export interface SerpConfig {
	yandexApiKey: string
	yandexFolderId: string
	/** Ключ Google с включённым Custom Search API. */
	googleApiKey?: string
	/** Идентификатор программируемого поисковика (cx). */
	googleCseId?: string
}

export function readSerpConfig(): SerpConfig {
	const yandexApiKey = process.env.YANDEX_API_KEY
	const yandexFolderId = process.env.YANDEX_FOLDER_ID

	if (!yandexApiKey || !yandexFolderId) {
		throw new Error(
			'Не заданы YANDEX_API_KEY и/или YANDEX_FOLDER_ID. Пропиши их в .env.local.'
		)
	}

	return {
		yandexApiKey,
		yandexFolderId,
		googleApiKey: process.env.GOOGLE_SEARCH_API_KEY,
		googleCseId: process.env.GOOGLE_CSE_ID
	}
}

export interface SerpPosition {
	/** Позиция начиная с 1; null — не найден в просмотренной глубине. */
	position: number | null
	/** Конкретный URL, который занял эту позицию. */
	url: string | null
	/** Кто стоит выше — для оценки конкуренции. */
	top: string[]
}

function hostOf(url: string): string {
	try {
		return new URL(url).hostname.replace(/^www\./, '')
	} catch {
		return ''
	}
}

/** Одна страница выдачи Яндекса, page отсчитывается с нуля. */
async function yandexPage(
	config: SerpConfig,
	query: string,
	page: number
): Promise<string[]> {
	const response = await fetch(YANDEX_API, {
		method: 'POST',
		headers: {
			Authorization: `Api-Key ${config.yandexApiKey}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			query: {
				searchType: 'SEARCH_TYPE_RU',
				queryText: query,
				page
			},
			folderId: config.yandexFolderId,
			responseFormat: 'FORMAT_XML'
		})
	})

	if (!response.ok) {
		throw new Error(
			`Yandex search → HTTP ${response.status}: ${(await response.text()).slice(0, 200)}`
		)
	}

	const { rawData } = (await response.json()) as { rawData?: string }
	if (!rawData) return []

	const xml = Buffer.from(rawData, 'base64').toString('utf-8')
	// В XML-ответе Яндекса адрес документа лежит в <url>; порядок вхождений
	// совпадает с порядком выдачи.
	return [...xml.matchAll(/<url>(.*?)<\/url>/g)].map(m => m[1])
}

export async function findInYandex(
	config: SerpConfig,
	query: string,
	site: string,
	maxPages = 3
): Promise<SerpPosition> {
	const top: string[] = []

	for (let page = 0; page < maxPages; page++) {
		const urls = await yandexPage(config, query, page)
		if (urls.length === 0) break

		for (const [index, url] of urls.entries()) {
			if (page === 0 && index < 10) top.push(hostOf(url))
			if (hostOf(url).endsWith(site)) {
				return { position: page * PER_PAGE + index + 1, url, top }
			}
		}
	}

	return { position: null, url: null, top }
}

export async function findInGoogle(
	config: SerpConfig,
	query: string,
	site: string,
	maxPages = 3
): Promise<SerpPosition | null> {
	// Без ключа и cx честно отвечаем «не измеряли» вместо выдуманного числа.
	if (!config.googleApiKey || !config.googleCseId) return null

	const top: string[] = []

	for (let page = 0; page < maxPages; page++) {
		const url = new URL(GOOGLE_API)
		url.searchParams.set('key', config.googleApiKey)
		url.searchParams.set('cx', config.googleCseId)
		url.searchParams.set('q', query)
		url.searchParams.set('num', String(PER_PAGE))
		url.searchParams.set('start', String(page * PER_PAGE + 1))
		url.searchParams.set('hl', 'ru')
		url.searchParams.set('gl', 'ru')

		const response = await fetch(url)
		if (!response.ok) {
			throw new Error(
				`Google search → HTTP ${response.status}: ${(await response.text()).slice(0, 200)}`
			)
		}

		const data = (await response.json()) as { items?: Array<{ link: string }> }
		const items = data.items ?? []
		if (items.length === 0) break

		for (const [index, item] of items.entries()) {
			if (page === 0 && index < 10) top.push(hostOf(item.link))
			if (hostOf(item.link).endsWith(site)) {
				return {
					position: page * PER_PAGE + index + 1,
					url: item.link,
					top
				}
			}
		}
	}

	return { position: null, url: null, top }
}

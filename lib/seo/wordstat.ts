/**
 * Клиент Wordstat API (методы сервиса Yandex Search API).
 *
 * Авторизация: API-ключ сервисного аккаунта Yandex Cloud с ролью
 * `search-api.webSearch.user`. folderId передаётся в теле запроса, не в заголовке.
 *
 * Квота: 100 запросов в час, 10 в секунду. Часовой лимит — главное ограничение,
 * поэтому вызовы кэшируются на диск (см. scripts/wordstat.ts).
 *
 * Тарификация: topRequests и dynamics — 20 ₽/1000 запросов, regions — 50 ₽/1000,
 * getRegionsTree бесплатен.
 *
 * Документация: https://aistudio.yandex.ru/docs/ru/search-api/concepts/wordstat
 */

const API_BASE = 'https://searchapi.api.cloud.yandex.net/v2/wordstat'

/** Москва. Полное дерево регионов — метод getRegionsTree. */
export const REGION_MOSCOW = '213'
/** Россия. */
export const REGION_RUSSIA = '225'

export type Device = 'DEVICE_ALL' | 'DESKTOP' | 'MOBILE' | 'PHONE' | 'TABLET'
export type Period = 'PERIOD_MONTHLY' | 'PERIOD_WEEKLY' | 'PERIOD_DAILY'

export interface WordstatPhrase {
	phrase: string
	count: number
}

export interface TopRequestsResult {
	/** Частотность самой фразы. */
	totalCount: number
	/** Фразы, содержащие исходную (то, что в вебе показано слева). */
	results: WordstatPhrase[]
	/** «Что ещё искали» — правая колонка Вордстата. Максимум 20 штук. */
	associations: WordstatPhrase[]
}

export interface DynamicsPoint {
	/** Начало периода, ISO-строка от API. */
	fromDate: string
	toDate: string
	count: number
}

export interface RegionCount {
	regionId: string
	regionName: string
	count: number
	/** Доля региона в общем числе запросов, %. */
	share: number
	/** Аффинити-индекс: >100 — тема популярнее, чем в среднем по стране. */
	index: number
}

export interface WordstatConfig {
	apiKey: string
	folderId: string
}

/** int64 приходит из API строкой — приводим к числу. */
function toNumber(value: unknown): number {
	const n = Number(value)
	return Number.isFinite(n) ? n : 0
}

export function readWordstatConfig(): WordstatConfig {
	const apiKey = process.env.YANDEX_API_KEY
	const folderId = process.env.YANDEX_FOLDER_ID

	if (!apiKey || !folderId) {
		throw new Error(
			'Не заданы YANDEX_API_KEY и/или YANDEX_FOLDER_ID. Пропиши их в .env.local.'
		)
	}

	return { apiKey, folderId }
}

/**
 * Ошибка запроса к API с сохранённым HTTP-статусом: вызывающему коду нужно
 * отличать «сервис не смог посчитать» от «неверный ключ», чтобы решить,
 * повторять запрос или падать сразу.
 */
export class WordstatError extends Error {
	constructor(
		readonly status: number,
		message: string
	) {
		super(message)
		this.name = 'WordstatError'
	}

	/**
	 * Есть ли смысл повторять. 499 («cancelled received from server») API
	 * отдаёт, когда не уложился в свои 20 секунд, 429 — при упоре в квоту,
	 * 5xx — при сбое на его стороне. Всё это лечится повтором, а 401 и 400 нет.
	 */
	get retryable(): boolean {
		return this.status === 499 || this.status === 429 || this.status >= 500
	}
}

/** Сколько ждать перед повтором: 1, 2, 4 секунды. */
const RETRY_DELAYS_MS = [1000, 2000, 4000]

function sleep(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms))
}

async function request<T>(
	config: WordstatConfig,
	method: string,
	body: Record<string, unknown>
): Promise<T> {
	let lastError: WordstatError | null = null

	for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
		if (attempt > 0) await sleep(RETRY_DELAYS_MS[attempt - 1])

		const response = await fetch(`${API_BASE}/${method}`, {
			method: 'POST',
			headers: {
				Authorization: `Api-Key ${config.apiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ ...body, folderId: config.folderId })
		})

		if (response.ok) return response.json() as Promise<T>

		const text = await response.text()
		lastError = new WordstatError(
			response.status,
			`Wordstat ${method} → HTTP ${response.status}: ${text}`
		)

		if (!lastError.retryable) throw lastError
	}

	throw lastError
}

/**
 * Частотность фразы и топ запросов, её содержащих, за последние 30 дней.
 *
 * Поддерживает операторы Вордстата: "точная фраза", !словоформа, -минус-слово.
 */
export async function getTopRequests(
	config: WordstatConfig,
	phrase: string,
	options: {
		numPhrases?: number
		regions?: string[]
		devices?: Device[]
	} = {}
): Promise<TopRequestsResult> {
	const { numPhrases = 100, regions = [REGION_RUSSIA], devices } = options

	const raw = await request<{
		totalCount?: string
		results?: Array<{ phrase: string; count: string }>
		associations?: Array<{ phrase: string; count: string }>
	}>(config, 'topRequests', {
		phrase,
		// Дефолт из документации не срабатывает — валидация требует явное значение.
		numPhrases,
		regions,
		...(devices ? { devices } : {})
	})

	return {
		totalCount: toNumber(raw.totalCount),
		results: (raw.results ?? []).map(item => ({
			phrase: item.phrase,
			count: toNumber(item.count)
		})),
		associations: (raw.associations ?? []).map(item => ({
			phrase: item.phrase,
			count: toNumber(item.count)
		}))
	}
}

/**
 * Динамика частотности по периодам.
 *
 * Операторы Вордстата работают полностью только при PERIOD_DAILY;
 * при неделях и месяцах поддерживается лишь оператор `+`.
 */
export async function getDynamics(
	config: WordstatConfig,
	phrase: string,
	options: {
		fromDate: Date
		toDate: Date
		period?: Period
		regions?: string[]
		devices?: Device[]
	}
): Promise<DynamicsPoint[]> {
	const {
		fromDate,
		toDate,
		period = 'PERIOD_MONTHLY',
		regions = [REGION_RUSSIA],
		devices
	} = options

	const raw = await request<{
		dynamics?: Array<{ fromDate: string; toDate: string; count: string }>
	}>(config, 'dynamics', {
		phrase,
		period,
		fromDate: fromDate.toISOString(),
		toDate: toDate.toISOString(),
		regions,
		...(devices ? { devices } : {})
	})

	return (raw.dynamics ?? []).map(point => ({
		fromDate: point.fromDate,
		toDate: point.toDate,
		count: toNumber(point.count)
	}))
}

/** Распределение запросов по регионам за последние 30 дней. */
export async function getRegionsDistribution(
	config: WordstatConfig,
	phrase: string,
	options: { regions?: string[]; devices?: Device[] } = {}
): Promise<RegionCount[]> {
	const raw = await request<{
		regions?: Array<{
			regionId: string
			regionName: string
			count: string
			share: number
			index: number
		}>
	}>(config, 'regions', {
		phrase,
		...(options.regions ? { regions: options.regions } : {}),
		...(options.devices ? { devices: options.devices } : {})
	})

	return (raw.regions ?? []).map(region => ({
		regionId: region.regionId,
		regionName: region.regionName,
		count: toNumber(region.count),
		share: region.share,
		index: region.index
	}))
}

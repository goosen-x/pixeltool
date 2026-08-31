import { HttpsProxyAgent } from 'https-proxy-agent'
import https from 'https'
import http from 'http'

/**
 * Запрос наружу через HTTP-прокси — для площадок, до которых прод-сервер не
 * достаёт напрямую.
 *
 * Тот же барьер, что описан в lib/telegram/proxy-fetch.ts: TCP на 443 молча
 * дропается на уровне провайдера, а не файрволом сервера. Под него попадают
 * t.me, youtube.com, instagram.com, при этом habr.com, x.com и vk.com с того
 * же сервера открываются нормально. Раньше валидатор Open Graph объяснял это
 * тем, что площадки якобы блокируют запросы с хостингов, — проверка 31.08.2026
 * показала обратное: t.me и youtube.com отдают полный набор og-тегов любому
 * клиенту, если до них удаётся дойти. Проблема была в маршруте, а не в них.
 *
 * Адрес берётся из OUTBOUND_PROXY_URL, а если её нет — из TELEGRAM_PROXY_URL:
 * прокси там уже настроен и работает, отдельная переменная нужна только если
 * когда-нибудь захочется развести эти два потока.
 */

export function getOutboundProxyUrl(): string | null {
	const raw = process.env.OUTBOUND_PROXY_URL ?? process.env.TELEGRAM_PROXY_URL
	if (!raw) return null

	const first = raw
		.split(',')
		.map(url => url.trim())
		.filter(Boolean)[0]

	return first ?? null
}

/**
 * Ошибки уровня соединения, при которых имеет смысл повторить через прокси.
 * Ответ сайта — пусть даже 403 или 500 — сюда не попадает: это уже разговор
 * состоялся, и прокси его не изменит.
 */
export function isConnectionFailure(error: unknown): boolean {
	if (!(error instanceof Error)) return false

	const cause = error.cause
	const code =
		typeof cause === 'object' && cause !== null && 'code' in cause
			? String((cause as { code?: unknown }).code)
			: ''

	return (
		code === 'ETIMEDOUT' ||
		code === 'UND_ERR_CONNECT_TIMEOUT' ||
		code === 'ECONNREFUSED' ||
		code === 'ECONNRESET' ||
		code === 'EHOSTUNREACH' ||
		code === 'ENETUNREACH'
	)
}

/**
 * Один запрос через прокси, без следования редиректам: их разбирает
 * вызывающий код (safeFetch), потому что каждый переход нужно проверять
 * на SSRF отдельно.
 */
export function fetchViaProxy(
	url: URL,
	init: RequestInit = {},
	timeoutMs = 15000
): Promise<Response> {
	const proxyUrl = getOutboundProxyUrl()
	if (!proxyUrl) return Promise.reject(new Error('Прокси не настроен'))

	const agent = new HttpsProxyAgent(proxyUrl)
	const transport = url.protocol === 'http:' ? http : https

	return new Promise((resolve, reject) => {
		const request = transport.request(
			{
				hostname: url.hostname,
				port: url.port || (url.protocol === 'http:' ? 80 : 443),
				// pathname + search, а не один pathname: у ссылок вида
				// youtube.com/watch?v=... вся суть в query, и без него сайт
				// отдаёт совсем другую страницу.
				path: url.pathname + url.search,
				method: init.method || 'GET',
				headers: (init.headers as Record<string, string>) ?? {},
				agent,
				timeout: timeoutMs
			},
			response => {
				const chunks: Buffer[] = []
				response.on('data', chunk => chunks.push(chunk))
				response.on('end', () => {
					const headers = new Headers()
					for (const [key, value] of Object.entries(response.headers)) {
						if (typeof value === 'string') headers.set(key, value)
						else if (Array.isArray(value)) headers.set(key, value.join(', '))
					}

					resolve(
						new Response(Buffer.concat(chunks), {
							status: response.statusCode ?? 200,
							headers
						})
					)
				})
			}
		)

		request.setTimeout(timeoutMs, () => {
			request.destroy(new Error('Прокси не ответил вовремя'))
		})
		request.on('error', reject)
		request.end()
	})
}

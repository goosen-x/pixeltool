import { lookup } from 'dns/promises'
import {
	fetchViaProxy,
	getOutboundProxyUrl,
	isConnectionFailure
} from './outbound-proxy'
import type { LookupAddress } from 'dns'
import { isIP } from 'net'

/**
 * Защита от SSRF для роутов, которые ходят по адресу, присланному пользователем.
 *
 * Без неё через такой роут можно попросить сервер сходить на localhost или на
 * 169.254.169.254 (метаданные облака с ключами доступа). Проверяем и литеральный
 * IP в адресе, и то, во что резолвится домен.
 */

/** Адреса, по которым публичному серверу ходить незачем. */
export function isPrivateAddress(ip: string): boolean {
	if (
		ip === '::1' ||
		ip === '::' ||
		ip.startsWith('fe80') ||
		ip.startsWith('fc') ||
		ip.startsWith('fd')
	) {
		return true
	}

	// IPv4, в том числе завёрнутый в IPv6 (::ffff:10.0.0.1).
	const v4 = ip.replace(/^::ffff:/i, '')
	const parts = v4.split('.').map(Number)
	if (parts.length !== 4 || parts.some(n => !Number.isInteger(n))) return false

	const [a, b] = parts
	return (
		a === 0 ||
		a === 10 ||
		a === 127 ||
		(a === 169 && b === 254) || // link-local и метаданные облака
		(a === 172 && b >= 16 && b <= 31) ||
		(a === 192 && b === 168) ||
		(a === 100 && b >= 64 && b <= 127) // CGNAT
	)
}

/** Бросает, если хост — литеральный приватный IP или резолвится в такой. */
export async function assertPublicHost(hostname: string): Promise<void> {
	if (isIP(hostname)) {
		if (isPrivateAddress(hostname)) {
			throw new Error('Адрес ведёт во внутреннюю сеть')
		}
		return
	}

	let addresses: LookupAddress[]
	try {
		addresses = await lookup(hostname, { all: true })
	} catch {
		throw new Error('Не удалось найти такой адрес в сети')
	}

	if (addresses.some(entry => isPrivateAddress(entry.address))) {
		throw new Error('Адрес ведёт во внутреннюю сеть')
	}
}

/**
 * Разбирает пользовательский ввод в URL (достраивая https://) и проверяет его
 * на пригодность: только http/https и только публичный адрес.
 */
export async function toSafePublicUrl(input: string): Promise<URL> {
	const url = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`)

	if (!['http:', 'https:'].includes(url.protocol)) {
		throw new Error('Поддерживаются только http и https')
	}

	await assertPublicHost(url.hostname)
	return url
}

const MAX_REDIRECTS = 5

/** Сколько ждём прямого ответа, прежде чем пробовать прокси. */
const DIRECT_ATTEMPT_TIMEOUT_MS = 6000

/**
 * fetch() с проверкой каждого хопа редиректа, не только исходного адреса.
 *
 * Обычный `fetch(url, { redirect: 'follow' })` проверяет SSRF один раз, до
 * запроса, а дальше молча идёт за любым Location — сайт может ответить 302 на
 * 169.254.169.254 и обойти assertPublicHost на исходном хосте. Здесь каждый
 * Location проходит ту же проверку, прежде чем на него пойти. `redirect:
 * 'manual'` в Node/undici (в отличие от браузерного fetch) отдаёт настоящий
 * статус и заголовок Location, а не непрозрачный ответ.
 */
/**
 * Один переход: сначала напрямую, при обрыве соединения — через прокси.
 *
 * До части площадок (t.me, youtube.com, instagram.com) прод-сервер не достаёт:
 * TCP молча дропается на уровне провайдера, см. lib/security/outbound-proxy.ts.
 * Прокси пробуем только на ошибках соединения — если сайт ответил хоть чем-то,
 * даже 403, повторять через прокси незачем, ответ будет тот же.
 *
 * Прямой попытке даётся меньше времени, когда прокси настроен: иначе на
 * заблокированном адресе пользователь ждал бы сначала полный таймаут прямого
 * запроса, а потом ещё и проксированный.
 */
async function fetchOneHop(url: URL, init: RequestInit): Promise<Response> {
	const proxyConfigured = getOutboundProxyUrl() !== null

	try {
		return await fetch(url.toString(), {
			...init,
			redirect: 'manual',
			...(proxyConfigured
				? { signal: AbortSignal.timeout(DIRECT_ATTEMPT_TIMEOUT_MS) }
				: {})
		})
	} catch (error) {
		const timedOut = error instanceof Error && error.name === 'TimeoutError'
		if (!proxyConfigured || !(isConnectionFailure(error) || timedOut)) {
			throw error
		}

		try {
			return await fetchViaProxy(url, { ...init, redirect: 'manual' })
		} catch {
			// Наружу отдаём исходную ошибку соединения, а не «прокси не
			// ответил»: для пользователя это одна и та же ситуация — до сайта
			// не дошли, — и вызывающий код разбирает её по коду. Иначе
			// instagram.com, который через прокси упирается в редирект на
			// логин, выдавал человеку 500 с рассказом про наш прокси.
			throw error
		}
	}
}

export async function safeFetch(
	url: URL,
	init: RequestInit = {}
): Promise<Response> {
	let current = url

	for (let hop = 0; ; hop++) {
		const response = await fetchOneHop(current, init)

		const location = response.headers.get('location')
		if (response.status < 300 || response.status >= 400 || !location) {
			return response
		}

		if (hop >= MAX_REDIRECTS) {
			throw new Error('Слишком много редиректов')
		}

		let next: URL
		try {
			next = new URL(location, current)
		} catch {
			throw new Error('Редирект ведёт на некорректный адрес')
		}

		if (!['http:', 'https:'].includes(next.protocol)) {
			throw new Error('Редирект ведёт на неподдерживаемый протокол')
		}

		await assertPublicHost(next.hostname)
		current = next
	}
}

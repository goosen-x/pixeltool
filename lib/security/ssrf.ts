import { lookup } from 'dns/promises'
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

	const addresses = await lookup(hostname, { all: true })
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

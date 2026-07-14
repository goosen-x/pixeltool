import { NextRequest, NextResponse } from 'next/server'
import { JSDOM } from 'jsdom'
import { lookup } from 'dns/promises'
import { isIP } from 'net'

/**
 * Поиск фавикона чужого сайта по адресу.
 *
 * Живёт на сервере, потому что из браузера чужую страницу не забрать — CORS.
 * А раз мы ходим по произвольному адресу, который прислал пользователь, роут
 * обязан защищаться от SSRF: иначе через него можно попросить сервер сходить
 * на localhost или на 169.254.169.254 (метаданные облака с ключами доступа).
 */

const FETCH_TIMEOUT_MS = 8000
/** Не тянем гигантские страницы — фавикон объявляется в <head>. */
const MAX_HTML_BYTES = 512 * 1024

/** Адреса, по которым публичному сайту ходить незачем. */
function isPrivateAddress(ip: string): boolean {
	if (ip === '::1' || ip === '::' || ip.startsWith('fe80') || ip.startsWith('fc') || ip.startsWith('fd')) {
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

async function assertPublicHost(hostname: string): Promise<void> {
	// Литеральный IP в адресе проверяем сразу, без DNS.
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

interface FoundIcon {
	url: string
	/** Что было написано в rel: icon, apple-touch-icon, shortcut icon. */
	rel: string
	/** sizes из разметки, если указан. */
	sizes: string | null
	contentType: string | null
	bytes: number | null
	reachable: boolean
}

async function probe(url: string, rel: string, sizes: string | null): Promise<FoundIcon> {
	try {
		const response = await fetch(url, {
			method: 'GET',
			signal: AbortSignal.timeout(5000),
			headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PixelTool/1.0)' }
		})

		const buffer = response.ok
			? await response.arrayBuffer()
			: new ArrayBuffer(0)

		return {
			url,
			rel,
			sizes,
			contentType: response.headers.get('content-type'),
			bytes: response.ok ? buffer.byteLength : null,
			// Пустой файл отдают вместо 404 достаточно часто, чтобы это проверять.
			reachable: response.ok && buffer.byteLength > 0
		}
	} catch {
		return { url, rel, sizes, contentType: null, bytes: null, reachable: false }
	}
}

export async function GET(request: NextRequest) {
	const input = request.nextUrl.searchParams.get('url')

	if (!input) {
		return NextResponse.json({ error: 'Не передан адрес сайта' }, { status: 400 })
	}

	let target: URL
	try {
		// Человек вводит «example.com» — достраиваем протокол.
		target = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`)
	} catch {
		return NextResponse.json({ error: 'Не похоже на адрес сайта' }, { status: 400 })
	}

	if (!['http:', 'https:'].includes(target.protocol)) {
		return NextResponse.json(
			{ error: 'Поддерживаются только http и https' },
			{ status: 400 }
		)
	}

	try {
		await assertPublicHost(target.hostname)
	} catch {
		return NextResponse.json(
			{ error: 'Такой адрес запрашивать нельзя' },
			{ status: 400 }
		)
	}

	try {
		const response = await fetch(target.toString(), {
			signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
			headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PixelTool/1.0)' }
		})

		if (!response.ok) {
			return NextResponse.json(
				{ error: `Сайт ответил ${response.status}` },
				{ status: 400 }
			)
		}

		const html = (await response.text()).slice(0, MAX_HTML_BYTES)
		// Разбираем от конечного адреса: по дороге могли быть редиректы.
		const finalUrl = response.url || target.toString()
		const document = new JSDOM(html).window.document

		const declared = Array.from(
			document.querySelectorAll('link[rel~="icon"], link[rel~="apple-touch-icon"]')
		)
			.map(node => {
				const href = node.getAttribute('href')
				if (!href) return null
				try {
					return {
						url: new URL(href, finalUrl).toString(),
						rel: node.getAttribute('rel') ?? 'icon',
						sizes: node.getAttribute('sizes')
					}
				} catch {
					return null
				}
			})
			.filter((item): item is { url: string; rel: string; sizes: string | null } => item !== null)

		// Даже если в разметке ничего нет, браузер сам просит /favicon.ico.
		const fallback = new URL('/favicon.ico', finalUrl).toString()
		if (!declared.some(item => item.url === fallback)) {
			declared.push({ url: fallback, rel: 'по умолчанию', sizes: null })
		}

		const unique = declared.filter(
			(item, index) => declared.findIndex(other => other.url === item.url) === index
		)

		const icons = await Promise.all(
			unique.slice(0, 10).map(item => probe(item.url, item.rel, item.sizes))
		)

		return NextResponse.json({
			site: finalUrl,
			title: document.querySelector('title')?.textContent?.trim() ?? '',
			icons: icons.sort((a, b) => Number(b.reachable) - Number(a.reachable))
		})
	} catch (error) {
		const message =
			error instanceof Error && error.name === 'TimeoutError'
				? 'Сайт слишком долго не отвечает'
				: 'Не удалось получить страницу'
		return NextResponse.json({ error: message }, { status: 502 })
	}
}

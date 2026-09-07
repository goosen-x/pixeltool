import { NextRequest, NextResponse } from 'next/server'
import { JSDOM } from 'jsdom'
import {
	assertPublicHost,
	toSafePublicUrl,
	safeFetch
} from '@/lib/security/ssrf'

const MANUALLY =
	'Посмотреть теги можно вручную: откройте страницу в браузере, нажмите Ctrl+U (на Mac — Cmd+Option+U) и найдите на странице og:.'

/**
 * Площадки, у которых проверка предсказуемо не проходит, — с объяснением про
 * каждую отдельно.
 *
 * Общий текст «сайт не пускает автоматические проверки» человека не
 * успокаивает: он видит, что ссылка у него открывается, и решает, что сломан
 * инструмент. Поэтому про крупные площадки говорим прямо и называем их по
 * имени. Поведение проверено запросами с прод-сервера 07.09.2026, коды в
 * тексте — те, что они отдают на самом деле; Telegram, YouTube и X в этот
 * список не входят, потому что сейчас проверяются нормально.
 */
const KNOWN_SITES: { pattern: RegExp; message: string }[] = [
	{
		pattern: /(^|\.)wildberries\.ru$/i,
		message: `Wildberries не отдаёт карточки автоматическим проверкам — на запрос с сервера он отвечает кодом 498. Превью для соцсетей площадка формирует сама, поэтому увидеть теги отсюда не получится. ${MANUALLY}`
	},
	{
		pattern: /(^|\.)ozon\.ru$/i,
		message: `Ozon уводит автоматические запросы в бесконечную цепочку переадресаций — так устроена его защита от ботов, и проверка останавливается, не дойдя до страницы. ${MANUALLY}`
	},
	{
		pattern: /(^|\.)avito\.ru$/i,
		message: `Avito отвечает на запросы с серверов кодом 439 — это его защита от автоматических обращений. ${MANUALLY}`
	},
	{
		pattern: /(^|\.)(instagram\.com|facebook\.com|fb\.com|threads\.net)$/i,
		message: `Эта площадка отдаёт страницы только авторизованному браузеру: запрос без входа она либо отклоняет, либо не отвечает на него вовсе. Так же ведут себя её ссылки в режиме инкогнито. ${MANUALLY}`
	},
	{
		pattern: /(^|\.)(dzen\.ru|zen\.yandex\.ru)$/i,
		message: `Дзен закрывает статьи от автоматических проверок. ${MANUALLY}`
	}
]

function knownSiteMessage(hostname: string): string | null {
	return KNOWN_SITES.find(site => site.pattern.test(hostname))?.message ?? null
}

/**
 * Ответ об ошибке, в которой мы не виноваты: чужой сайт не пустил, лёг,
 * отвечает не туда или в адресе опечатка.
 *
 * Флаг expected читает клиент и не заводит по такому случаю авто-отчёт в
 * обратную связь. За три недели 22 из 27 сообщений в канале оказались именно
 * такими — блокировки Telegram и YouTube, ошибки Wildberries и Facebook,
 * несуществующие домены. Разбирать в них было нечего, а настоящие отчёты в
 * этом потоке терялись.
 */
function expected(message: string, status: number) {
	return NextResponse.json({ error: message, expected: true }, { status })
}

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url)
	const url = searchParams.get('url')

	if (!url) {
		return expected('Введите адрес страницы, которую нужно проверить.', 400)
	}

	// Валидация формата и защита от SSRF (см. lib/security/ssrf): без нее
	// url мог вести на localhost или на метаданные облака.
	let parsedUrl: URL
	try {
		parsedUrl = await toSafePublicUrl(url)
	} catch (error) {
		const message =
			error instanceof Error ? error.message : 'Некорректный адрес'
		return expected(message, 400)
	}

	try {
		// Fetch the webpage
		const controller = new AbortController()
		const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

		// Ходим под браузерным User-Agent и браузерными заголовками: ботовый UA
		// с датацентр-IP крупные сайты за Cloudflare/CDN режут (запрос висит до
		// таймаута). Реалистичные заголовки проходят большинство базовых фильтров.
		const response = await safeFetch(parsedUrl, {
			signal: controller.signal,
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
				Accept:
					'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
				'Accept-Language': 'ru,en;q=0.9'
			}
		})

		clearTimeout(timeoutId)

		if (!response.ok) {
			// Сайт мог реально не ответить, а мог и оказаться статикой на S3/CDN
			// без серверного роутинга: она отдаёт настоящий 403/404 на любой
			// путь без объекта и дорисовывает страницу уже в браузере через JS,
			// которого мы не выполняем (найдено 27.08.2026 на реальном отчёте
			// об ошибке: tumanvpn.ru/ref/... открывается у живого человека, а
			// нашему fetch честно отвечает 403). Поэтому не выдаём голый код
			// ошибки за поломанную ссылку.
			// Голый код ответа человеку ничего не говорит, а причины у кодов
			// разные: 403 от защиты сайта, 404 от опечатки в ссылке и 502 от
			// чужой аварии требуют от него совершенно разных действий.
			const known = knownSiteMessage(parsedUrl.hostname)
			if (known) return expected(known, 400)

			const manually =
				'Если ссылка открывается у вас в браузере, посмотрите теги вручную: откройте её, нажмите Ctrl+U (на Mac — Cmd+Option+U) и найдите на странице og:.'

			if ([401, 403, 429, 498, 999].includes(response.status)) {
				return expected(
					`Сайт не пускает автоматические проверки — он ответил кодом ${response.status}. Так делают соцсети и площадки с защитой от ботов: живой браузер они пускают, а запрос с сервера нет. ${manually}`,
					400
				)
			}

			if (response.status === 404 || response.status === 410) {
				return expected(
					'По этому адресу страницы нет. Проверьте ссылку: возможно, в ней опечатка или страницу уже удалили.',
					400
				)
			}

			if (response.status >= 500) {
				return expected(
					`У сайта сейчас неполадки: он ответил ошибкой ${response.status}. Это на его стороне — попробуйте повторить проверку позже.`,
					400
				)
			}

			return expected(
				`Сайт ответил ошибкой ${response.status}. Так бывает, когда он собирает страницу уже в браузере, а нашему запросу отдавать нечего. ${manually}`,
				400
			)
		}

		const html = await response.text()

		// Parse HTML with JSDOM
		const dom = new JSDOM(html)
		const document = dom.window.document

		// Extract Open Graph tags
		const ogTags: Record<string, string> = {}
		const metaTags = document.querySelectorAll('meta[property^="og:"]')
		metaTags.forEach((tag: Element) => {
			const property = tag.getAttribute('property')
			const content = tag.getAttribute('content')
			if (property && content) {
				ogTags[property] = content
			}
		})

		// Extract Twitter Card tags
		const twitterTags: Record<string, string> = {}
		const twitterMetaTags = document.querySelectorAll('meta[name^="twitter:"]')
		twitterMetaTags.forEach((tag: Element) => {
			const name = tag.getAttribute('name')
			const content = tag.getAttribute('content')
			if (name && content) {
				twitterTags[name] = content
			}
		})

		// Extract additional meta tags
		const additionalTags: Record<string, string> = {}
		const allMetaTags = document.querySelectorAll('meta')
		allMetaTags.forEach((tag: Element) => {
			const property = tag.getAttribute('property')
			const name = tag.getAttribute('name')
			const content = tag.getAttribute('content')

			if (content) {
				if (
					property &&
					!property.startsWith('og:') &&
					!property.startsWith('twitter:')
				) {
					additionalTags[property] = content
				} else if (name && !name.startsWith('twitter:')) {
					additionalTags[name] = content
				}
			}
		})

		// Extract basic HTML data
		const title = document.querySelector('title')?.textContent || ''
		const description =
			document
				.querySelector('meta[name="description"]')
				?.getAttribute('content') || ''
		const canonicalUrl =
			document.querySelector('link[rel="canonical"]')?.getAttribute('href') ||
			''

		const htmlData = {
			title,
			description,
			canonicalUrl,
			url: response.url // Final URL after redirects
		}

		// Analyze image accessibility if og:image is present. og:image в HTML
		// сайта часто относительный ("/images/cover.jpg") — резолвим в абсолютный
		// URL и подменяем им ogTags, иначе клиент попытается загрузить картинку
		// с домена pixeltool.pro вместо домена проверяемого сайта.
		let imageData = null
		if (ogTags['og:image']) {
			try {
				const imageUrl = new URL(ogTags['og:image'], parsedUrl)

				// og:image приходит из HTML проверяемого сайта, а не от нашего
				// пользователя, тот же SSRF-риск, что и с исходным адресом.
				await assertPublicHost(imageUrl.hostname)
				ogTags['og:image'] = imageUrl.toString()

				const imageResponse = await safeFetch(imageUrl, {
					method: 'HEAD',
					signal: AbortSignal.timeout(5000)
				})

				imageData = {
					accessible: imageResponse.ok,
					contentType: imageResponse.headers.get('content-type'),
					contentLength: imageResponse.headers.get('content-length')
				}
			} catch {
				imageData = {
					accessible: false,
					error:
						'Картинку из og:image не удалось загрузить — проверьте, открывается ли она по прямой ссылке.'
				}
			}
		}

		return NextResponse.json({
			ogTags,
			twitterTags,
			additionalTags,
			htmlData,
			imageData,
			fetchedAt: new Date().toISOString()
		})
	} catch (error) {
		console.error('OpenGraph validation error:', error)

		if (error instanceof Error) {
			if (error.name === 'AbortError') {
				return expected(
					'Сайт не ответил за 15 секунд, проверка остановлена. Попробуйте ещё раз — возможно, он сейчас перегружен.',
					408
				)
			}

			// "fetch failed", сетевая ошибка на уровне TCP/DNS/TLS, без HTTP-
			// ответа вообще (сайт лёг, обрубил соединение, битый сертификат).
			// Отличается от ответа сайта с кодом ошибки, который ловится выше.
			if (error.message.includes('fetch failed')) {
				// ETIMEDOUT/UND_ERR_CONNECT_TIMEOUT в error.cause — TCP-
				// подключение не устанавливается вообще (SYN уходит, ответа
				// нет), а не рвётся уже после установки. Два разных кода за
				// одним и тем же явлением: ETIMEDOUT — таймаут самого Node
				// (net), UND_ERR_CONNECT_TIMEOUT — свой, более короткий
				// таймаут undici, который иногда срабатывает раньше. Какой
				// из них долетит первым — гонка, зависит от площадки.
				// Проверено 28.08.2026 напрямую с прод-сервера через
				// docker exec + fetch на нескольких площадках: youtube.com
				// (UND_ERR_CONNECT_TIMEOUT), t.me и instagram.com (ETIMEDOUT)
				// висят именно так, при этом x.com/facebook.com/vk.com/habr.com
				// с того же сервера открываются нормально.
				//
				// Раньше здесь стоял текст о том, что эти площадки блокируют
				// запросы с хостингов. Проверка 31.08.2026 по жалобам показала,
				// что это неверно: t.me и youtube.com отдают полный набор
				// og-тегов любому клиенту, который до них дошёл, — четыре тега
				// у Telegram и сорок у YouTube. Дело было в маршруте с нашего
				// сервера, и теперь safeFetch на таких ошибках повторяет запрос
				// через прокси (lib/security/outbound-proxy.ts). Сюда попадают
				// только случаи, когда не сработал и он.
				const cause = error.cause
				const isConnectTimeout =
					typeof cause === 'object' &&
					cause !== null &&
					'code' in cause &&
					(cause.code === 'ETIMEDOUT' ||
						cause.code === 'UND_ERR_CONNECT_TIMEOUT')

				const knownNetwork = knownSiteMessage(parsedUrl.hostname)
				if (knownNetwork) return expected(knownNetwork, 502)

				if (isConnectTimeout) {
					return expected(
						'До сайта не удалось достучаться. Скорее всего, он работает, но не отвечает на запросы с нашего сервера — так ведут себя Telegram, Instagram и YouTube. Посмотрите теги вручную: откройте ссылку в браузере, нажмите Ctrl+U (на Mac — Cmd+Option+U) и найдите на странице og:.',
						502
					)
				}

				return expected(
					'Не удалось соединиться с сайтом. Проверьте, открывается ли ссылка у вас в браузере: если открывается, повторите проверку через минуту.',
					502
				)
			}

			// Бесконечная переадресация — типовая защита от ботов (так делает
			// Ozon), а не сбой у нас: сообщение из safeFetch уже человеческое.
			if (error.message.includes('перенаправляет')) {
				return expected(
					knownSiteMessage(parsedUrl.hostname) ??
						`${error.message} ${MANUALLY}`,
					400
				)
			}

			return NextResponse.json(
				{
					error:
						'Не получилось проверить эту страницу. Попробуйте другой адрес или повторите позже.'
				},
				{ status: 500 }
			)
		}

		return NextResponse.json(
			{ error: 'Что-то пошло не так на нашей стороне. Попробуйте ещё раз.' },
			{ status: 500 }
		)
	}
}

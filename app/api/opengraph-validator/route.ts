import { NextRequest, NextResponse } from 'next/server'
import { JSDOM } from 'jsdom'
import { assertPublicHost, toSafePublicUrl } from '@/lib/security/ssrf'

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url)
	const url = searchParams.get('url')

	if (!url) {
		return NextResponse.json({ error: 'Не передан адрес' }, { status: 400 })
	}

	// Валидация формата и защита от SSRF (см. lib/security/ssrf): без нее
	// url мог вести на localhost или на метаданные облака.
	let parsedUrl: URL
	try {
		parsedUrl = await toSafePublicUrl(url)
	} catch (error) {
		const message =
			error instanceof Error ? error.message : 'Некорректный адрес'
		return NextResponse.json({ error: message }, { status: 400 })
	}

	try {
		// Fetch the webpage
		const controller = new AbortController()
		const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

		// Ходим под браузерным User-Agent и браузерными заголовками: ботовый UA
		// с датацентр-IP крупные сайты за Cloudflare/CDN режут (запрос висит до
		// таймаута). Реалистичные заголовки проходят большинство базовых фильтров.
		const response = await fetch(parsedUrl.toString(), {
			signal: controller.signal,
			redirect: 'follow',
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
			return NextResponse.json(
				{
					error: `Сайт ответил ошибкой ${response.status} ${response.statusText}. Часть сайтов блокирует автоматические проверки или отдаёт содержимое через JavaScript, которого сервер не выполняет, и если ссылка открывается в браузере, дело именно в этом.`
				},
				{ status: 400 }
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

				const imageResponse = await fetch(imageUrl.toString(), {
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
					error: 'Не удалось проверить доступность og:image'
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
				return NextResponse.json(
					{ error: 'Сайт слишком долго не отвечал, проверка прервана' },
					{ status: 408 }
				)
			}

			// "fetch failed", сетевая ошибка на уровне TCP/DNS/TLS, без HTTP-
			// ответа вообще (сайт лёг, обрубил соединение, битый сертификат).
			// Отличается от ответа сайта с кодом ошибки, который ловится выше.
			if (error.message.includes('fetch failed')) {
				// ETIMEDOUT в error.cause — TCP-подключение не устанавливается
				// вообще (SYN уходит, ответа нет), а не рвётся уже после
				// установки. Проверено 28.08.2026 напрямую с прод-сервера на
				// нескольких площадках: youtube.com, t.me, instagram.com висят
				// именно так, при этом x.com/facebook.com/vk.com/habr.com с
				// того же сервера открываются нормально — это не общая
				// проблема сети, а блокировка конкретных площадок против
				// скрейпинга по IP хостинга (частая практика для видео/фото/
				// мессенджеров). Список таких площадок будет расти сам по
				// себе, поэтому не перечисляем домены — просто честно
				// объясняем природу ошибки по коду, а не советуем повторить
				// попытку, которая для ETIMEDOUT никогда не поможет.
				const cause = error.cause
				const isConnectTimeout =
					typeof cause === 'object' &&
					cause !== null &&
					'code' in cause &&
					cause.code === 'ETIMEDOUT'

				if (isConnectTimeout) {
					return NextResponse.json(
						{
							error:
								'Сайт не отвечает на подключение с этого сервера — часто так делают YouTube, Telegram, Instagram и подобные площадки, которые блокируют автоматические запросы от хостингов, а не временный сбой сети. Повтор попытки не поможет. Открыть Open Graph теги можно через «Просмотр кода страницы» в браузере (Ctrl+U / Cmd+Option+U), поиск по meta property="og:".'
						},
						{ status: 502 }
					)
				}

				return NextResponse.json(
					{
						error:
							'Не удалось подключиться к сайту. Возможно, временная проблема сети, попробуйте ещё раз, или сайт сейчас недоступен.'
					},
					{ status: 502 }
				)
			}

			return NextResponse.json(
				{ error: `Не удалось проверить адрес: ${error.message}` },
				{ status: 500 }
			)
		}

		return NextResponse.json(
			{ error: 'Произошла непредвиденная ошибка' },
			{ status: 500 }
		)
	}
}

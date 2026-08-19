import { HttpsProxyAgent } from 'https-proxy-agent'
import https from 'https'

/**
 * Прод-сервер не может напрямую достучаться до api.telegram.org — TCP на 443
 * молча дропается на уровне провайдера/аплинка (ICMP и обычный HTTPS до
 * других хостов при этом работают, файрвол сервера ни при чём — проверено).
 * Без прокси api.telegram.org недостижим вообще, поэтому запросы к Telegram
 * идут через HTTP-прокси, а не через обычный fetch.
 *
 * Та же проблема и то же решение уже были в другом проекте (autozorro.club,
 * lib/telegram-gateway/client.ts) — код перенесён оттуда почти без изменений.
 */

function getProxyUrls(): string[] {
	const raw = process.env.TELEGRAM_PROXY_URL
	if (!raw) return []
	return raw
		.split(',')
		.map(url => url.trim())
		.filter(Boolean)
}

function fetchViaProxy(
	url: string,
	options: RequestInit,
	proxyUrl: string
): Promise<Response> {
	const agent = new HttpsProxyAgent(proxyUrl)

	return new Promise((resolve, reject) => {
		const parsedUrl = new URL(url)
		const body = options.body as string

		const req = https.request(
			{
				hostname: parsedUrl.hostname,
				port: 443,
				path: parsedUrl.pathname,
				method: options.method || 'POST',
				headers: options.headers as Record<string, string>,
				agent,
				timeout: 15000
			},
			res => {
				let data = ''
				res.on('data', chunk => (data += chunk))
				res.on('end', () => {
					resolve(
						new Response(data, {
							status: res.statusCode || 200,
							headers: res.headers as Record<string, string>
						})
					)
				})
			}
		)

		req.setTimeout(15000, () => {
			req.destroy(new Error('Proxy request timeout'))
		})
		req.on('error', reject)
		if (body) req.write(body)
		req.end()
	})
}

/**
 * fetch с фолбэком через список прокси из TELEGRAM_PROXY_URL (через запятую).
 * Без переменной — обычный fetch напрямую (на случай, если блокировку когда-
 * нибудь снимут и прокси перестанет быть нужен).
 */
export async function telegramFetch(
	url: string,
	options: RequestInit
): Promise<Response> {
	const proxyUrls = getProxyUrls()
	if (proxyUrls.length === 0) {
		return fetch(url, options)
	}

	for (let i = 0; i < proxyUrls.length; i++) {
		try {
			return await fetchViaProxy(url, options, proxyUrls[i])
		} catch (error) {
			const proxyHost = proxyUrls[i].replace(/\/\/.*@/, '//***@')
			console.error(
				`[Telegram] Прокси ${i + 1}/${proxyUrls.length} (${proxyHost}) не сработал:`,
				(error as Error).message
			)
			if (i === proxyUrls.length - 1) throw error
		}
	}

	throw new Error('Все прокси недоступны')
}

/**
 * Отправить простое HTML-сообщение в общий чат уведомлений сайта
 * (TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID) через telegramFetch выше.
 */
export async function sendTelegramMessage(text: string): Promise<void> {
	const botToken = process.env.TELEGRAM_BOT_TOKEN
	const chatId = process.env.TELEGRAM_CHAT_ID

	if (!botToken || !chatId) {
		throw new Error('Telegram credentials not configured')
	}

	const response = await telegramFetch(
		`https://api.telegram.org/bot${botToken}/sendMessage`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				chat_id: chatId,
				text,
				parse_mode: 'HTML',
				disable_web_page_preview: true
			})
		}
	)

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}))
		throw new Error(
			`Telegram API error: ${errorData.description || response.status}`
		)
	}
}

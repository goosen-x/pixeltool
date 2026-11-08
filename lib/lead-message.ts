/* eslint-disable no-console */
// Единый формат заявки для бота лидов. Одинаковый файл во всех проектах
// GooseLabs: меняешь здесь, переноси и туда.
//
// Все заявки со всех сайтов идут в один бот и чат (TELEGRAM_LEADS_BOT_TOKEN,
// TELEGRAM_LEADS_CHAT_ID). Хэштеги в первой строке позволяют отфильтровать
// заявки по сайту и форме прямо в Telegram.

import { ATTRIBUTION_PARAMS, type Attribution, type Touch } from './attribution'

export type LeadField = [
	label: string,
	value: string | boolean | null | undefined
]

export interface Lead {
	/** Домен сайта, например gooselabs.ru */
	site: string
	/** Хэштег сайта латиницей: gooselabs, pixeltool, portfolio */
	siteTag: string
	/** Название формы по-человечески */
	form: string
	/** Хэштег формы латиницей: quiz, brief, contact */
	formTag: string
	fields: LeadField[]
	/** Сырые данные с клиента, проверяются здесь же */
	attribution?: unknown
}

type Fetcher = (url: string, init: RequestInit) => Promise<Response>

const MAX_TEXT = 4000

export function escapeHtml(value: unknown): string {
	return String(value ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
}

function clean(value: unknown, max = 500): string | undefined {
	if (typeof value !== 'string') return undefined
	const trimmed = value.trim()
	return trimmed ? trimmed.slice(0, max) : undefined
}

function parseTouch(input: unknown): Touch | undefined {
	if (!input || typeof input !== 'object') return undefined
	const src = input as Record<string, unknown>
	const touch: Touch = {}
	for (const key of [
		...ATTRIBUTION_PARAMS,
		'referrer',
		'landing',
		'at'
	] as const) {
		const value = clean(src[key])
		if (value) touch[key] = value
	}
	return Object.keys(touch).length ? touch : undefined
}

// Данные приходят из браузера, поэтому берём только известные поля и режем длину.
export function parseAttribution(input: unknown): Attribution | undefined {
	if (!input || typeof input !== 'object') return undefined
	const src = input as Record<string, unknown>
	const result: Attribution = {
		page: clean(src.page),
		first: parseTouch(src.first),
		last: parseTouch(src.last),
		ymClientId: clean(src.ymClientId, 64)
	}
	return Object.values(result).some(Boolean) ? result : undefined
}

function describeTouch(touch: Touch): string {
	const parts: string[] = []
	if (touch.utm_source) {
		parts.push(
			[touch.utm_source, touch.utm_medium, touch.utm_campaign]
				.filter(Boolean)
				.join(' / ')
		)
		if (touch.utm_content) parts.push(`content: ${touch.utm_content}`)
		if (touch.utm_term) parts.push(`term: ${touch.utm_term}`)
	} else if (touch.yclid) {
		parts.push('Яндекс Директ (yclid, без UTM)')
	} else if (touch.gclid) {
		parts.push('Google Ads (gclid, без UTM)')
	} else if (touch.referrer) {
		try {
			parts.push(`переход с ${new URL(touch.referrer).host}`)
		} catch {
			parts.push(`переход с ${touch.referrer}`)
		}
	} else {
		parts.push('прямой заход')
	}
	if (touch.landing) parts.push(`вход: ${touch.landing}`)
	return parts.join(' · ')
}

function formatDate(iso?: string): string {
	if (!iso) return ''
	const date = new Date(iso)
	if (Number.isNaN(date.getTime())) return ''
	return date.toLocaleString('ru-RU', {
		timeZone: 'Europe/Moscow',
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	})
}

function sameSource(a?: Touch, b?: Touch): boolean {
	if (!a || !b) return false
	return describeTouch(a) === describeTouch(b) && a.at === b.at
}

export function formatAttribution(attribution?: Attribution): string[] {
	const lines = ['', '<b>📍 Откуда</b>']
	if (!attribution) {
		lines.push('нет данных (браузер не передал источник)')
		return lines
	}
	const { page, first, last, ymClientId } = attribution
	if (page) lines.push(`Страница: ${escapeHtml(page)}`)
	if (last) lines.push(`Источник: ${escapeHtml(describeTouch(last))}`)
	if (first && !sameSource(first, last)) {
		lines.push(
			`Первый визит ${escapeHtml(formatDate(first.at))}: ${escapeHtml(describeTouch(first))}`
		)
	}
	const referrer = last?.referrer || first?.referrer
	if (referrer) lines.push(`Реферер: ${escapeHtml(referrer)}`)
	const yclid = last?.yclid || first?.yclid
	if (yclid) lines.push(`yclid: <code>${escapeHtml(yclid)}</code>`)
	const gclid = last?.gclid || first?.gclid
	if (gclid) lines.push(`gclid: <code>${escapeHtml(gclid)}</code>`)
	if (ymClientId)
		lines.push(`ClientID Метрики: <code>${escapeHtml(ymClientId)}</code>`)
	return lines
}

function hashtag(value: string): string {
	return `#${value.replace(/[^\p{L}\p{N}_]/gu, '_')}`
}

export function formatLeadMessage(lead: Lead): string {
	const lines = [
		`${hashtag('lead')} ${hashtag(lead.siteTag)} ${hashtag(lead.formTag)}`,
		`🚀 <b>Заявка · ${escapeHtml(lead.site)}</b>`,
		`Форма: ${escapeHtml(lead.form)}`,
		''
	]
	for (const [label, value] of lead.fields) {
		if (value === undefined || value === null || value === '') continue
		const text = typeof value === 'boolean' ? (value ? 'да' : 'нет') : value
		lines.push(
			text.includes('\n')
				? `<b>${escapeHtml(label)}:</b>\n${escapeHtml(text)}`
				: `<b>${escapeHtml(label)}:</b> ${escapeHtml(text)}`
		)
	}
	lines.push(...formatAttribution(parseAttribution(lead.attribution)))
	lines.push('', `🕒 ${escapeHtml(formatDate(new Date().toISOString()))} МСК`)
	const text = lines.join('\n')
	// Лимит Telegram 4096 символов; обрезаем с запасом, чтобы заявка не потерялась.
	return text.length > MAX_TEXT
		? `${text.slice(0, MAX_TEXT)}\n…(обрезано)`
		: text
}

export async function sendLead(
	lead: Lead,
	fetcher: Fetcher = fetch
): Promise<boolean> {
	const token = process.env.TELEGRAM_LEADS_BOT_TOKEN
	const chatId = process.env.TELEGRAM_LEADS_CHAT_ID
	if (!token || !chatId) {
		console.error(
			'TELEGRAM_LEADS_BOT_TOKEN или TELEGRAM_LEADS_CHAT_ID не заданы'
		)
		return false
	}
	try {
		const response = await fetcher(
			`https://api.telegram.org/bot${token}/sendMessage`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					chat_id: chatId,
					text: formatLeadMessage(lead),
					parse_mode: 'HTML',
					disable_web_page_preview: true
				})
			}
		)
		if (!response.ok) {
			console.error('Заявка не доставлена в Telegram:', await response.text())
			return false
		}
		return true
	} catch (error) {
		console.error('Заявка не доставлена в Telegram:', error)
		return false
	}
}

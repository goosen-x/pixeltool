// Источник визита для сквозной аналитики. Одинаковый файл во всех проектах
// GooseLabs (gooselabs.ru, pixeltool.pro, portfolio.gooselabs.ru): меняешь
// здесь, переноси и туда.
//
// Первое касание записывается один раз и не перезаписывается. Последнее
// обновляется, когда человек приходит с новыми метками или с другого сайта.
// ClientID Метрики берём из cookie _ym_uid: по нему заявку можно найти
// в отчётах Метрики и загрузить офлайн-конверсию.

export const ATTRIBUTION_PARAMS = [
	'utm_source',
	'utm_medium',
	'utm_campaign',
	'utm_content',
	'utm_term',
	'yclid',
	'gclid'
] as const

type AttributionParam = (typeof ATTRIBUTION_PARAMS)[number]

export type Touch = Partial<Record<AttributionParam, string>> & {
	referrer?: string
	landing?: string
	at?: string
}

export interface Attribution {
	page?: string
	first?: Touch
	last?: Touch
	ymClientId?: string
}

const STORAGE_KEY = 'gl_attribution_v1'

function read(): { first?: Touch; last?: Touch } {
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
	} catch {
		return {}
	}
}

function write(value: { first?: Touch; last?: Touch }) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
	} catch {
		// приватный режим или запрещённое хранилище: заявка уйдёт без истории
	}
}

function externalReferrer(): string | undefined {
	const ref = document.referrer
	if (!ref) return undefined
	try {
		return new URL(ref).host === location.host ? undefined : ref
	} catch {
		return undefined
	}
}

// Вызывается на каждой загрузке и смене страницы.
export function captureAttribution() {
	if (typeof window === 'undefined') return
	const params = new URLSearchParams(location.search)
	const touch: Touch = {}
	for (const key of ATTRIBUTION_PARAMS) {
		const value = params.get(key)
		if (value) touch[key] = value.slice(0, 300)
	}
	const hasMarks = Object.keys(touch).length > 0
	const referrer = externalReferrer()
	if (referrer) touch.referrer = referrer.slice(0, 500)
	touch.landing = (location.pathname + location.search).slice(0, 500)
	touch.at = new Date().toISOString()

	const stored = read()
	if (!stored.first) stored.first = touch
	if (hasMarks || referrer || !stored.last) stored.last = touch
	write(stored)
}

function readCookie(name: string): string | undefined {
	const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
	return match ? decodeURIComponent(match[1]) : undefined
}

// Что отправить вместе с заявкой.
export function getAttribution(): Attribution | undefined {
	if (typeof window === 'undefined') return undefined
	const stored = read()
	return {
		page: location.href.slice(0, 500),
		first: stored.first,
		last: stored.last,
		ymClientId: readCookie('_ym_uid')
	}
}

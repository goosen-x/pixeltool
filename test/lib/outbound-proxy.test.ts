import { describe, it, expect, afterEach } from 'vitest'
import {
	getOutboundProxyUrl,
	isConnectionFailure
} from '@/lib/security/outbound-proxy'

const saved = {
	outbound: process.env.OUTBOUND_PROXY_URL,
	telegram: process.env.TELEGRAM_PROXY_URL
}

afterEach(() => {
	process.env.OUTBOUND_PROXY_URL = saved.outbound
	process.env.TELEGRAM_PROXY_URL = saved.telegram
	if (saved.outbound === undefined) delete process.env.OUTBOUND_PROXY_URL
	if (saved.telegram === undefined) delete process.env.TELEGRAM_PROXY_URL
})

describe('getOutboundProxyUrl', () => {
	it('берёт собственную переменную, если она есть', () => {
		process.env.OUTBOUND_PROXY_URL = 'http://a:1'
		process.env.TELEGRAM_PROXY_URL = 'http://b:2'

		expect(getOutboundProxyUrl()).toBe('http://a:1')
	})

	it('падает обратно на телеграмный прокси — он уже настроен на проде', () => {
		delete process.env.OUTBOUND_PROXY_URL
		process.env.TELEGRAM_PROXY_URL = 'http://b:2'

		expect(getOutboundProxyUrl()).toBe('http://b:2')
	})

	it('из списка через запятую берёт первый', () => {
		process.env.OUTBOUND_PROXY_URL = ' http://a:1 , http://b:2 '

		expect(getOutboundProxyUrl()).toBe('http://a:1')
	})

	it('без переменных возвращает null, и тогда прокси просто не используется', () => {
		delete process.env.OUTBOUND_PROXY_URL
		delete process.env.TELEGRAM_PROXY_URL

		expect(getOutboundProxyUrl()).toBeNull()
	})
})

describe('isConnectionFailure', () => {
	const withCode = (code: string) =>
		Object.assign(new Error('fetch failed'), { cause: { code } })

	it('узнаёт обрывы соединения, на которых имеет смысл пробовать прокси', () => {
		for (const code of [
			'ETIMEDOUT',
			'UND_ERR_CONNECT_TIMEOUT',
			'ECONNREFUSED',
			'ECONNRESET',
			'EHOSTUNREACH',
			'ENETUNREACH'
		]) {
			expect(isConnectionFailure(withCode(code)), code).toBe(true)
		}
	})

	it('не считает обрывом ответ сайта: 403 через прокси останется 403', () => {
		expect(isConnectionFailure(new Error('HTTP 403'))).toBe(false)
		expect(isConnectionFailure(withCode('ERR_UNKNOWN'))).toBe(false)
	})

	it('не падает на том, что не является ошибкой', () => {
		expect(isConnectionFailure(null)).toBe(false)
		expect(isConnectionFailure('строка')).toBe(false)
		expect(isConnectionFailure(undefined)).toBe(false)
	})
})

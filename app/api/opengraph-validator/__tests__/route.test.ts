import { describe, it, expect, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('dns/promises', () => {
	const lookup = vi.fn(async () => [{ address: '109.196.103.242', family: 4 }])
	return { lookup, default: { lookup } }
})

import { GET } from '../route'
import { tlsCertMessage } from '../tls-errors'

function tlsFailure(code: string) {
	return new TypeError('fetch failed', { cause: { code } })
}

async function check(url: string) {
	const response = await GET(
		new NextRequest(
			`http://localhost/api/opengraph-validator?url=${encodeURIComponent(url)}`
		)
	)
	return { status: response.status, body: await response.json() }
}

describe('tlsCertMessage', () => {
	it('объясняет сертификат на чужой домен', () => {
		expect(
			tlsCertMessage(tlsFailure('ERR_TLS_CERT_ALTNAME_INVALID'))
		).toMatch(/выписан на другой домен/)
	})

	it('объясняет истёкший и самоподписанный сертификат', () => {
		expect(tlsCertMessage(tlsFailure('CERT_HAS_EXPIRED'))).toMatch(/истёк/)
		expect(tlsCertMessage(tlsFailure('DEPTH_ZERO_SELF_SIGNED_CERT'))).toMatch(
			/самоподписанный/
		)
	})

	it('не трогает прочие сетевые ошибки', () => {
		expect(tlsCertMessage(tlsFailure('ECONNREFUSED'))).toBeNull()
		expect(tlsCertMessage(new Error('fetch failed'))).toBeNull()
		expect(tlsCertMessage('строка')).toBeNull()
	})
})

describe('GET /api/opengraph-validator', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	// Отзыв 24.11.2026: https://og:inbox@yuriyp.ru. Логин отбрасываем, а сам сайт
	// отдаёт сертификат от scan-build.ru: человек должен узнать именно это.
	it('называет проблему с сертификатом, а не «не удалось соединиться»', async () => {
		const fetchMock = vi.fn(async () => {
			throw tlsFailure('ERR_TLS_CERT_ALTNAME_INVALID')
		})
		vi.stubGlobal('fetch', fetchMock)

		const { status, body } = await check('https://og:inbox@yuriyp.ru')

		expect(fetchMock.mock.calls[0][0]).toBe('https://yuriyp.ru/')
		expect(status).toBe(502)
		expect(body.expected).toBe(true)
		expect(body.error).toMatch(/выписан на другой домен/)
	})

	it('обычный обрыв соединения по-прежнему отвечает общим текстом', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => {
				throw tlsFailure('ECONNREFUSED')
			})
		)

		const { body } = await check('https://example.ru')

		expect(body.error).toMatch(/Не удалось соединиться с сайтом/)
	})
})

import { describe, it, expect, vi, afterEach } from 'vitest'
import { isPrivateAddress, safeFetch } from '../ssrf'

describe('isPrivateAddress', () => {
	it('помечает частные диапазоны IPv4', () => {
		expect(isPrivateAddress('127.0.0.1')).toBe(true)
		expect(isPrivateAddress('10.0.0.5')).toBe(true)
		expect(isPrivateAddress('192.168.1.1')).toBe(true)
		expect(isPrivateAddress('169.254.169.254')).toBe(true)
	})

	it('пропускает публичные адреса', () => {
		expect(isPrivateAddress('93.184.216.34')).toBe(false)
		expect(isPrivateAddress('8.8.8.8')).toBe(false)
	})
})

describe('safeFetch', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	// IP-литералы в URL, чтобы не завязываться на DNS в тестах — isPrivateAddress
	// коротким путём проверяет их без резолва.

	it('следует за редиректом на публичный адрес', async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce(
				new Response(null, {
					status: 302,
					headers: { location: 'http://93.184.216.34/final' }
				})
			)
			.mockResolvedValueOnce(new Response('ok', { status: 200 }))
		vi.stubGlobal('fetch', fetchMock)

		const response = await safeFetch(new URL('http://93.184.216.34/start'))

		expect(response.status).toBe(200)
		expect(fetchMock).toHaveBeenCalledTimes(2)
		expect(fetchMock.mock.calls[1][0]).toBe('http://93.184.216.34/final')
	})

	it('блокирует редирект на приватный адрес', async () => {
		const fetchMock = vi.fn().mockResolvedValueOnce(
			new Response(null, {
				status: 302,
				headers: { location: 'http://169.254.169.254/latest/meta-data/' }
			})
		)
		vi.stubGlobal('fetch', fetchMock)

		await expect(
			safeFetch(new URL('http://93.184.216.34/start'))
		).rejects.toThrow('Адрес ведёт во внутреннюю сеть')
		expect(fetchMock).toHaveBeenCalledTimes(1)
	})

	it('обрывает слишком длинную цепочку редиректов', async () => {
		const fetchMock = vi.fn().mockImplementation(
			async () =>
				new Response(null, {
					status: 302,
					headers: { location: 'http://93.184.216.34/next' }
				})
		)
		vi.stubGlobal('fetch', fetchMock)

		await expect(
			safeFetch(new URL('http://93.184.216.34/start'))
		).rejects.toThrow('Слишком много редиректов')
	})

	it('блокирует редирект на file:// в обход http/https', async () => {
		const fetchMock = vi.fn().mockResolvedValueOnce(
			new Response(null, {
				status: 302,
				headers: { location: 'file:///etc/passwd' }
			})
		)
		vi.stubGlobal('fetch', fetchMock)

		await expect(
			safeFetch(new URL('http://93.184.216.34/start'))
		).rejects.toThrow('неподдерживаемый протокол')
	})

	it('отдаёт ответ без редиректа как есть', async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce(new Response('ok', { status: 200 }))
		vi.stubGlobal('fetch', fetchMock)

		const response = await safeFetch(new URL('http://93.184.216.34/start'))

		expect(response.status).toBe(200)
		expect(fetchMock).toHaveBeenCalledTimes(1)
	})
})

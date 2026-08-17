import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createRateLimiter } from '@/lib/tool-stats/rate-limit'

describe('createRateLimiter', () => {
	beforeEach(() => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('разрешает запросы, пока не превышен лимит', () => {
		const limiter = createRateLimiter(3, 60_000)
		expect(limiter.check('1.2.3.4')).toBe(true)
		expect(limiter.check('1.2.3.4')).toBe(true)
		expect(limiter.check('1.2.3.4')).toBe(true)
	})

	it('блокирует запрос сверх лимита в одном окне', () => {
		const limiter = createRateLimiter(2, 60_000)
		limiter.check('1.2.3.4')
		limiter.check('1.2.3.4')
		expect(limiter.check('1.2.3.4')).toBe(false)
	})

	it('не путает разные ключи', () => {
		const limiter = createRateLimiter(1, 60_000)
		expect(limiter.check('a')).toBe(true)
		expect(limiter.check('b')).toBe(true)
	})

	it('снова разрешает после истечения окна', () => {
		const limiter = createRateLimiter(1, 60_000)
		limiter.check('1.2.3.4')
		expect(limiter.check('1.2.3.4')).toBe(false)
		vi.advanceTimersByTime(61_000)
		expect(limiter.check('1.2.3.4')).toBe(true)
	})
})

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

	// Внутренняя эвикция пустых записей из Map (см. rate-limit.ts) не меняет
	// наблюдаемое поведение check() — публичный API не даёт заглянуть в Map,
	// поэтому здесь только фиксируем, что поведение для крайнего случая
	// limit=0 (сразу отклоняющего каждую проверку) не сломалось.
	it('отклоняет каждую проверку при limit=0 без падений', () => {
		const limiter = createRateLimiter(0, 60_000)
		expect(limiter.check('spoofed-key')).toBe(false)
		expect(limiter.check('spoofed-key')).toBe(false)
	})
})

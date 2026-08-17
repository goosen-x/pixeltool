import { describe, it, expect } from 'vitest'
import { todayViewKey, ratedKey } from '@/lib/tool-stats/storage-keys'

describe('todayViewKey', () => {
	it('включает id тула и дату в формате YYYY-MM-DD', () => {
		const now = new Date('2026-08-17T15:30:00Z')
		expect(todayViewKey('qr-generator', now)).toBe(
			'pixeltool:viewed:qr-generator:2026-08-17'
		)
	})

	it('разные дни дают разные ключи', () => {
		const day1 = new Date('2026-08-17T23:59:00Z')
		const day2 = new Date('2026-08-18T00:01:00Z')
		expect(todayViewKey('qr-generator', day1)).not.toBe(
			todayViewKey('qr-generator', day2)
		)
	})

	it('разные тулы в один день дают разные ключи', () => {
		const now = new Date('2026-08-17T12:00:00Z')
		expect(todayViewKey('qr-generator', now)).not.toBe(
			todayViewKey('json-tools', now)
		)
	})
})

describe('ratedKey', () => {
	it('строит ключ по id тула', () => {
		expect(ratedKey('qr-generator')).toBe('pixeltool:rated:qr-generator')
	})
})

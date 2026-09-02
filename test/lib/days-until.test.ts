import { describe, it, expect } from 'vitest'
import {
	countdownTo,
	daysBetween,
	getTargetBySlug,
	nextOccurrence,
	RECURRING_TARGETS,
	startOfDay,
	workdaysBetween
} from '@/lib/utils/days-until'

const d = (y: number, m: number, day: number, h = 12) =>
	new Date(y, m - 1, day, h)

describe('daysBetween', () => {
	it('соседние дни', () => {
		expect(daysBetween(d(2026, 9, 1), d(2026, 9, 2))).toBe(1)
	})

	it('время суток не влияет', () => {
		expect(daysBetween(d(2026, 9, 1, 23), d(2026, 9, 2, 1))).toBe(1)
		expect(daysBetween(d(2026, 9, 1, 0), d(2026, 9, 1, 23))).toBe(0)
	})

	it('прошедшая дата даёт отрицательное', () => {
		expect(daysBetween(d(2026, 9, 10), d(2026, 9, 1))).toBe(-9)
	})

	it('через переход на летнее время сутки остаются целыми', () => {
		// В конце марта во многих поясах сутки короче или длиннее
		const days = daysBetween(d(2026, 3, 20), d(2026, 4, 20))
		expect(days).toBe(31)
	})

	it('високосный февраль', () => {
		expect(daysBetween(d(2024, 2, 1), d(2024, 3, 1))).toBe(29)
		expect(daysBetween(d(2026, 2, 1), d(2026, 3, 1))).toBe(28)
	})
})

describe('startOfDay', () => {
	it('обнуляет время', () => {
		const s = startOfDay(d(2026, 9, 1, 17))
		expect(s.getHours()).toBe(0)
		expect(s.getDate()).toBe(1)
	})
})

describe('workdaysBetween', () => {
	it('полная неделя даёт пять рабочих', () => {
		// понедельник 2026-09-07 → понедельник 2026-09-14
		expect(workdaysBetween(d(2026, 9, 7), d(2026, 9, 14))).toBe(5)
	})

	it('выходные не считаются', () => {
		// пятница → понедельник
		expect(workdaysBetween(d(2026, 9, 11), d(2026, 9, 14))).toBe(1)
	})

	it('прошедшая дата даёт ноль', () => {
		expect(workdaysBetween(d(2026, 9, 14), d(2026, 9, 7))).toBe(0)
	})

	it('рабочих дней не больше календарных', () => {
		const from = d(2026, 1, 1)
		const to = d(2026, 12, 31)
		expect(workdaysBetween(from, to)).toBeLessThan(daysBetween(from, to))
	})
})

describe('countdownTo', () => {
	it('раскладывает дни на недели и остаток', () => {
		const c = countdownTo(d(2026, 9, 24), d(2026, 9, 1))
		expect(c.days).toBe(23)
		expect(c.weeks).toBe(3)
		expect(c.daysAfterWeeks).toBe(2)
	})

	it('сегодня — это ноль дней, а не прошедшая дата', () => {
		const c = countdownTo(d(2026, 9, 1, 8), d(2026, 9, 1, 20))
		expect(c.days).toBe(0)
		expect(c.isToday).toBe(true)
		expect(c.passed).toBe(false)
	})

	it('прошедшая дата помечается', () => {
		const c = countdownTo(d(2026, 8, 1), d(2026, 9, 1))
		expect(c.passed).toBe(true)
		expect(c.days).toBeLessThan(0)
		expect(c.weeks).toBe(0)
	})
})

describe('повторяющиеся даты', () => {
	it('все слаги уникальны', () => {
		const slugs = RECURRING_TARGETS.map(t => t.slug)
		expect(new Set(slugs).size).toBe(slugs.length)
	})

	it('поиск по слагу', () => {
		expect(getTargetBySlug('novyy-god')?.name).toBe('Новый год')
		expect(getTargetBySlug('нет-такого')).toBeUndefined()
	})

	it('будущая дата этого года берётся как есть', () => {
		const next = nextOccurrence({ month: 12, day: 31 }, d(2026, 9, 1))
		expect(next.getFullYear()).toBe(2026)
	})

	it('прошедшая дата переносится на следующий год', () => {
		const next = nextOccurrence({ month: 3, day: 8 }, d(2026, 9, 1))
		expect(next.getFullYear()).toBe(2027)
		expect(next.getMonth()).toBe(2)
	})

	it('сегодняшняя дата считается наступающей, а не прошедшей', () => {
		const next = nextOccurrence({ month: 9, day: 1 }, d(2026, 9, 1, 15))
		expect(next.getFullYear()).toBe(2026)
		expect(countdownTo(next, d(2026, 9, 1, 15)).isToday).toBe(true)
	})

	it('до любой повторяющейся даты всегда неотрицательное число дней', () => {
		const now = d(2026, 9, 2)
		for (const target of RECURRING_TARGETS) {
			expect(
				countdownTo(nextOccurrence(target, now), now).days
			).toBeGreaterThanOrEqual(0)
		}
	})
})

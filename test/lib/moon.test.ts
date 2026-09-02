import { describe, it, expect } from 'vitest'
import {
	getMoonState,
	moonFraction,
	moonMonth,
	nextFullMoon,
	nextNewMoon,
	phaseFromFraction,
	PHASES,
	REFERENCE_NEW_MOON,
	SYNODIC_MONTH
} from '@/lib/utils/moon'

const DAY_MS = 86_400_000

describe('фаза от доли цикла', () => {
	it('ноль и единица — новолуние', () => {
		expect(phaseFromFraction(0).id).toBe('new')
		expect(phaseFromFraction(0.999).id).toBe('new')
	})

	it('половина — полнолуние', () => {
		expect(phaseFromFraction(0.5).id).toBe('full')
	})

	it('четверти на своих местах', () => {
		expect(phaseFromFraction(0.25).id).toBe('first-quarter')
		expect(phaseFromFraction(0.75).id).toBe('last-quarter')
	})

	it('растущие фазы помечены растущими', () => {
		for (const f of [0.05, 0.25, 0.4]) {
			expect(phaseFromFraction(f).waxing).toBe(true)
		}
		for (const f of [0.55, 0.75, 0.9]) {
			expect(phaseFromFraction(f).waxing).toBe(false)
		}
	})

	it('любая доля цикла попадает в известную фазу', () => {
		for (let f = 0; f < 1; f += 0.001) {
			expect(PHASES[phaseFromFraction(f).id]).toBeDefined()
		}
	})

	it('новолуние занимает около суток, а не неделю', () => {
		let newMoonDays = 0
		for (let f = 0; f < 1; f += 0.0001) {
			if (phaseFromFraction(f).id === 'new') newMoonDays += 0.0001
		}
		const days = newMoonDays * SYNODIC_MONTH
		expect(days).toBeGreaterThan(0.5)
		expect(days).toBeLessThan(1.5)
	})
})

describe('опорная точка', () => {
	it('в опорное новолуние доля цикла нулевая', () => {
		expect(moonFraction(new Date(REFERENCE_NEW_MOON))).toBeCloseTo(0, 6)
	})

	it('в опорное новолуние фаза — новолуние, освещённость около нуля', () => {
		const state = getMoonState(new Date(REFERENCE_NEW_MOON))
		expect(state.phase.id).toBe('new')
		expect(state.illumination).toBeCloseTo(0, 6)
		expect(state.lunarDay).toBe(1)
	})

	it('через половину месяца — полнолуние с полной освещённостью', () => {
		const half = new Date(REFERENCE_NEW_MOON + (SYNODIC_MONTH / 2) * DAY_MS)
		const state = getMoonState(half)
		expect(state.phase.id).toBe('full')
		expect(state.illumination).toBeCloseTo(1, 6)
	})

	it('через полный синодический месяц цикл повторяется', () => {
		const later = new Date(REFERENCE_NEW_MOON + SYNODIC_MONTH * DAY_MS)
		const f = moonFraction(later)
		// Доля цикла живёт на окружности: 0 и 1 — одна и та же точка, и
		// накопленная ошибка чисел с плавающей точкой ставит результат по
		// любую сторону от неё. Проверяем расстояние по кругу, а не значение.
		const distanceToZero = Math.min(f, 1 - f)
		expect(distanceToZero).toBeLessThan(1e-6)
	})

	it('через месяц фаза и освещённость те же, что в опорной точке', () => {
		const later = new Date(REFERENCE_NEW_MOON + SYNODIC_MONTH * DAY_MS)
		const state = getMoonState(later)
		expect(state.phase.id).toBe('new')
		expect(state.illumination).toBeCloseTo(0, 6)
	})

	it('даты до опорной тоже дают долю в диапазоне 0…1', () => {
		const before = new Date(Date.UTC(1980, 5, 15))
		const f = moonFraction(before)
		expect(f).toBeGreaterThanOrEqual(0)
		expect(f).toBeLessThan(1)
	})
})

describe('лунный день', () => {
	it('всегда от 1 до 30', () => {
		for (let i = 0; i < 400; i++) {
			const date = new Date(REFERENCE_NEW_MOON + i * 0.37 * DAY_MS)
			const day = getMoonState(date).lunarDay
			expect(day).toBeGreaterThanOrEqual(1)
			expect(day).toBeLessThanOrEqual(30)
		}
	})

	it('растёт в течение цикла', () => {
		const a = getMoonState(new Date(REFERENCE_NEW_MOON + 2 * DAY_MS)).lunarDay
		const b = getMoonState(new Date(REFERENCE_NEW_MOON + 10 * DAY_MS)).lunarDay
		expect(b).toBeGreaterThan(a)
	})
})

describe('ближайшие новолуние и полнолуние', () => {
	it('новолуние наступает не раньше исходной даты', () => {
		const from = new Date(2026, 8, 2)
		expect(nextNewMoon(from).getTime()).toBeGreaterThanOrEqual(from.getTime())
	})

	it('в найденное новолуние фаза действительно новолуние', () => {
		const found = nextNewMoon(new Date(2026, 8, 2))
		expect(getMoonState(found).phase.id).toBe('new')
	})

	it('в найденное полнолуние фаза действительно полнолуние', () => {
		const found = nextFullMoon(new Date(2026, 8, 2))
		expect(getMoonState(found).phase.id).toBe('full')
	})

	it('полнолуние наступает не раньше исходной даты', () => {
		for (const start of [
			new Date(2026, 0, 1),
			new Date(2026, 5, 15),
			new Date(2026, 11, 31)
		]) {
			expect(nextFullMoon(start).getTime()).toBeGreaterThanOrEqual(
				start.getTime()
			)
		}
	})

	it('между соседними новолуниями проходит синодический месяц', () => {
		const first = nextNewMoon(new Date(2026, 0, 1))
		const second = nextNewMoon(new Date(first.getTime() + DAY_MS))
		const gap = (second.getTime() - first.getTime()) / DAY_MS
		expect(gap).toBeCloseTo(SYNODIC_MONTH, 3)
	})
})

describe('календарь на месяц', () => {
	it('число дней совпадает с длиной месяца', () => {
		expect(moonMonth(2026, 9)).toHaveLength(30)
		expect(moonMonth(2026, 2)).toHaveLength(28)
		expect(moonMonth(2024, 2)).toHaveLength(29)
	})

	it('за месяц встречается и растущая, и убывающая Луна', () => {
		const month = moonMonth(2026, 9)
		expect(month.some(d => d.state.phase.waxing)).toBe(true)
		expect(month.some(d => !d.state.phase.waxing)).toBe(true)
	})

	it('в месяце есть хотя бы одно полнолуние или новолуние', () => {
		const month = moonMonth(2026, 9)
		const special = month.filter(
			d => d.state.phase.id === 'full' || d.state.phase.id === 'new'
		)
		expect(special.length).toBeGreaterThan(0)
	})

	it('даты идут подряд', () => {
		const month = moonMonth(2026, 9)
		month.forEach((day, index) => {
			expect(day.date.getDate()).toBe(index + 1)
		})
	})
})

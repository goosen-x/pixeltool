import { describe, it, expect } from 'vitest'
import {
	getMoonState,
	moonFraction,
	moonMonth,
	nextFullMoon,
	nextNewMoon,
	moonEvents,
	moonrises,
	moonPosition,
	lunarDayAt,
	phaseOfDay,
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

describe('даты до 2000 года', () => {
	it('доля цикла в диапазоне 0…1', () => {
		const f = moonFraction(new Date(Date.UTC(1980, 5, 15)))
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

	it('между соседними новолуниями 29,3–29,8 суток, в среднем синодический месяц', () => {
		let prev = nextNewMoon(new Date(Date.UTC(2026, 0, 1)))
		const first = prev
		for (let i = 0; i < 24; i++) {
			const next = nextNewMoon(new Date(prev.getTime() + DAY_MS))
			const gap = (next.getTime() - prev.getTime()) / DAY_MS
			expect(gap).toBeGreaterThan(29.2)
			expect(gap).toBeLessThan(29.9)
			prev = next
		}
		const mean = (prev.getTime() - first.getTime()) / DAY_MS / 24
		expect(Math.abs(mean - SYNODIC_MONTH)).toBeLessThan(0.05)
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

// Эталон: astronomy-engine (VSOP87 + ELP), сверено 28.11.2026. Средний
// синодический месяц, который стоял тут раньше, ошибался до 11 часов:
// новолуние 19 марта 2026 у него выходило 18-м по Москве.
const MIN_MS = 60_000

describe('точные моменты фаз', () => {
	const cases: [string, number][] = [
		['new', Date.UTC(2026, 2, 19, 1, 24)],
		['full', Date.UTC(2026, 0, 3, 10, 3)],
		['full', Date.UTC(2026, 6, 29, 14, 36)],
		['new', Date.UTC(2026, 6, 14, 9, 44)],
		['full', Date.UTC(2026, 10, 24, 14, 55)]
	]

	for (const [id, time] of cases) {
		it(`${id} ${new Date(time).toISOString()} с точностью до 3 минут`, () => {
			const found = moonEvents(time - 2 * DAY_MS, time + 2 * DAY_MS).find(
				e => e.phase.id === id
			)
			expect(found).toBeDefined()
			expect(Math.abs(found!.date.getTime() - time)).toBeLessThan(3 * MIN_MS)
		})
	}

	it('за год ровно по 12–13 новолуний и полнолуний, четверти идут по кругу', () => {
		const events = moonEvents(Date.UTC(2026, 0, 1), Date.UTC(2027, 0, 1))
		const order = ['new', 'first-quarter', 'full', 'last-quarter']
		for (let i = 1; i < events.length; i++) {
			const a = order.indexOf(events[i - 1].phase.id)
			const b = order.indexOf(events[i].phase.id)
			expect(b).toBe((a + 1) % 4)
		}
		const news = events.filter(e => e.phase.id === 'new').length
		expect(news).toBeGreaterThanOrEqual(12)
		expect(news).toBeLessThanOrEqual(13)
	})
})

describe('восход Луны и лунный день', () => {
	it('восходы в Москве 27–29 ноября 2026 совпадают с эталоном до 2 минут', () => {
		const rises = moonrises(Date.UTC(2026, 10, 27), Date.UTC(2026, 10, 30))
		const expected = [
			Date.UTC(2026, 10, 27, 15, 28),
			Date.UTC(2026, 10, 28, 17, 7),
			Date.UTC(2026, 10, 29, 18, 43)
		]
		expect(rises).toHaveLength(3)
		rises.forEach((rise, i) => {
			expect(Math.abs(rise.getTime() - expected[i])).toBeLessThan(2 * MIN_MS)
		})
	})

	it('28.11.2026 до вечернего восхода 19-й лунный день, после — 20-й (как в calend.ru)', () => {
		const noon = lunarDayAt(new Date(Date.UTC(2026, 10, 28, 9)))
		expect(noon.number).toBe(19)
		const evening = lunarDayAt(new Date(Date.UTC(2026, 10, 28, 18)))
		expect(evening.number).toBe(20)
		expect(
			Math.abs(evening.start.getTime() - Date.UTC(2026, 10, 28, 17, 7))
		).toBeLessThan(2 * MIN_MS)
	})

	it('первый лунный день начинается в момент новолуния', () => {
		const newMoon = nextNewMoon(new Date(Date.UTC(2026, 11, 1)))
		const day = lunarDayAt(new Date(newMoon.getTime() + MIN_MS))
		expect(day.number).toBe(1)
		expect(day.start.getTime()).toBe(newMoon.getTime())
	})

	it('за 2026 год лунный день не выходит за 1…30', () => {
		for (let m = 1; m <= 12; m++) {
			for (const d of moonMonth(2026, m)) {
				expect(d.state.lunarDay).toBeGreaterThanOrEqual(1)
				expect(d.state.lunarDay).toBeLessThanOrEqual(30)
			}
		}
	})
})

describe('знак Луны', () => {
	it('28.11.2026 Луна переходит из Рака во Льва около 14:37 по Москве', () => {
		expect(getMoonState(new Date(Date.UTC(2026, 10, 28, 11, 20))).sign).toBe(3)
		expect(getMoonState(new Date(Date.UTC(2026, 10, 28, 11, 55))).sign).toBe(4)
	})

	it('широта Луны не выходит за ±5,3°', () => {
		for (let i = 0; i < 400; i++) {
			const lat = moonPosition(Date.UTC(2026, 0, 1) + i * 0.9 * DAY_MS).lat
			expect(Math.abs(lat)).toBeLessThan(5.35)
		}
	})
})

describe('фаза дня в сетке', () => {
	it('день с точным полнолунием называется полнолунием, соседние — нет', () => {
		const month = moonMonth(2026, 11)
		const full = month.filter(d => d.event?.phase.id === 'full')
		expect(full).toHaveLength(1)
		expect(full[0].state.phase.id).toBe('full')
		const fullIds = month.filter(d => d.state.phase.id === 'full')
		expect(fullIds).toHaveLength(1)
	})

	it('phaseOfDay находит событие в сутках', () => {
		const full = nextFullMoon(new Date(Date.UTC(2026, 10, 20)))
		expect(phaseOfDay(full).phase.id).toBe('full')
		expect(phaseOfDay(full).event).toBeDefined()
	})
})

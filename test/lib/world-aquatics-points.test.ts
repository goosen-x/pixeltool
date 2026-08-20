import { describe, it, expect } from 'vitest'
import {
	calculatePoints,
	calculateTimeForPoints,
	parseSwimTime,
	formatSwimTime
} from '@/lib/utils/world-aquatics-points'

describe('calculatePoints', () => {
	it('время равно базовому — ровно 1000 очков', () => {
		expect(calculatePoints(100, 100)).toBe(1000)
	})

	it('время быстрее базового — больше 1000 очков', () => {
		// P = 1000 * (100/95)^3 ≈ 1166
		expect(calculatePoints(100, 95)).toBe(1166)
	})

	it('время медленнее базового — меньше 1000 очков', () => {
		// P = 1000 * (100/110)^3 ≈ 751
		expect(calculatePoints(100, 110)).toBe(751)
	})

	it('округляет вниз до целого, а не до ближайшего', () => {
		// P = 1000 * (100/99.99)^3 ≈ 1000.3 — должно остаться 1000, не 1001
		expect(calculatePoints(100, 99.99)).toBe(1000)
	})

	it('нулевое или отрицательное время — 0 очков (некорректный ввод)', () => {
		expect(calculatePoints(100, 0)).toBe(0)
		expect(calculatePoints(100, -5)).toBe(0)
	})
})

describe('calculateTimeForPoints', () => {
	it('1000 очков — время равно базовому', () => {
		expect(calculateTimeForPoints(100, 1000)).toBeCloseTo(100, 5)
	})

	it('обратимость: calculatePoints(calculateTimeForPoints(B, P)) ≈ P', () => {
		const time = calculateTimeForPoints(65.5, 850)
		expect(calculatePoints(65.5, time)).toBeCloseTo(850, -1)
	})

	it('0 или меньше очков — Infinity (бесконечно медленное время)', () => {
		expect(calculateTimeForPoints(100, 0)).toBe(Infinity)
		expect(calculateTimeForPoints(100, -10)).toBe(Infinity)
	})
})

describe('parseSwimTime', () => {
	it('минуты, секунды, сотые — сумма в секундах', () => {
		expect(parseSwimTime('1', '02', '35')).toBeCloseTo(62.35, 5)
	})

	it('без минут — только секунды и сотые', () => {
		expect(parseSwimTime('', '23', '61')).toBeCloseTo(23.61, 5)
	})

	it('пустые секунды и сотые — null (нечего считать)', () => {
		expect(parseSwimTime('', '', '')).toBeNull()
	})

	it('секунды 60 и больше — null (некорректный ввод)', () => {
		expect(parseSwimTime('1', '60', '00')).toBeNull()
	})

	it('отрицательные значения — null', () => {
		expect(parseSwimTime('-1', '10', '00')).toBeNull()
	})

	it('нечисловой ввод — null', () => {
		expect(parseSwimTime('a', '10', '00')).toBeNull()
	})
})

describe('formatSwimTime', () => {
	it('меньше минуты — секунды.сотые без минут', () => {
		expect(formatSwimTime(23.61)).toBe('23.61')
	})

	it('минута и больше — м:сс.сотые с ведущим нулём у секунд', () => {
		expect(formatSwimTime(62.35)).toBe('1:02.35')
	})

	it('несколько минут', () => {
		expect(formatSwimTime(920.48)).toBe('15:20.48')
	})

	it('округление сотых не переносит секунду в 60', () => {
		// 59.996 -> 60.00 сек ровно, должно перейти в следующую минуту
		expect(formatSwimTime(59.996)).toBe('1:00.00')
	})
})

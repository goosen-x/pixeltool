import { describe, it, expect } from 'vitest'
import {
	calculatePregnancy,
	GESTATION_DAYS,
	MATERNITY_LEAVE_WEEKS
} from '@/lib/utils/pregnancy'

const iso = (date: Date) => date.toISOString().slice(0, 10)

describe('calculatePregnancy', () => {
	it('считает ПДР по правилу Негеле — ПДМ плюс 280 дней', () => {
		const lastPeriod = new Date(2026, 0, 1)
		const result = calculatePregnancy(lastPeriod, new Date(2026, 0, 1))

		const expected = new Date(2026, 0, 1)
		expected.setDate(expected.getDate() + GESTATION_DAYS)
		expect(iso(result.dueDate)).toBe(iso(expected))
	})

	it('сдвигает ПДР при цикле длиннее 28 дней', () => {
		const lastPeriod = new Date(2026, 0, 1)
		const short = calculatePregnancy(lastPeriod, lastPeriod, 28)
		const long = calculatePregnancy(lastPeriod, lastPeriod, 35)

		const diff =
			(long.dueDate.getTime() - short.dueDate.getTime()) / (24 * 60 * 60 * 1000)
		expect(Math.round(diff)).toBe(7)
	})

	it('считает срок в неделях и днях', () => {
		const lastPeriod = new Date(2026, 0, 1)
		const today = new Date(2026, 0, 1)
		today.setDate(today.getDate() + 7 * 12 + 3)

		const result = calculatePregnancy(lastPeriod, today)
		expect(result.weeks).toBe(12)
		expect(result.days).toBe(3)
	})

	it('определяет триместры по границам 14 и 28 недель', () => {
		const lastPeriod = new Date(2026, 0, 1)
		const at = (weeks: number) => {
			const day = new Date(2026, 0, 1)
			day.setDate(day.getDate() + weeks * 7)
			return calculatePregnancy(lastPeriod, day).trimester
		}

		expect(at(5)).toBe(1)
		expect(at(13)).toBe(1)
		expect(at(14)).toBe(2)
		expect(at(27)).toBe(2)
		expect(at(28)).toBe(3)
		expect(at(40)).toBe(3)
	})

	it('не назначает триместр до ПДМ и после 42 недель', () => {
		const lastPeriod = new Date(2026, 5, 1)

		expect(
			calculatePregnancy(lastPeriod, new Date(2026, 4, 1)).trimester
		).toBeNull()

		const late = new Date(2026, 5, 1)
		late.setDate(late.getDate() + 43 * 7)
		expect(calculatePregnancy(lastPeriod, late).trimester).toBeNull()
	})

	it('ставит декрет на 30 неделе, а при многоплодной — на 28', () => {
		const lastPeriod = new Date(2026, 0, 1)

		const single = calculatePregnancy(lastPeriod, lastPeriod)
		const expected = new Date(2026, 0, 1)
		expected.setDate(expected.getDate() + MATERNITY_LEAVE_WEEKS * 7)
		expect(iso(single.maternityLeaveDate)).toBe(iso(expected))

		const twins = calculatePregnancy(lastPeriod, lastPeriod, 28, true)
		const twinsExpected = new Date(2026, 0, 1)
		twinsExpected.setDate(twinsExpected.getDate() + 28 * 7)
		expect(iso(twins.maternityLeaveDate)).toBe(iso(twinsExpected))
	})

	it('считает дни до родов и не путается после ПДР', () => {
		const lastPeriod = new Date(2026, 0, 1)
		const afterDue = new Date(2026, 0, 1)
		afterDue.setDate(afterDue.getDate() + GESTATION_DAYS + 5)

		expect(calculatePregnancy(lastPeriod, afterDue).daysUntilDue).toBe(-5)
	})
})

import { describe, it, expect } from 'vitest'
import {
	AVERAGE_MONTH_DAYS,
	calculateMaternity,
	calculateServiceLength,
	calculateSickLeave,
	calculateVacation,
	DEFAULT_CONTRIBUTION_BASE,
	DEFAULT_MROT,
	MATERNITY_DAYS,
	sickLeavePercent
} from '@/lib/utils/labor'

describe('отпускные', () => {
	it('полный год: делим на 12 × 29,3', () => {
		const r = calculateVacation({
			yearEarnings: 600000,
			fullMonths: 12,
			partialDays: 0,
			vacationDays: 28
		})!
		expect(r.daysBase).toBeCloseTo(351.6, 6)
		expect(r.averageDaily).toBeCloseTo(600000 / 351.6, 6)
		expect(r.gross).toBeCloseTo(r.averageDaily * 28, 6)
	})

	it('неполные месяцы добавляются к базе календарными днями', () => {
		const full = calculateVacation({
			yearEarnings: 600000,
			fullMonths: 11,
			partialDays: 0,
			vacationDays: 28
		})!
		const withPartial = calculateVacation({
			yearEarnings: 600000,
			fullMonths: 11,
			partialDays: 15,
			vacationDays: 28
		})!
		expect(withPartial.daysBase).toBeCloseTo(full.daysBase + 15, 6)
		// База больше — средний дневной меньше
		expect(withPartial.averageDaily).toBeLessThan(full.averageDaily)
	})

	it('коэффициент из ТК не самодельный', () => {
		expect(AVERAGE_MONTH_DAYS).toBe(29.3)
	})

	it('отпускные пропорциональны числу дней', () => {
		const base = { yearEarnings: 600000, fullMonths: 12, partialDays: 0 }
		const a = calculateVacation({ ...base, vacationDays: 14 })!
		const b = calculateVacation({ ...base, vacationDays: 28 })!
		expect(b.gross).toBeCloseTo(a.gross * 2, 6)
	})

	it('без дней отпуска расчёта нет', () => {
		expect(
			calculateVacation({
				yearEarnings: 600000,
				fullMonths: 12,
				partialDays: 0,
				vacationDays: 0
			})
		).toBeNull()
	})

	it('пустая база не даёт деления на ноль', () => {
		expect(
			calculateVacation({
				yearEarnings: 600000,
				fullMonths: 0,
				partialDays: 0,
				vacationDays: 28
			})
		).toBeNull()
	})
})

describe('процент по стажу', () => {
	it('до пяти лет — 60%', () => {
		expect(sickLeavePercent(0)).toBe(60)
		expect(sickLeavePercent(4.9)).toBe(60)
	})

	it('от пяти до восьми — 80%', () => {
		expect(sickLeavePercent(5)).toBe(80)
		expect(sickLeavePercent(7.9)).toBe(80)
	})

	it('от восьми — 100%', () => {
		expect(sickLeavePercent(8)).toBe(100)
		expect(sickLeavePercent(30)).toBe(100)
	})
})

describe('больничный', () => {
	const base = { twoYearsEarnings: 1_200_000, insuranceYears: 10, sickDays: 10 }

	it('делится на жёсткие 730, а не на фактические дни', () => {
		const r = calculateSickLeave(base)!
		expect(r.averageDaily).toBeCloseTo(1_200_000 / 730, 6)
	})

	it('стаж уменьшает пособие', () => {
		const full = calculateSickLeave(base)!
		const short = calculateSickLeave({ ...base, insuranceYears: 3 })!
		expect(short.percent).toBe(60)
		expect(short.total).toBeCloseTo(full.total * 0.6, 4)
	})

	it('заработок сверх предельной базы не учитывается', () => {
		const huge = calculateSickLeave({
			...base,
			twoYearsEarnings: DEFAULT_CONTRIBUTION_BASE * 10
		})!
		const atLimit = calculateSickLeave({
			...base,
			twoYearsEarnings: DEFAULT_CONTRIBUTION_BASE * 2
		})!
		expect(huge.cappedByBase).toBe(true)
		expect(huge.total).toBeCloseTo(atLimit.total, 6)
	})

	it('маленький заработок подтягивается до МРОТ', () => {
		const r = calculateSickLeave({ ...base, twoYearsEarnings: 1000 })!
		expect(r.raisedToMrot).toBe(true)
		expect(r.dailyBenefit).toBeCloseTo((DEFAULT_MROT * 24) / 730, 6)
	})

	it('нормальный заработок до МРОТ не подтягивается', () => {
		expect(calculateSickLeave(base)!.raisedToMrot).toBe(false)
	})

	it('итог пропорционален дням болезни', () => {
		const a = calculateSickLeave({ ...base, sickDays: 5 })!
		const b = calculateSickLeave({ ...base, sickDays: 10 })!
		expect(b.total).toBeCloseTo(a.total * 2, 6)
	})
})

describe('декретные', () => {
	const base = {
		twoYearsEarnings: 1_400_000,
		excludedDays: 0,
		kind: 'normal' as const
	}

	it('обычные роды — 140 дней', () => {
		expect(calculateMaternity(base)!.days).toBe(140)
	})

	it('осложнённые и многоплодные дольше', () => {
		expect(MATERNITY_DAYS.complicated).toBe(156)
		expect(MATERNITY_DAYS.multiple).toBe(194)
		expect(calculateMaternity({ ...base, kind: 'multiple' })!.days).toBe(194)
	})

	it('исключаемые дни уменьшают делитель и повышают средний заработок', () => {
		const plain = calculateMaternity(base)!
		const excluded = calculateMaternity({ ...base, excludedDays: 100 })!
		expect(excluded.daysBase).toBe(630)
		expect(excluded.averageDaily).toBeGreaterThan(plain.averageDaily)
	})

	it('стаж на размер не влияет, в отличие от больничного', () => {
		// У декретных нет параметра стажа вовсе — это и проверяем структурно
		const r = calculateMaternity(base)!
		expect(r.averageDaily).toBeCloseTo(1_400_000 / 730, 6)
	})

	it('предельная база ограничивает и здесь', () => {
		const r = calculateMaternity({
			...base,
			twoYearsEarnings: DEFAULT_CONTRIBUTION_BASE * 10
		})!
		expect(r.cappedByBase).toBe(true)
	})

	it('исключаемых дней не может быть 730 и больше', () => {
		expect(calculateMaternity({ ...base, excludedDays: 730 })).toBeNull()
	})
})

describe('трудовой стаж', () => {
	it('день увольнения входит в стаж', () => {
		const r = calculateServiceLength([
			{ from: '2020-01-01', to: '2020-01-01' }
		])!
		expect(r.totalDays).toBe(1)
	})

	it('ровно год', () => {
		const r = calculateServiceLength([
			{ from: '2020-01-01', to: '2020-12-31' }
		])!
		expect(r.totalDays).toBe(366) // високосный
	})

	it('несколько периодов складываются', () => {
		const r = calculateServiceLength([
			{ from: '2020-01-01', to: '2020-06-30' },
			{ from: '2021-01-01', to: '2021-06-30' }
		])!
		expect(r.totalDays).toBe(182 + 181)
	})

	it('перевёрнутый период пропускается', () => {
		const r = calculateServiceLength([
			{ from: '2020-06-30', to: '2020-01-01' },
			{ from: '2021-01-01', to: '2021-01-10' }
		])!
		expect(r.totalDays).toBe(10)
	})

	it('годы и месяцы считаются по 360 и 30 дней', () => {
		const r = calculateServiceLength([
			{ from: '2020-01-01', to: '2020-01-30' }
		])!
		expect(r.totalDays).toBe(30)
		expect(r).toMatchObject({ years: 0, months: 1, days: 0 })
	})

	it('разложение сходится обратно в дни', () => {
		const r = calculateServiceLength([
			{ from: '2015-03-10', to: '2024-08-20' }
		])!
		expect(r.years * 360 + r.months * 30 + r.days).toBe(r.totalDays)
	})

	it('пустой список даёт null', () => {
		expect(calculateServiceLength([])).toBeNull()
	})

	it('битые даты игнорируются', () => {
		expect(
			calculateServiceLength([{ from: 'не дата', to: 'тоже нет' }])
		).toBeNull()
	})
})

import { describe, it, expect } from 'vitest'
import {
	addVat,
	calculateFlatNdfl,
	calculateNdfl,
	extractVat,
	grossFromNet,
	NDFL_BRACKETS,
	VAT_RATES
} from '@/lib/utils/tax'

describe('НДС', () => {
	it('начисление сверху', () => {
		const r = addVat(1000, 22)
		expect(r.vat).toBeCloseTo(220, 9)
		expect(r.gross).toBeCloseTo(1220, 9)
		expect(r.net).toBe(1000)
	})

	it('выделение из суммы', () => {
		const r = extractVat(1220, 22)
		expect(r.vat).toBeCloseTo(220, 9)
		expect(r.net).toBeCloseTo(1000, 9)
	})

	it('начисление и выделение обратны друг другу', () => {
		for (const rate of VAT_RATES.map(r => r.value)) {
			const added = addVat(12345.67, rate)
			const back = extractVat(added.gross, rate)
			expect(back.net).toBeCloseTo(12345.67, 6)
			expect(back.vat).toBeCloseTo(added.vat, 6)
		}
	})

	it('выделенный налог меньше, чем ставка от суммы с налогом', () => {
		// Именно здесь чаще всего ошибаются: 22% от 1220 это 268,4, а внутри
		// 1220 сидит только 220 налога
		const extracted = extractVat(1220, 22)
		expect(extracted.vat).toBeLessThan((1220 * 22) / 100)
		expect(extracted.vat).toBeCloseTo(220, 9)
	})

	it('нулевая ставка ничего не меняет', () => {
		expect(addVat(500, 0).gross).toBe(500)
		expect(extractVat(500, 0).vat).toBe(0)
	})

	it('льготная ставка 10%', () => {
		expect(addVat(1000, 10).vat).toBeCloseTo(100, 9)
		expect(extractVat(1100, 10).net).toBeCloseTo(1000, 9)
	})

	it('основная ставка в списке — 22%', () => {
		expect(VAT_RATES[0].value).toBe(22)
	})
})

describe('НДФЛ по прогрессивной шкале', () => {
	it('доход в первой ступени облагается по 13%', () => {
		const r = calculateNdfl(1_000_000)!
		expect(r.tax).toBeCloseTo(130_000, 6)
		expect(r.effectiveRatePercent).toBeCloseTo(13, 9)
	})

	it('ровно на пороге ставка ещё нижняя', () => {
		const r = calculateNdfl(2_400_000)!
		expect(r.tax).toBeCloseTo(312_000, 6)
		expect(r.parts).toHaveLength(1)
	})

	it('повышенная ставка берётся только с превышения, а не со всего дохода', () => {
		// 2 400 000 по 13% = 312 000, плюс 100 000 по 15% = 15 000
		const r = calculateNdfl(2_500_000)!
		expect(r.tax).toBeCloseTo(327_000, 6)
		// Если бы весь доход облагался по 15%, вышло бы 375 000
		expect(r.tax).toBeLessThan(375_000)
	})

	it('разбивка по ступеням складывается в общий налог', () => {
		const r = calculateNdfl(60_000_000)!
		const sum = r.parts.reduce((s, p) => s + p.tax, 0)
		expect(sum).toBeCloseTo(r.tax, 6)
	})

	it('весь доход распределён по ступеням без потерь', () => {
		const income = 33_000_000
		const r = calculateNdfl(income)!
		const covered = r.parts.reduce((s, p) => s + p.amount, 0)
		expect(covered).toBeCloseTo(income, 6)
	})

	it('средняя ставка ниже верхней ступени', () => {
		const r = calculateNdfl(60_000_000)!
		const top = Math.max(...r.parts.map(p => p.ratePercent))
		expect(r.effectiveRatePercent).toBeLessThan(top)
	})

	it('налог растёт монотонно с доходом', () => {
		let previous = -1
		for (const income of [0, 1e6, 2.4e6, 3e6, 5e6, 21e6, 51e6, 1e8]) {
			const tax = calculateNdfl(income)!.tax
			expect(tax).toBeGreaterThanOrEqual(previous)
			previous = tax
		}
	})

	it('на руки плюс налог равны доходу', () => {
		const r = calculateNdfl(7_777_777)!
		expect(r.net + r.tax).toBeCloseTo(7_777_777, 6)
	})

	it('нулевой доход', () => {
		const r = calculateNdfl(0)!
		expect(r.tax).toBe(0)
		expect(r.effectiveRatePercent).toBe(0)
	})

	it('отрицательный доход отвергается', () => {
		expect(calculateNdfl(-1)).toBeNull()
	})

	it('ступени идут по возрастанию', () => {
		for (let i = 1; i < NDFL_BRACKETS.length; i++) {
			expect(NDFL_BRACKETS[i].from).toBeGreaterThan(NDFL_BRACKETS[i - 1].from)
			expect(NDFL_BRACKETS[i].ratePercent).toBeGreaterThan(
				NDFL_BRACKETS[i - 1].ratePercent
			)
		}
	})
})

describe('плоская ставка', () => {
	it('нерезидент 30%', () => {
		const r = calculateFlatNdfl(1_000_000, 30)!
		expect(r.tax).toBeCloseTo(300_000, 6)
		expect(r.net).toBeCloseTo(700_000, 6)
	})
})

describe('обратный расчёт от суммы на руки', () => {
	it('в первой ступени', () => {
		const gross = grossFromNet(87_000)!
		expect(gross).toBeCloseTo(100_000, 4)
	})

	it('через несколько ступеней', () => {
		const income = 8_000_000
		const net = calculateNdfl(income)!.net
		expect(grossFromNet(net)).toBeCloseTo(income, 3)
	})

	it('круговой обход сходится на любой сумме', () => {
		for (const income of [
			50_000, 2_400_000, 4_999_999, 25_000_000, 90_000_000
		]) {
			const net = calculateNdfl(income)!.net
			expect(grossFromNet(net)).toBeCloseTo(income, 3)
		}
	})

	it('ноль на руки — ноль начислено', () => {
		expect(grossFromNet(0)).toBe(0)
	})
})

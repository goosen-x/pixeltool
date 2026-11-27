import { describe, it, expect } from 'vitest'
import { calculateCtr, parseNumber, type CtrInput } from '@/lib/ctr-calculator'

const base: CtrInput = {
	mode: 'ctr',
	impressions: '5000',
	clicks: '75',
	ctr: '1,5',
	spend: ''
}

function ok(input: Partial<CtrInput>) {
	const out = calculateCtr({ ...base, ...input })
	if (!out.ok) throw new Error(`ожидался результат, получено: ${out.error}`)
	return out.result
}

function err(input: Partial<CtrInput>) {
	const out = calculateCtr({ ...base, ...input })
	if (out.ok) throw new Error('ожидалась ошибка')
	return out.error
}

describe('parseNumber', () => {
	it('понимает пробелы-разделители и запятую', () => {
		expect(parseNumber('12 500')).toBe(12500)
		expect(parseNumber('12 500')).toBe(12500)
		expect(parseNumber('1,5')).toBe(1.5)
		expect(parseNumber('.5')).toBe(0.5)
	})
	it('не глотает мусор в хвосте', () => {
		expect(parseNumber('12abc')).toBeNull()
		expect(parseNumber('1.2.3')).toBeNull()
		expect(parseNumber('')).toBeNull()
	})
})

describe('calculateCtr: прямой расчёт', () => {
	it('75 кликов на 5000 показов = 1,5%', () => {
		expect(ok({}).ctr).toBeCloseTo(1.5)
	})
	it('320 кликов на 12 800 показов = 2,5%', () => {
		expect(ok({ impressions: '12 800', clicks: '320' }).ctr).toBeCloseTo(2.5)
	})
	it('0 кликов = 0%, без «показов на клик»', () => {
		const r = ok({ clicks: '0' })
		expect(r.ctr).toBe(0)
		expect(r.impressionsPerClick).toBeNull()
	})
	it('показов на один клик', () => {
		expect(ok({}).impressionsPerClick).toBeCloseTo(66.67, 1)
	})
	it('кликов больше показов — ошибка, а не 150%', () => {
		expect(err({ impressions: '50', clicks: '75' })).toMatch(/больше, чем показов/)
	})
	it('отрицательные и нулевые значения — ошибка', () => {
		expect(err({ clicks: '-5' })).toMatch(/меньше нуля/)
		expect(err({ impressions: '0' })).toMatch(/больше нуля/)
	})
	it('мусор в поле — ошибка', () => {
		expect(err({ clicks: '75abc' })).toMatch(/Клики/)
	})
	it('пустое поле — без ошибки, просто нет результата', () => {
		expect(err({ clicks: '' })).toBeNull()
	})
	it('дробные клики — предупреждение', () => {
		expect(ok({ clicks: '7,5' }).warning).toMatch(/целое/)
	})
})

describe('calculateCtr: обратный расчёт', () => {
	it('20 000 показов при CTR 1% = 200 кликов', () => {
		expect(ok({ mode: 'clicks', impressions: '20000', ctr: '1' }).clicks).toBe(200)
	})
	it('CTR больше 100% — ошибка', () => {
		expect(err({ mode: 'clicks', ctr: '120' })).toMatch(/больше 100/)
	})
})

describe('calculateCtr: CPC и CPM', () => {
	it('расход 3000 ₽ на 5000 показов и 75 кликов', () => {
		const r = ok({ spend: '3000' })
		expect(r.cpc).toBeCloseTo(40)
		expect(r.cpm).toBeCloseTo(600)
	})
	it('без расхода CPC и CPM не считаются', () => {
		const r = ok({})
		expect(r.cpc).toBeNull()
		expect(r.cpm).toBeNull()
	})
	it('при нуле кликов CPC нет, CPM есть', () => {
		const r = ok({ clicks: '0', spend: '500' })
		expect(r.cpc).toBeNull()
		expect(r.cpm).toBeCloseTo(100)
	})
})

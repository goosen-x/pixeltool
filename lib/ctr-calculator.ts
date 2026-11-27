/**
 * Расчёты калькулятора CTR.
 *
 * CTR = клики ÷ показы × 100%. Обратный режим: клики = показы × CTR ÷ 100.
 * Если указан расход, дополнительно считаются CPC (цена клика) и CPM
 * (цена тысячи показов).
 */

export type CtrMode = 'ctr' | 'clicks'

export interface CtrInput {
	mode: CtrMode
	impressions: string
	clicks: string
	ctr: string
	spend: string
}

export interface CtrResult {
	ctr: number
	clicks: number
	/** Сколько показов приходится на один клик. */
	impressionsPerClick: number | null
	cpc: number | null
	cpm: number | null
	warning: string | null
}

export type CtrOutcome =
	| { ok: true; result: CtrResult }
	| { ok: false; error: string | null }

/**
 * Строгий разбор числа: пробелы-разделители тысяч и запятая допустимы,
 * «12abc» и «1.2.3» — нет (parseFloat молча проглатывал хвост).
 */
export function parseNumber(value: string): number | null {
	const cleaned = value.replace(/[\s  ]/g, '').replace(',', '.')
	if (cleaned === '' || !/^-?\d*\.?\d+$|^-?\d+\.$/.test(cleaned)) return null
	const parsed = Number(cleaned)
	return Number.isFinite(parsed) ? parsed : null
}

export function calculateCtr(input: CtrInput): CtrOutcome {
	const rawMain = input.impressions.trim()
	const rawSecond = (input.mode === 'ctr' ? input.clicks : input.ctr).trim()
	if (rawMain === '' || rawSecond === '') return { ok: false, error: null }

	const impressions = parseNumber(rawMain)
	if (impressions === null) return { ok: false, error: 'Показы: введите число' }
	if (impressions <= 0)
		return { ok: false, error: 'Показов должно быть больше нуля' }

	let ctr: number
	let clicks: number
	let warning: string | null = null

	if (input.mode === 'ctr') {
		const c = parseNumber(rawSecond)
		if (c === null) return { ok: false, error: 'Клики: введите число' }
		if (c < 0) return { ok: false, error: 'Кликов не может быть меньше нуля' }
		if (c > impressions)
			return {
				ok: false,
				error:
					'Кликов больше, чем показов. Проверьте, не перепутаны ли поля местами'
			}
		clicks = c
		ctr = (c / impressions) * 100
	} else {
		const p = parseNumber(rawSecond)
		if (p === null) return { ok: false, error: 'CTR: введите число' }
		if (p < 0) return { ok: false, error: 'CTR не может быть отрицательным' }
		if (p > 100) return { ok: false, error: 'CTR не может быть больше 100%' }
		ctr = p
		clicks = (impressions * p) / 100
	}

	if (!Number.isInteger(impressions))
		warning = 'Показы обычно целое число, проверьте ввод'
	else if (input.mode === 'ctr' && !Number.isInteger(clicks))
		warning = 'Клики обычно целое число, проверьте ввод'

	const rawSpend = input.spend.trim()
	let cpc: number | null = null
	let cpm: number | null = null
	if (rawSpend !== '') {
		const spend = parseNumber(rawSpend)
		if (spend === null) return { ok: false, error: 'Расход: введите число' }
		if (spend < 0)
			return { ok: false, error: 'Расход не может быть отрицательным' }
		cpm = (spend / impressions) * 1000
		cpc = clicks > 0 ? spend / clicks : null
	}

	return {
		ok: true,
		result: {
			ctr,
			clicks,
			impressionsPerClick: clicks > 0 ? impressions / clicks : null,
			cpc,
			cpm,
			warning
		}
	}
}

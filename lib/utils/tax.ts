/**
 * НДС и НДФЛ.
 *
 * Ставки вынесены в константы с датой, а не зашиты в формулы: налоговое
 * законодательство меняется, и калькулятор с устаревшей ставкой хуже, чем
 * его отсутствие — человек получит уверенный неправильный ответ. Поэтому
 * ставка ещё и выбирается в интерфейсе, а не подставляется молча.
 */

/** Дата, на которую верны ставки ниже. Показывается на странице. */
export const RATES_VALID_FROM = '1 января 2026'

export interface VatRate {
	value: number
	label: string
	hint: string
}

/**
 * Ставки НДС. Основная выросла до 22% с 2026 года — это и делает тему
 * временно выгодной: выдача пока полна страниц со старыми 20%.
 */
export const VAT_RATES: VatRate[] = [
	{ value: 22, label: '22%', hint: 'основная ставка' },
	{ value: 10, label: '10%', hint: 'продукты, детские товары, лекарства' },
	{ value: 7, label: '7%', hint: 'УСН, повышенная' },
	{ value: 5, label: '5%', hint: 'УСН, пониженная' },
	{ value: 0, label: '0%', hint: 'экспорт и международные перевозки' }
]

export interface VatResult {
	/** Сумма без налога. */
	net: number
	/** Сам налог. */
	vat: number
	/** Сумма с налогом. */
	gross: number
}

/**
 * Начислить НДС сверху: знаем сумму без налога, хотим итог.
 * Так считает продавец, формируя цену.
 */
export function addVat(net: number, ratePercent: number): VatResult {
	const vat = (net * ratePercent) / 100
	return { net, vat, gross: net + vat }
}

/**
 * Выделить НДС из суммы: знаем итог с налогом, хотим узнать налог внутри.
 * Так считает покупатель по чеку и бухгалтер по договору, где написано
 * «в том числе НДС».
 *
 * Формула не та же самая, что при начислении, и это источник самой частой
 * ошибки: 22% от суммы с налогом больше, чем налог внутри неё. Делить надо
 * на 122, а не умножать на 0,22.
 */
export function extractVat(gross: number, ratePercent: number): VatResult {
	const vat = (gross * ratePercent) / (100 + ratePercent)
	return { net: gross - vat, vat, gross }
}

export interface TaxBracket {
	/** Доход, с которого начинает действовать ставка. */
	from: number
	ratePercent: number
}

/**
 * Прогрессивная шкала НДФЛ. Ставка применяется не ко всему доходу, а только
 * к части, попавшей в свою ступень — на этом ошибаются чаще всего, считая,
 * что при переходе порога весь доход облагается по новой ставке.
 */
export const NDFL_BRACKETS: TaxBracket[] = [
	{ from: 0, ratePercent: 13 },
	{ from: 2_400_000, ratePercent: 15 },
	{ from: 5_000_000, ratePercent: 18 },
	{ from: 20_000_000, ratePercent: 20 },
	{ from: 50_000_000, ratePercent: 22 }
]

export interface NdflBracketPart {
	ratePercent: number
	/** Сколько дохода попало в эту ступень. */
	amount: number
	/** Налог с этой части. */
	tax: number
}

export interface NdflResult {
	tax: number
	net: number
	/** Средняя ставка по всему доходу — она ниже верхней ступени. */
	effectiveRatePercent: number
	parts: NdflBracketPart[]
}

/** НДФЛ по прогрессивной шкале, с разбивкой по ступеням. */
export function calculateNdfl(
	income: number,
	brackets: TaxBracket[] = NDFL_BRACKETS
): NdflResult | null {
	if (!Number.isFinite(income) || income < 0) return null

	const parts: NdflBracketPart[] = []
	let tax = 0

	for (const [index, bracket] of brackets.entries()) {
		const next = brackets[index + 1]
		const upper = next ? next.from : Infinity
		const amount = Math.max(0, Math.min(income, upper) - bracket.from)
		if (amount <= 0) continue

		const partTax = (amount * bracket.ratePercent) / 100
		tax += partTax
		parts.push({ ratePercent: bracket.ratePercent, amount, tax: partTax })
	}

	return {
		tax,
		net: income - tax,
		effectiveRatePercent: income > 0 ? (tax / income) * 100 : 0,
		parts
	}
}

/** Плоская ставка — для нерезидентов и частных случаев. */
export function calculateFlatNdfl(
	income: number,
	ratePercent: number
): NdflResult | null {
	if (!Number.isFinite(income) || income < 0) return null
	const tax = (income * ratePercent) / 100
	return {
		tax,
		net: income - tax,
		effectiveRatePercent: ratePercent,
		parts: [{ ratePercent, amount: income, tax }]
	}
}

/**
 * Обратная задача: знаем сумму на руки, хотим узнать начисленную.
 *
 * Для плоской ставки решается делением, для прогрессивной — нет, потому что
 * ставка зависит от искомой величины. Идём по ступеням снизу вверх и
 * набираем, пока не закроем нужную сумму на руки.
 */
export function grossFromNet(
	net: number,
	brackets: TaxBracket[] = NDFL_BRACKETS
): number | null {
	if (!Number.isFinite(net) || net < 0) return null

	let gross = 0
	let remaining = net

	for (const [index, bracket] of brackets.entries()) {
		const next = brackets[index + 1]
		const width = (next ? next.from : Infinity) - bracket.from
		const netPerRuble = 1 - bracket.ratePercent / 100
		const netInBracket = width * netPerRuble

		if (remaining <= netInBracket) {
			return gross + remaining / netPerRuble
		}

		gross += width
		remaining -= netInBracket
	}

	return gross
}

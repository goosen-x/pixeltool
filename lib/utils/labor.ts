/**
 * Трудовые расчёты: отпускные, больничный, декретные, стаж, зарплата.
 *
 * Общий модуль намеренно: у всех пяти калькуляторов в основе один и тот же
 * средний заработок, только считается он в каждом случае по своим правилам.
 * Разведи их по файлам — и они разъедутся при первой же правке.
 *
 * Величины, которые государство меняет каждый год (МРОТ, предельная база
 * взносов), сюда зашиты только как значения по умолчанию с датой. В
 * интерфейсе они выведены полями ввода: калькулятор с прошлогодним МРОТ
 * выдаёт уверенный неправильный ответ, а это хуже, чем его отсутствие.
 */

/** Дата, на которую верны значения по умолчанию ниже. */
export const LABOR_VALUES_YEAR = 2026

/**
 * Среднемесячное число календарных дней — коэффициент из статьи 139 ТК РФ.
 * Не «30» и не среднее по году: это законодательно установленная величина,
 * и менять её нельзя, даже если кажется, что в месяце дней больше.
 */
export const AVERAGE_MONTH_DAYS = 29.3

/** МРОТ по умолчанию, рублей в месяц. Проверяйте актуальность. */
export const DEFAULT_MROT = 27093

/** Предельная база для взносов за год, рублей. Ограничивает больничный. */
export const DEFAULT_CONTRIBUTION_BASE = 2759000

/* ------------------------------------------------------------- отпускные */

export interface VacationInput {
	/** Заработок за расчётный период (обычно 12 месяцев), рублей. */
	yearEarnings: number
	/** Полностью отработанных месяцев в расчётном периоде. */
	fullMonths: number
	/** Календарных дней в неполных месяцах, уже пересчитанных. */
	partialDays: number
	/** Дней отпуска. */
	vacationDays: number
}

export interface VacationResult {
	/** Средний дневной заработок. */
	averageDaily: number
	/** Сумма отпускных до налога. */
	gross: number
	/** База в календарных днях, на которую делили. */
	daysBase: number
}

/**
 * Отпускные по статье 139 ТК РФ.
 *
 * Средний дневной заработок — это заработок за расчётный период, делённый
 * на число календарных дней в нём. Полный месяц даёт 29,3 дня независимо от
 * того, сколько их было на самом деле; неполный пересчитывается отдельно.
 * Отсюда и странность, которую все замечают: в отпуске за 28 дней «теряется»
 * несколько дней зарплаты, потому что делили на календарные дни, а зарплату
 * платят за рабочие.
 */
export function calculateVacation(input: VacationInput): VacationResult | null {
	const { yearEarnings, fullMonths, partialDays, vacationDays } = input
	if (
		!Number.isFinite(yearEarnings) ||
		yearEarnings < 0 ||
		fullMonths < 0 ||
		partialDays < 0 ||
		vacationDays <= 0
	) {
		return null
	}

	const daysBase = fullMonths * AVERAGE_MONTH_DAYS + partialDays
	if (daysBase <= 0) return null

	const averageDaily = yearEarnings / daysBase
	return { averageDaily, gross: averageDaily * vacationDays, daysBase }
}

/* ------------------------------------------------------------ больничный */

/**
 * Процент от среднего заработка по страховому стажу.
 * До 5 лет — 60%, от 5 до 8 — 80%, от 8 — 100%.
 */
export function sickLeavePercent(insuranceYears: number): number {
	if (insuranceYears >= 8) return 100
	if (insuranceYears >= 5) return 80
	return 60
}

export interface SickLeaveInput {
	/** Заработок за два календарных года до болезни. */
	twoYearsEarnings: number
	insuranceYears: number
	sickDays: number
	mrot?: number
	/** Предельная база за каждый из двух лет — заработок сверх неё не учитывается. */
	contributionBase?: number
}

export interface SickLeaveResult {
	averageDaily: number
	percent: number
	dailyBenefit: number
	total: number
	/** Заработок обрезан предельной базой. */
	cappedByBase: boolean
	/** Пособие подтянуто до расчёта по МРОТ. */
	raisedToMrot: boolean
}

/**
 * Больничный.
 *
 * Средний дневной заработок здесь считается иначе, чем в отпускных: сумма
 * за два календарных года делится на 730 — фиксированное число, а не на
 * фактические дни. Сверху действует потолок: заработок каждого года
 * учитывается не больше предельной базы. Снизу — пол: пособие не может быть
 * меньше расчёта по МРОТ.
 */
export function calculateSickLeave(
	input: SickLeaveInput
): SickLeaveResult | null {
	const {
		twoYearsEarnings,
		insuranceYears,
		sickDays,
		mrot = DEFAULT_MROT,
		contributionBase = DEFAULT_CONTRIBUTION_BASE
	} = input

	if (
		!Number.isFinite(twoYearsEarnings) ||
		twoYearsEarnings < 0 ||
		insuranceYears < 0 ||
		sickDays <= 0
	) {
		return null
	}

	const limit = contributionBase * 2
	const cappedByBase = twoYearsEarnings > limit
	const base = Math.min(twoYearsEarnings, limit)

	const averageDaily = base / 730
	const percent = sickLeavePercent(insuranceYears)
	let dailyBenefit = (averageDaily * percent) / 100

	// Пол по МРОТ: 24 МРОТ за два года, делённые на 730
	const mrotDaily = (mrot * 24) / 730
	const raisedToMrot = dailyBenefit < mrotDaily
	if (raisedToMrot) dailyBenefit = mrotDaily

	return {
		averageDaily,
		percent,
		dailyBenefit,
		total: dailyBenefit * sickDays,
		cappedByBase,
		raisedToMrot
	}
}

/* ------------------------------------------------------------- декретные */

/** Стандартная продолжительность отпуска по беременности и родам. */
export const MATERNITY_DAYS = {
	normal: 140,
	complicated: 156,
	multiple: 194
} as const

export type MaternityKind = keyof typeof MATERNITY_DAYS

export interface MaternityInput {
	twoYearsEarnings: number
	/** Исключаемые дни: больничные, прошлые декреты. Вычитаются из 730. */
	excludedDays: number
	kind: MaternityKind
	mrot?: number
	contributionBase?: number
}

export interface MaternityResult {
	averageDaily: number
	days: number
	total: number
	daysBase: number
	cappedByBase: boolean
	raisedToMrot: boolean
}

/**
 * Пособие по беременности и родам.
 *
 * Отличие от больничного в двух местах: делят не на жёсткие 730, а на 730
 * минус исключаемые дни (болезни и прошлые декреты), и стаж на размер не
 * влияет — платят 100% независимо от него.
 */
export function calculateMaternity(
	input: MaternityInput
): MaternityResult | null {
	const {
		twoYearsEarnings,
		excludedDays,
		kind,
		mrot = DEFAULT_MROT,
		contributionBase = DEFAULT_CONTRIBUTION_BASE
	} = input

	if (
		!Number.isFinite(twoYearsEarnings) ||
		twoYearsEarnings < 0 ||
		excludedDays < 0 ||
		excludedDays >= 730
	) {
		return null
	}

	const limit = contributionBase * 2
	const cappedByBase = twoYearsEarnings > limit
	const base = Math.min(twoYearsEarnings, limit)

	const daysBase = 730 - excludedDays
	let averageDaily = base / daysBase

	const mrotDaily = (mrot * 24) / 730
	const raisedToMrot = averageDaily < mrotDaily
	if (raisedToMrot) averageDaily = mrotDaily

	const days = MATERNITY_DAYS[kind]
	return {
		averageDaily,
		days,
		total: averageDaily * days,
		daysBase,
		cappedByBase,
		raisedToMrot
	}
}

/* ------------------------------------------------------------------ стаж */

export interface Period {
	from: string
	to: string
}

export interface ServiceLength {
	years: number
	months: number
	days: number
	totalDays: number
}

/**
 * Трудовой стаж как сумма периодов.
 *
 * Считается по правилу кадровиков: день увольнения входит в стаж, поэтому к
 * разнице дат прибавляется единица. Затем общее число дней переводится в
 * годы и месяцы через 30 дней в месяце и 12 месяцев в году — так предписано
 * для подсчёта стажа, хотя календарно месяцы разной длины.
 */
export function calculateServiceLength(
	periods: Period[]
): ServiceLength | null {
	let totalDays = 0

	for (const period of periods) {
		const from = new Date(period.from)
		const to = new Date(period.to)
		if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) continue
		if (to < from) continue

		const days = Math.round((to.getTime() - from.getTime()) / 86400000) + 1
		totalDays += days
	}

	if (totalDays <= 0) return null

	const years = Math.floor(totalDays / 360)
	const months = Math.floor((totalDays % 360) / 30)
	const days = totalDays - years * 360 - months * 30

	return { years, months, days, totalDays }
}

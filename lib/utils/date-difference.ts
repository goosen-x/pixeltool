const DAY_MS = 24 * 60 * 60 * 1000

/** Обнуляет время, чтобы разница считалась по календарным дням, а не по часам. */
function atMidnight(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function daysBetween(a: Date, b: Date): number {
	const diff = atMidnight(b).getTime() - atMidnight(a).getTime()
	return Math.round(Math.abs(diff) / DAY_MS)
}

export interface YearsMonthsDays {
	years: number
	months: number
	days: number
}

/**
 * Календарная разбивка «года, месяцы, дни» — не totalDays/365, а честный
 * помесячный подсчёт, как у большинства подобных калькуляторов (сверено с
 * golden-примером planetcalc: 2021-09-01 → 2026-08-16 = 4 года 11 мес 15 дн).
 */
export function yearsMonthsDaysBetween(a: Date, b: Date): YearsMonthsDays {
	let [from, to] = a <= b ? [a, b] : [b, a]
	from = atMidnight(from)
	to = atMidnight(to)

	let years = to.getFullYear() - from.getFullYear()
	let months = to.getMonth() - from.getMonth()
	let days = to.getDate() - from.getDate()

	if (days < 0) {
		months -= 1
		// Число дней в месяце, предшествующем месяцу `to` (day=0 — последний
		// день предыдущего месяца).
		const prevMonthLastDay = new Date(to.getFullYear(), to.getMonth(), 0)
		days += prevMonthLastDay.getDate()
	}

	if (months < 0) {
		years -= 1
		months += 12
	}

	return { years, months, days }
}

export type PeriodUnit = 'days' | 'months' | 'years'

/**
 * Прибавляет период к дате календарно, с клампом дня месяца — 31 января +
 * 1 месяц даёт 28/29 февраля, а не «перетекает» в март, как при голом
 * `setMonth` (JS Date нормализует несуществующий день сам, без клампа).
 */
export function addPeriod(date: Date, amount: number, unit: PeriodUnit): Date {
	if (unit === 'days') {
		const result = atMidnight(date)
		result.setDate(result.getDate() + amount)
		return result
	}

	const monthsToAdd = unit === 'years' ? amount * 12 : amount
	const day = date.getDate()
	const firstOfTargetMonth = new Date(
		date.getFullYear(),
		date.getMonth() + monthsToAdd,
		1
	)
	const daysInTargetMonth = new Date(
		firstOfTargetMonth.getFullYear(),
		firstOfTargetMonth.getMonth() + 1,
		0
	).getDate()
	firstOfTargetMonth.setDate(Math.min(day, daysInTargetMonth))
	return firstOfTargetMonth
}

/** Подписанная разница в днях: положительная — b позже a, отрицательная — раньше. */
export function signedDaysBetween(a: Date, b: Date): number {
	return Math.round(
		(atMidnight(b).getTime() - atMidnight(a).getTime()) / DAY_MS
	)
}

const SUNDAY = 0
const SATURDAY = 6

/** Количество будних дней (пн-пт), пройденных между двумя датами. */
export function businessDaysBetween(a: Date, b: Date): number {
	const [from, to] =
		a <= b ? [atMidnight(a), atMidnight(b)] : [atMidnight(b), atMidnight(a)]

	const totalDays = Math.round((to.getTime() - from.getTime()) / DAY_MS)
	const fullWeeks = Math.floor(totalDays / 7)
	let businessDays = fullWeeks * 5

	let dayOfWeek = from.getDay()
	const remainder = totalDays % 7
	for (let i = 0; i < remainder; i++) {
		dayOfWeek = (dayOfWeek + 1) % 7
		if (dayOfWeek !== SUNDAY && dayOfWeek !== SATURDAY) businessDays++
	}

	return businessDays
}

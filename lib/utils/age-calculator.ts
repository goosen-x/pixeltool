import { yearsMonthsDaysBetween, daysBetween } from './date-difference'

const WEEKDAYS_RU = [
	'воскресенье',
	'понедельник',
	'вторник',
	'среда',
	'четверг',
	'пятница',
	'суббота'
]

export interface AgeResult {
	years: number
	months: number
	days: number
	totalDays: number
	totalWeeks: number
	totalMonths: number
	bornWeekday: string
	nextBirthday: Date
	daysUntilNextBirthday: number
}

/**
 * Следующий день рождения от даты `on`: тот же месяц/число в этом году, а
 * если он уже прошёл (или сегодня) — в следующем. 29 февраля клампится на
 * 28-е в невисокосный год, как и в date-difference addPeriod.
 */
function nextBirthdayAfter(birth: Date, on: Date): Date {
	const onMidnight = new Date(on.getFullYear(), on.getMonth(), on.getDate())

	const daysInFeb = (year: number) =>
		new Date(year, 2, 0).getDate() === 29 ? 29 : 28

	const dayForYear = (year: number) =>
		birth.getMonth() === 1 && birth.getDate() === 29
			? daysInFeb(year)
			: birth.getDate()

	let candidate = new Date(
		onMidnight.getFullYear(),
		birth.getMonth(),
		dayForYear(onMidnight.getFullYear())
	)

	if (candidate.getTime() <= onMidnight.getTime()) {
		const nextYear = onMidnight.getFullYear() + 1
		candidate = new Date(nextYear, birth.getMonth(), dayForYear(nextYear))
	}

	return candidate
}

export function weekdayNameRu(date: Date): string {
	return WEEKDAYS_RU[date.getDay()]
}

export function calculateAge(birth: Date, on: Date): AgeResult {
	const { years, months, days } = yearsMonthsDaysBetween(birth, on)
	const totalDays = daysBetween(birth, on)
	const nextBirthday = nextBirthdayAfter(birth, on)

	return {
		years,
		months,
		days,
		totalDays,
		totalWeeks: Math.floor(totalDays / 7),
		totalMonths: years * 12 + months,
		bornWeekday: weekdayNameRu(birth),
		nextBirthday,
		daysUntilNextBirthday: daysBetween(on, nextBirthday)
	}
}

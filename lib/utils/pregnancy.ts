/**
 * Сроки беременности от первого дня последней менструации (ПДМ).
 *
 * Считается акушерский срок — тот, которым пользуются в женской консультации:
 * отсчёт идёт от ПДМ, а не от зачатия, поэтому в первые две недели
 * беременности формально ещё нет. Правило Негеле: ПДР = ПДМ + 280 дней, с
 * поправкой на длину цикла, если он отличается от 28 дней.
 *
 * Это арифметика по дате, а не медицинская оценка: реальный срок уточняет
 * только УЗИ, и роды в интервале 37–42 недель считаются доношенными.
 */

/** Средняя длительность беременности от ПДМ, дней. */
export const GESTATION_DAYS = 280

/** Цикл, под который выведено правило Негеле. */
export const REFERENCE_CYCLE_DAYS = 28

/** Срок, с которого в России оформляют отпуск по беременности и родам. */
export const MATERNITY_LEAVE_WEEKS = 30

/** То же для многоплодной беременности. */
export const MATERNITY_LEAVE_WEEKS_MULTIPLE = 28

const DAY_MS = 24 * 60 * 60 * 1000

export interface PregnancyTerm {
	/** Предполагаемая дата родов. */
	dueDate: Date
	/** Полных недель акушерского срока на выбранную дату. */
	weeks: number
	/** Дней сверх полных недель. */
	days: number
	/** Всего дней от ПДМ — отрицательное, если дата раньше ПДМ. */
	totalDays: number
	/** 1, 2 или 3; null, если срок вне беременности. */
	trimester: 1 | 2 | 3 | null
	/** Дата выхода в отпуск по беременности и родам. */
	maternityLeaveDate: Date
	/** Дней до родов; отрицательное, если ПДР уже прошла. */
	daysUntilDue: number
}

function addDays(date: Date, days: number): Date {
	const result = new Date(date)
	result.setDate(result.getDate() + days)
	return result
}

/** Разница в целых днях по календарным датам, без учёта времени суток. */
function daysBetween(from: Date, to: Date): number {
	const a = new Date(from.getFullYear(), from.getMonth(), from.getDate())
	const b = new Date(to.getFullYear(), to.getMonth(), to.getDate())
	return Math.round((b.getTime() - a.getTime()) / DAY_MS)
}

export function calculatePregnancy(
	lastPeriod: Date,
	today: Date,
	cycleDays: number = REFERENCE_CYCLE_DAYS,
	multiple = false
): PregnancyTerm {
	// Поправка на цикл: овуляция при длинном цикле наступает позже, значит и
	// роды сдвигаются. При коротком — наоборот.
	const shift = cycleDays - REFERENCE_CYCLE_DAYS
	const dueDate = addDays(lastPeriod, GESTATION_DAYS + shift)

	const totalDays = daysBetween(lastPeriod, today)
	const weeks = Math.floor(totalDays / 7)
	const days = totalDays - weeks * 7

	const trimester: 1 | 2 | 3 | null =
		totalDays < 0 || weeks > 42 ? null : weeks < 14 ? 1 : weeks < 28 ? 2 : 3

	const leaveWeeks = multiple
		? MATERNITY_LEAVE_WEEKS_MULTIPLE
		: MATERNITY_LEAVE_WEEKS

	return {
		dueDate,
		weeks,
		days,
		totalDays,
		trimester,
		maternityLeaveDate: addDays(lastPeriod, leaveWeeks * 7),
		daysUntilDue: daysBetween(today, dueDate)
	}
}

/**
 * Сколько осталось до даты.
 *
 * Считается по календарным дням в местном часовом поясе пользователя, а не
 * по UTC: «сколько дней до Нового года» человек спрашивает про свой Новый
 * год, и в Владивостоке ответ на несколько часов отличается от московского.
 * Поэтому обе даты приводятся к полуночи локального дня, и разница между
 * ними всегда целое число суток без хвостов от часовых поясов.
 */

export interface Countdown {
	/** Полных дней до цели. Отрицательное, если дата уже прошла. */
	days: number
	weeks: number
	/** Остаток дней сверх полных недель. */
	daysAfterWeeks: number
	/** Рабочих дней без учёта праздников — только вычет выходных. */
	workdays: number
	/** Дата уже наступила. */
	passed: boolean
	/** Сегодня и есть искомый день. */
	isToday: boolean
}

/** Полночь локального дня — общий знаменатель для всех расчётов. */
export function startOfDay(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

const DAY_MS = 86_400_000

/**
 * Число календарных дней между днями.
 *
 * Считается по разнице полуночей, а не делением миллисекунд: при переходе
 * на летнее время сутки бывают длиной 23 или 25 часов, и деление дало бы
 * дробь. Округление её скрывает, но на длинных промежутках ошибка копится.
 */
export function daysBetween(from: Date, to: Date): number {
	const a = startOfDay(from)
	const b = startOfDay(to)
	return Math.round((b.getTime() - a.getTime()) / DAY_MS)
}

/**
 * Рабочие дни между датами — вычитаются только суббота и воскресенье.
 *
 * Праздники не учитываются намеренно: их перенос устанавливается
 * постановлением правительства на каждый год отдельно, и зашивать
 * прошлогодний список значило бы врать. Инструмент честно говорит, что
 * считает без праздников.
 */
export function workdaysBetween(from: Date, to: Date): number {
	const total = daysBetween(from, to)
	if (total <= 0) return 0

	let count = 0
	const cursor = startOfDay(from)

	for (let i = 0; i < total; i++) {
		cursor.setDate(cursor.getDate() + 1)
		const day = cursor.getDay()
		if (day !== 0 && day !== 6) count++
	}

	return count
}

export function countdownTo(target: Date, now: Date = new Date()): Countdown {
	const days = daysBetween(now, target)
	const positive = Math.max(0, days)

	return {
		days,
		weeks: Math.floor(positive / 7),
		daysAfterWeeks: positive % 7,
		workdays: workdaysBetween(now, target),
		passed: days < 0,
		isToday: days === 0
	}
}

export interface HolidayTarget {
	slug: string
	name: string
	/** Месяц с единицы. */
	month: number
	day: number
}

/**
 * Повторяющиеся даты. Год не хранится: если дата в этом году уже прошла,
 * берётся следующая — иначе «сколько дней до 8 марта» девятого марта
 * показывало бы минус.
 */
export const RECURRING_TARGETS: HolidayTarget[] = [
	{ slug: 'novyy-god', name: 'Новый год', month: 1, day: 1 },
	{ slug: 'leto', name: 'лета', month: 6, day: 1 },
	{ slug: '1-sentyabrya', name: '1 сентября', month: 9, day: 1 },
	{ slug: '8-marta', name: '8 марта', month: 3, day: 8 },
	{ slug: '23-fevralya', name: '23 февраля', month: 2, day: 23 },
	{ slug: '9-maya', name: '9 мая', month: 5, day: 9 }
]

/** Ближайшее наступление повторяющейся даты, считая сегодняшний день. */
export function nextOccurrence(
	target: Pick<HolidayTarget, 'month' | 'day'>,
	now: Date = new Date()
): Date {
	const today = startOfDay(now)
	const thisYear = new Date(now.getFullYear(), target.month - 1, target.day)

	if (thisYear.getTime() >= today.getTime()) return thisYear
	return new Date(now.getFullYear() + 1, target.month - 1, target.day)
}

export function getTargetBySlug(slug: string): HolidayTarget | undefined {
	return RECURRING_TARGETS.find(item => item.slug === slug)
}

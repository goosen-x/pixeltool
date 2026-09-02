/**
 * Фазы Луны.
 *
 * Считается по среднему синодическому месяцу от опорного новолуния. Это
 * приближение: реальная орбита Луны вытянута, и настоящее новолуние
 * отклоняется от среднего на несколько часов, изредка до полусуток. Для
 * календаря фаз и лунных дней такой точности достаточно, и об ограничении
 * сказано прямо на странице — обещать астрономическую точность там, где её
 * нет, значит вводить в заблуждение.
 *
 * Для расчёта затмений, приливов или астрологической карты этот метод не
 * годится: там нужны эфемериды.
 */

/** Средняя длина синодического месяца в сутках. */
export const SYNODIC_MONTH = 29.530588853

/**
 * Опорное новолуние: 6 января 2000 года, 18:14 UTC. Общепринятая точка
 * отсчёта в подобных расчётах.
 */
export const REFERENCE_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14, 0)

const DAY_MS = 86_400_000

export type PhaseId =
	| 'new'
	| 'waxing-crescent'
	| 'first-quarter'
	| 'waxing-gibbous'
	| 'full'
	| 'waning-gibbous'
	| 'last-quarter'
	| 'waning-crescent'

export interface Phase {
	id: PhaseId
	name: string
	/** Растущая ли Луна — определяет, с какой стороны серп. */
	waxing: boolean
}

export const PHASES: Record<PhaseId, Phase> = {
	new: { id: 'new', name: 'Новолуние', waxing: true },
	'waxing-crescent': {
		id: 'waxing-crescent',
		name: 'Растущий серп',
		waxing: true
	},
	'first-quarter': {
		id: 'first-quarter',
		name: 'Первая четверть',
		waxing: true
	},
	'waxing-gibbous': {
		id: 'waxing-gibbous',
		name: 'Растущая Луна',
		waxing: true
	},
	full: { id: 'full', name: 'Полнолуние', waxing: false },
	'waning-gibbous': {
		id: 'waning-gibbous',
		name: 'Убывающая Луна',
		waxing: false
	},
	'last-quarter': {
		id: 'last-quarter',
		name: 'Последняя четверть',
		waxing: false
	},
	'waning-crescent': {
		id: 'waning-crescent',
		name: 'Убывающий серп',
		waxing: false
	}
}

export interface MoonState {
	/** Возраст Луны в сутках от новолуния, 0…29,53. */
	age: number
	/** Доля цикла, 0…1. */
	fraction: number
	/** Освещённость диска, 0…1. */
	illumination: number
	phase: Phase
	/** Лунный день, от 1 до 30. */
	lunarDay: number
}

/** Положение в цикле: 0 — новолуние, 0,5 — полнолуние. */
export function moonFraction(date: Date): number {
	const elapsed = (date.getTime() - REFERENCE_NEW_MOON) / DAY_MS
	const cycles = elapsed / SYNODIC_MONTH
	const fraction = cycles - Math.floor(cycles)
	// Отрицательные значения для дат до опорного новолуния приводим в 0…1
	return fraction < 0 ? fraction + 1 : fraction
}

/**
 * Фаза по доле цикла.
 *
 * Границы «четвертей» намеренно узкие: новолунием называют не половину
 * цикла, а примерно сутки вокруг точного момента. Иначе «новолуние» висело
 * бы в календаре неделю и перестало что-либо значить.
 */
export function phaseFromFraction(fraction: number): Phase {
	const f = fraction
	if (f < 0.0169 || f >= 0.9831) return PHASES.new
	if (f < 0.2331) return PHASES['waxing-crescent']
	if (f < 0.2669) return PHASES['first-quarter']
	if (f < 0.4831) return PHASES['waxing-gibbous']
	if (f < 0.5169) return PHASES.full
	if (f < 0.7331) return PHASES['waning-gibbous']
	if (f < 0.7669) return PHASES['last-quarter']
	return PHASES['waning-crescent']
}

export function getMoonState(date: Date): MoonState {
	const fraction = moonFraction(date)
	const age = fraction * SYNODIC_MONTH

	// Освещённость меняется по косинусу: ноль в новолуние, единица в
	// полнолуние. Это тоже приближение, но зрительно совпадает с наблюдаемым.
	const illumination = (1 - Math.cos(2 * Math.PI * fraction)) / 2

	return {
		age,
		fraction,
		illumination,
		phase: phaseFromFraction(fraction),
		lunarDay: Math.floor(age) + 1
	}
}

/** Ближайшее новолуние не раньше указанной даты. */
export function nextNewMoon(from: Date): Date {
	const fraction = moonFraction(from)
	const daysLeft = (1 - fraction) * SYNODIC_MONTH
	return new Date(from.getTime() + daysLeft * DAY_MS)
}

/** Ближайшее полнолуние не раньше указанной даты. */
export function nextFullMoon(from: Date): Date {
	const fraction = moonFraction(from)
	const toFull = fraction < 0.5 ? 0.5 - fraction : 1.5 - fraction
	return new Date(from.getTime() + toFull * SYNODIC_MONTH * DAY_MS)
}

export interface MoonDay {
	date: Date
	state: MoonState
}

/** Состояние Луны на каждый день месяца — для календарной сетки. */
export function moonMonth(year: number, month: number): MoonDay[] {
	const days: MoonDay[] = []
	const daysInMonth = new Date(year, month, 0).getDate()

	for (let day = 1; day <= daysInMonth; day++) {
		// Полдень: фаза меняется в течение суток, и полдень репрезентативнее
		// полуночи для ответа «какая сегодня Луна»
		const date = new Date(year, month - 1, day, 12)
		days.push({ date, state: getMoonState(date) })
	}

	return days
}

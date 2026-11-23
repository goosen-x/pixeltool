/**
 * Калькулятор сна по циклам.
 *
 * Сон идёт циклами в среднем по 90 минут (Sleep Foundation: первый цикл
 * 70–100 минут, следующие 90–120, за ночь 4–6 циклов). Просыпаться легче
 * на стыке циклов, а не посреди глубокого сна, поэтому время отхода ко сну
 * и подъёма подбирается кратным длине цикла плюс время на засыпание.
 *
 * Время суток везде хранится в минутах от полуночи: 0…1439.
 */

export const MINUTES_IN_DAY = 24 * 60
export const DEFAULT_CYCLE = 90
export const DEFAULT_FALL_ASLEEP = 15
/** Варианты от 3 до 6 циклов: от 4,5 до 9 часов сна при цикле 90 минут. */
export const CYCLE_COUNTS = [6, 5, 4, 3] as const
/** Рекомендация для взрослых: 7–9 часов сна. */
export const RECOMMENDED_MIN = 7 * 60
export const RECOMMENDED_MAX = 9 * 60

export interface SleepSettings {
	/** Длина одного цикла, минут. */
	cycle?: number
	/** Сколько минут уходит на засыпание. */
	fallAsleep?: number
	/** Сколько циклов перебирать. */
	cycles?: readonly number[]
}

export interface SleepOption {
	cycles: number
	/** Когда лечь в постель. */
	bedtime: number
	/** Когда уснуть: bedtime + время на засыпание. */
	asleepAt: number
	/** Когда проснуться. */
	wake: number
	/** Чистый сон, минут. */
	sleepMinutes: number
	/** Попадает в норму 7–9 часов. */
	recommended: boolean
}

/** Приводит минуты к диапазону суток 0…1439, в том числе отрицательные. */
export function wrapDay(minutes: number): number {
	return (
		((Math.round(minutes) % MINUTES_IN_DAY) + MINUTES_IN_DAY) % MINUTES_IN_DAY
	)
}

function resolve(settings: SleepSettings) {
	const cycle = settings.cycle ?? DEFAULT_CYCLE
	const fallAsleep = settings.fallAsleep ?? DEFAULT_FALL_ASLEEP
	const cycles = settings.cycles ?? CYCLE_COUNTS
	if (!(cycle > 0)) throw new RangeError('Длина цикла должна быть больше нуля')
	if (!(fallAsleep >= 0))
		throw new RangeError('Время на засыпание не может быть отрицательным')
	return { cycle, fallAsleep, cycles }
}

function option(
	cycles: number,
	bedtime: number,
	cycle: number,
	fallAsleep: number
): SleepOption {
	const sleepMinutes = cycles * cycle
	return {
		cycles,
		bedtime: wrapDay(bedtime),
		asleepAt: wrapDay(bedtime + fallAsleep),
		wake: wrapDay(bedtime + fallAsleep + sleepMinutes),
		sleepMinutes,
		recommended:
			sleepMinutes >= RECOMMENDED_MIN && sleepMinutes <= RECOMMENDED_MAX
	}
}

/**
 * Во сколько лечь, чтобы проснуться в `wake`: подъём минус N циклов минус
 * время на засыпание. Сначала самый длинный сон.
 */
export function bedtimesForWake(
	wake: number,
	settings: SleepSettings = {}
): SleepOption[] {
	const { cycle, fallAsleep, cycles } = resolve(settings)
	return [...cycles]
		.sort((a, b) => b - a)
		.map(n => option(n, wake - n * cycle - fallAsleep, cycle, fallAsleep))
}

/**
 * Во сколько вставать, если лечь в `bedtime`: отбой плюс время на засыпание
 * плюс N циклов. Сначала самый ранний подъём.
 */
export function wakeTimesForBedtime(
	bedtime: number,
	settings: SleepSettings = {}
): SleepOption[] {
	const { cycle, fallAsleep, cycles } = resolve(settings)
	return [...cycles]
		.sort((a, b) => a - b)
		.map(n => option(n, bedtime, cycle, fallAsleep))
}

/**
 * Разбирает время из поля ввода: «7», «7:30», «07.30», «7 30», «730», «0730».
 * Возвращает минуты от полуночи или null, если это не время.
 */
export function parseTime(input: string): number | null {
	const s = input.trim()
	if (!s) return null
	let h: number
	let m: number
	const sep = s.match(/^(\d{1,2})\s*[:.,\s-]\s*(\d{1,2})$/)
	if (sep) {
		h = Number(sep[1])
		m = Number(sep[2])
		if (sep[2].length === 1) m *= 10
	} else if (/^\d{1,2}$/.test(s)) {
		h = Number(s)
		m = 0
	} else if (/^\d{3,4}$/.test(s)) {
		h = Number(s.slice(0, -2))
		m = Number(s.slice(-2))
	} else {
		return null
	}
	if (h === 24 && m === 0) return 0
	if (h > 23 || m > 59) return null
	return h * 60 + m
}

/** 0…1439 → «07:05». */
export function formatTime(minutes: number): string {
	const t = wrapDay(minutes)
	const h = Math.floor(t / 60)
	const m = t % 60
	return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/** 450 → «7 ч 30 мин», 540 → «9 ч». */
export function formatDuration(minutes: number): string {
	const h = Math.floor(minutes / 60)
	const m = Math.round(minutes % 60)
	if (h === 0) return `${m} мин`
	return m === 0 ? `${h} ч` : `${h} ч ${m} мин`
}

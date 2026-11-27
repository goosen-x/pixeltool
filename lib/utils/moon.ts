/**
 * Фазы Луны и лунные дни.
 *
 * До 28.11.2026 всё считалось по среднему синодическому месяцу от опорного
 * новолуния. Сверка с эфемеридами (astronomy-engine) показала ошибку до
 * 11 часов: новолуние 19 марта 2026 выходило 18-м, полнолуние 3 января
 * съезжало на вечер. А лунный день считался сутками от новолуния, тогда как
 * в русской традиции (и во всех популярных календарях) он начинается с
 * восходом Луны. Номер дня расходился с любым другим календарём через раз.
 *
 * Теперь положение Луны берётся по Меёсу («Астрономические алгоритмы»,
 * гл. 47, главные члены рядов): погрешность долготы около 0,01°, моменты
 * фаз — в пределах пары минут. Солнце — sunLongitude из zodiac.ts (гл. 25).
 * Восход Луны считается для Москвы: от места зависит, когда начинается
 * лунный день, и календари без выбора города почти всегда дают Москву.
 */

import { sunLongitude } from './zodiac'

/** Средняя длина синодического месяца в сутках. */
export const SYNODIC_MONTH = 29.530588853

/** Опорное новолуние: 6 января 2000 года, 18:14 UTC. */
export const REFERENCE_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14, 0)

/** Координаты, для которых считается восход Луны. */
export const MOSCOW = { lat: 55.7558, lon: 37.6173 }

const DAY_MS = 86_400_000
const HOUR_MS = 3_600_000
const DEG = Math.PI / 180

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

/** Знаки по порядку от Овна, в предложном падеже: «Луна в Скорпионе». */
export const MOON_SIGNS = [
	{ symbol: '♈', prepositional: 'Овне' },
	{ symbol: '♉', prepositional: 'Тельце' },
	{ symbol: '♊', prepositional: 'Близнецах' },
	{ symbol: '♋', prepositional: 'Раке' },
	{ symbol: '♌', prepositional: 'Льве' },
	{ symbol: '♍', prepositional: 'Деве' },
	{ symbol: '♎', prepositional: 'Весах' },
	{ symbol: '♏', prepositional: 'Скорпионе' },
	{ symbol: '♐', prepositional: 'Стрельце' },
	{ symbol: '♑', prepositional: 'Козероге' },
	{ symbol: '♒', prepositional: 'Водолее' },
	{ symbol: '♓', prepositional: 'Рыбах' }
]

// Таблица 47.A: D, M, M', F и коэффициент долготы в 1e-6 градуса.
// Взяты члены крупнее 0,0005°, остальные вместе дают меньше 0,01°.
const LON_TERMS: [number, number, number, number, number][] = [
	[0, 0, 1, 0, 6288774],
	[2, 0, -1, 0, 1274027],
	[2, 0, 0, 0, 658314],
	[0, 0, 2, 0, 213618],
	[0, 1, 0, 0, -185116],
	[0, 0, 0, 2, -114332],
	[2, 0, -2, 0, 58793],
	[2, -1, -1, 0, 57066],
	[2, 0, 1, 0, 53322],
	[2, -1, 0, 0, 45758],
	[0, 1, -1, 0, -40923],
	[1, 0, 0, 0, -34720],
	[0, 1, 1, 0, -30383],
	[2, 0, 0, -2, 15327],
	[0, 0, 1, 2, -12528],
	[0, 0, 1, -2, 10980],
	[4, 0, -1, 0, 10675],
	[0, 0, 3, 0, 10034],
	[4, 0, -2, 0, 8548],
	[2, 1, -1, 0, -7888],
	[2, 1, 0, 0, -6766],
	[1, 0, -1, 0, -5163],
	[1, 1, 0, 0, 4987],
	[2, -1, 1, 0, 4036],
	[2, 0, 2, 0, 3994],
	[4, 0, 0, 0, 3861],
	[2, 0, -3, 0, 3665],
	[0, 1, -2, 0, -2689],
	[2, 0, -1, 2, -2602],
	[2, -1, -2, 0, 2390],
	[1, 0, 1, 0, -2348],
	[2, -2, 0, 0, 2236],
	[0, 1, 2, 0, -2120],
	[0, 2, 0, 0, -2069],
	[2, -2, -1, 0, 2048],
	[2, 0, 1, -2, -1773],
	[2, 0, 0, 2, -1595],
	[4, -1, -1, 0, 1215],
	[0, 0, 2, 2, -1110],
	[3, 0, -1, 0, -892],
	[2, 1, 1, 0, -810],
	[4, -1, -2, 0, 759],
	[0, 2, -1, 0, -713],
	[2, 2, -1, 0, -700],
	[2, 1, -2, 0, 691],
	[2, -1, 0, -2, 596],
	[4, 0, 1, 0, 549],
	[0, 0, 4, 0, 537],
	[4, -1, 0, 0, 520],
	[1, 0, -2, 0, -487]
]

// Таблица 47.B: то же для широты.
const LAT_TERMS: [number, number, number, number, number][] = [
	[0, 0, 0, 1, 5128122],
	[0, 0, 1, 1, 280602],
	[0, 0, 1, -1, 277693],
	[2, 0, 0, -1, 173237],
	[2, 0, -1, 1, 55413],
	[2, 0, -1, -1, 46271],
	[2, 0, 0, 1, 32573],
	[0, 0, 2, 1, 17198],
	[2, 0, 1, -1, 9266],
	[0, 0, 2, -1, 8822],
	[2, -1, 0, -1, 8216],
	[2, 0, -2, -1, 4324],
	[2, 0, 1, 1, 4200],
	[2, 1, 0, -1, -3359],
	[2, -1, -1, 1, 2463],
	[2, -1, 0, 1, 2211],
	[2, -1, -1, -1, 2065],
	[0, 1, -1, -1, -1870],
	[4, 0, -1, -1, 1828],
	[0, 1, 0, 1, -1794],
	[0, 0, 0, 3, -1749],
	[0, 1, -1, 1, -1565],
	[1, 0, 0, 1, -1491],
	[0, 1, 1, 1, -1475],
	[0, 1, 1, -1, -1410],
	[0, 1, 0, -1, -1344],
	[1, 0, 0, -1, -1335],
	[0, 0, 3, 1, 1107],
	[4, 0, 0, -1, 1021],
	[4, 0, -1, 1, 833]
]

function norm360(x: number): number {
	return ((x % 360) + 360) % 360
}

function centuries(utcMs: number): number {
	const jd = utcMs / DAY_MS + 2_440_587.5
	return (jd - 2_451_545) / 36_525
}

/** Видимые эклиптические долгота и широта Луны в градусах. */
export function moonPosition(utcMs: number): { lon: number; lat: number } {
	const t = centuries(utcMs)
	const t2 = t * t
	const t3 = t2 * t
	const t4 = t3 * t

	const lp =
		218.3164477 +
		481_267.88123421 * t -
		0.0015786 * t2 +
		t3 / 538_841 -
		t4 / 65_194_000
	const d =
		297.8501921 +
		445_267.1114034 * t -
		0.0018819 * t2 +
		t3 / 545_868 -
		t4 / 113_065_000
	const m = 357.5291092 + 35_999.0502909 * t - 0.0001536 * t2 + t3 / 24_490_000
	const mp =
		134.9633964 +
		477_198.8675055 * t +
		0.0087414 * t2 +
		t3 / 69_699 -
		t4 / 14_712_000
	const f =
		93.272095 +
		483_202.0175233 * t -
		0.0036539 * t2 -
		t3 / 3_526_000 +
		t4 / 863_310_000
	const e = 1 - 0.002516 * t - 0.0000074 * t2
	const a1 = (119.75 + 131.849 * t) * DEG
	const a2 = (53.09 + 479_264.29 * t) * DEG
	const a3 = (313.45 + 481_266.484 * t) * DEG

	const series = (terms: typeof LON_TERMS, trig: (x: number) => number) => {
		let sum = 0
		for (const [cd, cm, cmp, cf, coef] of terms) {
			const arg = (cd * d + cm * m + cmp * mp + cf * f) * DEG
			const ecc = cm === 0 ? 1 : Math.abs(cm) === 1 ? e : e * e
			sum += coef * ecc * trig(arg)
		}
		return sum
	}

	const sumL =
		series(LON_TERMS, Math.sin) +
		3958 * Math.sin(a1) +
		1962 * Math.sin((lp - f) * DEG) +
		318 * Math.sin(a2)
	const sumB =
		series(LAT_TERMS, Math.sin) -
		2235 * Math.sin(lp * DEG) +
		382 * Math.sin(a3) +
		175 * Math.sin(a1 - f * DEG) +
		175 * Math.sin(a1 + f * DEG) +
		127 * Math.sin((lp - mp) * DEG) -
		115 * Math.sin((lp + mp) * DEG)

	// Нутация по долготе — та же поправка, что в sunLongitude, чтобы
	// разность долгот (а с ней моменты фаз) была согласованной
	const omega = (125.04 - 1934.136 * t) * DEG
	const lon = norm360(lp + sumL / 1e6 - 0.00478 * Math.sin(omega))
	return { lon, lat: sumB / 1e6 }
}

/** Угол Луна − Солнце по долготе, 0…360°: 0 — новолуние, 180 — полнолуние. */
export function elongation(utcMs: number): number {
	return norm360(moonPosition(utcMs).lon - sunLongitude(utcMs))
}

/** Положение в цикле: 0 — новолуние, 0,5 — полнолуние. */
export function moonFraction(date: Date): number {
	return elongation(date.getTime()) / 360
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

/**
 * Момент, когда угол Луна − Солнце равен target (0, 90, 180, 270), ближайший
 * к оценке guess. Луна обгоняет Солнце примерно на 12,19° в сутки; метод
 * Ньютона с этой скоростью сходится за 3–4 шага.
 */
function solveElongation(target: number, guess: number): number {
	let t = guess
	for (let i = 0; i < 12; i++) {
		let diff = elongation(t) - target
		if (diff > 180) diff -= 360
		if (diff < -180) diff += 360
		const step = (diff / 12.190749) * DAY_MS
		t -= step
		if (Math.abs(step) < 1000) break
	}
	return t
}

const QUARTER_PHASES: PhaseId[] = [
	'new',
	'first-quarter',
	'full',
	'last-quarter'
]

export interface MoonEvent {
	phase: Phase
	date: Date
}

/** Точные моменты главных фаз в промежутке [fromMs, toMs). */
export function moonEvents(fromMs: number, toMs: number): MoonEvent[] {
	const events: MoonEvent[] = []
	const cyclesFrom = (fromMs - REFERENCE_NEW_MOON) / DAY_MS / SYNODIC_MONTH
	// С запасом в четверть цикла: средний момент гуляет на полсуток
	let k = Math.floor(cyclesFrom * 4) - 1
	for (;;) {
		const guess = REFERENCE_NEW_MOON + (k / 4) * SYNODIC_MONTH * DAY_MS
		if (guess > toMs + 2 * DAY_MS) break
		const quarter = ((k % 4) + 4) % 4
		const time = solveElongation(quarter * 90, guess)
		if (time >= fromMs && time < toMs) {
			events.push({
				phase: PHASES[QUARTER_PHASES[quarter]],
				date: new Date(time)
			})
		}
		k++
	}
	return events
}

function findPhaseTime(from: Date, quarter: 0 | 2, direction: 1 | -1): Date {
	const span = 32 * DAY_MS
	const fromMs = from.getTime()
	const list =
		direction === 1
			? moonEvents(fromMs, fromMs + span)
			: moonEvents(fromMs - span, fromMs + 1).reverse()
	const id = QUARTER_PHASES[quarter]
	return list.find(event => event.phase.id === id)!.date
}

/** Ближайшее новолуние не раньше указанной даты. */
export function nextNewMoon(from: Date): Date {
	return findPhaseTime(from, 0, 1)
}

/** Ближайшее полнолуние не раньше указанной даты. */
export function nextFullMoon(from: Date): Date {
	return findPhaseTime(from, 2, 1)
}

/** Последнее новолуние не позже указанной даты. */
export function previousNewMoon(from: Date): Date {
	return findPhaseTime(from, 0, -1)
}

/**
 * Высота центра Луны над горизонтом минус высота, на которой виден восход
 * (верхний край на горизонте с учётом рефракции и параллакса Луны). Ноль
 * этой функции — момент восхода или захода.
 */
function moonAltitudeAboveRise(
	utcMs: number,
	lat: number,
	lon: number
): number {
	const { lon: lambda, lat: beta } = moonPosition(utcMs)
	const t = centuries(utcMs)
	const eps = (23.4392911 - 0.0130042 * t) * DEG
	const l = lambda * DEG
	const b = beta * DEG

	const ra = Math.atan2(
		Math.sin(l) * Math.cos(eps) - Math.tan(b) * Math.sin(eps),
		Math.cos(l)
	)
	const dec = Math.asin(
		Math.sin(b) * Math.cos(eps) + Math.cos(b) * Math.sin(eps) * Math.sin(l)
	)

	const days = utcMs / DAY_MS + 2_440_587.5 - 2_451_545
	const gmst = 280.46061837 + 360.98564736629 * days + 0.000387933 * t * t
	const hourAngle = (gmst + lon) * DEG - ra
	const phi = lat * DEG
	const altitude = Math.asin(
		Math.sin(phi) * Math.sin(dec) +
			Math.cos(phi) * Math.cos(dec) * Math.cos(hourAngle)
	)
	// 0,7275 средних параллакса (0,9507°) минус рефракция 34′ — Меёс, гл. 15
	const h0 = 0.7275 * 0.9507 - 34 / 60
	return altitude / DEG - h0
}

/** Моменты восхода Луны в промежутке [fromMs, toMs) для данного места. */
export function moonrises(
	fromMs: number,
	toMs: number,
	place: { lat: number; lon: number } = MOSCOW
): Date[] {
	const step = 20 * 60_000
	const rises: Date[] = []
	let prevT = fromMs
	let prevH = moonAltitudeAboveRise(prevT, place.lat, place.lon)
	for (let t = fromMs + step; t <= toMs + step; t += step) {
		const h = moonAltitudeAboveRise(t, place.lat, place.lon)
		if (prevH < 0 && h >= 0) {
			let lo = prevT
			let hi = t
			while (hi - lo > 15_000) {
				const mid = (lo + hi) / 2
				if (moonAltitudeAboveRise(mid, place.lat, place.lon) < 0) lo = mid
				else hi = mid
			}
			const rise = (lo + hi) / 2
			if (rise >= fromMs && rise < toMs) rises.push(new Date(rise))
		}
		prevT = t
		prevH = h
	}
	return rises
}

export interface LunarDay {
	/** Номер лунного дня, обычно 1…30. */
	number: number
	/** Когда он начался: новолуние для первого, восход Луны для остальных. */
	start: Date
}

/**
 * Лунный день по традиции: первый начинается в момент новолуния и длится
 * до ближайшего восхода Луны, каждый следующий — от восхода до восхода.
 * Если восходы на промежутке уже посчитаны, их можно передать в rises.
 */
export function lunarDayAt(
	date: Date,
	rises?: Date[],
	place: { lat: number; lon: number } = MOSCOW
): LunarDay {
	const newMoon = previousNewMoon(date)
	const list = (
		rises ?? moonrises(newMoon.getTime(), date.getTime() + 1, place)
	).filter(
		rise =>
			rise.getTime() > newMoon.getTime() && rise.getTime() <= date.getTime()
	)
	return {
		number: list.length + 1,
		start: list.length ? list[list.length - 1] : newMoon
	}
}

export interface MoonState {
	/** Возраст Луны в сутках от последнего новолуния. */
	age: number
	/** Доля цикла, 0…1. */
	fraction: number
	/** Освещённость диска, 0…1. */
	illumination: number
	phase: Phase
	/** Лунный день по восходам Луны в Москве. */
	lunarDay: number
	/** Начало текущего лунного дня. */
	lunarDayStart: Date
	/** Индекс знака в MOON_SIGNS: 0 — Овен. */
	sign: number
}

function stateAt(date: Date, rises?: Date[]): MoonState {
	const ms = date.getTime()
	const fraction = moonFraction(date)
	const { lon, lat } = moonPosition(ms)

	// Освещённая доля диска по углу Солнце — Земля — Луна (Меёс, гл. 48,
	// с упрощением: Солнце бесконечно далеко). Широта Луны учтена, поэтому в
	// новолуние освещённость не обязательно ровно ноль, как и на небе.
	const cosPsi = Math.cos(lat * DEG) * Math.cos(fraction * 2 * Math.PI)
	const illumination = (1 - cosPsi) / 2

	const lunar = lunarDayAt(date, rises)
	const newMoon = previousNewMoon(date)

	return {
		age: (ms - newMoon.getTime()) / DAY_MS,
		fraction,
		illumination,
		phase: phaseFromFraction(fraction),
		lunarDay: lunar.number,
		lunarDayStart: lunar.start,
		sign: Math.floor(lon / 30)
	}
}

export function getMoonState(date: Date): MoonState {
	return stateAt(date)
}

export interface MoonDay {
	date: Date
	state: MoonState
	/** Главная фаза, точный момент которой приходится на эти сутки. */
	event?: MoonEvent
	/** Лунные дни, которые начались в эти сутки (по восходу или новолунию). */
	lunarDayStarts: LunarDay[]
}

/**
 * Состояние Луны на каждый день месяца — для календарной сетки. Сутки
 * берутся в часовом поясе браузера.
 */
export function moonMonth(year: number, month: number): MoonDay[] {
	const daysInMonth = new Date(year, month, 0).getDate()
	const monthStart = new Date(year, month - 1, 1).getTime()
	const monthEnd = new Date(year, month, 1).getTime()

	// Восходы считаются один раз на весь промежуток: от новолуния перед
	// месяцем, чтобы номер лунного дня был верным уже первого числа
	const from = previousNewMoon(new Date(monthStart)).getTime() - HOUR_MS
	const rises = moonrises(from, monthEnd)
	const events = moonEvents(from, monthEnd)

	const days: MoonDay[] = []
	for (let day = 1; day <= daysInMonth; day++) {
		const start = new Date(year, month - 1, day).getTime()
		const end = new Date(year, month - 1, day + 1).getTime()
		const event = events.find(
			e => e.date.getTime() >= start && e.date.getTime() < end
		)

		// Полдень: фаза меняется в течение суток, и полдень репрезентативнее
		// полуночи для ответа «какая сегодня Луна». Если в сутках есть точный
		// момент главной фазы, день называется по нему
		const date = new Date(year, month - 1, day, 12)
		const state = stateAt(date, rises)
		state.phase = event ? event.phase : broadPhase(state.fraction)

		const lunarDayStarts: LunarDay[] = []
		for (const e of events) {
			const t = e.date.getTime()
			if (e.phase.id === 'new' && t >= start && t < end) {
				lunarDayStarts.push({ number: 1, start: e.date })
			}
		}
		for (const rise of rises) {
			const t = rise.getTime()
			if (t >= start && t < end) {
				lunarDayStarts.push(lunarDayAt(rise, rises))
			}
		}
		lunarDayStarts.sort((a, b) => a.start.getTime() - b.start.getTime())

		days.push({ date, state, event, lunarDayStarts })
	}

	return days
}

/**
 * Фаза без узких окон: серп или «горбушка». Для дней, на которые не
 * приходится точный момент новолуния, четверти или полнолуния.
 */
export function broadPhase(fraction: number): Phase {
	if (fraction < 0.25) return PHASES['waxing-crescent']
	if (fraction < 0.5) return PHASES['waxing-gibbous']
	if (fraction < 0.75) return PHASES['waning-gibbous']
	return PHASES['waning-crescent']
}

/** Состояние на выбранные сутки: фаза по точному событию в них, если оно есть. */
export function phaseOfDay(date: Date): { phase: Phase; event?: MoonEvent } {
	const start = new Date(date.getFullYear(), date.getMonth(), date.getDate())
	const end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
	const event = moonEvents(start.getTime(), end.getTime())[0]
	return event
		? { phase: event.phase, event }
		: { phase: broadPhase(moonFraction(date)) }
}

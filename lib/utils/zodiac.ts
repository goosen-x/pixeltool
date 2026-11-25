/**
 * Знак зодиака по дате рождения.
 *
 * Границы взяты общепринятые — те, что печатают в справочных таблицах. На
 * деле Солнце входит в знак не в полночь и не в один и тот же день каждый
 * год: момент входа сдвигается примерно на четверть суток за год и
 * отыгрывается назад високосным, поэтому граница гуляет в пределах суток.
 * Тул честно предупреждает об этом на пограничных датах, а не делает вид,
 * что таблица точна до дня для любого года.
 */

export type ZodiacId =
	| 'oven'
	| 'telets'
	| 'bliznetsy'
	| 'rak'
	| 'lev'
	| 'deva'
	| 'vesy'
	| 'skorpion'
	| 'strelets'
	| 'kozerog'
	| 'vodoley'
	| 'ryby'

export type Element = 'fire' | 'earth' | 'air' | 'water'
export type Quality = 'cardinal' | 'fixed' | 'mutable'

export interface ZodiacSign {
	id: ZodiacId
	name: string
	/** Родительный падеж — «даты рождения Девы». */
	nameGenitive: string
	symbol: string
	startMonth: number
	startDay: number
	endMonth: number
	endDay: number
	element: Element
	quality: Quality
	ruler: string
}

export const ELEMENT_NAMES: Record<Element, string> = {
	fire: 'Огонь',
	earth: 'Земля',
	air: 'Воздух',
	water: 'Вода'
}

export const QUALITY_NAMES: Record<Quality, string> = {
	cardinal: 'кардинальный',
	fixed: 'фиксированный',
	mutable: 'мутабельный'
}

/**
 * Порядок — от Овна, как в любой таблице. Границы подобраны так, что
 * двенадцать отрезков покрывают год целиком, без зазоров и нахлёстов;
 * это закреплено тестом, который прогоняет все 366 дней високосного года.
 *
 * Каждый пограничный день отдан тому знаку, в котором Солнце было в
 * большинстве лет 1930–2030 по московскому времени (проверено расчётом
 * sunLongitude ниже, закреплено тестом). До 26.11.2026 границы стояли на
 * день позже в четырёх местах, и на этих днях таблица ошибалась чаще, чем
 * попадала: 19 февраля в 70% лет уже Рыбы (было Водолей), 20 апреля в 56%
 * уже Телец (было Овен), 21 мая в 58% уже Близнецы (было Телец), 23 октября
 * в 70% ещё Весы (было Скорпион). 23 августа — честная монетка, 49 на 51.
 */
export const ZODIAC_SIGNS: ZodiacSign[] = [
	{
		id: 'oven',
		name: 'Овен',
		nameGenitive: 'Овна',
		symbol: '♈',
		startMonth: 3,
		startDay: 21,
		endMonth: 4,
		endDay: 19,
		element: 'fire',
		quality: 'cardinal',
		ruler: 'Марс'
	},
	{
		id: 'telets',
		name: 'Телец',
		nameGenitive: 'Тельца',
		symbol: '♉',
		startMonth: 4,
		startDay: 20,
		endMonth: 5,
		endDay: 20,
		element: 'earth',
		quality: 'fixed',
		ruler: 'Венера'
	},
	{
		id: 'bliznetsy',
		name: 'Близнецы',
		nameGenitive: 'Близнецов',
		symbol: '♊',
		startMonth: 5,
		startDay: 21,
		endMonth: 6,
		endDay: 21,
		element: 'air',
		quality: 'mutable',
		ruler: 'Меркурий'
	},
	{
		id: 'rak',
		name: 'Рак',
		nameGenitive: 'Рака',
		symbol: '♋',
		startMonth: 6,
		startDay: 22,
		endMonth: 7,
		endDay: 22,
		element: 'water',
		quality: 'cardinal',
		ruler: 'Луна'
	},
	{
		id: 'lev',
		name: 'Лев',
		nameGenitive: 'Льва',
		symbol: '♌',
		startMonth: 7,
		startDay: 23,
		endMonth: 8,
		endDay: 22,
		element: 'fire',
		quality: 'fixed',
		ruler: 'Солнце'
	},
	{
		id: 'deva',
		name: 'Дева',
		nameGenitive: 'Девы',
		symbol: '♍',
		startMonth: 8,
		startDay: 23,
		endMonth: 9,
		endDay: 22,
		element: 'earth',
		quality: 'mutable',
		ruler: 'Меркурий'
	},
	{
		id: 'vesy',
		name: 'Весы',
		nameGenitive: 'Весов',
		symbol: '♎',
		startMonth: 9,
		startDay: 23,
		endMonth: 10,
		endDay: 23,
		element: 'air',
		quality: 'cardinal',
		ruler: 'Венера'
	},
	{
		id: 'skorpion',
		name: 'Скорпион',
		nameGenitive: 'Скорпиона',
		symbol: '♏',
		startMonth: 10,
		startDay: 24,
		endMonth: 11,
		endDay: 22,
		element: 'water',
		quality: 'fixed',
		ruler: 'Плутон'
	},
	{
		id: 'strelets',
		name: 'Стрелец',
		nameGenitive: 'Стрельца',
		symbol: '♐',
		startMonth: 11,
		startDay: 23,
		endMonth: 12,
		endDay: 21,
		element: 'fire',
		quality: 'mutable',
		ruler: 'Юпитер'
	},
	{
		id: 'kozerog',
		name: 'Козерог',
		nameGenitive: 'Козерога',
		symbol: '♑',
		startMonth: 12,
		startDay: 22,
		endMonth: 1,
		endDay: 20,
		element: 'earth',
		quality: 'cardinal',
		ruler: 'Сатурн'
	},
	{
		id: 'vodoley',
		name: 'Водолей',
		nameGenitive: 'Водолея',
		symbol: '♒',
		startMonth: 1,
		startDay: 21,
		endMonth: 2,
		endDay: 18,
		element: 'air',
		quality: 'fixed',
		ruler: 'Уран'
	},
	{
		id: 'ryby',
		name: 'Рыбы',
		nameGenitive: 'Рыб',
		symbol: '♓',
		startMonth: 2,
		startDay: 19,
		endMonth: 3,
		endDay: 20,
		element: 'water',
		quality: 'mutable',
		ruler: 'Нептун'
	}
]

/** Дата как число ММДД — так отрезки сравниваются без возни с годами. */
function key(month: number, day: number): number {
	return month * 100 + day
}

export function getSignById(id: string): ZodiacSign | undefined {
	return ZODIAC_SIGNS.find(sign => sign.id === id)
}

/**
 * Знак по дню и месяцу. Год не нужен: границы в таблице от него не зависят.
 *
 * Козерог — единственный знак, который переходит через Новый год, поэтому
 * он разбирается отдельно: обе его части, декабрьская и январская, лежат по
 * краям диапазона, и обычный поиск «последнего начала не позже даты» на нём
 * не работает.
 */
export function getSignByDate(month: number, day: number): ZodiacSign {
	const target = key(month, day)
	const kozerog = ZODIAC_SIGNS.find(sign => sign.id === 'kozerog')!

	if (target >= key(kozerog.startMonth, kozerog.startDay)) return kozerog
	if (target <= key(kozerog.endMonth, kozerog.endDay)) return kozerog

	// Остальные знаки лежат внутри года: берём тот, чьё начало не позже даты.
	const candidates = ZODIAC_SIGNS.filter(sign => sign.id !== 'kozerog').sort(
		(a, b) => key(a.startMonth, a.startDay) - key(b.startMonth, b.startDay)
	)

	let found = candidates[0]
	for (const sign of candidates) {
		if (key(sign.startMonth, sign.startDay) <= target) found = sign
	}
	return found
}

/* ───────────── Точный расчёт по году и времени ───────────── */

const DEG = Math.PI / 180
const HOUR = 3600_000

/**
 * Видимая эклиптическая долгота Солнца в градусах, 0° — точка весеннего
 * равноденствия, начало Овна. Формулы Меёса («Астрономические алгоритмы»,
 * гл. 25, низкая точность): погрешность около 0,01°, то есть в пересчёте
 * на момент входа в знак — порядка четверти часа. Разницу TT и UT (около
 * минуты) не учитываем, на фоне этой погрешности она не видна.
 */
export function sunLongitude(utcMs: number): number {
	const jd = utcMs / 86_400_000 + 2_440_587.5
	const t = (jd - 2_451_545) / 36_525
	const l0 = 280.46646 + 36_000.76983 * t + 0.0003032 * t * t
	const m = (357.52911 + 35_999.05029 * t - 0.0001537 * t * t) * DEG
	const c =
		(1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(m) +
		(0.019993 - 0.000101 * t) * Math.sin(2 * m) +
		0.000289 * Math.sin(3 * m)
	const omega = (125.04 - 1934.136 * t) * DEG
	const longitude = l0 + c - 0.00569 - 0.00478 * Math.sin(omega)
	return ((longitude % 360) + 360) % 360
}

/** Знак, в котором Солнце стоит в данный момент. ZODIAC_SIGNS идёт от Овна. */
export function getSignAt(utcMs: number): ZodiacSign {
	return ZODIAC_SIGNS[Math.floor(sunLongitude(utcMs) / 30)]
}

/**
 * Момент смены знака внутри отрезка, если он там был. Солнце проходит около
 * градуса в сутки, знак — тридцать, поэтому за отрезок короче недели смена
 * бывает не больше одной, и хватает деления пополам.
 */
export function findIngress(fromMs: number, toMs: number): number | null {
	const first = getSignAt(fromMs).id
	if (getSignAt(toMs).id === first) return null
	let low = fromMs
	let high = toMs
	while (high - low > 1000) {
		const middle = (low + high) / 2
		if (getSignAt(middle).id === first) low = middle
		else high = middle
	}
	return high
}

function lastSunday(year: number, month: number): number {
	const last = new Date(Date.UTC(year, month, 0))
	return last.getUTCDate() - last.getUTCDay()
}

/**
 * Смещение от UTC в часах на дату по правилам России: «зимний» пояс плюс
 * летнее время, которое переводили с 1981 по 2010 год, и круглогодичное
 * летнее 2011–2014. До 21 июня 1930 декретного часа ещё не было. Мелкие
 * исключения (Москва в 1991 году, перекройка поясов регионами) не учтены,
 * об этом виджет пишет рядом с выбором пояса.
 */
export function russiaUtcOffset(
	standardOffset: number,
	year: number,
	month: number,
	day: number
): number {
	const date = key(month, day)
	if (year < 1930 || (year === 1930 && date < key(6, 21))) {
		return standardOffset - 1
	}
	if (
		(year === 2011 && date >= key(3, 27)) ||
		year === 2012 ||
		year === 2013 ||
		(year === 2014 && date < key(10, 26))
	) {
		return standardOffset + 1
	}
	if (year >= 1981 && year <= 2010) {
		let start: number
		let end: number
		if (year <= 1983) {
			start = key(4, 1)
			end = key(10, 1)
		} else {
			start = key(3, lastSunday(year, 3))
			end =
				year <= 1995 ? key(9, lastSunday(year, 9)) : key(10, lastSunday(year, 10))
		}
		if (date >= start && date < end) return standardOffset + 1
	}
	return standardOffset
}

/** Местное время → UTC. Месяц с единицы, как везде в этом модуле. */
export function localToUtc(
	year: number,
	month: number,
	day: number,
	minutes: number,
	offsetHours: number
): number {
	return Date.UTC(year, month - 1, day, 0, minutes) - offsetHours * HOUR
}

export interface BirthDaySign {
	/** Знак в начале местных суток. */
	signAtStart: ZodiacSign
	/** Знак в конце местных суток; совпадает с первым, если перехода не было. */
	signAtEnd: ZodiacSign
	/** Момент перехода (UTC, мс), если Солнце сменило знак в эти сутки. */
	ingressUtc: number | null
}

/** Что происходило с Солнцем в конкретный день рождения конкретного года. */
export function getBirthDaySign(
	year: number,
	month: number,
	day: number,
	offsetHours: number
): BirthDaySign {
	const start = localToUtc(year, month, day, 0, offsetHours)
	const end = start + 24 * HOUR
	return {
		signAtStart: getSignAt(start),
		signAtEnd: getSignAt(end - 1),
		ingressUtc: findIngress(start, end - 1)
	}
}

const CUSP_YEARS_FROM = 1930
const CUSP_YEARS_TO = 2030
const cuspCache = new Map<number, boolean>()

/**
 * Стоит ли предупредить о плавающей границе.
 *
 * Пограничным считается день, в который хотя бы в одном году 1930–2030
 * Солнце сменило знак где-то в России: сутки берутся по самому восточному
 * поясу (UTC+12) начало и по самому западному (UTC+2) конец. Раньше
 * пограничными были ровно день начала знака и день перед ним, и это
 * пропускало, например, 24 октября: по Москве Солнце входило в Скорпион
 * в этот день в каждом четвёртом году, а тул молча отвечал «Скорпион».
 */
export function isCuspDate(month: number, day: number): boolean {
	const cacheKey = key(month, day)
	const cached = cuspCache.get(cacheKey)
	if (cached !== undefined) return cached

	let result = false
	for (let year = CUSP_YEARS_FROM; year <= CUSP_YEARS_TO && !result; year++) {
		// 29 февраля в невисокосный год Date.UTC превратит в 1 марта —
		// для февраля это безвредно, граница Водолея и Рыб далеко.
		const start = localToUtc(year, month, day, 0, 12)
		const end = localToUtc(year, month, day, 24 * 60, 2)
		result = getSignAt(start).id !== getSignAt(end).id
	}
	cuspCache.set(cacheKey, result)
	return result
}

/** Два знака, между которыми плавает граница на пограничной дате. */
export function getCuspSigns(
	month: number,
	day: number
): [ZodiacSign, ZodiacSign] {
	const sign = getSignByDate(month, day)
	const index = ZODIAC_SIGNS.indexOf(sign)
	// Все знаки начинаются после 18-го числа и кончаются до 24-го, поэтому
	// пограничный день в месяце начала спорит с предыдущим знаком, а в
	// месяце конца — со следующим.
	if (month === sign.startMonth) {
		return [ZODIAC_SIGNS[(index + 11) % 12], sign]
	}
	return [sign, ZODIAC_SIGNS[(index + 1) % 12]]
}

const MONTHS_GENITIVE = [
	'января',
	'февраля',
	'марта',
	'апреля',
	'мая',
	'июня',
	'июля',
	'августа',
	'сентября',
	'октября',
	'ноября',
	'декабря'
]

/** «21 марта — 20 апреля» для таблицы и карточки знака. */
export function formatRange(sign: ZodiacSign): string {
	const from = `${sign.startDay} ${MONTHS_GENITIVE[sign.startMonth - 1]}`
	const to = `${sign.endDay} ${MONTHS_GENITIVE[sign.endMonth - 1]}`
	return `${from} — ${to}`
}

export function formatDay(month: number, day: number): string {
	return `${day} ${MONTHS_GENITIVE[month - 1]}`
}

/** Сколько дней в месяце — для проверки введённой даты, без привязки к году. */
export function daysInMonth(month: number, year?: number): number {
	// Без года февраль берём в 29 дней: 29 февраля существует, и отвергать
	// его нельзя. С годом — как в календаре.
	if (month === 2 && year !== undefined) {
		const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
		return leap ? 29 : 28
	}
	return [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1] ?? 31
}

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
		endDay: 20,
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
		startDay: 21,
		endMonth: 5,
		endDay: 21,
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
		startDay: 22,
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
		endDay: 22,
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
		startDay: 23,
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
		endDay: 19,
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
		startDay: 20,
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

/**
 * Стоит ли предупредить о плавающей границе.
 *
 * День начала знака и день перед ним — те самые даты, на которых у человека
 * в другой год мог бы оказаться соседний знак. Врать про точность на них
 * нельзя, а пугать оговоркой всех остальных незачем.
 */
export function isCuspDate(month: number, day: number): boolean {
	const target = key(month, day)
	return ZODIAC_SIGNS.some(sign => {
		const start = key(sign.startMonth, sign.startDay)
		const dayBefore = key(sign.endMonth, sign.endDay)
		return target === start || target === dayBefore
	})
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
export function daysInMonth(month: number): number {
	// Февраль берём в 29 дней: 29 февраля существует, и отвергать его нельзя,
	// а знак от года всё равно не зависит.
	return [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1] ?? 31
}

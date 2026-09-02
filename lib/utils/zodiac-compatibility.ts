import {
	ELEMENT_NAMES,
	QUALITY_NAMES,
	ZODIAC_SIGNS,
	type ZodiacSign
} from './zodiac'

/**
 * Совместимость знаков зодиака по классической схеме аспектов.
 *
 * Здесь ничего не выдумано и не написано «на глаз»: результат выводится из
 * углового расстояния между знаками в круге — того самого, на котором вся
 * астрологическая традиция и построена. Знаки через один считаются
 * дружественными, через три — конфликтными, через четыре — гармоничными,
 * напротив — дополняющими друг друга. Совпадает это и со стихиями: знаки
 * одной стихии всегда стоят через четыре позиции.
 *
 * Поэтому 78 пар не требуют 78 сочинённых абзацев: каждая пара объясняется
 * своим аспектом, стихиями и качествами. Так честнее — видно, откуда взялся
 * ответ, и его можно проверить.
 */

export type AspectId =
	| 'conjunction'
	| 'semisextile'
	| 'sextile'
	| 'square'
	| 'trine'
	| 'quincunx'
	| 'opposition'

export interface Aspect {
	id: AspectId
	name: string
	/** Угол между знаками в градусах. */
	degrees: number
	/** Оценка совместимости, 1…5. */
	score: number
	summary: string
	detail: string
}

export const ASPECTS: Record<AspectId, Aspect> = {
	conjunction: {
		id: 'conjunction',
		name: 'Соединение',
		degrees: 0,
		score: 4,
		summary: 'один и тот же знак',
		detail:
			'Вы устроены одинаково, и это одновременно лёгкость и ловушка. Понимать друг друга не приходится — достаточно посмотреть на себя. Но и слабые места у вас общие, и когда обоим тяжело, подставить плечо оказывается некому: вы проваливаетесь в одну и ту же яму синхронно.'
	},
	semisextile: {
		id: 'semisextile',
		name: 'Полусекстиль',
		degrees: 30,
		score: 2,
		summary: 'соседние знаки',
		detail:
			'Соседи по кругу видят мир по-разному, но недостаточно по-разному, чтобы это стало интересно. Общих тем меньше, чем кажется, а раздражают друг в друге как раз мелочи. Такая пара хорошо работает, когда есть общее дело, и вязнет, когда его нет.'
	},
	sextile: {
		id: 'sextile',
		name: 'Секстиль',
		degrees: 60,
		score: 5,
		summary: 'дружественные стихии',
		detail:
			'Самое спокойное сочетание. Огонь с воздухом и земля с водой поддерживают друг друга, не сливаясь: воздух раздувает огонь, вода питает землю. Здесь легко дружить и работать вместе, но страсти меньше, чем в конфликтных парах, и некоторым это кажется пресным.'
	},
	square: {
		id: 'square',
		name: 'Квадрат',
		degrees: 90,
		score: 2,
		summary: 'напряжённый угол',
		detail:
			'Самый конфликтный аспект. Вы оба одного качества — оба начинаете, оба держитесь или оба меняетесь, — и потому спотыкаетесь об одно и то же в одно и то же время. Зато такая пара никогда не скучает: квадрат заставляет обоих меняться, и многие долгие союзы построены именно на нём.'
	},
	trine: {
		id: 'trine',
		name: 'Тригон',
		degrees: 120,
		score: 5,
		summary: 'одна стихия',
		detail:
			'Знаки одной стихии понимают друг друга без объяснений: одинаково реагируют, одинаково устают, одинаково отдыхают. Это самое комфортное сочетание из всех. Обратная сторона — общая слепая зона: то, чего не видит стихия, не увидит никто из двоих.'
	},
	quincunx: {
		id: 'quincunx',
		name: 'Квиконс',
		degrees: 150,
		score: 1,
		summary: 'ничего общего',
		detail:
			'Знаки не имеют общего ни в стихии, ни в качестве, ни в полярности — редкий случай полного несовпадения. Договориться можно, но каждый раз заново и словами: интуитивного понимания здесь нет вовсе. Такие пары либо сознательно учатся переводить с языка на язык, либо расходятся, не поняв, что произошло.'
	},
	opposition: {
		id: 'opposition',
		name: 'Оппозиция',
		degrees: 180,
		score: 4,
		summary: 'противоположности',
		detail:
			'Знаки напротив друг друга — это не вражда, а недостающая половина. Каждый силён ровно там, где другой слаб, и вместе пара закрывает весь круг. Притяжение здесь сильное, но и качели тоже: то же самое различие, которое восхищает вначале, потом начинает бесить.'
	}
}

export interface Compatibility {
	a: ZodiacSign
	b: ZodiacSign
	aspect: Aspect
	/** Расстояние между знаками в позициях круга, 0…6. */
	distance: number
	sameElement: boolean
	sameQuality: boolean
	/** Разбор стихий и качеств конкретной пары. */
	notes: string[]
}

const ASPECT_BY_DISTANCE: AspectId[] = [
	'conjunction',
	'semisextile',
	'sextile',
	'square',
	'trine',
	'quincunx',
	'opposition'
]

/**
 * Расстояние между знаками по кругу: от 0 до 6.
 *
 * Круг замкнут, поэтому считаем по короткой дуге — Овен и Рыбы соседи, а не
 * противоположности, хотя в списке стоят с разных концов.
 */
export function signDistance(a: ZodiacSign, b: ZodiacSign): number {
	const ia = ZODIAC_SIGNS.findIndex(s => s.id === a.id)
	const ib = ZODIAC_SIGNS.findIndex(s => s.id === b.id)
	const raw = Math.abs(ia - ib)
	return Math.min(raw, 12 - raw)
}

export function getCompatibility(a: ZodiacSign, b: ZodiacSign): Compatibility {
	const distance = signDistance(a, b)
	const aspect = ASPECTS[ASPECT_BY_DISTANCE[distance]]
	const sameElement = a.element === b.element
	const sameQuality = a.quality === b.quality

	const notes: string[] = []

	if (sameElement) {
		notes.push(
			`Одна стихия — ${ELEMENT_NAMES[a.element].toLowerCase()}. Реакции и способ отдыхать у вас совпадают, объяснять друг другу почти ничего не приходится.`
		)
	} else {
		notes.push(
			`Разные стихии: ${ELEMENT_NAMES[a.element].toLowerCase()} и ${ELEMENT_NAMES[b.element].toLowerCase()}. Одно и то же событие вы переживаете по-разному, и это придётся проговаривать вслух.`
		)
	}

	if (sameQuality) {
		notes.push(
			`Общее качество — ${QUALITY_NAMES[a.quality]}. Вы одинаково относитесь к переменам, а значит и упираетесь в одно и то же место одновременно.`
		)
	} else {
		notes.push(
			`Качества разные: ${QUALITY_NAMES[a.quality]} и ${QUALITY_NAMES[b.quality]}. Один начинает, другой доводит или меняет курс — распределение ролей выходит само.`
		)
	}

	if (a.ruler === b.ruler) {
		notes.push(`Общий управитель — ${a.ruler}: мотивы у вас похожи.`)
	}

	return { a, b, aspect, distance, sameElement, sameQuality, notes }
}

/** Оценка пары от 1 до 5 — берётся у аспекта. */
export function compatibilityScore(a: ZodiacSign, b: ZodiacSign): number {
	return getCompatibility(a, b).aspect.score
}

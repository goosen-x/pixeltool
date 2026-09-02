import { getTarotCardByMajorNumber } from '@/lib/constants/tarot-deck'
import { calculateAge } from './age-calculator'

/**
 * Возраст на сегодня по дате рождения в формате ISO (YYYY-MM-DD).
 * Переиспользует calculateAge из age-calculator.ts вместо повторного
 * подсчёта разницы дат в каждом компоненте матрицы судьбы.
 */
export function ageFromBirthDate(birthDateIso: string): number {
	const [year, month, day] = birthDateIso.split('-').map(Number)
	if (!year || !month || !day) return 0
	const birth = new Date(year, month - 1, day)
	return calculateAge(birth, new Date()).years
}

// Методика «матрица судьбы»: свод больших чисел к диапазону 1-22 сделан
// повторным суммированием цифр (не вычитанием 22) — один из двух
// распространённых вариантов, единого стандарта у метода нет (см.
// searchVolume-комментарий в lib/constants/widgets/tools.ts).
export function digitSum(n: number): number {
	return Math.abs(n)
		.toString()
		.split('')
		.reduce((sum, digit) => sum + Number(digit), 0)
}

export function reduceTo22(n: number): number {
	let value = n
	while (value > 22) {
		value = digitSum(value)
	}
	return value
}

export interface DestinyMatrixResult {
	day: number
	month: number
	year: number
	fourth: number
	center: number
}

/**
 * A (день) и B (месяц) — сами числа даты, без суммирования цифр (день и
 * месяц и так почти всегда ≤22; исключение — дни 23-31, их сводим). C (год)
 * — сумма цифр года. D — сумма A+B+C. Центр — сумма всех четырёх.
 */
export function calculateDestinyMatrix(
	day: number,
	month: number,
	year: number
): DestinyMatrixResult {
	const a = reduceTo22(day)
	const b = reduceTo22(month)
	const c = reduceTo22(digitSum(year))
	const d = reduceTo22(a + b + c)
	const center = reduceTo22(a + b + c + d)

	return { day: a, month: b, year: c, fourth: d, center }
}

export interface FullDestinyMatrixResult extends DestinyMatrixResult {
	/** Диагонали личного ромба. */
	j: number
	k: number
	l: number
	m: number
	/** Средний узел кармического хвоста (M→N→D). */
	n: number
	/** Денежный узел (используется в линии денег C→Q→L). */
	q: number
	/** Родовой квадрат. */
	f: number
	g: number
	h: number
	i: number
	/** Центр рода (сумма F+G+H+I) и общий центр (E+L2). */
	l2: number
	l1: number
	/** Диагонали родового квадрата (по одной паре на каждую сторону). */
	f1: number
	f2: number
	g1: number
	g2: number
	h1: number
	h2: number
	i1: number
	i2: number
	/** Узлы линии любви/денег. */
	r: number
	r1: number
	r2: number
}

/**
 * Расширенная методика: точки за пределами консенсусного ядра A-E.
 * Единственный источник с полными формулами: gadalkindom.ru (см.
 * docs/research/destiny-matrix.md, раздел «Полная методика», формулы
 * подтверждены дословным чтением исходной страницы). Это одна
 * конкретная школа расчёта, не общепринятый стандарт, поэтому в
 * интерфейсе держим явную оговорку, а не выдаём её за канон, как и
 * остальную часть методики.
 */
export function calculateFullDestinyMatrix(
	day: number,
	month: number,
	year: number
): FullDestinyMatrixResult {
	const core = calculateDestinyMatrix(day, month, year)
	const { day: a, month: b, year: c, fourth: d, center: e } = core

	const j = reduceTo22(a + e)
	const k = reduceTo22(b + e)
	const l = reduceTo22(c + e)
	const m = reduceTo22(d + e)
	const n = reduceTo22(d + m)
	const q = reduceTo22(c + l)

	const f = reduceTo22(a + b)
	const g = reduceTo22(b + c)
	const h = reduceTo22(c + d)
	const i = reduceTo22(d + a)
	const l2 = reduceTo22(f + g + h + i)
	const l1 = reduceTo22(e + l2)

	const f2 = reduceTo22(f + l2)
	const f1 = reduceTo22(f + f2)
	const g2 = reduceTo22(g + l2)
	const g1 = reduceTo22(g + g2)
	const h2 = reduceTo22(h + l2)
	const h1 = reduceTo22(h + h2)
	const i2 = reduceTo22(i + l2)
	const i1 = reduceTo22(i + i2)

	const r = reduceTo22(m + l)
	const r1 = reduceTo22(r + m)
	const r2 = reduceTo22(r + l)

	return {
		...core,
		j,
		k,
		l,
		m,
		n,
		q,
		f,
		g,
		h,
		i,
		l2,
		l1,
		f1,
		f2,
		g1,
		g2,
		h1,
		h2,
		i1,
		i2,
		r,
		r1,
		r2
	}
}

export type FullPointKey = keyof FullDestinyMatrixResult

export interface NamedLine {
	key: string
	label: string
	/** Один или несколько отрезков (участок читается от первого к последнему узлу). */
	segments: FullPointKey[][]
}

/**
 * Именованные линии по методике gadalkindom (см. calculateFullDestinyMatrix).
 * Талант не включён сюда: это три отдельные точки (K, F2, G2), не связная
 * линия, поэтому у него собственный список TALENT_POINTS ниже.
 */
export const NAMED_LINES: NamedLine[] = [
	{
		key: 'maleLine',
		label: 'Линия мужского рода',
		segments: [
			['f', 'f1', 'f2'],
			['h2', 'h1', 'h']
		]
	},
	{
		key: 'femaleLine',
		label: 'Линия женского рода',
		segments: [
			['i', 'i1', 'i2'],
			['g2', 'g1', 'g']
		]
	},
	{
		key: 'love',
		label: 'Линия любви и отношений',
		segments: [['m', 'r1', 'r']]
	},
	{
		key: 'money',
		label: 'Линия денег',
		segments: [
			['year', 'q', 'l'],
			['l', 'r2', 'r']
		]
	},
	{
		key: 'karmicTail',
		label: 'Кармический хвост',
		segments: [['m', 'n', 'fourth']]
	}
]

export const TALENT_POINTS: { key: FullPointKey; label: string }[] = [
	{ key: 'k', label: 'Личный талант' },
	{ key: 'f2', label: 'Талант по мужской линии рода' },
	{ key: 'g2', label: 'Талант по женской линии рода' }
]

export type PositionKey = 'day' | 'month' | 'year' | 'fourth'

export const POSITIONS: { key: PositionKey; label: string }[] = [
	{ key: 'day', label: 'Личность и характер' },
	{ key: 'month', label: 'Таланты от рождения' },
	{ key: 'year', label: 'Родовые программы' },
	{ key: 'fourth', label: 'Реализация в социуме' }
]

function corePositionLabel(key: PositionKey): string {
	return POSITIONS.find(position => position.key === key)!.label
}

/** Подписи для всех точек расширенной методики, для детальной карточки. */
export const FULL_POINT_LABELS: Record<FullPointKey, string> = {
	day: corePositionLabel('day'),
	month: corePositionLabel('month'),
	year: corePositionLabel('year'),
	fourth: corePositionLabel('fourth'),
	center: 'Главное предназначение',
	f: 'Родовой квадрат: день и месяц',
	g: 'Родовой квадрат: месяц и год',
	h: 'Родовой квадрат: год и четвёртая точка',
	i: 'Родовой квадрат: четвёртая точка и день',
	l2: 'Центр рода',
	l1: 'Общий центр рода и предназначения',
	j: 'Личная диагональ дня',
	k: 'Личная диагональ месяца',
	l: 'Личная диагональ года',
	m: 'Личная диагональ четвёртой точки',
	n: 'Кармический хвост, средний узел',
	q: 'Линия денег, первый узел',
	f1: 'Линия мужского рода, первый узел',
	f2: 'Талант по мужской линии рода',
	g1: 'Линия женского рода, первый узел',
	g2: 'Талант по женской линии рода',
	h1: 'Линия мужского рода, второй узел',
	h2: 'Линия мужского рода, третий узел',
	i1: 'Линия женского рода, первый узел',
	i2: 'Линия женского рода, второй узел',
	r: 'Узел линии любви и денег',
	r1: 'Узел линии любви',
	r2: 'Линия денег, второй узел'
}

export interface Arcana {
	number: number
	name: string
	meaning: string
	/** Путь к иллюстрации карты из общей колоды Таро (lib/constants/tarot-deck.ts). */
	image?: string
}

// Краткие значения 22 старших арканов Таро в контексте нумерологии матрицы
// судьбы (личностная черта/предназначение, не карточное гадание) —
// пересказаны своими словами по общим значениям арканов, не копия чужого
// текста.
export const ARCANA: Arcana[] = [
	{
		number: 1,
		name: 'Маг',
		meaning:
			'Воля и инициатива, умение начинать новое и превращать идеи в результат руками, а не только словами.'
	},
	{
		number: 2,
		name: 'Верховная Жрица',
		meaning:
			'Интуиция и внутреннее знание, склонность доверять ощущениям больше, чем чужим советам.'
	},
	{
		number: 3,
		name: 'Императрица',
		meaning:
			'Забота, творчество и умение создавать уют вокруг себя, в отношениях, доме, проектах.'
	},
	{
		number: 4,
		name: 'Император',
		meaning:
			'Структура, порядок и лидерство через правила, а не через обаяние, умение выстраивать систему и держать её.'
	},
	{
		number: 5,
		name: 'Иерофант',
		meaning:
			'Уважение к традициям, опыту старших и проверенным путям, учится через систему и наставников, а не методом проб.'
	},
	{
		number: 6,
		name: 'Влюблённые',
		meaning:
			'Выбор и союз, важность отношений и партнёрства для самореализации, чувствительность к гармонии.'
	},
	{
		number: 7,
		name: 'Колесница',
		meaning:
			'Движение вперёд напролом, воля к победе, умение держать курс среди противоречивых сил.'
	},
	{
		number: 8,
		name: 'Сила',
		meaning:
			'Мягкое управление через терпение и внутреннюю уверенность, а не через давление.'
	},
	{
		number: 9,
		name: 'Отшельник',
		meaning:
			'Тяга к одиночеству, размышлению и собственному пути, поиск смысла в глубине, а не в толпе.'
	},
	{
		number: 10,
		name: 'Колесо Фортуны',
		meaning:
			'Цикличность, готовность к переменам и умение ловить момент, когда судьба поворачивается.'
	},
	{
		number: 11,
		name: 'Справедливость',
		meaning:
			'Чувство меры и баланса, потребность в честности и в том, чтобы последствия соответствовали поступкам.'
	},
	{
		number: 12,
		name: 'Повешенный',
		meaning:
			'Взгляд на вещи под другим углом, умение приносить временную жертву ради нового понимания.'
	},
	{
		number: 13,
		name: 'Смерть',
		meaning:
			'Способность отпускать старое и начинать заново, трансформация как естественная часть пути, не катастрофа.'
	},
	{
		number: 14,
		name: 'Умеренность',
		meaning:
			'Терпение и умение смешивать крайности в устойчивый баланс, дипломатичность.'
	},
	{
		number: 15,
		name: 'Дьявол',
		meaning:
			'Притяжение к соблазнам и зависимостям, урок о свободе от собственных ограничений.'
	},
	{
		number: 16,
		name: 'Башня',
		meaning:
			'Резкие перемены и разрушение старого, когда прежняя конструкция уже не выдерживает нагрузки.'
	},
	{
		number: 17,
		name: 'Звезда',
		meaning:
			'Надежда, вдохновение и вера в лучшее после трудного периода, дар вдохновлять других.'
	},
	{
		number: 18,
		name: 'Луна',
		meaning:
			'Богатое воображение, чувствительность к скрытому и неочевидному, с риском тревожности и иллюзий.'
	},
	{
		number: 19,
		name: 'Солнце',
		meaning:
			'Открытость, жизнерадостность и лёгкость в самовыражении, дар заряжать энергией окружающих.'
	},
	{
		number: 20,
		name: 'Суд',
		meaning:
			'Переоценка прошлого опыта и внутреннее пробуждение, готовность отвечать за прожитое.'
	},
	{
		number: 21,
		name: 'Мир',
		meaning:
			'Целостность и завершённость, ощущение, что все части жизни складываются в одно целое.'
	},
	{
		number: 22,
		name: 'Шут',
		meaning:
			'Свобода от рамок, готовность рисковать и начинать с чистого листа, лёгкое отношение к формальностям.'
	}
]

export function getArcana(number: number): Arcana {
	const base = ARCANA[Math.min(Math.max(number, 1), 22) - 1]
	const card = getTarotCardByMajorNumber(base.number)
	return card ? { ...base, image: card.image } : base
}

export interface YearsMatrixSector {
	arcanaNumber: number
	sectorIndex: number
	sectorStart: number
	sectorEnd: number
}

/**
 * Восемь точек матрицы лет в порядке секторов — общий источник для
 * DestinyYearsMatrix.tsx (шкала) и DestinyMatrixNarrative.tsx (толкование
 * текущей фазы сплошным текстом), чтобы порядок не разошёлся между ними.
 */
export const YEARS_MATRIX_SECTOR_KEYS: FullPointKey[] = [
	'day',
	'f',
	'month',
	'g',
	'year',
	'h',
	'fourth',
	'i'
]

/**
 * Матрица лет: 8 секторов по 10 лет на восемь точек расширенной схемы,
 * циклически A→F→B→G→C→H→D→I (день, родовой квадрат день-месяц, месяц,
 * родовой квадрат месяц-год, год, родовой квадрат год-четвёртая, четвёртая
 * точка, родовой квадрат четвёртая-день) — как в первоисточнике (см.
 * docs/research/destiny-matrix.md).
 */
export function getYearsMatrixSector(
	age: number,
	points: [number, number, number, number, number, number, number, number]
): YearsMatrixSector {
	const sectorIndex = Math.floor(age / 10) % 8
	return {
		arcanaNumber: points[sectorIndex],
		sectorIndex,
		sectorStart: sectorIndex * 10,
		sectorEnd: sectorIndex * 10 + 10
	}
}

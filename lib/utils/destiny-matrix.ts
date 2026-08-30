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

export type PositionKey = 'day' | 'month' | 'year' | 'fourth'

export const POSITIONS: { key: PositionKey; label: string }[] = [
	{ key: 'day', label: 'Личность и характер' },
	{ key: 'month', label: 'Таланты от рождения' },
	{ key: 'year', label: 'Родовые программы' },
	{ key: 'fourth', label: 'Реализация в социуме' }
]

export interface Arcana {
	number: number
	name: string
	meaning: string
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
			'Забота, творчество и умение создавать уют вокруг себя — в отношениях, доме, проектах.'
	},
	{
		number: 4,
		name: 'Император',
		meaning:
			'Структура, порядок и лидерство через правила, а не через обаяние — умение выстраивать систему и держать её.'
	},
	{
		number: 5,
		name: 'Иерофант',
		meaning:
			'Уважение к традициям, опыту старших и проверенным путям — учится через систему и наставников, а не методом проб.'
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
			'Способность отпускать старое и начинать заново — трансформация как естественная часть пути, не катастрофа.'
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
			'Притяжение к соблазнам и зависимостям — урок о свободе от собственных ограничений.'
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
			'Богатое воображение, чувствительность к скрытому и неочевидному — с риском тревожности и иллюзий.'
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
			'Целостность и завершённость — ощущение, что все части жизни складываются в одно целое.'
	},
	{
		number: 22,
		name: 'Шут',
		meaning:
			'Свобода от рамок, готовность рисковать и начинать с чистого листа, лёгкое отношение к формальностям.'
	}
]

export function getArcana(number: number): Arcana {
	return ARCANA[Math.min(Math.max(number, 1), 22) - 1]
}

export interface YearsMatrixSector {
	arcanaNumber: number
	sectorIndex: number
	sectorStart: number
	sectorEnd: number
}

/**
 * Матрица лет: упрощённая версия традиционной 8-секторной схемы
 * (A→F→B→G→C→H→D→I по 10 лет). Адаптирована под наши 4 точки: 4 сектора по
 * 20 лет, циклически A→B→C→D. Ни один источник не описывает вариант с
 * четырьмя точками, это наше сознательное упрощение, не альтернативная
 * трактовка чужой методики (см. docs/research/destiny-matrix.md).
 */
export function getYearsMatrixSector(
	age: number,
	points: [number, number, number, number]
): YearsMatrixSector {
	const sectorIndex = Math.floor(age / 20) % 4
	return {
		arcanaNumber: points[sectorIndex],
		sectorIndex,
		sectorStart: sectorIndex * 20,
		sectorEnd: sectorIndex * 20 + 20
	}
}

/**
 * Геометрия для калькуляторов площади и объёма.
 *
 * Все функции принимают и возвращают величины в системных единицах: длины в
 * метрах, площади в квадратных метрах, объёмы в кубических. Перевод из того,
 * что человек ввёл (миллиметры, сантиметры), делается на входе, а перевод
 * результата в литры и прочее — на выходе. Так формулы остаются чистой
 * математикой и проверяются на известных значениях, а не на «сантиметрах,
 * которые где-то по дороге стали метрами».
 */

export type LengthUnit = 'mm' | 'cm' | 'dm' | 'm'

/** Сколько метров в одной единице. */
export const LENGTH_IN_METERS: Record<LengthUnit, number> = {
	mm: 0.001,
	cm: 0.01,
	dm: 0.1,
	m: 1
}

export const LENGTH_LABELS: Record<LengthUnit, string> = {
	mm: 'мм',
	cm: 'см',
	dm: 'дм',
	m: 'м'
}

export function toMeters(value: number, unit: LengthUnit): number {
	return value * LENGTH_IN_METERS[unit]
}

/* ---------------------------------------------------------------- площади */

export function rectangleArea(a: number, b: number): number {
	return a * b
}

/**
 * Круг задаётся диаметром, а не радиусом.
 *
 * Так меряют в жизни: рулетка ложится через центр, а не от центра. Радиус
 * приходится вычислять в уме, и на этом чаще всего и ошибаются вдвое.
 */
export function circleArea(diameter: number): number {
	const r = diameter / 2
	return Math.PI * r * r
}

export function triangleAreaByHeight(base: number, height: number): number {
	return (base * height) / 2
}

/**
 * Треугольник по трём сторонам — формула Герона.
 *
 * Если стороны не образуют треугольник (сумма двух не больше третьей),
 * подкоренное выражение уходит в минус. Возвращаем null, а не NaN: NaN
 * протёк бы в интерфейс и показался бы человеку как «NaN м²».
 */
export function triangleAreaBySides(
	a: number,
	b: number,
	c: number
): number | null {
	if (a <= 0 || b <= 0 || c <= 0) return null
	if (a + b <= c || a + c <= b || b + c <= a) return null

	const p = (a + b + c) / 2
	return Math.sqrt(p * (p - a) * (p - b) * (p - c))
}

export function trapezoidArea(a: number, b: number, height: number): number {
	return ((a + b) / 2) * height
}

/** Кольцо: площадь между внешним и внутренним диаметром. */
export function ringArea(outerDiameter: number, innerDiameter: number): number {
	return Math.max(0, circleArea(outerDiameter) - circleArea(innerDiameter))
}

/** Боковая поверхность трубы или цилиндра: πDh. */
export function cylinderLateralArea(diameter: number, height: number): number {
	return Math.PI * diameter * height
}

export function sphereArea(diameter: number): number {
	return Math.PI * diameter * diameter
}

export interface Opening {
	width: number
	height: number
	count: number
}

/**
 * Площадь стен комнаты: периметр на высоту минус проёмы.
 *
 * Ради этого расчёта половина людей и открывает калькулятор площади —
 * посчитать, сколько обоев или краски нужно. Считать периметр, умножать на
 * высоту и вычитать окна с дверями вручную долго и легко сбиться.
 */
export function wallsArea(
	length: number,
	width: number,
	height: number,
	openings: Opening[] = []
): number {
	const perimeter = 2 * (length + width)
	const gross = perimeter * height
	const holes = openings.reduce(
		(sum, opening) => sum + opening.width * opening.height * opening.count,
		0
	)
	return Math.max(0, gross - holes)
}

/* ---------------------------------------------------------------- объёмы */

export function boxVolume(a: number, b: number, c: number): number {
	return a * b * c
}

export function cylinderVolume(diameter: number, height: number): number {
	return circleArea(diameter) * height
}

/** Труба — полый цилиндр: объём стенок между внешним и внутренним диаметром. */
export function pipeWallVolume(
	outerDiameter: number,
	innerDiameter: number,
	length: number
): number {
	return ringArea(outerDiameter, innerDiameter) * length
}

/** Сколько входит внутрь трубы — по внутреннему диаметру. */
export function pipeInnerVolume(innerDiameter: number, length: number): number {
	return cylinderVolume(innerDiameter, length)
}

export function sphereVolume(diameter: number): number {
	const r = diameter / 2
	return (4 / 3) * Math.PI * r * r * r
}

export function coneVolume(diameter: number, height: number): number {
	return (circleArea(diameter) * height) / 3
}

/** Усечённый конус — ведро, бункер, воронка. */
export function truncatedConeVolume(
	bottomDiameter: number,
	topDiameter: number,
	height: number
): number {
	const R = bottomDiameter / 2
	const r = topDiameter / 2
	return (Math.PI * height * (R * R + R * r + r * r)) / 3
}

/* ------------------------------------------------------------ оформление */

/** Кубометр — это ровно тысяча литров. */
export const LITERS_IN_CUBIC_METER = 1000

export function cubicMetersToLiters(volume: number): number {
	return volume * LITERS_IN_CUBIC_METER
}

/**
 * Число с разумным числом знаков: у мелких величин важны сотые, у крупных
 * они шум. Без этого 0.0007 м³ показалось бы нулём, а 1234.5678 м² —
 * ложной точностью до десятых долей миллиметра.
 */
export function formatNumber(value: number): string {
	if (!Number.isFinite(value)) return '—'

	const abs = Math.abs(value)
	const digits =
		abs === 0 ? 0 : abs < 0.01 ? 5 : abs < 1 ? 3 : abs < 100 ? 2 : 1

	return value.toLocaleString('ru-RU', {
		maximumFractionDigits: digits,
		minimumFractionDigits: 0
	})
}

/* ------------------------------------------------------------------- ввод */

/**
 * Длина из поля ввода: запятая или точка, пробелы между разрядами
 * («1 200») допустимы. Пустое, нечисловое и неположительное — null.
 * parseFloat сам по себе прочитал бы «1 200» как 1, а «12abc» как 12.
 */
export function parseLength(raw: string): number | null {
	const cleaned = raw.replace(/[\s ]/g, '').replace(',', '.')
	if (!/^\d*\.?\d+$|^\d+\.$/.test(cleaned)) return null
	const value = Number(cleaned)
	return Number.isFinite(value) && value > 0 ? value : null
}

/**
 * Пересчёт введённого числа при смене единиц: 5 м → 500 см, а не «5 см».
 * Без этого переключатель молча уменьшал фигуру в сто раз. Нечисловой ввод
 * возвращается как есть, человек его ещё не дописал.
 */
export function convertLengthInput(
	raw: string,
	from: LengthUnit,
	to: LengthUnit
): string {
	const value = parseLength(raw)
	if (value === null || from === to) return raw
	const converted = (value * LENGTH_IN_METERS[from]) / LENGTH_IN_METERS[to]
	// toPrecision срезает хвосты двоичной арифметики вроде 0.30000000000000004
	return String(Number(converted.toPrecision(12)))
}

/* ------------------------------------------------------------- вывод объёма */

export interface VolumeDisplay {
	value: string
	unit: 'м³' | 'см³'
	/** То же количество в литрах, а у мелких объёмов ещё и в миллилитрах. */
	liters: string
}

/**
 * Объём меньше литра в кубометрах выглядит как «0,00005 м³» или вовсе «0»:
 * шар диаметром 10 мм это 0,0000005 м³. Такие объёмы показываем в см³,
 * а литры приписываем рядом.
 */
export function formatVolume(cubicMeters: number): VolumeDisplay {
	const liters = cubicMetersToLiters(cubicMeters)
	if (cubicMeters > 0 && cubicMeters < 0.001) {
		const cm3 = cubicMeters * 1e6
		return {
			value: formatNumber(cm3),
			unit: 'см³',
			liters: `${formatNumber(liters)} л, или ${formatNumber(cm3)} мл`
		}
	}
	return {
		value: formatNumber(cubicMeters),
		unit: 'м³',
		liters: `${formatNumber(liters)} л`
	}
}

/* ------------------------------------------------------- проёмы и площадь */

/** Проём в том виде, как его набрали: строки в текущих единицах. */
export interface OpeningInput {
	width: string
	height: string
	count: string
}

/**
 * Проёмы из полей ввода в метры. Недописанный или пустой проём не
 * вычитается, а не обнуляет остальные: человек как раз его набирает.
 */
export function parseOpenings(
	inputs: OpeningInput[],
	unit: LengthUnit
): Opening[] {
	const result: Opening[] = []
	for (const input of inputs) {
		const width = parseLength(input.width)
		const height = parseLength(input.height)
		const count = parseLength(input.count)
		if (width === null || height === null || count === null) continue
		result.push({
			width: toMeters(width, unit),
			height: toMeters(height, unit),
			count: Math.round(count)
		})
	}
	return result
}

/** Квадратный метр в сотках и гектарах. */
export const SQUARE_METERS_IN_SOTKA = 100
export const SQUARE_METERS_IN_HECTARE = 10000

/**
 * Вторая строка под площадью. Комнате «200 000 см²» ничего не даёт, а
 * участку нужны сотки: их и показываем от 100 м². Сантиметры остаются
 * для мелочи меньше квадратного метра.
 */
export function areaAside(squareMeters: number): string | null {
	if (!Number.isFinite(squareMeters) || squareMeters <= 0) return null
	if (squareMeters < 1) return `${formatNumber(squareMeters * 10000)} см²`
	if (squareMeters < SQUARE_METERS_IN_SOTKA) return null
	const sotki = `${formatNumber(squareMeters / SQUARE_METERS_IN_SOTKA)} сот.`
	if (squareMeters < SQUARE_METERS_IN_HECTARE) return sotki
	return `${sotki}, или ${formatNumber(squareMeters / SQUARE_METERS_IN_HECTARE)} га`
}

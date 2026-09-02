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

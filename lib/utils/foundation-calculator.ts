import { CONCRETE_MIXES, type ConcreteGrade } from './concrete-calculator'

/**
 * Фундамент: объём бетона и длина арматуры по геометрии.
 *
 * Расход цемента, песка, щебня и воды берётся из общей таблицы
 * `CONCRETE_MIXES` (см. concrete-calculator) — состав бетона от того, во что
 * его заливают, не зависит, поэтому дублировать нормы здесь нечего.
 */

export type FoundationType = 'strip' | 'slab' | 'piles'

export interface FoundationInput {
	type: FoundationType
	/** Длина дома по внешнему контуру, м. Для плиты — длина плиты. */
	length: number
	/** Ширина дома по внешнему контуру, м. Для плиты — ширина плиты. */
	width: number
	/** Ширина ленты, м. Для плиты — её толщина. Для свай не используется. */
	thickness: number
	/** Высота ленты или сваи, м. Для плиты не используется. */
	height: number
	/** Суммарная длина внутренних несущих стен, м. Только для ленты. */
	innerWallsLength: number
	/** Число столбов (свай). */
	pileCount: number
	/** Диаметр сваи, м. */
	pileDiameter: number
	/** Число продольных прутков арматуры в сечении. */
	rebarLines: number
	grade: ConcreteGrade
}

export interface FoundationResult {
	volumeM3: number
	/** Длина ленты или периметр плиты — то, вдоль чего идёт арматура, м. */
	runningMeters: number
	/** Продольная арматура с нахлёстом, м. */
	rebarMeters: number
	cementKg: number
	sandKg: number
	gravelKg: number
	waterL: number
	bags: number
}

/** Запас на нахлёст и загиб прутков — обычная практика закупки. */
const REBAR_OVERLAP = 1.1

export function calculateFoundation(
	input: FoundationInput,
	bagWeightKg: number
): FoundationResult {
	const {
		type,
		length,
		width,
		thickness,
		height,
		innerWallsLength,
		pileCount,
		pileDiameter,
		rebarLines,
		grade
	} = input

	let volumeM3 = 0
	let runningMeters = 0

	if (type === 'strip') {
		// Периметр считается по осевой линии ленты, а не по внешнему контуру:
		// иначе четыре угла учитываются дважды и объём завышается на
		// thickness² × 4 — на широкой ленте это уже заметные кубометры.
		const perimeter = 2 * (length + width) - 4 * thickness
		runningMeters = perimeter + innerWallsLength
		volumeM3 = runningMeters * thickness * height
	} else if (type === 'slab') {
		volumeM3 = length * width * thickness
		runningMeters = 2 * (length + width)
	} else {
		const radius = pileDiameter / 2
		volumeM3 = Math.PI * radius * radius * height * pileCount
		// У столбчатого фундамента арматура идёт не вдоль ленты, а вертикально
		// в каждой свае — «погонные метры» здесь это суммарная высота столбов.
		runningMeters = height * pileCount
	}

	const mix = CONCRETE_MIXES[grade]
	const cementKg = volumeM3 * mix.cement

	return {
		volumeM3,
		runningMeters,
		rebarMeters: runningMeters * rebarLines * REBAR_OVERLAP,
		cementKg,
		sandKg: volumeM3 * mix.sand,
		gravelKg: volumeM3 * mix.gravel,
		waterL: volumeM3 * mix.water,
		bags: bagWeightKg > 0 ? Math.ceil(cementKg / bagWeightKg) : 0
	}
}

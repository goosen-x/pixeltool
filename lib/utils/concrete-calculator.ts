export type ConcreteGrade = 'M100' | 'M200' | 'M300' | 'M400'

export interface ConcreteMix {
	/** Расход на 1 м³ готового бетона, кг (цемент М400, щебень фракции 20 мм). */
	cement: number
	sand: number
	gravel: number
	/** Вода, л на 1 м³. */
	water: number
	usage: string
}

/**
 * Средние значения по таблице норм расхода материалов на 1 м³ бетона
 * (цемент М400), сверено 22.08.2026. Даны только марки с надёжным
 * источником — М150/М250/М350 сознательно не включены, чтобы не
 * интерполировать цифры без подтверждения.
 */
export const CONCRETE_MIXES: Record<ConcreteGrade, ConcreteMix> = {
	M100: {
		cement: 210,
		sand: 800,
		gravel: 1170,
		water: 155,
		usage: 'Подготовительный слой, отмостка, дорожки, не несущие конструкции'
	},
	M200: {
		cement: 258,
		sand: 750,
		gravel: 1185,
		water: 150,
		usage: 'Стяжка пола, ступени, лёгкий фундамент под забор'
	},
	M300: {
		cement: 338,
		sand: 685,
		gravel: 1185,
		water: 160,
		usage: 'Фундамент под дом, монолитная плита, нагруженные конструкции'
	},
	M400: {
		cement: 413,
		sand: 615,
		gravel: 1175,
		water: 170,
		usage: 'Несущие стены, колонны, балки — конструкции с высокой нагрузкой'
	}
}

export interface ConcreteCalculatorResult {
	volumeM3: number
	cementKg: number
	sandKg: number
	gravelKg: number
	waterL: number
	bags: number
}

export function calculateConcrete(
	length: number,
	width: number,
	height: number,
	grade: ConcreteGrade,
	bagWeightKg: number
): ConcreteCalculatorResult {
	const volumeM3 = length * width * height
	const mix = CONCRETE_MIXES[grade]

	return {
		volumeM3,
		cementKg: volumeM3 * mix.cement,
		sandKg: volumeM3 * mix.sand,
		gravelKg: volumeM3 * mix.gravel,
		waterL: volumeM3 * mix.water,
		bags: Math.ceil((volumeM3 * mix.cement) / bagWeightKg)
	}
}

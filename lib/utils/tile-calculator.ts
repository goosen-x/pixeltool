export interface TileCalculatorInput {
	/** Длина и ширина помещения, м. */
	roomLength: number
	roomWidth: number
	/** Длина и ширина плитки, см. */
	tileLength: number
	tileWidth: number
	/** Запас на подрезку, %. */
	wastePercent: number
	/** Ширина шва, мм. */
	jointWidthMm: number
	/** Толщина плитки, мм. */
	tileThicknessMm: number
}

export interface TileCalculatorResult {
	areaM2: number
	tilesExact: number
	tilesWithWaste: number
	groutKgPerM2: number
	groutKgTotal: number
}

/** Плотность сухой затирки в замесе, кг/дм³ — типовое значение производителей. */
const GROUT_DENSITY = 1.6

/**
 * Формула Mapei: расход затирки (кг/м²) = (L+W)/(L×W) × толщина × шов ×
 * плотность, где L и W плитки — в миллиметрах. Проверено на эталонном
 * примере производителя: плитка 330×330 мм, толщина 10 мм, шов 2 мм → 0,194
 * кг/м².
 */
export function calculateTiles(input: TileCalculatorInput): TileCalculatorResult {
	const areaM2 = input.roomLength * input.roomWidth
	const tileAreaM2 = (input.tileLength / 100) * (input.tileWidth / 100)
	const tilesExact = areaM2 / tileAreaM2
	const tilesWithWaste = Math.ceil(
		tilesExact * (1 + input.wastePercent / 100)
	)

	const tileLengthMm = input.tileLength * 10
	const tileWidthMm = input.tileWidth * 10
	const groutKgPerM2 =
		((tileLengthMm + tileWidthMm) / (tileLengthMm * tileWidthMm)) *
		input.tileThicknessMm *
		input.jointWidthMm *
		GROUT_DENSITY

	return {
		areaM2,
		tilesExact,
		tilesWithWaste,
		groutKgPerM2,
		groutKgTotal: groutKgPerM2 * areaM2
	}
}

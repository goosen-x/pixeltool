/**
 * Расчёт обоев по полосам, а не по площади.
 *
 * Стены обходятся полосами шириной в рулон. Каждая полоса нарезается из
 * рулона на высоту стены плюс запас на подрезку. Если у обоев есть рисунок,
 * полоса начинается в той же точке рисунка, что и соседняя (прямая
 * стыковка), или со сдвигом на полраппорта (смещённая стыковка). Между
 * полосами в рулоне остаётся обрезок, поэтому число полос из рулона считается
 * нарезкой, а не делением длины рулона на высоту.
 *
 * Над дверями, над и под окнами клеят короткие куски. Они вырезаются из
 * остатков рулонов, а если остатков не хватает, из нового рулона.
 */

export type WallpaperMatch = 'none' | 'straight' | 'offset'

export type OpeningKind = 'window' | 'door'

export interface WallpaperOpening {
	kind: OpeningKind
	/** Ширина проёма, м. */
	width: number
	/** Высота проёма, м. */
	height: number
	/** Для окна: высота подоконника от пола, м. */
	sill?: number
}

export interface WallpaperInput {
	/** Суммарная длина оклеиваемых стен, м. */
	perimeter: number
	/** Высота стен, м. */
	height: number
	/** Рулон, м. */
	rollWidth: number
	rollLength: number
	/** Раппорт рисунка, м. 0 — подбор не нужен. */
	rapport: number
	match: WallpaperMatch
	/** Запас на подрезку на каждую полосу, м (сверху и снизу вместе). */
	trim: number
	openings: WallpaperOpening[]
}

export type WallpaperError = 'strip-too-long' | 'rapport-too-long'

export interface WallpaperResult {
	rolls: number
	/** Полос во всю высоту стены. */
	fullStrips: number
	/** Коротких кусков над и под проёмами. */
	shortPieces: number
	/** Сколько полос во всю высоту выходит из первого рулона. */
	stripsPerRoll: number
	/** Сколько рулона уходит на одну полосу с подгонкой рисунка, м. */
	stripConsumption: number
	/** Площадь стен за вычетом проёмов, м². */
	wallArea: number
	/** Площадь купленных обоев, м². */
	boughtArea: number
	/** Рулоны, если бы проёмов не было: столько советуют продавцы. */
	rollsWithoutOpenings: number
}

const EPS = 1e-9

/**
 * Сколько рулона уходит на полосу высотой h при прямой стыковке: длина
 * округляется вверх до целого числа раппортов, остаток идёт в обрезки.
 */
export function stripConsumption(
	h: number,
	rapport: number,
	match: WallpaperMatch
): number {
	if (match === 'none' || rapport <= 0) return h
	return Math.ceil(h / rapport - EPS) * rapport
}

interface Cut {
	/** Остаток в каждом начатом рулоне, м. */
	remnants: number[]
	rolls: number
	stripsInFirstRoll: number
}

/**
 * Нарезает n полос длиной h подряд. В рулоне точка 0 совпадает с началом
 * рисунка. При прямой стыковке каждая полоса начинается в фазе 0, при
 * смещённой фазы чередуются: 0, R/2, 0, R/2…
 */
function cutStrips(
	n: number,
	h: number,
	rollLength: number,
	rapport: number,
	match: WallpaperMatch
): Cut {
	const remnants: number[] = []
	let rolls = 0
	let pos = rollLength // нет начатого рулона
	let stripsInFirstRoll = 0
	const usePattern = match !== 'none' && rapport > 0

	for (let i = 0; i < n; i++) {
		const phase =
			usePattern && match === 'offset' && i % 2 === 1 ? rapport / 2 : 0
		const startIn = (from: number) => {
			if (!usePattern) return from
			const k = Math.ceil((from - phase) / rapport - EPS)
			return phase + Math.max(0, k) * rapport
		}
		let start = startIn(pos)
		if (start + h > rollLength + EPS) {
			if (rolls > 0) remnants.push(Math.max(0, rollLength - pos))
			rolls++
			start = startIn(0)
		}
		if (rolls === 1) stripsInFirstRoll++
		pos = start + h
	}
	if (rolls > 0) remnants.push(Math.max(0, rollLength - pos))
	return { remnants, rolls, stripsInFirstRoll }
}

/**
 * Короткие куски над и под проёмами: по одному на каждую полосу, которую
 * проём забрал целиком.
 *
 * Сколько полос проём забирает, зависит от того, где ляжет стык. Если полоса
 * начинается ровно у края проёма шириной w, их floor(w / ширина рулона), а
 * при стыке не у края может оказаться на одну меньше. Заранее положение стыков неизвестно,
 * поэтому берётся худший случай: обоев не должно не хватить.
 */
export function openingPieces(
	input: Pick<WallpaperInput, 'height' | 'rollWidth' | 'openings'>
): { removedStrips: number; pieces: number[] } {
	let removedStrips = 0
	const pieces: number[] = []
	for (const o of input.openings) {
		if (!(o.width > 0) || !(o.height > 0)) continue
		const columns = Math.max(0, Math.floor(o.width / input.rollWidth + EPS) - 1)
		if (columns === 0) continue // проём уже двух полос клеят как стену
		removedStrips += columns
		const lengths =
			o.kind === 'door'
				? [input.height - o.height]
				: [o.sill ?? 0, input.height - (o.sill ?? 0) - o.height]
		for (let c = 0; c < columns; c++)
			for (const len of lengths) if (len > EPS) pieces.push(len)
	}
	return { removedStrips, pieces }
}

export function calculateWallpaper(
	input: WallpaperInput
): WallpaperResult | WallpaperError {
	const { perimeter, height, rollWidth, rollLength, rapport, match, trim } =
		input
	const usePattern = match !== 'none' && rapport > 0
	if (usePattern && rapport > rollLength) return 'rapport-too-long'

	const h = height + trim
	const consumption = stripConsumption(h, rapport, match)
	// при смещении полоса может начаться только с середины раппорта
	const worstStart = usePattern && match === 'offset' ? rapport / 2 : 0
	if (h + worstStart > rollLength + EPS) return 'strip-too-long'

	const columns = Math.ceil(perimeter / rollWidth - EPS)
	const { removedStrips, pieces } = openingPieces(input)
	const fullStrips = Math.max(0, columns - removedStrips)

	const cut = cutStrips(fullStrips, h, rollLength, rapport, match)
	const remnants = cut.remnants.slice()
	let rolls = cut.rolls

	// короткий кусок: длина с запасом и с худшим случаем подгонки рисунка
	const pieceNeeds = pieces
		.map(len => len + trim + (usePattern ? rapport : 0))
		.map(len => Math.min(len, rollLength))
		.sort((a, b) => b - a)
	for (const need of pieceNeeds) {
		const i = remnants.findIndex(r => r + EPS >= need)
		if (i >= 0) remnants[i] -= need
		else {
			rolls++
			remnants.push(rollLength - need)
		}
	}

	const openingArea = input.openings.reduce(
		(sum, o) => sum + Math.max(0, o.width) * Math.max(0, o.height),
		0
	)
	const rollsWithoutOpenings = cutStrips(
		columns,
		h,
		rollLength,
		rapport,
		match
	).rolls

	const full = cutStrips(Math.max(columns, 1), h, rollLength, rapport, match)

	return {
		rolls,
		fullStrips,
		shortPieces: pieces.length,
		stripsPerRoll: full.stripsInFirstRoll,
		stripConsumption: consumption,
		wallArea: Math.max(0, perimeter * height - openingArea),
		boughtArea: rolls * rollWidth * rollLength,
		rollsWithoutOpenings
	}
}

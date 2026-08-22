export type ProportionField = 'a' | 'b' | 'c' | 'd'

/**
 * Пропорция a/b = c/d. Ровно одно поле — искомое, остальные три известны.
 * Решается правилом креста: неизвестное — произведение "крест-накрест" двух
 * известных чисел, делённое на третье.
 */
export function solveProportion(
	values: Record<ProportionField, number | null>,
	unknown: ProportionField
): number | null {
	const { a, b, c, d } = values

	if (unknown === 'a') {
		if (b === null || c === null || d === null || d === 0) return null
		return (b * c) / d
	}
	if (unknown === 'b') {
		if (a === null || c === null || d === null || c === 0) return null
		return (a * d) / c
	}
	if (unknown === 'c') {
		if (a === null || b === null || d === null || b === 0) return null
		return (a * d) / b
	}
	// unknown === 'd'
	if (a === null || b === null || c === null || a === 0) return null
	return (b * c) / a
}

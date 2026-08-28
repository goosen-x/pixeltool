/**
 * Расход топлива. Вся арифметика тула — три формулы вокруг одной величины,
 * литров на 100 км: она же нормируется производителем, ею же оперируют на
 * заправке и в путевом листе.
 */

export interface TripCost {
	/** Сколько топлива уйдёт на поездку, л. */
	liters: number
	/** Во сколько обойдётся, в валюте цены за литр. */
	cost: number
	/** Стоимость километра — то, чем удобно сравнивать машины и маршруты. */
	costPerKm: number
}

/** Расход на поездку и её стоимость. */
export function calculateTrip(
	distanceKm: number,
	litersPer100Km: number,
	pricePerLiter: number
): TripCost {
	const liters = (distanceKm * litersPer100Km) / 100
	const cost = liters * pricePerLiter

	return {
		liters,
		cost,
		// Деление на ноль дало бы Infinity в вёрстке; на нулевом пробеге
		// стоимость километра просто не определена.
		costPerKm: distanceKm > 0 ? cost / distanceKm : 0
	}
}

/**
 * Фактический расход по одной заправке «до полного»: проехали столько-то,
 * долили столько-то. Это единственный честный способ узнать свой расход —
 * паспортный обычно оптимистичнее.
 */
export function consumptionPer100Km(
	distanceKm: number,
	litersUsed: number
): number {
	if (distanceKm <= 0) return 0
	return (litersUsed / distanceKm) * 100
}

/** На сколько километров хватит бака (или остатка в нём). */
export function rangeOnLiters(liters: number, litersPer100Km: number): number {
	if (litersPer100Km <= 0) return 0
	return (liters / litersPer100Km) * 100
}

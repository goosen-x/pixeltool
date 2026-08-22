export interface Unit {
	id: string
	nameRu: string
	symbol: string
	toBase: (value: number) => number
	fromBase: (value: number) => number
}

export type UnitCategoryId = 'length' | 'weight' | 'temperature' | 'volume'

export interface UnitCategory {
	id: UnitCategoryId
	nameRu: string
	units: Unit[]
}

/**
 * Конвертация внутри категории идёт через общую базовую единицу (метры,
 * граммы, цельсий) — toBase/fromBase на каждую единицу вместо функции на
 * каждую пару. Формула: to.fromBase(from.toBase(value)).
 */
export const unitCategories: UnitCategory[] = [
	{
		id: 'length',
		nameRu: 'Длина',
		units: [
			{
				id: 'mm',
				nameRu: 'миллиметры',
				symbol: 'мм',
				toBase: v => v / 1000,
				fromBase: v => v * 1000
			},
			{
				id: 'cm',
				nameRu: 'сантиметры',
				symbol: 'см',
				toBase: v => v / 100,
				fromBase: v => v * 100
			},
			{
				id: 'in',
				nameRu: 'дюймы',
				symbol: 'дюйм',
				toBase: v => v * 0.0254,
				fromBase: v => v / 0.0254
			},
			{
				id: 'ft',
				nameRu: 'футы',
				symbol: 'фут',
				toBase: v => v * 0.3048,
				fromBase: v => v / 0.3048
			},
			{
				id: 'm',
				nameRu: 'метры',
				symbol: 'м',
				toBase: v => v,
				fromBase: v => v
			},
			{
				id: 'mi',
				nameRu: 'мили',
				symbol: 'миля',
				toBase: v => v * 1609.344,
				fromBase: v => v / 1609.344
			},
			{
				id: 'km',
				nameRu: 'километры',
				symbol: 'км',
				toBase: v => v * 1000,
				fromBase: v => v / 1000
			}
		]
	},
	{
		id: 'weight',
		nameRu: 'Вес',
		units: [
			{
				id: 'g',
				nameRu: 'граммы',
				symbol: 'г',
				toBase: v => v,
				fromBase: v => v
			},
			{
				id: 'kg',
				nameRu: 'килограммы',
				symbol: 'кг',
				toBase: v => v * 1000,
				fromBase: v => v / 1000
			},
			{
				id: 'oz',
				nameRu: 'унции',
				symbol: 'унция',
				toBase: v => v * 28.349523125,
				fromBase: v => v / 28.349523125
			},
			{
				id: 'lb',
				nameRu: 'фунты',
				symbol: 'фунт',
				toBase: v => v * 453.59237,
				fromBase: v => v / 453.59237
			},
			{
				// Тройская унция — отдельная единица для драгметаллов (золото,
				// серебро), не путать с обычной (avoirdupois) унцией выше:
				// 31.1034768 г против 28.349523125 г — разница ~10%.
				id: 'oz_troy',
				nameRu: 'тройские унции',
				symbol: 'тр. унция',
				toBase: v => v * 31.1034768,
				fromBase: v => v / 31.1034768
			}
		]
	},
	{
		id: 'temperature',
		nameRu: 'Температура',
		units: [
			{
				id: 'c',
				nameRu: 'градусы Цельсия',
				symbol: '°C',
				toBase: v => v,
				fromBase: v => v
			},
			{
				id: 'f',
				nameRu: 'градусы Фаренгейта',
				symbol: '°F',
				toBase: v => ((v - 32) * 5) / 9,
				fromBase: v => (v * 9) / 5 + 32
			}
		]
	},
	{
		id: 'volume',
		nameRu: 'Объём',
		units: [
			{
				id: 'ml',
				nameRu: 'миллилитры',
				symbol: 'мл',
				toBase: v => v,
				fromBase: v => v
			},
			{
				id: 'l',
				nameRu: 'литры',
				symbol: 'л',
				toBase: v => v * 1000,
				fromBase: v => v / 1000
			},
			{
				// Метрическая столовая ложка — 15 мл ровно (используется в
				// России и Европе). Не путать с американской (14,7867648 мл).
				id: 'tbsp',
				nameRu: 'столовые ложки',
				symbol: 'ст. л.',
				toBase: v => v * 15,
				fromBase: v => v / 15
			},
			{
				// Американский жидкий галлон — тот, что на канистрах бензина
				// и в расходе топлива США. Британский имперский галлон (4,546 л)
				// отличается почти на 20% и здесь не используется.
				id: 'gallon',
				nameRu: 'галлоны (США)',
				symbol: 'гал',
				toBase: v => v * 3785.411784,
				fromBase: v => v / 3785.411784
			}
		]
	}
]

export function getUnitCategory(id: UnitCategoryId): UnitCategory {
	const category = unitCategories.find(c => c.id === id)
	if (!category) throw new Error(`Unknown unit category: ${id}`)
	return category
}

export function getUnit(
	categoryId: UnitCategoryId,
	unitId: string
): Unit | undefined {
	return getUnitCategory(categoryId).units.find(u => u.id === unitId)
}

export function convert(
	categoryId: UnitCategoryId,
	fromId: string,
	toId: string,
	value: number
): number | null {
	const from = getUnit(categoryId, fromId)
	const to = getUnit(categoryId, toId)
	if (!from || !to) return null
	return to.fromBase(from.toBase(value))
}

export interface Unit {
	id: string
	nameRu: string
	symbol: string
	toBase: (value: number) => number
	fromBase: (value: number) => number
}

export type UnitCategoryId =
	| 'length'
	| 'weight'
	| 'temperature'
	| 'volume'
	| 'area'
	| 'speed'
	| 'energy'
	| 'power'
	| 'force'
	| 'angle'
	| 'current'

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
				id: 'dm',
				nameRu: 'дециметры',
				symbol: 'дм',
				toBase: v => v / 10,
				fromBase: v => v * 10
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
			},
			{
				// Морская миля — ровно 1852 м по международному соглашению
				// 1929 года, не путать с сухопутной милей (1609,344 м) выше.
				id: 'nmi',
				nameRu: 'морские мили',
				symbol: 'мор. миля',
				toBase: v => v * 1852,
				fromBase: v => v / 1852
			},
			{
				// Расстояние, которое свет проходит за юлианский год — точное
				// целое число метров, потому что скорость света зафиксирована
				// определением метра.
				id: 'lightyear',
				nameRu: 'световые годы',
				symbol: 'св. год',
				toBase: v => v * 9460730472580800,
				fromBase: v => v / 9460730472580800
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
				id: 'mg',
				nameRu: 'миллиграммы',
				symbol: 'мг',
				toBase: v => v / 1000,
				fromBase: v => v * 1000
			},
			{
				id: 'centner',
				nameRu: 'центнеры',
				symbol: 'ц',
				toBase: v => v * 100000,
				fromBase: v => v / 100000
			},
			{
				id: 't',
				nameRu: 'тонны',
				symbol: 'т',
				toBase: v => v * 1000000,
				fromBase: v => v / 1000000
			},
			{
				// Метрический карат — ровно 0,2 г. Не путать с каратом пробы
				// золота (24 карата = чистое золото), это доля, а не масса.
				id: 'carat',
				nameRu: 'караты',
				symbol: 'кар',
				toBase: v => v * 0.2,
				fromBase: v => v / 0.2
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
			},
			{
				// Шаг кельвина равен шагу цельсия, отличается только нулевая
				// точка: 0 К — абсолютный нуль, то есть −273,15 °C.
				id: 'k',
				nameRu: 'кельвины',
				symbol: 'К',
				toBase: v => v - 273.15,
				fromBase: v => v + 273.15
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
				// Кубический сантиметр совпадает с миллилитром ровно, с 1964
				// года: литр тогда переопределили как ровно 1 дм³.
				id: 'cm3',
				nameRu: 'кубические сантиметры',
				symbol: 'см³',
				toBase: v => v,
				fromBase: v => v
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
				// Метрическая чашка — 250 мл. Американская cup меньше,
				// 236,588 мл, в рецептах из США имеют в виду именно её.
				id: 'cup',
				nameRu: 'чашки',
				symbol: 'чашка',
				toBase: v => v * 250,
				fromBase: v => v / 250
			},
			{
				// Британская (имперская) пинта, 568,26125 мл. Американская
				// пинта — другая единица, 473,176473 мл.
				id: 'pint',
				nameRu: 'пинты',
				symbol: 'пинта',
				toBase: v => v * 568.26125,
				fromBase: v => v / 568.26125
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
			},
			{
				// Нефтяной баррель — ровно 42 галлона США, отсюда и дробное
				// число литров: 158,987294928 л.
				id: 'barrel',
				nameRu: 'баррели',
				symbol: 'баррель',
				toBase: v => v * 158987.294928,
				fromBase: v => v / 158987.294928
			}
		]
	},
	{
		id: 'area',
		nameRu: 'Площадь',
		units: [
			{
				id: 'm2',
				nameRu: 'квадратные метры',
				symbol: 'м²',
				toBase: v => v,
				fromBase: v => v
			},
			{
				id: 'cm2',
				nameRu: 'квадратные сантиметры',
				symbol: 'см²',
				toBase: v => v * 0.0001,
				fromBase: v => v / 0.0001
			},
			{
				id: 'mm2',
				nameRu: 'квадратные миллиметры',
				symbol: 'мм²',
				toBase: v => v * 0.000001,
				fromBase: v => v / 0.000001
			},
			{
				id: 'dm2',
				nameRu: 'квадратные дециметры',
				symbol: 'дм²',
				toBase: v => v * 0.01,
				fromBase: v => v / 0.01
			},
			{
				id: 'km2',
				nameRu: 'квадратные километры',
				symbol: 'км²',
				toBase: v => v * 1000000,
				fromBase: v => v / 1000000
			},
			{
				// Сотка — бытовое название ара: 100 м², сотая часть гектара.
				id: 'sotka',
				nameRu: 'сотки',
				symbol: 'сотка',
				toBase: v => v * 100,
				fromBase: v => v / 100
			},
			{
				id: 'ha',
				nameRu: 'гектары',
				symbol: 'га',
				toBase: v => v * 10000,
				fromBase: v => v / 10000
			},
			{
				id: 'acre',
				nameRu: 'акры',
				symbol: 'акр',
				toBase: v => v * 4046.8564224,
				fromBase: v => v / 4046.8564224
			}
		]
	},
	{
		id: 'speed',
		nameRu: 'Скорость',
		units: [
			{
				id: 'kmh',
				nameRu: 'километры в час',
				symbol: 'км/ч',
				toBase: v => v / 3.6,
				fromBase: v => v * 3.6
			},
			{
				id: 'ms',
				nameRu: 'метры в секунду',
				symbol: 'м/с',
				toBase: v => v,
				fromBase: v => v
			},
			{
				// Узел — одна морская миля в час, то есть 1852 м за 3600 с.
				id: 'knot',
				nameRu: 'узлы',
				symbol: 'узел',
				toBase: v => (v * 1852) / 3600,
				fromBase: v => (v * 3600) / 1852
			}
		]
	},
	{
		id: 'energy',
		nameRu: 'Энергия',
		units: [
			{
				id: 'j',
				nameRu: 'джоули',
				symbol: 'Дж',
				toBase: v => v,
				fromBase: v => v
			},
			{
				id: 'kj',
				nameRu: 'килоджоули',
				symbol: 'кДж',
				toBase: v => v * 1000,
				fromBase: v => v / 1000
			},
			{
				// Пищевая (термохимическая) килокалория — ровно 4184 Дж, это
				// та самая «калория» на упаковках продуктов.
				id: 'kcal',
				nameRu: 'килокалории',
				symbol: 'ккал',
				toBase: v => v * 4184,
				fromBase: v => v / 4184
			}
		]
	},
	{
		id: 'power',
		nameRu: 'Мощность',
		units: [
			{
				id: 'w',
				nameRu: 'ватты',
				symbol: 'Вт',
				toBase: v => v,
				fromBase: v => v
			},
			{
				id: 'kw',
				nameRu: 'киловатты',
				symbol: 'кВт',
				toBase: v => v * 1000,
				fromBase: v => v / 1000
			},
			{
				// Метрическая лошадиная сила (735,49875 Вт) — та, что в ПТС и
				// в характеристиках европейских машин. Британская hp другая,
				// 745,7 Вт.
				id: 'hp',
				nameRu: 'лошадиные силы',
				symbol: 'л.с.',
				toBase: v => v * 735.49875,
				fromBase: v => v / 735.49875
			}
		]
	},
	{
		id: 'force',
		nameRu: 'Сила',
		units: [
			{
				id: 'n',
				nameRu: 'ньютоны',
				symbol: 'Н',
				toBase: v => v,
				fromBase: v => v
			},
			{
				id: 'kn',
				nameRu: 'килоньютоны',
				symbol: 'кН',
				toBase: v => v * 1000,
				fromBase: v => v / 1000
			},
			{
				// Килограмм-сила: вес одного килограмма при стандартном
				// ускорении свободного падения 9,80665 м/с².
				id: 'kgf',
				nameRu: 'килограммы-силы',
				symbol: 'кгс',
				toBase: v => v * 9.80665,
				fromBase: v => v / 9.80665
			},
			{
				id: 'tonnef',
				nameRu: 'тонны-силы',
				symbol: 'тс',
				toBase: v => v * 9806.65,
				fromBase: v => v / 9806.65
			}
		]
	},
	{
		id: 'angle',
		nameRu: 'Угол',
		units: [
			{
				id: 'deg',
				nameRu: 'градусы',
				symbol: '°',
				toBase: v => (v * Math.PI) / 180,
				fromBase: v => (v * 180) / Math.PI
			},
			{
				id: 'rad',
				nameRu: 'радианы',
				symbol: 'рад',
				toBase: v => v,
				fromBase: v => v
			}
		]
	},
	{
		id: 'current',
		nameRu: 'Ток',
		units: [
			{
				id: 'a',
				nameRu: 'амперы',
				symbol: 'А',
				toBase: v => v,
				fromBase: v => v
			},
			{
				id: 'ma',
				nameRu: 'миллиамперы',
				symbol: 'мА',
				toBase: v => v / 1000,
				fromBase: v => v * 1000
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

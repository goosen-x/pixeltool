import {
	boxVolume,
	circleArea,
	coneVolume,
	cylinderLateralArea,
	cylinderVolume,
	pipeInnerVolume,
	pipeWallVolume,
	rectangleArea,
	ringArea,
	sphereArea,
	sphereVolume,
	trapezoidArea,
	triangleAreaByHeight,
	triangleAreaBySides,
	truncatedConeVolume,
	wallsArea,
	type Opening
} from '@/lib/utils/geometry'

export interface ShapeField {
	key: string
	/** Подпись поля и одновременно буква на схеме. */
	label: string
	/** Значение по умолчанию в текущих единицах — чтобы страница открывалась
	 *  с готовым примером, а не с пустой формой. */
	preset: number
	/** Человеческое имя поля над вводом («Внутренний диаметр»). Без него
	 *  над полем стоит одна буква, и непонятно, что вводить. */
	name?: string
}

export interface ShapeResult {
	/** Основная величина: м² для площади, м³ для объёма. */
	value: number
	/** Что это за число, если у фигуры их несколько (труба). */
	label?: string
	/** Дополнительные строки — внутренний объём трубы, площадь пола и т.п. */
	extra?: { label: string; value: number; unit: 'm2' | 'm3' }[]
}

export interface Shape {
	id: string
	kind: 'area' | 'volume'
	name: string
	/** Как формула выглядит на бумаге — её ищут не реже самого расчёта. */
	formula: string
	fields: ShapeField[]
	/** Почему compute вернул null при заполненных полях. */
	invalidHint?: string
	/** Все длины приходят уже в метрах. */
	compute: (
		values: Record<string, number>,
		openings?: Opening[]
	) => ShapeResult | null
}

/**
 * Наборы фигур для двух хабов.
 *
 * Везде, где фигура круглая, вводится диаметр, а не радиус: рулетка ложится
 * через центр, и радиус человек считает в уме — там и ошибается вдвое.
 * Замер 02.09.2026 подтверждает выбор набора: в хвосте «калькулятора объёма»
 * цилиндр 16548 и труба 4800, у площади комната 6018, стены 5876, круг 5549,
 * треугольник 4975, труба 3832.
 */
export const SHAPES: Shape[] = [
	/* ------------------------------------------------------------ площади */
	{
		id: 'rectangle',
		kind: 'area',
		name: 'Прямоугольник',
		formula: 'S = a × b',
		fields: [
			{ key: 'a', label: 'a', name: 'Длина a', preset: 5 },
			{ key: 'b', label: 'b', name: 'Ширина b', preset: 4 }
		],
		compute: v => ({ value: rectangleArea(v.a, v.b) })
	},
	{
		id: 'circle',
		kind: 'area',
		name: 'Круг',
		formula: 'S = π × D² / 4',
		fields: [{ key: 'd', label: 'D', name: 'Диаметр D', preset: 3 }],
		compute: v => ({ value: circleArea(v.d) })
	},
	{
		id: 'triangle',
		kind: 'area',
		name: 'Треугольник по сторонам',
		formula: 'S = √(p(p−a)(p−b)(p−c)), p — полупериметр',
		invalidHint:
			'Проверьте стороны: сумма любых двух должна быть больше третьей, иначе такого треугольника не существует',
		fields: [
			{ key: 'a', label: 'a', name: 'Сторона a', preset: 3 },
			{ key: 'b', label: 'b', name: 'Сторона b', preset: 4 },
			{ key: 'c', label: 'c', name: 'Сторона c', preset: 5 }
		],
		compute: v => {
			const area = triangleAreaBySides(v.a, v.b, v.c)
			return area === null ? null : { value: area }
		}
	},
	{
		// Школьный и бытовой вариант: основание и высота известны (фронтон,
		// косынка из листа). Раньше был обещан в тексте страницы, но в
		// калькуляторе его не было.
		id: 'triangle-height',
		kind: 'area',
		name: 'Треугольник по высоте',
		formula: 'S = a × h / 2',
		fields: [
			{ key: 'a', label: 'a', name: 'Основание a', preset: 4 },
			{ key: 'h', label: 'h', name: 'Высота h', preset: 3 }
		],
		compute: v => ({ value: triangleAreaByHeight(v.a, v.h) })
	},
	{
		id: 'trapezoid',
		kind: 'area',
		name: 'Трапеция',
		formula: 'S = (a + b) / 2 × h',
		fields: [
			{ key: 'a', label: 'a', name: 'Нижнее основание a', preset: 6 },
			{ key: 'b', label: 'b', name: 'Верхнее основание b', preset: 4 },
			{ key: 'h', label: 'h', name: 'Высота h', preset: 3 }
		],
		compute: v => ({ value: trapezoidArea(v.a, v.b, v.h) })
	},
	{
		id: 'ring',
		kind: 'area',
		name: 'Кольцо',
		formula: 'S = π × (D² − d²) / 4',
		fields: [
			{ key: 'D', label: 'D', name: 'Наружный диаметр D', preset: 3 },
			{ key: 'd', label: 'd', name: 'Внутренний диаметр d', preset: 2 }
		],
		invalidHint:
			'Внутренний диаметр d должен быть меньше наружного D, иначе кольца нет',
		compute: v => (v.d >= v.D ? null : { value: ringArea(v.D, v.d) })
	},
	{
		id: 'walls',
		kind: 'area',
		name: 'Стены комнаты',
		formula: 'S = 2 × (a + b) × h − проёмы',
		fields: [
			{ key: 'a', label: 'a', name: 'Длина a', preset: 5 },
			{ key: 'b', label: 'b', name: 'Ширина b', preset: 4 },
			{ key: 'h', label: 'h', name: 'Высота потолка h', preset: 2.7 }
		],
		compute: (v, openings = []) => ({
			value: wallsArea(v.a, v.b, v.h, openings),
			extra: [
				{ label: 'Площадь пола', value: rectangleArea(v.a, v.b), unit: 'm2' },
				{
					label: 'Стены без вычета проёмов',
					value: wallsArea(v.a, v.b, v.h),
					unit: 'm2'
				}
			]
		})
	},
	{
		id: 'pipe-surface',
		kind: 'area',
		name: 'Поверхность трубы',
		formula: 'S = π × D × L',
		fields: [
			{ key: 'd', label: 'D', name: 'Наружный диаметр D', preset: 0.1 },
			{ key: 'h', label: 'L', name: 'Длина L', preset: 6 }
		],
		compute: v => ({ value: cylinderLateralArea(v.d, v.h) })
	},
	{
		id: 'sphere-surface',
		kind: 'area',
		name: 'Поверхность шара',
		formula: 'S = π × D²',
		fields: [{ key: 'd', label: 'D', name: 'Диаметр D', preset: 2 }],
		compute: v => ({ value: sphereArea(v.d) })
	},

	/* ------------------------------------------------------------- объёмы */
	{
		id: 'box',
		kind: 'volume',
		name: 'Прямоугольный короб',
		formula: 'V = a × b × c',
		fields: [
			{ key: 'a', label: 'a', name: 'Длина a', preset: 5 },
			{ key: 'b', label: 'b', name: 'Ширина b', preset: 4 },
			{ key: 'c', label: 'c', name: 'Высота c', preset: 2.7 }
		],
		compute: v => ({ value: boxVolume(v.a, v.b, v.c) })
	},
	{
		id: 'cylinder',
		kind: 'volume',
		name: 'Цилиндр',
		formula: 'V = π × D² / 4 × h',
		fields: [
			{ key: 'd', label: 'D', name: 'Диаметр D', preset: 1 },
			{ key: 'h', label: 'h', name: 'Высота h', preset: 1.5 }
		],
		compute: v => ({ value: cylinderVolume(v.d, v.h) })
	},
	{
		// Главное число — вместимость: «объём трубы» ищут, чтобы узнать,
		// сколько воды или теплоносителя в неё войдёт. Объём стенок (для веса
		// материала) идёт второй строкой.
		id: 'pipe',
		kind: 'volume',
		name: 'Труба',
		formula: 'V = π × d² / 4 × L',
		fields: [
			{ key: 'D', label: 'D', name: 'Наружный диаметр D', preset: 0.11 },
			{ key: 'd', label: 'd', name: 'Внутренний диаметр d', preset: 0.1 },
			{ key: 'h', label: 'L', name: 'Длина L', preset: 6 }
		],
		invalidHint:
			'Внутренний диаметр d должен быть меньше наружного D: разница между ними и есть стенка трубы',
		compute: v => {
			if (v.d >= v.D) return null
			return {
				value: pipeInnerVolume(v.d, v.h),
				label: 'Вместимость, сколько войдёт внутрь',
				extra: [
					{
						label: 'Объём стенок, π × (D² − d²) / 4 × L',
						value: pipeWallVolume(v.D, v.d, v.h),
						unit: 'm3'
					}
				]
			}
		}
	},
	{
		id: 'sphere',
		kind: 'volume',
		name: 'Шар',
		formula: 'V = π × D³ / 6',
		fields: [{ key: 'd', label: 'D', name: 'Диаметр D', preset: 1 }],
		compute: v => ({ value: sphereVolume(v.d) })
	},
	{
		id: 'cone',
		kind: 'volume',
		name: 'Конус',
		formula: 'V = π × D² / 4 × h / 3',
		fields: [
			{ key: 'd', label: 'D', name: 'Диаметр основания D', preset: 1 },
			{ key: 'h', label: 'h', name: 'Высота h', preset: 1.5 }
		],
		compute: v => ({ value: coneVolume(v.d, v.h) })
	},
	{
		id: 'truncated-cone',
		kind: 'volume',
		name: 'Усечённый конус',
		formula: 'V = π × h × (D² + D×d + d²) / 12',
		fields: [
			{ key: 'D', label: 'D', name: 'Нижний диаметр D', preset: 0.4 },
			{ key: 'd', label: 'd', name: 'Верхний диаметр d', preset: 0.3 },
			{ key: 'h', label: 'h', name: 'Высота h', preset: 0.35 }
		],
		compute: v => ({ value: truncatedConeVolume(v.D, v.d, v.h) })
	}
]

export function getShapeById(id: string): Shape | undefined {
	return SHAPES.find(shape => shape.id === id)
}

export function shapesByKind(kind: 'area' | 'volume'): Shape[] {
	return SHAPES.filter(shape => shape.kind === kind)
}

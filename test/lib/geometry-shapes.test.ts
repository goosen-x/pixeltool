import { describe, it, expect } from 'vitest'
import {
	getShapeById,
	SHAPES,
	shapesByKind
} from '@/lib/constants/geometry-shapes'
import {
	cubicMetersToLiters,
	cylinderVolume,
	pipeWallVolume,
	rectangleArea
} from '@/lib/utils/geometry'

/** Значения по умолчанию фигуры — с ними страница открывается. */
const presets = (id: string) =>
	Object.fromEntries(
		getShapeById(id)!.fields.map(field => [field.key, field.preset])
	)

describe('набор фигур', () => {
	it('идентификаторы уникальны', () => {
		expect(new Set(SHAPES.map(s => s.id)).size).toBe(SHAPES.length)
	})

	it('у каждой фигуры есть поля, формула и имя', () => {
		for (const shape of SHAPES) {
			expect(shape.fields.length).toBeGreaterThan(0)
			expect(shape.formula.length).toBeGreaterThan(0)
			expect(shape.name.length).toBeGreaterThan(0)
		}
	})

	it('ключи полей внутри фигуры не повторяются', () => {
		for (const shape of SHAPES) {
			const keys = shape.fields.map(f => f.key)
			expect(new Set(keys).size).toBe(keys.length)
		}
	})

	it('разложены по двум хабам и оба непустые', () => {
		expect(shapesByKind('area').length).toBeGreaterThan(0)
		expect(shapesByKind('volume').length).toBeGreaterThan(0)
		expect(shapesByKind('area').length + shapesByKind('volume').length).toBe(
			SHAPES.length
		)
	})

	it('на значениях по умолчанию каждая фигура что-то считает', () => {
		for (const shape of SHAPES) {
			const result = shape.compute(presets(shape.id))
			expect(result, shape.id).not.toBeNull()
			expect(Number.isFinite(result!.value), shape.id).toBe(true)
			expect(result!.value, shape.id).toBeGreaterThan(0)
		}
	})
})

describe('расчёты фигур', () => {
	it('прямоугольник совпадает с прямой формулой', () => {
		const shape = getShapeById('rectangle')!
		expect(shape.compute({ a: 5, b: 4 })!.value).toBe(rectangleArea(5, 4))
	})

	it('невозможный треугольник возвращает null', () => {
		expect(getShapeById('triangle')!.compute({ a: 1, b: 2, c: 10 })).toBeNull()
	})

	it('цилиндр диаметром 1 и высотой 1.5 совпадает с формулой', () => {
		const shape = getShapeById('cylinder')!
		expect(shape.compute({ d: 1, h: 1.5 })!.value).toBeCloseTo(
			cylinderVolume(1, 1.5),
			9
		)
	})

	it('стены отдают отдельной строкой площадь пола', () => {
		const result = getShapeById('walls')!.compute({ a: 5, b: 4, h: 2.7 })!
		const floor = result.extra?.find(e => e.label === 'Площадь пола')
		expect(floor?.value).toBeCloseTo(20, 9)
	})

	it('проёмы уменьшают площадь стен', () => {
		const shape = getShapeById('walls')!
		const plain = shape.compute({ a: 5, b: 4, h: 2.7 })!.value
		const withDoor = shape.compute({ a: 5, b: 4, h: 2.7 }, [
			{ width: 0.9, height: 2.1, count: 1 }
		])!.value
		expect(plain - withDoor).toBeCloseTo(0.9 * 2.1, 9)
	})

	it('у трубы главное число это вместимость, стенки второй строкой', () => {
		const result = getShapeById('pipe')!.compute({ D: 0.11, d: 0.1, h: 6 })!
		// шестиметровая труба на 100 мм вмещает около 47 литров
		expect(cubicMetersToLiters(result.value)).toBeGreaterThan(45)
		expect(cubicMetersToLiters(result.value)).toBeLessThan(48)
		expect(result.label).toMatch(/Вместимость/)
		const wall = result.extra?.find(e => e.label.startsWith('Объём стенок'))
		expect(wall?.value).toBeCloseTo(pipeWallVolume(0.11, 0.1, 6), 9)
	})

	it('труба с внутренним диаметром не меньше наружного не считается', () => {
		const pipe = getShapeById('pipe')!
		expect(pipe.compute({ D: 0.1, d: 0.11, h: 6 })).toBeNull()
		expect(pipe.compute({ D: 0.1, d: 0.1, h: 6 })).toBeNull()
		expect(pipe.invalidHint).toBeTruthy()
	})

	it('у всех полей объёмных фигур есть понятное имя', () => {
		for (const shape of shapesByKind('volume')) {
			for (const field of shape.fields) {
				expect(field.name, `${shape.id}.${field.key}`).toBeTruthy()
			}
		}
	})

	it('бочка 200 литров: цилиндр 0.6 × 0.72 близок к ней', () => {
		const volume = getShapeById('cylinder')!.compute({ d: 0.6, h: 0.72 })!.value
		expect(cubicMetersToLiters(volume)).toBeGreaterThan(195)
		expect(cubicMetersToLiters(volume)).toBeLessThan(210)
	})
})

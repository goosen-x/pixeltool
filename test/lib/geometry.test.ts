import { describe, it, expect } from 'vitest'
import {
	areaAside,
	boxVolume,
	circleArea,
	coneVolume,
	convertLengthInput,
	cubicMetersToLiters,
	cylinderLateralArea,
	cylinderVolume,
	formatNumber,
	formatVolume,
	LENGTH_IN_METERS,
	parseLength,
	parseOpenings,
	pipeInnerVolume,
	pipeWallVolume,
	rectangleArea,
	ringArea,
	sphereArea,
	sphereVolume,
	toMeters,
	trapezoidArea,
	triangleAreaByHeight,
	triangleAreaBySides,
	truncatedConeVolume,
	wallsArea
} from '@/lib/utils/geometry'

describe('единицы длины', () => {
	it('переводятся в метры', () => {
		expect(toMeters(1000, 'mm')).toBeCloseTo(1, 9)
		expect(toMeters(100, 'cm')).toBeCloseTo(1, 9)
		expect(toMeters(10, 'dm')).toBeCloseTo(1, 9)
		expect(toMeters(1, 'm')).toBe(1)
	})

	it('шкала последовательна: каждая следующая в десять раз крупнее', () => {
		expect(LENGTH_IN_METERS.cm / LENGTH_IN_METERS.mm).toBeCloseTo(10, 9)
		expect(LENGTH_IN_METERS.dm / LENGTH_IN_METERS.cm).toBeCloseTo(10, 9)
		expect(LENGTH_IN_METERS.m / LENGTH_IN_METERS.dm).toBeCloseTo(10, 9)
	})
})

describe('площади', () => {
	it('прямоугольник', () => {
		expect(rectangleArea(3, 4)).toBe(12)
	})

	it('круг диаметром 2 равен π', () => {
		expect(circleArea(2)).toBeCloseTo(Math.PI, 9)
	})

	it('круг задаётся диаметром, а не радиусом', () => {
		// Радиус 1 — это диаметр 2. Если бы функция принимала радиус,
		// результат отличался бы вчетверо: вот эта ошибка и ловится.
		expect(circleArea(2)).toBeCloseTo(Math.PI, 9)
		expect(circleArea(1)).toBeCloseTo(Math.PI / 4, 9)
	})

	it('треугольник по основанию и высоте', () => {
		expect(triangleAreaByHeight(6, 4)).toBe(12)
	})

	it('египетский треугольник 3-4-5 даёт 6', () => {
		expect(triangleAreaBySides(3, 4, 5)).toBeCloseTo(6, 9)
	})

	it('равносторонний треугольник совпадает с формулой', () => {
		const a = 2
		expect(triangleAreaBySides(a, a, a)).toBeCloseTo(
			(Math.sqrt(3) / 4) * a * a,
			9
		)
	})

	it('несуществующий треугольник даёт null, а не NaN', () => {
		expect(triangleAreaBySides(1, 2, 10)).toBeNull()
		expect(triangleAreaBySides(1, 1, 2)).toBeNull() // вырожденный
		expect(triangleAreaBySides(0, 4, 5)).toBeNull()
		expect(triangleAreaBySides(-3, 4, 5)).toBeNull()
	})

	it('трапеция с равными основаниями превращается в прямоугольник', () => {
		expect(trapezoidArea(5, 5, 3)).toBeCloseTo(rectangleArea(5, 3), 9)
	})

	it('трапеция', () => {
		expect(trapezoidArea(4, 6, 3)).toBe(15)
	})

	it('кольцо равно разности кругов', () => {
		expect(ringArea(4, 2)).toBeCloseTo(circleArea(4) - circleArea(2), 9)
	})

	it('кольцо не уходит в минус при перепутанных диаметрах', () => {
		expect(ringArea(2, 4)).toBe(0)
	})

	it('боковая поверхность цилиндра равна πDh', () => {
		expect(cylinderLateralArea(2, 5)).toBeCloseTo(Math.PI * 2 * 5, 9)
	})

	it('поверхность шара вчетверо больше площади его круга', () => {
		expect(sphereArea(2)).toBeCloseTo(4 * circleArea(2), 9)
	})
})

describe('площадь стен', () => {
	it('периметр на высоту без проёмов', () => {
		// комната 3×4, высота 2.5 → периметр 14, площадь 35
		expect(wallsArea(3, 4, 2.5)).toBeCloseTo(35, 9)
	})

	it('проёмы вычитаются', () => {
		const withoutOpenings = wallsArea(3, 4, 2.5)
		const withDoor = wallsArea(3, 4, 2.5, [
			{ width: 0.9, height: 2.1, count: 1 }
		])
		expect(withoutOpenings - withDoor).toBeCloseTo(0.9 * 2.1, 9)
	})

	it('несколько одинаковых проёмов считаются по count', () => {
		const area = wallsArea(3, 4, 2.5, [{ width: 1.4, height: 1.5, count: 2 }])
		expect(area).toBeCloseTo(35 - 2 * 1.4 * 1.5, 9)
	})

	it('проёмы больше стен не уводят площадь в минус', () => {
		expect(wallsArea(3, 4, 2.5, [{ width: 10, height: 10, count: 5 }])).toBe(0)
	})
})

describe('объёмы', () => {
	it('куб', () => {
		expect(boxVolume(2, 3, 4)).toBe(24)
	})

	it('цилиндр диаметром 2 и высотой 1 равен π', () => {
		expect(cylinderVolume(2, 1)).toBeCloseTo(Math.PI, 9)
	})

	it('шар диаметром 2 равен 4π/3', () => {
		expect(sphereVolume(2)).toBeCloseTo((4 / 3) * Math.PI, 9)
	})

	it('конус равен трети цилиндра тех же размеров', () => {
		expect(coneVolume(3, 5)).toBeCloseTo(cylinderVolume(3, 5) / 3, 9)
	})

	it('усечённый конус с равными диаметрами равен цилиндру', () => {
		expect(truncatedConeVolume(3, 3, 5)).toBeCloseTo(cylinderVolume(3, 5), 9)
	})

	it('усечённый конус с нулевым верхом равен конусу', () => {
		expect(truncatedConeVolume(3, 0, 5)).toBeCloseTo(coneVolume(3, 5), 9)
	})

	it('стенки трубы: объём кольца по длине', () => {
		expect(pipeWallVolume(0.1, 0.09, 6)).toBeCloseTo(ringArea(0.1, 0.09) * 6, 9)
	})

	it('внутренний объём трубы считается по внутреннему диаметру', () => {
		expect(pipeInnerVolume(0.09, 6)).toBeCloseTo(cylinderVolume(0.09, 6), 9)
	})

	it('стенки плюс внутренность равны полному цилиндру', () => {
		const outer = 0.1
		const inner = 0.09
		const length = 6
		expect(
			pipeWallVolume(outer, inner, length) + pipeInnerVolume(inner, length)
		).toBeCloseTo(cylinderVolume(outer, length), 9)
	})
})

describe('литры', () => {
	it('кубометр — тысяча литров', () => {
		expect(cubicMetersToLiters(1)).toBe(1000)
	})

	it('бочка 200 литров это 0.2 м³', () => {
		expect(cubicMetersToLiters(0.2)).toBeCloseTo(200, 9)
	})

	it('куб со стороной 10 см вмещает литр', () => {
		const volume = boxVolume(
			toMeters(10, 'cm'),
			toMeters(10, 'cm'),
			toMeters(10, 'cm')
		)
		expect(cubicMetersToLiters(volume)).toBeCloseTo(1, 9)
	})
})

describe('formatNumber', () => {
	it('крупные числа без лишней точности', () => {
		// Разряды разделяются неразрывным пробелом — так их отдаёт
		// toLocaleString для русской локали, и так правильно: обычный пробел
		// позволил бы разорвать число переносом строки посреди разряда.
		expect(formatNumber(1234.5678)).toBe('1\u00A0234,6')
	})

	it('разряды не рвутся переносом строки', () => {
		expect(formatNumber(1000000)).toContain('\u00A0')
		expect(formatNumber(1000000)).not.toContain(' ')
	})

	it('средние с сотыми', () => {
		expect(formatNumber(12.3456)).toBe('12,35')
	})

	it('мелкие не схлопываются в ноль', () => {
		expect(formatNumber(0.0007)).toBe('0,0007')
	})

	it('ноль остаётся нулём', () => {
		expect(formatNumber(0)).toBe('0')
	})

	it('нечисло не показывается как NaN', () => {
		expect(formatNumber(NaN)).toBe('—')
		expect(formatNumber(Infinity)).toBe('—')
	})
})

describe('parseLength', () => {
	it('принимает запятую, точку и пробелы между разрядами', () => {
		expect(parseLength('1,5')).toBe(1.5)
		expect(parseLength('1.5')).toBe(1.5)
		expect(parseLength('1 200')).toBe(1200)
		expect(parseLength(' 2 ')).toBe(2)
	})

	it('отбрасывает пустое, мусор и неположительное', () => {
		expect(parseLength('')).toBeNull()
		expect(parseLength('12abc')).toBeNull()
		expect(parseLength('0')).toBeNull()
		expect(parseLength('-3')).toBeNull()
	})
})

describe('convertLengthInput', () => {
	it('при смене единиц фигура остаётся той же', () => {
		expect(convertLengthInput('5', 'm', 'cm')).toBe('500')
		expect(convertLengthInput('2,7', 'm', 'mm')).toBe('2700')
		expect(convertLengthInput('30', 'cm', 'm')).toBe('0.3')
		expect(convertLengthInput('0.1', 'm', 'mm')).toBe('100')
	})

	it('недописанный ввод не трогает', () => {
		expect(convertLengthInput('', 'm', 'cm')).toBe('')
		expect(convertLengthInput('abc', 'm', 'cm')).toBe('abc')
	})
})

describe('formatVolume', () => {
	it('от литра и больше показывает кубометры и литры', () => {
		const v = formatVolume(0.254)
		expect(v.unit).toBe('м³')
		expect(v.value).toBe('0,254')
		expect(v.liters).toBe('254 л')
	})

	it('меньше литра переходит на см³, а не показывает ноль', () => {
		// шар диаметром 1 см
		const v = formatVolume(sphereVolume(0.01))
		expect(v.unit).toBe('см³')
		expect(v.value).toBe('0,524')
		expect(v.liters).toContain('мл')
	})
})

describe('проёмы из полей ввода', () => {
	it('понимают запятую и переводят сантиметры в метры', () => {
		const [door] = parseOpenings(
			[{ width: '90', height: '210', count: '1' }],
			'cm'
		)
		expect(door.width).toBeCloseTo(0.9, 9)
		expect(door.height).toBeCloseTo(2.1, 9)
		expect(
			parseOpenings([{ width: '0,9', height: '2,1', count: '2' }], 'm')[0]
		).toEqual({ width: 0.9, height: 2.1, count: 2 })
	})

	it('недописанный проём пропускается, остальные считаются', () => {
		const result = parseOpenings(
			[
				{ width: '0,', height: '', count: '1' },
				{ width: '1,4', height: '1,5', count: '1' }
			],
			'm'
		)
		expect(result).toEqual([{ width: 1.4, height: 1.5, count: 1 }])
	})
})

describe('вторая строка под площадью', () => {
	it('мелочь в квадратных сантиметрах', () => {
		expect(areaAside(0.06)).toBe('600 см²')
	})

	it('у комнаты лишней строки нет', () => {
		expect(areaAside(20)).toBeNull()
	})

	it('участок в сотках, крупный ещё и в гектарах', () => {
		expect(areaAside(600)).toBe('6 сот.')
		expect(areaAside(25000)).toBe('250 сот., или 2,5 га')
	})
})

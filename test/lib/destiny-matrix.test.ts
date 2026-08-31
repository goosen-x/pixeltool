import { describe, it, expect } from 'vitest'
import {
	getYearsMatrixSector,
	getArcana,
	calculateFullDestinyMatrix,
	FULL_POINT_LABELS,
	YEARS_MATRIX_SECTOR_KEYS,
	NAMED_LINES,
	TALENT_POINTS,
	type FullPointKey
} from '@/lib/utils/destiny-matrix'
import { DIAGRAM_NODES } from '@/lib/utils/destiny-matrix-diagram'
import { NARRATIVE_KEYS } from '@/lib/utils/destiny-matrix-narrative-sections'
import { getPositionalMeaning } from '@/lib/data/destiny-matrix-meanings'
import { getNarrativeMeaning } from '@/lib/data/destiny-matrix-narrative'

describe('getYearsMatrixSector', () => {
	// Восемь точек в порядке секторов: day, f, month, g, year, h, fourth, i.
	// Ровно столько же, сколько в YEARS_MATRIX_SECTOR_KEYS — функция типизирована
	// восьмёркой не для красоты: на четырёх элементах points[4] дал бы undefined.
	const points: [
		number,
		number,
		number,
		number,
		number,
		number,
		number,
		number
	] = [17, 3, 5, 7, 11, 13, 19, 2]

	it('возраст 0 попадает в первый сектор', () => {
		expect(getYearsMatrixSector(0, points)).toEqual({
			arcanaNumber: 17,
			sectorIndex: 0,
			sectorStart: 0,
			sectorEnd: 10
		})
	})

	it('сектор меняется каждые десять лет', () => {
		expect(getYearsMatrixSector(9, points).sectorIndex).toBe(0)
		expect(getYearsMatrixSector(10, points).sectorIndex).toBe(1)
		expect(getYearsMatrixSector(19, points).sectorIndex).toBe(1)
		expect(getYearsMatrixSector(20, points).sectorIndex).toBe(2)
	})

	it('возраст 45 попадает в пятый сектор', () => {
		expect(getYearsMatrixSector(45, points)).toEqual({
			arcanaNumber: 11,
			sectorIndex: 4,
			sectorStart: 40,
			sectorEnd: 50
		})
	})

	it('после 80 лет цикл повторяется с первой точки', () => {
		expect(getYearsMatrixSector(80, points).sectorIndex).toBe(0)
		expect(getYearsMatrixSector(89, points).sectorIndex).toBe(0)
		expect(getYearsMatrixSector(90, points).sectorIndex).toBe(1)
		expect(getYearsMatrixSector(160, points).sectorIndex).toBe(0)
	})

	it('на любом возрасте аркан определён', () => {
		// Регресс на дыру в кольце: пока функция принимала четыре точки,
		// начиная с 40 лет она возвращала undefined, и сектор оставался пустым.
		for (let age = 0; age <= 120; age++) {
			const sector = getYearsMatrixSector(age, points)
			expect(points).toContain(sector.arcanaNumber)
			expect(sector.sectorEnd - sector.sectorStart).toBe(10)
		}
	})

	it('число точек совпадает с числом секторов кольца', () => {
		expect(YEARS_MATRIX_SECTOR_KEYS).toHaveLength(points.length)
	})
})

describe('позиционные трактовки', () => {
	// Пришли на смену getPersonalizedMeaning (родовые варианты по полу),
	// удалённой в f32c54a: текст теперь зависит не от пола, а от того, на
	// какой позиции схемы стоит аркан.
	it('для точки и аркана есть свой текст', () => {
		const text = getPositionalMeaning('day', 1)

		expect(text).toBeTruthy()
		expect(text).not.toBe(getPositionalMeaning('center', 1))
	})

	it('связный текст отличается от карточного', () => {
		expect(getNarrativeMeaning('day', 1)).not.toBe(
			getPositionalMeaning('day', 1)
		)
	})

	it('несуществующий аркан даёт null, а не падение', () => {
		expect(getPositionalMeaning('day', 99)).toBeNull()
		expect(getNarrativeMeaning('day', 99)).toBeNull()
	})

	it('у каждой показываемой точки есть текст на все 22 аркана', () => {
		// Проверяем ровно те точки, которые человек может открыть: узлы схемы
		// и позиции сплошного текста. Дыра здесь означает, что пользователь
		// кликнет по узлу и получит общее значение аркана вместо разбора.
		const shown = new Set<FullPointKey>([
			...DIAGRAM_NODES.map(node => node.key),
			...NARRATIVE_KEYS
		])

		for (const key of shown) {
			for (let arcana = 1; arcana <= 22; arcana++) {
				expect(
					getPositionalMeaning(key, arcana),
					`${key}/${arcana}`
				).toBeTruthy()
			}
		}
	})

	it('без текстов остаются только точки, которых нет на экране', () => {
		// l1 и l2 считаются в calculateFullDestinyMatrix, но не рисуются на
		// схеме и не входят в сплошной текст, поэтому трактовок у них нет.
		// Тест зафиксирован намеренно: если эти точки однажды выведут в
		// интерфейс, он упадёт и напомнит, что текстов к ним никто не написал.
		const missing = (Object.keys(FULL_POINT_LABELS) as FullPointKey[]).filter(
			key => getPositionalMeaning(key, 1) === null
		)

		expect(missing.sort()).toEqual(['l1', 'l2'])
		for (const key of missing) {
			expect(DIAGRAM_NODES.some(node => node.key === key)).toBe(false)
			expect(NARRATIVE_KEYS).not.toContain(key)
		}
	})
})

describe('calculateFullDestinyMatrix', () => {
	// 17.03.1994, сверено вручную с docs/research/destiny-matrix.md
	// (раздел «Полная методика», числовой пример), формулы дословно
	// подтверждены на gadalkindom.ru/matritsa-sudby/metodika-raschyota.html
	it('считает все производные точки на сквозном примере 17.03.1994', () => {
		const result = calculateFullDestinyMatrix(17, 3, 1994)

		expect(result.day).toBe(17)
		expect(result.month).toBe(3)
		expect(result.year).toBe(5)
		expect(result.fourth).toBe(7)
		expect(result.center).toBe(5)

		expect(result.j).toBe(22)
		expect(result.k).toBe(8)
		expect(result.l).toBe(10)
		expect(result.m).toBe(12)
		expect(result.q).toBe(15)

		expect(result.f).toBe(20)
		expect(result.g).toBe(8)
		expect(result.h).toBe(12)
		expect(result.i).toBe(6)
		expect(result.l2).toBe(10)
		expect(result.l1).toBe(15)

		expect(result.f2).toBe(3)
		expect(result.f1).toBe(5)
		expect(result.g2).toBe(18)
		expect(result.g1).toBe(8)
		expect(result.h2).toBe(22)
		expect(result.h1).toBe(7)
		expect(result.i2).toBe(16)
		expect(result.i1).toBe(22)

		expect(result.r).toBe(22)
		expect(result.r1).toBe(7)
		expect(result.r2).toBe(5)
	})

	it('у каждой точки результата есть подпись в FULL_POINT_LABELS', () => {
		const result = calculateFullDestinyMatrix(17, 3, 1994)
		for (const key of Object.keys(result) as (keyof typeof result)[]) {
			expect(FULL_POINT_LABELS[key], `нет подписи для ${key}`).toBeTypeOf(
				'string'
			)
		}
	})

	it('все ключи в NAMED_LINES и TALENT_POINTS существуют в результате', () => {
		const result = calculateFullDestinyMatrix(17, 3, 1994)
		const resultKeys = new Set(Object.keys(result))

		for (const line of NAMED_LINES) {
			for (const segment of line.segments) {
				for (const key of segment) {
					expect(resultKeys.has(key), `${line.key}: нет ключа ${key}`).toBe(
						true
					)
				}
			}
		}

		for (const point of TALENT_POINTS) {
			expect(resultKeys.has(point.key), `нет ключа ${point.key}`).toBe(true)
		}
	})
})

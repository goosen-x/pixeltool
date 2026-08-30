import { describe, it, expect } from 'vitest'
import {
	getYearsMatrixSector,
	getPersonalizedMeaning,
	getArcana,
	calculateFullDestinyMatrix
} from '@/lib/utils/destiny-matrix'

describe('getYearsMatrixSector', () => {
	const points: [number, number, number, number] = [17, 3, 5, 7]

	it('возраст 0 попадает в первый сектор (точка A)', () => {
		expect(getYearsMatrixSector(0, points)).toEqual({
			arcanaNumber: 17,
			sectorIndex: 0,
			sectorStart: 0,
			sectorEnd: 20
		})
	})

	it('возраст 19 остаётся в первом секторе, 20 переходит во второй', () => {
		expect(getYearsMatrixSector(19, points).sectorIndex).toBe(0)
		expect(getYearsMatrixSector(20, points).sectorIndex).toBe(1)
	})

	it('возраст 45 попадает в третий сектор (точка C)', () => {
		expect(getYearsMatrixSector(45, points)).toEqual({
			arcanaNumber: 5,
			sectorIndex: 2,
			sectorStart: 40,
			sectorEnd: 60
		})
	})

	it('после 80 лет цикл повторяется с точки A', () => {
		expect(getYearsMatrixSector(80, points).sectorIndex).toBe(0)
		expect(getYearsMatrixSector(99, points).sectorIndex).toBe(0)
		expect(getYearsMatrixSector(100, points).sectorIndex).toBe(1)
	})
})

describe('getPersonalizedMeaning', () => {
	const arcana = getArcana(1)

	it('без указания пола возвращает нейтральный текст', () => {
		expect(getPersonalizedMeaning(arcana)).toBe(arcana.meaning)
	})

	it('для мужского пола возвращает meaningMasc, если он задан', () => {
		expect(getPersonalizedMeaning(arcana, 'male')).toBe(arcana.meaningMasc)
	})

	it('для женского пола возвращает meaningFem, если он задан', () => {
		expect(getPersonalizedMeaning(arcana, 'female')).toBe(arcana.meaningFem)
	})

	it('падает обратно на нейтральный текст, если родового варианта нет', () => {
		const withoutGendered = { number: 99, name: 'Тест', meaning: 'нейтрально' }
		expect(getPersonalizedMeaning(withoutGendered, 'male')).toBe('нейтрально')
		expect(getPersonalizedMeaning(withoutGendered, 'female')).toBe('нейтрально')
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
})

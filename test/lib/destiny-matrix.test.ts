import { describe, it, expect } from 'vitest'
import {
	getYearsMatrixSector,
	getPersonalizedMeaning,
	getArcana
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

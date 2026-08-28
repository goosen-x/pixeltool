import { describe, it, expect } from 'vitest'
import {
	CAR_REGIONS,
	findByCode,
	findByRegion
} from '@/lib/data/car-region-codes'

describe('справочник кодов регионов', () => {
	it('у каждого региона есть название, округ и хотя бы один код', () => {
		for (const region of CAR_REGIONS) {
			expect(region.region.length).toBeGreaterThan(0)
			expect(region.district.length).toBeGreaterThan(0)
			expect(region.codes.length).toBeGreaterThan(0)
		}
	})

	it('коды состоят из двух или трёх цифр', () => {
		for (const region of CAR_REGIONS) {
			for (const code of [...region.codes, ...(region.formerCodes ?? [])]) {
				expect(code).toMatch(/^\d{2,3}$/)
			}
		}
	})

	it('один действующий код не закреплён за двумя регионами', () => {
		const seen = new Map<string, string>()
		for (const region of CAR_REGIONS) {
			for (const code of region.codes) {
				expect(seen.get(code)).toBeUndefined()
				seen.set(code, region.region)
			}
		}
	})
})

describe('findByCode', () => {
	it('находит регион по коду', () => {
		expect(findByCode('77')[0].region.region).toBe('Москва')
		expect(findByCode('716')[0].region.region).toBe('Татарстан')
	})

	it('код 82 — действующий у Крыма и снятый у Камчатки', () => {
		const matches = findByCode('82')
		const current = matches.find(m => !m.former)
		const former = matches.find(m => m.former)

		expect(current?.region.region).toBe('Республика Крым')
		expect(former?.region.region).toBe('Камчатский край')
	})

	it('переназначенные коды отдают обоих владельцев', () => {
		const matches = findByCode('84')
		expect(matches.map(m => m.region.region).sort()).toEqual([
			'Красноярский край',
			'Херсонская область'
		])
	})

	it('на неизвестный код отвечает пустым списком', () => {
		expect(findByCode('999')).toEqual([])
		expect(findByCode('')).toEqual([])
	})
})

describe('findByRegion', () => {
	it('ищет по подстроке без учёта регистра', () => {
		expect(findByRegion('татарст')[0].codes).toContain('16')
		expect(findByRegion('МОСКВА').length).toBeGreaterThan(0)
	})

	it('на пустой запрос ничего не возвращает', () => {
		expect(findByRegion('  ')).toEqual([])
	})
})

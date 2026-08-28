import { describe, it, expect } from 'vitest'
import {
	birthdayNumber,
	digitSum,
	lifePathNumber,
	reduceNumber,
	LIFE_PATH_MEANINGS
} from '@/lib/utils/numerology'

describe('digitSum', () => {
	it('складывает цифры', () => {
		expect(digitSum(1993)).toBe(22)
		expect(digitSum(7)).toBe(7)
	})
})

describe('reduceNumber', () => {
	it('сворачивает до одной цифры', () => {
		expect(reduceNumber(28)).toBe(1)
		expect(reduceNumber(19)).toBe(1)
	})

	it('останавливается на мастер-числах', () => {
		expect(reduceNumber(11)).toBe(11)
		expect(reduceNumber(22)).toBe(22)
		expect(reduceNumber(33)).toBe(33)
	})

	it('сворачивает до мастер-числа, а не сквозь него', () => {
		// 29 → 11, дальше свёртка остановлена
		expect(reduceNumber(29)).toBe(11)
	})
})

describe('lifePathNumber', () => {
	it('считает число жизненного пути', () => {
		// 15.04.1990 → 6 + 4 + 19 = 29 → 11
		expect(lifePathNumber(15, 4, 1990)).toBe(11)
	})

	it('даёт однозначный результат для обычных дат', () => {
		// 01.01.2000 → 1 + 1 + 2 = 4
		expect(lifePathNumber(1, 1, 2000)).toBe(4)
	})

	it('всегда попадает в таблицу трактовок', () => {
		for (let year = 1950; year <= 2026; year += 7) {
			for (let month = 1; month <= 12; month++) {
				const value = lifePathNumber(28, month, year)
				expect(LIFE_PATH_MEANINGS[value]).toBeDefined()
			}
		}
	})
})

describe('birthdayNumber', () => {
	it('сворачивает день рождения', () => {
		expect(birthdayNumber(29)).toBe(11)
		expect(birthdayNumber(7)).toBe(7)
		expect(birthdayNumber(31)).toBe(4)
	})
})

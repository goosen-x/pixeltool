import { describe, it, expect } from 'vitest'
import { checkInn, regionByInnCode } from '@/lib/utils/inn'

describe('checkInn', () => {
	it('принимает ИНН организации из десяти цифр', () => {
		// Сбербанк — номер публичный и часто встречается в реквизитах.
		const result = checkInn('7707083893')
		expect(result.valid).toBe(true)
		expect(result.kind).toBe('legal')
		expect(result.problem).toBeNull()
	})

	it('принимает ИНН человека из двенадцати цифр', () => {
		expect(checkInn('500100732259').valid).toBe(true)
		expect(checkInn('500100732259').kind).toBe('person')
	})

	it('ловит опечатку в контрольной цифре', () => {
		const result = checkInn('7707083894')
		expect(result.valid).toBe(false)
		expect(result.problem).toMatch(/опечатка/)
	})

	it('ловит неверную длину', () => {
		expect(checkInn('12345').problem).toMatch(/10 или 12 цифр/)
		expect(checkInn('12345').valid).toBe(false)
	})

	it('не спотыкается о пробелы и дефисы в наборе', () => {
		expect(checkInn('7707 083 893').valid).toBe(true)
		expect(checkInn('77-07-083-893').digits).toBe('7707083893')
	})

	it('просит ввести номер, когда цифр нет вовсе', () => {
		expect(checkInn('  ').problem).toMatch(/Введите ИНН/)
	})

	it('определяет регион по первым двум цифрам', () => {
		expect(checkInn('7707083893').region).toBe('Москва')
		expect(regionByInnCode('50')).toMatch(/Московская/)
	})
})

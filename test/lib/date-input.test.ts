import { describe, it, expect } from 'vitest'
import { formatIsoToRu, parseRuDateToIso } from '@/lib/utils/date-input'

describe('formatIsoToRu', () => {
	it('форматирует ISO-дату в ДД.ММ.ГГГГ', () => {
		expect(formatIsoToRu('1992-04-08')).toBe('08.04.1992')
	})

	it('пустая строка даёт пустую строку', () => {
		expect(formatIsoToRu('')).toBe('')
	})
})

describe('parseRuDateToIso', () => {
	it('парсит полную дату ДД.ММ.ГГГГ', () => {
		expect(parseRuDateToIso('08.04.1992')).toBe('1992-04-08')
	})

	it('парсит дату без ведущих нулей', () => {
		expect(parseRuDateToIso('8.4.1992')).toBe('1992-04-08')
	})

	it('отклоняет несуществующую дату (31 февраля)', () => {
		expect(parseRuDateToIso('31.02.2024')).toBeNull()
	})

	it('принимает 29 февраля високосного года', () => {
		expect(parseRuDateToIso('29.02.2024')).toBe('2024-02-29')
	})

	it('отклоняет 29 февраля невисокосного года', () => {
		expect(parseRuDateToIso('29.02.2023')).toBeNull()
	})

	it('отклоняет неполный ввод', () => {
		expect(parseRuDateToIso('08.04')).toBeNull()
	})

	it('отклоняет мусор', () => {
		expect(parseRuDateToIso('не дата')).toBeNull()
	})

	it('пустая строка даёт null', () => {
		expect(parseRuDateToIso('')).toBeNull()
	})

	it('отклоняет год из двух цифр', () => {
		expect(parseRuDateToIso('08.04.92')).toBeNull()
	})
})

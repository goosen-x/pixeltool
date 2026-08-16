import { describe, it, expect } from 'vitest'
import { formatBytes, percentSaved } from '@/lib/utils/format-bytes'

describe('formatBytes', () => {
	it('ноль байт', () => {
		expect(formatBytes(0)).toBe('0 Б')
	})

	it('байты без дробной части', () => {
		expect(formatBytes(512)).toBe('512 Б')
	})

	it('килобайты', () => {
		expect(formatBytes(1536)).toBe('1.5 КБ')
	})

	it('мегабайты', () => {
		expect(formatBytes(5 * 1024 * 1024)).toBe('5 МБ')
	})

	it('гигабайты', () => {
		expect(formatBytes(2.5 * 1024 * 1024 * 1024)).toBe('2.5 ГБ')
	})
})

describe('percentSaved', () => {
	it('половина размера — 50% экономии', () => {
		expect(percentSaved(1000, 500)).toBe(50)
	})

	it('размер не изменился — 0%', () => {
		expect(percentSaved(1000, 1000)).toBe(0)
	})

	it('файл стал больше — отрицательный процент', () => {
		expect(percentSaved(1000, 1200)).toBe(-20)
	})

	it('исходный размер 0 — 0%, а не деление на ноль', () => {
		expect(percentSaved(0, 500)).toBe(0)
	})
})

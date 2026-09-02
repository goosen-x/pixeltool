import { describe, it, expect } from 'vitest'
import {
	isBackgroundPixel,
	DEFAULT_BACKGROUND_THRESHOLD as T
} from '@/lib/tools/signature-image'
import { normalizeRotation } from '@/lib/tools/pdf-sign'

describe('isBackgroundPixel', () => {
	it('чистый белый — фон', () => {
		expect(isBackgroundPixel(255, 255, 255, T)).toBe(true)
	})

	it('серая бумага скана — тоже фон', () => {
		expect(isBackgroundPixel(240, 238, 236, T)).toBe(true)
	})

	it('чёрный штрих подписи — не фон', () => {
		expect(isBackgroundPixel(20, 20, 20, T)).toBe(false)
	})

	it('серый полутон штриха — не фон', () => {
		expect(isBackgroundPixel(180, 180, 180, T)).toBe(false)
	})

	it('синяя печать не уходит в фон', () => {
		// Насыщенная краска оттиска — тёмная, отсекается уже по яркости
		expect(isBackgroundPixel(60, 80, 180, T)).toBe(false)
	})

	it('светлая, но выраженно цветная точка оттиска остаётся', () => {
		// Разброс каналов 45 — это краска, а не бумага
		expect(isBackgroundPixel(210, 225, 255, T)).toBe(false)
	})

	it('еле различимая кромка оттиска уходит в фон вместе с бумагой', () => {
		// Разброс 20 при почти белой яркости неотличим от желтизны бумаги.
		// Это осознанный размен: такие точки — сглаживание по краю штриха,
		// и потерять их менее заметно, чем оставить жёлтую рамку вокруг
		// подписи на каждом скане.
		expect(isBackgroundPixel(235, 240, 255, T)).toBe(true)
	})

	it('жёлтая бумага остаётся фоном, пока она почти серая', () => {
		expect(isBackgroundPixel(252, 250, 240, T)).toBe(true)
	})

	it('точно на пороге считается фоном', () => {
		expect(isBackgroundPixel(T, T, T, T)).toBe(true)
	})

	it('на единицу темнее порога — уже не фон', () => {
		expect(isBackgroundPixel(T - 1, T, T, T)).toBe(false)
	})
})

describe('normalizeRotation', () => {
	it('обычные значения проходят как есть', () => {
		expect(normalizeRotation(0)).toBe(0)
		expect(normalizeRotation(90)).toBe(90)
		expect(normalizeRotation(180)).toBe(180)
		expect(normalizeRotation(270)).toBe(270)
	})

	it('отрицательный угол приводится к положительному', () => {
		expect(normalizeRotation(-90)).toBe(270)
		expect(normalizeRotation(-270)).toBe(90)
	})

	it('полный оборот и больше схлопывается', () => {
		expect(normalizeRotation(360)).toBe(0)
		expect(normalizeRotation(450)).toBe(90)
	})

	it('угол не кратный четверти округляется к ближайшей', () => {
		expect(normalizeRotation(89)).toBe(90)
		expect(normalizeRotation(1)).toBe(0)
	})
})

import { describe, expect, it } from 'vitest'
import {
	calculateWallpaper,
	openingPieces,
	stripConsumption,
	type WallpaperInput,
	type WallpaperResult
} from '@/lib/wallpaper-calculator'

const base: WallpaperInput = {
	perimeter: 14,
	height: 2.7,
	rollWidth: 1.06,
	rollLength: 10.05,
	rapport: 0,
	match: 'none',
	trim: 0.1,
	openings: []
}

function calc(patch: Partial<WallpaperInput>): WallpaperResult {
	const result = calculateWallpaper({ ...base, ...patch })
	if (typeof result === 'string') throw new Error(result)
	return result
}

describe('калькулятор обоев', () => {
	it('сходится с примером Лайфхакера: 27 узких полос по 3 из рулона', () => {
		// lifehacker.ru/skolko-nuzhno-oboev: периметр 14 м, высота 2,75 м,
		// рулон 0,53 × 10 м, без подгонки: 14 / 0,53 = 26,4 → 27 полос,
		// 10 / 2,75 = 3,6 → 3 полосы из рулона. Значит, 9 рулонов.
		const r = calc({
			perimeter: 14,
			height: 2.75,
			rollWidth: 0.53,
			rollLength: 10,
			trim: 0
		})
		expect(r.fullStrips).toBe(27)
		expect(r.stripsPerRoll).toBe(3)
		expect(r.rolls).toBe(9)
	})

	it('широкие обои того же примера: 14 полос, 5 рулонов', () => {
		const r = calc({ height: 2.75, rollLength: 10, trim: 0 })
		expect(r.fullStrips).toBe(14)
		expect(r.rolls).toBe(5)
	})

	it('прямая стыковка округляет полосу до целых раппортов', () => {
		expect(stripConsumption(2.8, 0.64, 'straight')).toBeCloseTo(3.2, 9)
		expect(stripConsumption(2.8, 0.64, 'none')).toBe(2.8)
		// ровно кратная высота не добавляет лишний раппорт
		expect(stripConsumption(2.56, 0.64, 'straight')).toBeCloseTo(2.56, 9)
	})

	it('раппорт уменьшает число полос из рулона', () => {
		const plain = calc({})
		const straight = calc({ rapport: 0.64, match: 'straight' })
		expect(plain.stripsPerRoll).toBe(3) // 2,8 × 3 = 8,4
		expect(straight.stripsPerRoll).toBe(3) // 0..2,8, 3,2..6,0, 6,4..9,2
		const big = calc({ rapport: 0.53, match: 'straight', height: 2.5 })
		// 2,6 м с запасом → 5 раппортов по 0,53 = 2,65 м на полосу
		expect(big.stripConsumption).toBeCloseTo(2.65, 9)
		expect(big.stripsPerRoll).toBe(3)
		expect(calc({ height: 2.5 }).stripsPerRoll).toBe(3)
	})

	it('смещённая стыковка чередует начало полос через полраппорта', () => {
		// h = 3, R = 1, рулон 10 м: 0–3, 3,5–6,5, 7–10 → 3 полосы
		const s = calc({
			height: 3,
			trim: 0,
			rollLength: 10,
			rapport: 1,
			match: 'offset'
		})
		expect(s.stripsPerRoll).toBe(3)
		const r = calc({
			height: 2.2,
			trim: 0,
			rollLength: 10,
			rapport: 1,
			match: 'offset'
		})
		// 0–2,2, 2,5–4,7, 5–7,2, 7,5–9,7 → 4 полосы
		expect(r.stripsPerRoll).toBe(4)
		const st = calc({
			height: 2.2,
			trim: 0,
			rollLength: 10,
			rapport: 1,
			match: 'straight'
		})
		// 0–2,2, 3–5,2, 6–8,2 → 3 полосы
		expect(st.stripsPerRoll).toBe(3)
	})

	it('проём забирает полосы с учётом худшего положения стыка', () => {
		// дверь 0,9 м: на метровых и на узких обоях стык может прийтись на
		// середину проёма, и целиком внутрь не попадает ни одна полоса
		for (const rollWidth of [1.06, 0.53]) {
			const door = openingPieces({
				height: 2.7,
				rollWidth,
				openings: [{ kind: 'door', width: 0.9, height: 2 }]
			})
			expect(door.removedStrips).toBe(0)
		}
		// дверь 1,2 м на узких: 1,2 / 0,53 = 2,26, гарантированно одна полоса
		const wide = openingPieces({
			height: 2.7,
			rollWidth: 0.53,
			openings: [{ kind: 'door', width: 1.2, height: 2 }]
		})
		expect(wide.removedStrips).toBe(1)
		expect(wide.pieces).toHaveLength(1)
		expect(wide.pieces[0]).toBeCloseTo(0.7, 9)
		// ровно две ширины рулона: при стыке не у края целиком войдёт одна
		const exact = openingPieces({
			height: 2.7,
			rollWidth: 1.06,
			openings: [{ kind: 'window', width: 2.12, height: 1.5, sill: 0.8 }]
		})
		expect(exact.removedStrips).toBe(1)
	})

	it('окно даёт кусок под подоконником и над окном', () => {
		const { pieces } = openingPieces({
			height: 2.7,
			rollWidth: 0.53,
			openings: [{ kind: 'window', width: 1.5, height: 1.4, sill: 0.8 }]
		})
		expect(pieces).toHaveLength(2) // 1 полоса × (под + над)
		expect(pieces[0]).toBeCloseTo(0.8, 9)
		expect(pieces[1]).toBeCloseTo(0.5, 9)
	})

	it('короткие куски режутся из остатков, а не из новых рулонов', () => {
		const r = calc({
			rollWidth: 0.53,
			openings: [
				{ kind: 'window', width: 1.5, height: 1.4, sill: 0.8 },
				{ kind: 'door', width: 0.9, height: 2 }
			]
		})
		// 27 полос минус 1 под окно = 26 по 2,8 м, по 3 из рулона → 9 рулонов
		// (в последнем 2 полосы), куски 0,9 и 0,6 ложатся в остатки
		expect(r.fullStrips).toBe(26)
		expect(r.shortPieces).toBe(2)
		expect(r.rolls).toBe(9)
		expect(r.wallArea).toBeCloseTo(14 * 2.7 - 1.5 * 1.4 - 0.9 * 2, 9)
	})

	it('короткому куску без места в остатках нужен новый рулон', () => {
		// 4 полосы по 0,53, окно 1,06 м забирает одну: 3 полосы по 3,25 м
		// в рулон 10 м, остаток 0,25 м. Куски под окном 1 м и над ним 1,25 м
		// туда не влезают, нужен второй рулон
		const r = calc({
			rollWidth: 0.53,
			height: 3.25,
			trim: 0,
			rollLength: 10,
			perimeter: 4 * 0.53,
			openings: [{ kind: 'window', width: 1.06, height: 1, sill: 1 }]
		})
		expect(r.fullStrips).toBe(3)
		expect(r.shortPieces).toBe(2)
		expect(r.rolls).toBe(2)
	})

	it('проёмы экономят рулоны на широких окнах', () => {
		const r = calc({
			rollWidth: 0.53,
			openings: [
				{ kind: 'window', width: 2.2, height: 1.5, sill: 0.8 },
				{ kind: 'window', width: 2.2, height: 1.5, sill: 0.8 }
			]
		})
		expect(r.rolls).toBeLessThan(r.rollsWithoutOpenings)
	})

	it('ошибки: полоса длиннее рулона и раппорт больше рулона', () => {
		expect(calculateWallpaper({ ...base, height: 11 })).toBe('strip-too-long')
		expect(
			calculateWallpaper({ ...base, rapport: 12, match: 'straight' })
		).toBe('rapport-too-long')
		expect(
			calculateWallpaper({
				...base,
				height: 9.9,
				trim: 0,
				rapport: 1,
				match: 'offset'
			})
		).toBe('strip-too-long')
	})

	it('без подбора раппорт игнорируется', () => {
		expect(calc({ rapport: 0.64, match: 'none' }).rolls).toBe(calc({}).rolls)
	})

	it('метровые обои 1,06 × 25 м', () => {
		const r = calc({ rollLength: 25 })
		// 25 / 2,8 = 8 полос, 14 полос → 2 рулона
		expect(r.stripsPerRoll).toBe(8)
		expect(r.rolls).toBe(2)
	})
})

import { describe, expect, it } from 'vitest'
import {
	calculateLaminate,
	EXPANSION_GAP,
	layoutLaminate,
	MIN_PIECE,
	type LaminateInput
} from '@/lib/laminate'

const room: LaminateInput = {
	roomLength: 4,
	roomWidth: 3,
	boardLength: 1380,
	boardWidth: 193,
	boardsPerPack: 8,
	offset: 'free',
	doorWidth: 0.8
}

const laidLength = room.roomLength - 2 * EXPANSION_GAP

describe('раскладка ламината', () => {
	it('каждый ряд закрывает длину комнаты без зазоров и нахлёстов', () => {
		for (const offset of ['free', 'half', 'third'] as const) {
			const { rows } = layoutLaminate({ ...room, offset })
			for (const row of rows) {
				const sum = row.pieces.reduce((a, p) => a + p.length, 0)
				expect(sum).toBeCloseTo(laidLength, 6)
			}
		}
	})

	it('рядов столько, чтобы закрыть ширину; последний распилен вдоль', () => {
		const { rows } = layoutLaminate(room)
		expect(rows).toHaveLength(Math.ceil((3 - 2 * EXPANSION_GAP) / 0.193))
		expect(rows.at(-1)!.width).toBeLessThan(0.193)
	})

	it('кусков короче 30 см в рядах нет', () => {
		for (const offset of ['free', 'half', 'third'] as const) {
			const { rows } = layoutLaminate({ ...room, offset })
			for (const p of rows.flatMap(r => r.pieces))
				expect(p.length).toBeGreaterThanOrEqual(MIN_PIECE - 1e-9)
		}
	})

	it('стыки соседних рядов расходятся хотя бы на 30 см', () => {
		for (const roomLength of [3, 4, 4.5, 5.2, 6.8]) {
			for (const offset of ['free', 'half', 'third'] as const) {
				const { rows } = layoutLaminate({ ...room, roomLength, offset })
				for (let i = 1; i < rows.length; i++) {
					const prev = rows[i - 1].pieces.slice(1).map(p => p.x)
					const cur = rows[i].pieces.slice(1).map(p => p.x)
					for (const j of cur)
						for (const q of prev)
							expect(Math.abs(j - q)).toBeGreaterThanOrEqual(MIN_PIECE - 1e-6)
				}
			}
		}
	})

	it('смещение 1/2 чередует целую доску и половину в начале ряда', () => {
		const { rows } = layoutLaminate({ ...room, offset: 'half' })
		expect(rows[0].pieces[0].length).toBeCloseTo(1.38)
		expect(rows[1].pieces[0].length).toBeCloseTo(0.69)
		expect(rows[2].pieces[0].length).toBeCloseTo(1.38)
	})

	it('досок не меньше, чем по площади, и обрезки идут в дело', () => {
		const r = calculateLaminate(room)
		const byArea = Math.ceil(
			(laidLength * (3 - 2 * EXPANSION_GAP)) / (1.38 * 0.193)
		)
		expect(r.boards).toBeGreaterThanOrEqual(byArea)
		// свободное смещение экономнее «площадь + 10%»
		expect(r.boards).toBeLessThanOrEqual(Math.ceil(byArea * 1.1))
	})

	it('свободное смещение тратит не больше досок, чем 1/2 и 1/3', () => {
		const free = calculateLaminate(room).boards
		expect(free).toBeLessThanOrEqual(
			calculateLaminate({ ...room, offset: 'half' }).boards
		)
		expect(free).toBeLessThanOrEqual(
			calculateLaminate({ ...room, offset: 'third' }).boards
		)
	})

	it('упаковки округляются вверх, остаток досок показан', () => {
		const r = calculateLaminate(room)
		expect(r.packs).toBe(Math.ceil(r.boards / 8))
		expect(r.spareBoards).toBe(r.packs * 8 - r.boards)
		expect(r.packArea).toBeCloseTo(1.38 * 0.193 * 8)
	})

	it('комната короче доски: ряд из одного куска', () => {
		const { rows } = layoutLaminate({ ...room, roomLength: 1, roomWidth: 1 })
		for (const row of rows) expect(row.pieces).toHaveLength(1)
	})
})

describe('плинтус', () => {
	it('периметр без двери и планки по 2,5 м', () => {
		const r = calculateLaminate(room)
		expect(r.plinthLength).toBeCloseTo(13.2)
		expect(r.plinthPieces).toBeGreaterThanOrEqual(Math.ceil(13.2 / 2.5))
		expect(r.plinthPieces).toBeLessThanOrEqual(Math.ceil(13.2 / 2.5) + 2)
	})
})

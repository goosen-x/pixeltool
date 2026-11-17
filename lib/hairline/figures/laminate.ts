/**
 * Схема раскладки ламината: пол комнаты сверху, ряды досок со стыками ровно
 * по той раскладке, по которой считается результат (lib/laminate.ts).
 * Одна целая доска обведена и подписана размером.
 */
import {
	layoutLaminate,
	EXPANSION_GAP,
	type LaminateOffset
} from '@/lib/laminate'
import {
	box,
	dimensions,
	poly,
	seg,
	type DimSpec,
	type FigureDef,
	type Op,
	type Pt,
	type V3
} from '@/lib/hairline/scene-kit'

const AZ = 32
const K = 0.72
const G = 0.12
const FLOOR = 0.015
/** Больше рядов на рисунке не различить: рисуем каждый n-й. */
const MAX_ROWS = 60

const meters = (n: number) =>
	`${n.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} м`

export function laminateFigure(offset: LaminateOffset): FigureDef {
	return {
		az: AZ,
		k: K,
		display: v => {
			const M = Math.max(v.roomLength, v.roomWidth)
			const L = Math.max(v.roomLength, M * 0.3) / M
			const W = Math.max(v.roomWidth, M * 0.3) / M
			return {
				roomLength: L,
				roomWidth: W,
				realLength: v.roomLength,
				realWidth: v.roomWidth,
				boardLength: v.boardLength,
				boardWidth: v.boardWidth
			}
		},
		build: (d, P, active) => {
			const Q = (v: V3): Pt => P(v[0], v[1], v[2])
			const L = d.roomLength
			const W = d.roomWidth
			// раскладка в настоящих метрах, на рисунок — масштабом по осям
			const sx = L / d.realLength
			const sy = W / d.realWidth
			const bl = Math.max(d.boardLength, 100)
			const bw = Math.max(d.boardWidth, 50)
			const { rows } = layoutLaminate({
				roomLength: d.realLength,
				roomWidth: d.realWidth,
				boardLength: bl,
				boardWidth: bw,
				boardsPerPack: 1,
				offset,
				doorWidth: 0
			})
			const g = EXPANSION_GAP
			const C = (x: number, y: number) => Q([(g + x) * sx, (g + y) * sy, FLOOR])

			const floor = box(Q, AZ, [0, 0, 0], [L, W, FLOOR], { hidden: false })
			const ops: Op[] = [...floor.ops]
			const step = Math.max(1, Math.ceil(rows.length / MAX_ROWS))
			const laidL = d.realLength - 2 * g
			// швы между рядами тусклее, стыки досок ярче: по ним видно смещение
			let rowLines = ''
			let joints = ''
			rows.forEach((row, i) => {
				if (i % step !== 0) return
				if (i > 0) rowLines += seg(C(0, row.y), C(laidL, row.y))
				const y1 = row.y + row.width * step
				for (const p of row.pieces.slice(1))
					joints += seg(
						C(p.x, row.y),
						C(p.x, Math.min(y1, d.realWidth - 2 * g))
					)
			})
			ops.push({ d: rowLines, cls: 'nf lo' }, { d: joints, cls: 'nf' })

			// одна целая доска обведена: по ней читается размер
			const boardOn = active === 'boardLength' || active === 'boardWidth'
			const row = rows.find(r => r.pieces.some(p => !p.cut)) ?? rows[0]
			const board = row?.pieces.find(p => !p.cut) ?? row?.pieces[0]
			const specs: DimSpec[] = [
				{
					key: 'roomLength',
					A: [0, W, 0],
					B: [L, W, 0],
					offA: [0, G * 1.4, 0],
					text: meters(d.realLength)
				},
				{
					key: 'roomWidth',
					A: [L, 0, 0],
					B: [L, W, 0],
					offA: [G, 0, 0],
					text: meters(d.realWidth)
				}
			]
			if (row && board) {
				const x0 = board.x
				const x1 = board.x + board.length
				const y0 = row.y
				const y1 = row.y + row.width
				ops.push({
					d: poly([C(x0, y0), C(x1, y0), C(x1, y1), C(x0, y1)]),
					cls: boardOn ? 'nf hi' : 'nf sil'
				})
				const w = (v: number) => g + v
				specs.push({
					key: 'boardLength',
					A: [w(x0) * sx, w(y0) * sy, FLOOR],
					B: [w(x1) * sx, w(y0) * sy, FLOOR],
					offA: [0, -G * 0.5, 0],
					text: `${Math.round(bl)}×${Math.round(bw)} мм`
				})
			}
			const dims = dimensions(Q, specs, active)
			return {
				ops: ops.concat(dims.ops),
				labels: dims.labels,
				hits: dims.hits,
				pts: floor.pts.concat(dims.pts)
			}
		}
	}
}

/**
 * Схемы калькуляторов раздела «Стройка» в стиле Hairline: заливка бетона,
 * пол в плитке, фундамент (лента, плита, столбы).
 *
 * Ключи совпадают с полями страниц. Рисунок держит пропорции, но тонкое не
 * вырождается в линию: плита 20 см на площадке 5 м остаётся видимой плитой.
 * Подписи — настоящие числа: display передаёт их отдельными ключами real*,
 * пружины заодно анимируют и их, поэтому число на выноске плавно доезжает.
 */
import {
	add,
	box,
	dimensions,
	mul,
	poly,
	revolve,
	rightVec,
	ring,
	seg,
	type DimSpec,
	type FigureDef,
	type Op,
	type Pt,
	type Scene,
	type V3
} from '@/lib/hairline/scene-kit'

const AZ = 32
const K = 0.5
const RIGHT = rightVec(AZ)
const G = 0.14
const O: V3 = [0, 0, 0]
const X: V3 = [1, 0, 0]
const Y: V3 = [0, 1, 0]

/** «10 м», «0,4 м»: до двух знаков, без хвостовых нулей. */
export const meters = (n: number) =>
	`${n.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} м`

function finish(
	Q: (v: V3) => Pt,
	ops: Op[],
	pts: Pt[],
	specs: DimSpec[],
	active: string | null
): Scene {
	const d = dimensions(Q, specs, active)
	return {
		ops: ops.concat(d.ops),
		labels: d.labels,
		hits: d.hits,
		pts: pts.concat(d.pts)
	}
}

const fig = (
	display: FigureDef['display'],
	build: (
		d: Record<string, number>,
		Q: (v: V3) => Pt,
		active: string | null
	) => Scene,
	k = K
): FigureDef => ({
	az: AZ,
	k,
	display,
	build: (d, P, active) => build(d, v => P(v[0], v[1], v[2]), active)
})

/**
 * Размеры к самому большому = 1. min — у каждого ключа своя нижняя граница
 * в долях максимума: толщина плиты может быть тоньше, чем стороны.
 */
function scaled(
	v: Record<string, number>,
	min: Record<string, number>
): { d: Record<string, number>; s: number } {
	const M = Math.max(...Object.keys(min).map(k => v[k]))
	const d: Record<string, number> = {}
	for (const k of Object.keys(min)) d[k] = Math.max(v[k], M * min[k]) / M
	return { d, s: 1 / M }
}

/** Бетон и плита фундамента: брусок длина × ширина × высота. */
function slabFigure(heightKey: string) {
	return fig(
		v => {
			const { d } = scaled(
				{ length: v.length, width: v.width, h: v[heightKey] },
				{ length: 0.3, width: 0.3, h: 0.08 }
			)
			return {
				length: d.length,
				width: d.width,
				[heightKey]: d.h,
				realLength: v.length,
				realWidth: v.width,
				realHeight: v[heightKey]
			}
		},
		(d, Q, active) => {
			const L = d.length
			const W = d.width
			const H = d[heightKey]
			const body = box(Q, AZ, O, [L, W, H])
			return finish(
				Q,
				body.ops,
				body.pts,
				[
					{
						key: 'length',
						A: [0, W, 0],
						B: [L, W, 0],
						offA: [0, G, 0],
						text: meters(d.realLength)
					},
					{
						key: 'width',
						A: [L, 0, 0],
						B: [L, W, 0],
						offA: [G, 0, 0],
						text: meters(d.realWidth)
					},
					{
						key: heightKey,
						A: [0, W, 0],
						B: [0, W, H],
						offA: mul(RIGHT, -G),
						text: meters(d.realHeight)
					}
				],
				active
			)
		}
	)
}

export const CONCRETE_FIGURE = slabFigure('height')
export const FOUNDATION_SLAB_FIGURE = slabFigure('thickness')

/* --------------------------------------------------------------- плитка */

/** Сколько линий сетки рисовать на сторону, не больше: дальше каша. */
const MAX_LINES = 40
const FLOOR = 0.02

export const TILE_FIGURE = fig(
	v => {
		const { d, s } = scaled(
			{ roomLength: v.roomLength, roomWidth: v.roomWidth },
			{ roomLength: 0.3, roomWidth: 0.3 }
		)
		// плитка и шов в тех же долях, что и комната
		const k = (d.roomLength / v.roomLength + d.roomWidth / v.roomWidth) / 2 || s
		return {
			roomLength: d.roomLength,
			roomWidth: d.roomWidth,
			tileLength: v.tileLength * k,
			tileWidth: v.tileWidth * k,
			joint: (v.joint ?? 0) * k,
			realLength: v.roomLength,
			realWidth: v.roomWidth,
			realTileLength: v.tileLength,
			realTileWidth: v.tileWidth
		}
	},
	(d, Q, active) => {
		const L = d.roomLength
		const W = d.roomWidth
		const px = Math.max(d.tileLength + d.joint, 1e-4)
		const py = Math.max(d.tileWidth + d.joint, 1e-4)
		const C = (x: number, y: number, z: number) => Q([x, y, z])
		const body = box(Q, AZ, O, [L, W, FLOOR], { hidden: false })
		const ops: Op[] = [...body.ops]

		// раскладка от ближнего левого угла, как обычно начинают от двери
		const stepX = Math.max(1, Math.ceil(L / px / MAX_LINES))
		const stepY = Math.max(1, Math.ceil(W / py / MAX_LINES))
		let grid = ''
		for (let i = stepX; i * px < L - 1e-6; i += stepX)
			grid += seg(C(i * px, 0, FLOOR), C(i * px, W, FLOOR))
		for (let j = stepY; j * py < W - 1e-6; j += stepY)
			grid += seg(C(0, W - j * py, FLOOR), C(L, W - j * py, FLOOR))
		ops.push({ d: grid, cls: 'nf lo' })

		// одна плитка в углу обведена: по ней читается размер
		const tx = Math.min(d.tileLength, L)
		const ty = Math.min(d.tileWidth, W)
		const tileOn = active === 'tileLength' || active === 'tileWidth'
		ops.push({
			d: poly([
				C(0, W, FLOOR),
				C(tx, W, FLOOR),
				C(tx, W - ty, FLOOR),
				C(0, W - ty, FLOOR)
			]),
			cls: tileOn ? 'nf hi' : 'nf sil'
		})

		const tileText = `${Math.round(d.realTileLength * 100)}×${Math.round(d.realTileWidth * 100)} см`
		return finish(
			Q,
			ops,
			body.pts,
			[
				{
					key: 'roomLength',
					A: [0, W, 0],
					B: [L, W, 0],
					offA: [0, G * 1.6, 0],
					text: meters(d.realLength)
				},
				{
					key: 'roomWidth',
					A: [L, 0, 0],
					B: [L, W, 0],
					offA: [G, 0, 0],
					text: meters(d.realWidth)
				},
				{
					key: 'tileLength',
					A: [0, W, FLOOR],
					B: [tx, W, FLOOR],
					offA: [0, G * 0.55, 0],
					text: tileText
				}
			],
			active
		)
	},
	// пол смотрим выше, чтобы сетка плиток читалась
	0.72
)

/* ------------------------------------------------------------ фундамент */

/** Ленточный: лента по периметру дома, внутри видны стенки ленты. */
export const FOUNDATION_STRIP_FIGURE = fig(
	v => {
		const { d } = scaled(
			{ length: v.length, width: v.width },
			{ length: 0.3, width: 0.3 }
		)
		const M = Math.max(v.length, v.width)
		// лента и высота в тех же долях, но тонкая лента остаётся видимой
		const t = Math.min(
			Math.max(v.thickness / M, 0.045),
			Math.min(d.length, d.width) / 4
		)
		const h = Math.max(v.height / M, 0.1)
		return {
			length: d.length,
			width: d.width,
			thickness: t,
			height: h,
			inner: v.innerWalls > 1e-6 ? 1 : 0,
			realLength: v.length,
			realWidth: v.width,
			realThickness: v.thickness,
			realHeight: v.height
		}
	},
	(d, Q, active) => {
		const L = d.length
		const W = d.width
		const t = d.thickness
		const h = d.height
		const C = (x: number, y: number, z: number) => Q([x, y, z])
		const outer = box(Q, AZ, O, [L, W, h], { hidden: false })
		const hole = poly([
			C(t, t, h),
			C(L - t, t, h),
			C(L - t, W - t, h),
			C(t, W - t, h)
		])
		const ops: Op[] = [
			...outer.ops.slice(0, 2),
			// верх ленты — рамка: внешний контур и отверстие
			{
				d: poly([C(0, 0, h), C(L, 0, h), C(L, W, h), C(0, W, h)]) + hole,
				cls: 'sil',
				rule: 'evenodd'
			},
			// в отверстии видны внутренние стенки дальних сторон ленты
			{
				d: poly([C(t, t, 0), C(t, W - t, 0), C(t, W - t, h), C(t, t, h)]),
				cls: 'sil',
				clip: hole
			},
			{
				d: poly([C(t, t, 0), C(L - t, t, 0), C(L - t, t, h), C(t, t, h)]),
				cls: 'sil',
				clip: hole
			}
		]
		// внутренняя стена схематично: одна поперечная лента посередине
		if (d.inner > 0.5) {
			const x0 = L / 2 - t / 2
			const x1 = L / 2 + t / 2
			const wall = box(Q, AZ, [x0, t, 0], [x1, W - t, h], { hidden: false })
			for (const o of wall.ops) ops.push({ ...o, clip: hole })
			ops.push({
				d: poly([C(x0, t, h), C(x1, t, h), C(x1, W - t, h), C(x0, W - t, h)]),
				cls: 'sil'
			})
		}
		return finish(
			Q,
			ops,
			outer.pts,
			[
				{
					key: 'length',
					A: [0, W, 0],
					B: [L, W, 0],
					offA: [0, G, 0],
					text: meters(d.realLength)
				},
				{
					key: 'width',
					A: [L, 0, 0],
					B: [L, W, 0],
					offA: [G, 0, 0],
					text: meters(d.realWidth)
				},
				{
					key: 'height',
					A: [0, W, 0],
					B: [0, W, h],
					offA: mul(RIGHT, -G),
					text: meters(d.realHeight)
				},
				{
					key: 'thickness',
					A: [0, 0, h],
					B: [t, 0, h],
					offA: [0, 0, G * 0.9],
					text: meters(d.realThickness)
				}
			],
			active
		)
	}
)

/** На рисунке столбов не больше: дальше они сливаются. */
const MAX_PILES = 16

/** Столбчатый: столбы по периметру прямоугольника 4:3, контур ростверка пунктиром. */
export const FOUNDATION_PILES_FIGURE = fig(
	v => {
		const ratio = Math.max(v.pileDiameter / v.height, 1 / 5)
		return {
			// диаметр к глубине, но не тоньше пятой части
			pileDiameter: Math.min(ratio, 1),
			height: 1,
			pileCount: v.pileCount,
			realDiameter: v.pileDiameter,
			realHeight: v.height
		}
	},
	(d, Q, active) => {
		const n = Math.max(4, Math.min(Math.round(d.pileCount), MAX_PILES))
		const r = d.pileDiameter / 2
		const h = d.height
		// шаг между столбами в несколько диаметров, периметр 4:3
		const step = Math.max(r * 2 * 3, 0.5)
		const per = n * step
		const a = (per * 4) / 14
		const b = (per * 3) / 14
		const at = (s: number): [number, number] => {
			const u = ((s % per) + per) % per
			if (u < a) return [u, 0]
			if (u < a + b) return [a, u - a]
			if (u < 2 * a + b) return [a - (u - a - b), b]
			return [0, b - (u - 2 * a - b)]
		}
		const spots = Array.from({ length: n }, (_, i) => at(i * step))
		// дальние раньше: ближний столб закрывает дальний
		spots.sort((p, q) => p[0] + p[1] - (q[0] + q[1]))

		const C = (x: number, y: number, z: number) => Q([x, y, z])
		const ops: Op[] = [
			{
				d: poly([C(0, 0, h), C(a, 0, h), C(a, b, h), C(0, b, h)]),
				cls: 'nf dash'
			}
		]
		const pts: Pt[] = []
		for (const [x, y] of spots) {
			const pile = revolve(
				Q,
				ring([x, y, 0], X, Y, r, 40),
				ring([x, y, h], X, Y, r, 40)
			)
			ops.push(...pile.ops)
			pts.push(...pile.pts)
		}
		// диаметр у самого ближнего к зрителю столба, глубина у крайнего
		// левого: справа столбы стоят плотно и выноска цеплялась бы за них
		const [nx, ny] = spots[spots.length - 1]
		const c: V3 = [nx, ny, 0]
		const sx = (p: [number, number]) => p[0] * RIGHT[0] + p[1] * RIGHT[1]
		const [lx, ly] = spots.reduce((m, p) => (sx(p) < sx(m) ? p : m))
		const left: V3 = [lx, ly, 0]
		const many = Math.round(d.pileCount) > MAX_PILES
		return finish(
			Q,
			ops,
			pts,
			[
				{
					key: 'height',
					A: add(left, mul(RIGHT, -r)),
					B: add(left, add(mul(RIGHT, -r), [0, 0, h])),
					offA: mul(RIGHT, -G),
					text: meters(d.realHeight)
				},
				{
					key: 'pileDiameter',
					A: add(c, add(mul(RIGHT, -r), [0, 0, h])),
					B: add(c, add(mul(RIGHT, r), [0, 0, h])),
					offA: [0, 0, r + G * 0.6],
					text: `⌀ ${meters(d.realDiameter)}`
				},
				{
					key: 'pileCount',
					A: [0, b, 0],
					B: [a, b, 0],
					offA: [0, G * 1.4, 0],
					plain: true,
					text: many
						? `${Math.round(d.pileCount)} столбов, показано ${MAX_PILES}`
						: `${Math.round(d.pileCount)} столбов`
				}
			],
			active
		)
	}
)

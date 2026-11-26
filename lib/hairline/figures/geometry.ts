/**
 * Фигуры калькуляторов объёма и площади в стиле Hairline. Ключи размеров
 * совпадают с полями фигур в lib/constants/geometry-shapes.ts.
 *
 * Пропорции берутся из введённых размеров, но с ограничением: труба
 * 110 мм × 6 м в честном масштабе выродилась бы в линию. Поэтому любой
 * размер на рисунке не меньше трети самого большого, а подписи всегда
 * показывают настоящие числа.
 */
import {
	add,
	box,
	clamp,
	dimensions,
	dot,
	ellipseRatio,
	hull,
	mul,
	normalize,
	open,
	poly,
	revolve,
	rightVec,
	ring,
	cyclicRun,
	towardVec,
	viewVec,
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
const TOWARD = towardVec(AZ)
const ELL = ellipseRatio(K)
const G = 0.16
const O: V3 = [0, 0, 0]
const X: V3 = [1, 0, 0]
const Y: V3 = [0, 1, 0]
const Z: V3 = [0, 0, 1]

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

/* ---------------------------------------------------------------- объём */

const boxFigure = fig(
	v => normalize({ a: v.a, b: v.b, c: v.c }),
	({ a, b, c }, Q, active) => {
		const body = box(Q, AZ, O, [a, b, c])
		return finish(
			Q,
			body.ops,
			body.pts,
			[
				{ key: 'a', A: [0, b, 0], B: [a, b, 0], offA: [0, G, 0] },
				{ key: 'b', A: [a, 0, 0], B: [a, b, 0], offA: [G, 0, 0] },
				{ key: 'c', A: [0, b, 0], B: [0, b, c], offA: mul(RIGHT, -G) }
			],
			active
		)
	}
)

/** Цилиндр, конус и усечённый конус: тело вращения вокруг вертикали. */
function frustum(R1: number, R2: number, h: number, Q: (v: V3) => Pt) {
	return revolve(Q, ring(O, X, Y, R1), ring([0, 0, h], X, Y, R2))
}

const below = (R: number, ell = ELL): V3 => [0, 0, -(R * ell + G * 0.8)]
const above = (R: number): V3 => [0, 0, R * ELL + G * 0.8]
const across = (R: number, z: number): [V3, V3] => [
	add(mul(RIGHT, -R), [0, 0, z]),
	add(mul(RIGHT, R), [0, 0, z])
]
const heightDim = (R1: number, R2: number, h: number, key = 'h'): DimSpec => {
	const Rm = Math.max(R1, R2)
	return {
		key,
		A: mul(RIGHT, R1),
		B: add(mul(RIGHT, R2), [0, 0, h]),
		offA: mul(RIGHT, Rm - R1 + G),
		offB: mul(RIGHT, Rm - R2 + G)
	}
}

const cylinderFigure = (lengthKey = 'h') =>
	fig(
		v => {
			const n = normalize({ d: v.d, h: v[lengthKey] })
			return { d: n.d, [lengthKey]: n.h }
		},
		(d, Q, active) => {
			const R = d.d / 2
			const h = d[lengthKey]
			const r = frustum(R, R, h, Q)
			const [A, B] = across(R, h)
			return finish(
				Q,
				r.ops,
				r.pts,
				[heightDim(R, R, h, lengthKey), { key: 'd', A, B, offA: above(R) }],
				active
			)
		}
	)

const coneFigure = fig(
	v => normalize({ d: v.d, h: v.h }),
	({ d, h }, Q, active) => {
		const R = d / 2
		const r = frustum(R, 0, h, Q)
		const [A, B] = across(R, 0)
		return finish(
			Q,
			r.ops,
			r.pts,
			[heightDim(R, 0, h), { key: 'd', A, B, offA: below(R) }],
			active
		)
	}
)

const truncatedConeFigure = fig(
	v => normalize({ D: v.D, d: v.d, h: v.h }),
	({ D, d, h }, Q, active) => {
		const R1 = D / 2
		const R2 = d / 2
		const r = frustum(R1, R2, h, Q)
		const [A1, B1] = across(R1, 0)
		const [A2, B2] = across(R2, h)
		return finish(
			Q,
			r.ops,
			r.pts,
			[
				heightDim(R1, R2, h),
				{ key: 'D', A: A1, B: B1, offA: below(R1) },
				{ key: 'd', A: A2, B: B2, offA: above(R2) }
			],
			active
		)
	}
)

const pipeFigure = fig(
	v => {
		const M = Math.max(v.D, v.h)
		const D = Math.max(v.D, M / 3.2)
		const h = Math.max(v.h, M / 3.2)
		// стенка всегда видна, но и не толще трети радиуса
		const ratio = clamp(v.d / v.D, 0.3, 0.8)
		const top = Math.max(D, h)
		return { D: D / top, d: (D * ratio) / top, h: h / top }
	},
	({ D, d, h: L }, Q, active) => {
		const R = D / 2
		const r = d / 2
		const rv = revolve(Q, ring(O, Y, Z, R), ring([L, 0, 0], Y, Z, R), 'nf sil')
		const innerNear = ring([L, 0, 0], Y, Z, r).map(Q)
		const innerFar = ring(O, Y, Z, r).map(Q)
		const ops: Op[] = [
			rv.ops[0],
			// торец — кольцо: внешний и внутренний круг, середина пустая
			{ d: poly(rv.nearP) + poly(innerNear), cls: 'sil', rule: 'evenodd' },
			// в отверстии видна внутренняя стенка до дальнего конца
			{
				d: poly(hull(innerNear.concat(innerFar))),
				cls: 'nf lo',
				clip: poly(innerNear)
			},
			...rv.ops.slice(2)
		]
		// D выносится влево у дальнего торца, d вправо у ближнего:
		// на трубе они почти равны, рядом подписи налезали бы друг на друга
		return finish(
			Q,
			ops,
			rv.pts,
			[
				{
					key: 'h',
					A: [0, 0, -R],
					B: [L, 0, -R],
					offA: [0, 0, -(R * 0.12 + G)]
				},
				{ key: 'd', A: [L, 0, -r], B: [L, 0, r], offA: [G * 0.8, 0, 0] },
				{ key: 'D', A: [0, 0, -R], B: [0, 0, R], offA: [-G * 0.8, 0, 0] }
			],
			active
		)
	}
)

const sphereFigure = fig(
	() => ({ d: 1 }),
	({ d }, Q, active) => {
		const R = d / 2
		const c: V3 = [0, 0, R]
		const V = viewVec(AZ, K)
		// контур шара — окружность в плоскости, перпендикулярной взгляду
		const w: V3 = [
			V[1] * RIGHT[2] - V[2] * RIGHT[1],
			V[2] * RIGHT[0] - V[0] * RIGHT[2],
			V[0] * RIGHT[1] - V[1] * RIGHT[0]
		]
		const outline = ring(c, RIGHT, w, R, 96).map(Q)
		const eq = ring(c, X, Y, R, 96)
		const eqP = eq.map(Q)
		const front = (i: number) => dot(add(eq[i], mul(c, -1)), V) >= 0
		const ops: Op[] = [
			{ d: poly(outline), cls: 'sil' },
			{ d: open(cyclicRun(eqP, front)), cls: 'nf lo' },
			{ d: open(cyclicRun(eqP, i => !front(i))), cls: 'nf dash' }
		]
		const [A, B] = [add(c, mul(RIGHT, -R)), add(c, mul(RIGHT, R))]
		return finish(
			Q,
			ops,
			outline,
			[{ key: 'd', A, B, offA: O, labelDir: Z }],
			active
		)
	}
)

/* ------------------------------------------------------------- площадь */

/** Плоская фигура лежит на земле тонкой пластиной: виден торец, площадь — верх. */
const SLAB = 0.035
/** Плоское смотрим почти сверху: при виде сбоку трапеция читалась как параллелограмм. */
const FLAT_K = 0.8
const FLAT = FLAT_K

/** Пластина по контуру на земле: верх, видимые боковые грани, пунктир дальних. */
function slab(
	Q: (v: V3) => Pt,
	outline: Array<[number, number]>,
	holes: Array<Array<[number, number]>> = []
) {
	const top = (pts: Array<[number, number]>) =>
		pts.map(([x, y]) => Q([x, y, SLAB]))
	const bot = (pts: Array<[number, number]>) =>
		pts.map(([x, y]) => Q([x, y, 0]))
	const topP = top(outline)
	const botP = bot(outline)
	const ops: Op[] = [{ d: poly(hull(topP.concat(botP))), cls: 'sil' }]
	let d = poly(topP)
	for (const h of holes) d += poly(top(h))
	ops.push({ d, cls: 'sil', rule: holes.length ? 'evenodd' : undefined })
	// у отверстия видна внутренняя стенка
	for (const h of holes) {
		const ht = top(h)
		ops.push({ d: poly(hull(ht.concat(bot(h)))), cls: 'nf lo', clip: poly(ht) })
	}
	return { ops, pts: topP.concat(botP) }
}

const rectangleFigure = fig(
	v => normalize({ a: v.a, b: v.b }),
	({ a, b }, Q, active) => {
		const s = slab(Q, [
			[0, 0],
			[a, 0],
			[a, b],
			[0, b]
		])
		return finish(
			Q,
			s.ops,
			s.pts,
			[
				{ key: 'a', A: [0, b, 0], B: [a, b, 0], offA: [0, G, 0] },
				{ key: 'b', A: [a, 0, 0], B: [a, b, 0], offA: [G, 0, 0] }
			],
			active
		)
	},
	FLAT
)

const circlePts = (R: number, n = 72): Array<[number, number]> =>
	Array.from({ length: n }, (_, i) => {
		const t = (i / n) * Math.PI * 2
		return [R * Math.cos(t), R * Math.sin(t)]
	})

const circleFigure = fig(
	() => ({ d: 1 }),
	({ d }, Q, active) => {
		const R = d / 2
		const s = slab(Q, circlePts(R))
		const [A, B] = across(R, SLAB)
		return finish(
			Q,
			s.ops,
			s.pts,
			[{ key: 'd', A, B, offA: O, labelDir: TOWARD }],
			active
		)
	},
	FLAT
)

const ringFigure = fig(
	v => {
		const ratio = clamp(v.d / v.D, 0.2, 0.85)
		return { D: 1, d: ratio }
	},
	({ D, d }, Q, active) => {
		const R = D / 2
		const r = d / 2
		const s = slab(Q, circlePts(R), [circlePts(r)])
		const [A1, B1] = across(R, SLAB)
		const [A2, B2] = across(r, SLAB)
		return finish(
			Q,
			s.ops,
			s.pts,
			[
				{ key: 'D', A: A1, B: B1, offA: below(R, ellipseRatio(FLAT_K)) },
				{ key: 'd', A: A2, B: B2, offA: O, labelDir: Z }
			],
			active
		)
	},
	FLAT
)

/** Треугольник по трём сторонам: a по оси x, вершина C из теоремы косинусов. */
const triangleFigure = fig(
	v => {
		const n = normalize({ a: v.a, b: v.b, c: v.c }, 6)
		// несуществующий треугольник рисуем ближайшим существующим
		const [a, b, c] = [n.a, n.b, n.c]
		const fix = Math.max(a, b, c) * 2 >= a + b + c
		return fix ? { a: 1, b: 0.8, c: 0.7 } : n
	},
	({ a, b, c }, Q, active) => {
		const cx = (a * a + c * c - b * b) / (2 * a)
		const cy = Math.sqrt(Math.max(c * c - cx * cx, 0.0001))
		// треугольник лежит вершиной от зрителя: a — ближняя сторона
		const P0: [number, number] = [0, cy]
		const P1: [number, number] = [a, cy]
		const P2: [number, number] = [cx, 0]
		const s = slab(Q, [P0, P1, P2])
		const mid = (
			p: [number, number],
			q: [number, number]
		): [number, number] => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]
		const outward = (p: [number, number], q: [number, number]): V3 => {
			const m = mid(p, q)
			const cen = [(P0[0] + P1[0] + P2[0]) / 3, (P0[1] + P1[1] + P2[1]) / 3]
			const vx = m[0] - cen[0]
			const vy = m[1] - cen[1]
			const l = Math.hypot(vx, vy) || 1
			return [(vx / l) * G, (vy / l) * G, 0]
		}
		const side = (
			key: string,
			p: [number, number],
			q: [number, number]
		): DimSpec => ({
			key,
			A: [p[0], p[1], 0],
			B: [q[0], q[1], 0],
			offA: outward(p, q)
		})
		return finish(
			Q,
			s.ops,
			s.pts,
			[side('a', P0, P1), side('b', P1, P2), side('c', P2, P0)],
			active
		)
	},
	FLAT
)

const trapezoidFigure = fig(
	v => normalize({ a: v.a, b: v.b, h: v.h }),
	({ a, b, h }, Q, active) => {
		const off = (a - b) / 2
		// нижнее основание a ближе к зрителю, верхнее b дальше
		const s = slab(Q, [
			[0, h],
			[a, h],
			[off + b, 0],
			[off, 0]
		])
		return finish(
			Q,
			s.ops,
			s.pts,
			[
				{ key: 'a', A: [0, h, 0], B: [a, h, 0], offA: [0, G, 0] },
				{ key: 'b', A: [off, 0, 0], B: [off + b, 0, 0], offA: [0, -G, 0] },
				{
					key: 'h',
					A: [Math.max(a, off + b), 0, 0],
					B: [Math.max(a, off + b), h, 0],
					offA: [G, 0, 0]
				}
			],
			active
		)
	},
	FLAT
)

/** Треугольник по основанию и высоте: вершина над третью основания. */
const triangleHeightFigure = fig(
	v => normalize({ a: v.a, h: v.h }),
	({ a, h }, Q, active) => {
		const apex = a * 0.35
		const s = slab(Q, [
			[0, h],
			[a, h],
			[apex, 0]
		])
		// высота пунктиром от вершины к основанию
		return finish(
			Q,
			s.ops.concat({
				d: open([Q([apex, 0, SLAB]), Q([apex, h, SLAB])]),
				cls: 'nf dash'
			}),
			s.pts,
			[
				{ key: 'a', A: [0, h, 0], B: [a, h, 0], offA: [0, G, 0] },
				{ key: 'h', A: [a, 0, 0], B: [a, h, 0], offA: [G, 0, 0] }
			],
			active
		)
	},
	FLAT
)

/** Стены комнаты: короб без крыши, ближние стены прозрачные, видны пунктиром. */
const wallsFigure = fig(
	v => normalize({ a: v.a, b: v.b, h: v.h }),
	({ a, b, h }, Q, active) => {
		const C = (x: number, y: number, z: number) => Q([x, y, z])
		const T = 0.03
		const ops: Op[] = [
			// пол
			{
				d: poly([C(0, 0, 0), C(a, 0, 0), C(a, b, 0), C(0, b, 0)]),
				cls: 'nf lo'
			},
			// две дальние стены — именно их площадь считаем, видно изнутри
			{ d: poly([C(0, 0, 0), C(a, 0, 0), C(a, 0, h), C(0, 0, h)]), cls: 'sil' },
			{ d: poly([C(0, 0, 0), C(0, b, 0), C(0, b, h), C(0, 0, h)]), cls: 'sil' },
			// ближние стены не рисуем сплошными, чтобы не закрыть комнату
			{
				d:
					open([C(a, 0, h), C(a, b, h), C(0, b, h)]) +
					open([C(a, 0, 0), C(a, 0, h)]) +
					open([C(a, b, 0), C(a, b, h)]) +
					open([C(0, b, 0), C(0, b, h)]),
				cls: 'nf dash'
			},
			{
				d: poly([C(0, 0, h), C(a, 0, h), C(a, 0, h + T), C(0, 0, h + T)]),
				cls: 'nf lo'
			}
		]
		const pts = [
			C(0, 0, 0),
			C(a, 0, 0),
			C(a, b, 0),
			C(0, b, 0),
			C(0, 0, h),
			C(a, b, h),
			C(a, 0, h),
			C(0, b, h)
		]
		return finish(
			Q,
			ops,
			pts,
			[
				{ key: 'a', A: [0, b, 0], B: [a, b, 0], offA: [0, G, 0] },
				{ key: 'b', A: [a, 0, 0], B: [a, b, 0], offA: [G, 0, 0] },
				{ key: 'h', A: [0, b, 0], B: [0, b, h], offA: mul(RIGHT, -G) }
			],
			active
		)
	}
)

export const GEOMETRY_FIGURES: Record<string, FigureDef> = {
	box: boxFigure,
	cylinder: cylinderFigure('h'),
	pipe: pipeFigure,
	sphere: sphereFigure,
	cone: coneFigure,
	'truncated-cone': truncatedConeFigure,
	rectangle: rectangleFigure,
	circle: circleFigure,
	ring: ringFigure,
	triangle: triangleFigure,
	'triangle-height': triangleHeightFigure,
	trapezoid: trapezoidFigure,
	walls: wallsFigure,
	'pipe-surface': cylinderFigure('h'),
	'sphere-surface': sphereFigure
}

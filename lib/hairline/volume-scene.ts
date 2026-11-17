/**
 * Объёмные фигуры калькулятора объёма, нарисованные в стиле Hairline:
 * тонкие линии, заливка цветом фона, невидимые рёбра пунктиром, выносные
 * размеры с настоящими числами. Здесь только геометрия и пути; камера,
 * пружины и SVG живут в движке (lib/hairline/kernel.js) и в
 * components/tools/VolumeFigure.tsx.
 *
 * Пропорции берутся из введённых размеров, но с ограничением: труба
 * 110 мм × 6 м в честном масштабе выродилась бы в линию. Поэтому любой
 * размер на рисунке не меньше трети самого большого, а подписи всегда
 * показывают настоящие числа.
 */

export type Pt = [number, number]
export type V3 = [number, number, number]
type Proj = (x: number, y: number, z: number) => Pt

export type Op = { d: string; cls: string; clip?: string; rule?: 'evenodd' }

export type VolumeShapeId =
	| 'box'
	| 'cylinder'
	| 'pipe'
	| 'sphere'
	| 'cone'
	| 'truncated-cone'

export const HAIRLINE_SHAPES: ReadonlySet<string> = new Set<VolumeShapeId>([
	'box',
	'cylinder',
	'pipe',
	'sphere',
	'cone',
	'truncated-cone'
])

/** Подпись размера: ключ поля, точка привязки и якорь текста. */
export type DimLabel = {
	key: string
	x: number
	y: number
	anchor: 'start' | 'middle' | 'end'
}

export type Scene = {
	ops: Op[]
	labels: DimLabel[]
	/** Размерные линии на экране: по ним ловим курсор. */
	hits: Array<{ key: string; a: Pt; b: Pt }>
	/** Все точки рисунка: по ним камера подгоняет масштаб. */
	pts: Pt[]
}

/** Азимут и наклон камеры: 2:1, слегка развёрнуто, чтобы a и b различались. */
export const AZ = 32
export const K = 0.5

const RATIO = 3.2

const r2 = (n: number) => Math.round(n * 100) / 100
const poly = (p: Pt[]) =>
	'M' + p.map(q => `${r2(q[0])} ${r2(q[1])}`).join('L') + 'Z'
const open = (p: Pt[]) =>
	p.length < 2 ? '' : 'M' + p.map(q => `${r2(q[0])} ${r2(q[1])}`).join('L')
const seg = (a: Pt, b: Pt) => `M${r2(a[0])} ${r2(a[1])}L${r2(b[0])} ${r2(b[1])}`
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

/** Вектор к камере: чем больше dot(p, V), тем точка ближе. */
function viewVec(): V3 {
	const a = (AZ * Math.PI) / 180
	const zf = Math.sqrt(1 - K * K)
	return [Math.sin(a) * zf, Math.cos(a) * zf, K]
}

const A_RAD = (AZ * Math.PI) / 180
/** Мировое направление, которое на экране идёт ровно вправо. */
const RIGHT: V3 = [Math.cos(A_RAD), -Math.sin(A_RAD), 0]
/** Отношение экранной высоты эллипса к ширине: верх круга над центром. */
const ELL = K / Math.sqrt(1 - K * K)

/**
 * Размеры для рисунка, сведённые к самому большому = 1. Ключи совпадают
 * с полями фигуры в lib/constants/geometry-shapes.ts.
 */
export function displayDims(
	shape: string,
	v: Record<string, number>
): Record<string, number> {
	const norm = (o: Record<string, number>) => {
		const M = Math.max(...Object.values(o))
		return Object.fromEntries(Object.entries(o).map(([k, x]) => [k, x / M]))
	}
	const lim = (x: number, M: number) => Math.max(x, M / RATIO)
	switch (shape) {
		case 'box': {
			const M = Math.max(v.a, v.b, v.c)
			return norm({ a: lim(v.a, M), b: lim(v.b, M), c: lim(v.c, M) })
		}
		case 'cylinder':
		case 'cone': {
			const M = Math.max(v.d, v.h)
			return norm({ d: lim(v.d, M), h: lim(v.h, M) })
		}
		case 'sphere':
			return { d: 1 }
		case 'pipe': {
			const M = Math.max(v.D, v.h)
			const D = lim(v.D, M)
			// стенка всегда видна, но и не толще трети радиуса
			const ratio = clamp(v.d / v.D, 0.3, 0.8)
			return norm({ D, d: D * ratio, h: lim(v.h, M) })
		}
		case 'truncated-cone': {
			const M = Math.max(v.D, v.d, v.h)
			return norm({ D: lim(v.D, M), d: lim(v.d, M), h: lim(v.h, M) })
		}
		default:
			return v
	}
}

/** Окружность в плоскости (u, v) вокруг c. */
function ring(c: V3, u: V3, v: V3, R: number, n = 72): V3[] {
	const out: V3[] = []
	for (let i = 0; i < n; i++) {
		const t = (i / n) * Math.PI * 2
		out.push(add(c, add(mul(u, R * Math.cos(t)), mul(v, R * Math.sin(t)))))
	}
	return out
}

/** Выпуклая оболочка; возвращает те же объекты точек, что пришли. */
function hull(input: Pt[]): Pt[] {
	const pts = input.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1])
	const x = (o: Pt, a: Pt, b: Pt) =>
		(a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
	const lo: Pt[] = []
	const up: Pt[] = []
	for (const p of pts) {
		while (lo.length > 1 && x(lo[lo.length - 2], lo[lo.length - 1], p) <= 0)
			lo.pop()
		lo.push(p)
	}
	for (let i = pts.length - 1; i >= 0; i--) {
		const p = pts[i]
		while (up.length > 1 && x(up[up.length - 2], up[up.length - 1], p) <= 0)
			up.pop()
		up.push(p)
	}
	lo.pop()
	up.pop()
	return lo.concat(up)
}

/** Непрерывный по кругу кусок точек, для которых keep(i) истинно. */
function cyclicRun(pts: Pt[], keep: (i: number) => boolean): Pt[] {
	const n = pts.length
	let s = -1
	for (let i = 0; i < n; i++)
		if (keep(i) && !keep((i + n - 1) % n)) {
			s = i
			break
		}
	if (s < 0) return keep(0) ? pts.concat([pts[0]]) : []
	const out: Pt[] = []
	for (let k = 0; k < n && keep((s + k) % n); k++) out.push(pts[(s + k) % n])
	return out
}

type DimSpec = {
	key: string
	A: V3
	B: V3
	/** Сдвиг размерной линии от A и от B; offB по умолчанию равен offA. */
	offA: V3
	offB?: V3
	/** Куда отодвинуть подпись, если сдвига нет (линия поперёк фигуры). */
	labelDir?: V3
}

/** Тело вращения: силуэт, ближний торец, невидимая дуга дальнего торца. */
function revolve(
	Q: (v: V3) => Pt,
	far: V3[],
	near: V3[],
	nearCls = 'sil'
): { ops: Op[]; pts: Pt[]; farP: Pt[]; nearP: Pt[] } {
	const farP = far.map(Q)
	const nearP = near.map(Q)
	const all = farP.concat(nearP)
	const h = hull(all)
	const onHull = new Set(h)
	const hidden = cyclicRun(farP, i => !onHull.has(farP[i]))
	const ops: Op[] = [{ d: poly(h), cls: 'sil' }]
	// у конуса ближний торец — точка
	const spread = Math.hypot(
		nearP[0][0] - nearP[nearP.length >> 1][0],
		nearP[0][1] - nearP[nearP.length >> 1][1]
	)
	if (spread > 0.5) ops.push({ d: poly(nearP), cls: nearCls })
	if (hidden.length > 1) ops.push({ d: open(hidden), cls: 'nf dash' })
	return { ops, pts: all, farP, nearP }
}

/**
 * Собирает сцену фигуры. dims — размеры для рисунка (displayDims),
 * active — ключ размера, который подсветить.
 */
export function buildScene(
	shape: string,
	dims: Record<string, number>,
	P: Proj,
	active: string | null
): Scene {
	const Q = (v: V3) => P(v[0], v[1], v[2])
	const V = viewVec()
	const ops: Op[] = []
	const pts: Pt[] = []
	const specs: DimSpec[] = []
	const Z: V3 = [0, 0, 1]
	const X: V3 = [1, 0, 0]
	const Y: V3 = [0, 1, 0]
	const O: V3 = [0, 0, 0]
	const g = 0.16

	switch (shape) {
		case 'box': {
			const { a, b, c } = dims
			const C = (x: number, y: number, z: number) => Q([x, y, z])
			const faces: Pt[][] = [
				[C(0, b, 0), C(a, b, 0), C(a, b, c), C(0, b, c)],
				[C(a, 0, 0), C(a, b, 0), C(a, b, c), C(a, 0, c)],
				[C(0, 0, c), C(a, 0, c), C(a, b, c), C(0, b, c)]
			]
			for (const f of faces) {
				ops.push({ d: poly(f), cls: 'sil' })
				pts.push(...f)
			}
			// три ребра из дальнего нижнего угла не видны: пунктир поверх
			ops.push({
				d:
					seg(C(0, 0, 0), C(a, 0, 0)) +
					seg(C(0, 0, 0), C(0, b, 0)) +
					seg(C(0, 0, 0), C(0, 0, c)),
				cls: 'nf dash'
			})
			specs.push(
				{ key: 'a', A: [0, b, 0], B: [a, b, 0], offA: [0, g, 0] },
				{ key: 'b', A: [a, 0, 0], B: [a, b, 0], offA: [g, 0, 0] },
				{
					key: 'c',
					A: [0, b, 0],
					B: [0, b, c],
					offA: mul([-Math.cos(A_RAD), Math.sin(A_RAD), 0], g)
				}
			)
			break
		}

		case 'cylinder':
		case 'cone':
		case 'truncated-cone': {
			const h = dims.h
			const R1 = (shape === 'truncated-cone' ? dims.D : dims.d) / 2
			const R2 = shape === 'cylinder' ? R1 : shape === 'cone' ? 0 : dims.d / 2
			const bottom = ring(O, X, Y, R1)
			const top = ring([0, 0, h], X, Y, R2)
			const r = revolve(Q, bottom, top)
			ops.push(...r.ops)
			pts.push(...r.pts)
			const Rm = Math.max(R1, R2)
			const hKey = 'h'
			specs.push({
				key: hKey,
				A: mul(RIGHT, R1),
				B: add(mul(RIGHT, R2), [0, 0, h]),
				offA: mul(RIGHT, Rm - R1 + g),
				offB: mul(RIGHT, Rm - R2 + g)
			})
			const below = (R: number): V3 => [0, 0, -(R * ELL + g * 0.8)]
			const above = (R: number): V3 => [0, 0, R * ELL + g * 0.8]
			if (shape === 'cylinder')
				specs.push({
					key: 'd',
					A: add(mul(RIGHT, -R2), [0, 0, h]),
					B: add(mul(RIGHT, R2), [0, 0, h]),
					offA: above(R2)
				})
			else if (shape === 'cone')
				specs.push({
					key: 'd',
					A: mul(RIGHT, -R1),
					B: mul(RIGHT, R1),
					offA: below(R1)
				})
			else
				specs.push(
					{
						key: 'D',
						A: mul(RIGHT, -R1),
						B: mul(RIGHT, R1),
						offA: below(R1)
					},
					{
						key: 'd',
						A: add(mul(RIGHT, -R2), [0, 0, h]),
						B: add(mul(RIGHT, R2), [0, 0, h]),
						offA: above(R2)
					}
				)
			break
		}

		case 'pipe': {
			const L = dims.h
			const R = dims.D / 2
			const r = dims.d / 2
			const far = ring(O, Y, Z, R)
			const near = ring([L, 0, 0], Y, Z, R)
			const rv = revolve(Q, far, near, 'nf sil')
			pts.push(...rv.pts)
			ops.push(rv.ops[0])
			const innerNear = ring([L, 0, 0], Y, Z, r).map(Q)
			const innerFar = ring(O, Y, Z, r).map(Q)
			// торец — кольцо: внешний и внутренний круг, середина пустая
			ops.push({
				d: poly(rv.nearP) + poly(innerNear),
				cls: 'sil',
				rule: 'evenodd'
			})
			// в отверстии видна внутренняя стенка до дальнего конца
			ops.push({
				d: poly(hull(innerNear.concat(innerFar))),
				cls: 'nf lo',
				clip: poly(innerNear)
			})
			ops.push(...rv.ops.slice(2))
			// D выносится влево у дальнего торца, d вправо у ближнего:
			// на трубе они почти равны, рядом подписи налезали бы друг на друга
			specs.push(
				{
					key: 'h',
					A: [0, 0, -R],
					B: [L, 0, -R],
					offA: [0, 0, -(R * 0.12 + g)]
				},
				{ key: 'd', A: [L, 0, -r], B: [L, 0, r], offA: [g * 0.8, 0, 0] },
				{ key: 'D', A: [0, 0, -R], B: [0, 0, R], offA: [-g * 0.8, 0, 0] }
			)
			break
		}

		case 'sphere': {
			const R = dims.d / 2
			const c: V3 = [0, 0, R]
			// контур шара — окружность в плоскости, перпендикулярной взгляду
			const w = [
				V[1] * RIGHT[2] - V[2] * RIGHT[1],
				V[2] * RIGHT[0] - V[0] * RIGHT[2],
				V[0] * RIGHT[1] - V[1] * RIGHT[0]
			] as V3
			const outline = ring(c, RIGHT, w, R, 96).map(Q)
			ops.push({ d: poly(outline), cls: 'sil' })
			pts.push(...outline)
			const eq = ring(c, X, Y, R, 96)
			const eqP = eq.map(Q)
			const front = (i: number) => dot(add(eq[i], mul(c, -1)), V) >= 0
			ops.push({ d: open(cyclicRun(eqP, front)), cls: 'nf lo' })
			ops.push({ d: open(cyclicRun(eqP, i => !front(i))), cls: 'nf dash' })
			specs.push({
				key: 'd',
				A: add(c, mul(RIGHT, -R)),
				B: add(c, mul(RIGHT, R)),
				offA: O,
				labelDir: Z
			})
			break
		}
	}

	const labels: DimLabel[] = []
	const hits: Scene['hits'] = []
	for (const s of specs) {
		const on = s.key === active
		const offB = s.offB ?? s.offA
		const la = Q(add(s.A, s.offA))
		const lb = Q(add(s.B, offB))
		const tick = (p: Pt) =>
			seg([p[0] - 2.6, p[1] + 2.6], [p[0] + 2.6, p[1] - 2.6])
		const hasOff = dot(s.offA, s.offA) > 1e-9
		let d = seg(la, lb) + tick(la) + tick(lb)
		if (hasOff)
			d +=
				seg(Q(add(s.A, mul(s.offA, 0.15))), Q(add(s.A, mul(s.offA, 1.18)))) +
				seg(Q(add(s.B, mul(offB, 0.15))), Q(add(s.B, mul(offB, 1.18))))
		ops.push({ d, cls: on ? 'nf hi' : 'nf sil' })
		hits.push({ key: s.key, a: la, b: lb })
		pts.push(la, lb)

		// подпись отодвигается от линии в сторону сдвига
		const mid: Pt = [(la[0] + lb[0]) / 2, (la[1] + lb[1]) / 2]
		const dirW = hasOff ? s.offA : (s.labelDir ?? Z)
		const m3 = mul(add(s.A, s.B), 0.5)
		const p0 = Q(m3)
		const p1 = Q(add(m3, mul(dirW, 0.1)))
		let dx = p1[0] - p0[0]
		let dy = p1[1] - p0[1]
		const len = Math.hypot(dx, dy) || 1
		dx /= len
		dy /= len
		if (Math.abs(dx) > Math.abs(dy) * 2)
			labels.push({
				key: s.key,
				x: mid[0] + dx * 7,
				y: mid[1] + 4,
				anchor: dx > 0 ? 'start' : 'end'
			})
		else // наклонная линия: подпись уходит от неё вдоль сдвига и прижимается
		// краем, чтобы линия не перечёркивала текст
		{
			// перпендикуляр к самой линии, в сторону сдвига: на наклонной
			// линии текст по центру не цепляет её концами
			let nx = -(lb[1] - la[1])
			let ny = lb[0] - la[0]
			const nl = Math.hypot(nx, ny) || 1
			nx /= nl
			ny /= nl
			if (nx * dx + ny * dy < 0) {
				nx = -nx
				ny = -ny
			}
			labels.push({
				key: s.key,
				x: mid[0] + nx * 17,
				y: mid[1] + ny * 17 + 4,
				anchor: 'middle'
			})
		}
	}

	return { ops, labels, hits, pts }
}

/** Расстояние от точки до отрезка на экране. */
export function distSeg(p: Pt, a: Pt, b: Pt) {
	const dx = b[0] - a[0]
	const dy = b[1] - a[1]
	const l = dx * dx + dy * dy
	const t = l ? clamp(((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l, 0, 1) : 0
	return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy)
}

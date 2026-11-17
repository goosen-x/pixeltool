/**
 * Общие детали для сцен в стиле Hairline: пути, тела вращения, выносные
 * размеры с подписями. Сцена — чистая функция от размеров и проекции, без
 * DOM, поэтому её можно и рисовать в браузере (components/tools/HairlineFigure),
 * и отрендерить в статичный SVG для проверки (scripts/hairline-preview.ts).
 *
 * Классы путей — палитра движка (lib/hairline/kernel.js): без класса —
 * заливка фоном и средняя линия; sil — контур; hi — подсветка; lo — тусклая
 * линия; nf — без заливки; fo — только заливка; dash — пунктир.
 */

export type Pt = [number, number]
export type V3 = [number, number, number]
export type Proj = (x: number, y: number, z: number) => Pt

export type Op = { d: string; cls: string; clip?: string; rule?: 'evenodd' }

/** Подпись размера; text — если подпись не про поле ввода (например, «≈ 140 см»). */
export type DimLabel = {
	key: string
	x: number
	y: number
	anchor: 'start' | 'middle' | 'end'
	text?: string
}

export type Scene = {
	ops: Op[]
	labels: DimLabel[]
	/** Размерные линии на экране: по ним ловим курсор. */
	hits: Array<{ key: string; a: Pt; b: Pt }>
	/** Все точки рисунка: по ним камера подгоняет масштаб. */
	pts: Pt[]
}

/**
 * Описание фигуры для HairlineFigure. display сводит настоящие размеры в
 * пропорции рисунка (их и анимируют пружины), build строит сцену.
 */
export type FigureDef = {
	az: number
	k: number
	display: (meters: Record<string, number>) => Record<string, number>
	build: (dims: Record<string, number>, P: Proj, active: string | null) => Scene
}

export const r2 = (n: number) => Math.round(n * 100) / 100
export const poly = (p: Pt[]) =>
	p.length < 2
		? ''
		: 'M' + p.map(q => `${r2(q[0])} ${r2(q[1])}`).join('L') + 'Z'
export const open = (p: Pt[]) =>
	p.length < 2 ? '' : 'M' + p.map(q => `${r2(q[0])} ${r2(q[1])}`).join('L')
export const seg = (a: Pt, b: Pt) =>
	`M${r2(a[0])} ${r2(a[1])}L${r2(b[0])} ${r2(b[1])}`
export const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
export const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
export const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
export const clamp = (v: number, a: number, b: number) =>
	Math.max(a, Math.min(b, v))

/** Вектор к камере: чем больше dot(p, V), тем точка ближе. */
export function viewVec(az: number, k: number): V3 {
	const a = (az * Math.PI) / 180
	const zf = Math.sqrt(1 - k * k)
	return [Math.sin(a) * zf, Math.cos(a) * zf, k]
}

/** Мировое направление, которое на экране идёт ровно вправо. */
export function rightVec(az: number): V3 {
	const a = (az * Math.PI) / 180
	return [Math.cos(a), -Math.sin(a), 0]
}

/** Мировое направление по земле к зрителю (на экране вниз). */
export function towardVec(az: number): V3 {
	const a = (az * Math.PI) / 180
	return [Math.sin(a), Math.cos(a), 0]
}

/** Отношение экранной высоты лежащего круга к ширине. */
export const ellipseRatio = (k: number) => k / Math.sqrt(1 - k * k)

/** Сводит размеры к самому большому = 1, мелкие не меньше max / ratio. */
export function normalize(
	v: Record<string, number>,
	ratio = 3.2
): Record<string, number> {
	const M = Math.max(...Object.values(v))
	return Object.fromEntries(
		Object.entries(v).map(([k, x]) => [k, Math.max(x, M / ratio) / M])
	)
}

/** Окружность в плоскости (u, v) вокруг c. */
export function ring(c: V3, u: V3, v: V3, R: number, n = 72): V3[] {
	const out: V3[] = []
	for (let i = 0; i < n; i++) {
		const t = (i / n) * Math.PI * 2
		out.push(add(c, add(mul(u, R * Math.cos(t)), mul(v, R * Math.sin(t)))))
	}
	return out
}

/** Выпуклая оболочка; возвращает те же объекты точек, что пришли. */
export function hull(input: Pt[]): Pt[] {
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
export function cyclicRun(pts: Pt[], keep: (i: number) => boolean): Pt[] {
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

/** Тело вращения: силуэт, ближний торец, невидимая дуга дальнего торца. */
export function revolve(
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

export type DimSpec = {
	key: string
	A: V3
	B: V3
	/** Сдвиг размерной линии от A и от B; offB по умолчанию равен offA. */
	offA: V3
	offB?: V3
	/** Куда отодвинуть подпись, если сдвига нет (линия поперёк фигуры). */
	labelDir?: V3
	/** Своя подпись вместо «буква = значение поля». */
	text?: string
	/** Без засечек и выносных: линия-указатель (диагональ экрана и т. п.). */
	plain?: boolean
}

/**
 * Рисует выносные размеры и раскладывает подписи. Подпись отходит от линии
 * в сторону сдвига: у почти вертикальной линии — вбок, у наклонной — по
 * перпендикуляру, чтобы линия не перечёркивала текст.
 */
export function dimensions(
	Q: (v: V3) => Pt,
	specs: DimSpec[],
	active: string | null
): Pick<Scene, 'ops' | 'labels' | 'hits' | 'pts'> {
	const ops: Op[] = []
	const labels: DimLabel[] = []
	const hits: Scene['hits'] = []
	const pts: Pt[] = []
	const Z: V3 = [0, 0, 1]
	for (const s of specs) {
		const on = s.key === active
		const offB = s.offB ?? s.offA
		const la = Q(add(s.A, s.offA))
		const lb = Q(add(s.B, offB))
		const tick = (p: Pt) =>
			seg([p[0] - 2.6, p[1] + 2.6], [p[0] + 2.6, p[1] - 2.6])
		const hasOff = dot(s.offA, s.offA) > 1e-9
		let d = seg(la, lb)
		if (!s.plain) d += tick(la) + tick(lb)
		if (hasOff && !s.plain)
			d +=
				seg(Q(add(s.A, mul(s.offA, 0.15))), Q(add(s.A, mul(s.offA, 1.18)))) +
				seg(Q(add(s.B, mul(offB, 0.15))), Q(add(s.B, mul(offB, 1.18))))
		ops.push({ d, cls: on ? 'nf hi' : s.plain ? 'nf lo' : 'nf sil' })
		hits.push({ key: s.key, a: la, b: lb })
		pts.push(la, lb)

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
				anchor: dx > 0 ? 'start' : 'end',
				text: s.text
			})
		else {
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
				anchor: 'middle',
				text: s.text
			})
		}
	}
	return { ops, labels, hits, pts }
}

/** Прямоугольный брусок от (x0,y0,z0) до (x1,y1,z1): три видимых грани и пунктир невидимых рёбер. */
export function box(
	Q: (v: V3) => Pt,
	az: number,
	[x0, y0, z0]: V3,
	[x1, y1, z1]: V3,
	opts: { hidden?: boolean; cls?: string } = {}
): { ops: Op[]; pts: Pt[] } {
	const a = (az * Math.PI) / 180
	// какие боковые грани смотрят на камеру: по знаку sin/cos азимута
	const xs = Math.sin(a) >= 0 ? x1 : x0
	const xf = xs === x1 ? x0 : x1
	const ys = Math.cos(a) >= 0 ? y1 : y0
	const yf = ys === y1 ? y0 : y1
	const C = (x: number, y: number, z: number) => Q([x, y, z])
	const faces: Pt[][] = [
		[C(x0, ys, z0), C(x1, ys, z0), C(x1, ys, z1), C(x0, ys, z1)],
		[C(xs, y0, z0), C(xs, y1, z0), C(xs, y1, z1), C(xs, y0, z1)],
		[C(x0, y0, z1), C(x1, y0, z1), C(x1, y1, z1), C(x0, y1, z1)]
	]
	const cls = opts.cls ?? 'sil'
	const ops: Op[] = faces.map(f => ({ d: poly(f), cls }))
	const pts = faces.flat()
	if (opts.hidden !== false)
		ops.push({
			d:
				seg(C(xf, yf, z0), C(xs, yf, z0)) +
				seg(C(xf, yf, z0), C(xf, ys, z0)) +
				seg(C(xf, yf, z0), C(xf, yf, z1)),
			cls: 'nf dash'
		})
	return { ops, pts }
}

/** Расстояние от точки до отрезка на экране. */
export function distSeg(p: Pt, a: Pt, b: Pt) {
	const dx = b[0] - a[0]
	const dy = b[1] - a[1]
	const l = dx * dx + dy * dy
	const t = l ? clamp(((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l, 0, 1) : 0
	return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy)
}

/** Ширина подписи в единицах viewBox (12,5 px шрифт): для полей камеры. */
export const labelWidth = (s: string) => s.length * 6.9

/** Проекция как в движке: Cam(az, k, S) со сдвигом (ox, oy). */
export function project(az: number, k: number, S = 1, ox = 0, oy = 0): Proj {
	const a = (az * Math.PI) / 180
	const c = Math.cos(a)
	const s = Math.sin(a)
	const zf = Math.sqrt(1 - k * k)
	return (x, y, z) => {
		const X = x * c - y * s
		const Y = x * s + y * c
		return [ox + S * X, oy + S * (Y * k - z * zf)]
	}
}

const W = 400
const H = 320
const PAD: [number, number, number, number] = [58, 26, 66, 28]

/**
 * Строит сцену и вписывает её в viewBox 400×320. Подписи в пикселях не
 * масштабируются вместе с рисунком, поэтому, если какая-то вылезла за край,
 * поле с этой стороны расширяется и камера подгоняется заново.
 */
export function fitScene(
	def: FigureDef,
	dims: Record<string, number>,
	active: string | null,
	labelText: (l: DimLabel) => string
): Scene {
	const raw = def.build(dims, project(def.az, def.k), active)
	let x0 = Infinity
	let x1 = -Infinity
	let y0 = Infinity
	let y1 = -Infinity
	for (const p of raw.pts) {
		x0 = Math.min(x0, p[0])
		x1 = Math.max(x1, p[0])
		y0 = Math.min(y0, p[1])
		y1 = Math.max(y1, p[1])
	}
	const pad = [...PAD]
	let scene = raw
	for (let pass = 0; pass < 3; pass++) {
		const [pl, pt, pr, pb] = pad
		const S = Math.min(
			(W - pl - pr) / (x1 - x0 || 1),
			(H - pt - pb) / (y1 - y0 || 1)
		)
		const ox = pl + (W - pl - pr - (x1 - x0) * S) / 2 - x0 * S
		const oy = pt + (H - pt - pb - (y1 - y0) * S) / 2 - y0 * S
		scene = def.build(dims, project(def.az, def.k, S, ox, oy), active)
		let over = false
		for (const l of scene.labels) {
			const w = labelWidth(labelText(l))
			const left =
				l.anchor === 'start' ? l.x : l.anchor === 'end' ? l.x - w : l.x - w / 2
			const ov = [4 - left, 14 - l.y, left + w - (W - 4), l.y + 4 - (H - 4)]
			ov.forEach((o, i) => {
				if (o > 0.5) {
					pad[i] += o + 2
					over = true
				}
			})
		}
		if (!over) break
	}
	return scene
}

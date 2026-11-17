/**
 * Телевизор для тула «Размер телевизора» в стиле Hairline: тонкий корпус
 * на подставке, экран с диагональю, ширина и высота экрана выносками.
 *
 * Ключи размеров (все в сантиметрах, кроме дюймов):
 *   w — ширина экрана, h — высота, diag — диагональ, in — диагональ в дюймах.
 * Пропорция экрана меняется с соотношением сторон и перетекает на пружинах.
 * Числа в подписях тоже идут через пружины, поэтому при смене диагонали
 * они плавно «докручиваются» до нового значения.
 */
import {
	box,
	dimensions,
	poly,
	type DimSpec,
	type FigureDef,
	type Op,
	type Pt,
	type V3
} from '@/lib/hairline/scene-kit'

/** Почти фронтально и чуть сверху: экран читается, торец и подставка видны. */
const AZ = 22
const K = 0.3

/** Рамка вокруг экрана, толщина корпуса, высота подставки (доли ширины экрана). */
const BEZEL = 0.018
const DEPTH = 0.035
const STAND = 0.09
const G = 0.07

const cm = (v: number) => String(Math.round(v * 10) / 10).replace('.', ',')
const inch = (v: number) => String(Math.round(v * 10) / 10).replace('.', ',')

export const TV_FIGURE: FigureDef = {
	az: AZ,
	k: K,
	display: v => ({
		w: 1,
		h: v.h / v.w,
		wcm: v.w,
		hcm: v.h,
		dcm: v.diag,
		din: v.in
	}),
	build: (d, P, active) => {
		const Q = (v: V3): Pt => P(v[0], v[1], v[2])
		const { w, h } = d
		const z0 = STAND + BEZEL
		const z1 = z0 + h
		const ops: Op[] = []

		// подставка: плоское основание и короткая стойка по центру
		const base = box(
			Q,
			AZ,
			[w / 2 - 0.16, -0.03, 0],
			[w / 2 + 0.16, DEPTH + 0.06, 0.012],
			{ hidden: false }
		)
		const neck = box(
			Q,
			AZ,
			[w / 2 - 0.025, 0.004, 0.012],
			[w / 2 + 0.025, DEPTH - 0.004, STAND + 0.01],
			{ hidden: false }
		)
		// корпус с рамкой вокруг экрана
		const body = box(
			Q,
			AZ,
			[-BEZEL, 0, STAND],
			[w + BEZEL, DEPTH, z1 + BEZEL],
			{ hidden: false }
		)
		ops.push(...base.ops, ...neck.ops, ...body.ops)

		// сам экран на лицевой грани
		const screen: Pt[] = [
			Q([0, DEPTH, z0]),
			Q([w, DEPTH, z0]),
			Q([w, DEPTH, z1]),
			Q([0, DEPTH, z1])
		]
		ops.push({ d: poly(screen), cls: 'nf sil' })

		const specs: DimSpec[] = [
			{
				key: 'w',
				A: [0, DEPTH, z1],
				B: [w, DEPTH, z1],
				offA: [0, 0, BEZEL + G],
				text: `${cm(d.wcm)} см`
			},
			{
				key: 'h',
				A: [w, DEPTH, z0],
				B: [w, DEPTH, z1],
				offA: [BEZEL + G, 0, 0],
				text: `${cm(d.hcm)} см`
			},
			{
				// диагональ лежит прямо на экране, подпись над линией
				key: 'diag',
				A: [0, DEPTH, z0],
				B: [w, DEPTH, z1],
				offA: [0, 0, 0],
				labelDir: [0, 0, 1],
				text: `${inch(d.din)}″ · ${cm(d.dcm)} см`
			}
		]
		const dims = dimensions(Q, specs, active)
		// подпись диагонали опускаем под линию так, чтобы наклонная линия не
		// перечёркивала текст: чем круче экран, тем ниже
		const di = specs.findIndex(s => s.key === 'diag')
		const [la, lb] = [dims.hits[di].a, dims.hits[di].b]
		const slope = Math.abs((lb[1] - la[1]) / (lb[0] - la[0] || 1))
		const label = dims.labels.find(l => l.key === 'diag')
		if (label) {
			label.x = (la[0] + lb[0]) / 2
			label.y = (la[1] + lb[1]) / 2 + 62 * slope + 16
			label.anchor = 'middle'
		}
		return {
			ops: ops.concat(dims.ops),
			labels: dims.labels,
			hits: dims.hits,
			pts: base.pts.concat(neck.pts, body.pts, dims.pts)
		}
	}
}

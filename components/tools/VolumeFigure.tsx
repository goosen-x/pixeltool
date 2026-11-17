'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import {
	AZ,
	buildScene,
	displayDims,
	distSeg,
	K,
	type Op,
	type Pt
} from '@/lib/hairline/volume-scene'

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Объёмная фигура калькулятора на движке Hairline (как калькулятор забора
 * на rentmetal): пропорции следуют за введёнными размерами и перетекают на
 * пружинах, на выносках настоящие числа. Наведение на размер подсвечивает
 * его, клик ставит курсор в нужное поле.
 *
 * Движок грузится отдельным чанком после гидрации; до этого на месте
 * рисунка пустая площадка того же размера, поэтому вёрстка не прыгает.
 */

export type FigureDim = {
	key: string
	/** Буква на схеме и на поле ввода: a, D, L… */
	letter: string
	/** Размер в метрах; null — поле пустое или с ошибкой. */
	meters: number | null
	/** Как подписать: «5 м», «110 мм». */
	text: string
}

interface VolumeFigureProps {
	shapeId: string
	dims: FigureDim[]
	/** Поле в фокусе: его размер подсвечен. */
	focusKey: string | null
	onPick: (key: string) => void
	className?: string
}

const PAD: [number, number, number, number] = [58, 26, 66, 28]

const LABEL_CSS = `
[data-hairline="volume"] svg text{stroke:none;font-family:var(--font-sans),system-ui,sans-serif;font-size:12.5px;font-weight:500;font-variant-numeric:tabular-nums;fill:var(--hl-edge);stroke:var(--hl-plate);stroke-width:4px;stroke-linejoin:round;paint-order:stroke;transition:fill 260ms}
[data-hairline="volume"] svg text.on{fill:var(--hl-hi)}
`

const VARS = {
	'--hairline-plate': 'hsl(var(--card))',
	'--hairline-hi': 'hsl(var(--primary))',
	'--hairline-edge': 'hsl(var(--foreground) / 0.62)',
	'--hairline-mid': 'hsl(var(--foreground) / 0.4)',
	'--hairline-lo': 'hsl(var(--foreground) / 0.2)',
	'--hairline-stroke': '1.1'
} as CSSProperties

type Handle = {
	update: (dims: FigureDim[], focusKey: string | null) => void
	destroy: () => void
}

function mount(
	HL: any,
	stage: HTMLDivElement,
	shapeId: string,
	uid: string,
	onPick: () => (key: string) => void
): Handle {
	const svg = HL.mk(
		'svg',
		{ viewBox: '0 0 400 320', 'aria-hidden': 'true' },
		stage
	)
	const g = HL.mk('g', {}, svg)
	const defs = HL.mk('defs', {}, svg)
	const tg = HL.mk('g', {}, svg)
	const paths: Element[] = []
	const clips: Element[] = []
	const texts: Element[] = []

	let dims: FigureDim[] = []
	let focusKey: string | null = null
	let hover: string | null = null
	let hits: Array<{ key: string; a: Pt; b: Pt }> = []
	const springs = new Map<string, any>()

	function targets() {
		const known: Record<string, number> = {}
		for (const d of dims) if (d.meters && d.meters > 0) known[d.key] = d.meters
		// пустое поле не ломает рисунок: берём прошлое значение пружины
		for (const d of dims)
			if (!(d.key in known)) known[d.key] = springs.get(d.key)?.t ?? 1
		return displayDims(shapeId, known)
	}

	function render(ops: Op[]) {
		while (paths.length < ops.length) paths.push(HL.mk('path', {}, g))
		ops.forEach((o, i) => {
			const e = paths[i]
			e.setAttribute('d', o.d)
			e.setAttribute('class', o.cls)
			if (o.rule) e.setAttribute('fill-rule', o.rule)
			else e.removeAttribute('fill-rule')
			if (o.clip) {
				const id = `${uid}-clip-${i}`
				if (!clips[i]) {
					const cp = HL.mk('clipPath', { id }, defs)
					clips[i] = HL.mk('path', {}, cp)
				}
				clips[i].setAttribute('d', o.clip)
				e.setAttribute('clip-path', `url(#${id})`)
			} else e.removeAttribute('clip-path')
		})
		for (let i = ops.length; i < paths.length; i++)
			paths[i].setAttribute('d', '')
	}

	function draw() {
		const cur: Record<string, number> = {}
		springs.forEach((s, k) => (cur[k] = s.x))
		const active = hover ?? focusKey

		// камера: сначала масштаб 1, потом растягиваем рисунок на всю площадку.
		// Подписи в пикселях не масштабируются, поэтому, если какая-то вылезла
		// за край, поле с этой стороны расширяется и камера подгоняется заново.
		const C = HL.Cam(AZ, K, 1)
		const raw = buildScene(shapeId, cur, HL.proj(C), active)
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
			C.S = Math.min((400 - pl - pr) / (x1 - x0), (320 - pt - pb) / (y1 - y0))
			C.ox = pl + (400 - pl - pr - (x1 - x0) * C.S) / 2 - x0 * C.S
			C.oy = pt + (320 - pt - pb - (y1 - y0) * C.S) / 2 - y0 * C.S
			scene = buildScene(shapeId, cur, HL.proj(C), active)
			let over = false
			for (const l of scene.labels) {
				const d = dims.find(x => x.key === l.key)
				const w = (d ? `${d.letter} = ${d.text}`.length : 6) * 6.9
				const left =
					l.anchor === 'start'
						? l.x
						: l.anchor === 'end'
							? l.x - w
							: l.x - w / 2
				const ov = [4 - left, 14 - l.y, left + w - 396, l.y + 4 - 316]
				ov.forEach((o, i) => {
					if (o > 0.5) {
						pad[i] += o + 2
						over = true
					}
				})
			}
			if (!over) break
		}

		render(scene.ops)
		// подпись тоже кликабельна: её середина считается точкой попадания
		hits = scene.hits.concat(
			scene.labels.map(l => {
				const cx =
					l.anchor === 'start' ? l.x + 26 : l.anchor === 'end' ? l.x - 26 : l.x
				const p: Pt = [cx, l.y - 4]
				return {
					key: l.key,
					a: [cx - 24, p[1]] as Pt,
					b: [cx + 24, p[1]] as Pt
				}
			})
		)
		while (texts.length < scene.labels.length) texts.push(HL.mk('text', {}, tg))
		scene.labels.forEach((l, i) => {
			const t = texts[i]
			const d = dims.find(x => x.key === l.key)
			t.setAttribute('x', l.x.toFixed(1))
			t.setAttribute('y', l.y.toFixed(1))
			t.setAttribute('text-anchor', l.anchor)
			t.setAttribute('class', l.key === active ? 'on' : '')
			t.textContent = d ? `${d.letter} = ${d.text}` : ''
		})
		for (let i = scene.labels.length; i < texts.length; i++)
			texts[i].textContent = ''
		stage.style.cursor = hover ? 'pointer' : ''
	}

	const loop = HL.register(stage, (dt: number) => {
		let moving = false
		springs.forEach(s => {
			if (HL.stepS(s, dt)) moving = true
		})
		if (springs.size) draw()
		return moving
	})

	const offPointer = HL.pointer(stage, {
		move: (p: Pt) => {
			let best: string | null = null
			let bd = 16
			for (const h of hits) {
				const d = distSeg(p, h.a, h.b)
				if (d < bd) {
					bd = d
					best = h.key
				}
			}
			if (best !== hover) {
				hover = best
				draw()
			}
		},
		down: (p: Pt) => {
			for (const h of hits)
				if (distSeg(p, h.a, h.b) < 16) {
					onPick()(h.key)
					return
				}
		},
		leave: () => {
			if (hover) {
				hover = null
				draw()
			}
		}
	})

	return {
		update(next, nextFocus) {
			dims = next
			focusKey = nextFocus
			const t = targets()
			for (const [k, v] of Object.entries(t)) {
				const s = springs.get(k)
				if (s) s.t = v
				else springs.set(k, HL.spring(v, { k: 120, c: 20, eps: 0.001 }))
			}
			draw()
			loop.wake()
		},
		destroy() {
			offPointer()
			loop.unregister()
		}
	}
}

export function VolumeFigure({
	shapeId,
	dims,
	focusKey,
	onPick,
	className
}: VolumeFigureProps) {
	const ref = useRef<HTMLDivElement>(null)
	const handle = useRef<Handle | null>(null)
	const latest = useRef({ dims, focusKey, onPick })

	useEffect(() => {
		latest.current = { dims, focusKey, onPick }
		handle.current?.update(dims, focusKey)
	})

	useEffect(() => {
		const stage = ref.current
		if (!stage) return
		let cancelled = false
		let h: Handle | null = null
		import('@/lib/hairline/kernel').then(({ default: HL }) => {
			if (cancelled) return
			HL.inject(document)
			h = mount(
				HL,
				stage,
				shapeId,
				`vf-${shapeId}`,
				() => latest.current.onPick
			)
			handle.current = h
			h.update(latest.current.dims, latest.current.focusKey)
		})
		return () => {
			cancelled = true
			h?.destroy()
			handle.current = null
			stage.replaceChildren()
		}
	}, [shapeId])

	return (
		<>
			<style href='hairline-volume' precedence='default'>
				{LABEL_CSS}
			</style>
			<div
				ref={ref}
				data-hairline='volume'
				role='img'
				aria-label='Схема фигуры с размерами'
				className={className}
				style={{ ...VARS, aspectRatio: '5 / 4' }}
			/>
		</>
	)
}

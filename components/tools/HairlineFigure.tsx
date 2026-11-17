'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import {
	distSeg,
	fitScene,
	type DimLabel,
	type FigureDef,
	type Op,
	type Pt
} from '@/lib/hairline/scene-kit'

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Схема в стиле Hairline (как калькулятор забора на rentmetal): тонкие
 * линии, невидимые рёбра пунктиром, выносные размеры с настоящими числами.
 * Пропорции следуют за введёнными размерами и перетекают на пружинах.
 * Наведение на размер подсвечивает его, клик вызывает onPick (обычно ставит
 * курсор в нужное поле).
 *
 * Что рисовать, описывает FigureDef (lib/hairline/figures/*). Движок
 * (lib/hairline/kernel.js: пружины, общий цикл кадров, указатель, палитра)
 * грузится отдельным чанком после гидрации; до этого на месте рисунка
 * пустая площадка того же размера, поэтому вёрстка не прыгает.
 */

export type FigureDim = {
	key: string
	/** Буква на схеме и на поле ввода: a, D, L… */
	letter: string
	/** Размер в метрах (или в любых единицах, общих для фигуры); null — поле пустое. */
	meters: number | null
	/** Как подписать: «5 м», «110 мм». */
	text: string
}

interface HairlineFigureProps {
	/** Смена id пересобирает сцену с нуля, без перетекания. */
	id: string
	figure: FigureDef
	dims: FigureDim[]
	/** Поле в фокусе: его размер подсвечен. */
	focusKey?: string | null
	onPick?: (key: string) => void
	label?: string
	className?: string
}

const LABEL_CSS = `
[data-hairline="figure"] svg text{font-family:var(--font-sans),system-ui,sans-serif;font-size:12.5px;font-weight:500;font-variant-numeric:tabular-nums;fill:var(--hl-edge);stroke:var(--hl-plate);stroke-width:4px;stroke-linejoin:round;paint-order:stroke;transition:fill 260ms}
[data-hairline="figure"] svg text.on{fill:var(--hl-hi)}
`

const VARS = {
	'--hairline-plate': 'hsl(var(--card))',
	'--hairline-hi': 'hsl(var(--primary))',
	'--hairline-edge': 'hsl(var(--foreground) / 0.62)',
	'--hairline-mid': 'hsl(var(--foreground) / 0.4)',
	'--hairline-lo': 'hsl(var(--foreground) / 0.2)',
	'--hairline-stroke': '1.1',
	aspectRatio: '5 / 4'
} as CSSProperties

type Handle = {
	update: (dims: FigureDim[], focusKey: string | null) => void
	destroy: () => void
}

export function labelText(dims: FigureDim[], l: DimLabel) {
	if (l.text !== undefined) return l.text
	const d = dims.find(x => x.key === l.key)
	return d ? `${d.letter} = ${d.text}` : ''
}

function mount(
	HL: any,
	stage: HTMLDivElement,
	figure: FigureDef,
	uid: string,
	onPick: () => ((key: string) => void) | undefined
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
		// пустое поле не ломает рисунок: остаётся прошлое значение
		for (const d of dims)
			if (!(d.key in known)) known[d.key] = springs.get(d.key)?.raw ?? 1
		return { raw: known, shown: figure.display(known) }
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
		const scene = fitScene(figure, cur, active, l => labelText(dims, l))

		render(scene.ops)
		// подпись тоже кликабельна: её середина считается точкой попадания
		hits = scene.hits.concat(
			scene.labels.map(l => {
				const cx =
					l.anchor === 'start' ? l.x + 26 : l.anchor === 'end' ? l.x - 26 : l.x
				const y = l.y - 4
				return { key: l.key, a: [cx - 24, y] as Pt, b: [cx + 24, y] as Pt }
			})
		)
		while (texts.length < scene.labels.length) texts.push(HL.mk('text', {}, tg))
		scene.labels.forEach((l, i) => {
			const t = texts[i]
			t.setAttribute('x', l.x.toFixed(1))
			t.setAttribute('y', l.y.toFixed(1))
			t.setAttribute('text-anchor', l.anchor)
			t.setAttribute('class', l.key === active ? 'on' : '')
			t.textContent = labelText(dims, l)
		})
		for (let i = scene.labels.length; i < texts.length; i++)
			texts[i].textContent = ''
		stage.style.cursor = hover && onPick() ? 'pointer' : ''
	}

	const loop = HL.register(stage, (dt: number) => {
		let moving = false
		springs.forEach(s => {
			if (HL.stepS(s, dt)) moving = true
		})
		if (springs.size) draw()
		return moving
	})

	const nearest = (p: Pt) => {
		let best: string | null = null
		let bd = 16
		for (const h of hits) {
			const d = distSeg(p, h.a, h.b)
			if (d < bd) {
				bd = d
				best = h.key
			}
		}
		return best
	}

	const offPointer = HL.pointer(stage, {
		move: (p: Pt) => {
			const best = nearest(p)
			if (best !== hover) {
				hover = best
				draw()
			}
		},
		down: (p: Pt) => {
			const best = nearest(p)
			const pick = onPick()
			if (best && pick) pick(best)
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
			const { raw, shown } = targets()
			for (const [k, v] of Object.entries(shown)) {
				const s = springs.get(k)
				if (s) s.t = v
				else springs.set(k, HL.spring(v, { k: 120, c: 20, eps: 0.001 }))
				springs.get(k).raw = raw[k]
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

export function HairlineFigure({
	id,
	figure,
	dims,
	focusKey = null,
	onPick,
	label = 'Схема с размерами',
	className
}: HairlineFigureProps) {
	const ref = useRef<HTMLDivElement>(null)
	const handle = useRef<Handle | null>(null)
	const latest = useRef({ dims, focusKey, onPick, figure })

	useEffect(() => {
		latest.current = { dims, focusKey, onPick, figure }
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
				latest.current.figure,
				`hf-${id.replace(/[^a-z0-9-]/gi, '')}`,
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
	}, [id])

	return (
		<>
			<style href='hairline-figure' precedence='default'>
				{LABEL_CSS}
			</style>
			<div
				ref={ref}
				data-hairline='figure'
				role='img'
				aria-label={label}
				className={className}
				style={VARS}
			/>
		</>
	)
}

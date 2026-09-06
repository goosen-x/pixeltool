'use client'

/**
 * Отрисовка мозаики: кости рисуются вручную, остальные наборы — глифами.
 *
 * Кости приходится рисовать самому не ради красоты. Символы ⚀–⚅ отличаются
 * только точками внутри одинаковой рамки, и по средней яркости все шесть
 * практически неразличимы: фотография из них выходит ровным серым полем, в
 * котором ничего не узнать. Настоящие мозаики из костей поэтому и выкладывают
 * кубиками двух цветов — белыми и чёрными. Это даёт двенадцать градаций от
 * «белый кубик с одной точкой» до «чёрный кубик с одной точкой», и картинка
 * наконец читается.
 */

// Схемы точек на грани: координаты в долях стороны кубика.
const PIP_LAYOUT: Record<number, [number, number][]> = {
	1: [[0.5, 0.5]],
	2: [
		[0.28, 0.28],
		[0.72, 0.72]
	],
	3: [
		[0.26, 0.26],
		[0.5, 0.5],
		[0.74, 0.74]
	],
	4: [
		[0.28, 0.28],
		[0.72, 0.28],
		[0.28, 0.72],
		[0.72, 0.72]
	],
	5: [
		[0.26, 0.26],
		[0.74, 0.26],
		[0.5, 0.5],
		[0.26, 0.74],
		[0.74, 0.74]
	],
	6: [
		[0.28, 0.22],
		[0.72, 0.22],
		[0.28, 0.5],
		[0.72, 0.5],
		[0.28, 0.78],
		[0.72, 0.78]
	]
}

/** Уровень 0 — самый светлый. Белые кубики идут от 1 точки к 6, дальше чёрные — от 6 к 1. */
export const DICE_LEVELS = 12

export function levelToDie(level: number): { pips: number; dark: boolean } {
	if (level < 6) return { pips: level + 1, dark: false }
	return { pips: DICE_LEVELS - level, dark: true }
}

export function drawDie(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	size: number,
	pips: number,
	dark: boolean
) {
	const pad = size * 0.06
	const side = size - pad * 2
	const radius = side * 0.16

	ctx.beginPath()
	ctx.roundRect(x + pad, y + pad, side, side, radius)
	ctx.fillStyle = dark ? '#16181d' : '#ffffff'
	ctx.fill()
	ctx.lineWidth = Math.max(1, size * 0.035)
	ctx.strokeStyle = dark ? '#0a0b0e' : '#c9ced6'
	ctx.stroke()

	ctx.fillStyle = dark ? '#ffffff' : '#16181d'
	const pipRadius = side * 0.085
	for (const [px, py] of PIP_LAYOUT[pips] ?? []) {
		ctx.beginPath()
		ctx.arc(x + pad + side * px, y + pad + side * py, pipRadius, 0, Math.PI * 2)
		ctx.fill()
	}
}

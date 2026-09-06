'use client'

/**
 * Отрисовка мозаики: кости рисуются вручную, остальные наборы — глифами.
 *
 * Кости приходится рисовать самому не ради красоты. В символах ⚀–⚅ точки
 * мелкие, а рамка у всех шести одинаковая, поэтому по средней яркости грани
 * почти неразличимы: фотография из них выходит ровным серым полем. У живого
 * кубика точка занимает примерно пятую часть стороны, и грань с шестёркой
 * заметно темнее грани с единицей — на этой разнице мозаика и держится.
 * Отсюда PIP_RADIUS ниже: он взят от настоящих костей, а не от глифа.
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

/**
 * Шесть градаций — все грани одного кубика.
 *
 * Мозаику выкладывают из одинаковых костей, поэтому цвет у набора один на всю
 * работу: он задаёт, светлые кубики с тёмными точками или наоборот. Уровень 0
 * это грань с одной точкой (самая светлая у белых костей).
 */
export const DICE_LEVELS = 6

/** Доля стороны, которую занимает диаметр точки. У настоящих костей примерно столько. */
const PIP_RADIUS = 0.115

/**
 * Домино: тринадцать градаций по сумме точек, от пустой костяшки до 6–6.
 *
 * Рисуем сами по той же причине, что и кости, только острее: символы домино
 * есть далеко не в каждом системном шрифте, и там, где их нет, вместо мозаики
 * получается поле пустых прямоугольников. Где есть — они всё равно разной
 * ширины с остальными глифами и рушат сетку.
 */
export const DOMINO_LEVELS = 13

/** Половинки костяшки для уровня: точки раскладываются поровну между ними. */
export function levelToDomino(level: number): { top: number; bottom: number } {
	const top = Math.floor(level / 2)
	return { top, bottom: level - top }
}

/** Символ домино для текстовой копии: тайлы идут блоками по семь, шаг — левое число. */
export function dominoGlyph(level: number): string {
	const { top, bottom } = levelToDomino(level)
	return String.fromCodePoint(0x1f063 + top * 7 + bottom)
}

/** Костяшка вдвое выше своей ширины — сетка под домино считается с тем же отношением. */
export const DOMINO_RATIO = 2

export function drawDomino(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	level: number,
	dark: boolean
) {
	const pad = width * 0.06
	const w = width - pad * 2
	const h = height - pad * 2

	ctx.beginPath()
	ctx.roundRect(x + pad, y + pad, w, h, w * 0.16)
	ctx.fillStyle = dark ? '#16181d' : '#ffffff'
	ctx.fill()
	ctx.lineWidth = Math.max(1, width * 0.03)
	ctx.strokeStyle = dark ? '#000000' : '#eef1f5'
	ctx.stroke()

	// Перемычка между половинками — тонкая: она есть в каждой костяшке и
	// одинаково затемняет все тринадцать градаций.
	ctx.beginPath()
	ctx.moveTo(x + pad + w * 0.16, y + pad + h / 2)
	ctx.lineTo(x + pad + w * 0.84, y + pad + h / 2)
	ctx.strokeStyle = dark ? '#2a2f38' : '#dfe4ea'
	ctx.stroke()

	const { top, bottom } = levelToDomino(level)
	ctx.fillStyle = dark ? '#ffffff' : '#16181d'
	const pipRadius = w * PIP_RADIUS
	const half = h / 2

	const paintHalf = (pips: number, originY: number) => {
		for (const [px, py] of PIP_LAYOUT[pips] ?? []) {
			ctx.beginPath()
			ctx.arc(x + pad + w * px, originY + half * py, pipRadius, 0, Math.PI * 2)
			ctx.fill()
		}
	}
	paintHalf(top, y + pad)
	paintHalf(bottom, y + pad + half)
}

export function drawDie(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	size: number,
	pips: number,
	/** Цвет всего набора: чёрные кубики с белыми точками вместо белых с чёрными. */
	dark: boolean
) {
	const pad = size * 0.06
	const side = size - pad * 2
	const radius = side * 0.16

	ctx.beginPath()
	ctx.roundRect(x + pad, y + pad, side, side, radius)
	ctx.fillStyle = dark ? '#16181d' : '#ffffff'
	ctx.fill()
	// Обводка нарочно едва заметная. Она одинакова у всех шести граней, то есть
	// добавляет каждой клетке один и тот же тёмный вклад — а полутон здесь и
	// так держится на разнице всего в шесть ступеней, отдавать её рамке жалко.
	ctx.lineWidth = Math.max(1, size * 0.03)
	ctx.strokeStyle = dark ? '#000000' : '#eef1f5'
	ctx.stroke()

	ctx.fillStyle = dark ? '#ffffff' : '#16181d'
	const pipRadius = side * PIP_RADIUS
	for (const [px, py] of PIP_LAYOUT[pips] ?? []) {
		ctx.beginPath()
		ctx.arc(x + pad + side * px, y + pad + side * py, pipRadius, 0, Math.PI * 2)
		ctx.fill()
	}
}

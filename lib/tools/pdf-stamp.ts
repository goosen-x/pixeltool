/**
 * Размещение картинки (подписи или печати) на странице PDF.
 *
 * Вся сложность здесь — в двух системах координат, которые не совпадают.
 * Человек ставит подпись на превью: начало отсчёта в левом верхнем углу, ось
 * Y вниз, как во всём вебе. PDF считает от левого нижнего угла и ось Y вверх.
 * Сверх того у страницы бывает флаг поворота (`/Rotate` у сканов из МФУ —
 * обычное дело): читалка показывает её повёрнутой, а координаты внутри файла
 * остаются от неповёрнутого листа. Если это не учесть, подпись на таком
 * документе уезжает в другой угол и лежит на боку.
 *
 * Поэтому положение хранится долями видимой страницы, а не пикселями превью:
 * доли не зависят ни от масштаба предпросмотра, ни от размера экрана.
 */

export type PageRotation = 0 | 90 | 180 | 270

/** Размер листа в пунктах — как его видит человек, уже с учётом поворота. */
export interface PageSize {
	width: number
	height: number
}

/** Положение на превью: начало отсчёта — левый верхний угол, ось Y вниз. */
export interface VisualRect {
	x: number
	y: number
	width: number
	height: number
}

/** Готовые аргументы для `page.drawImage` из pdf-lib. */
export interface PdfPlacement {
	x: number
	y: number
	width: number
	height: number
	rotate: PageRotation
}

/**
 * Доля видимой страницы: `x`/`y` — левый верхний угол картинки, `width` —
 * ширина. Высота не хранится: она выводится из пропорций самой картинки,
 * иначе подпись растянулась бы и перестала быть похожей на себя.
 */
export interface Placement {
	id: number
	kind: 'signature' | 'stamp'
	imageId: number
	pageNumber: number
	x: number
	y: number
	width: number
}

/** Размер страницы так, как её видно: у повёрнутой на четверть меняются стороны. */
export function visualPageSize(
	size: PageSize,
	rotation: PageRotation
): PageSize {
	return rotation === 90 || rotation === 270
		? { width: size.height, height: size.width }
		: { width: size.width, height: size.height }
}

/**
 * Доли → пункты на видимой странице.
 *
 * `aspect` — отношение ширины картинки к высоте. Высота считается из него,
 * чтобы подпись сохраняла пропорции при любой ширине.
 */
export function toVisualRect(
	placement: Pick<Placement, 'x' | 'y' | 'width'>,
	aspect: number,
	visual: PageSize
): VisualRect {
	const width = placement.width * visual.width
	return {
		x: placement.x * visual.width,
		y: placement.y * visual.height,
		width,
		height: width / aspect
	}
}

/**
 * Перевод в координаты PDF с поправкой на поворот страницы.
 *
 * `size` — неповёрнутый размер листа, тот, что отдаёт pdf-lib. Возвращаемый
 * `rotate` разворачивает саму картинку так, чтобы после поворота страницы
 * читалкой подпись оказалась не на боку.
 *
 * Формулы выведены по четырём случаям и закреплены тестами: проверять их
 * глазами на реальном документе — занятие на полдня, а ошибка в знаке даёт
 * подпись в противоположном углу.
 */
export function toPdfPlacement(
	rect: VisualRect,
	size: PageSize,
	rotation: PageRotation
): PdfPlacement {
	const { width: w, height: h } = rect

	switch (rotation) {
		case 90:
			return { x: rect.y + h, y: rect.x, width: w, height: h, rotate: 90 }
		case 180:
			return {
				x: size.width - rect.x,
				y: rect.y + h,
				width: w,
				height: h,
				rotate: 180
			}
		case 270:
			return {
				x: size.width - rect.y - h,
				y: size.height - rect.x,
				width: w,
				height: h,
				rotate: 270
			}
		default:
			return {
				x: rect.x,
				y: size.height - rect.y - h,
				width: w,
				height: h,
				rotate: 0
			}
	}
}

/**
 * Держит картинку в пределах листа.
 *
 * Без этого подпись, брошенную у самого края, обрезало бы границей страницы —
 * причём на превью она выглядела бы целой, а в скачанном файле оказалась
 * наполовину за листом.
 */
export function clampPlacement(
	placement: Pick<Placement, 'x' | 'y' | 'width'>,
	aspect: number,
	visual: PageSize
): { x: number; y: number; width: number } {
	const width = Math.min(Math.max(placement.width, 0.02), 1)
	// Высота в долях страницы: у высокой печати на широком листе она заметно
	// больше ширины в долях, и ограничивать нужно именно её.
	const heightFraction = (width * visual.width) / aspect / visual.height

	return {
		width,
		x: Math.min(Math.max(placement.x, 0), Math.max(0, 1 - width)),
		y: Math.min(Math.max(placement.y, 0), Math.max(0, 1 - heightFraction))
	}
}

/** Доля ширины страницы, с которой подпись появляется на листе. */
export const DEFAULT_SIGNATURE_WIDTH = 0.28
/** Печать заметно меньше: в жизни оттиск круглый и редко шире трети листа. */
export const DEFAULT_STAMP_WIDTH = 0.2

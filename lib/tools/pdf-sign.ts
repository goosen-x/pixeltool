/**
 * Сборка подписанного документа: врисовывает подготовленные картинки в
 * страницы исходного PDF.
 *
 * Страницы не перерисовываются — картинка добавляется поверх существующего
 * содержимого. Текст остаётся текстом, поиск работает, вес документа растёт
 * ровно на вес самих картинок.
 */

import { loadPdfLib } from './pdf-lib-loader'
import {
	toPdfPlacement,
	toVisualRect,
	visualPageSize,
	type PageRotation,
	type Placement
} from './pdf-stamp'

export interface StampImage {
	/** PNG с прозрачностью. */
	bytes: ArrayBuffer
	/** Отношение ширины к высоте — из него считается высота на странице. */
	aspect: number
}

/**
 * Флаг поворота может прийти любым кратным 90 — в том числе отрицательным
 * или больше полного оборота, спецификация этого не запрещает. Приводим к
 * четырём случаям, которые умеет разбирать `toPdfPlacement`.
 */
export function normalizeRotation(angle: number): PageRotation {
	const normalized = (((Math.round(angle / 90) * 90) % 360) + 360) % 360
	return normalized as PageRotation
}

export async function signPdf(
	source: ArrayBuffer,
	images: Map<number, StampImage>,
	placements: Placement[]
): Promise<Uint8Array> {
	if (placements.length === 0) {
		throw new Error('Нечего ставить — добавьте подпись или печать на страницу')
	}

	const { PDFDocument, degrees } = await loadPdfLib()
	const document = await PDFDocument.load(source.slice(0), {
		ignoreEncryption: true,
		throwOnInvalidObject: false
	})

	// Каждая картинка встраивается один раз, даже если её поставили на десять
	// страниц: иначе документ распух бы кратно числу подписей.
	const embedded = new Map<
		number,
		Awaited<ReturnType<typeof document.embedPng>>
	>()

	for (const placement of placements) {
		const image = images.get(placement.imageId)
		if (!image) continue

		if (!embedded.has(placement.imageId)) {
			embedded.set(placement.imageId, await document.embedPng(image.bytes))
		}

		const page = document.getPage(placement.pageNumber - 1)
		const size = { width: page.getWidth(), height: page.getHeight() }
		const rotation = normalizeRotation(page.getRotation().angle)

		const rect = toVisualRect(
			placement,
			image.aspect,
			visualPageSize(size, rotation)
		)
		const placed = toPdfPlacement(rect, size, rotation)

		page.drawImage(embedded.get(placement.imageId)!, {
			x: placed.x,
			y: placed.y,
			width: placed.width,
			height: placed.height,
			rotate: degrees(placed.rotate)
		})
	}

	return document.save({ useObjectStreams: true })
}

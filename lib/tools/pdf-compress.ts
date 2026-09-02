/**
 * Сжатие PDF в браузере.
 *
 * Способов ровно два, и они не заменяют друг друга — поэтому оба вынесены в
 * интерфейс, а не спрятаны за одной кнопкой «сжать».
 *
 * «Бережно» пересобирает документ: служебные объекты пакуются в потоки,
 * мусор от предыдущих правок не переносится. Текст, ссылки, поиск и выделение
 * остаются как были, но и выигрыш скромный — единицы процентов, а на уже
 * оптимизированном файле и ноль.
 *
 * «Сильно» превращает каждую страницу в JPEG и собирает документ заново из
 * картинок. Так работает большинство онлайн-сжималок, и так получается
 * кратное уменьшение веса — ценой текстового слоя: в результате нельзя ни
 * выделить строку, ни найти слово поиском. Инструмент говорит об этом прямо,
 * а не выдаёт растр за «сжатый документ».
 */

import { loadPdfLib } from './pdf-lib-loader'
import {
	canvasToBlob,
	closePdf,
	openPdf,
	releaseCanvas,
	renderPageToCanvas,
	scaleForDpi
} from './pdf-render'

export type CompressMode = 'lossless' | 'raster'

export interface CompressProgress {
	current: number
	total: number
}

export interface CompressOptions {
	mode: CompressMode
	/** Плотность растеризации, точек на дюйм. Не используется в режиме lossless. */
	dpi: number
	/** Качество JPEG, 0..1. Не используется в режиме lossless. */
	quality: number
	onProgress?: (progress: CompressProgress) => void
	/** Прерывание длинной растеризации, когда человек поменял настройки. */
	signal?: AbortSignal
}

export interface CompressResult {
	bytes: Uint8Array
	pageCount: number
}

export async function compressPdf(
	source: ArrayBuffer,
	options: CompressOptions
): Promise<CompressResult> {
	return options.mode === 'lossless'
		? compressLossless(source, options)
		: compressByRaster(source, options)
}

async function compressLossless(
	source: ArrayBuffer,
	options: CompressOptions
): Promise<CompressResult> {
	const { PDFDocument } = await loadPdfLib()
	const document = await PDFDocument.load(source.slice(0), {
		ignoreEncryption: true,
		// Битые ссылки внутри документа — обычное дело у файлов из старых
		// принтеров и сканеров. Строгий разбор отказал бы работать с ними
		// целиком, хотя открываются они нормально.
		throwOnInvalidObject: false
	})

	options.onProgress?.({ current: 1, total: 1 })

	const bytes = await document.save({ useObjectStreams: true })
	return { bytes, pageCount: document.getPageCount() }
}

async function compressByRaster(
	source: ArrayBuffer,
	options: CompressOptions
): Promise<CompressResult> {
	const { PDFDocument } = await loadPdfLib()
	const pdf = await openPdf(source)
	const output = await PDFDocument.create()
	const scale = scaleForDpi(options.dpi)

	try {
		for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
			if (options.signal?.aborted)
				throw new DOMException('Aborted', 'AbortError')
			options.onProgress?.({ current: pageNumber, total: pdf.numPages })

			const page = await pdf.getPage(pageNumber)
			// Размер страницы в пунктах — при масштабе 1 вьюпорт и есть размер
			// листа, уже с учётом поворота. Новый документ должен повторить его
			// один в один, иначе при печати страницы разъедутся по формату.
			const pageSize = page.getViewport({ scale: 1 })
			const canvas = await renderPageToCanvas(page, scale)

			try {
				const jpeg = await canvasToBlob(canvas, 'image/jpeg', options.quality)
				const image = await output.embedJpg(await jpeg.arrayBuffer())
				const sheet = output.addPage([pageSize.width, pageSize.height])
				sheet.drawImage(image, {
					x: 0,
					y: 0,
					width: pageSize.width,
					height: pageSize.height
				})
			} finally {
				releaseCanvas(canvas)
				page.cleanup()
			}
		}

		const bytes = await output.save({ useObjectStreams: true })
		return { bytes, pageCount: pdf.numPages }
	} finally {
		await closePdf(pdf)
	}
}

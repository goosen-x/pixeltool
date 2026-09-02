/**
 * Растеризация PDF через pdfjs-dist — «сфотографировать» страницу так, как
 * её видит человек.
 *
 * Модуль браузерный: ему нужны canvas и воркер. Загружается динамически из
 * обработчиков, а не импортом на верхнем уровне страницы — pdfjs весит около
 * мегабайта, и тащить его в бандл ради человека, который ещё не выбрал файл,
 * незачем.
 */

import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist'

type PdfjsModule = typeof import('pdfjs-dist/legacy/build/pdf.mjs')

let pdfjsPromise: Promise<PdfjsModule> | null = null

/**
 * Ленивая загрузка pdfjs с настроенным воркером.
 *
 * Разбор PDF — работа на секунды, и в главном потоке она застопорила бы всю
 * страницу: не прокрутить, не нажать «отмена». Воркер выносит её в отдельный
 * поток. Путь до файла воркера собирается через `new URL(..., import.meta.url)`,
 * чтобы сборщик положил его в статику сам и версия воркера всегда совпадала с
 * версией библиотеки — расхождение версий pdfjs ловит и отказывается работать.
 *
 * Берётся именно `legacy`-сборка, и это не перестраховка. Основная сборка
 * pdfjs 6 вызывает `Uint8Array.prototype.toHex()` при чтении идентификатора
 * документа — метод из свежего предложения в стандарт, которого нет ни в
 * одном браузере старше Chrome 140. На таком браузере разбор падает с
 * «toHex is not a function» сразу после выбора файла. Legacy-сборка
 * протранспилирована и приносит полифил, покрывая весь browserslist проекта
 * (Chrome 93, Safari 15.4). Цена — примерно четверть лишнего веса у файла,
 * который и так грузится только по требованию.
 */
export function loadPdfjs(): Promise<PdfjsModule> {
	if (!pdfjsPromise) {
		pdfjsPromise = import('pdfjs-dist/legacy/build/pdf.mjs').then(pdfjs => {
			pdfjs.GlobalWorkerOptions.workerSrc = new URL(
				'pdfjs-dist/legacy/build/pdf.worker.min.mjs',
				import.meta.url
			).toString()
			return pdfjs
		})
	}
	return pdfjsPromise
}

/**
 * Открывает документ для чтения.
 *
 * Байты копируются намеренно: pdfjs забирает переданный буфер во владение и
 * отсоединяет его (`detach`), после чего исходный ArrayBuffer в вызывающем
 * коде становится пустым. Без копии повторное открытие того же файла — а оно
 * случается при каждой смене качества — читало бы ноль байт.
 */
export async function openPdf(
	bytes: ArrayBuffer | Uint8Array
): Promise<PDFDocumentProxy> {
	const pdfjs = await loadPdfjs()
	const copy =
		bytes instanceof Uint8Array ? bytes.slice() : new Uint8Array(bytes.slice(0))

	return pdfjs.getDocument({ data: copy }).promise
}

/**
 * Закрывает документ и гасит воркер.
 *
 * У самого документа метода для этого нет — освобождением владеет задача
 * загрузки, которая его породила (`loadingTask`). Без явного закрытия воркер
 * остаётся жить вместе со всеми разобранными страницами в памяти, и на
 * десятке открытых подряд файлов вкладка распухает.
 */
export function closePdf(pdf: PDFDocumentProxy): Promise<void> {
	return pdf.loadingTask.destroy()
}

/**
 * Предел на сторону холста. Chrome отказывается создавать canvas больше
 * 16384 px по стороне, и делает это молча: контекст просто отдаёт пустую
 * картинку. Ограничиваем сами и уменьшаем масштаб, а не выдаём человеку
 * белый лист.
 */
const MAX_CANVAS_SIDE = 16384

/** Масштаб, при котором страница укладывается в предел холста. */
export function fitScale(page: PDFPageProxy, desiredScale: number): number {
	const base = page.getViewport({ scale: 1 })
	const longestSide = Math.max(base.width, base.height)
	const limit = MAX_CANVAS_SIDE / longestSide
	return Math.min(desiredScale, limit)
}

/** PDF меряет страницу в пунктах: 72 пункта на дюйм. */
export const POINTS_PER_INCH = 72

export function scaleForDpi(dpi: number): number {
	return dpi / POINTS_PER_INCH
}

/**
 * Рисует страницу на новом холсте.
 *
 * Фон pdfjs заливает белым по умолчанию — для JPEG это важно: у него нет
 * прозрачности, и незалитые области ушли бы в чёрный.
 */
export async function renderPageToCanvas(
	page: PDFPageProxy,
	scale: number
): Promise<HTMLCanvasElement> {
	const viewport = page.getViewport({ scale: fitScale(page, scale) })
	const canvas = document.createElement('canvas')
	canvas.width = Math.max(1, Math.floor(viewport.width))
	canvas.height = Math.max(1, Math.floor(viewport.height))

	const context = canvas.getContext('2d')
	if (!context) throw new Error('Браузер не дал холст для отрисовки')

	await page.render({ canvas, viewport }).promise
	return canvas
}

export function canvasToBlob(
	canvas: HTMLCanvasElement,
	type: string,
	quality: number
): Promise<Blob> {
	return new Promise((resolve, reject) => {
		canvas.toBlob(
			blob =>
				blob ? resolve(blob) : reject(new Error('Не удалось собрать картинку')),
			type,
			quality
		)
	})
}

/**
 * Освобождает память под холстом.
 *
 * Сборщик мусора не торопится, а страница на 300 dpi занимает десятки
 * мегабайт: без явного обнуления размеров браузер на документе в сотню
 * страниц упирается в память и падает. Приём известный — обнулённый холст
 * отдаёт буфер немедленно.
 */
export function releaseCanvas(canvas: HTMLCanvasElement): void {
	canvas.width = 0
	canvas.height = 0
}

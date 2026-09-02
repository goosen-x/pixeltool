/**
 * Ленивая загрузка pdf-lib.
 *
 * Библиотека весит около 370 КБ и нужна только после того, как человек выбрал
 * файл, — то есть никогда при первой отрисовке страницы. Статический импорт
 * положил бы её в бандл страницы и утяжелил бы ровно то, что меряет
 * PageSpeed: время до отрисовки и блокировку главного потока на разборе
 * скрипта. Промис запоминается, поэтому второй вызов ничего не грузит.
 */
type PdfLibModule = typeof import('pdf-lib')

let pdfLibPromise: Promise<PdfLibModule> | null = null

export function loadPdfLib(): Promise<PdfLibModule> {
	if (!pdfLibPromise) pdfLibPromise = import('pdf-lib')
	return pdfLibPromise
}

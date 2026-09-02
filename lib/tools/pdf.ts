/**
 * Общее для PDF-инструментов: чтение файла, склейка, растеризация страниц.
 *
 * Две библиотеки делят работу по границе «структура / картинка». pdf-lib
 * разбирает и собирает сам документ (страницы, объекты) и работает в любом
 * окружении, включая тесты в Node. pdfjs-dist умеет только одно, но
 * незаменимое — нарисовать страницу так, как её видит человек; он тянет за
 * собой воркер и canvas, поэтому живёт строго в браузере и подгружается
 * динамически, чтобы не попасть в общий бандл.
 */

/** Верхняя граница на файл. Больше браузер не тянет: весь PDF живёт в памяти
 *  вкладки, и на телефоне вкладка падает молча, без единой ошибки. */
export const MAX_PDF_BYTES = 100 * 1024 * 1024

export interface PdfFileError {
	kind: 'type' | 'size' | 'broken' | 'encrypted' | 'empty'
	message: string
}

/**
 * Проверка файла до чтения — по типу и размеру, без разбора содержимого.
 * Возвращает ошибку, а не бросает: вызывающий код показывает её человеку
 * рядом с файлом, а остальные файлы продолжает обрабатывать.
 */
export function checkPdfFile(file: File): PdfFileError | null {
	const looksLikePdf =
		file.type === 'application/pdf' || /\.pdf$/i.test(file.name)

	if (!looksLikePdf) {
		return { kind: 'type', message: 'Это не PDF' }
	}
	if (file.size > MAX_PDF_BYTES) {
		return {
			kind: 'size',
			message: `Файл больше ${Math.round(MAX_PDF_BYTES / 1024 / 1024)} МБ`
		}
	}
	if (file.size === 0) {
		return { kind: 'empty', message: 'Файл пустой' }
	}
	return null
}

/**
 * Имя результата по именам исходников.
 *
 * Один файл — его же имя с суффиксом, чтобы в папке «Загрузки» результат
 * лежал рядом с оригиналом и был на него похож. Несколько — общее короткое
 * имя: склеивать пять имён в одну строку бессмысленно, такой файл потом
 * невозможно найти глазами.
 *
 * Префикс `pixeltool.pro-` — общий для всех выгрузок сайта (см.
 * `lib/hooks/useImageCompress.ts`). Суффиксы латиницей намеренно: имя файла
 * проходит через файловые системы, архиваторы и почтовые вложения, и
 * кириллица там до сих пор местами превращается в кракозябры.
 */
export function buildOutputName(
	sourceNames: string[],
	suffix: string,
	extension = 'pdf'
): string {
	const base =
		sourceNames.length === 1
			? stripExtension(sourceNames[0])
			: `${sourceNames.length}-files`

	return `pixeltool.pro-${base}-${suffix}.${extension}`
}

export function stripExtension(name: string): string {
	return name.replace(/\.[^.]+$/, '')
}

/**
 * Имя страницы внутри многостраничной выгрузки: `pixeltool.pro-договор-03.jpg`.
 *
 * Номер добивается нулями по длине самого большого номера, иначе файловый
 * менеджер отсортирует 10-ю страницу перед 2-й, и порядок в папке разойдётся
 * с порядком в документе.
 */
export function buildPageName(
	sourceName: string,
	pageNumber: number,
	totalPages: number,
	extension: string
): string {
	const width = String(totalPages).length
	const padded = String(pageNumber).padStart(width, '0')
	return `pixeltool.pro-${stripExtension(sourceName)}-${padded}.${extension}`
}

/**
 * Разбор пользовательского выбора страниц: `1-3, 7, 12-` → [1,2,3,7,12..last].
 *
 * Пустая строка означает «все страницы» — это удобнее, чем заставлять
 * человека писать `1-N`, когда он и так хочет весь документ. Мусор и номера
 * за пределами документа отбрасываются молча: строка набирается на ходу, и
 * ругаться на каждое промежуточное состояние ввода нельзя.
 */
export function parsePageRange(input: string, totalPages: number): number[] {
	const trimmed = input.trim()
	if (!trimmed) return range(1, totalPages)

	const selected = new Set<number>()

	for (const part of trimmed.split(',')) {
		const chunk = part.trim()
		if (!chunk) continue

		const match = chunk.match(/^(\d+)?\s*-\s*(\d+)?$/)
		if (match) {
			const from = match[1] ? Number(match[1]) : 1
			const to = match[2] ? Number(match[2]) : totalPages
			for (const page of range(Math.min(from, to), Math.max(from, to))) {
				if (page >= 1 && page <= totalPages) selected.add(page)
			}
			continue
		}

		if (/^\d+$/.test(chunk)) {
			const page = Number(chunk)
			if (page >= 1 && page <= totalPages) selected.add(page)
		}
	}

	return [...selected].sort((a, b) => a - b)
}

function range(from: number, to: number): number[] {
	const result: number[] = []
	for (let value = from; value <= to; value += 1) result.push(value)
	return result
}

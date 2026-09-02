/**
 * Склейка PDF через pdf-lib. Ни рендеринга, ни браузерных API — модуль
 * работает и в Node, поэтому логика покрыта обычными юнит-тестами.
 */

import type { PDFDocument as PdfDocument } from 'pdf-lib'
import { loadPdfLib } from './pdf-lib-loader'

export interface PdfSource {
	name: string
	bytes: ArrayBuffer | Uint8Array
}

export interface MergeProgress {
	/** Номер файла, который разбирается прямо сейчас, с единицы. */
	current: number
	total: number
	name: string
}

/**
 * Число страниц в документе — для карточки файла до склейки.
 * Возвращает null на файле, который pdf-lib не смог разобрать: страница
 * покажет «не читается», а не упадёт целиком из-за одного битого файла.
 */
export async function readPageCount(
	bytes: ArrayBuffer | Uint8Array
): Promise<number | null> {
	try {
		const { PDFDocument } = await loadPdfLib()
		const document = await PDFDocument.load(bytes, { ignoreEncryption: true })
		return document.getPageCount()
	} catch {
		return null
	}
}

/**
 * Склеивает документы в порядке, в котором они переданы.
 *
 * `ignoreEncryption` включён намеренно: под «шифрованием» у большинства
 * бытовых PDF лежит не пароль на открытие, а пустой владельческий пароль с
 * запретом печати — такой файл открывается любой читалкой, и отказывать в
 * склейке было бы враньём про возможности инструмента. Документ, который
 * действительно требует пароль, pdf-lib всё равно не расшифрует и честно
 * бросит исключение ниже.
 */
export async function mergePdfs(
	sources: PdfSource[],
	onProgress?: (progress: MergeProgress) => void
): Promise<Uint8Array> {
	if (sources.length === 0) {
		throw new Error('Нечего объединять')
	}

	const { PDFDocument } = await loadPdfLib()
	const merged = await PDFDocument.create()

	for (const [index, source] of sources.entries()) {
		onProgress?.({
			current: index + 1,
			total: sources.length,
			name: source.name
		})

		let document: PdfDocument
		try {
			document = await PDFDocument.load(source.bytes, {
				ignoreEncryption: true
			})
		} catch {
			throw new Error(`Не удалось прочитать «${source.name}»`)
		}

		const pages = await merged.copyPages(document, document.getPageIndices())
		for (const page of pages) merged.addPage(page)
	}

	if (merged.getPageCount() === 0) {
		throw new Error('В выбранных файлах нет ни одной страницы')
	}

	// useObjectStreams сжимает служебную часть документа: у склейки из многих
	// файлов таблица объектов заметная, а читается она всеми программами.
	return merged.save({ useObjectStreams: true })
}

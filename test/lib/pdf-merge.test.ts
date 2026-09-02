import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { mergePdfs, readPageCount } from '@/lib/tools/pdf-merge'

/**
 * Документ с заданным числом страниц. Ширина страницы кодирует номер
 * исходника — по ней в склейке видно, чьи страницы куда встали, без
 * разбора содержимого.
 */
async function makePdf(pageCount: number, width: number): Promise<Uint8Array> {
	const document = await PDFDocument.create()
	for (let index = 0; index < pageCount; index += 1) {
		document.addPage([width, 500])
	}
	return document.save()
}

describe('readPageCount', () => {
	it('считает страницы', async () => {
		expect(await readPageCount(await makePdf(3, 300))).toBe(3)
	})

	it('на нечитаемых байтах возвращает null, а не бросает', async () => {
		expect(await readPageCount(new Uint8Array([1, 2, 3, 4]))).toBeNull()
	})
})

describe('mergePdfs', () => {
	it('складывает страницы всех документов', async () => {
		const merged = await mergePdfs([
			{ name: 'a.pdf', bytes: await makePdf(2, 300) },
			{ name: 'b.pdf', bytes: await makePdf(3, 400) }
		])

		expect(await readPageCount(merged)).toBe(5)
	})

	it('сохраняет порядок файлов из списка', async () => {
		const merged = await mergePdfs([
			{ name: 'b.pdf', bytes: await makePdf(1, 400) },
			{ name: 'a.pdf', bytes: await makePdf(2, 300) }
		])

		const document = await PDFDocument.load(merged)
		const widths = document.getPages().map(page => Math.round(page.getWidth()))

		expect(widths).toEqual([400, 300, 300])
	})

	it('переносит размер страницы без изменений', async () => {
		const merged = await mergePdfs([
			{ name: 'a.pdf', bytes: await makePdf(1, 842) }
		])

		const [page] = (await PDFDocument.load(merged)).getPages()
		expect(Math.round(page.getWidth())).toBe(842)
		expect(Math.round(page.getHeight())).toBe(500)
	})

	it('на пустом списке отказывается работать', async () => {
		await expect(mergePdfs([])).rejects.toThrow('Нечего объединять')
	})

	it('называет файл, который не удалось прочитать', async () => {
		await expect(
			mergePdfs([
				{ name: 'ок.pdf', bytes: await makePdf(1, 300) },
				{ name: 'битый.pdf', bytes: new Uint8Array([9, 9, 9]) }
			])
		).rejects.toThrow('битый.pdf')
	})

	it('сообщает о ходе работы по одному разу на файл', async () => {
		const seen: string[] = []
		await mergePdfs(
			[
				{ name: 'a.pdf', bytes: await makePdf(1, 300) },
				{ name: 'b.pdf', bytes: await makePdf(1, 300) }
			],
			progress =>
				seen.push(`${progress.current}/${progress.total} ${progress.name}`)
		)

		expect(seen).toEqual(['1/2 a.pdf', '2/2 b.pdf'])
	})

	it('склейка сама читается как PDF', async () => {
		const merged = await mergePdfs([
			{ name: 'a.pdf', bytes: await makePdf(1, 300) },
			{ name: 'b.pdf', bytes: await makePdf(1, 300) }
		])

		// Заголовок PDF — первые пять байт файла. Без него результат не откроет
		// ни одна читалка, каким бы правильным ни было число страниц.
		expect(new TextDecoder().decode(merged.slice(0, 5))).toBe('%PDF-')
	})
})

describe('compressPdf, бережный режим', () => {
	it('сохраняет все страницы', async () => {
		const { compressPdf } = await import('@/lib/tools/pdf-compress')
		const source = await makePdf(4, 300)

		const result = await compressPdf(toArrayBuffer(source), {
			mode: 'lossless',
			dpi: 150,
			quality: 0.7
		})

		expect(result.pageCount).toBe(4)
		expect(await readPageCount(result.bytes)).toBe(4)
	})

	it('не трогает размер страницы', async () => {
		const { compressPdf } = await import('@/lib/tools/pdf-compress')
		const source = await makePdf(1, 842)

		const result = await compressPdf(toArrayBuffer(source), {
			mode: 'lossless',
			dpi: 150,
			quality: 0.7
		})

		const [page] = (await PDFDocument.load(result.bytes)).getPages()
		expect(Math.round(page.getWidth())).toBe(842)
	})

	it('отдаёт читаемый PDF', async () => {
		const { compressPdf } = await import('@/lib/tools/pdf-compress')
		const result = await compressPdf(toArrayBuffer(await makePdf(1, 300)), {
			mode: 'lossless',
			dpi: 150,
			quality: 0.7
		})

		expect(new TextDecoder().decode(result.bytes.slice(0, 5))).toBe('%PDF-')
	})
})

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
	return bytes.slice().buffer as ArrayBuffer
}

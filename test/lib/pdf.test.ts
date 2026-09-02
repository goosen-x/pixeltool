import { describe, it, expect } from 'vitest'
import {
	buildOutputName,
	buildPageName,
	checkPdfFile,
	parsePageRange,
	stripExtension,
	MAX_PDF_BYTES
} from '@/lib/tools/pdf'

/** File с нужным размером без реального содержимого: конструктору хватает
 *  строки, а size считается по ней. */
function fakeFile(name: string, size: number, type = 'application/pdf'): File {
	return new File([new Uint8Array(size)], name, { type })
}

describe('checkPdfFile', () => {
	it('пропускает PDF по MIME-типу', () => {
		expect(checkPdfFile(fakeFile('договор.pdf', 1024))).toBeNull()
	})

	it('пропускает PDF по расширению, когда система не дала тип', () => {
		expect(checkPdfFile(fakeFile('скан.PDF', 1024, ''))).toBeNull()
	})

	it('отклоняет не-PDF', () => {
		expect(checkPdfFile(fakeFile('фото.jpg', 1024, 'image/jpeg'))?.kind).toBe(
			'type'
		)
	})

	it('отклоняет пустой файл', () => {
		expect(checkPdfFile(fakeFile('пустой.pdf', 0))?.kind).toBe('empty')
	})

	it('отклоняет файл за пределом размера', () => {
		expect(
			checkPdfFile(fakeFile('огромный.pdf', MAX_PDF_BYTES + 1))?.kind
		).toBe('size')
	})

	it('граничный размер ровно по пределу проходит', () => {
		expect(checkPdfFile(fakeFile('ровно.pdf', MAX_PDF_BYTES))).toBeNull()
	})
})

describe('stripExtension', () => {
	it('убирает расширение', () => {
		expect(stripExtension('договор.pdf')).toBe('договор')
	})

	it('снимает только последнее расширение', () => {
		expect(stripExtension('акт.2026.pdf')).toBe('акт.2026')
	})

	it('имя без расширения не трогает', () => {
		expect(stripExtension('договор')).toBe('договор')
	})
})

describe('buildOutputName', () => {
	it('один файл сохраняет своё имя', () => {
		expect(buildOutputName(['договор.pdf'], 'merged')).toBe(
			'pixeltool.pro-договор-merged.pdf'
		)
	})

	it('несколько файлов получают общее короткое имя', () => {
		expect(buildOutputName(['а.pdf', 'б.pdf', 'в.pdf'], 'merged')).toBe(
			'pixeltool.pro-3-files-merged.pdf'
		)
	})

	it('расширение можно поменять', () => {
		expect(buildOutputName(['скан.pdf'], 'pages', 'zip')).toBe(
			'pixeltool.pro-скан-pages.zip'
		)
	})
})

describe('buildPageName', () => {
	it('добивает номер нулями по числу страниц', () => {
		expect(buildPageName('скан.pdf', 3, 120, 'jpg')).toBe(
			'pixeltool.pro-скан-003.jpg'
		)
	})

	it('на однозначном документе нулей не добавляет', () => {
		expect(buildPageName('скан.pdf', 3, 9, 'jpg')).toBe(
			'pixeltool.pro-скан-3.jpg'
		)
	})

	it('сортировка по имени совпадает с порядком страниц', () => {
		const names = [1, 2, 10, 11].map(page =>
			buildPageName('скан.pdf', page, 11, 'jpg')
		)
		expect([...names].sort()).toEqual(names)
	})
})

describe('parsePageRange', () => {
	it('пустая строка означает весь документ', () => {
		expect(parsePageRange('', 3)).toEqual([1, 2, 3])
	})

	it('только пробелы — тоже весь документ', () => {
		expect(parsePageRange('   ', 2)).toEqual([1, 2])
	})

	it('разбирает диапазон и перечисление', () => {
		expect(parsePageRange('1-3, 7', 10)).toEqual([1, 2, 3, 7])
	})

	it('открытый справа диапазон идёт до конца', () => {
		expect(parsePageRange('5-', 7)).toEqual([5, 6, 7])
	})

	it('открытый слева диапазон идёт от первой', () => {
		expect(parsePageRange('-3', 7)).toEqual([1, 2, 3])
	})

	it('перевёрнутый диапазон читается как обычный', () => {
		expect(parsePageRange('5-2', 10)).toEqual([2, 3, 4, 5])
	})

	it('повторы схлопываются, порядок восстанавливается', () => {
		expect(parsePageRange('3, 1-2, 3', 5)).toEqual([1, 2, 3])
	})

	it('номера за пределами документа отбрасываются', () => {
		expect(parsePageRange('2, 99', 3)).toEqual([2])
	})

	it('диапазон обрезается по числу страниц', () => {
		expect(parsePageRange('2-99', 4)).toEqual([2, 3, 4])
	})

	it('мусор игнорируется, а валидная часть остаётся', () => {
		expect(parsePageRange('abc, 2, ,, --', 5)).toEqual([2])
	})

	it('нулевая страница не проходит', () => {
		expect(parsePageRange('0, 1', 3)).toEqual([1])
	})
})

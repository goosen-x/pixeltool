import { describe, it, expect } from 'vitest'
import {
	detectFormat,
	FORMATS,
	getFormat,
	isDecodable,
	outputName
} from '@/lib/tools/image-convert'

const file = (name: string, type = '') =>
	new File([new Uint8Array(8)], name, { type })

describe('справочник форматов', () => {
	it('идентификаторы уникальны', () => {
		expect(new Set(FORMATS.map(f => f.id)).size).toBe(FORMATS.length)
	})

	it('у JPEG нет альфы, у PNG и WebP есть', () => {
		expect(getFormat('image/jpeg')!.alpha).toBe(false)
		expect(getFormat('image/png')!.alpha).toBe(true)
		expect(getFormat('image/webp')!.alpha).toBe(true)
	})

	it('PNG без потерь, JPEG и WebP с потерями', () => {
		expect(getFormat('image/png')!.lossy).toBe(false)
		expect(getFormat('image/jpeg')!.lossy).toBe(true)
		expect(getFormat('image/webp')!.lossy).toBe(true)
	})
})

describe('определение формата файла', () => {
	it('по MIME-типу', () => {
		expect(detectFormat(file('a.png', 'image/png'))?.label).toBe('PNG')
		expect(detectFormat(file('a.webp', 'image/webp'))?.label).toBe('WebP')
	})

	it('по расширению, когда система не дала тип', () => {
		expect(detectFormat(file('photo.jpg'))?.label).toBe('JPG')
		expect(detectFormat(file('photo.webp'))?.label).toBe('WebP')
	})

	it('расширение jpeg приводится к JPG', () => {
		expect(detectFormat(file('photo.jpeg'))?.label).toBe('JPG')
	})

	it('незнакомое расширение не определяется', () => {
		expect(detectFormat(file('photo.tiff'))).toBeNull()
	})
})

describe('читаемость файла', () => {
	it('обычные форматы читаются', () => {
		for (const name of ['a.jpg', 'a.jpeg', 'a.png', 'a.webp', 'a.gif']) {
			expect(isDecodable(file(name, 'image/' + name.split('.')[1]))).toBe(true)
		}
	})

	it('HEIC отсекается — браузер его не декодирует', () => {
		expect(isDecodable(file('IMG_1234.heic', 'image/heic'))).toBe(false)
		expect(isDecodable(file('IMG_1234.heif', 'image/heif'))).toBe(false)
	})

	it('не картинка отсекается', () => {
		expect(isDecodable(file('doc.pdf', 'application/pdf'))).toBe(false)
	})
})

describe('имя результата', () => {
	it('меняет расширение и добавляет префикс сайта', () => {
		expect(outputName('photo.webp', getFormat('image/jpeg')!)).toBe(
			'pixeltool.pro-photo.jpg'
		)
	})

	it('снимает только последнее расширение', () => {
		expect(outputName('отчёт.2026.png', getFormat('image/webp')!)).toBe(
			'pixeltool.pro-отчёт.2026.webp'
		)
	})

	it('имя без расширения не ломается', () => {
		expect(outputName('scan', getFormat('image/png')!)).toBe(
			'pixeltool.pro-scan.png'
		)
	})
})

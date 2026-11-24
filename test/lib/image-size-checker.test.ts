import { describe, it, expect } from 'vitest'
import * as UTIF from 'utif'
import {
	formatBytesRu,
	formatLabel,
	printSizeCm,
	readImageHeader
} from '@/app/tools/(widget)/image-size-checker/read-image-header'

const u16be = (n: number) => [(n >> 8) & 255, n & 255]
const u32be = (n: number) => [
	(n >>> 24) & 255,
	(n >> 16) & 255,
	(n >> 8) & 255,
	n & 255
]
const u16le = (n: number) => [n & 255, (n >> 8) & 255]
const str = (s: string) => [...s].map(c => c.charCodeAt(0))
const bytes = (...parts: number[][]) => new Uint8Array(parts.flat())

/** Бокс ISO BMFF: размер, тип, содержимое. */
const box = (type: string, ...body: number[][]) => {
	const content = body.flat()
	return [...u32be(8 + content.length), ...str(type), ...content]
}

function png(width: number, height: number, ppm?: number) {
	const chunk = (type: string, data: number[]) => [
		...u32be(data.length),
		...str(type),
		...data,
		0,
		0,
		0,
		0
	]
	return bytes(
		[0x89, ...str('PNG'), 0x0d, 0x0a, 0x1a, 0x0a],
		chunk('IHDR', [...u32be(width), ...u32be(height), 8, 6, 0, 0, 0]),
		ppm ? chunk('pHYs', [...u32be(ppm), ...u32be(ppm), 1]) : [],
		chunk('IDAT', [])
	)
}

function jpeg(width: number, height: number, jfifDpi?: number) {
	const app0 = jfifDpi
		? [
				0xff,
				0xe0,
				...u16be(16),
				...str('JFIF'),
				0,
				1,
				1,
				1,
				...u16be(jfifDpi),
				...u16be(jfifDpi),
				0,
				0
			]
		: []
	const sof = [0xff, 0xc2, ...u16be(17), 8, ...u16be(height), ...u16be(width)]
	return bytes([0xff, 0xd8], app0, sof, new Array(12).fill(0))
}

/**
 * HEIC как у айфона: две картинки (плитка 1024×640 и основная сетка
 * 1000×600), основная повёрнута irot на 90°.
 */
function heic(rotate: boolean) {
	const ispe = (w: number, h: number) =>
		box('ispe', [0, 0, 0, 0], u32be(w), u32be(h))
	const ipco = box(
		'ipco',
		ispe(1024, 640), // 1: плитка
		ispe(1000, 600), // 2: основная картинка
		box('irot', [rotate ? 1 : 0]) // 3
	)
	// version 0, flags 0: item_ID u16, связи по байту
	const ipma = box(
		'ipma',
		[0, 0, 0, 0],
		u32be(2),
		u16be(1),
		[1, 0x81],
		u16be(2),
		[2, 0x82, 0x83]
	)
	return bytes(
		box('ftyp', str('heic'), u32be(0), str('mif1heic')),
		box(
			'meta',
			[0, 0, 0, 0],
			box('pitm', [0, 0, 0, 0], u16be(2)),
			box('iprp', ipco, ipma)
		)
	)
}

describe('readImageHeader', () => {
	it('PNG: размеры и dpi из pHYs', () => {
		// 11811 пикселей на метр = 300 dpi
		expect(readImageHeader(png(1200, 800, 11811))).toEqual({
			format: 'PNG',
			width: 1200,
			height: 800,
			dpi: 300
		})
	})

	it('JPEG: размеры из SOF, dpi из JFIF', () => {
		expect(readImageHeader(jpeg(6016, 4016, 72))).toEqual({
			format: 'JPEG',
			width: 6016,
			height: 4016,
			dpi: 72
		})
	})

	it('GIF и BMP', () => {
		const gif = bytes(
			str('GIF89a'),
			u16le(320),
			u16le(240),
			new Array(8).fill(0)
		)
		expect(readImageHeader(gif)).toMatchObject({
			format: 'GIF',
			width: 320,
			height: 240
		})

		const bmp = new Uint8Array(54)
		bmp.set(str('BM'))
		const dv = new DataView(bmp.buffer)
		dv.setInt32(18, 640, true)
		dv.setInt32(22, -480, true) // строки сверху вниз
		dv.setInt32(38, 3780, true) // 96 dpi
		expect(readImageHeader(bmp)).toEqual({
			format: 'BMP',
			width: 640,
			height: 480,
			dpi: 96
		})
	})

	it('WebP с заголовком VP8X', () => {
		const webp = new Uint8Array(30)
		webp.set(str('RIFF'))
		webp.set(str('WEBPVP8X'), 8)
		webp.set([1919 & 255, 1919 >> 8, 0], 24)
		webp.set([1079 & 255, 1079 >> 8, 0], 27)
		expect(readImageHeader(webp)).toEqual({
			format: 'WebP',
			width: 1920,
			height: 1080
		})
	})

	it('TIFF: размеры и dpi из тегов', () => {
		const tiff = new Uint8Array(
			UTIF.encodeImage(new Uint8Array(3 * 2 * 4), 3, 2)
		)
		expect(readImageHeader(tiff)).toMatchObject({
			format: 'TIFF',
			width: 3,
			height: 2
		})
	})

	it('HEIC: берёт основную картинку, а не плитку', () => {
		expect(readImageHeader(heic(false))).toEqual({
			format: 'HEIC',
			width: 1000,
			height: 600
		})
	})

	it('HEIC: поворот на 90° меняет ширину и высоту местами', () => {
		expect(readImageHeader(heic(true))).toEqual({
			format: 'HEIC',
			width: 600,
			height: 1000
		})
	})

	it('не картинка и обрезанный заголовок дают null, а не исключение', () => {
		expect(
			readImageHeader(bytes(str('просто текст, а не картинка')))
		).toBeNull()
		expect(readImageHeader(jpeg(100, 100).slice(0, 8))).toBeNull()
	})
})

describe('подписи', () => {
	it('вес по-русски', () => {
		expect(formatBytesRu(111)).toBe('111 Б')
		expect(formatBytesRu(9344248)).toBe('8,91 МБ')
		expect(formatBytesRu(300 * 1024)).toBe('300 КБ')
	})

	it('формат: SVG вместо SVG+XML, расширение, если MIME пустой', () => {
		expect(formatLabel('image/svg+xml', null)).toBe('SVG')
		expect(formatLabel('image/x-icon', null)).toBe('ICO')
		expect(formatLabel('', null, 'IMG_0001.heic')).toBe('HEIC')
		expect(
			formatLabel('image/png', { format: 'HEIC', width: 1, height: 1 })
		).toBe('HEIC')
	})

	it('печать: 1800 × 1200 при 300 dpi это фото 15 × 10 см', () => {
		expect(printSizeCm(1800, 300)).toBe(15.2)
		expect(printSizeCm(1200, 300)).toBe(10.2)
		expect(printSizeCm(6016, 300)).toBe(50.9)
	})
})

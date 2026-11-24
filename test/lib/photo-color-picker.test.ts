import { describe, it, expect } from 'vitest'
import * as UTIF from 'utif'
import {
	decodeTiff,
	TiffTooLargeError
} from '@/app/tools/(widget)/photo-color-picker/decode-tiff'
import { formatHsl, rgbToHex, rgbToHsl } from '@/lib/utils/color-converter'
import { sniffImageFormat } from '@/lib/utils/image-format'

// 2×1: красный и синий пиксель
const RGBA = new Uint8Array([255, 0, 0, 255, 59, 130, 246, 255])

describe('TIFF', () => {
	it('UTIF-файл распознаётся как TIFF по сигнатуре', async () => {
		const tiff = UTIF.encodeImage(RGBA, 2, 1)
		// в jsdom у Blob нет arrayBuffer(), подставляем его вручную
		const blob = {
			size: tiff.byteLength,
			slice: (from: number, to: number) => ({
				arrayBuffer: async () => tiff.slice(from, to)
			})
		} as unknown as Blob
		expect(await sniffImageFormat(blob)).toBe('tiff')
	})

	it('декодируется в те же пиксели', async () => {
		const decoded = await decodeTiff(UTIF.encodeImage(RGBA, 2, 1))
		expect(decoded.width).toBe(2)
		expect(decoded.height).toBe(1)
		expect(Array.from(decoded.data)).toEqual(Array.from(RGBA))
	})

	it('огромный скан отклоняется заранее, а не роняет вкладку', async () => {
		// заголовок с размерами 10000×10000, данные не нужны: проверка до декода
		const tiff = UTIF.encodeImage(new Uint8Array(4), 1, 1, {
			t256: [10000],
			t257: [10000]
		})
		await expect(decodeTiff(tiff)).rejects.toBeInstanceOf(TiffTooLargeError)
	})

	it('мусор вместо TIFF даёт ошибку', async () => {
		await expect(
			decodeTiff(new Uint8Array([0x49, 0x49, 0x2a, 0, 0, 0, 0, 0]).buffer)
		).rejects.toThrow()
	})
})

// Эталоны сверены с color-hex.com и W3C (CSS Color 4, rgb→hsl)
describe('пересчёт пикселя в форматы', () => {
	it.each([
		[{ r: 59, g: 130, b: 246 }, '#3b82f6', 'hsl(217, 91%, 60%)'],
		[{ r: 255, g: 0, b: 0 }, '#ff0000', 'hsl(0, 100%, 50%)'],
		[{ r: 0, g: 128, b: 0 }, '#008000', 'hsl(120, 100%, 25%)'],
		[{ r: 128, g: 128, b: 128 }, '#808080', 'hsl(0, 0%, 50%)'],
		[{ r: 255, g: 165, b: 0 }, '#ffa500', 'hsl(39, 100%, 50%)']
	])('%o', (rgb, hex, hsl) => {
		expect(rgbToHex(rgb)).toBe(hex)
		expect(formatHsl(rgbToHsl(rgb))).toBe(hsl)
	})
})

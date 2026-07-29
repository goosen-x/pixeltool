import { describe, it, expect } from 'vitest'
import QRCode from 'qrcode'
import { decodeImageData } from '../decode'

// Строим настоящий QR-код через уже имеющуюся в проекте библиотеку qrcode
// (используется в qr-generator) и растеризуем его вручную в RGBA-буфер —
// без canvas/jsdom, чистый Node.
function buildImageData(text: string) {
	const qr = QRCode.create(text, { errorCorrectionLevel: 'M' })
	const { size, data } = qr.modules
	const scale = 4
	const margin = 4 // модулей тихой зоны — jsQR не находит паттерны без неё
	const dimension = (size + margin * 2) * scale

	const pixels = new Uint8ClampedArray(dimension * dimension * 4)
	pixels.fill(255) // белый фон, alpha = 255

	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			if (data[y * size + x] !== 1) continue

			for (let dy = 0; dy < scale; dy++) {
				for (let dx = 0; dx < scale; dx++) {
					const px = (x + margin) * scale + dx
					const py = (y + margin) * scale + dy
					const idx = (py * dimension + px) * 4
					pixels[idx] = 0
					pixels[idx + 1] = 0
					pixels[idx + 2] = 0
					pixels[idx + 3] = 255
				}
			}
		}
	}

	return { data: pixels, width: dimension, height: dimension }
}

describe('decodeImageData', () => {
	it('decodes a QR code back to its original text', () => {
		const imageData = buildImageData('https://pixeltool.pro')
		expect(decodeImageData(imageData)).toBe('https://pixeltool.pro')
	})

	it('returns null when there is no QR code in the image', () => {
		const blank = {
			data: new Uint8ClampedArray(100 * 100 * 4).fill(255),
			width: 100,
			height: 100
		}
		expect(decodeImageData(blank)).toBeNull()
	})
})

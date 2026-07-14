import { describe, it, expect } from 'vitest'
import { buildIco, buildIcoBuffer } from '@/lib/favicon/ico'

/** Минимальная PNG-сигнатура — содержимое кадра нам неважно, важна обёртка. */
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]

function fakePng(length: number): ArrayBuffer {
	const bytes = new Uint8Array(length)
	bytes.set(PNG_SIGNATURE)
	return bytes.buffer
}

function readIco(buffer: ArrayBuffer) {
	return { view: new DataView(buffer), bytes: new Uint8Array(buffer) }
}

describe('buildIco', () => {
	it('пишет корректный заголовок ICONDIR', () => {
		const { view } = readIco(buildIcoBuffer([{ size: 16, png: fakePng(40) }]))

		expect(view.getUint16(0, true)).toBe(0) // reserved
		expect(view.getUint16(2, true)).toBe(1) // тип: иконка
		expect(view.getUint16(4, true)).toBe(1) // один кадр
		expect(buildIco([{ size: 16, png: fakePng(40) }]).type).toBe('image/x-icon')
	})

	it('складывает несколько кадров и указывает на них верные смещения', () => {
		const frames = [
			{ size: 16, png: fakePng(40) },
			{ size: 32, png: fakePng(60) },
			{ size: 48, png: fakePng(80) }
		]
		const buffer = buildIcoBuffer(frames)
		const { view, bytes } = readIco(buffer)

		expect(view.getUint16(4, true)).toBe(3)
		// 6 байт ICONDIR + 3 записи по 16 = данные начинаются с 54-го байта.
		expect(buffer.byteLength).toBe(6 + 16 * 3 + 40 + 60 + 80)

		let expectedOffset = 6 + 16 * 3
		frames.forEach((frame, i) => {
			const entry = 6 + 16 * i
			expect(view.getUint8(entry)).toBe(frame.size)
			expect(view.getUint8(entry + 1)).toBe(frame.size)
			expect(view.getUint16(entry + 6, true)).toBe(32)
			expect(view.getUint32(entry + 8, true)).toBe(frame.png.byteLength)
			expect(view.getUint32(entry + 12, true)).toBe(expectedOffset)

			// По указанному смещению должен лежать именно PNG.
			const signature = Array.from(
				bytes.slice(expectedOffset, expectedOffset + 8)
			)
			expect(signature).toEqual(PNG_SIGNATURE)

			expectedOffset += frame.png.byteLength
		})
	})

	it('записывает размер 256 нулём — в байт он не влезает', () => {
		const { view } = readIco(buildIcoBuffer([{ size: 256, png: fakePng(20) }]))

		expect(view.getUint8(6)).toBe(0)
		expect(view.getUint8(7)).toBe(0)
	})

	it('не собирает пустой файл', () => {
		expect(() => buildIcoBuffer([])).toThrow()
	})
})

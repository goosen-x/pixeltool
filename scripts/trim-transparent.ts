#!/usr/bin/env tsx
/**
 * Обрезка прозрачных полей у PNG.
 *
 *   npx tsx scripts/trim-transparent.ts public/images/categories/*.png
 *   npx tsx scripts/trim-transparent.ts --check file.png   # только показать
 *
 * Зачем свой велосипед: sips (единственный графический инструмент в системе)
 * автообрезку не умеет, а тянуть sharp ради восьми картинок не хочется. Node
 * даёт zlib, а PNG без интерлейса разбирается в полсотни строк.
 *
 * Поддерживается только то, что нам нужно: 8 бит на канал, цветовой тип 6
 * (RGBA), без интерлейса. На остальном честно падаем, а не портим файл молча.
 */

import { readFileSync, writeFileSync } from 'fs'
import { inflateSync, deflateSync } from 'zlib'

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

interface Decoded {
	width: number
	height: number
	/** RGBA, по 4 байта на пиксель. */
	pixels: Buffer
}

/** CRC32 — PNG требует его в каждом чанке. */
const CRC_TABLE = (() => {
	const table = new Uint32Array(256)
	for (let n = 0; n < 256; n++) {
		let c = n
		for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
		table[n] = c >>> 0
	}
	return table
})()

function crc32(buffer: Buffer): number {
	let crc = 0xffffffff
	for (const byte of buffer) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8)
	return (crc ^ 0xffffffff) >>> 0
}

function paeth(a: number, b: number, c: number): number {
	const p = a + b - c
	const pa = Math.abs(p - a)
	const pb = Math.abs(p - b)
	const pc = Math.abs(p - c)
	if (pa <= pb && pa <= pc) return a
	return pb <= pc ? b : c
}

function decode(file: Buffer): Decoded {
	if (!file.subarray(0, 8).equals(PNG_SIGNATURE)) throw new Error('Не PNG')

	let width = 0
	let height = 0
	const idat: Buffer[] = []
	let offset = 8

	while (offset < file.length) {
		const length = file.readUInt32BE(offset)
		const type = file.toString('ascii', offset + 4, offset + 8)
		const data = file.subarray(offset + 8, offset + 8 + length)

		if (type === 'IHDR') {
			width = data.readUInt32BE(0)
			height = data.readUInt32BE(4)
			const depth = data[8]
			const colorType = data[9]
			const interlace = data[12]
			if (depth !== 8 || colorType !== 6 || interlace !== 0) {
				throw new Error(
					`Поддерживается только 8-битный RGBA без интерлейса (получено: depth=${depth}, colorType=${colorType}, interlace=${interlace})`
				)
			}
		} else if (type === 'IDAT') {
			idat.push(data)
		} else if (type === 'IEND') {
			break
		}

		offset += 12 + length
	}

	const raw = inflateSync(Buffer.concat(idat))
	const pixels = Buffer.alloc(width * height * 4)
	const stride = width * 4

	// Снимаем построчные фильтры PNG.
	for (let y = 0; y < height; y++) {
		const filter = raw[y * (stride + 1)]
		const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1))

		for (let x = 0; x < stride; x++) {
			const left = x >= 4 ? pixels[y * stride + x - 4] : 0
			const up = y > 0 ? pixels[(y - 1) * stride + x] : 0
			const upLeft = x >= 4 && y > 0 ? pixels[(y - 1) * stride + x - 4] : 0
			const value = line[x]

			let restored: number
			switch (filter) {
				case 0:
					restored = value
					break
				case 1:
					restored = value + left
					break
				case 2:
					restored = value + up
					break
				case 3:
					restored = value + ((left + up) >> 1)
					break
				case 4:
					restored = value + paeth(left, up, upLeft)
					break
				default:
					throw new Error(`Неизвестный фильтр строки: ${filter}`)
			}

			pixels[y * stride + x] = restored & 0xff
		}
	}

	return { width, height, pixels }
}

function chunk(type: string, data: Buffer): Buffer {
	const length = Buffer.alloc(4)
	length.writeUInt32BE(data.length)
	const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
	const crc = Buffer.alloc(4)
	crc.writeUInt32BE(crc32(body))
	return Buffer.concat([length, body, crc])
}

function encode({ width, height, pixels }: Decoded): Buffer {
	const stride = width * 4
	// Пишем без фильтрации (тип 0): deflate и так сожмёт, а код проще.
	const raw = Buffer.alloc((stride + 1) * height)
	for (let y = 0; y < height; y++) {
		raw[y * (stride + 1)] = 0
		pixels.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
	}

	const ihdr = Buffer.alloc(13)
	ihdr.writeUInt32BE(width, 0)
	ihdr.writeUInt32BE(height, 4)
	ihdr[8] = 8 // бит на канал
	ihdr[9] = 6 // RGBA
	ihdr[10] = 0 // deflate
	ihdr[11] = 0 // адаптивная фильтрация
	ihdr[12] = 0 // без интерлейса

	return Buffer.concat([
		PNG_SIGNATURE,
		chunk('IHDR', ihdr),
		chunk('IDAT', deflateSync(raw, { level: 9 })),
		chunk('IEND', Buffer.alloc(0))
	])
}

/** Границы непрозрачного содержимого. null — картинка пуста целиком. */
function opaqueBounds(
	{ width, height, pixels }: Decoded,
	threshold = 0
): { left: number; top: number; right: number; bottom: number } | null {
	let left = width
	let top = height
	let right = -1
	let bottom = -1

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (pixels[(y * width + x) * 4 + 3] > threshold) {
				if (x < left) left = x
				if (x > right) right = x
				if (y < top) top = y
				if (y > bottom) bottom = y
			}
		}
	}

	return right < 0 ? null : { left, top, right, bottom }
}

function crop(image: Decoded, box: NonNullable<ReturnType<typeof opaqueBounds>>): Decoded {
	const width = box.right - box.left + 1
	const height = box.bottom - box.top + 1
	const pixels = Buffer.alloc(width * height * 4)

	for (let y = 0; y < height; y++) {
		const from = ((y + box.top) * image.width + box.left) * 4
		image.pixels.copy(pixels, y * width * 4, from, from + width * 4)
	}

	return { width, height, pixels }
}

function main(): void {
	const args = process.argv.slice(2)
	const checkOnly = args.includes('--check')
	const files = args.filter(arg => !arg.startsWith('--'))

	if (files.length === 0) {
		console.error('Укажите хотя бы один PNG')
		process.exit(1)
	}

	for (const path of files) {
		const image = decode(readFileSync(path))
		const box = opaqueBounds(image)

		if (!box) {
			console.log(`${path}: целиком прозрачный — пропускаю`)
			continue
		}

		const width = box.right - box.left + 1
		const height = box.bottom - box.top + 1

		if (width === image.width && height === image.height) {
			console.log(`${path}: ${image.width}×${image.height}, прозрачных полей нет`)
			continue
		}

		const trimmed = `${image.width}×${image.height} → ${width}×${height}`

		if (checkOnly) {
			console.log(`${path}: ${trimmed}`)
			continue
		}

		writeFileSync(path, encode(crop(image, box)))
		console.log(`${path}: ${trimmed}`)
	}
}

main()

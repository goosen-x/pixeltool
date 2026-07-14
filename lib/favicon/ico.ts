/**
 * Сборка настоящего .ico из PNG-картинок.
 *
 * Канвас умеет отдавать только png/jpeg/webp, поэтому «ico» нельзя получить
 * простым toDataURL — файл выйдет PNG с чужим расширением. Зато формат ICO
 * разрешает хранить кадры прямо в PNG (так делают с Vista), и такой файл
 * понимают все современные браузеры. Значит достаточно обернуть готовые PNG
 * в заголовок ICO вручную — что здесь и происходит.
 *
 * Раскладка: ICONDIR (6 байт) + по ICONDIRENTRY (16 байт) на кадр + сами PNG.
 */

export interface IcoFrame {
	/** Сторона квадрата в пикселях. В ICO больше 256 не бывает. */
	size: number
	/** Содержимое кадра — готовый PNG. */
	png: ArrayBuffer
}

const ICONDIR_SIZE = 6
const ICONDIRENTRY_SIZE = 16

export function buildIco(frames: IcoFrame[]): Blob {
	return new Blob([buildIcoBuffer(frames)], { type: 'image/x-icon' })
}

export function buildIcoBuffer(frames: IcoFrame[]): ArrayBuffer {
	if (frames.length === 0) {
		throw new Error('Нужен хотя бы один кадр')
	}

	const totalSize =
		ICONDIR_SIZE +
		ICONDIRENTRY_SIZE * frames.length +
		frames.reduce((sum, frame) => sum + frame.png.byteLength, 0)

	const buffer = new ArrayBuffer(totalSize)
	const view = new DataView(buffer)
	const bytes = new Uint8Array(buffer)

	// ICONDIR: reserved = 0, type = 1 (иконка), число кадров.
	view.setUint16(0, 0, true)
	view.setUint16(2, 1, true)
	view.setUint16(4, frames.length, true)

	// Данные кадров идут сразу за таблицей записей.
	let dataOffset = ICONDIR_SIZE + ICONDIRENTRY_SIZE * frames.length

	frames.forEach((frame, index) => {
		const entry = ICONDIR_SIZE + ICONDIRENTRY_SIZE * index

		// 256 записывается нулём — в байт оно не влезает.
		view.setUint8(entry, frame.size >= 256 ? 0 : frame.size)
		view.setUint8(entry + 1, frame.size >= 256 ? 0 : frame.size)
		view.setUint8(entry + 2, 0) // палитра не используется
		view.setUint8(entry + 3, 0) // reserved
		view.setUint16(entry + 4, 1, true) // color planes
		view.setUint16(entry + 6, 32, true) // бит на пиксель
		view.setUint32(entry + 8, frame.png.byteLength, true)
		view.setUint32(entry + 12, dataOffset, true)

		bytes.set(new Uint8Array(frame.png), dataOffset)
		dataOffset += frame.png.byteLength
	})

	return buffer
}

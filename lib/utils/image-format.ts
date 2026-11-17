/**
 * Формат картинки по первым байтам файла, а не по расширению и MIME.
 *
 * MIME у HEIC часто пустой или врёт (Android отдаёт фото с айфона как
 * image/png или без типа вовсе), поэтому смотрим в сам файл.
 */
export type SniffedFormat = 'heic' | 'tiff' | 'empty' | 'other'

const HEIC_BRANDS = new Set([
	'heic',
	'heix',
	'heim',
	'heis',
	'hevc',
	'hevx',
	'mif1',
	'msf1'
])

export async function sniffImageFormat(file: Blob): Promise<SniffedFormat> {
	if (file.size === 0) return 'empty'
	const head = new Uint8Array(await file.slice(0, 16).arrayBuffer())
	const ascii = (from: number, to: number) =>
		String.fromCharCode(...head.subarray(from, to))
	// ISO BMFF: размер бокса, затем «ftyp» и основной бренд
	if (ascii(4, 8) === 'ftyp' && HEIC_BRANDS.has(ascii(8, 12))) return 'heic'
	if (
		(head[0] === 0x49 &&
			head[1] === 0x49 &&
			head[2] === 0x2a &&
			head[3] === 0) ||
		(head[0] === 0x4d && head[1] === 0x4d && head[2] === 0 && head[3] === 0x2a)
	)
		return 'tiff'
	return 'other'
}

/**
 * HEIC в ImageBitmap через libheif (WebAssembly). Нативно HEIC открывает
 * только Safari, Chrome и Android не умеют. Библиотека весит около 1,5 МБ,
 * поэтому грузится отдельным чанком только при первом HEIC-файле.
 */
export async function decodeHeic(file: Blob): Promise<ImageBitmap> {
	const { heicTo } = await import('heic-to')
	return heicTo({ blob: file, type: 'bitmap' })
}

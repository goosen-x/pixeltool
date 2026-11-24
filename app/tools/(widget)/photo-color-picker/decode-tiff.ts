/**
 * TIFF в RGBA через UTIF.js. Нативно TIFF открывает только Safari, а
 * Chrome, Firefox и Android отказывают. Чаще всего в TIFF приходят сканы
 * документов (часто чёрно-белые, со сжатием CCITT G4), UTIF их понимает.
 * Библиотека грузится отдельным чанком только при первом TIFF-файле.
 */

// A4 при 600 dpi это ~35 млн пикселей. Больше в память вкладки на телефоне
// уже не влезает: один только RGBA-буфер такого скана весит около 150 МБ.
const MAX_TIFF_PIXELS = 40_000_000

export interface DecodedTiff {
	width: number
	height: number
	data: Uint8ClampedArray<ArrayBuffer>
}

export class TiffTooLargeError extends Error {}

export async function decodeTiff(buffer: ArrayBuffer): Promise<DecodedTiff> {
	const UTIF = await import('utif')
	const ifds = UTIF.decode(buffer)
	// Многостраничный скан: берём первую страницу, у которой есть размеры.
	const page = ifds.find(
		ifd => Array.isArray(ifd.t256) && Array.isArray(ifd.t257)
	)
	if (!page) throw new Error('В TIFF нет изображения')

	const width = (page.t256 as number[])[0]
	const height = (page.t257 as number[])[0]
	if (!width || !height) throw new Error('Изображение пустое')
	if (width * height > MAX_TIFF_PIXELS) throw new TiffTooLargeError()

	UTIF.decodeImage(buffer, page, ifds)
	const rgba = UTIF.toRGBA8(page)
	if (rgba.length < width * height * 4) {
		throw new Error('TIFF декодирован не полностью')
	}
	return {
		width,
		height,
		// копия в свой ArrayBuffer: ImageData не принимает чужой срез буфера
		data: new Uint8ClampedArray(rgba.subarray(0, width * height * 4))
	}
}

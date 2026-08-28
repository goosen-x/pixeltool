/**
 * Сжатие изображения через canvas — общая логика для compress-image и
 * панели сжатия внутри image-size-checker (components/tools/ImageCompressPanel.tsx).
 */

export type OutputFormat = 'image/jpeg' | 'image/webp'

export const EXTENSIONS: Record<OutputFormat, string> = {
	'image/jpeg': 'jpg',
	'image/webp': 'webp'
}

export interface CompressResult {
	blob: Blob
	width: number
	height: number
}

function loadImage(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new window.Image()
		img.onload = () => resolve(img)
		img.onerror = () => reject(new Error('Не удалось прочитать изображение'))
		img.src = url
	})
}

/**
 * JPEG не поддерживает альфа-канал — прозрачные области без подложки
 * превращаются в чёрный. Заливаем белым перед отрисовкой, как делают
 * все похожие конвертеры. Заливка передаётся сюда, а не делается в
 * вызывающем коде: canvas должен быть залит ДО отрисовки фото поверх, а
 * не после.
 *
 * На телефонах декод больших фото через <img> иногда «успевает» отдать
 * onload раньше, чем данные реально готовы — canvas после drawImage
 * остаётся пустым или битым без единой ошибки. createImageBitmap
 * декодирует до готового результата (или честно бросает исключение) и
 * заодно разворачивает фото по EXIF-ориентации, которую canvas сам не
 * учитывает. Тот же фикс, что раньше сделали в photo-color-picker.
 */
export async function decodeToCanvas(
	file: File,
	canvas: HTMLCanvasElement,
	fillWhite: boolean
): Promise<{ width: number; height: number }> {
	const draw = (
		ctx: CanvasRenderingContext2D,
		width: number,
		height: number,
		source: CanvasImageSource
	) => {
		if (fillWhite) {
			ctx.fillStyle = '#ffffff'
			ctx.fillRect(0, 0, width, height)
		}
		ctx.drawImage(source, 0, 0)
	}

	if (typeof createImageBitmap === 'function') {
		const bitmap = await createImageBitmap(file, {
			imageOrientation: 'from-image'
		})
		if (bitmap.width === 0 || bitmap.height === 0) {
			bitmap.close()
			throw new Error('Изображение пустое')
		}
		// width/height — в переменные ДО close(): у ImageBitmap.close() эти
		// поля обнуляются сразу после вызова (спека), а не только освобождается
		// память. Раньше return читал их уже после close() и всегда получал
		// 0×0 — сама картинка сжималась верно (canvas успевал отрисоваться
		// строкой выше), только отображаемый размер был враньём.
		const { width, height } = bitmap
		canvas.width = width
		canvas.height = height
		draw(canvas.getContext('2d')!, width, height, bitmap)
		bitmap.close()
		return { width, height }
	}

	// Старые браузеры без createImageBitmap — прежний путь через <img>.
	const objectUrl = URL.createObjectURL(file)
	try {
		const img = await loadImage(objectUrl)
		if (img.naturalWidth === 0 || img.naturalHeight === 0) {
			throw new Error('Изображение пустое')
		}
		canvas.width = img.naturalWidth
		canvas.height = img.naturalHeight
		draw(canvas.getContext('2d')!, img.naturalWidth, img.naturalHeight, img)
		return { width: img.naturalWidth, height: img.naturalHeight }
	} finally {
		URL.revokeObjectURL(objectUrl)
	}
}

export async function compressImage(
	file: File,
	format: OutputFormat,
	quality: number
): Promise<CompressResult> {
	const canvas = document.createElement('canvas')
	const { width, height } = await decodeToCanvas(
		file,
		canvas,
		format === 'image/jpeg'
	)

	const blob = await new Promise<Blob>((resolve, reject) => {
		canvas.toBlob(
			blob => (blob ? resolve(blob) : reject(new Error('Не удалось сжать'))),
			format,
			quality / 100
		)
	})
	return { blob, width, height }
}

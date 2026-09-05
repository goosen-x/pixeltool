/**
 * Смена формата изображения через canvas.
 *
 * Браузер умеет декодировать JPEG, PNG, WebP и GIF нативно, а кодировать —
 * в JPEG, PNG и WebP. Поэтому конвертация между ними не требует ни библиотек,
 * ни сервера: картинка рисуется на холсте и заново кодируется в нужный
 * формат. Ровно тот же приём, что в compress-image, только цель другая.
 *
 * Чего здесь сознательно нет: HEIC. Фотографии с айфона Chrome и Firefox не
 * декодируют вовсе, и для них нужен WASM-декодер весом больше мегабайта.
 * Тащить его сюда ради формата, который поддерживает только Safari, значит
 * утяжелить страницу для всех остальных.
 */

export type ImageFormat = 'image/jpeg' | 'image/png' | 'image/webp'

export interface FormatInfo {
	id: ImageFormat
	/** Как формат называют люди. */
	label: string
	extension: string
	/** Сохраняет ли прозрачность. */
	alpha: boolean
	lossy: boolean
}

export const FORMATS: FormatInfo[] = [
	{
		id: 'image/jpeg',
		label: 'JPG',
		extension: 'jpg',
		alpha: false,
		lossy: true
	},
	{
		id: 'image/png',
		label: 'PNG',
		extension: 'png',
		alpha: true,
		lossy: false
	},
	{
		id: 'image/webp',
		label: 'WebP',
		extension: 'webp',
		alpha: true,
		lossy: true
	}
]

export function getFormat(id: string): FormatInfo | undefined {
	return FORMATS.find(f => f.id === id)
}

/** Формат исходного файла по его MIME-типу или расширению. */
export function detectFormat(file: File): FormatInfo | null {
	const byType = FORMATS.find(f => f.id === file.type)
	if (byType) return byType

	const ext = file.name.split('.').pop()?.toLowerCase()
	if (ext === 'jpeg') return getFormat('image/jpeg') ?? null
	return FORMATS.find(f => f.extension === ext) ?? null
}

/** Читается ли файл браузером вообще. */
export function isDecodable(file: File): boolean {
	if (file.type.startsWith('image/')) {
		// HEIC приходит как image/heic или image/heif и штатно не декодируется
		return !/hei[cf]/i.test(file.type)
	}
	return /\.(jpe?g|png|webp|gif|bmp)$/i.test(file.name)
}

export interface ConvertResult {
	blob: Blob
	width: number
	height: number
}

/**
 * Перерисовывает картинку в новом формате.
 *
 * У JPEG нет альфа-канала, и прозрачные области без подложки уходят в чёрный.
 * Поэтому холст под него заливается белым до отрисовки, а не после — тот же
 * фикс, что в image-compress. Цвет подложки можно поменять: под тёмную тему
 * сайта белый прямоугольник иногда хуже, чем нужный фон.
 */
export async function convertImage(
	file: File,
	target: ImageFormat,
	options: { quality?: number; background?: string } = {}
): Promise<ConvertResult> {
	const { quality = 0.92, background = '#ffffff' } = options

	const bitmap = await createImageBitmap(file)
	// Размеры запоминаем сразу: ниже bitmap закрывается, а холст обнуляется
	// ради памяти, и после этого оба отдают нули.
	const width = bitmap.width
	const height = bitmap.height

	const canvas = document.createElement('canvas')
	canvas.width = width
	canvas.height = height

	const context = canvas.getContext('2d')
	if (!context) {
		bitmap.close()
		throw new Error('Браузер не дал холст для отрисовки')
	}

	const info = getFormat(target)
	if (info && !info.alpha) {
		context.fillStyle = background
		context.fillRect(0, 0, canvas.width, canvas.height)
	}

	context.drawImage(bitmap, 0, 0)
	bitmap.close()

	const blob = await new Promise<Blob>((resolve, reject) => {
		canvas.toBlob(
			result =>
				result
					? resolve(result)
					: reject(new Error('Не удалось перекодировать')),
			target,
			quality
		)
	})

	// Освобождаем память сразу: на серии больших фото браузер иначе распухает
	canvas.width = 0
	canvas.height = 0

	return { blob, width, height }
}

/** Имя результата: исходное имя со сменённым расширением. */
export function outputName(originalName: string, target: FormatInfo): string {
	const base = originalName.replace(/\.[^.]+$/, '')
	return `pixeltool.pro-${base}.${target.extension}`
}

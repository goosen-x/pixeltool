/**
 * Подготовка картинки подписи или печати к постановке на документ.
 *
 * Две задачи, обе про то, чтобы оттиск лёг на страницу как настоящий, а не
 * заплаткой. Первая — убрать белый фон: скан подписи почти всегда приходит
 * белым прямоугольником, и без этого он закрыл бы собой текст под собой.
 * Вторая — обрезать пустые поля, чтобы размер на странице задавала сама
 * подпись, а не случайные отступы вокруг неё.
 */

/**
 * Считается ли точка фоном.
 *
 * Порог берётся с запасом: скан белого листа почти никогда не белый по-
 * настоящему — бумага уходит в серый и жёлтый, а сжатие JPEG добавляет
 * разброс вокруг границ. Отдельно требуется, чтобы канал не был цветным:
 * без этой проверки в фон уходила бы светло-жёлтая бумага вместе с бледной
 * синей печатью, а печать как раз трогать нельзя.
 */
export function isBackgroundPixel(
	r: number,
	g: number,
	b: number,
	threshold: number
): boolean {
	if (r < threshold || g < threshold || b < threshold) return false
	const max = Math.max(r, g, b)
	const min = Math.min(r, g, b)
	return max - min <= 32
}

/** Порог по умолчанию — светлее этого считается бумагой. */
export const DEFAULT_BACKGROUND_THRESHOLD = 230

/**
 * Делает светлый фон прозрачным прямо в переданном холсте.
 *
 * Прозрачность выставляется плавно, а не в ноль по порогу: резкая отсечка
 * оставляет вокруг штриха ступенчатую кромку, которая на белом листе
 * незаметна, а на документе бросается в глаза.
 */
export function removeBackground(
	canvas: HTMLCanvasElement,
	threshold = DEFAULT_BACKGROUND_THRESHOLD
): void {
	const context = canvas.getContext('2d', { willReadFrequently: true })
	if (!context) return

	const image = context.getImageData(0, 0, canvas.width, canvas.height)
	const { data } = image

	for (let i = 0; i < data.length; i += 4) {
		const r = data[i]
		const g = data[i + 1]
		const b = data[i + 2]

		if (isBackgroundPixel(r, g, b, threshold)) {
			data[i + 3] = 0
			continue
		}

		// Полутон между штрихом и бумагой: чем светлее точка, тем прозрачнее.
		const lightness = (r + g + b) / 3
		if (lightness > threshold - 60) {
			const ratio = (threshold - lightness) / 60
			data[i + 3] = Math.round(data[i + 3] * Math.min(1, Math.max(0, ratio)))
		}
	}

	context.putImageData(image, 0, 0)
}

/**
 * Границы непрозрачной части холста. null — если не осталось ни одной
 * видимой точки: пустой лист вместо подписи ставить на документ незачем.
 */
export function findContentBounds(
	canvas: HTMLCanvasElement
): { left: number; top: number; right: number; bottom: number } | null {
	const context = canvas.getContext('2d', { willReadFrequently: true })
	if (!context) return null

	const { data } = context.getImageData(0, 0, canvas.width, canvas.height)
	let left = canvas.width
	let top = canvas.height
	let right = -1
	let bottom = -1

	for (let y = 0; y < canvas.height; y += 1) {
		for (let x = 0; x < canvas.width; x += 1) {
			// Совсем бледные точки за содержимое не считаем, иначе рамку
			// раздувает случайный мусор от сжатия по краям скана.
			if (data[(y * canvas.width + x) * 4 + 3] > 8) {
				if (x < left) left = x
				if (x > right) right = x
				if (y < top) top = y
				if (y > bottom) bottom = y
			}
		}
	}

	return right < 0 ? null : { left, top, right, bottom }
}

/** Обрезает пустые поля вокруг содержимого, оставляя небольшой отступ. */
export function trimCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement {
	const bounds = findContentBounds(canvas)
	if (!bounds) return canvas

	const padding = 4
	const left = Math.max(0, bounds.left - padding)
	const top = Math.max(0, bounds.top - padding)
	const width = Math.min(canvas.width - left, bounds.right - left + padding + 1)
	const height = Math.min(
		canvas.height - top,
		bounds.bottom - top + padding + 1
	)

	const trimmed = document.createElement('canvas')
	trimmed.width = Math.max(1, width)
	trimmed.height = Math.max(1, height)

	const context = trimmed.getContext('2d')
	if (context) {
		context.drawImage(canvas, left, top, width, height, 0, 0, width, height)
	}
	return trimmed
}

export function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
	return new Promise((resolve, reject) => {
		canvas.toBlob(
			blob =>
				blob ? resolve(blob) : reject(new Error('Не удалось сохранить')),
			'image/png'
		)
	})
}

/** Рисует загруженный файл на холст — дальше с ним работают как с рисунком. */
export async function fileToCanvas(file: File): Promise<HTMLCanvasElement> {
	const bitmap = await createImageBitmap(file)
	const canvas = document.createElement('canvas')
	canvas.width = bitmap.width
	canvas.height = bitmap.height

	const context = canvas.getContext('2d')
	if (!context) throw new Error('Браузер не дал холст для отрисовки')

	context.drawImage(bitmap, 0, 0)
	bitmap.close()
	return canvas
}

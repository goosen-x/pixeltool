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

/** Темнее этого «бумага» уже не бумага, а штрих или тёмная фотография. */
const MIN_PAPER_LIGHTNESS = 120

/** Доля прозрачных точек, после которой картинку считаем уже вырезанной. */
const TRANSPARENT_SHARE = 0.01

/** Цвет бумаги в блоке: 90-й процентиль по каждому каналу. Штрих занимает
 *  малую часть блока, поэтому верхние значения дают именно бумагу, а не
 *  самую яркую соринку. */
function paperOf(r: number[], g: number[], b: number[]): number[] | null {
	if (r.length === 0) return null
	const pick = (values: number[]) => {
		values.sort((a, z) => a - z)
		return values[Math.floor((values.length - 1) * 0.9)]
	}
	return [pick(r), pick(g), pick(b)]
}

const lightnessOf = (color: number[]) => (color[0] + color[1] + color[2]) / 3

/**
 * Выравнивает бумагу до белого: каждая точка делится на цвет бумаги вокруг
 * неё. Работает прямо в массиве RGBA.
 *
 * Подпись чаще всего фотографируют телефоном, а не сканируют. Бумага на
 * таком снимке выходит серой (180–210 вместо 255), да ещё с перепадом света
 * от угла к углу, и порог «светлее 230 — фон» её не берёт: на документ
 * ложится серый прямоугольник. Сканерные приложения решают это так же —
 * оценивают фон по участкам и нормируют на него. У чистого скана бумага и
 * так белая, деление на 255 ничего не меняет.
 *
 * Картинку с готовой прозрачностью не трогаем: фона в ней уже нет, а
 * оценка «бумаги» по одним штрихам превратила бы их в белое.
 */
export function flattenPaper(
	data: Uint8ClampedArray,
	width: number,
	height: number
): void {
	let transparent = 0
	for (let i = 3; i < data.length; i += 4) if (data[i] < 250) transparent += 1
	if (transparent > width * height * TRANSPARENT_SHARE) return

	const block = Math.max(16, Math.round(Math.max(width, height) / 24))
	const cols = Math.ceil(width / block)
	const rows = Math.ceil(height / block)

	const all: number[][] = [[], [], []]
	const raw: (number[] | null)[] = []
	for (let by = 0; by < rows; by += 1) {
		for (let bx = 0; bx < cols; bx += 1) {
			const r: number[] = []
			const g: number[] = []
			const b: number[] = []
			for (let y = by * block; y < Math.min(height, (by + 1) * block); y += 1) {
				for (
					let x = bx * block;
					x < Math.min(width, (bx + 1) * block);
					x += 1
				) {
					const i = (y * width + x) * 4
					r.push(data[i])
					g.push(data[i + 1])
					b.push(data[i + 2])
					// Для общей оценки хватает каждой четвёртой точки.
					if ((x & 3) === 0 && (y & 3) === 0) {
						all[0].push(data[i])
						all[1].push(data[i + 1])
						all[2].push(data[i + 2])
					}
				}
			}
			raw.push(paperOf(r, g, b))
		}
	}

	const global = paperOf(all[0], all[1], all[2])
	// Тёмный снимок целиком — бумаги на нём не видно, нормировать не на что.
	if (!global || lightnessOf(global) < MIN_PAPER_LIGHTNESS) return

	// Блок, целиком закрытый штрихом, берёт бумагу у самого светлого соседа;
	// если и рядом бумаги нет — общую по картинке.
	const paper: number[][] = []
	for (let by = 0; by < rows; by += 1) {
		for (let bx = 0; bx < cols; bx += 1) {
			let best: number[] | null = null
			for (let dy = -1; dy <= 1; dy += 1) {
				for (let dx = -1; dx <= 1; dx += 1) {
					const nx = bx + dx
					const ny = by + dy
					if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue
					const candidate = raw[ny * cols + nx]
					if (
						candidate &&
						(!best || lightnessOf(candidate) > lightnessOf(best))
					)
						best = candidate
				}
			}
			paper.push(
				best && lightnessOf(best) >= MIN_PAPER_LIGHTNESS ? best : global
			)
		}
	}

	// Между центрами блоков цвет бумаги интерполируется, иначе на перепаде
	// света проступила бы сетка из квадратов.
	for (let y = 0; y < height; y += 1) {
		const fy = Math.min(Math.max((y + 0.5) / block - 0.5, 0), rows - 1)
		const y0 = Math.floor(fy)
		const y1 = Math.min(y0 + 1, rows - 1)
		const ty = fy - y0
		for (let x = 0; x < width; x += 1) {
			const fx = Math.min(Math.max((x + 0.5) / block - 0.5, 0), cols - 1)
			const x0 = Math.floor(fx)
			const x1 = Math.min(x0 + 1, cols - 1)
			const tx = fx - x0
			const a = paper[y0 * cols + x0]
			const b = paper[y0 * cols + x1]
			const c = paper[y1 * cols + x0]
			const d = paper[y1 * cols + x1]
			const i = (y * width + x) * 4
			for (let ch = 0; ch < 3; ch += 1) {
				const level =
					(a[ch] * (1 - tx) + b[ch] * tx) * (1 - ty) +
					(c[ch] * (1 - tx) + d[ch] * tx) * ty
				if (level > 0)
					data[i + ch] = Math.min(255, (data[i + ch] * 255) / level)
			}
		}
	}
}

/** Больше этого по длинной стороне картинку не держим: подпись на листе
 *  занимает несколько сантиметров, а 12-мегапиксельное фото с телефона
 *  раздуло бы документ на мегабайты. */
export const MAX_IMAGE_SIDE = 1600

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

	flattenPaper(data, canvas.width, canvas.height)

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
export async function fileToCanvas(
	file: File,
	maxSide = MAX_IMAGE_SIDE
): Promise<HTMLCanvasElement> {
	const bitmap = await createImageBitmap(file)
	const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
	const canvas = document.createElement('canvas')
	canvas.width = Math.max(1, Math.round(bitmap.width * scale))
	canvas.height = Math.max(1, Math.round(bitmap.height * scale))

	const context = canvas.getContext('2d')
	if (!context) throw new Error('Браузер не дал холст для отрисовки')

	context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
	bitmap.close()
	return canvas
}

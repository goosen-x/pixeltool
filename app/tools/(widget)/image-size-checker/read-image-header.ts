/**
 * Размеры и DPI картинки прямо из заголовка файла, без декодирования.
 *
 * Зачем: Chrome, Firefox и Android не открывают HEIC (фото с айфона) и TIFF,
 * а раньше на такие файлы тул отвечал «Это не изображения». Ширина и высота
 * лежат в первых байтах файла, картинку для этого рисовать не нужно.
 * Заодно отсюда берётся DPI, которого браузер через <img> не отдаёт вовсе.
 */

export type HeaderFormat =
	| 'JPEG'
	| 'PNG'
	| 'GIF'
	| 'WebP'
	| 'BMP'
	| 'TIFF'
	| 'HEIC'
	| 'AVIF'

export interface ImageHeader {
	format: HeaderFormat
	width: number
	height: number
	/** Точек на дюйм, если файл это записал. */
	dpi?: number
}

const ascii = (b: Uint8Array, from: number, len: number) =>
	String.fromCharCode(...b.subarray(from, from + len))

function view(b: Uint8Array) {
	return new DataView(b.buffer, b.byteOffset, b.byteLength)
}

function roundDpi(value: number): number | undefined {
	if (!Number.isFinite(value) || value <= 0) return undefined
	return Math.round(value)
}

/** Смещение IFD0 в TIFF-структуре, если она начинается с `start`. */
export function tiffIfdOffset(b: Uint8Array, start = 0): number | null {
	if (b.length < start + 8) return null
	const order = ascii(b, start, 2)
	if (order !== 'II' && order !== 'MM') return null
	const le = order === 'II'
	const dv = view(b)
	if (dv.getUint16(start + 2, le) !== 42) return null
	return start + dv.getUint32(start + 4, le)
}

interface TiffTags {
	width?: number
	height?: number
	dpi?: number
}

/**
 * Читает IFD0 TIFF-структуры: и самого TIFF-файла, и EXIF внутри JPEG
 * (там та же структура, смещения считаются от её начала).
 */
function readTiffIfd0(b: Uint8Array, start: number): TiffTags | null {
	const ifd = tiffIfdOffset(b, start)
	if (ifd === null || ifd + 2 > b.length) return null
	const le = ascii(b, start, 2) === 'II'
	const dv = view(b)
	const count = dv.getUint16(ifd, le)
	const tags: TiffTags = {}
	let xRes: number | undefined
	let unit = 2 // по умолчанию дюймы

	for (let i = 0; i < count; i++) {
		const e = ifd + 2 + i * 12
		if (e + 12 > b.length) break
		const tag = dv.getUint16(e, le)
		const type = dv.getUint16(e + 2, le)
		// SHORT (3) лежит в первых двух байтах поля значения, LONG (4) в четырёх
		const num = () =>
			type === 3 ? dv.getUint16(e + 8, le) : dv.getUint32(e + 8, le)

		if (tag === 0x0100) tags.width = num()
		else if (tag === 0x0101) tags.height = num()
		else if (tag === 0x0128) unit = num()
		else if (tag === 0x011a && type === 5) {
			const at = start + dv.getUint32(e + 8, le)
			if (at + 8 <= b.length) {
				const den = dv.getUint32(at + 4, le)
				if (den) xRes = dv.getUint32(at, le) / den
			}
		}
	}

	if (xRes !== undefined) {
		if (unit === 2) tags.dpi = roundDpi(xRes)
		else if (unit === 3) tags.dpi = roundDpi(xRes * 2.54)
	}
	return tags
}

function parsePng(b: Uint8Array): ImageHeader | null {
	const dv = view(b)
	if (b.length < 24 || ascii(b, 12, 4) !== 'IHDR') return null
	const res: ImageHeader = {
		format: 'PNG',
		width: dv.getUint32(16),
		height: dv.getUint32(20)
	}
	// pHYs идёт до IDAT; пикселей на метр, unit 1 = метр
	let p = 8
	while (p + 12 <= b.length) {
		const len = dv.getUint32(p)
		const type = ascii(b, p + 4, 4)
		if (type === 'pHYs' && p + 17 <= b.length) {
			if (b[p + 16] === 1) res.dpi = roundDpi(dv.getUint32(p + 8) * 0.0254)
			break
		}
		if (type === 'IDAT' || type === 'IEND') break
		p += 12 + len
	}
	return res
}

function parseJpeg(b: Uint8Array): ImageHeader | null {
	const dv = view(b)
	let p = 2
	let dpi: number | undefined
	while (p + 4 <= b.length) {
		if (b[p] !== 0xff) return null
		const marker = b[p + 1]
		// заполнители 0xFF между маркерами
		if (marker === 0xff) {
			p++
			continue
		}
		const len = dv.getUint16(p + 2)
		if (
			marker === 0xe0 &&
			ascii(b, p + 4, 5) === 'JFIF\0' &&
			dpi === undefined
		) {
			const units = b[p + 11]
			const x = p + 14 <= b.length ? dv.getUint16(p + 12) : 0
			if (units === 1) dpi = roundDpi(x)
			else if (units === 2) dpi = roundDpi(x * 2.54)
		} else if (marker === 0xe1 && ascii(b, p + 4, 6) === 'Exif\0\0') {
			// у камер JFIF обычно нет, разрешение записано в EXIF
			const segment = b.subarray(0, Math.min(b.length, p + 2 + len))
			const exif = readTiffIfd0(segment, p + 10)
			if (exif?.dpi !== undefined) dpi = exif.dpi
		}
		const isSof =
			marker >= 0xc0 &&
			marker <= 0xcf &&
			marker !== 0xc4 &&
			marker !== 0xc8 &&
			marker !== 0xcc
		if (isSof) {
			if (p + 9 > b.length) return null
			return {
				format: 'JPEG',
				height: dv.getUint16(p + 5),
				width: dv.getUint16(p + 7),
				dpi
			}
		}
		p += 2 + len
	}
	return null
}

function parseWebp(b: Uint8Array): ImageHeader | null {
	if (b.length < 30) return null
	const chunk = ascii(b, 12, 4)
	if (chunk === 'VP8X') {
		const u24 = (o: number) => b[o] | (b[o + 1] << 8) | (b[o + 2] << 16)
		return { format: 'WebP', width: 1 + u24(24), height: 1 + u24(27) }
	}
	if (chunk === 'VP8L') {
		const b0 = b[21]
		const b1 = b[22]
		const b2 = b[23]
		const b3 = b[24]
		return {
			format: 'WebP',
			width: 1 + (((b1 & 0x3f) << 8) | b0),
			height: 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6))
		}
	}
	if (chunk === 'VP8 ') {
		const dv = view(b)
		return {
			format: 'WebP',
			width: dv.getUint16(26, true) & 0x3fff,
			height: dv.getUint16(28, true) & 0x3fff
		}
	}
	return null
}

function parseBmp(b: Uint8Array): ImageHeader | null {
	if (b.length < 26) return null
	const dv = view(b)
	const res: ImageHeader = {
		format: 'BMP',
		width: Math.abs(dv.getInt32(18, true)),
		// отрицательная высота значит «строки сверху вниз», не размер
		height: Math.abs(dv.getInt32(22, true))
	}
	if (b.length >= 42) res.dpi = roundDpi(dv.getInt32(38, true) * 0.0254)
	return res
}

const HEIF_BRANDS = new Set([
	'heic',
	'heix',
	'heim',
	'heis',
	'hevc',
	'hevx',
	'mif1',
	'msf1',
	'avif',
	'avis'
])

/**
 * HEIC и AVIF: контейнер ISO BMFF. Размер лежит в свойстве ispe внутри
 * meta → iprp → ipco, но таких свойств несколько: у превью, у каждой плитки
 * сетки и у самой картинки. Какое из них основное, говорят pitm (номер
 * главной картинки) и ipma (какие свойства к какой картинке относятся).
 * Поворот irot на 90° или 270° меняет ширину с высотой местами.
 */
function parseHeif(b: Uint8Array): ImageHeader | null {
	const dv = view(b)
	const brand = ascii(b, 8, 4)
	const props: { type: string; at: number; end: number }[] = []
	const assoc = new Map<number, number[]>()
	let primary: number | null = null

	const walk = (from: number, to: number) => {
		let p = from
		while (p + 8 <= to) {
			let size = dv.getUint32(p)
			const type = ascii(b, p + 4, 4)
			let header = 8
			if (size === 1) {
				if (p + 16 > to) return
				size = Number(dv.getBigUint64(p + 8))
				header = 16
			} else if (size === 0) size = to - p
			if (size < header) return
			const end = Math.min(p + size, to)
			const body = p + header

			if (type === 'meta') walk(body + 4, end)
			else if (type === 'iprp') walk(body, end)
			else if (type === 'ipco') {
				let q = body
				while (q + 8 <= end) {
					const psize = dv.getUint32(q)
					if (psize < 8) break
					props.push({
						type: ascii(b, q + 4, 4),
						at: q + 8,
						end: Math.min(q + psize, end)
					})
					q += psize
				}
			} else if (type === 'pitm') {
				primary =
					b[body] === 0 ? dv.getUint16(body + 4) : dv.getUint32(body + 4)
			} else if (type === 'ipma') {
				const version = b[body]
				const wide = (b[body + 3] & 1) === 1
				const count = dv.getUint32(body + 4)
				let q = body + 8
				for (let i = 0; i < count && q < end; i++) {
					const item = version < 1 ? dv.getUint16(q) : dv.getUint32(q)
					q += version < 1 ? 2 : 4
					const n = b[q++]
					const list: number[] = []
					for (let j = 0; j < n; j++) {
						list.push(wide ? dv.getUint16(q) & 0x7fff : b[q] & 0x7f)
						q += wide ? 2 : 1
					}
					assoc.set(item, list)
				}
			}
			p += size
		}
	}
	walk(0, b.length)

	const sizeOf = (prop: { at: number; end: number }) =>
		prop.at + 12 <= prop.end
			? { w: dv.getUint32(prop.at + 4), h: dv.getUint32(prop.at + 8) }
			: null

	let size: { w: number; h: number } | null = null
	let rotated = false
	const own = primary !== null ? assoc.get(primary) : undefined
	if (own) {
		for (const index of own) {
			const prop = props[index - 1]
			if (!prop) continue
			if (prop.type === 'ispe') size = sizeOf(prop)
			else if (prop.type === 'irot' && prop.at < prop.end) {
				const angle = b[prop.at] & 3
				rotated = angle === 1 || angle === 3
			}
		}
	}
	// Связи не прочитались (обрезанный заголовок): берём самое большое ispe
	if (!size) {
		for (const prop of props) {
			if (prop.type !== 'ispe') continue
			const s = sizeOf(prop)
			if (s && (!size || s.w * s.h > size.w * size.h)) size = s
		}
	}
	if (!size) return null
	const format: HeaderFormat = brand.startsWith('avi') ? 'AVIF' : 'HEIC'
	return rotated
		? { format, width: size.h, height: size.w }
		: { format, width: size.w, height: size.h }
}

/** Разбирает начало файла. `null`, если формат не опознан или заголовок обрезан. */
export function readImageHeader(b: Uint8Array): ImageHeader | null {
	try {
		if (b.length < 12) return null
		if (b[0] === 0x89 && ascii(b, 1, 3) === 'PNG') return parsePng(b)
		if (b[0] === 0xff && b[1] === 0xd8) return parseJpeg(b)
		if (ascii(b, 0, 4) === 'GIF8') {
			const dv = view(b)
			return {
				format: 'GIF',
				width: dv.getUint16(6, true),
				height: dv.getUint16(8, true)
			}
		}
		if (ascii(b, 0, 4) === 'RIFF' && ascii(b, 8, 4) === 'WEBP')
			return parseWebp(b)
		if (ascii(b, 0, 2) === 'BM') return parseBmp(b)
		if (ascii(b, 4, 4) === 'ftyp' && HEIF_BRANDS.has(ascii(b, 8, 4)))
			return parseHeif(b)
		if (tiffIfdOffset(b) !== null) {
			const t = readTiffIfd0(b, 0)
			if (!t?.width || !t.height) return null
			return { format: 'TIFF', width: t.width, height: t.height, dpi: t.dpi }
		}
	} catch {
		// битый заголовок: DataView вышел за границы
	}
	return null
}

const HEAD_BYTES = 1024 * 1024

/**
 * Читает заголовок из File. Обычно хватает первого мегабайта; у TIFF
 * таблица тегов может лежать в конце файла, тогда читаем файл целиком.
 */
export async function readImageHeaderFromFile(
	file: Blob
): Promise<ImageHeader | null> {
	const head = new Uint8Array(await file.slice(0, HEAD_BYTES).arrayBuffer())
	const ifd = tiffIfdOffset(head)
	if (ifd !== null && ifd + 2 >= head.length && file.size > head.length) {
		return readImageHeader(new Uint8Array(await file.arrayBuffer()))
	}
	return readImageHeader(head)
}

/** Сантиметры при печати: пиксели / dpi × 2,54. */
export function printSizeCm(px: number, dpi: number): number {
	return Math.round((px / dpi) * 2.54 * 10) / 10
}

/** «8,91 МБ», «111 Б»: единицы по-русски, дробная часть через запятую. */
export function formatBytesRu(bytes: number): string {
	if (bytes <= 0) return '0 Б'
	const units = ['Б', 'КБ', 'МБ', 'ГБ']
	const i = Math.min(
		units.length - 1,
		Math.floor(Math.log(bytes) / Math.log(1024))
	)
	const value = parseFloat((bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 2))
	return `${value.toLocaleString('ru-RU')} ${units[i]}`
}

/** Подпись формата: из заголовка, иначе из MIME («svg+xml» → «SVG»). */
export function formatLabel(
	mime: string,
	header: ImageHeader | null,
	fileName = ''
): string {
	if (header) return header.format
	const sub = mime.split('/')[1]?.toLowerCase() ?? ''
	if (sub.startsWith('svg')) return 'SVG'
	if (sub === 'x-icon' || sub === 'vnd.microsoft.icon') return 'ICO'
	if (sub) return sub.toUpperCase()
	const ext = fileName.split('.').pop()
	return ext && ext !== fileName ? ext.toUpperCase() : '—'
}

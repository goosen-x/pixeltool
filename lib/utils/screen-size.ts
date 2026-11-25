/**
 * Размеры экрана по диагонали.
 *
 * Диагональ телевизора указывают в дюймах, а ниша под него меряют в
 * сантиметрах — и это не одно преобразование, а два. Перевести дюймы в
 * сантиметры мало: 32 дюйма это 81,3 см по диагонали, но в стену такой
 * телевизор упирается шириной 70,8 см. Чтобы получить ширину и высоту, нужно
 * соотношение сторон, и без него линейный конвертер на вопрос не отвечает.
 */

export const CM_PER_INCH = 2.54

export interface AspectRatio {
	id: string
	name: string
	w: number
	h: number
	hint?: string
}

export const ASPECT_RATIOS: AspectRatio[] = [
	{ id: '16-9', name: '16:9', w: 16, h: 9, hint: 'телевизоры и мониторы' },
	{ id: '16-10', name: '16:10', w: 16, h: 10, hint: 'рабочие мониторы' },
	{ id: '21-9', name: '21:9', w: 64, h: 27, hint: 'ультраширокие' },
	{ id: '4-3', name: '4:3', w: 4, h: 3, hint: 'старые телевизоры' },
	{ id: '3-2', name: '3:2', w: 3, h: 2, hint: 'ноутбуки и планшеты' },
	{ id: '1-1', name: '1:1', w: 1, h: 1, hint: 'квадратные' }
]

export function getRatio(id: string): AspectRatio | undefined {
	return ASPECT_RATIOS.find(r => r.id === id)
}

export interface ScreenSize {
	/** Диагональ в дюймах — как её пишут в характеристиках. */
	diagonalInches: number
	diagonalCm: number
	widthCm: number
	heightCm: number
	widthInches: number
	heightInches: number
	/** Площадь экрана в квадратных сантиметрах. */
	areaCm2: number
}

/**
 * Стороны по диагонали и соотношению.
 *
 * Диагональ прямоугольника со сторонами в отношении w:h делится на них по
 * теореме Пифагора: если ширина равна w·k, а высота h·k, то диагональ
 * равна k·√(w² + h²). Отсюда k, а из него обе стороны.
 */
export function screenSize(
	diagonalInches: number,
	ratio: AspectRatio
): ScreenSize | null {
	if (!Number.isFinite(diagonalInches) || diagonalInches <= 0) return null

	const norm = Math.sqrt(ratio.w * ratio.w + ratio.h * ratio.h)
	const k = diagonalInches / norm

	const widthInches = k * ratio.w
	const heightInches = k * ratio.h
	const widthCm = widthInches * CM_PER_INCH
	const heightCm = heightInches * CM_PER_INCH

	return {
		diagonalInches,
		diagonalCm: diagonalInches * CM_PER_INCH,
		widthCm,
		heightCm,
		widthInches,
		heightInches,
		areaCm2: widthCm * heightCm
	}
}

/** Ходовые диагонали телевизоров — строки справочной таблицы. */
export const COMMON_DIAGONALS = [24, 28, 32, 40, 43, 50, 55, 65, 75, 85, 98]

/**
 * Плотность пикселей, если известно разрешение. Не всем нужна, но именно она
 * отвечает на вопрос «не будет ли видно пикселей с дивана».
 */
export function pixelDensity(
	diagonalInches: number,
	pixelsWide: number,
	pixelsHigh: number
): number | null {
	if (diagonalInches <= 0 || pixelsWide <= 0 || pixelsHigh <= 0) return null
	const diagonalPixels = Math.sqrt(
		pixelsWide * pixelsWide + pixelsHigh * pixelsHigh
	)
	return diagonalPixels / diagonalInches
}

/**
 * Рекомендуемое расстояние до телевизора, метры: от и до.
 *
 * Нижняя граница — примерно там, где перестаёт быть видна пиксельная сетка
 * (глаз различает около одной угловой минуты): у Full HD это полторы
 * диагонали, у 4K пиксели вдвое мельче, и садиться можно на диагональ.
 * Дальше верхней границы разрешение уже не используется: детали 4K с трёх
 * метров от 55 дюймов не отличить от Full HD. Отсюда ходовые диапазоны
 * 1–1,5 диагонали для 4K и 1,5–2,5 для Full HD. Ориентир, а не норматив.
 */
export function viewingRangeM(
	diagonalInches: number,
	is4k: boolean
): { min: number; max: number } {
	const [from, to] = is4k ? [1, 1.5] : [1.5, 2.5]
	const diagonalM = (diagonalInches * CM_PER_INCH) / 100
	return { min: diagonalM * from, max: diagonalM * to }
}

/**
 * Обратная задача: самая большая диагональ, экран которой не шире заданного.
 * Нужна для вопроса «какой телевизор встанет в нишу шириной N см».
 */
export function diagonalForWidth(
	widthCm: number,
	ratio: AspectRatio
): number | null {
	if (!Number.isFinite(widthCm) || widthCm <= 0) return null
	const norm = Math.sqrt(ratio.w * ratio.w + ratio.h * ratio.h)
	return ((widthCm / CM_PER_INCH) * norm) / ratio.w
}

/**
 * «32 дюйма», «55 дюймов», «21 дюйм», «55,5 дюйма»: у дробного числа
 * существительное всегда в родительном единственного.
 */
export function inchesWord(value: number): string {
	if (!Number.isInteger(value)) return 'дюйма'
	const mod10 = value % 10
	const mod100 = value % 100
	if (mod100 >= 11 && mod100 <= 14) return 'дюймов'
	if (mod10 === 1) return 'дюйм'
	if (mod10 >= 2 && mod10 <= 4) return 'дюйма'
	return 'дюймов'
}

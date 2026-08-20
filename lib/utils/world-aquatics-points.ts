/**
 * Очки World Aquatics (бывш. FINA) — кубическая формула:
 * P = 1000 × (B / T)³, где B — базовое время (1000 очков), T — время пловца.
 * Очки округляются вниз до целого — так считает официальный калькулятор.
 */
export function calculatePoints(baseTime: number, swimTime: number): number {
	if (swimTime <= 0) return 0
	return Math.floor(1000 * Math.pow(baseTime / swimTime, 3))
}

/** Обратная формула: время, необходимое для заданного числа очков. */
export function calculateTimeForPoints(
	baseTime: number,
	points: number
): number {
	if (points <= 0) return Infinity
	return baseTime / Math.cbrt(points / 1000)
}

/**
 * Минуты/секунды/сотые из отдельных полей ввода в общее число секунд.
 * null — если поля не образуют корректное время (в т.ч. когда всё пусто).
 */
export function parseSwimTime(
	minutes: string,
	seconds: string,
	hundredths: string
): number | null {
	if (
		!/^\d*$/.test(minutes) ||
		!/^\d*$/.test(seconds) ||
		!/^\d*$/.test(hundredths)
	) {
		return null
	}
	if (seconds.trim() === '' && hundredths.trim() === '') return null

	const m = minutes.trim() === '' ? 0 : Number(minutes)
	const s = seconds.trim() === '' ? 0 : Number(seconds)
	const h = hundredths.trim() === '' ? 0 : Number(hundredths)
	if (s > 59) return null

	return m * 60 + s + h / 100
}

/** Секунды обратно в м:сс.сотые (без минут, если время меньше минуты). */
export function formatSwimTime(totalSeconds: number): string {
	let minutes = Math.floor(totalSeconds / 60)
	let seconds = Math.floor(totalSeconds - minutes * 60)
	let hundredths = Math.round((totalSeconds - minutes * 60 - seconds) * 100)

	if (hundredths === 100) {
		hundredths = 0
		seconds += 1
	}
	if (seconds === 60) {
		seconds = 0
		minutes += 1
	}

	const pad = (n: number) => String(n).padStart(2, '0')
	return minutes > 0
		? `${minutes}:${pad(seconds)}.${pad(hundredths)}`
		: `${seconds}.${pad(hundredths)}`
}

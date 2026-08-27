/**
 * Смещение конкретной зоны относительно UTC в минутах на заданный момент
 * времени. Через Intl.DateTimeFormat, а не через хардкод чисел, некоторые
 * зоны переходят на летнее время, и фиксированное число раз в год врало бы.
 */
export function getOffsetMinutes(timeZone: string, date: Date): number {
	const parts = new Intl.DateTimeFormat('en-US', {
		timeZone,
		hourCycle: 'h23',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	}).formatToParts(date)

	const value: Record<string, string> = {}
	for (const part of parts) value[part.type] = part.value

	const asUtc = Date.UTC(
		Number(value.year),
		Number(value.month) - 1,
		Number(value.day),
		Number(value.hour),
		Number(value.minute),
		Number(value.second)
	)

	return Math.round((asUtc - date.getTime()) / 60000)
}

/** Разница смещений двух зон в минутах, положительная означает, что вторая зона впереди. */
export function offsetDifferenceMinutes(
	fromZone: string,
	toZone: string,
	date: Date
): number {
	return getOffsetMinutes(toZone, date) - getOffsetMinutes(fromZone, date)
}

/**
 * Переводит время «ЧЧ:ММ по часам fromZone, сегодня» в момент UTC. Два
 * прохода нужны на случай, если сам момент перехода на летнее время
 * приходится ровно на эту дату, редкий край, но два часовых пояса рядом
 * почти гарантированно рано или поздно на него наткнутся.
 */
export function wallTimeToUtc(
	hours: number,
	minutes: number,
	timeZone: string,
	referenceDate: Date
): Date {
	const y = referenceDate.getFullYear()
	const m = referenceDate.getMonth()
	const d = referenceDate.getDate()

	let guess = Date.UTC(y, m, d, hours, minutes)
	const offset1 = getOffsetMinutes(timeZone, new Date(guess))
	guess -= offset1 * 60000

	const offset2 = getOffsetMinutes(timeZone, new Date(guess))
	if (offset2 !== offset1) {
		guess = Date.UTC(y, m, d, hours, minutes) - offset2 * 60000
	}

	return new Date(guess)
}

/** Текущее время зоны как «ЧЧ:ММ, день недели, число месяц». */
export function formatZonedNow(timeZone: string, date: Date): string {
	return new Intl.DateTimeFormat('ru-RU', {
		timeZone,
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
		weekday: 'short',
		day: 'numeric',
		month: 'short'
	}).format(date)
}

/** Время в конкретной зоне для инстанта, только ЧЧ:ММ. */
export function formatZonedTime(timeZone: string, date: Date): string {
	return new Intl.DateTimeFormat('ru-RU', {
		timeZone,
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	}).format(date)
}

/**
 * Разница в календарных днях между датой инстанта в toZone и в fromZone,
 * нужна, чтобы показать «на следующий день» при конвертации времени через
 * смещение больше нескольких часов.
 */
export function dayShift(
	instant: Date,
	fromZone: string,
	toZone: string
): number {
	const dayOf = (tz: string) => {
		const parts = new Intl.DateTimeFormat('en-US', {
			timeZone: tz,
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		}).formatToParts(instant)
		const value: Record<string, string> = {}
		for (const part of parts) value[part.type] = part.value
		return Date.UTC(
			Number(value.year),
			Number(value.month) - 1,
			Number(value.day)
		)
	}

	return Math.round((dayOf(toZone) - dayOf(fromZone)) / 86400000)
}

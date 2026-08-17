function isoDate(date: Date): string {
	return date.toISOString().slice(0, 10)
}

export function todayViewKey(toolId: string, now: Date = new Date()): string {
	return `pixeltool:viewed:${toolId}:${isoDate(now)}`
}

export function ratedKey(toolId: string): string {
	return `pixeltool:rated:${toolId}`
}

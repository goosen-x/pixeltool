function isoDate(date: Date): string {
	return date.toISOString().slice(0, 10)
}

export function todayViewKey(postId: string, now: Date = new Date()): string {
	return `pixeltool:blog-viewed:${postId}:${isoDate(now)}`
}

export function ratedKey(postId: string): string {
	return `pixeltool:blog-rated:${postId}`
}

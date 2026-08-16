export function formatBytes(bytes: number): string {
	if (bytes === 0) return '0 Б'

	const units = ['Б', 'КБ', 'МБ', 'ГБ']
	const k = 1024
	const i = Math.min(
		units.length - 1,
		Math.floor(Math.log(bytes) / Math.log(k))
	)
	const value = Math.round((bytes / Math.pow(k, i)) * 10) / 10

	return `${value} ${units[i]}`
}

export function percentSaved(
	originalBytes: number,
	compressedBytes: number
): number {
	if (originalBytes <= 0) return 0
	return Math.round((1 - compressedBytes / originalBytes) * 100)
}

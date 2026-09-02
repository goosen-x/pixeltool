/**
 * Отдать пользователю готовый файл.
 *
 * Приём стандартный: временная ссылка на blob, программное нажатие, отзыв
 * ссылки. Отзывать сразу после click() безопасно — браузер к этому моменту
 * уже забрал данные себе; ровно так же сделано в `useImageCompress`.
 */
export function downloadBlob(blob: Blob, filename: string): void {
	const url = URL.createObjectURL(blob)
	const link = document.createElement('a')
	link.href = url
	link.download = filename
	link.click()
	URL.revokeObjectURL(url)
}

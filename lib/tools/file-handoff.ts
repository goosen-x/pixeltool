/**
 * Передача файла между тулами без сервера и без localStorage — File нельзя
 * сериализовать в строку, а хранить дата-URL мегабайтного фото в
 * localStorage/sessionStorage дорого и не нужно, раз оба тула живут в одной
 * вкладке. `window`, а не переменная модуля — единственный объект,
 * гарантированно общий для обеих страниц независимо от того, как Next.js
 * бандлит их чанки.
 *
 * Значение не стирается при первом же чтении: в dev-режиме Next.js страница
 * назначения может смонтироваться несколько раз подряд (React StrictMode
 * плюс дозагрузка/компиляция ещё не открытого маршрута), и «съесть один раз»
 * означало, что файл доставался фантомному промежуточному монтированию, а не
 * тому, что реально увидел пользователь — сжималка оставалась пустой. Вместо
 * этого файл сам протухает по таймеру: несколько секунд с запасом на любые
 * повторные монтирования, но не настолько долго, чтобы случайный более
 * поздний заход на страницу подхватил чужой старый файл.
 */
const TTL_MS = 10_000

let pendingFile: File | null = null
let expiryTimer: ReturnType<typeof setTimeout> | null = null

export function setHandoffFile(file: File): void {
	pendingFile = file
	if (expiryTimer) clearTimeout(expiryTimer)
	expiryTimer = setTimeout(() => {
		pendingFile = null
	}, TTL_MS)
}

export function takeHandoffFile(): File | null {
	return pendingFile
}

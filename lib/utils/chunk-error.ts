const CHUNK_ERROR_PATTERN =
	/ChunkLoadError|Loading chunk [\w-]+ failed|Failed to fetch dynamically imported module/i

export function isChunkLoadError(message: string): boolean {
	return CHUNK_ERROR_PATTERN.test(message)
}

// Один reload за сессию — иначе реально сломанный деплой (не просто
// устаревший чанк) зациклил бы вкладку в бесконечных перезагрузках.
export function reloadOnceForChunkError(): void {
	const RELOAD_FLAG = 'chunk-error-reload'
	if (sessionStorage.getItem(RELOAD_FLAG)) return
	sessionStorage.setItem(RELOAD_FLAG, '1')
	window.location.reload()
}

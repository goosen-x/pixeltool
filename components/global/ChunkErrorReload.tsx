'use client'

import { useEffect } from 'react'
import { isChunkLoadError, reloadOnceForChunkError } from '@/lib/utils/chunk-error'

// После каждого деплоя хеши статических файлов меняются, а старый билд
// не остаётся на диске — у пользователя с открытой вкладкой следующий
// клиентский переход запрашивает JS/CSS чанк, которого уже нет, и ловит
// 404. Один принудительный reload чинит это: новая HTML-страница подтянет
// актуальные чанки. Ловит ошибки вне React (например, сам `<script>` не
// загрузился) — то, что React перехватывает через error boundary, чинит
// app/error.tsx тем же хелпером.
export function ChunkErrorReload() {
	useEffect(() => {
		function handleError(event: ErrorEvent) {
			if (isChunkLoadError(event.message)) reloadOnceForChunkError()
		}

		function handleRejection(event: PromiseRejectionEvent) {
			const reason = event.reason
			const message =
				reason instanceof Error ? reason.message : String(reason)
			if (isChunkLoadError(message)) reloadOnceForChunkError()
		}

		window.addEventListener('error', handleError)
		window.addEventListener('unhandledrejection', handleRejection)

		return () => {
			window.removeEventListener('error', handleError)
			window.removeEventListener('unhandledrejection', handleRejection)
		}
	}, [])

	return null
}

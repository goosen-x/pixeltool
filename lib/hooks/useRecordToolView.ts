'use client'

import { useEffect } from 'react'
import { useToolStatsContext } from '@/components/providers/ToolStatsProvider'
import { todayViewKey } from '@/lib/tool-stats/storage-keys'

/** Засчитывает один просмотр тула в день — вызывать один раз на странице
 *  самого тула, не в списках/карточках. */
export function useRecordToolView(toolId: string): void {
	const { applyView } = useToolStatsContext()

	useEffect(() => {
		const key = todayViewKey(toolId)

		let alreadyViewedToday: boolean
		try {
			alreadyViewedToday = localStorage.getItem(key) !== null
		} catch {
			alreadyViewedToday = false
		}

		if (alreadyViewedToday) return

		fetch('/api/tool-stats', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ toolId, action: 'view' })
		})
			.then(response => (response.ok ? response.json() : null))
			.then((data: { views: number } | null) => {
				if (!data) return
				applyView(toolId, data.views)
				try {
					localStorage.setItem(key, '1')
				} catch {
					// приватный режим — просто не запомнится
				}
			})
			.catch(() => {
				// сеть недоступна — тихо пропускаем, это не критичная функция
			})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [toolId])
}

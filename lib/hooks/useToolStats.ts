'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useToolStatsContext } from '@/components/providers/ToolStatsProvider'
import { ratedKey } from '@/lib/tool-stats/storage-keys'

export function useToolStats(toolId: string) {
	const { stats, applyRating } = useToolStatsContext()
	const [hasVoted, setHasVoted] = useState(false)

	useEffect(() => {
		try {
			setHasVoted(localStorage.getItem(ratedKey(toolId)) !== null)
		} catch {
			setHasVoted(false)
		}
	}, [toolId])

	async function vote(value: 1 | 2 | 3 | 4 | 5) {
		try {
			const response = await fetch('/api/tool-stats', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ toolId, action: 'rate', value })
			})

			if (!response.ok) {
				const message = await response
					.json()
					.then((data: { error?: string }) => data.error)
					.catch(() => undefined)
				toast.error(message ?? 'Не удалось отправить оценку')
				return false
			}

			const data: { rating: number; ratingCount: number } =
				await response.json()
			applyRating(toolId, data.rating, data.ratingCount)

			try {
				localStorage.setItem(ratedKey(toolId), String(value))
			} catch {
				// приватный режим — не критично
			}
			setHasVoted(true)
			return true
		} catch {
			toast.error('Не удалось отправить оценку')
			return false
		}
	}

	async function sendFeedback(rating: 1 | 2 | 3, comment: string) {
		try {
			const response = await fetch('/api/tool-stats', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ toolId, action: 'feedback', rating, comment })
			})

			if (!response.ok) {
				toast.error('Не удалось отправить отзыв')
				return false
			}

			return true
		} catch {
			toast.error('Не удалось отправить отзыв')
			return false
		}
	}

	const entry = stats[toolId]

	return {
		views: entry?.views ?? 0,
		rating: entry?.rating ?? 0,
		ratingCount: entry?.ratingCount ?? 0,
		hasVoted,
		vote,
		sendFeedback
	}
}

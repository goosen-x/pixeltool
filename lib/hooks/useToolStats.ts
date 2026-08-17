'use client'

import { useEffect, useState } from 'react'
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
		const response = await fetch('/api/tool-stats', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ toolId, action: 'rate', value })
		})

		if (!response.ok) return

		const data: { rating: number; ratingCount: number } = await response.json()
		applyRating(toolId, data.rating, data.ratingCount)

		try {
			localStorage.setItem(ratedKey(toolId), String(value))
		} catch {
			// приватный режим — не критично
		}
		setHasVoted(true)
	}

	const entry = stats[toolId]

	return {
		views: entry?.views ?? 0,
		rating: entry?.rating ?? 0,
		ratingCount: entry?.ratingCount ?? 0,
		hasVoted,
		vote
	}
}

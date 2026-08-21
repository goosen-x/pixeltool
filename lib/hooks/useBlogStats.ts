'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ratedKey, todayViewKey } from '@/lib/blog-stats/storage-keys'

interface BlogStats {
	views: number
	rating: number
	ratingCount: number
}

/** Просмотр (раз в день) и оценка статьи — та же схема, что у useToolStats,
 *  но без общего провайдера: страница блога рендерит одну статью за раз, а
 *  не список карточек, которым нужна была бы батчевая загрузка. */
export function useBlogStats(postId: string) {
	const [stats, setStats] = useState<BlogStats>({
		views: 0,
		rating: 0,
		ratingCount: 0
	})
	const [hasVoted, setHasVoted] = useState(false)

	useEffect(() => {
		try {
			setHasVoted(localStorage.getItem(ratedKey(postId)) !== null)
		} catch {
			setHasVoted(false)
		}

		fetch(`/api/blog-stats?postId=${encodeURIComponent(postId)}`)
			.then(response => (response.ok ? response.json() : null))
			.then((data: BlogStats | null) => {
				if (data) setStats(data)
			})
			.catch(() => {
				// сеть недоступна — тихо пропускаем, это не критичная функция
			})

		const key = todayViewKey(postId)
		let alreadyViewedToday: boolean
		try {
			alreadyViewedToday = localStorage.getItem(key) !== null
		} catch {
			alreadyViewedToday = false
		}
		if (alreadyViewedToday) return

		fetch('/api/blog-stats', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ postId, action: 'view' })
		})
			.then(response => (response.ok ? response.json() : null))
			.then((data: { views: number } | null) => {
				if (!data) return
				setStats(prev => ({ ...prev, views: data.views }))
				try {
					localStorage.setItem(key, '1')
				} catch {
					// приватный режим — не запомнится
				}
			})
			.catch(() => {})
	}, [postId])

	async function vote(value: 1 | 2 | 3 | 4 | 5) {
		try {
			const response = await fetch('/api/blog-stats', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ postId, action: 'rate', value })
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
			setStats(prev => ({
				...prev,
				rating: data.rating,
				ratingCount: data.ratingCount
			}))

			try {
				localStorage.setItem(ratedKey(postId), String(value))
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

	return { ...stats, hasVoted, vote }
}

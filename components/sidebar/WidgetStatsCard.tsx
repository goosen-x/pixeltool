'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users } from 'lucide-react'

export function WidgetStatsCard() {
	const [onlineUsers, setOnlineUsers] = useState<number | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const fetchOnlineUsers = async () => {
			try {
				const response = await fetch('/api/analytics/online', {
					cache: 'no-store'
				})
				if (response.ok) {
					const data = await response.json()
					setOnlineUsers(data.onlineUsers ?? 0)
				}
			} catch (error) {
				console.error('Failed to fetch online users:', error)
				setOnlineUsers(0)
			} finally {
				setIsLoading(false)
			}
		}

		fetchOnlineUsers()

		// Refresh every 10 seconds
		const interval = setInterval(fetchOnlineUsers, 10000)
		return () => clearInterval(interval)
	}, [])

	// Don't show card if no users online
	if (!isLoading && (onlineUsers === null || onlineUsers === 0)) {
		return null
	}

	return (
		<Card>
			<CardHeader className='pb-3'>
				<CardTitle className='text-sm flex items-center gap-2'>
					<Users className='w-4 h-4' />
					Статистика
				</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className='flex items-center justify-between'>
						<span className='text-sm text-muted-foreground flex items-center gap-1'>
							<Users className='w-3 h-3' />
							Сейчас онлайн
						</span>
						<div className='w-6 h-4 bg-muted animate-pulse rounded'></div>
					</div>
				) : (
					<div className='flex items-center justify-between gap-2'>
						<span className='text-xs lg:text-sm text-muted-foreground flex items-center gap-1'>
							<Users className='w-3 h-3 flex-shrink-0' />
							<span className='truncate'>Сейчас онлайн</span>
						</span>
						<span className='text-xs lg:text-sm font-medium text-green-600 dark:text-green-400 whitespace-nowrap'>
							{onlineUsers}
						</span>
					</div>
				)}
			</CardContent>
		</Card>
	)
}

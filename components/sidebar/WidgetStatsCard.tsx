'use client'

import { useState, useEffect } from 'react'
// import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Users } from 'lucide-react'
import type { Widget } from '@/lib/constants/widgets'

interface AnalyticsStats {
	viewsToday: number
	totalViews: number
	uniqueSessionsToday: number
	totalSessions: number
	averageSessionDuration: string
	averageSessionSeconds: number
	onlineUsers?: number
}

interface WidgetStatsCardProps {
	widget: Widget
}

export function WidgetStatsCard({ widget }: WidgetStatsCardProps) {
	// const tSidebar = useTranslations('widgets.rightSidebar')
	const [analyticsStats, setAnalyticsStats] = useState<AnalyticsStats | null>(
		null
	)
	const [isLoadingStats, setIsLoadingStats] = useState(true)

	// Fetch analytics stats
	useEffect(() => {
		if (!widget) return

		const fetchStats = async () => {
			try {
				setIsLoadingStats(true)
				const response = await fetch(
					`/api/analytics/stats/${widget.id}?timeframe=7d`
				)
				if (response.ok) {
					const stats = await response.json()
					setAnalyticsStats(stats)
				}
			} catch (error) {
				console.error('Failed to fetch analytics stats:', error)
			} finally {
				setIsLoadingStats(false)
			}
		}

		fetchStats()
	}, [widget])

	return (
		<Card>
			<CardHeader className='pb-3'>
				<CardTitle className='text-sm flex items-center gap-2'>
					<BarChart className='w-4 h-4' />
					Статистика использования
				</CardTitle>
			</CardHeader>
			<CardContent className='space-y-2'>
				{isLoadingStats ? (
					<>
						<div className='flex items-center justify-between'>
							<span className='text-sm text-muted-foreground flex items-center gap-1'>
								<Users className='w-3 h-3' />
								Сейчас онлайн
							</span>
							<div className='w-6 h-4 bg-muted animate-pulse rounded'></div>
						</div>
						<div className='flex items-center justify-between'>
							<span className='text-sm text-muted-foreground'>
								Просмотров сегодня
							</span>
							<div className='w-8 h-4 bg-muted animate-pulse rounded'></div>
						</div>
						<div className='flex items-center justify-between'>
							<span className='text-sm text-muted-foreground'>
								Всего использований
							</span>
							<div className='w-12 h-4 bg-muted animate-pulse rounded'></div>
						</div>
						<div className='flex items-center justify-between'>
							<span className='text-sm text-muted-foreground'>
								Средняя сессия
							</span>
							<div className='w-10 h-4 bg-muted animate-pulse rounded'></div>
						</div>
					</>
				) : analyticsStats ? (
					<>
						<div className='flex items-center justify-between gap-2'>
							<span className='text-xs lg:text-sm text-muted-foreground flex items-center gap-1'>
								<Users className='w-3 h-3 flex-shrink-0' />
								<span className='truncate'>
									Сейчас онлайн
								</span>
							</span>
							<span className='text-xs lg:text-sm font-medium text-green-600 dark:text-green-400 whitespace-nowrap'>
								{analyticsStats.onlineUsers || 0}
							</span>
						</div>
						<div className='flex items-center justify-between gap-2'>
							<span className='text-xs lg:text-sm text-muted-foreground truncate'>
								Просмотров сегодня
							</span>
							<span className='text-xs lg:text-sm font-medium whitespace-nowrap'>
								{analyticsStats.viewsToday.toLocaleString()}
							</span>
						</div>
						<div className='flex items-center justify-between gap-2'>
							<span className='text-xs lg:text-sm text-muted-foreground truncate'>
								Всего использований
							</span>
							<span className='text-xs lg:text-sm font-medium whitespace-nowrap'>
								{analyticsStats.totalViews >= 1000
									? `${(analyticsStats.totalViews / 1000).toFixed(1)}k`
									: analyticsStats.totalViews.toLocaleString()}
							</span>
						</div>
						<div className='flex items-center justify-between gap-2'>
							<span className='text-xs lg:text-sm text-muted-foreground truncate'>
								Средняя сессия
							</span>
							<span className='text-xs lg:text-sm font-medium whitespace-nowrap'>
								{analyticsStats.averageSessionDuration || '0s'}
							</span>
						</div>
					</>
				) : (
					<div className='text-center py-2'>
						<span className='text-sm text-muted-foreground'>
							Нет данных
						</span>
					</div>
				)}
			</CardContent>
		</Card>
	)
}

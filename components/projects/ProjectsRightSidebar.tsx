'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Info,
	Code2,
	Share2,
	Clock,
	Tag,
	BarChart,
	BookOpen,
	Lightbulb,
	Heart,
	Coffee,
	MessageSquare
} from 'lucide-react'
import { getWidgetById, getWidgetByPath } from '@/lib/constants/widgets'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CryptoDonationModal } from '@/components/global'
import { FeedbackModal } from '@/components/feedback'
import { useState, useEffect } from 'react'

interface AnalyticsStats {
	viewsToday: number
	totalViews: number
	uniqueSessionsToday: number
	totalSessions: number
	averageSessionDuration: string
	averageSessionSeconds: number
}

export function ProjectsRightSidebar() {
	const pathname = usePathname()
	const t = useTranslations('widgets')
	const tActivities = useTranslations('activities')
	const [analyticsStats, setAnalyticsStats] = useState<AnalyticsStats | null>(null)
	const [isLoadingStats, setIsLoadingStats] = useState(true)

	// Extract widget path from URL
	const widgetPath = pathname.split('/').pop()
	const widget = widgetPath ? getWidgetByPath(widgetPath) : null

	// Fetch analytics stats
	useEffect(() => {
		if (!widget) return

		const fetchStats = async () => {
			try {
				setIsLoadingStats(true)
				const response = await fetch(`/api/analytics/stats/${widget.id}?timeframe=7d`)
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

	if (!widget) return null

	const difficultyColors = {
		beginner: 'bg-green-100 text-green-800',
		intermediate: 'bg-yellow-100 text-yellow-800',
		advanced: 'bg-red-100 text-red-800'
	}

	return (
		<aside className='w-80 p-4 space-y-4 overflow-y-auto projects-scroll'>
			{/* Widget Info Card */}
			<Card>
				<CardHeader className='pb-3'>
					<CardTitle className='text-sm flex items-center gap-2'>
						<Info className='w-4 h-4' />
						Widget Info
					</CardTitle>
				</CardHeader>
				<CardContent className='space-y-3'>
					{widget.difficulty && (
						<div className='flex items-center justify-between'>
							<span className='text-sm text-muted-foreground'>Difficulty</span>
							<Badge className={difficultyColors[widget.difficulty]}>
								{widget.difficulty}
							</Badge>
						</div>
					)}

					<div className='flex items-center justify-between'>
						<span className='text-sm text-muted-foreground'>Category</span>
						<Badge variant='outline'>{widget.category}</Badge>
					</div>

					{widget.tags && widget.tags.length > 0 && (
						<div className='space-y-2'>
							<span className='text-sm text-muted-foreground flex items-center gap-1'>
								<Tag className='w-3 h-3' />
								Tags
							</span>
							<div className='flex flex-wrap gap-1'>
								{widget.tags.map(tag => (
									<Badge key={tag} variant='secondary' className='text-xs'>
										{tag}
									</Badge>
								))}
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Quick Actions Card */}
			<Card>
				<CardHeader className='pb-3'>
					<CardTitle className='text-sm flex items-center gap-2'>
						<Code2 className='w-4 h-4' />
						Quick Actions
					</CardTitle>
				</CardHeader>
				<CardContent className='space-y-2'>
					<Button
						variant='outline'
						size='sm'
						className='w-full justify-start'
						onClick={() => {
							navigator.clipboard.writeText(window.location.href)
						}}
					>
						<Share2 className='w-4 h-4 mr-2' />
						Share Widget
					</Button>
					{/* <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => window.print()}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Export as PDF
          </Button> */}
				</CardContent>
			</Card>

			{/* Use Case Card */}
			{widget.useCase && (
				<Card>
					<CardHeader className='pb-3'>
						<CardTitle className='text-sm flex items-center gap-2'>
							<Lightbulb className='w-4 h-4' />
							When to Use
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-sm text-muted-foreground'>{widget.useCase}</p>
					</CardContent>
				</Card>
			)}

			{/* Widget Stats */}
			<Card>
				<CardHeader className='pb-3'>
					<CardTitle className='text-sm flex items-center gap-2'>
						<BarChart className='w-4 h-4' />
						Usage Stats
					</CardTitle>
				</CardHeader>
				<CardContent className='space-y-2'>
					{isLoadingStats ? (
						<>
							<div className='flex items-center justify-between'>
								<span className='text-sm text-muted-foreground'>Views today</span>
								<div className='w-8 h-4 bg-muted animate-pulse rounded'></div>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-sm text-muted-foreground'>Total uses</span>
								<div className='w-12 h-4 bg-muted animate-pulse rounded'></div>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-sm text-muted-foreground'>Avg. session</span>
								<div className='w-10 h-4 bg-muted animate-pulse rounded'></div>
							</div>
						</>
					) : analyticsStats ? (
						<>
							<div className='flex items-center justify-between'>
								<span className='text-sm text-muted-foreground'>Views today</span>
								<span className='text-sm font-medium'>
									{analyticsStats.viewsToday.toLocaleString()}
								</span>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-sm text-muted-foreground'>Total uses</span>
								<span className='text-sm font-medium'>
									{analyticsStats.totalViews >= 1000 
										? `${(analyticsStats.totalViews / 1000).toFixed(1)}k` 
										: analyticsStats.totalViews.toLocaleString()}
								</span>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-sm text-muted-foreground'>Avg. session</span>
								<span className='text-sm font-medium'>
									{analyticsStats.averageSessionDuration || '0s'}
								</span>
							</div>
						</>
					) : (
						<div className='text-center py-2'>
							<span className='text-sm text-muted-foreground'>No data available</span>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Feedback Card */}
			<Card>
				<CardHeader className='pb-3'>
					<CardTitle className='text-sm flex items-center gap-2'>
						<MessageSquare className='w-4 h-4' />
						Feedback
					</CardTitle>
				</CardHeader>
				<CardContent className='space-y-2'>
					<FeedbackModal variant='sidebar' />
					<p className='text-xs text-muted-foreground text-center'>
						Help us improve this tool
					</p>
				</CardContent>
			</Card>

			{/* Related Tools Mini */}
			{widget.recommendedTools && widget.recommendedTools.length > 0 && (
				<Card>
					<CardHeader className='pb-3'>
						<CardTitle className='text-sm'>Related Tools</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-1'>
							{widget.recommendedTools.slice(0, 3).map(toolId => {
								const tool = getWidgetById(toolId)
								if (!tool) return null
								return (
									<Link
										key={tool.id}
										href={`/${pathname.split('/')[1]}/projects/${tool.path}`}
										className='block p-2 rounded hover:bg-muted transition-colors'
									>
										<div className='flex items-center gap-2'>
											<tool.icon className='w-4 h-4 text-muted-foreground' />
											<span className='text-sm'>
												{t(`${tool.translationKey}.title`)}
											</span>
										</div>
									</Link>
								)
							})}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Donation Card */}
			<Card>
				<CardHeader className='pb-3'>
					<CardTitle className='text-sm flex items-center gap-2'>
						<Heart className='w-4 h-4' />
						{tActivities('donation.title')}
					</CardTitle>
				</CardHeader>
				<CardContent className='space-y-2'>
					<CryptoDonationModal variant='sidebar' />

					<Button
						variant='outline'
						size='sm'
						className='w-full justify-start'
						onClick={() => {
							window.open('https://www.buymeacoffee.com/yourname', '_blank')
						}}
					>
						<Coffee className='w-4 h-4 mr-2' />
						Buy me a coffee
					</Button>

					<p className='text-xs text-muted-foreground text-center mt-3'>
						{tActivities('donation.tooltip')}
					</p>
				</CardContent>
			</Card>
		</aside>
	)
}

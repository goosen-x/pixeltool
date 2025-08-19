'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import {
	Eye,
	Users,
	Clock,
	TrendingUp,
	BarChart3,
	Activity,
	ArrowUp,
	ArrowDown,
	Loader2
} from 'lucide-react'
import { type Widget } from '@/lib/constants/widgets'
import {
	LineChart,
	Line,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer
} from 'recharts'

interface AnalyticsDashboardProps {
	widgets: Widget[]
	locale: string
}

interface WidgetStats {
	widgetId: string
	viewsToday: number
	totalViews: number
	uniqueSessionsToday: number
	totalSessions: number
	averageSessionDuration: string
	averageSessionSeconds: number
	onlineUsers: number
	hourlyViews: Array<{ hour: number; views: number }>
	timeframe: string
}

interface TopWidget {
	widget: Widget
	stats: WidgetStats
}

export function AnalyticsDashboard({
	widgets,
	locale
}: AnalyticsDashboardProps) {
	const t = useTranslations('widgets')
	const dashT = useTranslations('widgets.analyticsDashboard')

	const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null)
	const [timeframe, setTimeframe] = useState<'1d' | '7d' | '30d'>('7d')
	const [widgetStats, setWidgetStats] = useState<WidgetStats | null>(null)
	const [allWidgetStats, setAllWidgetStats] = useState<
		Map<string, WidgetStats>
	>(new Map())
	const [loading, setLoading] = useState(false)
	const [topWidgets, setTopWidgets] = useState<TopWidget[]>([])

	// Fetch stats for a specific widget
	const fetchWidgetStats = async (widgetId: string) => {
		setLoading(true)
		try {
			const response = await fetch(
				`/api/analytics/stats/${widgetId}?timeframe=${timeframe}`
			)
			if (response.ok) {
				const data = await response.json()
				setWidgetStats(data)

				// Update cache
				setAllWidgetStats(prev => new Map(prev.set(widgetId, data)))
			}
		} catch (error) {
			console.error('Failed to fetch widget stats:', error)
		} finally {
			setLoading(false)
		}
	}

	// Fetch stats for all widgets (for overview)
	const fetchAllStats = async () => {
		const statsPromises = widgets.map(async widget => {
			try {
				const response = await fetch(
					`/api/analytics/stats/${widget.id}?timeframe=${timeframe}`
				)
				if (response.ok) {
					const data = await response.json()
					return { widget, stats: data }
				}
			} catch (error) {
				console.error(`Failed to fetch stats for ${widget.id}:`, error)
			}
			return null
		})

		const results = await Promise.all(statsPromises)
		const validResults = results.filter(r => r !== null) as TopWidget[]

		// Sort by total views
		validResults.sort((a, b) => b.stats.totalViews - a.stats.totalViews)
		setTopWidgets(validResults.slice(0, 5))

		// Update cache
		const newStats = new Map<string, WidgetStats>()
		validResults.forEach(({ widget, stats }) => {
			newStats.set(widget.id, stats)
		})
		setAllWidgetStats(newStats)
	}

	// Initial load - fetch all stats
	useEffect(() => {
		fetchAllStats()
	}, [timeframe])

	// Fetch selected widget stats
	useEffect(() => {
		if (selectedWidget) {
			fetchWidgetStats(selectedWidget.id)
		}
	}, [selectedWidget, timeframe])

	// Calculate total stats across all widgets
	const totalStats = {
		views: Array.from(allWidgetStats.values()).reduce(
			(sum, stats) => sum + stats.totalViews,
			0
		),
		sessions: Array.from(allWidgetStats.values()).reduce(
			(sum, stats) => sum + stats.totalSessions,
			0
		),
		onlineUsers: Array.from(allWidgetStats.values()).reduce(
			(sum, stats) => sum + stats.onlineUsers,
			0
		),
		avgDuration:
			Array.from(allWidgetStats.values()).reduce(
				(sum, stats) => sum + stats.averageSessionSeconds,
				0
			) / (allWidgetStats.size || 1)
	}

	// Format duration
	const formatDuration = (seconds: number) => {
		if (seconds < 60) return `${Math.round(seconds)}s`
		const minutes = Math.floor(seconds / 60)
		const remainingSeconds = Math.round(seconds % 60)
		return remainingSeconds > 0
			? `${minutes}m ${remainingSeconds}s`
			: `${minutes}m`
	}

	return (
		<div className='space-y-6'>
			{/* Overview Cards */}
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							{dashT('totalViews')}
						</CardTitle>
						<Eye className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{totalStats.views.toLocaleString()}
						</div>
						<p className='text-xs text-muted-foreground'>
							{dashT('timeframePeriod', { timeframe })}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							{dashT('totalSessions')}
						</CardTitle>
						<Users className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{totalStats.sessions.toLocaleString()}
						</div>
						<p className='text-xs text-muted-foreground'>
							{dashT('uniqueUsers')}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							{dashT('avgDuration')}
						</CardTitle>
						<Clock className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{formatDuration(totalStats.avgDuration)}
						</div>
						<p className='text-xs text-muted-foreground'>
							{dashT('perSession')}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							{dashT('onlineNow')}
						</CardTitle>
						<Activity className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{totalStats.onlineUsers}</div>
						<p className='text-xs text-muted-foreground'>
							{dashT('activeUsers')}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Top Widgets */}
			<Card>
				<CardHeader>
					<CardTitle>{dashT('topWidgets')}</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						{topWidgets.map(({ widget, stats }, index) => (
							<div key={widget.id} className='flex items-center'>
								<div className='flex items-center gap-3 flex-1'>
									<div
										className={`w-10 h-10 rounded-lg bg-gradient-to-br ${widget.gradient} flex items-center justify-center text-white`}
									>
										<widget.icon className='w-5 h-5' />
									</div>
									<div className='flex-1'>
										<p className='text-sm font-medium leading-none'>
											{t(`${widget.translationKey}.title`)}
										</p>
										<p className='text-sm text-muted-foreground'>
											{stats.totalViews.toLocaleString()} {dashT('views')}
										</p>
									</div>
									<Badge variant='outline'>{`#${index + 1}`}</Badge>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Widget Analytics */}
			<Tabs defaultValue='widget' className='space-y-4'>
				<div className='flex items-center justify-between'>
					<TabsList>
						<TabsTrigger value='widget'>{dashT('widgetAnalytics')}</TabsTrigger>
						<TabsTrigger value='trends'>{dashT('trends')}</TabsTrigger>
					</TabsList>

					<Select
						value={timeframe}
						onValueChange={(value: '1d' | '7d' | '30d') => setTimeframe(value)}
					>
						<SelectTrigger className='w-[180px]'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='1d'>{dashT('last24Hours')}</SelectItem>
							<SelectItem value='7d'>{dashT('last7Days')}</SelectItem>
							<SelectItem value='30d'>{dashT('last30Days')}</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<TabsContent value='widget' className='space-y-4'>
					{/* Widget Selector */}
					<Card>
						<CardHeader>
							<CardTitle>{dashT('selectWidget')}</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>
								{widgets.map(widget => (
									<Button
										key={widget.id}
										variant={
											selectedWidget?.id === widget.id ? 'default' : 'outline'
										}
										className='justify-start'
										onClick={() => setSelectedWidget(widget)}
									>
										<widget.icon className='w-4 h-4 mr-2' />
										{t(`${widget.translationKey}.title`)}
									</Button>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Selected Widget Stats */}
					{selectedWidget && widgetStats && (
						<div className='grid gap-4 md:grid-cols-2'>
							<Card>
								<CardHeader>
									<CardTitle>{dashT('performance')}</CardTitle>
								</CardHeader>
								<CardContent className='space-y-4'>
									<div className='flex items-center justify-between'>
										<span className='text-sm text-muted-foreground'>
											{dashT('viewsToday')}
										</span>
										<span className='font-medium'>
											{widgetStats.viewsToday.toLocaleString()}
										</span>
									</div>
									<div className='flex items-center justify-between'>
										<span className='text-sm text-muted-foreground'>
											{dashT('totalViews')}
										</span>
										<span className='font-medium'>
											{widgetStats.totalViews.toLocaleString()}
										</span>
									</div>
									<div className='flex items-center justify-between'>
										<span className='text-sm text-muted-foreground'>
											{dashT('uniqueSessions')}
										</span>
										<span className='font-medium'>
											{widgetStats.totalSessions.toLocaleString()}
										</span>
									</div>
									<div className='flex items-center justify-between'>
										<span className='text-sm text-muted-foreground'>
											{dashT('avgSessionDuration')}
										</span>
										<span className='font-medium'>
											{widgetStats.averageSessionDuration}
										</span>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>{dashT('hourlyViews')}</CardTitle>
								</CardHeader>
								<CardContent>
									<ResponsiveContainer width='100%' height={200}>
										<LineChart data={widgetStats.hourlyViews}>
											<CartesianGrid strokeDasharray='3 3' />
											<XAxis
												dataKey='hour'
												tickFormatter={hour => `${hour}:00`}
											/>
											<YAxis />
											<Tooltip
												labelFormatter={hour => `${hour}:00`}
												formatter={value => [`${value} views`, 'Views']}
											/>
											<Line
												type='monotone'
												dataKey='views'
												stroke='#8884d8'
												strokeWidth={2}
											/>
										</LineChart>
									</ResponsiveContainer>
								</CardContent>
							</Card>
						</div>
					)}
				</TabsContent>

				<TabsContent value='trends' className='space-y-4'>
					<Card>
						<CardHeader>
							<CardTitle>{dashT('usageTrends')}</CardTitle>
						</CardHeader>
						<CardContent>
							<ResponsiveContainer width='100%' height={300}>
								<BarChart data={topWidgets}>
									<CartesianGrid strokeDasharray='3 3' />
									<XAxis
										dataKey='widget.id'
										tickFormatter={id => {
											const widget = widgets.find(w => w.id === id)
											return widget
												? t(`${widget.translationKey}.title`).slice(0, 15) +
														'...'
												: id
										}}
									/>
									<YAxis />
									<Tooltip
										labelFormatter={id => {
											const widget = widgets.find(w => w.id === id)
											return widget ? t(`${widget.translationKey}.title`) : id
										}}
										formatter={value => [`${value} views`, 'Total Views']}
									/>
									<Bar dataKey='stats.totalViews' fill='#8884d8' />
								</BarChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}

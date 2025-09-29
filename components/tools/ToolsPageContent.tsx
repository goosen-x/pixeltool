'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
	TrendingUp,
	Layers,
	Clock,
	Search,
	Star,
	Fingerprint,
	Type,
	Grid3X3,
	Calculator,
	Zap,
	FileImage,
	Youtube,
	QrCode,
	Hash,
	Timer,
	FileCode,
	Palette,
	Image,
	FileText,
	Code2,
	Lock,
	Shuffle,
	Calendar,
	CreditCard,
	GitBranch,
	Link2,
	Percent,
	DollarSign,
	BarChart,
	Briefcase,
	Film,
	Activity
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CategoryCard } from './CategoryCard'

import { widgets } from '@/lib/constants/widgets'

// Map widget IDs to their icons - get icons from the original widgets array
const getIconForWidget = (widgetId: string) => {
	const widget = widgets.find(w => w.id === widgetId)
	return widget?.icon || Code2
}

interface Tool {
	id: string
	translationKey: string
	gradient: string
	path: string
	category: string
	title?: string
	description?: string
}

interface Category {
	key: string
	name: string
	count: number
	gradient: string
}

interface ToolsPageContentProps {
	locale: string
	popularTools: Tool[]
	categoriesWithCount: Category[]
	recentTools: Tool[]
}

export function ToolsPageContent({
	locale,
	popularTools,
	categoriesWithCount,
	recentTools
}: ToolsPageContentProps) {
	const [activeTab, setActiveTab] = useState<
		'popular' | 'categories' | 'recent' | 'all'
	>('popular')

	return (
		<div className='space-y-8'>
			{/* Tabs Navigation */}
			<div className='flex flex-wrap justify-center gap-2'>
				<Button
					variant={activeTab === 'popular' ? 'default' : 'outline'}
					size='sm'
					className='gap-2'
					onClick={() => setActiveTab('popular')}
				>
					<TrendingUp className='w-4 h-4' />
					{locale === 'ru' ? 'Популярные' : 'Popular'}
				</Button>
				<Button
					variant={activeTab === 'categories' ? 'default' : 'outline'}
					size='sm'
					className='gap-2'
					onClick={() => setActiveTab('categories')}
				>
					<Layers className='w-4 h-4' />
					{locale === 'ru' ? 'Категории' : 'Categories'}
				</Button>
				<Button
					variant={activeTab === 'recent' ? 'default' : 'outline'}
					size='sm'
					className='gap-2'
					onClick={() => setActiveTab('recent')}
				>
					<Clock className='w-4 h-4' />
					{locale === 'ru' ? 'Новые' : 'Recent'}
				</Button>
				<Button
					variant={activeTab === 'all' ? 'default' : 'outline'}
					size='sm'
					className='gap-2'
					onClick={() => setActiveTab('all')}
				>
					<Search className='w-4 h-4' />
					{locale === 'ru' ? 'Все инструменты' : 'All Tools'}
				</Button>
			</div>

			{/* Content based on active tab */}
			<div className='min-h-[400px]'>
				{/* Popular Tools */}
				{activeTab === 'popular' && (
					<div className='space-y-6 animate-in fade-in duration-300'>
						<div className='flex items-center justify-between'>
							<h2 className='text-2xl font-bold flex items-center gap-2'>
								<TrendingUp className='w-6 h-6 text-primary' />
								{locale === 'ru' ? 'Популярные инструменты' : 'Popular Tools'}
							</h2>
							<Badge
								variant='secondary'
								className='bg-primary/10 text-primary border-primary/20'
							>
								{locale === 'ru' ? 'Топ 8' : 'Top 8'}
							</Badge>
						</div>

						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
							{popularTools.map(tool => {
								const Icon = getIconForWidget(tool.id)
								return (
									<Link key={tool.id} href={tool.path}>
										<Card className='group h-full p-5 bg-background/60 backdrop-blur-sm border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300'>
											<div className='flex flex-col gap-3'>
												<div className='flex items-start justify-between'>
													<div
														className={cn(
															'p-3 rounded-xl bg-gradient-to-br',
															tool.gradient,
															'group-hover:scale-110 transition-transform'
														)}
													>
														<Icon className='w-6 h-6 text-white' />
													</div>
													<Badge variant='secondary' className='text-xs'>
														{locale === 'ru' ? 'Популярно' : 'Popular'}
													</Badge>
												</div>
												<div>
													<h3 className='font-semibold group-hover:text-primary transition-colors line-clamp-1'>
														{tool.title || tool.translationKey}
													</h3>
													<p className='text-sm text-muted-foreground mt-1 line-clamp-2'>
														{tool.description || ''}
													</p>
												</div>
											</div>
										</Card>
									</Link>
								)
							})}
						</div>
					</div>
				)}

				{/* Categories */}
				{activeTab === 'categories' && (
					<div className='space-y-6 animate-in fade-in duration-300'>
						<div className='flex items-center justify-between'>
							<h2 className='text-2xl font-bold flex items-center gap-2'>
								<Layers className='w-6 h-6 text-accent' />
								{locale === 'ru' ? 'Категории' : 'Categories'}
							</h2>
							<Badge
								variant='secondary'
								className='bg-accent/10 text-accent border-accent/20'
							>
								{categoriesWithCount.length}{' '}
								{locale === 'ru' ? 'категорий' : 'categories'}
							</Badge>
						</div>

						<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
							{categoriesWithCount.map(category => (
								<CategoryCard
									key={category.key}
									categoryKey={category.key}
									name={category.name}
									count={category.count}
									gradient={category.gradient}
									locale={locale}
								/>
							))}
						</div>
					</div>
				)}

				{/* Recent Tools */}
				{activeTab === 'recent' && (
					<div className='space-y-6 animate-in fade-in duration-300'>
						<div className='flex items-center justify-between'>
							<h2 className='text-2xl font-bold flex items-center gap-2'>
								<Clock className='w-6 h-6 text-green-500' />
								{locale === 'ru' ? 'Недавно добавленные' : 'Recently Added'}
							</h2>
							<Badge
								variant='secondary'
								className='bg-green-500/10 text-green-600 border-green-500/20'
							>
								{locale === 'ru' ? 'Новые' : 'New'}
							</Badge>
						</div>

						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
							{recentTools.map(tool => {
								const Icon = getIconForWidget(tool.id)
								return (
									<Link key={tool.id} href={tool.path}>
										<Card className='group h-full p-5 bg-background/60 backdrop-blur-sm border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300'>
											<div className='flex items-center gap-4'>
												<div
													className={cn(
														'p-3 rounded-xl bg-gradient-to-br',
														tool.gradient,
														'group-hover:scale-110 transition-transform flex-shrink-0'
													)}
												>
													<Icon className='w-6 h-6 text-white' />
												</div>
												<div className='flex-1 min-w-0'>
													<h3 className='font-semibold group-hover:text-primary transition-colors truncate'>
														{tool.title || tool.translationKey}
													</h3>
													<p className='text-sm text-muted-foreground mt-1'>
														{locale === 'ru'
															? 'Добавлено недавно'
															: 'Recently added'}
													</p>
												</div>
												<Star className='w-5 h-5 text-yellow-500 flex-shrink-0' />
											</div>
										</Card>
									</Link>
								)
							})}
						</div>
					</div>
				)}

				{/* All Tools - Redirect to search section */}
				{activeTab === 'all' && (
					<div className='text-center py-16 animate-in fade-in duration-300'>
						<div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted/50 mb-6'>
							<Search className='w-10 h-10 text-muted-foreground' />
						</div>
						<h3 className='text-xl font-heading font-semibold mb-2'>
							{locale === 'ru' ? 'Все инструменты' : 'All Tools'}
						</h3>
						<p className='text-muted-foreground mb-6 max-w-md mx-auto'>
							{locale === 'ru'
								? 'Для просмотра всех инструментов используйте полнофункциональный поиск ниже'
								: 'To view all tools, use the full-featured search below'}
						</p>
						<Button
							size='lg'
							onClick={() => {
								const searchSection = document.getElementById('tools-search')
								searchSection?.scrollIntoView({ behavior: 'smooth' })
							}}
						>
							{locale === 'ru' ? 'Перейти к поиску' : 'Go to Search'}
						</Button>
					</div>
				)}
			</div>
		</div>
	)
}

'use client'

import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
	Search,
	X,
	Grid3X3,
	List,
	Sparkles,
	TrendingUp,
	ArrowUp
} from 'lucide-react'
import Link from 'next/link'
import { widgets, widgetCategories, type Widget } from '@/lib/constants/widgets'
import { useSearchHistory } from '@/lib/hooks/useSearchHistory'
import { useAnalytics } from '@/lib/hooks/useAnalytics'
import { highlightText } from '@/lib/utils/highlightText'
import { cn } from '@/lib/utils'
import { FavoriteButton } from './FavoriteButton'
import { FavoriteWidgets } from './FavoriteWidgets'
import { ToolCard } from './ToolCard'

interface WidgetSearchProps {
	locale: string
}

interface ProjectCard {
	id: string
	title: string
	description: string
	icon: React.ReactNode
	gradient: string
	path: string
	category: string
	tags: string[]
	widget: Widget
}

export function EnhancedWidgetSearch({ locale }: WidgetSearchProps) {
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedCategory, setSelectedCategory] = useState<string>('')
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
	const inputRef = useRef<HTMLInputElement>(null)

	const t = useTranslations('widgets')
	const searchT = useTranslations('widgets.search')
	const { history, addToHistory, removeFromHistory, clearHistory } =
		useSearchHistory()

	// Convert widgets to project cards with translations
	const allProjectCards: ProjectCard[] = useMemo(() => {
		return widgets.map(widget => {
			const Icon = widget.icon
			try {
				return {
					id: widget.id,
					title: t(`${widget.translationKey}.title`),
					description: t(`${widget.translationKey}.description`),
					icon: <Icon className='w-8 h-8' />,
					gradient: widget.gradient,
					path: widget.path,
					category: widget.category,
					tags: widget.tags || [],
					widget
				}
			} catch (error) {
				// Fallback if translation fails
				return {
					id: widget.id,
					title: widget.translationKey,
					description: '',
					icon: <Icon className='w-8 h-8' />,
					gradient: widget.gradient,
					path: widget.path,
					category: widget.category,
					tags: widget.tags || [],
					widget
				}
			}
		})
	}, [t])

	// Filter widgets based on search query and category
	const filteredWidgets = useMemo(() => {
		return allProjectCards.filter(project => {
			const matchesSearch =
				searchQuery === '' ||
				project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
				project.tags.some(tag =>
					tag.toLowerCase().includes(searchQuery.toLowerCase())
				) ||
				project.widget.useCase
					?.toLowerCase()
					.includes(searchQuery.toLowerCase())

			const matchesCategory =
				selectedCategory === '' || project.category === selectedCategory

			return matchesSearch && matchesCategory
		})
	}, [allProjectCards, searchQuery, selectedCategory])

	// Group filtered widgets by category
	const groupedWidgets = useMemo(() => {
		const grouped: Record<string, ProjectCard[]> = {}

		filteredWidgets.forEach(project => {
			if (!grouped[project.category]) {
				grouped[project.category] = []
			}
			grouped[project.category].push(project)
		})

		return grouped
	}, [filteredWidgets])

	const clearSearch = () => {
		setSearchQuery('')
		setSelectedCategory('')
	}

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Cmd/Ctrl + K to focus search
			if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
				e.preventDefault()
				inputRef.current?.focus()
			}
			// Escape to clear search
			if (e.key === 'Escape') {
				if (searchQuery || selectedCategory) {
					clearSearch()
				}
			}
			// Cmd/Ctrl + / to cycle through categories
			if ((e.metaKey || e.ctrlKey) && e.key === '/') {
				e.preventDefault()
				const categories = ['', ...Object.keys(widgetCategories)]
				const currentIndex = categories.indexOf(selectedCategory)
				const nextIndex = (currentIndex + 1) % categories.length
				setSelectedCategory(categories[nextIndex])
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [searchQuery, selectedCategory])

	const hasActiveFilters = searchQuery !== '' || selectedCategory !== ''

	return (
		<div className='space-y-8'>
			{/* Favorite Widgets */}
			<FavoriteWidgets locale={locale} />

			{/* Search Controls */}
			<div className='relative'>
				<div className='absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-3xl' />
				<div className='relative bg-background/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 space-y-6 border border-border/50 shadow-xl'>
					{/* Search Input */}
					<div className='relative max-w-2xl mx-auto'>
						<Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5' />
						<Input
							ref={inputRef}
							placeholder={searchT('placeholder')}
							value={searchQuery}
							onChange={e => {
								const value = e.target.value
								setSearchQuery(value)
							}}
							onKeyDown={e => {
								if (e.key === 'Enter' && searchQuery.trim()) {
									addToHistory(searchQuery)
								}
							}}
							className='pl-12 pr-24 h-14 text-base rounded-2xl border-border/50 bg-background/80 backdrop-blur-sm focus:bg-background transition-all duration-300 shadow-sm hover:shadow-md'
						/>
						<div className='absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1'>
							{searchQuery && (
								<Button
									variant='ghost'
									size='sm'
									onClick={() => setSearchQuery('')}
									className='p-1 h-8 w-8'
								>
									<X className='w-4 h-4' />
								</Button>
							)}
							<kbd className='hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground'>
								<span className='text-xs'>⌘</span>K
							</kbd>
						</div>
					</div>

					{/* Filters */}
					<div className='flex flex-wrap gap-2 items-center justify-center'>
						<Button
							variant={selectedCategory === '' ? 'default' : 'outline'}
							size='sm'
							onClick={() => setSelectedCategory('')}
							className='rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-105'
						>
							{searchT('allCategories')}
						</Button>

						{Object.entries(widgetCategories).map(([key, title]) => (
							<Button
								key={key}
								variant={selectedCategory === key ? 'default' : 'outline'}
								size='sm'
								onClick={() => setSelectedCategory(key)}
								className='rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-105'
							>
								{t(`categories.${key}`)}
							</Button>
						))}
					</div>

					{/* Results info and view mode */}
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							<span className='text-sm font-medium text-muted-foreground'>
								{searchT('results', { count: filteredWidgets.length })}
							</span>
							{hasActiveFilters && (
								<Button
									variant='ghost'
									size='sm'
									onClick={clearSearch}
									className='h-7 px-2'
								>
									<X className='w-3 h-3 mr-1' />
									{searchT('clearFilters')}
								</Button>
							)}
						</div>

						<div className='flex items-center gap-1'>
							<Button
								variant={viewMode === 'grid' ? 'default' : 'ghost'}
								size='sm'
								onClick={() => setViewMode('grid')}
								className='h-8 w-8 p-0'
							>
								<Grid3X3 className='w-4 h-4' />
							</Button>
							<Button
								variant={viewMode === 'list' ? 'default' : 'ghost'}
								size='sm'
								onClick={() => setViewMode('list')}
								className='h-8 w-8 p-0'
							>
								<List className='w-4 h-4' />
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Results */}
			{filteredWidgets.length === 0 ? (
				<div className='text-center py-16 px-4 animate-in fade-in duration-500'>
					<div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted/50 mb-6'>
						<Search className='w-10 h-10 text-muted-foreground' />
					</div>
					<h3 className='text-xl font-heading font-semibold mb-2'>
						{searchT('noResults')}
					</h3>
					<p className='text-muted-foreground mb-6 max-w-md mx-auto'>
						{searchT('noResultsDescription')}
					</p>
					{hasActiveFilters && (
						<Button onClick={clearSearch} size='lg' className='rounded-full'>
							<X className='w-4 h-4 mr-2' />
							{searchT('clearFilters')}
						</Button>
					)}
				</div>
			) : (
				<div className='space-y-8 animate-in fade-in duration-500'>
					{Object.entries(groupedWidgets).map(([category, projects]) => (
						<section key={category}>
							<div className='flex items-center gap-3 mb-6'>
								<h2 className='text-2xl font-heading font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
									{t(`categories.${category}`)}
								</h2>
								<Badge variant='secondary' className='font-medium px-3 py-1'>
									{projects.length}
								</Badge>
							</div>

							{viewMode === 'grid' ? (
								<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-300'>
									{projects.map(project => (
										<ToolCard
											key={project.id}
											widget={project.widget}
											locale={locale}
											searchQuery={searchQuery}
											showFavoriteButton={true}
										/>
									))}
								</div>
							) : (
								<div className='space-y-3 transition-all duration-300'>
									{projects.map(project => (
										<div key={project.id} className='relative'>
											<Link
												href={`/${locale}/tools/${project.path}`}
												className='block group'
											>
												<Card className='transition-all duration-300 hover:shadow-xl border-border/50 bg-background/60 backdrop-blur-sm relative group overflow-hidden'>
													<div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
													<CardContent className='p-5'>
														<div className='flex items-center gap-4'>
															<div
																className={`w-14 h-14 rounded-xl bg-gradient-to-br ${project.gradient} flex items-center justify-center text-white group-hover:scale-110 transition-all duration-300 shadow-md`}
															>
																<project.widget.icon className='w-7 h-7' />
															</div>
															<div className='flex-1 pr-12'>
																<h3 className='font-heading font-semibold text-lg mb-1 transition-all duration-300 group-hover:text-primary'>
																	{searchQuery
																		? highlightText(project.title, searchQuery)
																		: project.title}
																</h3>
																<p className='text-sm text-muted-foreground mb-2'>
																	{searchQuery
																		? highlightText(
																				project.description,
																				searchQuery
																			)
																		: project.description}
																</p>
																{project.tags.length > 0 && (
																	<div className='flex flex-wrap gap-1.5'>
																		{project.tags.slice(0, 5).map(tag => (
																			<Badge
																				key={tag}
																				variant='secondary'
																				className='text-xs'
																			>
																				{searchQuery
																					? highlightText(tag, searchQuery)
																					: tag}
																			</Badge>
																		))}
																		{project.tags.length > 5 && (
																			<Badge
																				variant='outline'
																				className='text-xs'
																			>
																				+{project.tags.length - 5}
																			</Badge>
																		)}
																	</div>
																)}
															</div>
														</div>
													</CardContent>
												</Card>
											</Link>
											<FavoriteButton
												widgetId={project.id}
												size='sm'
												className='absolute top-5 right-5 z-10'
											/>
										</div>
									))}
								</div>
							)}
						</section>
					))}
				</div>
			)}

			{/* Scroll to top button */}
			<Button
				onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
				className='fixed bottom-8 right-8 rounded-full w-12 h-12 p-0 shadow-lg'
				size='icon'
			>
				<ArrowUp className='w-4 h-4' />
			</Button>
		</div>
	)
}

'use client'

import { useState, useMemo } from 'react'

import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Search, X, Filter, Grid3X3, List, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { widgets, widgetCategories, type Widget } from '@/lib/constants/widgets'

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

export function WidgetSearch({ locale }: WidgetSearchProps) {
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedCategory, setSelectedCategory] = useState<string>('')
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

	// const searchT = useTranslations('widgets.search')

	// Convert widgets to project cards with translations
	const allProjectCards: ProjectCard[] = useMemo(() => {
		return widgets.map(widget => {
			const Icon = widget.icon
			return {
				id: widget.id,
				title: widget.title || widget.translationKey,
				description: widget.description || widget.translationKey,
				icon: <Icon className='w-8 h-8' />,
				gradient: widget.gradient,
				path: widget.path,
				category: widget.category,
				tags: widget.tags || [],
				widget
			}
		})
	}, [])

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

	const hasActiveFilters = searchQuery !== '' || selectedCategory !== ''

	return (
		<div className='space-y-6'>
			{/* Search Controls */}
			<div className='bg-gradient-to-br from-background to-muted/20 rounded-2xl p-4 md:p-6 space-y-4 border border-border/50 shadow-sm backdrop-blur-sm'>
				{/* Search Input */}
				<div className='relative max-w-2xl mx-auto'>
					<Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5' />
					<Input
						placeholder='Поиск инструментов...'
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
						className='pl-12 pr-12 h-12 text-base rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background transition-colors'
					/>
					{searchQuery && (
						<Button
							variant='ghost'
							size='sm'
							onClick={() => setSearchQuery('')}
							className='absolute right-1 top-1/2 transform -translate-y-1/2 p-1 h-8 w-8'
						>
							<X className='w-4 h-4' />
						</Button>
					)}
				</div>

				{/* Filters */}
				<div className='flex flex-wrap gap-2 items-center justify-center'>
					<Button
						variant={selectedCategory === '' ? 'default' : 'outline'}
						size='sm'
						onClick={() => setSelectedCategory('')}
						className='rounded-full px-3 py-1.5 text-xs font-medium transition-all'
					>
						Все категории
					</Button>

					{Object.entries(widgetCategories).map(([key, title]) => (
						<Button
							key={key}
							variant={selectedCategory === key ? 'default' : 'outline'}
							size='sm'
							onClick={() => setSelectedCategory(key)}
							className='rounded-full px-3 py-1.5 text-xs font-medium transition-all'
						>
							{title}
						</Button>
					))}
				</div>

				{/* Results info and view mode */}
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<span className='text-sm font-medium text-muted-foreground'>
							Найдено: {filteredWidgets.length}
						</span>
						{hasActiveFilters && (
							<Button
								variant='ghost'
								size='sm'
								onClick={clearSearch}
								className='h-7 px-2'
							>
								<X className='w-3 h-3 mr-1' />
								Очистить
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

			{/* Results */}
			{filteredWidgets.length === 0 ? (
				<div className='text-center py-16 px-4 animate-in fade-in duration-500'>
					<div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted/50 mb-6'>
						<Search className='w-10 h-10 text-muted-foreground' />
					</div>
					<h3 className='text-xl font-heading font-semibold mb-2'>
						Ничего не найдено
					</h3>
					<p className='text-muted-foreground mb-6 max-w-md mx-auto'>
						Попробуйте изменить поисковый запрос или выбрать другую категорию
					</p>
					{hasActiveFilters && (
						<Button onClick={clearSearch} size='lg' className='rounded-full'>
							<X className='w-4 h-4 mr-2' />
							Очистить фильтры
						</Button>
					)}
				</div>
			) : (
				<div className='space-y-8 animate-in fade-in duration-500'>
					{Object.entries(groupedWidgets).map(([category, projects]) => (
						<section key={category}>
							<div className='flex items-center gap-3 mb-6'>
								<h2 className='text-2xl font-heading font-bold'>
									{widgetCategories[
										category as keyof typeof widgetCategories
									] || category}
								</h2>
								<Badge variant='outline' className='font-medium'>
									{projects.length}
								</Badge>
							</div>

							{viewMode === 'grid' ? (
								<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-300'>
									{projects.map(project => (
										<Link
											key={project.id}
											href={`/tools/${project.path}`}
											className='block group'
										>
											<Card className='h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-border/50 bg-gradient-to-br from-background to-muted/10'>
												<CardHeader>
													<div
														className={`w-16 h-16 rounded-xl bg-gradient-to-br ${project.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg`}
													>
														{project.icon}
													</div>
													<CardTitle className='text-lg font-heading transition-all duration-300 group-hover:text-primary'>
														{project.title}
													</CardTitle>
												</CardHeader>
												<CardContent>
													<p className='text-sm text-muted-foreground mb-3'>
														{project.description}
													</p>
													{project.tags.length > 0 && (
														<div className='flex flex-wrap gap-1'>
															{project.tags.slice(0, 3).map(tag => (
																<Badge
																	key={tag}
																	variant='secondary'
																	className='text-xs'
																>
																	{tag}
																</Badge>
															))}
															{project.tags.length > 3 && (
																<Badge variant='outline' className='text-xs'>
																	+{project.tags.length - 3}
																</Badge>
															)}
														</div>
													)}
												</CardContent>
											</Card>
										</Link>
									))}
								</div>
							) : (
								<div className='space-y-3 transition-all duration-300'>
									{projects.map(project => (
										<Link
											key={project.id}
											href={`/tools/${project.path}`}
											className='block group'
										>
											<Card className='transition-all duration-300 hover:shadow-lg border-border/50 bg-gradient-to-br from-background to-muted/10'>
												<CardContent className='p-5'>
													<div className='flex items-center gap-4'>
														<div
															className={`w-14 h-14 rounded-xl bg-gradient-to-br ${project.gradient} flex items-center justify-center text-white group-hover:scale-110 transition-all duration-300 shadow-md`}
														>
															<project.widget.icon className='w-7 h-7' />
														</div>
														<div className='flex-1'>
															<h3 className='font-heading font-semibold text-lg mb-1 transition-all duration-300 group-hover:text-primary'>
																{project.title}
															</h3>
															<p className='text-sm text-muted-foreground mb-2'>
																{project.description}
															</p>
															{project.tags.length > 0 && (
																<div className='flex flex-wrap gap-1'>
																	{project.tags.slice(0, 5).map(tag => (
																		<Badge
																			key={tag}
																			variant='secondary'
																			className='text-xs'
																		>
																			{tag}
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
									))}
								</div>
							)}
						</section>
					))}
				</div>
			)}
		</div>
	)
}

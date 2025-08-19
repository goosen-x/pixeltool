'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { Home, ChevronRight, Settings, ChevronDown } from 'lucide-react'
import {
	widgets,
	widgetCategories,
	getWidgetsByCategory
} from '@/lib/constants/widgets'
import { useState, useEffect } from 'react'

interface ProjectsSidebarProps {
	onLinkClick?: () => void
}

export function ProjectsSidebar({ onLinkClick }: ProjectsSidebarProps = {}) {
	const pathname = usePathname()
	const locale = useLocale()
	const t = useTranslations('projectsPage')
	const widgetT = useTranslations('widgets')
	const categoriesT = useTranslations('widgets.categories')

	// State for collapsed categories with localStorage persistence
	const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(
		new Set()
	)

	// Load collapsed state from localStorage on mount
	useEffect(() => {
		const saved = localStorage.getItem('tools-collapsed-categories')
		if (saved) {
			try {
				const collapsed = JSON.parse(saved)
				setCollapsedCategories(new Set(collapsed))
			} catch (error) {
				console.error('Error loading collapsed categories:', error)
			}
		}
	}, [])

	const toggleCategory = (categoryKey: string) => {
		const newCollapsed = new Set(collapsedCategories)
		if (newCollapsed.has(categoryKey)) {
			newCollapsed.delete(categoryKey)
		} else {
			newCollapsed.add(categoryKey)
		}
		setCollapsedCategories(newCollapsed)

		// Save to localStorage
		localStorage.setItem(
			'tools-collapsed-categories',
			JSON.stringify(Array.from(newCollapsed))
		)
	}

	return (
		<aside className='w-64 lg:w-56 xl:w-64 h-screen lg:h-full border-r bg-background lg:bg-muted/30 backdrop-blur-sm flex-shrink-0'>
			<div className='flex h-full flex-col'>
				<div className='border-b bg-background/50 px-4 lg:px-6 py-4 pt-8 lg:pt-4'>
					<h2 className='text-base lg:text-lg font-heading font-semibold'>
						{t('title')}
					</h2>
					<p className='text-xs lg:text-sm text-muted-foreground mt-1 break-words'>
						{t('description')}
					</p>
				</div>

				<nav className='flex-1 overflow-y-auto p-3 lg:p-4 projects-scroll'>
					<div className='space-y-1'>
						<Link
							href={`/${locale}/tools`}
							onClick={onLinkClick}
							className={cn(
								'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-primary/10 hover:text-primary',
								pathname === `/${locale}/tools` && 'bg-primary text-white'
							)}
						>
							<Home className='w-4 h-4' />
							<span>{t('overview')}</span>
						</Link>

						<div className='my-4 space-y-2'>
							{/* Render categories dynamically */}
							{Object.entries(widgetCategories).map(
								([categoryKey, categoryName], idx) => {
									const categoryWidgets = getWidgetsByCategory(
										categoryKey as keyof typeof widgetCategories
									)

									if (categoryWidgets.length === 0) return null

									const isCollapsed = collapsedCategories.has(categoryKey)

									return (
										<div
											key={categoryKey}
											className='relative mb-2'
											style={{ zIndex: 10 - idx }}
										>
											<button
												onClick={() => toggleCategory(categoryKey)}
												className='w-full flex items-center justify-between mb-2 px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground hover:bg-primary/5 transition-all duration-200 rounded-md group relative z-10'
											>
												<span className='group-hover:translate-x-1 transition-transform duration-200'>
													{categoriesT(categoryKey)}
												</span>
												<ChevronDown
													className={cn(
														'w-3 h-3 transition-all duration-300 ease-out group-hover:scale-110',
														isCollapsed ? 'rotate-180' : 'rotate-0'
													)}
												/>
											</button>
											<div
												className={cn(
													'transition-all duration-300 ease-out space-y-0.5 pb-1',
													isCollapsed
														? 'max-h-0 opacity-0 transform -translate-y-2 pb-0 overflow-hidden'
														: 'opacity-100 transform translate-y-0'
												)}
											>
												{categoryWidgets.map((widget, index) => {
													const isActive =
														pathname === `/${locale}/tools/${widget.path}`
													const Icon = widget.icon

													return (
														<div
															key={widget.id}
															className={cn(
																'transition-all duration-300 ease-out',
																isCollapsed
																	? 'opacity-0 transform translate-x-4 scale-95'
																	: 'opacity-100 transform translate-x-0 scale-100'
															)}
															style={{
																transitionDelay: isCollapsed
																	? '0ms'
																	: `${index * 50}ms`
															}}
														>
															<Link
																href={`/${locale}/tools/${widget.path}`}
																onClick={onLinkClick}
																className={cn(
																	'relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:translate-x-1 isolate',
																	isActive && 'bg-primary text-white'
																)}
															>
																<Icon className='w-4 h-4' />
																<span className='flex-1 text-left truncate'>
																	{widgetT(`${widget.translationKey}.title`)}
																</span>
																{isActive && (
																	<ChevronRight className='w-4 h-4' />
																)}
															</Link>
														</div>
													)
												})}
											</div>
										</div>
									)
								}
							)}
						</div>
					</div>
				</nav>

				{/* Settings section at the bottom */}
				<div className='border-t p-4'>
					<Link
						href={`/${locale}/settings`}
						onClick={onLinkClick}
						className={cn(
							'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-primary/10 hover:text-primary',
							pathname === `/${locale}/settings` && 'bg-primary text-white'
						)}
					>
						<Settings className='w-4 h-4' />
						<span className='flex-1 text-left truncate'>
							{t('categories.settings.title')}
						</span>
						{pathname === `/${locale}/settings` && (
							<ChevronRight className='w-4 h-4' />
						)}
					</Link>
				</div>
			</div>
		</aside>
	)
}

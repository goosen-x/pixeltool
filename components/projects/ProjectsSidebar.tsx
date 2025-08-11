'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { Home, ChevronRight, Settings, ChevronDown } from 'lucide-react'
import { widgets, widgetCategories, getWidgetsByCategory } from '@/lib/constants/widgets'
import { useState, useEffect } from 'react'

export function ProjectsSidebar() {
	const pathname = usePathname()
	const locale = useLocale()
	const t = useTranslations('projectsPage')
	const widgetT = useTranslations('widgets')
	
	// State for collapsed categories with localStorage persistence
	const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())
	
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
		localStorage.setItem('tools-collapsed-categories', JSON.stringify(Array.from(newCollapsed)))
	}

	return (
		<aside className="w-64 border-r bg-muted/30 backdrop-blur-sm">
			<div className="flex h-full flex-col">
				<div className="border-b bg-background/50 px-6 py-4">
					<h2 className="text-lg font-semibold">{t('title')}</h2>
					<p className="text-sm text-muted-foreground mt-1">
						{t('description')}
					</p>
				</div>

				<nav className="flex-1 overflow-y-auto p-4 projects-scroll">
					<div className="space-y-1">
						<Link
							href={`/${locale}/tools`}
							className={cn(
								"flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent/10 hover:text-foreground",
								pathname === `/${locale}/tools` && "bg-accent text-white"
							)}
						>
							<Home className="w-4 h-4" />
							<span>Overview</span>
						</Link>

						<div className="my-4 space-y-4">
							{/* Render categories dynamically */}
							{Object.entries(widgetCategories)
								.map(([categoryKey, categoryName]) => {
									const categoryWidgets = getWidgetsByCategory(categoryKey as keyof typeof widgetCategories)
									
									if (categoryWidgets.length === 0) return null

									const isCollapsed = collapsedCategories.has(categoryKey)
									
									return (
										<div key={categoryKey}>
											<button
												onClick={() => toggleCategory(categoryKey)}
												className="w-full flex items-center justify-between mb-2 px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground hover:bg-accent/5 transition-all duration-200 rounded-md group"
											>
												<span className="group-hover:translate-x-1 transition-transform duration-200">{categoryName}</span>
												<ChevronDown 
													className={cn(
														"w-3 h-3 transition-all duration-300 ease-out group-hover:scale-110",
														isCollapsed ? "rotate-180" : "rotate-0"
													)} 
												/>
											</button>
											<div 
												className={cn(
													"overflow-hidden transition-all duration-300 ease-out",
													isCollapsed 
														? "max-h-0 opacity-0 transform -translate-y-2" 
														: "max-h-[1000px] opacity-100 transform translate-y-0"
												)}
											>
												{categoryWidgets.map((widget, index) => {
												const isActive = pathname === `/${locale}/tools/${widget.path}`
												const Icon = widget.icon
												
												return (
													<div
														key={widget.id}
														className={cn(
															"transition-all duration-300 ease-out",
															isCollapsed 
																? "opacity-0 transform translate-x-4 scale-95" 
																: "opacity-100 transform translate-x-0 scale-100"
														)}
														style={{
															transitionDelay: isCollapsed ? '0ms' : `${index * 50}ms`
														}}
													>
														<Link
															href={`/${locale}/tools/${widget.path}`}
															className={cn(
																"flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:bg-accent/10 hover:text-foreground hover:translate-x-1",
																isActive && "bg-accent text-white"
															)}
														>
															<Icon className="w-4 h-4" />
															<span className="flex-1 text-left">{widgetT(`${widget.translationKey}.title`)}</span>
															{isActive && <ChevronRight className="w-4 h-4" />}
														</Link>
													</div>
												)
											})}
											</div>
										</div>
									)
								})}
						</div>
					</div>
				</nav>

				{/* Settings section at the bottom */}
				<div className="border-t p-4">
					<Link
						href={`/${locale}/settings`}
						className={cn(
							"flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent/10 hover:text-foreground",
							pathname === `/${locale}/settings` && "bg-accent text-white"
						)}
					>
						<Settings className="w-4 h-4" />
						<span className="flex-1 text-left">{t('categories.settings.title')}</span>
						{pathname === `/${locale}/settings` && <ChevronRight className="w-4 h-4" />}
					</Link>
				</div>
			</div>
		</aside>
	)
}
'use client'

import { usePathname } from 'next/navigation'

import { WidgetWrapper, WidgetHeader } from '@/components/widgets'
import { WidgetFAQ } from '@/components/widgets/WidgetFAQ'
import { RelatedTools } from '@/components/seo/RelatedTools'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { WidgetStructuredData } from '@/components/seo/WidgetStructuredData'
import { getWidgetByPath } from '@/lib/constants/widgets'
import { useAnalytics } from '@/lib/hooks/useAnalytics'
import { ReactNode, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ProjectsLeftSidebar } from './ProjectsLeftSidebar'
import { ProjectsRightSidebar } from './ProjectsRightSidebar'
import { CompactFooter } from '@/components/layout/CompactFooter'
import type { ToolStats } from '@/lib/tool-stats/get-all-stats'

type Props = {
	children: ReactNode
	toolStats: Record<string, ToolStats>
}

export function ProjectsLayoutWrapper({ children, toolStats }: Props) {
	const pathname = usePathname()
	const [isSidebarOpen, setIsSidebarOpen] = useState(false)

	// Extract widget path from URL: /en/projects/widget-name -> widget-name
	const widgetPath = pathname.split('/').pop()
	const widget = widgetPath ? getWidgetByPath(widgetPath) : null
	const widgetId = widget?.id

	// Track analytics for the current widget
	useAnalytics(widgetId || '')

	return (
		// --chrome-h — реальная высота баннера «инструмент месяца» + шапки,
		// её выставляет ChromeHeightVar (lib/ui/chrome-height.ts). 5rem —
		// фоллбэк на высоту одной шапки (h-20), пока эффект не отработал.
		<div className='flex h-[calc(100vh-var(--chrome-h,5rem))] relative'>
			{/* Sidebar - hidden on mobile, shown on desktop */}
			<div
				className={cn(
					'fixed lg:relative top-[var(--chrome-h,5rem)] lg:top-0 left-0 z-40 h-[calc(100vh-var(--chrome-h,5rem))] lg:h-full transform transition-transform duration-300 ease-in-out lg:transform-none',
					isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
				)}
			>
				<ProjectsLeftSidebar onLinkClick={() => setIsSidebarOpen(false)} />
			</div>

			<main className='flex-1 flex flex-col overflow-hidden min-w-0'>
				<div className='flex-1 flex overflow-hidden'>
					<div className='flex-1 overflow-y-auto projects-scroll min-w-0'>
						<div className='container mx-auto py-6 lg:py-8 px-4 sm:px-6 lg:px-8 max-w-6xl'>
							{widget && !widget.demo && (
								<WidgetStructuredData
									widget={widget}
									stats={widgetId ? toolStats[widgetId] : undefined}
								/>
							)}
							{widget?.demo && (
								<div className='mb-6 rounded-lg border border-dashed border-amber-500/50 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-700 dark:text-amber-400'>
									Демо-версия — тул ещё не утверждён финально и не опубликован
									на прод (не в каталоге, не в поиске).
								</div>
							)}
							{widget && (
								<Breadcrumbs
									className='px-0 sm:px-0 lg:px-0 pt-0 sm:pt-0 pb-0 sm:pb-0 mb-8 max-w-none mx-0'
									items={[
										{ name: 'Главная', url: '/' },
										{ name: 'Инструменты', url: '/tools' },
										{
											name: widget.title || widgetPath || '',
											url: `/tools/${widget.path}`
										}
									]}
								/>
							)}
							{widgetId && <WidgetHeader widgetId={widgetId} />}
							<WidgetWrapper>
								{children}
								{widgetId && (
									<>
										<RelatedTools currentTool={widgetId} category={widget?.category} />
										<WidgetFAQ widgetId={widgetId} />
									</>
								)}
							</WidgetWrapper>
							<CompactFooter />
						</div>
					</div>
					{/* Right sidebar - hidden on mobile and tablets, shown on desktop */}
					<div className='hidden xl:block overflow-y-auto flex-shrink-0'>
						{widgetId && <ProjectsRightSidebar />}
					</div>
				</div>
			</main>
		</div>
	)
}

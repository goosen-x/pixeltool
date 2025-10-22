'use client'

import { usePathname } from 'next/navigation'

import { WidgetWrapper, WidgetHeader } from '@/components/widgets'
import { WidgetFAQ } from '@/components/widgets/WidgetFAQ'
import { RelatedTools } from '@/components/seo/RelatedTools'
import { getWidgetByPath } from '@/lib/constants/widgets'
import { useAnalytics } from '@/lib/hooks/useAnalytics'
import { ReactNode, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ProjectsLeftSidebar } from './ProjectsLeftSidebar'
import { ProjectsRightSidebar } from './ProjectsRightSidebar'

type Props = {
	children: ReactNode
}

export function ProjectsLayoutWrapper({ children }: Props) {
	const pathname = usePathname()
	const [isSidebarOpen, setIsSidebarOpen] = useState(false)

	// Extract widget path from URL: /en/projects/widget-name -> widget-name
	const widgetPath = pathname.split('/').pop()
	const widget = widgetPath ? getWidgetByPath(widgetPath) : null
	const widgetId = widget?.id

	// Track analytics for the current widget
	useAnalytics(widgetId || '')

	return (
		<div className='flex h-[calc(100vh-5rem)] relative'>
			{/* Sidebar - hidden on mobile, shown on desktop */}
			<div
				className={cn(
					'fixed lg:relative top-20 lg:top-0 left-0 z-40 h-[calc(100vh-5rem)] lg:h-full transform transition-transform duration-300 ease-in-out lg:transform-none',
					isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
				)}
			>
				<ProjectsLeftSidebar onLinkClick={() => setIsSidebarOpen(false)} />
			</div>

			<main className='flex-1 flex flex-col overflow-hidden min-w-0'>
				<div className='flex-1 flex overflow-hidden'>
					<div className='flex-1 overflow-y-auto projects-scroll min-w-0'>
						<div className='container mx-auto py-6 lg:py-8 px-4 sm:px-6 lg:px-8 max-w-6xl'>
							{widgetId && <WidgetHeader widgetId={widgetId} />}
							<WidgetWrapper>
								{children}
								{widgetId && (
									<>
										<RelatedTools currentTool={widgetId} />
										<WidgetFAQ widgetId={widgetId} />
									</>
								)}
							</WidgetWrapper>
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

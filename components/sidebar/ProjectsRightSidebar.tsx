'use client'

import { useEffect, useState } from 'react'
import { getWidgetByPath } from '@/lib/constants/widgets'
import { usePathname } from 'next/navigation'
import { getWidgetShortcuts } from '@/lib/constants/widgetShortcuts'
import { AdSection } from '@/components/ads'
import { WidgetInfoCard } from './WidgetInfoCard'
import { KeyboardShortcutsCard } from './KeyboardShortcutsCard'
import { UseCaseCard } from './UseCaseCard'
import { WidgetStatsCard } from './WidgetStatsCard'
import { ActionsAndFeedbackCard } from './ActionsAndFeedbackCard'

// Hook для определения ОС
const useOperatingSystem = () => {
	const [isMac, setIsMac] = useState(false)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setIsMac(/Mac|iPod|iPhone|iPad/.test(navigator.userAgent))
		}
	}, [])

	return isMac
}

export function ProjectsRightSidebar() {
	const pathname = usePathname()
	const isMac = useOperatingSystem()

	// Extract widget path from URL
	const widgetPath = pathname.split('/').pop()
	const widget = widgetPath ? getWidgetByPath(widgetPath) : null

	// Get widget shortcuts
	const widgetShortcuts = getWidgetShortcuts(pathname, isMac)

	if (!widget) return null

	return (
		<aside className='w-72 xl:w-80 h-full p-3 lg:p-4 space-y-3 lg:space-y-4 overflow-y-auto projects-scroll flex-shrink-0'>
			<WidgetInfoCard widget={widget} />
			<AdSection />
			<KeyboardShortcutsCard widgetShortcuts={widgetShortcuts} />
			<UseCaseCard widget={widget} />
			<WidgetStatsCard widget={widget} />
			<ActionsAndFeedbackCard />
		</aside>
	)
}

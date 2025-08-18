'use client'

import { usePathname } from 'next/navigation'
import { YandexGoals, trackToolUsage } from '@/lib/analytics/yandex-goals'

export function useYandexGoals() {
	const pathname = usePathname()

	// Extract tool name from pathname
	const getToolName = () => {
		const match = pathname.match(/\/tools\/([^/]+)/)
		return match ? match[1] : 'unknown'
	}

	return {
		// Track main tool action (calculate, generate, convert, etc.)
		trackToolAction: (action: string) => {
			const toolName = getToolName()
			trackToolUsage(toolName, action)
		},

		// Track copy action
		trackCopy: (resultType?: string) => {
			const toolName = getToolName()
			YandexGoals.resultCopied(toolName, resultType)
		},

		// Track download
		trackDownload: (format?: string) => {
			const toolName = getToolName()
			YandexGoals.resultDownloaded(toolName, format)
		},

		// Track search
		trackSearch: (query: string) => {
			YandexGoals.toolSearched(query)
		},

		// Track favorite
		trackFavorite: (isFavorite: boolean) => {
			const toolName = getToolName()
			YandexGoals.toolFavorited(toolName, isFavorite)
		},

		// Track shortcut usage
		trackShortcut: (shortcut: string) => {
			const toolName = getToolName()
			YandexGoals.shortcutUsed(toolName, shortcut)
		},

		// Direct access to all goals
		goals: YandexGoals
	}
}

// Yandex Metrika Goals
declare global {
	interface Window {
		ym?: (counterId: number, action: string, ...params: any[]) => void
	}
}

const METRIKA_ID = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID
const isDevelopment = process.env.NODE_ENV === 'development'

export const YandexGoals = {
	// Tool usage
	toolUsed: (toolName: string, action: string) => {
		if (
			typeof window !== 'undefined' &&
			window.ym &&
			METRIKA_ID &&
			!isDevelopment
		) {
			window.ym(Number(METRIKA_ID), 'reachGoal', 'tool_used', {
				tool: toolName,
				action: action
			})
		}
	},

	// Result copied
	resultCopied: (toolName: string, resultType?: string) => {
		if (
			typeof window !== 'undefined' &&
			window.ym &&
			METRIKA_ID &&
			!isDevelopment
		) {
			window.ym(Number(METRIKA_ID), 'reachGoal', 'result_copied', {
				tool: toolName,
				type: resultType || 'default'
			})
		}
	},

	// Result downloaded
	resultDownloaded: (toolName: string, format?: string) => {
		if (
			typeof window !== 'undefined' &&
			window.ym &&
			METRIKA_ID &&
			!isDevelopment
		) {
			window.ym(Number(METRIKA_ID), 'reachGoal', 'result_downloaded', {
				tool: toolName,
				format: format || 'unknown'
			})
		}
	},

	// Tool search
	toolSearched: (query: string) => {
		if (
			typeof window !== 'undefined' &&
			window.ym &&
			METRIKA_ID &&
			!isDevelopment
		) {
			window.ym(Number(METRIKA_ID), 'reachGoal', 'tool_search', {
				query: query
			})
		}
	},

	// Tool favorited
	toolFavorited: (toolName: string, isFavorite: boolean) => {
		if (
			typeof window !== 'undefined' &&
			window.ym &&
			METRIKA_ID &&
			!isDevelopment
		) {
			window.ym(Number(METRIKA_ID), 'reachGoal', 'tool_favorited', {
				tool: toolName,
				action: isFavorite ? 'add' : 'remove'
			})
		}
	},

	// Repeated use
	toolRepeatedUse: (toolName: string, count: number) => {
		if (
			typeof window !== 'undefined' &&
			window.ym &&
			METRIKA_ID &&
			!isDevelopment
		) {
			window.ym(Number(METRIKA_ID), 'reachGoal', 'tool_repeated_use', {
				tool: toolName,
				count: count
			})
		}
	},

	// PWA installed
	pwaInstalled: () => {
		if (
			typeof window !== 'undefined' &&
			window.ym &&
			METRIKA_ID &&
			!isDevelopment
		) {
			window.ym(Number(METRIKA_ID), 'reachGoal', 'pwa_installed')
		}
	},

	// Theme changed
	themeChanged: (theme: 'light' | 'dark') => {
		if (
			typeof window !== 'undefined' &&
			window.ym &&
			METRIKA_ID &&
			!isDevelopment
		) {
			window.ym(Number(METRIKA_ID), 'reachGoal', 'theme_changed', {
				theme: theme
			})
		}
	},

	// Language changed
	languageChanged: (language: string) => {
		if (
			typeof window !== 'undefined' &&
			window.ym &&
			METRIKA_ID &&
			!isDevelopment
		) {
			window.ym(Number(METRIKA_ID), 'reachGoal', 'language_changed', {
				language: language
			})
		}
	},

	// Keyboard shortcut used
	shortcutUsed: (toolName: string, shortcut: string) => {
		if (
			typeof window !== 'undefined' &&
			window.ym &&
			METRIKA_ID &&
			!isDevelopment
		) {
			window.ym(Number(METRIKA_ID), 'reachGoal', 'shortcut_used', {
				tool: toolName,
				shortcut: shortcut
			})
		}
	}
}

// Helper to track tool usage with session count
const toolUsageCount: Record<string, number> = {}

export const trackToolUsage = (toolName: string, action: string) => {
	// Track general usage
	YandexGoals.toolUsed(toolName, action)

	// Track repeated usage
	if (!toolUsageCount[toolName]) {
		toolUsageCount[toolName] = 0
	}
	toolUsageCount[toolName]++

	if (toolUsageCount[toolName] >= 3) {
		YandexGoals.toolRepeatedUse(toolName, toolUsageCount[toolName])
	}
}

// Safe translation utilities to prevent runtime errors

import type { Translations } from '@/types/translations'

/**
 * Safe wrapper for translations with fallback
 */
export function safeTranslate(
	translator: any,
	key: string,
	fallback: string
): string {
	try {
		const result = translator.raw ? translator.raw(key) : translator(key)

		// Check if translation was found (not returning the key)
		if (result && typeof result === 'string' && !result.includes(key)) {
			return result
		}

		return fallback
	} catch (error) {
		return fallback
	}
}

/**
 * Safely get a translation value with fallback
 * @param translations - The translations object
 * @param path - Dot-separated path to the translation (e.g., 'widgets.colorConverter.title')
 * @param fallback - Fallback value if translation is missing
 */
export function safeTranslation(
	translations: any,
	path: string,
	fallback: string = ''
): string {
	try {
		const keys = path.split('.')
		let value = translations

		for (const key of keys) {
			if (value && typeof value === 'object' && key in value) {
				value = value[key]
			} else {
				console.warn(`Translation missing: ${path}`)
				return fallback
			}
		}

		return typeof value === 'string' ? value : fallback
	} catch (error) {
		console.error(`Error accessing translation: ${path}`, error)
		return fallback
	}
}

/**
 * Check if a widget has all required translations
 */
export function hasRequiredWidgetTranslations(
	widget: any
): widget is { title: string; description: string; useCase: string } {
	return (
		widget &&
		typeof widget === 'object' &&
		typeof widget.title === 'string' &&
		typeof widget.description === 'string' &&
		typeof widget.useCase === 'string'
	)
}

/**
 * Get widget translation with validation
 */
export function getWidgetTranslation(
	translations: Translations,
	widgetName: string
): { title: string; description: string; useCase: string } | null {
	const widget =
		translations.widgets?.[widgetName as keyof typeof translations.widgets]

	if (hasRequiredWidgetTranslations(widget)) {
		return {
			title: widget.title,
			description: widget.description,
			useCase: widget.useCase
		}
	}

	console.error(`Invalid or missing widget translation: ${widgetName}`)
	return null
}

/**
 * Merge widget translations (brief + full definitions)
 * This handles the case where widgets might have definitions in multiple places
 */
export function mergeWidgetTranslations(briefDef: any, fullDef: any): any {
	// If both exist, merge them (full definition takes precedence)
	if (briefDef && fullDef) {
		return { ...briefDef, ...fullDef }
	}

	// Return whichever exists
	return fullDef || briefDef || null
}

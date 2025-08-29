/**
 * Validates widget shortcuts configuration at build time
 */

import { widgetShortcuts } from '@/lib/constants/widgetShortcuts'
import { widgets } from '@/lib/constants/widgets'
import type { WidgetId } from '@/lib/constants/widgetShortcuts'

interface ValidationError {
	widgetId: string
	error: string
}

/**
 * Validate that all shortcuts reference existing widgets
 */
export function validateShortcutsExist(): ValidationError[] {
	const errors: ValidationError[] = []
	const widgetIds = new Set(widgets.map(w => w.id))

	Object.keys(widgetShortcuts).forEach(widgetId => {
		if (!widgetIds.has(widgetId)) {
			errors.push({
				widgetId,
				error: `Widget ID "${widgetId}" in shortcuts does not exist in widgets array`
			})
		}
	})

	return errors
}

/**
 * Validate shortcut format
 */
export function validateShortcutFormat(
	widgetId: string,
	shortcut: string
): string | null {
	// Check if shortcut has at least one space (keys + description)
	const parts = shortcut.split(' ')
	if (parts.length < 2) {
		return `Invalid format: "${shortcut}" should be "Keys Description"`
	}

	// Check if keys part contains valid modifiers
	const keys = parts[0]
	const validModifiers = [
		'⌘',
		'Ctrl',
		'⇧',
		'Shift',
		'⌥',
		'Alt',
		'Option',
		'Space',
		'Enter',
		'Tab'
	]
	const keyParts = keys.split('+')

	// Special keys that don't need modifiers
	const standaloneKeys = [
		'Space',
		'Enter',
		'Tab',
		'Escape',
		'?',
		'/',
		'U',
		'F1-F12'
	]
	const needsModifier = !standaloneKeys.some(k => keys.startsWith(k))

	if (needsModifier && keyParts.length < 2) {
		return `Shortcut "${shortcut}" should have modifiers (e.g., ⌘+C)`
	}

	return null
}

/**
 * Validate all shortcuts
 */
export function validateAllShortcuts(): ValidationError[] {
	const errors: ValidationError[] = []

	// Check for non-existent widgets
	errors.push(...validateShortcutsExist())

	// Check shortcut formats
	Object.entries(widgetShortcuts).forEach(([widgetId, config]) => {
		if (config) {
			config.shortcuts.forEach(shortcut => {
				const formatError = validateShortcutFormat(widgetId, shortcut)
				if (formatError) {
					errors.push({ widgetId, error: formatError })
				}
			})
		}
	})

	return errors
}

/**
 * Get widgets without shortcuts
 */
export function getWidgetsWithoutShortcuts(): string[] {
	const widgetIds = new Set(widgets.map(w => w.id))
	const shortcutWidgetIds = new Set(Object.keys(widgetShortcuts))

	return Array.from(widgetIds).filter(id => !shortcutWidgetIds.has(id))
}

/**
 * Get shortcut conflicts (same key combination used by multiple widgets)
 */
export function findShortcutConflicts(): Record<string, string[]> {
	const keyMap: Record<string, string[]> = {}

	Object.entries(widgetShortcuts).forEach(([widgetId, config]) => {
		if (config) {
			config.shortcuts.forEach(shortcut => {
				const keys = shortcut.split(' ')[0]
				if (!keyMap[keys]) {
					keyMap[keys] = []
				}
				keyMap[keys].push(widgetId)
			})
		}
	})

	// Filter to only show conflicts
	return Object.fromEntries(
		Object.entries(keyMap).filter(([_, widgets]) => widgets.length > 1)
	)
}

// Optional: Run validation at build time
if (process.env.NODE_ENV === 'development') {
	const errors = validateAllShortcuts()
	if (errors.length > 0) {
		console.warn('Widget shortcut validation errors:', errors)
	}

	const widgetsWithoutShortcuts = getWidgetsWithoutShortcuts()
	if (widgetsWithoutShortcuts.length > 0) {
		console.info(
			`Widgets without shortcuts: ${widgetsWithoutShortcuts.length}`,
			widgetsWithoutShortcuts
		)
	}

	const conflicts = findShortcutConflicts()
	if (Object.keys(conflicts).length > 0) {
		console.warn('Shortcut conflicts found:', conflicts)
	}
}

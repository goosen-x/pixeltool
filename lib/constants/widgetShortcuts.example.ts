/**
 * Example of adding new widget shortcuts with TypeScript autocomplete
 */

import type { WidgetId, WidgetShortcutConfig } from './widgetShortcuts'

// When adding a new widget shortcut, TypeScript will autocomplete valid widget IDs
const newShortcut: Record<WidgetId, WidgetShortcutConfig> = {
	// TypeScript will suggest all valid widget IDs here
	'base64-encoder': {
		shortcuts: [
			'⌘+E Encode',
			'⌘+D Decode',
			'⌘+⇧+C Copy Result',
			'⌘+F File Mode'
		],
		description: '🔤 Encode and decode Base64 strings'
	}
}

// Example of type-safe shortcut access
import { widgetShortcuts } from './widgetShortcuts'

// TypeScript knows this is valid
const cssClampShortcuts = widgetShortcuts['css-clamp-calculator']

// TypeScript will error on invalid widget ID
// const invalidShortcuts = widgetShortcuts['non-existent-widget'] // ❌ Error

// Example of checking if widget has shortcuts
function hasShortcuts(widgetId: WidgetId): boolean {
	return widgetId in widgetShortcuts
}

// Example of getting shortcut count
function getShortcutCount(widgetId: WidgetId): number {
	const shortcuts = widgetShortcuts[widgetId]
	return shortcuts?.shortcuts.length ?? 0
}

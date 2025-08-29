/**
 * Type definitions for keyboard shortcuts system
 */

// Modifier keys
export type ModifierKey = 'ctrl' | 'meta' | 'shift' | 'alt' | 'primary'

// Key combination format
export interface KeyCombination {
	key: string
	modifiers: ModifierKey[]
}

// Parsed shortcut
export interface ParsedShortcut {
	keys: string
	description: string
}

/**
 * Parse shortcut string into keys and description
 * @example "⌘+1 Copy CSS" -> { keys: "⌘+1", description: "Copy CSS" }
 */
export function parseShortcut(shortcut: string): ParsedShortcut {
	const parts = shortcut.split(' ')
	const keys = parts[0]
	const description = parts.slice(1).join(' ')

	return { keys, description }
}

/**
 * Format modifier key for display
 */
export function formatModifier(modifier: ModifierKey, isMac: boolean): string {
	const modifierMap: Record<ModifierKey, { mac: string; other: string }> = {
		ctrl: { mac: '⌃', other: 'Ctrl' },
		meta: { mac: '⌘', other: 'Win' },
		shift: { mac: '⇧', other: 'Shift' },
		alt: { mac: '⌥', other: 'Alt' },
		primary: { mac: '⌘', other: 'Ctrl' }
	}

	return isMac ? modifierMap[modifier].mac : modifierMap[modifier].other
}

/**
 * Parse key combination string
 * @example "⌘+⇧+C" -> { key: "C", modifiers: ["meta", "shift"] }
 */
export function parseKeyCombination(
	combination: string
): KeyCombination | null {
	const parts = combination.split('+')
	if (parts.length === 0) return null

	const key = parts[parts.length - 1]
	const modifierSymbols = parts.slice(0, -1)

	const symbolToModifier: Record<string, ModifierKey> = {
		'⌘': 'meta',
		Cmd: 'meta',
		Ctrl: 'ctrl',
		'⌃': 'ctrl',
		'⇧': 'shift',
		Shift: 'shift',
		'⌥': 'alt',
		Alt: 'alt',
		Option: 'alt'
	}

	const modifiers = modifierSymbols
		.map(symbol => symbolToModifier[symbol])
		.filter((mod): mod is ModifierKey => mod !== undefined)

	return { key, modifiers }
}

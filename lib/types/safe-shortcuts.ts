/**
 * Type-safe keyboard shortcut definitions
 * This ensures only safe, non-conflicting shortcuts are used
 */

// Safe modifier combinations that don't conflict with browsers
export type SafeModifierCombination =
	| { primary: true; shift: true } // ⌘/Ctrl + Shift + Key
	| { primary: true; shift: true; alt: true } // ⌘/Ctrl + Shift + Alt + Key
	| { primary: true; alt: true } // ⌘/Ctrl + Alt + Key
	| { alt: true; shift: true } // Alt + Shift + Key
	| { primary: true } // ⌘/Ctrl + Key (use carefully!)
	| {} // No modifiers (for Space, Enter, etc.)

// Keys that are generally safe to use
export type SafeKey =
	// Numbers (relatively safe with primary modifier)
	| '0'
	| '1'
	| '2'
	| '3'
	| '4'
	| '5'
	| '6'
	| '7'
	| '8'
	| '9'
	// Letters (ONLY safe with Shift modifier)
	| 'a'
	| 'b'
	| 'c'
	| 'd'
	| 'e'
	| 'f'
	| 'g'
	| 'h'
	| 'i'
	| 'j'
	| 'k'
	| 'l'
	| 'm'
	| 'n'
	| 'o'
	| 'p'
	| 'q'
	| 'r'
	| 's'
	| 't'
	| 'u'
	| 'v'
	| 'w'
	| 'x'
	| 'y'
	| 'z'
	| 'A'
	| 'B'
	| 'C'
	| 'D'
	| 'E'
	| 'F'
	| 'G'
	| 'H'
	| 'I'
	| 'J'
	| 'K'
	| 'L'
	| 'M'
	| 'N'
	| 'O'
	| 'P'
	| 'Q'
	| 'R'
	| 'S'
	| 'T'
	| 'U'
	| 'V'
	| 'W'
	| 'X'
	| 'Y'
	| 'Z'
	// Special keys (safe without modifiers)
	| 'Enter'
	| 'Space'
	| 'Escape'
	| 'Tab'
	| 'ArrowUp'
	| 'ArrowDown'
	| 'ArrowLeft'
	| 'ArrowRight'
	| 'Home'
	| 'End'
	| 'PageUp'
	| 'PageDown'
	| 'Insert'
	| 'Delete'
	| 'Backspace'
	// Function keys (use carefully)
	| 'F1'
	| 'F2'
	| 'F3'
	| 'F4'
	| 'F5'
	| 'F6'
	| 'F7'
	| 'F8'
	| 'F9'
	| 'F10'
	| 'F11'
	| 'F12'

// Browser conflicting combinations to NEVER use
export const UNSAFE_SHORTCUTS = [
	'Ctrl+R',
	'Cmd+R', // Reload
	'Ctrl+T',
	'Cmd+T', // New tab
	'Ctrl+W',
	'Cmd+W', // Close tab
	'Ctrl+Q',
	'Cmd+Q', // Quit
	'Ctrl+N',
	'Cmd+N', // New window
	'Ctrl+O',
	'Cmd+O', // Open
	'Ctrl+S',
	'Cmd+S', // Save
	'Ctrl+P',
	'Cmd+P', // Print
	'Ctrl+F',
	'Cmd+F', // Find
	'Ctrl+G',
	'Cmd+G', // Find next
	'Ctrl+H',
	'Cmd+H', // History
	'Ctrl+L',
	'Cmd+L', // Address bar
	'Ctrl+K',
	'Cmd+K', // Search
	'Ctrl+D',
	'Cmd+D', // Bookmark
	'Ctrl+U',
	'Cmd+U', // View source
	'Ctrl+A',
	'Cmd+A', // Select all
	'Ctrl+E',
	'Cmd+E', // Search (some browsers)
	'Ctrl+J',
	'Cmd+J', // Downloads
	'Ctrl+Shift+R',
	'Cmd+Shift+R', // Hard reload (Chrome/Firefox)
	'F5',
	'Ctrl+F5',
	'Cmd+R' // Reload variants
] as const

// Recommended safe shortcut patterns
export const SAFE_PATTERNS = {
	// Primary actions
	execute: { key: 'Enter', primary: true } as const,
	executeAlt: { key: 'Enter', primary: true, shift: true } as const,

	// Copy operations (numbers are safe)
	copyPrimary: { key: '1', primary: true } as const,
	copySecondary: { key: '2', primary: true } as const,
	copyTertiary: { key: '3', primary: true } as const,
	copyResult: { key: 'c', primary: true, shift: true } as const,

	// Modifications (with Shift for safety)
	reset: { key: 'r', primary: true, shift: true } as const,
	add: { key: 'a', primary: true, shift: true } as const,
	remove: { key: 'd', primary: true, shift: true } as const,
	toggle: { key: 't', primary: true, shift: true } as const,
	switchMode: { key: 'm', primary: true, shift: true } as const,
	switchUnits: { key: 'u', primary: true, shift: true } as const,

	// Navigation
	next: { key: 'n', primary: true, shift: true } as const,
	previous: { key: 'p', primary: true, shift: true } as const,

	// File operations
	export: { key: 'e', primary: true, shift: true } as const,
	import: { key: 'i', primary: true, shift: true } as const,
	save: { key: 's', primary: true, shift: true } as const,

	// Special actions (no modifiers needed)
	playPause: { key: 'Space' } as const,
	confirm: { key: 'Enter' } as const,
	cancel: { key: 'Escape' } as const
} as const

// Type guard to check if a shortcut is safe
export function isSafeShortcut(
	key: string,
	modifiers: {
		primary?: boolean
		shift?: boolean
		alt?: boolean
		ctrl?: boolean
		meta?: boolean
	}
): boolean {
	// Build shortcut string
	const parts = []
	if (modifiers.ctrl || modifiers.primary) parts.push('Ctrl')
	if (modifiers.meta || modifiers.primary) parts.push('Cmd')
	if (modifiers.shift) parts.push('Shift')
	if (modifiers.alt) parts.push('Alt')
	parts.push(key.toUpperCase())

	const shortcut = parts.join('+')

	// Check against unsafe list
	return !UNSAFE_SHORTCUTS.some(
		unsafe => shortcut.includes(unsafe) || unsafe.includes(shortcut)
	)
}

// Widget shortcut configuration type
export interface SafeWidgetShortcut {
	key: SafeKey
	primary?: boolean
	shift?: boolean
	alt?: boolean
	description: string
	action: () => void
	enabled?: boolean
}

// Validate widget shortcuts at compile time
export type ValidateShortcuts<T extends SafeWidgetShortcut[]> = T

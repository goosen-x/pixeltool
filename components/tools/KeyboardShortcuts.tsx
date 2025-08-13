'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'

interface ShortcutConfig {
	key: string
	ctrl?: boolean
	meta?: boolean
	shift?: boolean
	alt?: boolean
	action: () => void
	description: string
}

interface KeyboardShortcutsProps {
	shortcuts: ShortcutConfig[]
	showToast?: boolean
}

export function KeyboardShortcuts({ shortcuts, showToast = false }: KeyboardShortcutsProps) {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			for (const shortcut of shortcuts) {
				const ctrlOrMeta = shortcut.ctrl ? (e.ctrlKey || e.metaKey) : shortcut.meta ? e.metaKey : true
				const shift = shortcut.shift ? e.shiftKey : !e.shiftKey
				const alt = shortcut.alt ? e.altKey : !e.altKey
				
				if (
					e.key.toLowerCase() === shortcut.key.toLowerCase() &&
					ctrlOrMeta &&
					shift &&
					alt
				) {
					e.preventDefault()
					shortcut.action()
					
					if (showToast) {
						toast.success(shortcut.description)
					}
					break
				}
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [shortcuts, showToast])

	return null
}

// Common shortcuts for widget pages
export const commonWidgetShortcuts: ShortcutConfig[] = [
	{
		key: 'c',
		meta: true,
		action: () => {
			// Copy functionality will be implemented by individual widgets
			document.dispatchEvent(new CustomEvent('widget:copy'))
		},
		description: 'Copy result'
	},
	{
		key: 'k',
		meta: true,
		action: () => {
			// Clear functionality will be implemented by individual widgets
			document.dispatchEvent(new CustomEvent('widget:clear'))
		},
		description: 'Clear all'
	},
	{
		key: 's',
		meta: true,
		action: () => {
			// Save functionality will be implemented by individual widgets
			document.dispatchEvent(new CustomEvent('widget:save'))
		},
		description: 'Save result'
	},
	{
		key: 'Enter',
		meta: true,
		action: () => {
			// Execute functionality will be implemented by individual widgets
			document.dispatchEvent(new CustomEvent('widget:execute'))
		},
		description: 'Execute/Convert'
	}
]
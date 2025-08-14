'use client'

import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getWidgetShortcuts as getConfiguredShortcuts } from '@/lib/constants/widgetShortcuts'

// Detect operating system for correct modifier keys
const useOperatingSystem = () => {
	const [isMac, setIsMac] = useState(false)
	
	useEffect(() => {
		if (typeof window !== 'undefined') {
			setIsMac(/Mac|iPod|iPhone|iPad/.test(navigator.userAgent))
		}
	}, [])
	
	return isMac
}

export function ProjectsFooter() {
	const t = useTranslations('Footer')
	const pathname = usePathname()
	const isMac = useOperatingSystem()
	
	// Get configured shortcuts or use defaults
	const widgetInfo = getConfiguredShortcuts(pathname, isMac) || {
		shortcuts: [
			`${isMac ? '⌘' : 'Ctrl'}+C ${t('shortcuts.copy')}`,
			`${isMac ? '⌘' : 'Ctrl'}+X ${t('shortcuts.clear')}`,
			`${isMac ? '⌘' : 'Ctrl'}+S ${t('shortcuts.save')}`
		],
		description: t('description')
	}

	return (
		<footer className="border-t bg-background px-6 py-3">
			<div className='flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground'>
				{/* Shortcuts */}
				<div className='flex items-center gap-3 flex-wrap'>
					<span className='font-medium'>{t('shortcuts.title')}</span>
					{widgetInfo.shortcuts.map((shortcut, index) => (
						<span key={index} className='opacity-70'>{shortcut}</span>
					))}
				</div>
				
				{/* Info */}
				<div className='flex items-center gap-2'>
					<span>{widgetInfo.description}</span>
				</div>
			</div>
		</footer>
	)
}
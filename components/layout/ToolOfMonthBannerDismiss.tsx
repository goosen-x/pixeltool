'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface ToolOfMonthBannerDismissProps {
	yearMonth: string
	children: ReactNode
}

const STORAGE_KEY_PREFIX = 'pixeltool:tool-of-month-dismissed:'

/** По умолчанию скрыт (как CookieConsent в components/global/CookieConsent.tsx)
 *  — до монтирования неизвестно, закрывали ли баннер в этом месяце, а
 *  рисовать и сразу прятать хуже, чем показать с небольшой задержкой. */
export function ToolOfMonthBannerDismiss({
	yearMonth,
	children
}: ToolOfMonthBannerDismissProps) {
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		try {
			const dismissed = localStorage.getItem(STORAGE_KEY_PREFIX + yearMonth)
			if (!dismissed) setIsVisible(true)
		} catch {
			// приватный режим/заблокированное хранилище — просто не показываем
		}
	}, [yearMonth])

	const handleDismiss = () => {
		try {
			localStorage.setItem(STORAGE_KEY_PREFIX + yearMonth, '1')
		} catch {
			// приватный режим — переживёт до перезагрузки, не критично
		}
		setIsVisible(false)
	}

	if (!isVisible) return null

	return (
		<div className='relative flex items-center bg-gradient-to-r from-primary to-primary/80 text-primary-foreground'>
			<div className='flex-1'>{children}</div>
			<button
				onClick={handleDismiss}
				aria-label='Закрыть'
				className='absolute right-2 top-1/2 shrink-0 -translate-y-1/2 cursor-pointer rounded-lg p-1.5 text-primary-foreground/80 transition-colors hover:bg-black/10 hover:text-primary-foreground'
			>
				<X className='h-4 w-4' />
			</button>
		</div>
	)
}

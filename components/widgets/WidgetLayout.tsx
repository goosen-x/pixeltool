'use client'

import { ReactNode } from 'react'
import { WidgetShareSection } from './WidgetShareSection'
import { usePathname } from 'next/navigation'
import { widgets } from '@/lib/constants/widgets'
import { useTranslations } from 'next-intl'

interface WidgetLayoutProps {
	children: ReactNode
	showShare?: boolean
	customShareData?: {
		title?: string
		description?: string
		hashtags?: string[]
	}
}

export function WidgetLayout({
	children,
	showShare = true,
	customShareData
}: WidgetLayoutProps) {
	const pathname = usePathname()
	const t = useTranslations('widgets')

	// Extract widget path from URL
	const widgetPath = pathname.split('/').pop()
	const widget = widgets.find(w => w.path === widgetPath)

	if (!widget) {
		return <>{children}</>
	}

	const widgetTitle = t(`${widget.translationKey}.title`)
	const widgetDescription = t(`${widget.translationKey}.description`)

	return (
		<>
			{children}
			{showShare && (
				<div className='mt-8'>
					<WidgetShareSection
						widgetTitle={customShareData?.title || widgetTitle}
						widgetDescription={
							customShareData?.description || widgetDescription
						}
						hashtags={customShareData?.hashtags || widget.tags}
						variant='card'
					/>
				</div>
			)}
		</>
	)
}

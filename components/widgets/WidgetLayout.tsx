'use client'

import { ReactNode } from 'react'
import { WidgetShareSection } from './WidgetShareSection'
import { usePathname } from 'next/navigation'
import { widgets } from '@/lib/constants/widgets'
// import { useTranslations } from 'next-intl'

interface WidgetLayoutProps {
	children: ReactNode
	showShare?: boolean
	customShareData?: {
		title?: string
		description?: string
		hashtags?: string[]
	}
}

// Widget translations mapping for Russian
const WIDGET_TRANSLATIONS = {
	'css-clamp-calculator': {
		title: 'CSS Clamp калькулятор',
		description:
			'Создавайте адаптивную типографику и отступы, которые плавно масштабируются между размерами экрана'
	},
	'flexbox-generator': {
		title: 'Генератор CSS Flexbox онлайн',
		description:
			'Бесплатный онлайн генератор CSS Flexbox. Визуальный инструмент для создания и изучения CSS Flexbox макетов с кодом'
	},
	'grid-generator': {
		title: 'Генератор CSS Grid онлайн',
		description:
			'Бесплатный онлайн генератор CSS Grid. Визуальный инструмент для создания и изучения CSS Grid макетов с кодом'
	},
	'qr-generator': {
		title: 'Генератор QR кодов онлайн - создать QR код бесплатно',
		description:
			'Бесплатный генератор QR кодов онлайн. Создайте QR код для URL, WiFi, App Store за секунды. Генератор qr работает без регистрации'
	},
	'tip-calculator': {
		title: 'Калькулятор чаевых',
		description: 'Рассчитывайте чаевые и делите счета для ресторанов и услуг'
	}
} as const

export function WidgetLayout({
	children,
	showShare = true,
	customShareData
}: WidgetLayoutProps) {
	const pathname = usePathname()
	// const t = useTranslations('widgets')

	// Extract widget path from URL
	const widgetPath = pathname.split('/').pop()
	const widget = widgets.find(w => w.path === widgetPath)

	if (!widget) {
		return <>{children}</>
	}

	// Get translations from mapping or fallback
	const widgetData =
		WIDGET_TRANSLATIONS[widget.id as keyof typeof WIDGET_TRANSLATIONS]
	const widgetTitle = widgetData?.title || widget.id
	const widgetDescription =
		widgetData?.description || 'Инструмент для веб-разработки'

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

import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { widgets } from '@/lib/constants/widgets'

export const metadata: Metadata = {
	title: `Бесплатные инструменты для веб разработки и дизайна онлайн | PixelTool`,
	description: `${widgets.length}+ бесплатных онлайн инструментов: CSS генераторы, конвертеры, калькуляторы, форматировщики, валидаторы. Без установки, работает офлайн.`,
	keywords:
		'онлайн инструменты, инструменты разработчика, веб инструменты, css генератор, конвертер, калькулятор, бесплатные инструменты, форматировщик кода, генератор паролей, qr код, палитра цветов, рассчитать онлайн, посчитать онлайн',
	openGraph: {
		title: `Бесплатные инструменты для веб разработки и дизайна онлайн`,
		description: `${widgets.length}+ бесплатных инструментов: CSS генераторы, конвертеры, калькуляторы, форматировщики. Без установки, работает офлайн.`,
		url: 'https://pixeltool.ru/tools',
		siteName: 'PixelTool',
		type: 'website',
		locale: 'ru_RU'
	},
	twitter: {
		card: 'summary_large_image',
		title: `Бесплатные инструменты для веб разработки и дизайна онлайн`,
		description: `${widgets.length}+ бесплатных инструментов: CSS генераторы, конвертеры, калькуляторы. Работает офлайн.`
	},
	alternates: {
		canonical: 'https://pixeltool.ru/tools'
	}
}

// Force dynamic rendering for all tools pages
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

type Props = {
	children: ReactNode
}

export default function ToolsListingLayout({ children }: Props) {
	// Simple layout without sidebar for /tools listing page
	return <>{children}</>
}

import { Metadata } from 'next'
import { ReactNode } from 'react'
import { widgets } from '@/lib/constants/widgets'
import '../widget-transitions.css'

export const metadata: Metadata = {
	title: `Инструменты для Веб-Разработчиков - ${widgets.length}+ Утилит | PixelTool`,
	description: `Коллекция из ${widgets.length}+ бесплатных инструментов для разработчиков: CSS генераторы, конвертеры, калькуляторы, форматировщики, валидаторы. Без установки, работает офлайн.`,
	keywords:
		'онлайн инструменты, инструменты разработчика, веб инструменты, css генератор, конвертер, калькулятор, бесплатные инструменты, форматировщик кода, генератор паролей, qr код, палитра цветов, рассчитать онлайн, посчитать онлайн',
	openGraph: {
		title: `Инструменты для Веб-Разработчиков - ${widgets.length}+ Утилит`,
		description: `${widgets.length}+ бесплатных инструментов: CSS генераторы, конвертеры, калькуляторы, форматировщики. Без установки, работает офлайн.`,
		url: 'https://pixeltool.ru/tools',
		siteName: 'PixelTool',
		type: 'website',
		locale: 'ru_RU'
	},
	twitter: {
		card: 'summary_large_image',
		title: `Инструменты для Веб-Разработчиков - ${widgets.length}+ Утилит`,
		description: `${widgets.length}+ бесплатных инструментов для разработчиков: CSS генераторы, конвертеры, калькуляторы. Работает офлайн.`
	},
	alternates: {
		canonical: 'https://pixeltool.ru/tools'
	}
}

// Force dynamic rendering for all tools pages to avoid useSearchParams build errors
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

type Props = {
	children: ReactNode
}

export default function ProjectsLayout({ children }: Props) {
	// Don't wrap /tools page in ProjectsLayoutWrapper - it has its own layout
	return <>{children}</>
}

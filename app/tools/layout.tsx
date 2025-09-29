import { ProjectsLayoutWrapper } from '@/components/sidebar/ProjectsLayoutWrapper'
import { ReactNode } from 'react'
import { Metadata } from 'next'
import { widgets } from '@/lib/constants/widgets'
import '../widget-transitions.css'

export const metadata: Metadata = {
	title: `Бесплатные Онлайн Инструменты - ${widgets.length}+ Утилит | PixelTool`,
	description: `Коллекция из ${widgets.length}+ бесплатных онлайн инструментов для разработчиков, дизайнеров и создателей контента. CSS генераторы, конвертеры, калькуляторы, форматтеры, валидаторы и многое другое. Работает офлайн.`,
	keywords: 'онлайн инструменты, инструменты разработчика, веб инструменты, css генератор, конвертер, калькулятор, бесплатные инструменты, форматировщик кода, генератор паролей, qr код, палитра цветов',
	openGraph: {
		title: `Бесплатные Онлайн Инструменты - ${widgets.length}+ Утилит | PixelTool`,
		description: `Коллекция из ${widgets.length}+ бесплатных онлайн инструментов для разработчиков, дизайнеров и создателей контента.`,
		url: 'https://pixeltool.ru/tools',
		siteName: 'PixelTool',
		type: 'website',
		locale: 'ru_RU',
	},
	twitter: {
		card: 'summary_large_image',
		title: `Бесплатные Онлайн Инструменты - ${widgets.length}+ Утилит | PixelTool`,
		description: `Коллекция из ${widgets.length}+ бесплатных онлайн инструментов для разработчиков, дизайнеров и создателей контента.`,
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
	return <ProjectsLayoutWrapper>{children}</ProjectsLayoutWrapper>
}

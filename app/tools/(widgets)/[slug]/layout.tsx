import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getWidgetByPath, widgets } from '@/lib/constants/widgets'
import { getAllWidgetPaths } from '@/lib/widgets/widget-loaders'

/**
 * Генерация статических параметров для всех виджетов
 * Позволяет Next.js сгенерировать страницы на этапе сборки (SSG)
 */
export async function generateStaticParams() {
	const paths = getAllWidgetPaths()

	return paths.map(path => ({
		slug: path
	}))
}

/**
 * Централизованная генерация метаданных для всех виджетов
 * Извлекает данные из widgets.ts и генерирует полный набор SEO метаданных
 */
export async function generateMetadata({
	params
}: {
	params: Promise<{ slug: string }>
}): Promise<Metadata> {
	const { slug } = await params
	const widget = getWidgetByPath(slug)

	// Если виджет не найден, возвращаем базовые метаданные
	if (!widget) {
		return {
			title: 'Widget Not Found',
			description: 'The requested widget could not be found.'
		}
	}

	const title = widget.title || widget.id
	const description =
		widget.description || `Online tool for ${widget.id} tasks`
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'
	const url = `${baseUrl}/tools/${widget.path}`

	// Генерируем Open Graph изображение через API
	const ogImageUrl = `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&locale=ru`

	return {
		title,
		description,

		// Open Graph метаданные для социальных сетей
		openGraph: {
			title,
			description,
			url,
			siteName: 'PixelTool',
			locale: 'ru_RU',
			type: 'website',
			images: [
				{
					url: ogImageUrl,
					width: 1200,
					height: 630,
					alt: title
				}
			]
		},

		// Twitter Card метаданные
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [ogImageUrl],
			creator: '@pixeltool'
		},

		// Canonical URL для предотвращения дублированного контента
		alternates: {
			canonical: url
		},

		// Настройки индексации для поисковых роботов
		robots: {
			index: true,
			follow: true,
			'max-image-preview': 'large',
			'max-snippet': -1,
			'max-video-preview': -1
		},

		// Ключевые слова для SEO
		keywords: widget.tags || [],

		// Мета-информация для авторства
		authors: [{ name: 'PixelTool Team' }],

		// Category для браузеров
		category: widget.category
	}
}

/**
 * Layout компонент для динамического роута [slug]
 * Просто оборачивает children без дополнительной разметки
 */
export default function WidgetSlugLayout({
	children
}: {
	children: React.ReactNode
}) {
	return <>{children}</>
}

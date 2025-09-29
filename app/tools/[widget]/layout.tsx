import { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { getWidgetByPath } from '@/lib/constants/widgets'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { WidgetAnalyticsWrapper } from '@/components/tools/WidgetAnalyticsWrapper'
import { Metadata } from 'next'

type Props = {
	children: ReactNode
	params: Promise<{ locale: string; widget: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale, widget: widgetPath } = await params
	const widget = getWidgetByPath(widgetPath)

	if (!widget) {
		return {}
	}

	// Since we removed next-intl, use widget properties directly
	const title = widget.title || widget.translationKey
	const description = widget.description || ''

	// Жестко задаем URL для Open Graph
	const baseUrl = 'https://pixeltool.pro'
	const url = `${baseUrl}/tools/${widget.path}`

	// Import SEO metadata if available
	const { widgetMetadata } = await import('@/lib/seo/widget-metadata')
	const seoData = widgetMetadata[widget.path]?.[locale as 'en' | 'ru']

	return {
		title: seoData?.title || `${title} | PixelTool`,
		description: seoData?.description || description,
		keywords: seoData?.keywords?.join(', ') || widget.tags?.join(', ') || '',
		authors: [{ name: 'Dmitry Borisenko' }],
		creator: 'PixelTool',
		publisher: 'PixelTool',

		openGraph: {
			title: seoData?.title || `${title} - Free Online Tool | PixelTool`,
			description: seoData?.description || description,
			url: url,
			siteName: 'PixelTool',
			locale: locale === 'ru' ? 'ru_RU' : 'en_US',
			type: 'website',
			images: [
				{
					url: `https://pixeltool.pro/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&widget=${widget.id}&locale=${locale}`,
					width: 1200,
					height: 630,
					alt: title,
					type: 'image/png'
				}
			]
		},

		twitter: {
			card: 'summary_large_image',
			title: seoData?.title || `${title} - Free Online Tool`,
			description: seoData?.description || description,
			images: [
				`https://pixeltool.pro/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&widget=${widget.id}&locale=${locale}`
			],
			creator: '@pixeltool'
		},

		other: {
			// Дополнительные метатеги для социальных сетей
			'og:image:secure_url': `https://pixeltool.pro/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&widget=${widget.id}&locale=${locale}`,
			'og:image:width': '1200',
			'og:image:height': '630',
			'twitter:image': `https://pixeltool.pro/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&widget=${widget.id}&locale=${locale}`,
			'twitter:image:alt': title,
			'telegram:image': `https://pixeltool.pro/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&widget=${widget.id}&locale=${locale}`
		},

		alternates: {
			canonical: url,
			languages: {
				en: `${baseUrl}/en/tools/${widget.path}`,
				ru: `${baseUrl}/ru/tools/${widget.path}`
			}
		},

		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				'max-video-preview': -1,
				'max-image-preview': 'large',
				'max-snippet': -1
			}
		}
	}
}

export default async function WidgetLayout({ children, params }: Props) {
	const { widget: widgetPath } = await params
	const widget = getWidgetByPath(widgetPath)

	if (!widget) {
		notFound()
	}

	return (
		<WidgetSEOWrapper widget={widget}>
			<WidgetAnalyticsWrapper widgetId={widget.id}>
				{children}
			</WidgetAnalyticsWrapper>
		</WidgetSEOWrapper>
	)
}

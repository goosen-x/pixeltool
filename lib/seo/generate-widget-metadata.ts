import { Metadata } from 'next'
import { widgetMetadata } from './widget-metadata'
import { getWidgetEmoji } from '@/lib/utils/widget-icons'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'

export function generateWidgetMetadata(
	widgetKey: string,
	locale: 'en' | 'ru'
): Metadata {
	const metadata = widgetMetadata[widgetKey]?.[locale]

	if (!metadata) {
		return {}
	}

	const url = `${BASE_URL}/tools/${widgetKey}`
	const canonicalUrl = `${BASE_URL}/tools/${widgetKey}`

	// Get widget emoji icon
	const icon = getWidgetEmoji(widgetKey)

	// Create dynamic OG image URL
	const ogImageUrl =
		`${BASE_URL}/api/og?` +
		new URLSearchParams({
			title: metadata.title,
			description: metadata.description.slice(0, 160), // Limit description length
			widget: widgetKey,
			icon: icon,
			locale: locale
		}).toString()

	return {
		title: metadata.title,
		description: metadata.description,
		keywords: metadata.keywords.join(', '),
		alternates: {
			canonical: canonicalUrl,
			languages: {
				en: `${BASE_URL}/en/tools/${widgetKey}`,
				ru: `${BASE_URL}/ru/tools/${widgetKey}`
			}
		},
		openGraph: {
			title: metadata.title,
			description: metadata.description,
			url: url,
			siteName: 'PixelTool',
			locale: locale === 'ru' ? 'ru_RU' : 'en_US',
			type: 'website',
			images: [
				{
					url: ogImageUrl,
					width: 1200,
					height: 630,
					alt: metadata.title,
					type: 'image/png'
				}
			]
		},
		twitter: {
			card: 'summary_large_image',
			title: metadata.title,
			description: metadata.description,
			images: [ogImageUrl],
			creator: '@pixeltool',
			site: '@pixeltool'
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

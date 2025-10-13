import type { Metadata } from 'next'
import { getWidgetById } from '@/lib/constants/widgets'

const widget = getWidgetById('css-gradient')!

export async function generateMetadata(): Promise<Metadata> {
	const title = widget.title || 'CSS Gradient Generator'
	const description =
		widget.description ||
		'Create beautiful CSS gradients with live preview, preset library, and export options'
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'
	const url = `${baseUrl}/tools/${widget.path}`

	return {
		title,
		description,

		openGraph: {
			title,
			description,
			url,
			siteName: 'PixelTool',
			locale: 'ru_RU',
			type: 'website',
			images: [
				{
					url: `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&locale=ru`,
					width: 1200,
					height: 630,
					alt: title
				}
			]
		},

		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [
				`/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&locale=ru`
			],
			creator: '@pixeltool'
		},

		alternates: {
			canonical: url
		},

		robots: {
			index: true,
			follow: true,
			'max-image-preview': 'large',
			'max-snippet': -1,
			'max-video-preview': -1
		}
	}
}

export default function CSSGradientGeneratorLayout({
	children
}: {
	children: React.ReactNode
}) {
	return <>{children}</>
}

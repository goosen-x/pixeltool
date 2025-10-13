import type { Metadata } from 'next'
import { getWidgetById } from '@/lib/constants/widgets'

const widget = getWidgetById('qr-generator')!

export async function generateMetadata(): Promise<Metadata> {
	const title = widget.title || 'QR Code Generator'
	const description =
		widget.description ||
		'Generate QR codes for URLs, WiFi networks, and mobile apps with customization options'
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

export default function QRGeneratorLayout({
	children
}: {
	children: React.ReactNode
}) {
	return <>{children}</>
}

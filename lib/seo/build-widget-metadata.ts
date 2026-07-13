import type { Metadata } from 'next'
import { getWidgetByPath } from '@/lib/constants/widgets'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'

/**
 * Единый источник уникальных метаданных для страницы инструмента.
 * Берёт данные из константы виджета (title + metaDescription/description),
 * чтобы у каждого инструмента был свой title/description/canonical/OG —
 * без дублирующегося generic-описания из корневого layout.
 */
export function buildWidgetMetadata(slug: string): Metadata {
	const widget = getWidgetByPath(slug)
	if (!widget) return {}

	const title = widget.metaTitle || widget.title || widget.id
	const description =
		widget.metaDescription ||
		widget.description ||
		`Онлайн-инструмент «${title}» — бесплатно, без установки, работает прямо в браузере.`

	const url = `${BASE_URL}/tools/${slug}`
	const ogImageUrl =
		`/api/og?title=${encodeURIComponent(title)}` +
		`&description=${encodeURIComponent(description.slice(0, 160))}&locale=ru`

	return {
		title,
		description,
		alternates: { canonical: url },
		openGraph: {
			title,
			description,
			url,
			siteName: 'PixelTool',
			locale: 'ru_RU',
			type: 'website',
			images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }]
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description
		}
	}
}

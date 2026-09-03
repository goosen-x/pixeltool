import type { Metadata } from 'next'
import { getWidgetByPath, type Widget } from '@/lib/constants/widgets'
import { toolScreenshotBase } from '@/lib/constants/tool-screenshots'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'

/**
 * Относительный путь до превью-картинки тула (/api/og), которую рендерит
 * сам сайт. Вынесено отдельно, чтобы sitemap.ts мог сослаться на тот же URL
 * для расширения sitemap `images` — без дублирования логики построения.
 */
export function buildWidgetOgImagePath(widget: Widget): string {
	const title = widget.metaTitle || widget.title || widget.id
	const description =
		widget.metaDescription ||
		widget.description ||
		`Онлайн-инструмент «${title}» — бесплатно, без установки, работает прямо в браузере.`

	return (
		`/api/og?title=${encodeURIComponent(title)}` +
		`&description=${encodeURIComponent(description.slice(0, 160))}&locale=ru`
	)
}

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
	// У тула с готовым скриншотом og:image берём из реального файла, а не из
	// автогенерённой карточки /api/og — картинка интерфейса информативнее в
	// соцсетях и совпадает с изображением в JSON-LD.
	const screenshotBase = toolScreenshotBase(widget.path)
	const ogImage = screenshotBase
		? { url: `${screenshotBase}-1200.webp`, width: 1200, height: 675 }
		: { url: buildWidgetOgImagePath(widget), width: 1200, height: 630 }

	// Демо-тул: доступен по прямой ссылке для проверки, но не публикуется —
	// noindex вместо canonical и явная пометка в заголовке вкладки.
	if (widget.demo) {
		return {
			title: `[Демо] ${title}`,
			description,
			robots: { index: false, follow: false }
		}
	}

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
			images: [{ ...ogImage, alt: title }]
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description
		}
	}
}

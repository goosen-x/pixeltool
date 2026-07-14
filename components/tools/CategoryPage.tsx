import type { Metadata } from 'next'
import { CATEGORY_META, type CategoryKey } from '@/lib/constants/categories'
import { ToolsExplorer } from '@/components/tools/ToolsExplorer'
import { CategoryContent } from '@/components/tools/CategoryContent'
import { CatalogStructuredData } from '@/components/seo/CatalogStructuredData'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'

/**
 * Общая начинка страниц категорий (/tools/css, /tools/html и так далее).
 *
 * Каждая категория — отдельный статический сегмент роутера, а не динамический:
 * виджеты уже занимают /tools/[slug], и второй динамический сегмент рядом с ним
 * Next разрешить не может — маршруты становятся неразличимы. Статические
 * сегменты в этом соседстве разрешаются раньше [slug], поэтому конфликта нет.
 */
export function buildCategoryMetadata(category: CategoryKey): Metadata {
	const meta = CATEGORY_META[category]
	const url = `${BASE_URL}/tools/${category}`

	return {
		title: meta.metaTitle,
		description: meta.metaDescription,
		alternates: { canonical: url },
		openGraph: {
			title: meta.metaTitle,
			description: meta.metaDescription,
			url,
			siteName: 'PixelTool',
			type: 'website',
			locale: 'ru_RU'
		},
		twitter: {
			card: 'summary_large_image',
			title: meta.metaTitle,
			description: meta.metaDescription
		}
	}
}

export function CategoryPage({ category }: { category: CategoryKey }) {
	return (
		<div className='container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8'>
			<CatalogStructuredData category={category} />
			<ToolsExplorer category={category} />
			<CategoryContent category={category} />
		</div>
	)
}

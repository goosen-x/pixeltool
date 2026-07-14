import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
	CATEGORY_KEYS,
	CATEGORY_META,
	isCategoryKey
} from '@/lib/constants/categories'
import { ToolsExplorer } from '@/components/tools/ToolsExplorer'
import { CategoryContent } from '@/components/tools/CategoryContent'
import { CatalogStructuredData } from '@/components/seo/CatalogStructuredData'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'

/**
 * Страницы категорий: /tools/css, /tools/html и так далее.
 *
 * dynamicParams = false означает, что существуют только адреса из
 * generateStaticParams, а любой другой /tools/<что-то> отдаёт 404 — этим
 * занимается сам роутер, до рендера. Страницы инструментов лежат в соседней
 * группе статическими сегментами и разрешаются раньше динамического.
 */
export const dynamicParams = false

export function generateStaticParams() {
	return CATEGORY_KEYS.map(category => ({ category }))
}

type Props = { params: Promise<{ category: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { category } = await params
	if (!isCategoryKey(category)) return {}

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

export default async function CategoryPage({ params }: Props) {
	const { category } = await params
	if (!isCategoryKey(category)) notFound()

	return (
		<div className='container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8'>
			<CatalogStructuredData category={category} />
			<ToolsExplorer category={category} />
			<CategoryContent category={category} />
		</div>
	)
}

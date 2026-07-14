import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { CATEGORY_META } from '@/lib/constants/categories'
import { SuggestToolSection } from '@/components/tools/SuggestToolSection'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'
const meta = CATEGORY_META['']

// keywords не задаём: поисковики его игнорируют с середины нулевых, а список из
// двух десятков фраз только мозолил глаза в диффах.
export const metadata: Metadata = {
	title: meta.metaTitle,
	description: meta.metaDescription,
	alternates: {
		canonical: `${BASE_URL}/tools`
	},
	openGraph: {
		title: meta.metaTitle,
		description: meta.metaDescription,
		url: `${BASE_URL}/tools`,
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

export default function ToolsListingLayout({
	children
}: {
	children: ReactNode
}) {
	return (
		<>
			{children}
			{/* Блок общий для каталога и всех страниц категорий — поэтому живёт в
			    лейауте, а не дублируется в восьми страницах */}
			<div className='container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
				<SuggestToolSection />
			</div>
		</>
	)
}

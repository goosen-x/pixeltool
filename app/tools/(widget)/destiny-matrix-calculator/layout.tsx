import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { buildWidgetMetadata } from '@/lib/seo/build-widget-metadata'
import { fetchNarrativeBlock } from './actions'
import {
	DestinyMatrixCalculatorSeo,
	EXAMPLE_RESULT
} from './DestinyMatrixCalculatorSeo'

export const metadata: Metadata = buildWidgetMetadata(
	'destiny-matrix-calculator'
)

// Серверный компонент (в отличие от page.tsx, там 'use client' из-за
// интерактивного виджета) — единственное место, откуда можно отдать
// расшифровку матрицы судьбы в HTML сразу при загрузке, не дожидаясь
// клиентского запроса. Тексты рендерятся после children, то есть визуально
// там же, где Seo-блок был раньше внутри page.tsx.
export default async function ToolLayout({
	children
}: {
	children: ReactNode
}) {
	const narrativeTexts = await fetchNarrativeBlock(EXAMPLE_RESULT)

	return (
		<>
			{children}
			<DestinyMatrixCalculatorSeo narrativeTexts={narrativeTexts} />
		</>
	)
}

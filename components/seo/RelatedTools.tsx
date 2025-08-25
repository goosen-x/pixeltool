'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslations, useLocale } from 'next-intl'
import {
	widgets,
	getWidgetById,
	getRecommendedWidgets
} from '@/lib/constants/widgets'
import { ToolCard } from '@/components/tools/ToolCard'

interface RelatedToolsProps {
	currentTool: string
	category?: string
}

export function RelatedTools({
	currentTool,
	category = 'css'
}: RelatedToolsProps) {
	const t = useTranslations('widgets')
	const locale = useLocale()

	// First try to get recommended tools from widget data
	let relatedTools = getRecommendedWidgets(currentTool).slice(0, 3)

	// If no recommended tools or less than 3, fall back to category-based selection
	if (relatedTools.length < 3) {
		const additionalTools = widgets
			.filter(
				widget =>
					widget.id !== currentTool &&
					!relatedTools.some(rt => rt.id === widget.id) &&
					(category ? widget.category === category : true)
			)
			.slice(0, 3 - relatedTools.length)

		relatedTools = [...relatedTools, ...additionalTools].slice(0, 3)
	}

	if (relatedTools.length === 0) {
		return null
	}

	return (
		<Card className='mt-8 border-border/50 bg-background/60 backdrop-blur-sm'>
			<CardHeader>
				<CardTitle className='text-xl font-heading bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
					{locale === 'ru' ? 'Похожие инструменты' : 'Related Tools'}
				</CardTitle>
				<p className='text-sm text-muted-foreground'>
					{locale === 'ru'
						? 'Другие полезные инструменты из той же категории'
						: 'Other useful tools from the same category'}
				</p>
			</CardHeader>
			<CardContent>
				<div className='grid gap-6 md:grid-cols-3'>
					{relatedTools.map(widget => (
						<ToolCard
							key={widget.id}
							widget={widget}
							locale={locale}
							showFavoriteButton={false}
							className='h-full'
						/>
					))}
				</div>
			</CardContent>
		</Card>
	)
}

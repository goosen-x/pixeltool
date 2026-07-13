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
	const locale = 'ru'

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
		<section className='mt-16'>
			{/* Тот же размер, что у h2 в обучающих блоках (*Guide.tsx) */}
			<h2 className='text-2xl font-bold tracking-tight'>Похожие инструменты</h2>
			<p className='mt-1 text-sm text-muted-foreground'>
				Другие полезные инструменты из той же категории
			</p>
			<div className='mt-6 grid gap-6 md:grid-cols-3'>
				{relatedTools.map(widget => (
					<ToolCard key={widget.id} widget={widget} className='h-full' />
				))}
			</div>
		</section>
	)
}

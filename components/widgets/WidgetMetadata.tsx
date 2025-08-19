'use client'

import { Badge } from '@/components/ui/badge'
import { getWidgetById } from '@/lib/constants/widgets'
import { useTranslations } from 'next-intl'

interface WidgetMetadataProps {
	widgetId: string
	showTags?: boolean
	showDifficulty?: boolean
	showUseCase?: boolean
}

export function WidgetMetadata({
	widgetId,
	showTags = true,
	showDifficulty = true,
	showUseCase = true
}: WidgetMetadataProps) {
	const t = useTranslations('widgets.metadata')
	const widget = getWidgetById(widgetId)

	if (!widget) return null

	const difficultyColors = {
		beginner:
			'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
		intermediate:
			'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
		advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
	}

	return (
		<div className='space-y-3'>
			{showDifficulty && widget.difficulty && (
				<div className='flex items-center gap-2'>
					<span className='text-sm font-medium text-muted-foreground'>
						{t('difficulty')}:
					</span>
					<Badge className={difficultyColors[widget.difficulty]}>
						{t(`levels.${widget.difficulty}`)}
					</Badge>
				</div>
			)}

			{showUseCase && widget.useCase && (
				<p className='text-sm text-muted-foreground'>
					<span className='font-medium'>{t('useCase')}:</span> {widget.useCase}
				</p>
			)}

			{showTags && widget.tags && widget.tags.length > 0 && (
				<div className='flex items-start gap-2'>
					<span className='text-sm font-medium text-muted-foreground'>
						{t('tags')}:
					</span>
					<div className='flex flex-wrap gap-1'>
						{widget.tags.map(tag => (
							<Badge key={tag} variant='secondary' className='text-xs'>
								{tag}
							</Badge>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

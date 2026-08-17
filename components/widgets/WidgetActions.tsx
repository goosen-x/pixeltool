'use client'

import { Button } from '@/components/ui/button'
import { Eye, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SharePopover } from '@/components/share/SharePopover'
import { useToolHistory } from '@/lib/hooks/useToolHistory'
import { useToolStats } from '@/lib/hooks/useToolStats'
import { ToolRatingWidget } from './ToolRatingWidget'
import { useRecordToolView } from '@/lib/hooks/useRecordToolView'

interface Props {
	widgetId: string
	title?: string
}

/**
 * Избранное и «Поделиться» рядом с заголовком инструмента: действия относятся
 * к странице, на которой человек стоит, поэтому им место здесь, а не в сайдбаре.
 */
export function WidgetActions({ widgetId, title }: Props) {
	// Не передаём widgetId в хук: историю посещений ведёт карточка в сайдбаре,
	// иначе тул записался бы в «недавние» дважды
	const { toggleFavorite, isFavorite, ready } = useToolHistory()
	useRecordToolView(widgetId)
	const { views } = useToolStats(widgetId)

	const starred = ready && isFavorite(widgetId)

	return (
		<div className='flex flex-wrap items-center gap-2'>
			<Button
				variant='outline'
				size='sm'
				className='group cursor-pointer gap-2'
				onClick={() => toggleFavorite(widgetId)}
				aria-pressed={starred}
			>
				<Star
					className={cn(
						'h-4 w-4',
						starred
							? 'fill-current text-amber-500'
							: 'text-muted-foreground group-hover:text-accent-foreground'
					)}
				/>
				{starred ? 'В избранном' : 'В избранное'}
			</Button>

			<SharePopover title={title} />

			<div className='flex items-center gap-2 sm:ml-auto'>
				{views > 0 && (
					<span className='flex items-center gap-1 text-xs text-muted-foreground'>
						<Eye className='h-3.5 w-3.5' />
						{new Intl.NumberFormat('ru', {
							notation: 'compact',
							maximumFractionDigits: 1
						}).format(views)}
					</span>
				)}

				<ToolRatingWidget toolId={widgetId} />
			</div>
		</div>
	)
}

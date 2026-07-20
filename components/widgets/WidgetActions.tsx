'use client'

import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SharePopover } from '@/components/share/SharePopover'
import { useToolHistory } from '@/lib/hooks/useToolHistory'

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

	const starred = ready && isFavorite(widgetId)

	return (
		<div className='flex items-center gap-2'>
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
		</div>
	)
}

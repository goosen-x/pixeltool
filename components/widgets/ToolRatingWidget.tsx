'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToolStats } from '@/lib/hooks/useToolStats'

interface Props {
	toolId: string
}

const STAR_VALUES = [1, 2, 3, 4, 5] as const

export function ToolRatingWidget({ toolId }: Props) {
	const { rating, ratingCount, hasVoted, vote } = useToolStats(toolId)

	const filled = hasVoted ? Math.round(rating) : 0

	return (
		<div
			className='flex items-center gap-1.5'
			role='group'
			aria-label='Оценка инструмента'
		>
			{STAR_VALUES.map(value => (
				<button
					key={value}
					type='button'
					disabled={hasVoted}
					onClick={() => vote(value)}
					title={`Оценить на ${value} из 5`}
					aria-label={`Оценить на ${value} из 5`}
					className={cn(
						'transition-transform',
						hasVoted ? 'cursor-default' : 'cursor-pointer hover:scale-110'
					)}
				>
					<Star
						className={cn(
							'h-4 w-4',
							value <= filled
								? 'fill-amber-500 text-amber-500'
								: 'text-muted-foreground'
						)}
					/>
				</button>
			))}
			{hasVoted && ratingCount > 0 && (
				<span className='text-xs text-muted-foreground'>
					{rating.toFixed(1)} · {ratingCount}
				</span>
			)}
		</div>
	)
}

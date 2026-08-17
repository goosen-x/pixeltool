'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useToolStats } from '@/lib/hooks/useToolStats'

interface Props {
	toolId: string
}

const STAR_VALUES = [1, 2, 3, 4, 5] as const
type StarValue = (typeof STAR_VALUES)[number]

// Восьмиконечная звезда: viewBox 32×32, центр в (16,16), точки повёрнуты на
// 180°, иначе главный луч смотрит вниз, а не вверх.
const STAR_POINTS =
	'0,15 4.41,6.07 14.27,4.64 7.13,-2.32 8.82,-12.14 0,-7.5 -8.82,-12.14 -7.13,-2.32 -14.27,4.64 -4.41,6.07'

type StarState = 'empty' | 'hover' | 'solid' | 'animating'

function StarIcon({ state, delayMs }: { state: StarState; delayMs: number }) {
	const isAnimating = state === 'animating'

	return (
		<svg className='h-5 w-5 overflow-visible' viewBox='0 0 32 32' aria-hidden>
			<g transform='translate(16,16)'>
				{/* Кольцо-пульс рисуется только на сам момент клика — не имеет
				    смысла держать его в DOM для статичных состояний. */}
				{isAnimating && (
					<circle
						r={8}
						strokeWidth={16}
						className='rating-star-ring fill-none stroke-amber-500'
						style={{
							transform: 'scale(0)',
							animation: `star-ring 0.8s ease-out ${delayMs}ms forwards`
						}}
					/>
				)}
				<g transform='rotate(180)'>
					<polygon
						points={STAR_POINTS}
						fill='none'
						strokeWidth={2}
						strokeLinecap='round'
						strokeLinejoin='round'
						className={cn(
							'rating-star-stroke transition-[stroke] duration-200',
							state === 'empty'
								? 'stroke-muted-foreground/50'
								: 'stroke-amber-500'
						)}
						style={
							isAnimating
								? { animation: `star-stroke 0.5s ease-in ${delayMs}ms both` }
								: { transform: state === 'solid' ? 'scale(0)' : 'scale(1)' }
						}
					/>
					<polygon
						points={STAR_POINTS}
						fill='currentColor'
						className='rating-star-fill text-amber-500'
						style={
							isAnimating
								? { animation: `star-fill 0.5s ease-out ${delayMs}ms both` }
								: { transform: state === 'solid' ? 'scale(1)' : 'scale(0)' }
						}
					/>
				</g>
			</g>
		</svg>
	)
}

export function ToolRatingWidget({ toolId }: Props) {
	const { rating, ratingCount, hasVoted, vote } = useToolStats(toolId)
	const [hoverValue, setHoverValue] = useState<StarValue | null>(null)
	const [pendingValue, setPendingValue] = useState<StarValue | null>(null)
	// Меняет key анимируемых звёзд, чтобы CSS-анимация переигралась с нуля
	// на каждой попытке — актуально, если первый голос не прошёл (429/сеть)
	// и кнопки снова стали активными.
	const [voteAttempt, setVoteAttempt] = useState(0)

	const baseFilled = Math.round(rating)
	const displayValue = hoverValue ?? pendingValue ?? baseFilled

	async function handleVote(value: StarValue) {
		setPendingValue(value)
		setVoteAttempt(n => n + 1)
		await vote(value)
		setPendingValue(null)
	}

	return (
		<div
			className='flex items-center gap-1'
			role='group'
			aria-label='Оценка инструмента'
			onMouseLeave={() => setHoverValue(null)}
		>
			{STAR_VALUES.map((value, index) => {
				const animating = pendingValue !== null && value <= pendingValue
				const state: StarState = animating
					? 'animating'
					: value > displayValue
						? 'empty'
						: hoverValue !== null
							? 'hover'
							: 'solid'

				return (
					<button
						key={animating ? `${value}-${voteAttempt}` : value}
						type='button'
						disabled={hasVoted}
						onClick={() => handleVote(value)}
						onMouseEnter={() => !hasVoted && setHoverValue(value)}
						title={`Оценить на ${value} из 5`}
						aria-label={`Оценить на ${value} из 5`}
						className={hasVoted ? 'cursor-default' : 'cursor-pointer'}
					>
						<StarIcon state={state} delayMs={index * 50} />
					</button>
				)
			})}
			{ratingCount > 0 && (
				<span className='ml-1 text-xs text-muted-foreground'>
					{rating.toFixed(1)} · {ratingCount}
				</span>
			)}
		</div>
	)
}

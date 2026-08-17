'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useToolStats } from '@/lib/hooks/useToolStats'
import {
	Popover,
	PopoverAnchor,
	PopoverContent
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

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
	const { rating, ratingCount, hasVoted, vote, sendFeedback } =
		useToolStats(toolId)
	const [hoverValue, setHoverValue] = useState<StarValue | null>(null)
	const [pendingValue, setPendingValue] = useState<StarValue | null>(null)
	// Меняет key анимируемых звёзд, чтобы CSS-анимация переигралась с нуля
	// на каждой попытке — актуально, если первый голос не прошёл (429/сеть)
	// и кнопки снова стали активными.
	const [voteAttempt, setVoteAttempt] = useState(0)

	// Низкая оценка (≤3) — предлагаем уточнить, что не понравилось. Не
	// блокирует саму оценку (та уже засчитана) и легко закрывается без
	// ответа — единственный доп. вопрос, а не цепочка шагов.
	const [feedbackRating, setFeedbackRating] = useState<1 | 2 | 3 | null>(null)
	const [feedbackText, setFeedbackText] = useState('')
	const [feedbackSubmitting, setFeedbackSubmitting] = useState(false)
	const [feedbackSent, setFeedbackSent] = useState(false)

	const baseFilled = Math.round(rating)
	const displayValue = hoverValue ?? pendingValue ?? baseFilled

	async function handleVote(value: StarValue) {
		setPendingValue(value)
		setVoteAttempt(n => n + 1)
		const success = await vote(value)
		setPendingValue(null)
		if (success && value <= 3) {
			setFeedbackRating(value as 1 | 2 | 3)
		}
	}

	async function handleFeedbackSubmit() {
		if (!feedbackRating || !feedbackText.trim()) return
		setFeedbackSubmitting(true)
		const success = await sendFeedback(feedbackRating, feedbackText.trim())
		setFeedbackSubmitting(false)
		if (success) {
			setFeedbackSent(true)
			setTimeout(() => setFeedbackRating(null), 1200)
		}
	}

	return (
		<Popover
			open={feedbackRating !== null}
			onOpenChange={open => {
				if (!open) {
					setFeedbackRating(null)
					setFeedbackText('')
					setFeedbackSent(false)
				}
			}}
		>
			<PopoverAnchor asChild>
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
			</PopoverAnchor>

			<PopoverContent className='w-80'>
				{feedbackSent ? (
					<p className='text-sm text-muted-foreground'>
						Спасибо, учтём при доработке.
					</p>
				) : (
					<div className='space-y-3'>
						<p className='text-sm font-medium'>
							Что не понравилось? (необязательно)
						</p>
						<Textarea
							value={feedbackText}
							onChange={e => setFeedbackText(e.target.value)}
							placeholder='Что стоит исправить или добавить'
							maxLength={1000}
							className='min-h-20 resize-none text-sm'
							autoFocus
						/>
						<div className='flex justify-end gap-2'>
							<Button
								size='sm'
								variant='ghost'
								onClick={() => setFeedbackRating(null)}
							>
								Пропустить
							</Button>
							<Button
								size='sm'
								disabled={!feedbackText.trim() || feedbackSubmitting}
								onClick={handleFeedbackSubmit}
							>
								Отправить
							</Button>
						</div>
					</div>
				)}
			</PopoverContent>
		</Popover>
	)
}

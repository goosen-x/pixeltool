'use client'

import { useState } from 'react'
import { useToolStats } from '@/lib/hooks/useToolStats'
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { RatingStars, type StarValue } from '@/components/shared/RatingStars'

interface Props {
	toolId: string
}

export function ToolRatingWidget({ toolId }: Props) {
	const { rating, ratingCount, hasVoted, vote, sendFeedback } =
		useToolStats(toolId)

	// Низкая оценка (≤3) — предлагаем уточнить, что не понравилось. Не
	// блокирует саму оценку (та уже засчитана) и легко закрывается без
	// ответа — единственный доп. вопрос, а не цепочка шагов.
	const [feedbackRating, setFeedbackRating] = useState<1 | 2 | 3 | null>(null)
	const [feedbackText, setFeedbackText] = useState('')
	const [feedbackSubmitting, setFeedbackSubmitting] = useState(false)
	const [feedbackSent, setFeedbackSent] = useState(false)

	function handleVoted(value: StarValue, success: boolean) {
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
				<RatingStars
					rating={rating}
					ratingCount={ratingCount}
					hasVoted={hasVoted}
					onVote={vote}
					onVoted={handleVoted}
					label='Оценка инструмента'
				/>
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

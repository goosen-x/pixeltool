'use client'

import { useState } from 'react'
import { useToolStats } from '@/lib/hooks/useToolStats'
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'

/**
 * Готовые причины. Список общий на все инструменты и намеренно короткий:
 * пять вариантов ещё читаются одним взглядом, дальше выбор превращается в
 * работу. Формулировки — со стороны человека («не то, что искал»), а не со
 * стороны разработчика («некорректный результат»).
 */
const REASONS = [
	'не то, что искал',
	'не работает',
	'неудобно на телефоне',
	'не хватает функции',
	'непонятно, как пользоваться'
] as const
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
	//
	// Ответ в один тап, а не пустое поле: за всё время при 115 оценках текст
	// написали ровно один раз. Печатать жалобу с телефона почти никто не
	// станет, а ткнуть в готовую причину — станет; поле для подробностей
	// осталось, но убрано под ссылку и никого не задерживает.
	const [feedbackRating, setFeedbackRating] = useState<1 | 2 | 3 | null>(null)
	const [feedbackText, setFeedbackText] = useState('')
	const [detailsOpen, setDetailsOpen] = useState(false)
	const [feedbackSubmitting, setFeedbackSubmitting] = useState(false)
	const [feedbackSent, setFeedbackSent] = useState(false)

	function handleVoted(value: StarValue, success: boolean) {
		if (success && value <= 3) {
			setFeedbackRating(value as 1 | 2 | 3)
		}
	}

	async function submit(text: string) {
		if (!feedbackRating || !text.trim()) return
		setFeedbackSubmitting(true)
		const success = await sendFeedback(feedbackRating, text.trim())
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
						<p className='text-sm font-medium'>Что не так?</p>

						<div className='flex flex-wrap gap-1.5'>
							{REASONS.map(reason => (
								<button
									key={reason}
									type='button'
									disabled={feedbackSubmitting}
									onClick={() => submit(reason)}
									className='cursor-pointer rounded-full border px-3 py-1.5 text-sm transition-colors hover:border-primary/50 hover:bg-muted disabled:opacity-60'
								>
									{reason}
								</button>
							))}
						</div>

						{detailsOpen ? (
							<Textarea
								value={feedbackText}
								onChange={e => setFeedbackText(e.target.value)}
								placeholder='Что стоит исправить или добавить'
								maxLength={1000}
								className='min-h-20 resize-none text-sm'
								autoFocus
							/>
						) : (
							<button
								type='button'
								onClick={() => setDetailsOpen(true)}
								className='cursor-pointer text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline'
							>
								Написать своими словами
							</button>
						)}

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
								onClick={() => submit(feedbackText)}
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

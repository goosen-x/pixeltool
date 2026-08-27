'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

const STAR_VALUES = [1, 2, 3, 4, 5] as const
export type StarValue = (typeof STAR_VALUES)[number]

// Кольцо-пульс идёт 0.8с, плюс до 200мс разброса по последней звезде (index
// 4 × 50мс) — 1с с запасом покрывает самую долгую анимацию целиком.
const STAR_ANIMATION_MS = 1000

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

interface Props {
	rating: number
	ratingCount: number
	hasVoted: boolean
	onVote: (value: StarValue) => Promise<boolean>
	/** Вызывается после того, как анимация голосования доиграла. Тулы
	 *  используют это, чтобы предложить фидбек на низкой оценке — у блога
	 *  такого шага нет, поэтому пропс необязательный. */
	onVoted?: (value: StarValue, success: boolean) => void
	label?: string
}

export function RatingStars({
	rating,
	ratingCount,
	hasVoted,
	onVote,
	onVoted,
	label = 'Оценка'
}: Props) {
	const [hoverValue, setHoverValue] = useState<StarValue | null>(null)
	const [pendingValue, setPendingValue] = useState<StarValue | null>(null)
	// Меняет key анимируемых звёзд, чтобы CSS-анимация переигралась с нуля на
	// каждой попытке — актуально, если первый голос не прошёл (429/сеть) и
	// кнопки снова стали активными.
	const [voteAttempt, setVoteAttempt] = useState(0)

	const baseFilled = Math.round(rating)
	const displayValue = hoverValue ?? pendingValue ?? baseFilled

	async function handleVote(value: StarValue) {
		setPendingValue(value)
		setVoteAttempt(n => n + 1)
		// Сеть обычно отвечает быстрее, чем доигрывает CSS-анимация звезды —
		// если снять pendingValue сразу по ответу, ключ звёзд меняется раньше
		// срока, React их перемонтирует, и анимация обрывается на середине
		// резким скачком вместо плавного докручивания.
		const [success] = await Promise.all([
			onVote(value),
			new Promise(resolve => setTimeout(resolve, STAR_ANIMATION_MS))
		])
		setPendingValue(null)
		setHoverValue(null)
		onVoted?.(value, success)
	}

	return (
		<div
			className='flex items-center gap-1'
			role='group'
			aria-label={label}
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
						// Тач-тап на мобильном генерирует синтетический mouseenter без
						// парного mouseleave (пальцем не «уводят» с кнопки) — hoverValue
						// зависает навсегда, и звёзды застревают в состоянии превью
						// (контур без заливки) даже после голосования. onPointerEnter
						// с проверкой pointerType включает предпросмотр только на
						// настоящем наведении мышью.
						onPointerEnter={event => {
							if (!hasVoted && event.pointerType === 'mouse') {
								setHoverValue(value)
							}
						}}
						title={`Оценить на ${value} из 5`}
						aria-label={`Оценить на ${value} из 5`}
						className={hasVoted ? 'cursor-default' : 'cursor-pointer'}
					>
						<StarIcon state={state} delayMs={index * 50} />
					</button>
				)
			})}
			{/* Рендерится всегда, а не по условию ratingCount > 0: первый голос
			    на туле без оценок раньше монтировал этот span только что, и вся
			    строка справа (избранное/поделиться) дёргалась вбок вместе с ним.
			    invisible держит место в layout заранее, ничего не сдвигает при
			    появлении числа. tabular-nums убирает мелкое дрожание ширины между
			    соседними оценками (4.5 → 4.6). */}
			<span
				className={cn(
					'ml-1 text-xs text-muted-foreground tabular-nums',
					ratingCount === 0 && 'invisible'
				)}
			>
				{rating.toFixed(1)} · {ratingCount}
			</span>
		</div>
	)
}

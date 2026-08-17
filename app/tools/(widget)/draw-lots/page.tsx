'use client'

import { useState, useEffect, useCallback } from 'react'
import { Shuffle, RotateCcw } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { DrawLotsSeo } from './DrawLotsSeo'

interface Lot {
	id: string
	value: string
	isRevealed: boolean
	order: number
}

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
	const newArray = [...array]
	for (let i = newArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
	}
	return newArray
}

export default function DrawLotsPage() {
	const widget = getWidgetById('draw-lots')!
	const [mounted, setMounted] = useState(false)
	// Пример по-русски: инструмент русскоязычный, а в списке лежали Einstein
	// и da Vinci — на них и проверяли длину строк.
	const defaultValues = 'Аня\nБорис\nВера\nГлеб'
	const [inputText, setInputText] = useState(defaultValues)
	const [lots, setLots] = useState<Lot[]>([])
	const [isDrawing, setIsDrawing] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		setMounted(true)
	}, [])

	const startDrawing = useCallback(() => {
		const lines = inputText
			.trim()
			.split('\n')
			.filter(line => line.trim() !== '')

		if (lines.length === 0) {
			setError('Нет элементов для жребьевки')
			return
		}

		if (lines.length > 100) {
			setError('Слишком много элементов (макс. 100)')
			return
		}

		setError(null)

		// Create lot objects with random order
		const lotObjects: Lot[] = lines.map((value, index) => ({
			id: crypto.randomUUID(),
			value: value.trim(),
			isRevealed: false,
			order: index
		}))

		// Shuffle the lots
		const shuffledLots = shuffleArray(lotObjects)
		setLots(shuffledLots)
		setIsDrawing(true)
	}, [inputText])

	const revealLot = useCallback((lotId: string) => {
		setLots(prev =>
			prev.map(lot => (lot.id === lotId ? { ...lot, isRevealed: true } : lot))
		)
	}, [])

	const reset = useCallback(() => {
		setLots([])
		setIsDrawing(false)
		setError(null)
	}, [])

	const revealedLots = lots.filter(lot => lot.isRevealed)

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: одно действие — начать или начать заново. */}
				<div className={toolBar}>
					<span className='text-sm text-muted-foreground'>
						{isDrawing
							? `Открыто ${revealedLots.length} из ${lots.length}`
							: 'Один участник на строку'}
					</span>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						{isDrawing ? (
							<Button
								size='icon'
								variant='ghost'
								onClick={reset}
								title='Вернуться к списку'
								className={toolIconButton}
							>
								<RotateCcw className='h-4 w-4' />
							</Button>
						) : (
							<>
								<button
									type='button'
									onClick={() => setInputText(defaultValues)}
									disabled={inputText === defaultValues}
									className={cn(
										toolPill(false),
										inputText === defaultValues && 'invisible'
									)}
								>
									Вернуть пример
								</button>
								<Button
									size='icon'
									variant='ghost'
									onClick={startDrawing}
									title='Перемешать и разложить'
									className={toolIconButton}
								>
									<Shuffle className='h-4 w-4' />
								</Button>
							</>
						)}
					</div>
				</div>

				{!isDrawing ? (
					<>
						<Textarea
							id='items'
							value={inputText}
							onChange={e => setInputText(e.target.value)}
							placeholder={'Иван\nПётр\nМария\nАнна'}
							spellCheck={false}
							aria-label='Участники жеребьёвки'
							className='min-h-[14rem] resize-none rounded-none border-0 px-5 py-6 font-mono text-base focus-visible:ring-0 sm:px-6 md:text-sm'
						/>

						<div className={toolFooterBar}>
							{error ? (
								<span className='text-sm text-destructive'>{error}</span>
							) : (
								<span className='text-sm text-muted-foreground'>
									Порядок перемешивается алгоритмом Фишера — Йетса: карточки
									ложатся вслепую, и открыть их можно в любом порядке
								</span>
							)}
						</div>
					</>
				) : (
					<>
						<div className='grid grid-cols-2 gap-3 px-5 py-6 sm:grid-cols-3 sm:px-6 md:grid-cols-4'>
							{lots.map(lot => (
								<button
									key={lot.id}
									type='button'
									onClick={() => revealLot(lot.id)}
									disabled={lot.isRevealed}
									title={lot.isRevealed ? undefined : 'Открыть'}
									className={cn(
										'group aspect-[3/4] rounded-xl text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
										lot.isRevealed ? 'cursor-default' : 'cursor-pointer'
									)}
									style={{ perspective: '1000px' }}
								>
									<div
										className={cn(
											'relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]',
											lot.isRevealed && '[transform:rotateY(180deg)]'
										)}
									>
										{/* Рубашка — видна, пока карточка не открыта */}
										<div className='absolute inset-0 flex items-center justify-center rounded-xl border bg-muted/30 p-3 [backface-visibility:hidden] group-hover:border-primary/50 group-hover:bg-muted'>
											<span className='text-2xl text-muted-foreground'>?</span>
										</div>
										{/* Лицевая сторона — повёрнута на 180°, проявляется после флипа */}
										<div className='absolute inset-0 flex items-center justify-center rounded-xl border border-primary bg-primary/5 p-3 [backface-visibility:hidden] [transform:rotateY(180deg)]'>
											<span className='font-medium break-words'>
												{lot.value}
											</span>
										</div>
									</div>
								</button>
							))}
						</div>

						{revealedLots.length > 0 && (
							<div className={toolFooterBar}>
								<span className='mr-1 text-sm text-muted-foreground'>
									Открыты по порядку
								</span>
								{revealedLots.map((lot, index) => (
									<span key={lot.id} className='text-sm'>
										<span className='mr-1 font-mono text-xs text-muted-foreground'>
											{index + 1}.
										</span>
										{lot.value}
									</span>
								))}
							</div>
						)}
					</>
				)}
			</Card>

			<DrawLotsSeo />
		</WidgetSEOWrapper>
	)
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { Check, Copy, RotateCcw, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
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
import { useYandexGoals } from '@/lib/hooks/useYandexGoals'
import { DrawLotsSeo } from './DrawLotsSeo'

const MAX_PARTICIPANTS = 100

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

/**
 * Размер карточек подстраивается под количество — иначе при 100 участниках
 * (максимум) 4 фиксированные колонки дают огромные карточки и десятки
 * экранов прокрутки. Чем больше карточек, тем плотнее сетка и мельче шрифт.
 */
function getRevealDisplay(count: number) {
	if (count <= 8) {
		return {
			grid: 'grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4',
			mark: 'text-2xl',
			name: 'text-sm'
		}
	}
	if (count <= 24) {
		return {
			grid: 'grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6',
			mark: 'text-xl',
			name: 'text-xs'
		}
	}
	if (count <= 50) {
		return {
			grid: 'grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8',
			mark: 'text-lg',
			name: 'text-xs'
		}
	}
	return {
		grid: 'grid-cols-5 gap-1.5 sm:grid-cols-7 md:grid-cols-10',
		mark: 'text-base',
		name: 'text-[0.7rem]'
	}
}

export default function DrawLotsPage() {
	const widget = getWidgetById('draw-lots')!
	// Глобальный GlobalGoalsTracker ловит клики по тексту кнопки, но список
	// действий там на английском ('generate', 'roll', 'start'...) — ни разу не
	// совпадёт с русским «Тянуть жребий». Без явного вызова цель tool_used с
	// реальным действием (не просто page_view) для этого тула не набиралась
	// бы вообще — важно сейчас, идёт платный трафик на этот тул.
	const { trackToolAction } = useYandexGoals()
	const [mounted, setMounted] = useState(false)
	// Пример по-русски: инструмент русскоязычный, а в списке лежали Einstein
	// и da Vinci — на них и проверяли длину строк.
	const defaultValues = 'Бен Аффлек\nБрюс Уиллис\nХаррисон Форд\nНиколас Кейдж'
	const [inputText, setInputText] = useState(defaultValues)
	const [lots, setLots] = useState<Lot[]>([])
	const [isDrawing, setIsDrawing] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [copied, setCopied] = useState(false)

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

		if (lines.length > MAX_PARTICIPANTS) {
			const message = `Слишком много участников — максимум ${MAX_PARTICIPANTS}`
			setError(message)
			toast.error(message)
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
		trackToolAction('draw')
	}, [inputText, trackToolAction])

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

	const copyRevealed = useCallback(async () => {
		if (revealedLots.length === 0) return
		try {
			await navigator.clipboard.writeText(
				revealedLots.map(lot => lot.value).join('\n')
			)
			setCopied(true)
			toast.success('Скопировано')
			setTimeout(() => setCopied(false), 2000)
		} catch {
			toast.error('Не удалось скопировать')
		}
	}, [revealedLots])

	// Тот же парсинг, что в startDrawing — используется и для счётчика, и для
	// живого предпросмотра участников справа от поля ввода.
	const previewNames = inputText
		.split('\n')
		.map(line => line.trim())
		.filter(line => line !== '')
	const participantCount = previewNames.length
	const revealDisplay = getRevealDisplay(lots.length)

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: одно действие — начать или начать заново. */}
				<div className={toolBar}>
					<span
						className={cn(
							'text-sm',
							!isDrawing && participantCount > MAX_PARTICIPANTS
								? 'font-medium text-destructive'
								: 'text-muted-foreground'
						)}
					>
						{isDrawing
							? `Открыто ${revealedLots.length} из ${lots.length}`
							: `${participantCount} из ${MAX_PARTICIPANTS} участников · один на строку`}
					</span>

					<div className='flex items-center gap-0.5 ml-auto'>
						{isDrawing ? (
							<button
								type='button'
								onClick={reset}
								title='Вернуться к списку'
								className={toolPill(false, 'inline-flex items-center gap-1.5')}
							>
								<RotateCcw className='h-3.5 w-3.5' />
								Сбросить
							</button>
						) : (
							<button
								type='button'
								onClick={() => setInputText(defaultValues)}
								disabled={inputText === defaultValues}
								className={cn(
									toolPill(false, 'inline-flex items-center gap-1.5'),
									inputText === defaultValues && 'invisible'
								)}
							>
								<RotateCcw className='h-3.5 w-3.5' />
								Вернуть пример
							</button>
						)}
					</div>
				</div>

				{!isDrawing ? (
					<>
						<div className='grid sm:grid-cols-[2fr_3fr]'>
							{/* field-sizing:content — textarea растёт по контенту, а не
							    прячет его за внутренним скроллом на фиксированной высоте
							    (тот же приём прогрессивного CSS, что corner-shape в
							    Button). max-h + overflow — предохранитель только на
							    случай списков, близких к лимиту в 100 строк. Высота
							    синхронизирована с колонкой предпросмотра справа — иначе
							    при длинном списке они растут независимо и грид «рвёт»
							    страницу по самой высокой из двух. */}
							<div className='relative'>
								<Textarea
									id='items'
									value={inputText}
									onChange={e => setInputText(e.target.value)}
									placeholder={'Иван\nПётр\nМария\nАнна'}
									spellCheck={false}
									aria-label='Участники жеребьёвки'
									className='max-h-[32rem] min-h-[10rem] resize-none overflow-y-auto rounded-none border-0 border-b px-5 py-6 font-mono text-base [field-sizing:content] focus-visible:ring-0 sm:border-r sm:border-b-0 sm:px-6 md:text-sm'
								/>

								{inputText !== '' && (
									<Button
										size='icon'
										variant='secondary'
										onClick={() => setInputText('')}
										title='Очистить'
										className='absolute top-3 right-3 h-8 w-8 cursor-pointer shadow-sm'
									>
										<Trash2 className='h-4 w-4' />
									</Button>
								)}
							</div>

							{/* Живой предпросмотр — как реально распарсился ввод (лишний
							    пробел, пустая строка, дубль видны сразу), а не только
							    декоративное заполнение пустого места справа. Колонка —
							    flex-col высотой в textarea слева (grid stretch), сама
							    кнопка запуска приклеена к её низу, а не вынесена в общий
							    футер во всю ширину: отдельный футер под обеими колонками
							    был лишним — правая колонка и так заканчивается кнопкой. */}
							<div className='flex max-h-[32rem] flex-col'>
								<div className='flex min-h-0 flex-1 flex-wrap content-start gap-1.5 overflow-y-auto bg-muted/20 p-5 sm:p-6'>
									{previewNames.length > 0 ? (
										previewNames.map((name, index) => (
											<span
												key={index}
												className='max-w-full truncate rounded-full border bg-background px-3 py-1 text-sm'
											>
												{name}
											</span>
										))
									) : (
										<p className='text-sm text-muted-foreground'>
											Участники появятся здесь по мере ввода
										</p>
									)}
								</div>

								<div className={cn(toolFooterBar, 'border-t-0 shrink-0')}>
									<Button
										onClick={startDrawing}
										disabled={participantCount === 0}
										className='cursor-pointer'
									>
										Тянуть жребий
									</Button>

									{error && (
										<span className='text-sm text-destructive'>{error}</span>
									)}
								</div>
							</div>
						</div>
					</>
				) : (
					<>
						{revealedLots.length < lots.length && (
							<p className='px-5 pt-5 text-center text-sm text-muted-foreground sm:px-6'>
								Нажмите на карточку, чтобы открыть
							</p>
						)}

						<div className={cn('grid px-5 py-6 sm:px-6', revealDisplay.grid)}>
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
										<div className='absolute inset-0 flex items-center justify-center rounded-xl border bg-muted/30 p-2 [backface-visibility:hidden] group-hover:border-primary/50 group-hover:bg-muted'>
											<span
												className={cn(
													'text-muted-foreground',
													revealDisplay.mark
												)}
											>
												?
											</span>
										</div>
										{/* Лицевая сторона — повёрнута на 180°, проявляется после флипа */}
										<div className='absolute inset-0 flex items-center justify-center rounded-xl border border-primary bg-primary/5 p-2 [backface-visibility:hidden] [transform:rotateY(180deg)]'>
											<span
												className={cn(
													'break-words font-medium',
													revealDisplay.name
												)}
											>
												{lot.value}
											</span>
										</div>
									</div>
								</button>
							))}
						</div>

						{revealedLots.length > 0 && (
							<div
								className={cn(
									toolFooterBar,
									'flex-col flex-nowrap items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center'
								)}
							>
								{/* На мобильном заголовок и кнопка копирования — своя строка
								    сверху (копия прижата в правый верхний угол), а список —
								    отдельная колонка под ней. На sm+ обе обёртки схлопываются
								    в contents и всё возвращается в исходную построчную сетку. */}
								<div className='flex items-center justify-between sm:contents'>
									<span className='mr-1 text-sm text-muted-foreground'>
										Открыты по порядку
									</span>

									<Button
										size='icon'
										variant='ghost'
										onClick={copyRevealed}
										title='Скопировать открытые'
										className={cn(toolIconButton, 'sm:order-last sm:ml-auto')}
									>
										{copied ? (
											<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
										) : (
											<Copy className='h-4 w-4' />
										)}
									</Button>
								</div>

								<div className='flex flex-col gap-1.5 sm:contents'>
									{revealedLots.map((lot, index) => (
										<span key={lot.id} className='text-sm'>
											<span className='mr-1 font-mono text-xs text-muted-foreground'>
												{index + 1}.
											</span>
											{lot.value}
										</span>
									))}
								</div>
							</div>
						)}
					</>
				)}
			</Card>

			<DrawLotsSeo />
		</WidgetSEOWrapper>
	)
}

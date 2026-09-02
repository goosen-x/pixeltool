'use client'

import { useEffect, useRef, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toolBar, toolFooterBar, toolIconButton } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import {
	addToHistory,
	countByTone,
	pickAnswer,
	TONE_LABELS,
	type BallAnswer,
	type HistoryEntry
} from '@/lib/utils/magic-ball'
import { cn } from '@/lib/utils'
import { MagicBallSeo } from './MagicBallSeo'

const STORAGE_KEY = 'pixeltool:magic-ball:history'

/** Сколько длится встряхивание до появления ответа. */
const SHAKE_MS = 900

export default function MagicBallPage() {
	const widget = getWidgetById('magic-ball')!

	const [question, setQuestion] = useState('')
	const [answer, setAnswer] = useState<BallAnswer | null>(null)
	const [shaking, setShaking] = useState(false)
	const [history, setHistory] = useState<HistoryEntry[]>([])

	const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

	// История лежит в браузере и никуда не уходит: вопросы человек задаёт
	// личные, и отправлять их на сервер ради списка из двадцати строк незачем.
	useEffect(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY)
			if (saved) setHistory(JSON.parse(saved))
		} catch {
			// Приватный режим или запрет на хранение — работаем без истории
		}
	}, [])

	useEffect(() => {
		return () => {
			if (timer.current) clearTimeout(timer.current)
		}
	}, [])

	const ask = () => {
		if (shaking) return

		setShaking(true)
		setAnswer(null)

		timer.current = setTimeout(() => {
			const next = pickAnswer(Math.random, answer?.id)
			setAnswer(next)
			setShaking(false)

			const entry: HistoryEntry = {
				question: question.trim(),
				answer: next.text,
				tone: next.tone,
				at: Date.now()
			}
			setHistory(current => {
				const updated = addToHistory(current, entry)
				try {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
				} catch {
					// не смогли сохранить — на работу шара это не влияет
				}
				return updated
			})
		}, SHAKE_MS)
	}

	const clearHistory = () => {
		setHistory([])
		try {
			localStorage.removeItem(STORAGE_KEY)
		} catch {
			// нечего чистить
		}
	}

	const counts = countByTone()

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<span className='text-sm text-muted-foreground'>
						Задайте вопрос, на который отвечают «да» или «нет»
					</span>
					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={clearHistory}
							disabled={history.length === 0}
							title='Очистить историю'
							className={toolIconButton}
						>
							<Trash2 className='h-4 w-4' />
						</Button>
					</div>
				</div>

				{/* Шар — первое, что видно: ради него сюда и приходят, и он не
				    должен уезжать под текст. */}
				<div className='flex flex-col items-center gap-6 px-5 py-10 sm:px-6'>
					<button
						type='button'
						onClick={ask}
						aria-label='Встряхнуть шар и получить ответ'
						className={cn(
							'group relative aspect-square w-56 cursor-pointer rounded-full transition-transform sm:w-64',
							'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
							shaking
								? 'animate-[shake_0.9s_ease-in-out]'
								: 'hover:scale-[1.02]'
						)}
						style={{
							background:
								'radial-gradient(circle at 32% 28%, #4a4a52 0%, #1c1c22 42%, #08080b 100%)',
							boxShadow:
								'inset 0 -18px 40px rgba(0,0,0,0.8), 0 18px 40px -12px rgba(0,0,0,0.55)'
						}}
					>
						{/* Блик: без него шар читается плоским кругом, а не сферой */}
						<span
							aria-hidden='true'
							className='pointer-events-none absolute left-[18%] top-[12%] h-[22%] w-[30%] rounded-full opacity-70 blur-md'
							style={{
								background:
									'radial-gradient(ellipse at center, rgba(255,255,255,0.55), transparent 70%)'
							}}
						/>

						{/* Окошко с треугольником */}
						<span
							className='absolute left-1/2 top-1/2 flex aspect-square w-[52%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full'
							style={{
								background:
									'radial-gradient(circle at 50% 45%, #241f4d 0%, #12102b 70%, #0a0918 100%)',
								boxShadow: 'inset 0 4px 14px rgba(0,0,0,0.9)'
							}}
						>
							{shaking ? (
								<span className='text-3xl text-indigo-300/70'>…</span>
							) : answer ? (
								<span className='px-3 text-center text-[0.8rem] leading-tight font-medium text-indigo-100 sm:text-sm'>
									{answer.text}
								</span>
							) : (
								<span
									aria-hidden='true'
									className='text-4xl text-indigo-300/80'
									style={{ lineHeight: 1 }}
								>
									▲
								</span>
							)}
						</span>
					</button>

					<div className='flex w-full max-w-md flex-col items-center gap-3'>
						<Input
							value={question}
							onChange={event => setQuestion(event.target.value)}
							onKeyDown={event => {
								if (event.key === 'Enter') ask()
							}}
							placeholder='Например: стоит ли соглашаться?'
							aria-label='Ваш вопрос'
							className='text-center'
						/>
						<Button
							onClick={ask}
							disabled={shaking}
							className='w-full cursor-pointer sm:w-auto'
						>
							{shaking ? 'Шар думает…' : 'Спросить шар'}
						</Button>

						{answer && !shaking && (
							<p className='text-sm text-muted-foreground'>
								{TONE_LABELS[answer.tone]}
							</p>
						)}
					</div>
				</div>

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						{counts.positive} ответов «да», {counts.neutral} уклончивых,{' '}
						{counts.negative} «нет» — как у настоящей игрушки
					</span>
					{history.length > 0 && (
						<span className='text-sm text-muted-foreground sm:ml-auto'>
							вопросов задано:{' '}
							<span className='font-mono text-foreground'>
								{history.length}
							</span>
						</span>
					)}
				</div>
			</Card>

			{history.length > 0 && (
				<section className='mt-8'>
					<h2 className='text-lg font-semibold'>Последние ответы</h2>
					<p className='mt-2 text-sm text-muted-foreground'>
						Хранятся только в вашем браузере, без регистрации и без отправки на
						сервер.
					</p>
					<ul className='mt-4 divide-y rounded-xl border'>
						{history.map(item => (
							<li
								key={item.at}
								className='flex flex-wrap items-baseline gap-x-3 gap-y-1 px-4 py-2.5 text-sm'
							>
								{item.question && (
									<span className='text-muted-foreground'>{item.question}</span>
								)}
								<span className='font-medium'>{item.answer}</span>
								<span className='ml-auto text-xs text-muted-foreground'>
									{TONE_LABELS[item.tone]}
								</span>
							</li>
						))}
					</ul>
				</section>
			)}

			<MagicBallSeo />
		</WidgetSEOWrapper>
	)
}

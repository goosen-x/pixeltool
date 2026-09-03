'use client'

import { useMemo, useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toolBar, toolFooterBar, toolIconButton } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { randomTypingText } from '@/lib/data/typing-speed-texts'
import { TypingSpeedTestSeo } from './TypingSpeedTestSeo'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'

export default function TypingSpeedTestPage() {
	const widget = getWidgetById('typing-speed-test')!

	const [target, setTarget] = useState(() => randomTypingText())
	const [typed, setTyped] = useState('')
	const startedAtRef = useRef<number | null>(null)
	const [finishedAtMs, setFinishedAtMs] = useState<number | null>(null)
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	const finished = typed.length >= target.length

	const handleChange = (value: string) => {
		if (finished) return
		if (startedAtRef.current === null && value.length > 0) {
			startedAtRef.current = performance.now()
		}
		const next = value.slice(0, target.length)
		setTyped(next)
		if (next.length === target.length && startedAtRef.current !== null) {
			setFinishedAtMs(performance.now() - startedAtRef.current)
		}
	}

	const restart = () => {
		setTarget(randomTypingText(target))
		setTyped('')
		startedAtRef.current = null
		setFinishedAtMs(null)
		textareaRef.current?.focus()
	}

	const stats = useMemo(() => {
		let correctChars = 0
		for (let i = 0; i < typed.length; i++) {
			if (typed[i] === target[i]) correctChars++
		}
		const accuracy =
			typed.length > 0 ? Math.round((correctChars / typed.length) * 100) : 100

		const elapsedMs = finishedAtMs ?? 0
		const elapsedMinutes = elapsedMs / 60000
		const cpm =
			elapsedMinutes > 0 ? Math.round(correctChars / elapsedMinutes) : 0
		const wpm = elapsedMinutes > 0 ? Math.round(cpm / 5) : 0

		return { correctChars, accuracy, elapsedMs, cpm, wpm }
	}, [typed, target, finishedAtMs])

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<span className='text-sm text-muted-foreground'>
						{finished
							? 'Текст напечатан'
							: typed.length === 0
								? 'Начните печатать — таймер запустится сам'
								: `${typed.length} из ${target.length} символов`}
					</span>
					<div className='ml-auto flex items-center gap-0.5'>
						<Button
							size='icon'
							variant='ghost'
							onClick={restart}
							title='Новый текст'
							className={toolIconButton}
						>
							<RotateCcw className='h-4 w-4' />
						</Button>
					</div>
				</div>

				<p
					className='px-5 py-8 font-mono text-lg leading-relaxed sm:px-6'
					aria-hidden
				>
					{target.split('').map((char, index) => {
						const typedChar = typed[index]
						const state =
							typedChar === undefined
								? 'pending'
								: typedChar === char
									? 'correct'
									: 'incorrect'
						return (
							<span
								key={index}
								className={cn(
									state === 'pending' && 'text-muted-foreground',
									state === 'correct' && 'text-foreground',
									state === 'incorrect' &&
										'bg-red-500/20 text-red-600 dark:text-red-400',
									index === typed.length &&
										!finished &&
										'border-l-2 border-primary'
								)}
							>
								{char}
							</span>
						)
					})}
				</p>

				<div className='border-t px-5 py-4 sm:px-6'>
					<textarea
						ref={textareaRef}
						value={typed}
						onChange={event => handleChange(event.target.value)}
						onPaste={event => event.preventDefault()}
						disabled={finished}
						autoFocus
						rows={3}
						placeholder='Печатайте здесь текст сверху'
						aria-label='Поле для набора текста'
						className='w-full resize-none rounded-md border bg-background px-3 py-2 font-mono text-base text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60'
					/>
				</div>

				{finished && (
					<div className='grid grid-cols-3 gap-4 border-t px-5 py-6 text-center sm:px-6'>
						<div>
							<span className='block font-mono text-2xl font-semibold text-foreground'>
								{stats.cpm}
							</span>
							<span className='mt-1 block text-sm text-muted-foreground'>
								зн/мин
							</span>
						</div>
						<div>
							<span className='block font-mono text-2xl font-semibold text-foreground'>
								{stats.wpm}
							</span>
							<span className='mt-1 block text-sm text-muted-foreground'>
								слов/мин
							</span>
						</div>
						<div>
							<span className='block font-mono text-2xl font-semibold text-foreground'>
								{stats.accuracy}%
							</span>
							<span className='mt-1 block text-sm text-muted-foreground'>
								точность
							</span>
						</div>
					</div>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						Вставка текста отключена — учитывается только реальный набор
					</span>
				</div>
			</Card>

			<ToolScreenshot slug='typing-speed-test' />
			<TypingSpeedTestSeo />
		</WidgetSEOWrapper>
	)
}

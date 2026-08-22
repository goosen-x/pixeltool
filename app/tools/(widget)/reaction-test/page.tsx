'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toolBar, toolFooterBar, toolIconButton } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { ReactionTestSeo } from './ReactionTestSeo'

const ROUNDS = 5
const MIN_DELAY_MS = 1200
const MAX_DELAY_MS = 4000

type Phase = 'idle' | 'waiting' | 'ready' | 'tooSoon' | 'finished'

export default function ReactionTestPage() {
	const widget = getWidgetById('reaction-test')!

	const [phase, setPhase] = useState<Phase>('idle')
	const [results, setResults] = useState<number[]>([])
	const readyAtRef = useRef(0)
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	useEffect(() => {
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current)
		}
	}, [])

	const startRound = useCallback(() => {
		setPhase('waiting')
		const delay =
			MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS)
		timeoutRef.current = setTimeout(() => {
			readyAtRef.current = performance.now()
			setPhase('ready')
		}, delay)
	}, [])

	const restartAll = () => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current)
		setResults([])
		setPhase('idle')
	}

	const handleZoneClick = () => {
		if (phase === 'idle' || phase === 'tooSoon') {
			startRound()
			return
		}

		if (phase === 'waiting') {
			if (timeoutRef.current) clearTimeout(timeoutRef.current)
			setPhase('tooSoon')
			return
		}

		if (phase === 'ready') {
			const reactionMs = Math.round(performance.now() - readyAtRef.current)
			const nextResults = [...results, reactionMs]
			setResults(nextResults)
			setPhase(nextResults.length >= ROUNDS ? 'finished' : 'idle')
		}
	}

	const average =
		results.length > 0
			? Math.round(results.reduce((sum, value) => sum + value, 0) / results.length)
			: null
	const best = results.length > 0 ? Math.min(...results) : null

	const zoneLabel = (() => {
		if (phase === 'waiting') return 'Ждите зелёный сигнал…'
		if (phase === 'ready') return 'ЖМИ!'
		if (phase === 'tooSoon') return 'Рано! Нажмите, чтобы попробовать снова'
		if (phase === 'finished') return 'Тест завершён'
		return results.length === 0
			? 'Нажмите, чтобы начать'
			: `Раунд ${results.length + 1} из ${ROUNDS} — нажмите, чтобы начать`
	})()

	const zoneClass = cn(
		'flex h-64 cursor-pointer select-none items-center justify-center text-center text-xl font-semibold transition-colors sm:h-72',
		phase === 'ready' && 'bg-green-500 text-white dark:bg-green-600',
		phase === 'waiting' && 'bg-red-500/90 text-white dark:bg-red-600/90',
		phase === 'tooSoon' && 'bg-amber-500/90 text-white dark:bg-amber-600/90',
		(phase === 'idle' || phase === 'finished') &&
			'bg-muted/40 text-foreground hover:bg-muted/60'
	)

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<span className='text-sm text-muted-foreground'>
						{results.length}/{ROUNDS} раундов
					</span>
					<div className='ml-auto flex items-center gap-0.5'>
						<Button
							size='icon'
							variant='ghost'
							onClick={restartAll}
							disabled={phase === 'idle' && results.length === 0}
							title='Начать заново'
							className={toolIconButton}
						>
							<RotateCcw className='h-4 w-4' />
						</Button>
					</div>
				</div>

				<div
					role='button'
					tabIndex={0}
					onClick={handleZoneClick}
					onKeyDown={event => {
						if (event.key === 'Enter' || event.key === ' ') {
							event.preventDefault()
							handleZoneClick()
						}
					}}
					className={zoneClass}
				>
					{phase === 'finished' && average !== null ? (
						<div>
							<span className='block font-mono text-5xl font-bold'>
								{average} мс
							</span>
							<span className='mt-2 block text-base font-normal text-muted-foreground'>
								средняя реакция, лучшая — {best} мс
							</span>
						</div>
					) : (
						zoneLabel
					)}
				</div>

				{results.length > 0 && (
					<div className='flex flex-wrap justify-center gap-3 border-t px-5 py-4 sm:px-6'>
						{results.map((value, index) => (
							<span
								key={index}
								className='rounded-full border px-3 py-1 font-mono text-sm text-muted-foreground'
							>
								{index + 1}: {value} мс
							</span>
						))}
					</div>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						Клик до появления зелёного цвета засчитывается как «рано» и не
						учитывается в результате
					</span>
				</div>
			</Card>

			<ReactionTestSeo />
		</WidgetSEOWrapper>
	)
}

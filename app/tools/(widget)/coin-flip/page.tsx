'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RotateCcw, Coins } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import Image from 'next/image'

interface FlipResult {
	id: string
	result: 'heads' | 'tails'
	timestamp: Date
	coinType: string
}

interface CoinType {
	id: string
	name: string
	headsText: string
	tailsText: string
	headsIcon: string
	tailsIcon: string
	color: string
}

const coinTypes: CoinType[] = [
	{
		id: 'ruble',
		name: 'Рубль',
		headsText: 'Орёл',
		tailsText: 'Решка',
		headsIcon: '🦅',
		tailsIcon: '₽',
		color: 'from-red-400 to-red-600'
	}
]

export default function CoinFlipPage() {
	const [mounted, setMounted] = useState(false)
	const [isFlipping, setIsFlipping] = useState(false)
	const [currentResult, setCurrentResult] = useState<'heads' | 'tails' | null>(
		null
	)
	const [flipHistory, setFlipHistory] = useState<FlipResult[]>([])
	// Монета одна — рубль; состояние здесь ни к чему.
	const selectedCoin = coinTypes[0]
	const [animationSpeed, setAnimationSpeed] = useState<
		'slow' | 'normal' | 'fast'
	>('normal')
	const [rotation, setRotation] = useState(0)
	const [headsCount, setHeadsCount] = useState(0)
	const [tailsCount, setTailsCount] = useState(0)

	const updateCounts = useCallback((history: FlipResult[]) => {
		const heads = history.filter(h => h.result === 'heads').length
		const tails = history.filter(h => h.result === 'tails').length
		setHeadsCount(heads)
		setTailsCount(tails)
	}, [])

	useEffect(() => {
		setMounted(true)
		// Load history from localStorage
		const savedHistory = localStorage.getItem('coinFlipHistory')
		if (savedHistory) {
			const parsed = JSON.parse(savedHistory).map((item: any) => ({
				...item,
				timestamp: new Date(item.timestamp)
			}))
			setFlipHistory(parsed)
			updateCounts(parsed)
		}
	}, [updateCounts])

	const flipCoin = useCallback(() => {
		if (isFlipping) return

		setIsFlipping(true)
		setCurrentResult(null)

		// Determine result using crypto.getRandomValues for true randomness
		const randomArray = new Uint8Array(1)
		crypto.getRandomValues(randomArray)
		const result: 'heads' | 'tails' = randomArray[0] < 128 ? 'heads' : 'tails'

		// Calculate rotation
		const baseRotations =
			animationSpeed === 'slow' ? 3 : animationSpeed === 'fast' ? 8 : 5

		// Определяем текущую позицию монеты (какая сторона сейчас видна)
		const currentPosition = rotation % 360
		const isCurrentlyHeads = currentPosition < 90 || currentPosition >= 270

		// Вычисляем, сколько нужно повернуть, чтобы показать нужную сторону
		let additionalRotation = 0
		if (result === 'heads' && !isCurrentlyHeads) {
			additionalRotation = 180
		} else if (result === 'tails' && isCurrentlyHeads) {
			additionalRotation = 180
		}

		const finalRotation = rotation + baseRotations * 360 + additionalRotation
		setRotation(finalRotation)

		// Animation duration
		const duration =
			animationSpeed === 'slow' ? 2000 : animationSpeed === 'fast' ? 800 : 1200

		setTimeout(() => {
			setCurrentResult(result)
			setIsFlipping(false)

			// Add to history
			const newResult: FlipResult = {
				id: crypto.randomUUID(),
				result,
				timestamp: new Date(),
				coinType: selectedCoin.name
			}

			const newHistory = [newResult, ...flipHistory].slice(0, 100) // Keep last 100 flips
			setFlipHistory(newHistory)
			updateCounts(newHistory)

			// Save to localStorage
			localStorage.setItem('coinFlipHistory', JSON.stringify(newHistory))
		}, duration)
	}, [
		isFlipping,
		animationSpeed,
		rotation,
		selectedCoin,
		flipHistory,
		updateCounts
	])

	const clearHistory = useCallback(() => {
		setFlipHistory([])
		setHeadsCount(0)
		setTailsCount(0)
		localStorage.removeItem('coinFlipHistory')
	}, [])

	const getAnimationDuration = () => {
		switch (animationSpeed) {
			case 'slow':
				return 2
			case 'fast':
				return 0.8
			default:
				return 1.2
		}
	}

	if (!mounted) {
		return (
			<Card className='overflow-hidden p-0'>
				<div className='h-14 border-b bg-muted/30' />
				<div className='h-80 animate-pulse bg-muted/20' />
			</Card>
		)
	}

	const headsPercentage =
		flipHistory.length > 0
			? Math.round((headsCount / flipHistory.length) * 100)
			: 50
	const tailsPercentage =
		flipHistory.length > 0
			? Math.round((tailsCount / flipHistory.length) * 100)
			: 50

	return (
		<>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: скорость вращения. Раньше она была ползунком на
				    три деления с эмодзи-подписями 🐌 ⚡ 🚀 — три значения удобнее
				    выбрать таблетками. */}
				<div className={toolBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						<span className='mr-1 text-sm text-muted-foreground'>Скорость</span>
						{(
							[
								['slow', 'медленно'],
								['normal', 'обычно'],
								['fast', 'быстро']
							] as ['slow' | 'normal' | 'fast', string][]
						).map(([value, label]) => (
							<button
								key={value}
								type='button'
								onClick={() => setAnimationSpeed(value)}
								aria-pressed={animationSpeed === value}
								className={toolPill(animationSpeed === value)}
							>
								{label}
							</button>
						))}
					</div>

					{flipHistory.length > 0 && (
						<div className='flex items-center gap-0.5 sm:ml-auto'>
							<Button
								size='icon'
								variant='ghost'
								onClick={clearHistory}
								title='Очистить историю бросков'
								className={toolIconButton}
							>
								<RotateCcw className='h-4 w-4' />
							</Button>
						</div>
					)}
				</div>

				<div className='flex flex-col items-center gap-6 px-5 py-8 sm:px-6'>
					<div className='relative h-56 w-56'>
						<motion.div
							className='relative h-full w-full'
							animate={{ rotateY: rotation }}
							transition={{
								duration: getAnimationDuration(),
								ease: 'easeInOut'
							}}
							style={{ transformStyle: 'preserve-3d' }}
						>
							<div
								className='absolute inset-0 overflow-hidden rounded-full'
								style={{ backfaceVisibility: 'hidden' }}
							>
								<Image
									src='/images/coins/ruble-heads.png'
									alt={`${selectedCoin.name}, орёл`}
									width={224}
									height={224}
									className='h-full w-full object-cover'
								/>
							</div>

							<div
								className='absolute inset-0 overflow-hidden rounded-full'
								style={{
									backfaceVisibility: 'hidden',
									transform: 'rotateY(180deg)'
								}}
							>
								<Image
									src='/images/coins/ruble-tails.png'
									alt={`${selectedCoin.name}, решка`}
									width={224}
									height={224}
									className='h-full w-full object-cover'
								/>
							</div>
						</motion.div>
					</div>

					<p className='h-8 text-2xl font-semibold'>
						{currentResult && !isFlipping
							? currentResult === 'heads'
								? 'Орёл'
								: 'Решка'
							: ''}
					</p>

					<Button
						onClick={flipCoin}
						disabled={isFlipping}
						className='cursor-pointer gap-2'
					>
						<Coins className={cn('h-4 w-4', isFlipping && 'animate-spin')} />
						{isFlipping ? 'Подбрасываем…' : 'Подбросить'}
					</Button>
				</div>

				{/* Полоса истории: последние броски и накопленная статистика.
				    Раньше история пряталась за раскрывашкой с шевроном. */}
				{flipHistory.length > 0 && (
					<div className={toolFooterBar}>
						<span className='flex items-center gap-4 text-sm text-muted-foreground'>
							<span>
								Орёл{' '}
								<span className='font-mono text-foreground'>{headsCount}</span>{' '}
								· {headsPercentage}%
							</span>
							<span>
								Решка{' '}
								<span className='font-mono text-foreground'>{tailsCount}</span>{' '}
								· {tailsPercentage}%
							</span>
						</span>

						<span className='flex flex-wrap items-center gap-1 sm:ml-auto'>
							{flipHistory.slice(0, 20).map(flip => (
								<span
									key={flip.id}
									title={flip.result === 'heads' ? 'Орёл' : 'Решка'}
									className={cn(
										'flex h-6 w-6 items-center justify-center rounded-full border text-xs',
										flip.result === 'heads'
											? 'border-primary/40 text-primary'
											: 'text-muted-foreground'
									)}
								>
									{flip.result === 'heads' ? 'О' : 'Р'}
								</span>
							))}
						</span>
					</div>
				)}
			</Card>

			<div className='mt-6 space-y-3 text-sm text-muted-foreground'>
				<p>
					Сторона выпадает по crypto.getRandomValues — источнику случайности
					самой операционной системы, а не по Math.random(). Анимация вращения
					только показывает уже выпавший результат и на него не влияет.
				</p>
				<p>
					У честной монеты шансы всегда 50 на 50, каким бы ни был предыдущий
					бросок: серия из пяти орлов подряд не делает решку «более вероятной» —
					это ошибка игрока.
				</p>
			</div>
		</>
	)
}

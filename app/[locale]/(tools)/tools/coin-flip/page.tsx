'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { RotateCcw, Coins, History, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

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
		id: 'usd',
		name: 'US Dollar',
		headsText: 'Heads',
		tailsText: 'Tails',
		headsIcon: '👑',
		tailsIcon: '🪙',
		color: 'from-yellow-400 to-yellow-600'
	},
	{
		id: 'ruble',
		name: 'Russian Ruble',
		headsText: 'Орел',
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
	const [selectedCoin, setSelectedCoin] = useState<CoinType>(coinTypes[0])
	const [animationSpeed, setAnimationSpeed] = useState<
		'slow' | 'normal' | 'fast'
	>('normal')
	const [rotation, setRotation] = useState(0)
	const [headsCount, setHeadsCount] = useState(0)
	const [tailsCount, setTailsCount] = useState(0)
	const [historyOpen, setHistoryOpen] = useState(false)

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
		const finalRotation =
			rotation + baseRotations * 360 + (result === 'heads' ? 0 : 180)
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

			// Show result toast
			const resultText =
				result === 'heads' ? selectedCoin.headsText : selectedCoin.tailsText
			toast.success(`${resultText}!`, {
				icon:
					result === 'heads' ? selectedCoin.headsIcon : selectedCoin.tailsIcon
			})
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
		toast.success('History cleared')
	}, [])

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			// Space to flip coin
			if (e.code === 'Space') {
				e.preventDefault()
				flipCoin()
			}
			// Ctrl/Cmd + T to change coin type
			if ((e.ctrlKey || e.metaKey) && e.key === 't') {
				e.preventDefault()
				const currentIndex = coinTypes.findIndex(c => c.id === selectedCoin.id)
				const nextIndex = (currentIndex + 1) % coinTypes.length
				setSelectedCoin(coinTypes[nextIndex])
			}
			// Ctrl/Cmd + R to reset (clear history)
			if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
				e.preventDefault()
				clearHistory()
			}
		}

		window.addEventListener('keydown', handleKeyPress)
		return () => window.removeEventListener('keydown', handleKeyPress)
	}, [selectedCoin, flipCoin, clearHistory])

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
			<div className='max-w-6xl mx-auto space-y-8'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight mb-2'>Coin Flip</h1>
					<p className='text-muted-foreground'>
						Flip a coin online with realistic 3D animation
					</p>
				</div>
				<div className='animate-pulse space-y-8'>
					<div className='h-96 bg-muted rounded-lg'></div>
				</div>
			</div>
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
		<div className='w-full mx-auto space-y-6'>
			{/* Main Coin Flip Card */}
			<Card className='p-8'>
				{/* Минималистичная шапка */}
				<div className='flex justify-between items-center mb-8'>
					{/* Быстрые настройки */}
					<div className='flex gap-4'>
						{/* Выбор монеты */}
						<div>
							<div className='text-xs text-muted-foreground mb-2 text-center'>Монета</div>
							<div className='flex gap-2'>
								{coinTypes.map(coin => (
									<Button
										key={coin.id}
										variant={selectedCoin.id === coin.id ? 'default' : 'ghost'}
										size='sm'
										onClick={() => setSelectedCoin(coin)}
										className='h-8 w-8 p-0'
										title={coin.name}
									>
										{coin.id === 'usd' ? '$' : '₽'}
									</Button>
								))}
							</div>
						</div>
						
						{/* Скорость анимации */}
						<div>
							<div className='text-xs text-muted-foreground mb-2 text-center'>Скорость</div>
							<div className='flex gap-2'>
								{[
									{ value: 'slow', icon: '🐌' },
									{ value: 'normal', icon: '⚡' },
									{ value: 'fast', icon: '🚀' }
								].map(speed => (
									<Button
										key={speed.value}
										variant={animationSpeed === speed.value ? 'default' : 'ghost'}
										size='sm'
										onClick={() => setAnimationSpeed(speed.value as 'slow' | 'normal' | 'fast')}
										className='h-8 w-8 p-0'
										title={speed.value}
									>
										{speed.icon}
									</Button>
								))}
							</div>
						</div>
					</div>

					{/* Компактная статистика в углу */}
					{flipHistory.length > 0 && (
						<div>
							<div className='text-xs text-muted-foreground mb-2 text-center'>Статистика</div>
							<div className='flex gap-3 text-xs'>
								<span className='flex items-center gap-1'>
									{selectedCoin.headsIcon} {headsPercentage}%
								</span>
								<span className='flex items-center gap-1'>
									{selectedCoin.tailsIcon} {tailsPercentage}%
								</span>
							</div>
						</div>
					)}
				</div>

				{/* Центральная область с монетой */}
				<div className='flex flex-col items-center space-y-6'>
					{/* Большая 3D монета */}
					<div className='relative w-64 h-64 perspective-1000'>
						<motion.div
							className='relative w-full h-full transform-style-3d'
							animate={{ rotateY: rotation }}
							transition={{
								duration: getAnimationDuration(),
								ease: 'easeInOut'
							}}
							style={{ transformStyle: 'preserve-3d' }}
						>
							{/* Heads Side */}
							<div
								className={cn(
									'absolute inset-0 rounded-full flex items-center justify-center text-5xl font-bold shadow-2xl backface-hidden',
									'bg-gradient-to-br',
									selectedCoin.color,
									'text-white border-4 border-white/20'
								)}
								style={{ backfaceVisibility: 'hidden' }}
							>
								<div className='text-center'>
									<div className='text-8xl mb-2'>{selectedCoin.headsIcon}</div>
									<div className='text-base font-semibold'>
										{selectedCoin.headsText}
									</div>
								</div>
							</div>

							{/* Tails Side */}
							<div
								className={cn(
									'absolute inset-0 rounded-full flex items-center justify-center text-5xl font-bold shadow-2xl backface-hidden',
									'bg-gradient-to-br',
									selectedCoin.color,
									'text-white border-4 border-white/20'
								)}
								style={{
									backfaceVisibility: 'hidden',
									transform: 'rotateY(180deg)'
								}}
							>
								<div className='text-center'>
									<div className='text-7xl mb-2'>{selectedCoin.tailsIcon}</div>
									<div className='text-base font-semibold'>
										{selectedCoin.tailsText}
									</div>
								</div>
							</div>
						</motion.div>
					</div>

					{/* Результат под монетой */}
					<div className='h-20 flex items-center justify-center'>
						<AnimatePresence mode='wait'>
							{currentResult && !isFlipping && (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									className='text-center'
								>
									<h3 className='text-2xl font-bold mb-2'>
										{currentResult === 'heads'
											? selectedCoin.headsText
											: selectedCoin.tailsText}
									</h3>
									<p className='text-muted-foreground'>
										{currentResult === 'heads'
											? 'Выпал орёл!'
											: 'Выпала решка!'}
									</p>
								</motion.div>
							)}
						</AnimatePresence>
					</div>

					{/* Главная кнопка */}
					<Button
						onClick={flipCoin}
						size='lg'
						disabled={isFlipping}
						className='px-12 py-6 text-lg h-auto'
					>
						<Coins
							className={cn('w-6 h-6 mr-3', isFlipping && 'animate-spin')}
						/>
						{isFlipping ? 'Подбрасываем...' : 'Подбросить монету'}
					</Button>
				</div>
			</Card>

			{/* Свернутая история */}
			{flipHistory.length > 0 && (
				<Card className='overflow-hidden'>
					<Button
						variant='ghost'
						className='w-full p-4 justify-between text-left h-auto'
						onClick={() => setHistoryOpen(!historyOpen)}
					>
						<div className='flex items-center gap-2'>
							<History className='w-4 h-4' />
							<span className='font-semibold'>История бросков ({flipHistory.length})</span>
						</div>
						{historyOpen ? (
							<ChevronUp className='w-4 h-4' />
						) : (
							<ChevronDown className='w-4 h-4' />
						)}
					</Button>
					
					<AnimatePresence>
						{historyOpen && (
							<motion.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: 'auto', opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={{ duration: 0.2 }}
								className='overflow-hidden'
							>
								<div className='p-4 pt-0 space-y-4'>
									<div className='flex justify-end'>
										<Button onClick={clearHistory} variant='outline' size='sm'>
											<RotateCcw className='w-4 h-4 mr-1' />
											Очистить
										</Button>
									</div>

									{/* Горизонтальная сетка истории */}
									<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3'>
										{flipHistory.slice(0, 20).map((flip, index) => (
											<div
												key={flip.id}
												className='flex flex-col items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors'
											>
												<Badge variant='outline' className='font-mono text-xs mb-2'>
													#{flipHistory.length - index}
												</Badge>
												<div className='text-2xl mb-1'>
													{flip.result === 'heads'
														? coinTypes.find(c => c.name === flip.coinType)?.headsIcon || selectedCoin.headsIcon
														: coinTypes.find(c => c.name === flip.coinType)?.tailsIcon || selectedCoin.tailsIcon}
												</div>
												<p className='font-medium text-sm text-center mb-1'>
													{flip.result === 'heads'
														? coinTypes.find(c => c.name === flip.coinType)?.headsText || 'Орёл'
														: coinTypes.find(c => c.name === flip.coinType)?.tailsText || 'Решка'}
												</p>
												<p className='text-xs text-muted-foreground text-center'>
													{flip.timestamp.toLocaleTimeString()}
												</p>
											</div>
										))}
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</Card>
			)}
		</div>
	)
}
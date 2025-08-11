'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { RotateCcw, Coins, History } from 'lucide-react'
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
		headsIcon: '🦅',
		tailsIcon: '🏛️',
		color: 'from-yellow-400 to-yellow-600'
	},
	{
		id: 'euro',
		name: 'Euro',
		headsText: 'Number',
		tailsText: 'Map',
		headsIcon: '€',
		tailsIcon: '🗺️',
		color: 'from-blue-400 to-blue-600'
	},
	{
		id: 'ruble',
		name: 'Russian Ruble',
		headsText: 'Орел',
		tailsText: 'Решка',
		headsIcon: '🦅',
		tailsIcon: '₽',
		color: 'from-red-400 to-red-600'
	},
	{
		id: 'generic',
		name: 'Generic Coin',
		headsText: 'Heads',
		tailsText: 'Tails',
		headsIcon: '👑',
		tailsIcon: '🪙',
		color: 'from-gray-400 to-gray-600'
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
	const [showHistory, setShowHistory] = useState(true)
	const [animationSpeed, setAnimationSpeed] = useState<
		'slow' | 'normal' | 'fast'
	>('normal')
	const [rotation, setRotation] = useState(0)
	const [headsCount, setHeadsCount] = useState(0)
	const [tailsCount, setTailsCount] = useState(0)

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
	}, [])

	const updateCounts = (history: FlipResult[]) => {
		const heads = history.filter(h => h.result === 'heads').length
		const tails = history.filter(h => h.result === 'tails').length
		setHeadsCount(heads)
		setTailsCount(tails)
	}

	const flipCoin = () => {
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
	}

	const clearHistory = () => {
		setFlipHistory([])
		setHeadsCount(0)
		setTailsCount(0)
		localStorage.removeItem('coinFlipHistory')
		toast.success('History cleared')
	}

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
		<div className='max-w-6xl mx-auto space-y-8'>
			{/* Coin Settings */}
			<Card className='p-6'>
				<h3 className='font-semibold mb-4'>Coin Settings</h3>
				<div className='grid md:grid-cols-3 gap-4'>
					<div>
						<Label htmlFor='coin-type'>Coin Type</Label>
						<Select
							value={selectedCoin.id}
							onValueChange={value => {
								const coin = coinTypes.find(c => c.id === value)
								if (coin) setSelectedCoin(coin)
							}}
						>
							<SelectTrigger id='coin-type'>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{coinTypes.map(coin => (
									<SelectItem key={coin.id} value={coin.id}>
										<span className='flex items-center gap-2'>
											<span>{coin.headsIcon}</span>
											<span>{coin.name}</span>
										</span>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div>
						<Label htmlFor='animation-speed'>Animation Speed</Label>
						<Select
							value={animationSpeed}
							onValueChange={(value: 'slow' | 'normal' | 'fast') =>
								setAnimationSpeed(value)
							}
						>
							<SelectTrigger id='animation-speed'>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='slow'>Slow</SelectItem>
								<SelectItem value='normal'>Normal</SelectItem>
								<SelectItem value='fast'>Fast</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className='flex items-center justify-between'>
						<Label htmlFor='show-history'>Show History</Label>
						<Switch
							id='show-history'
							checked={showHistory}
							onCheckedChange={setShowHistory}
						/>
					</div>
				</div>
			</Card>

			{/* Coin Flip Area */}
			<Card className='p-8'>
				<div className='flex flex-col items-center space-y-8'>
					{/* 3D Coin */}
					<div className='relative w-48 h-48 perspective-1000'>
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
									'absolute inset-0 rounded-full flex items-center justify-center text-6xl font-bold shadow-2xl backface-hidden',
									'bg-gradient-to-br',
									selectedCoin.color,
									'text-white border-4 border-white/20'
								)}
								style={{ backfaceVisibility: 'hidden' }}
							>
								<div className='text-center'>
									<div className='text-7xl mb-2'>{selectedCoin.headsIcon}</div>
									<div className='text-lg font-semibold'>
										{selectedCoin.headsText}
									</div>
								</div>
							</div>

							{/* Tails Side */}
							<div
								className={cn(
									'absolute inset-0 rounded-full flex items-center justify-center text-6xl font-bold shadow-2xl backface-hidden',
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
									<div className='text-lg font-semibold'>
										{selectedCoin.tailsText}
									</div>
								</div>
							</div>
						</motion.div>
					</div>

					{/* Result Display */}
					<AnimatePresence mode='wait'>
						{currentResult && !isFlipping && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								className='text-center'
							>
								<h2 className='text-4xl font-bold mb-2'>
									{currentResult === 'heads'
										? selectedCoin.headsText
										: selectedCoin.tailsText}
								</h2>
								<p className='text-muted-foreground'>
									{currentResult === 'heads'
										? 'You got heads!'
										: 'You got tails!'}
								</p>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Flip Button */}
					<Button
						onClick={flipCoin}
						size='lg'
						disabled={isFlipping}
						className='min-w-[200px]'
					>
						<Coins
							className={cn('w-5 h-5 mr-2', isFlipping && 'animate-spin')}
						/>
						{isFlipping ? 'Flipping...' : 'Flip Coin'}
					</Button>
				</div>
			</Card>

			{/* Statistics */}
			<div className='grid md:grid-cols-2 gap-4'>
				<Card className='p-4'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							<div className='text-2xl'>{selectedCoin.headsIcon}</div>
							<div>
								<p className='font-semibold'>{selectedCoin.headsText}</p>
								<p className='text-sm text-muted-foreground'>
									{headsCount} flips
								</p>
							</div>
						</div>
						<Badge variant='secondary'>{headsPercentage}%</Badge>
					</div>
					<div className='mt-2 h-2 bg-muted rounded-full overflow-hidden'>
						<div
							className='h-full bg-primary transition-all'
							style={{ width: `${headsPercentage}%` }}
						/>
					</div>
				</Card>

				<Card className='p-4'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							<div className='text-2xl'>{selectedCoin.tailsIcon}</div>
							<div>
								<p className='font-semibold'>{selectedCoin.tailsText}</p>
								<p className='text-sm text-muted-foreground'>
									{tailsCount} flips
								</p>
							</div>
						</div>
						<Badge variant='secondary'>{tailsPercentage}%</Badge>
					</div>
					<div className='mt-2 h-2 bg-muted rounded-full overflow-hidden'>
						<div
							className='h-full bg-primary transition-all'
							style={{ width: `${tailsPercentage}%` }}
						/>
					</div>
				</Card>
			</div>

			{/* History */}
			{showHistory && flipHistory.length > 0 && (
				<Card className='p-6'>
					<div className='flex items-center justify-between mb-4'>
						<h3 className='font-semibold flex items-center gap-2'>
							<History className='w-4 h-4' />
							Flip History
						</h3>
						<Button onClick={clearHistory} variant='outline' size='sm'>
							<RotateCcw className='w-4 h-4 mr-1' />
							Clear
						</Button>
					</div>

					<div className='space-y-2 max-h-[300px] overflow-y-auto'>
						{flipHistory.map((flip, index) => (
							<div
								key={flip.id}
								className='flex items-center justify-between p-3 rounded-lg bg-muted/50'
							>
								<div className='flex items-center gap-3'>
									<Badge variant='outline' className='font-mono'>
										#{flipHistory.length - index}
									</Badge>
									<div className='text-2xl'>
										{flip.result === 'heads'
											? coinTypes.find(c => c.name === flip.coinType)
													?.headsIcon || selectedCoin.headsIcon
											: coinTypes.find(c => c.name === flip.coinType)
													?.tailsIcon || selectedCoin.tailsIcon}
									</div>
									<div>
										<p className='font-medium'>
											{flip.result === 'heads'
												? coinTypes.find(c => c.name === flip.coinType)
														?.headsText || 'Heads'
												: coinTypes.find(c => c.name === flip.coinType)
														?.tailsText || 'Tails'}
										</p>
										<p className='text-xs text-muted-foreground'>
											{flip.coinType}
										</p>
									</div>
								</div>
								<p className='text-sm text-muted-foreground'>
									{flip.timestamp.toLocaleTimeString()}
								</p>
							</div>
						))}
					</div>
				</Card>
			)}

			{/* Info Section */}
			<Card className='p-6 bg-muted/50'>
				<h3 className='font-semibold mb-3'>About Coin Flipping</h3>
				<div className='space-y-2 text-sm text-muted-foreground'>
					<p>
						This coin flip simulator uses cryptographically secure random number
						generation (crypto.getRandomValues) to ensure truly random results.
						Each flip has exactly 50% chance of landing on either side.
					</p>
					<p>
						The 3D animation simulates a realistic coin flip with customizable
						speed. Your flip history is saved locally in your browser for
						statistical analysis.
					</p>
					<p className='text-xs mt-4'>
						Perfect for making decisions, settling disputes, or any situation
						requiring a fair 50/50 chance. All flips are performed locally in
						your browser.
					</p>
				</div>
			</Card>
		</div>
	)
}

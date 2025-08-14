'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import {
	Dices,
	RotateCcw,
	History,
	TrendingUp,
	Copy,
	Check
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { DiceFace } from '@/components/tools/DiceFace'
import { KeyboardShortcutInfo } from '@/components/widgets'

interface DiceResult {
	id: string
	values: number[]
	total: number
	timestamp: Date
	diceCount: number
}

interface Statistics {
	totalRolls: number
	totalSum: number
	average: number
	distribution: Record<number, number>
	doubles: number
	triples: number
	totalDiceRolled: number
}

// Dice symbols removed - using DiceFace component instead

export default function DiceRollerPage() {
	const [mounted, setMounted] = useState(false)
	const [diceCount, setDiceCount] = useState(2)
	const [isRolling, setIsRolling] = useState(false)
	const [currentRoll, setCurrentRoll] = useState<number[]>([])
	const [rollHistory, setRollHistory] = useState<DiceResult[]>([])
	const [showHistory, setShowHistory] = useState(true)
	const [statistics, setStatistics] = useState<Statistics>({
		totalRolls: 0,
		totalSum: 0,
		average: 0,
		distribution: {},
		doubles: 0,
		triples: 0,
		totalDiceRolled: 0
	})
	const [copiedText, setCopiedText] = useState(false)

	useEffect(() => {
		setMounted(true)
		// Load history from localStorage
		const savedHistory = localStorage.getItem('diceRollHistory')
		if (savedHistory) {
			const parsed = JSON.parse(savedHistory).map((item: any) => ({
				...item,
				timestamp: new Date(item.timestamp)
			}))
			setRollHistory(parsed)
			updateStatistics(parsed)
		}
	}, [])

	const updateStatistics = (history: DiceResult[]) => {
		const stats: Statistics = {
			totalRolls: history.length,
			totalSum: 0,
			average: 0,
			distribution: {},
			doubles: 0,
			triples: 0,
			totalDiceRolled: 0
		}

		let totalDiceRolled = 0

		history.forEach(roll => {
			stats.totalSum += roll.total
			totalDiceRolled += roll.values.length

			// Update distribution
			roll.values.forEach(value => {
				stats.distribution[value] = (stats.distribution[value] || 0) + 1
			})

			// Check for doubles/triples
			const uniqueValues = new Set(roll.values)
			if (roll.values.length === 2 && uniqueValues.size === 1) {
				stats.doubles++
			} else if (roll.values.length === 3 && uniqueValues.size === 1) {
				stats.triples++
			}
		})

		stats.average = stats.totalRolls > 0 ? stats.totalSum / stats.totalRolls : 0
		// Store total dice rolled for percentage calculation
		stats.totalDiceRolled = totalDiceRolled

		setStatistics(stats)
	}

	const rollDice = () => {
		if (isRolling) return

		setIsRolling(true)

		// Generate random values
		const values: number[] = []
		for (let i = 0; i < diceCount; i++) {
			// Use crypto.getRandomValues for true randomness
			const randomArray = new Uint32Array(1)
			crypto.getRandomValues(randomArray)
			const randomValue = (randomArray[0] % 6) + 1
			values.push(randomValue)
		}

		// Animate rolling
		const animationDuration = 1000
		const intervalDuration = 50
		let elapsed = 0

		const interval = setInterval(() => {
			elapsed += intervalDuration

			// Show random values during animation
			const tempValues = Array.from(
				{ length: diceCount },
				() => Math.floor(Math.random() * 6) + 1
			)
			setCurrentRoll(tempValues)

			if (elapsed >= animationDuration) {
				clearInterval(interval)
				setCurrentRoll(values)
				setIsRolling(false)

				// Add to history
				const result: DiceResult = {
					id: crypto.randomUUID(),
					values,
					total: values.reduce((sum, val) => sum + val, 0),
					timestamp: new Date(),
					diceCount
				}

				const newHistory = [result, ...rollHistory].slice(0, 100)
				setRollHistory(newHistory)
				updateStatistics(newHistory)
				localStorage.setItem('diceRollHistory', JSON.stringify(newHistory))

				// Show result
				const isDoubles = values.length > 1 && new Set(values).size === 1
				if (isDoubles) {
					toast.success(
						`${values[0]}s! You rolled ${values.length} ${values[0]}s!`,
						{
							icon: '🎯'
						}
					)
				} else {
					toast.success(`Total: ${result.total}`, {
						description: `Rolled ${values.join(', ')}`
					})
				}
			}
		}, intervalDuration)
	}

	const clearHistory = () => {
		setRollHistory([])
		setStatistics({
			totalRolls: 0,
			totalSum: 0,
			average: 0,
			distribution: {},
			doubles: 0,
			triples: 0,
			totalDiceRolled: 0
		})
		localStorage.removeItem('diceRollHistory')
		toast.success('History cleared')
	}

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			// Space to roll dice
			if (e.code === 'Space' && !isRolling) {
				e.preventDefault()
				rollDice()
			}
			
			// Numbers 1-6 to set dice count
			const num = parseInt(e.key)
			if (num >= 1 && num <= 6) {
				setDiceCount(num)
			}
		}

		window.addEventListener('keydown', handleKeyPress)
		return () => window.removeEventListener('keydown', handleKeyPress)
	}, [isRolling])

	const copyResults = () => {
		if (currentRoll.length === 0) {
			toast.error('No dice rolled yet')
			return
		}

		const text = `🎲 Dice Roll: ${currentRoll.join(', ')} = ${currentRoll.reduce((a, b) => a + b, 0)}`
		navigator.clipboard.writeText(text)
		setCopiedText(true)
		toast.success('Copied to clipboard')
		setTimeout(() => setCopiedText(false), 2000)
	}

	const getDiceRotation = (value: number) => {
		// Поворачиваем кубик так, чтобы нужная грань оказалась спереди
		switch (value) {
			case 1:
				// Грань 1 уже спереди
				return { x: 0, y: 0 }
			case 2:
				// Грань 2 справа, поворачиваем влево на 270°
				return { x: 0, y: -90 }
			case 3:
				// Грань 3 сверху, поворачиваем вниз на 270°
				return { x: -90, y: 0 }
			case 4:
				// Грань 4 снизу, поворачиваем вверх на 90°
				return { x: 90, y: 0 }
			case 5:
				// Грань 5 слева, поворачиваем вправо на 90°
				return { x: 0, y: 90 }
			case 6:
				// Грань 6 сзади, поворачиваем на 180°
				return { x: 0, y: 180 }
			default:
				return { x: 0, y: 0 }
		}
	}

	if (!mounted) {
		return (
			<div className='max-w-6xl mx-auto space-y-8'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight mb-2'>
						Dice Roller
					</h1>
					<p className='text-muted-foreground'>
						Roll virtual dice with realistic 3D animation
					</p>
				</div>
				<div className='animate-pulse space-y-8'>
					<div className='h-96 bg-muted rounded-lg'></div>
				</div>
			</div>
		)
	}

	return (
		<div className='max-w-7xl mx-auto'>
			<div className='grid lg:grid-cols-3 gap-6'>
				{/* Main Gaming Area - Takes 2 columns on large screens */}
				<div className='lg:col-span-2 space-y-6'>
					{/* Dice Display and Controls */}
					<Card className='relative overflow-hidden'>
						<div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5' />
						<div className='relative p-8 space-y-8'>
							{/* Title and Quick Controls */}
							<div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
								<div className='text-center sm:text-left'>
									<h2 className='text-2xl font-bold'>Virtual Dice</h2>
									<p className='text-sm text-muted-foreground'>Click roll or press Space</p>
								</div>
								<div className='flex items-center gap-4'>
									{/* Dice Count Selector */}
									<div className='flex items-center gap-2'>
										{[1, 2, 3, 4, 5, 6].map(num => (
											<Button
												key={num}
												variant={diceCount === num ? 'default' : 'outline'}
												size='sm'
												onClick={() => setDiceCount(num)}
												className='w-8 h-8 p-0'
											>
												{num}
											</Button>
										))}
									</div>
								</div>
							</div>

							{/* 3D Dice Container - 3 per row */}
							<div className='grid grid-cols-3 gap-4 max-w-sm mx-auto'>
								{Array.from({ length: diceCount }, (_, i) => (
									<div key={i} className='relative'>
										<div className='w-24 h-24 perspective-1000'>
											<motion.div
												className='relative w-full h-full transform-style-3d'
												animate={
													isRolling
														? {
																rotateX: [0, 720],
																rotateY: [0, 720],
																rotateZ: [0, 360]
															}
														: currentRoll[i]
															? {
																	rotateX: getDiceRotation(currentRoll[i]).x,
																	rotateY: getDiceRotation(currentRoll[i]).y,
																	rotateZ: 0
																}
															: {}
												}
												transition={{
													duration: isRolling ? 1 : 0.3,
													repeat: isRolling ? Infinity : 0,
													ease: isRolling ? 'linear' : 'easeOut'
												}}
												style={{ transformStyle: 'preserve-3d' }}
											>
												{/* Dice Faces - каждая грань показывает соответствующее число */}
												{/* Face 1 - Front (1) */}
												<div
													className='absolute w-full h-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg text-black dark:text-white'
													style={{ transform: 'translateZ(48px)' }}
												>
													<DiceFace value={1} />
												</div>
												{/* Face 2 - Right (2) */}
												<div
													className='absolute w-full h-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg text-black dark:text-white'
													style={{ transform: 'rotateY(90deg) translateZ(48px)' }}
												>
													<DiceFace value={2} />
												</div>
												{/* Face 3 - Top (3) */}
												<div
													className='absolute w-full h-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg text-black dark:text-white'
													style={{ transform: 'rotateX(90deg) translateZ(48px)' }}
												>
													<DiceFace value={3} />
												</div>
												{/* Face 4 - Bottom (4) */}
												<div
													className='absolute w-full h-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg text-black dark:text-white'
													style={{
														transform: 'rotateX(-90deg) translateZ(48px)'
													}}
												>
													<DiceFace value={4} />
												</div>
												{/* Face 5 - Left (5) */}
												<div
													className='absolute w-full h-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg text-black dark:text-white'
													style={{
														transform: 'rotateY(-90deg) translateZ(48px)'
													}}
												>
													<DiceFace value={5} />
												</div>
												{/* Face 6 - Back (6) */}
												<div
													className='absolute w-full h-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg text-black dark:text-white'
													style={{
														transform: 'rotateY(180deg) translateZ(48px)'
													}}
												>
													<DiceFace value={6} />
												</div>
											</motion.div>
										</div>
									</div>
								))}
							</div>

							{/* Result Display */}
							<AnimatePresence mode='wait'>
								{currentRoll.length > 0 && !isRolling && (
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -20 }}
										className='text-center'
									>
										<div className='space-y-2'>
											<h2 className='text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'>
												{currentRoll.reduce((sum, val) => sum + val, 0)}
											</h2>
											<p className='text-sm text-muted-foreground'>
												{currentRoll.join(' + ')} = {currentRoll.reduce((sum, val) => sum + val, 0)}
											</p>
										</div>
									</motion.div>
								)}
							</AnimatePresence>

							{/* Roll Button */}
							<div className='flex justify-center gap-4'>
								<Button
									onClick={rollDice}
									size='lg'
									disabled={isRolling}
									className='min-w-[200px]'
								>
									<Dices
										className={cn('w-5 h-5 mr-2', isRolling && 'animate-spin')}
									/>
									{isRolling ? 'Rolling...' : 'Roll Dice'}
								</Button>
								<Button 
									onClick={copyResults} 
									size='lg' 
									variant='outline'
									disabled={currentRoll.length === 0}
								>
									{copiedText ? (
										<Check className='w-4 h-4' />
									) : (
										<Copy className='w-4 h-4' />
									)}
								</Button>
							</div>
						</div>
					</Card>
				</div>

				{/* Sidebar - Statistics and History */}
				<div className='space-y-6'>
					{/* Statistics */}
					<Card className='p-6'>
						<div className='space-y-6'>
							{/* Quick Stats */}
							<div>
								<div className='flex items-center gap-2 mb-4'>
									<TrendingUp className='w-5 h-5 text-primary' />
									<h3 className='font-semibold'>Statistics</h3>
								</div>
								<div className='grid grid-cols-2 gap-4'>
									<div className='text-center p-3 bg-muted/50 rounded-lg'>
										<p className='text-2xl font-bold'>{statistics.totalRolls}</p>
										<p className='text-xs text-muted-foreground'>Total Rolls</p>
									</div>
									<div className='text-center p-3 bg-muted/50 rounded-lg'>
										<p className='text-2xl font-bold'>{statistics.average.toFixed(1)}</p>
										<p className='text-xs text-muted-foreground'>Average</p>
									</div>
									{statistics.doubles > 0 && (
										<div className='text-center p-3 bg-muted/50 rounded-lg'>
											<p className='text-2xl font-bold'>{statistics.doubles}</p>
											<p className='text-xs text-muted-foreground'>Doubles</p>
										</div>
									)}
									{statistics.triples > 0 && (
										<div className='text-center p-3 bg-muted/50 rounded-lg'>
											<p className='text-2xl font-bold'>{statistics.triples}</p>
											<p className='text-xs text-muted-foreground'>Triples</p>
										</div>
									)}
								</div>
							</div>

							{/* Distribution */}
							<div>
								<h4 className='text-sm font-semibold mb-3'>Distribution</h4>
								<div className='grid grid-cols-3 gap-3'>
									{[1, 2, 3, 4, 5, 6].map(num => (
										<div key={num} className='text-center'>
											<div className='w-full aspect-square bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-black dark:text-white p-2'>
												<DiceFace value={num} />
											</div>
											<p className='text-sm font-medium mt-1'>
												{statistics.distribution[num] || 0}
											</p>
											{statistics.totalDiceRolled > 0 && (
												<p className='text-xs text-muted-foreground'>
													{(((statistics.distribution[num] || 0) / statistics.totalDiceRolled) * 100).toFixed(0)}%
												</p>
											)}
										</div>
									))}
								</div>
							</div>
						</div>
					</Card>

					{/* Keyboard Shortcuts */}
					<KeyboardShortcutInfo />

					{/* History */}
					{rollHistory.length > 0 && (
						<Card className='p-6'>
							<div className='flex items-center justify-between mb-4'>
								<h3 className='font-semibold flex items-center gap-2'>
									<History className='w-4 h-4' />
									Recent Rolls
								</h3>
								<div className='flex gap-2'>
									<Button 
										onClick={() => setShowHistory(!showHistory)} 
										variant='ghost' 
										size='sm'
									>
										{showHistory ? 'Hide' : 'Show'}
									</Button>
									<Button onClick={clearHistory} variant='ghost' size='sm'>
										<RotateCcw className='w-3 h-3' />
									</Button>
								</div>
							</div>

							{showHistory && (
								<div className='space-y-2 max-h-[400px] overflow-y-auto'>
									{rollHistory.slice(0, 20).map((roll, index) => (
										<div
											key={roll.id}
											className='flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors'
										>
											<div className='flex items-center gap-3'>
												<Badge variant='outline' className='text-xs'>
													#{rollHistory.length - index}
												</Badge>
												<div className='flex items-center gap-1'>
													{roll.values.map((value, i) => (
														<div key={i} className='w-8 h-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-black dark:text-white'>
															<DiceFace value={value} />
														</div>
													))}
												</div>
												<span className='font-medium'>= {roll.total}</span>
											</div>
											<p className='text-xs text-muted-foreground'>
												{roll.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
											</p>
										</div>
									))}
								</div>
							)}
						</Card>
					)}
				</div>
			</div>

		</div>
	)
}

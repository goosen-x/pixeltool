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
}

const diceSymbols = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅']

export default function DiceRollerPage() {
	const [mounted, setMounted] = useState(false)
	const [diceCount, setDiceCount] = useState(2)
	const [isRolling, setIsRolling] = useState(false)
	const [currentRoll, setCurrentRoll] = useState<number[]>([])
	const [rollHistory, setRollHistory] = useState<DiceResult[]>([])
	const [showHistory, setShowHistory] = useState(true)
	const [show3D, setShow3D] = useState(true)
	const [statistics, setStatistics] = useState<Statistics>({
		totalRolls: 0,
		totalSum: 0,
		average: 0,
		distribution: {},
		doubles: 0,
		triples: 0
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
			triples: 0
		}

		history.forEach(roll => {
			stats.totalSum += roll.total

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
			triples: 0
		})
		localStorage.removeItem('diceRollHistory')
		toast.success('History cleared')
	}

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
		switch (value) {
			case 1:
				return { x: 0, y: 0 }
			case 2:
				return { x: 0, y: 90 }
			case 3:
				return { x: -90, y: 0 }
			case 4:
				return { x: 90, y: 0 }
			case 5:
				return { x: 0, y: -90 }
			case 6:
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
		<div className='max-w-6xl mx-auto space-y-8'>
			{/* Settings */}
			<Card className='p-6'>
				<h3 className='font-semibold mb-4'>Settings</h3>
				<div className='space-y-4'>
					<div>
						<div className='flex items-center justify-between mb-2'>
							<Label htmlFor='dice-count'>Number of Dice: {diceCount}</Label>
							<Badge variant='secondary'>
								{diceCount} {diceCount === 1 ? 'die' : 'dice'}
							</Badge>
						</div>
						<Slider
							id='dice-count'
							min={1}
							max={6}
							step={1}
							value={[diceCount]}
							onValueChange={value => setDiceCount(value[0])}
							className='w-full'
						/>
					</div>

					<div className='flex items-center justify-between'>
						<Label htmlFor='show-3d'>3D Animation</Label>
						<Switch id='show-3d' checked={show3D} onCheckedChange={setShow3D} />
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

			{/* Dice Display */}
			<Card className='p-8'>
				<div className='flex flex-col items-center space-y-8'>
					{/* 3D Dice Container */}
					<div className='flex flex-wrap justify-center gap-4'>
						{Array.from({ length: diceCount }, (_, i) => (
							<div key={i} className='relative'>
								{show3D ? (
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
											{/* Dice Faces */}
											{/* Face 1 - Front */}
											<div
												className='absolute w-full h-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-6xl font-bold shadow-lg'
												style={{ transform: 'translateZ(48px)' }}
											>
												⚀
											</div>
											{/* Face 2 - Right */}
											<div
												className='absolute w-full h-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-6xl font-bold shadow-lg'
												style={{ transform: 'rotateY(90deg) translateZ(48px)' }}
											>
												⚁
											</div>
											{/* Face 3 - Top */}
											<div
												className='absolute w-full h-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-6xl font-bold shadow-lg'
												style={{ transform: 'rotateX(90deg) translateZ(48px)' }}
											>
												⚂
											</div>
											{/* Face 4 - Bottom */}
											<div
												className='absolute w-full h-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-6xl font-bold shadow-lg'
												style={{
													transform: 'rotateX(-90deg) translateZ(48px)'
												}}
											>
												⚃
											</div>
											{/* Face 5 - Left */}
											<div
												className='absolute w-full h-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-6xl font-bold shadow-lg'
												style={{
													transform: 'rotateY(-90deg) translateZ(48px)'
												}}
											>
												⚄
											</div>
											{/* Face 6 - Back */}
											<div
												className='absolute w-full h-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-6xl font-bold shadow-lg'
												style={{
													transform: 'rotateY(180deg) translateZ(48px)'
												}}
											>
												⚅
											</div>
										</motion.div>
									</div>
								) : (
									// 2D Fallback
									<motion.div
										className='w-24 h-24 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-6xl font-bold shadow-lg'
										animate={isRolling ? { rotate: 360 } : {}}
										transition={{
											duration: 1,
											repeat: isRolling ? Infinity : 0
										}}
									>
										{currentRoll[i] ? diceSymbols[currentRoll[i] - 1] : '?'}
									</motion.div>
								)}
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
								<div className='flex items-center gap-4 justify-center'>
									<div>
										<h2 className='text-4xl font-bold'>
											{currentRoll.reduce((sum, val) => sum + val, 0)}
										</h2>
										<p className='text-muted-foreground'>
											{currentRoll.join(' + ')} ={' '}
											{currentRoll.reduce((sum, val) => sum + val, 0)}
										</p>
									</div>
									<Button onClick={copyResults} size='icon' variant='outline'>
										{copiedText ? (
											<Check className='w-4 h-4' />
										) : (
											<Copy className='w-4 h-4' />
										)}
									</Button>
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Roll Button */}
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
				</div>
			</Card>

			{/* Statistics */}
			<div className='grid md:grid-cols-2 gap-4'>
				<Card className='p-4'>
					<div className='flex items-center gap-2 mb-3'>
						<TrendingUp className='w-5 h-5 text-primary' />
						<h3 className='font-semibold'>Statistics</h3>
					</div>
					<div className='space-y-2 text-sm'>
						<div className='flex justify-between'>
							<span className='text-muted-foreground'>Total Rolls:</span>
							<span className='font-medium'>{statistics.totalRolls}</span>
						</div>
						<div className='flex justify-between'>
							<span className='text-muted-foreground'>Average Roll:</span>
							<span className='font-medium'>
								{statistics.average.toFixed(2)}
							</span>
						</div>
						<div className='flex justify-between'>
							<span className='text-muted-foreground'>Doubles:</span>
							<span className='font-medium'>{statistics.doubles}</span>
						</div>
						{statistics.triples > 0 && (
							<div className='flex justify-between'>
								<span className='text-muted-foreground'>Triples:</span>
								<span className='font-medium'>{statistics.triples}</span>
							</div>
						)}
					</div>
				</Card>

				<Card className='p-4'>
					<h3 className='font-semibold mb-3'>Distribution</h3>
					<div className='grid grid-cols-6 gap-2'>
						{[1, 2, 3, 4, 5, 6].map(num => (
							<div key={num} className='text-center'>
								<div className='text-2xl mb-1'>{diceSymbols[num - 1]}</div>
								<div className='text-sm font-medium'>
									{statistics.distribution[num] || 0}
								</div>
								<div className='text-xs text-muted-foreground'>
									{statistics.totalRolls > 0
										? `${(((statistics.distribution[num] || 0) / (statistics.totalRolls * (statistics.totalSum / statistics.totalRolls / 3.5))) * 100).toFixed(0)}%`
										: '0%'}
								</div>
							</div>
						))}
					</div>
				</Card>
			</div>

			{/* History */}
			{showHistory && rollHistory.length > 0 && (
				<Card className='p-6'>
					<div className='flex items-center justify-between mb-4'>
						<h3 className='font-semibold flex items-center gap-2'>
							<History className='w-4 h-4' />
							Roll History
						</h3>
						<Button onClick={clearHistory} variant='outline' size='sm'>
							<RotateCcw className='w-4 h-4 mr-1' />
							Clear
						</Button>
					</div>

					<div className='space-y-2 max-h-[300px] overflow-y-auto'>
						{rollHistory.map((roll, index) => (
							<div
								key={roll.id}
								className='flex items-center justify-between p-3 rounded-lg bg-muted/50'
							>
								<div className='flex items-center gap-3'>
									<Badge variant='outline' className='font-mono'>
										#{rollHistory.length - index}
									</Badge>
									<div className='flex items-center gap-2'>
										{roll.values.map((value, i) => (
											<span key={i} className='text-2xl'>
												{diceSymbols[value - 1]}
											</span>
										))}
									</div>
									<div>
										<span className='font-medium'>= {roll.total}</span>
										{roll.values.length > 1 &&
											new Set(roll.values).size === 1 && (
												<Badge className='ml-2' variant='secondary'>
													{roll.values[0]}s!
												</Badge>
											)}
									</div>
								</div>
								<p className='text-sm text-muted-foreground'>
									{roll.timestamp.toLocaleTimeString()}
								</p>
							</div>
						))}
					</div>
				</Card>
			)}

			{/* Info Section */}
			<Card className='p-6 bg-muted/50'>
				<h3 className='font-semibold mb-3'>About This Dice Roller</h3>
				<div className='space-y-3 text-sm text-muted-foreground'>
					<p>
						This online dice roller provides elegant 3D animation for rolling up
						to 6 dice. The 3D animation is implemented using CSS3 transforms and
						works in modern browsers including Chrome, Edge, and Firefox. Older
						browsers will fall back to 2D animation.
					</p>
					<p>
						Numbers are generated using the native JavaScript
						crypto.getRandomValues() API, which provides cryptographically
						secure random numbers - the best way to ensure truly random dice
						rolls.
					</p>
					<div className='grid md:grid-cols-2 gap-4 mt-4'>
						<div>
							<h4 className='font-medium text-foreground mb-1'>
								Probability Facts
							</h4>
							<ul className='space-y-1 text-xs'>
								<li>• Rolling doubles with 2 dice: 16.67%</li>
								<li>• Rolling triples with 3 dice: 2.78%</li>
								<li>• Average roll per die: 3.5</li>
							</ul>
						</div>
						<div>
							<h4 className='font-medium text-foreground mb-1'>Dice Symbols</h4>
							<div className='flex items-center gap-2 text-2xl mt-2'>
								{diceSymbols.map((symbol, i) => (
									<span key={i} title={`${i + 1}`}>
										{symbol}
									</span>
								))}
							</div>
						</div>
					</div>
					<p className='text-xs mt-4'>
						This tool is provided &quot;as is&quot; without any warranties. Please follow
						local laws regarding online gaming. Good luck! 🎲
					</p>
				</div>
			</Card>
		</div>
	)
}

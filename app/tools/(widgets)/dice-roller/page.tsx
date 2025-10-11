'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

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
import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from 'recharts'
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig
} from '@/components/ui/chart'

import { useWidgetKeyboard } from '@/lib/hooks/useWidgetKeyboard'

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

	const updateStatistics = useCallback((history: DiceResult[]) => {
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
	}, [])

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
	}, [updateStatistics])

	const rollDice = useCallback(() => {
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
					toast.success(`Дубль ${values[0]} (${values.length} раз)!`, {
						icon: '🎯'
					})
				} else {
					toast.success(`Общий результат: ${result.total}`, {
						description: `Брошено: ${values.join(', ')}`
					})
				}
			}
		}, intervalDuration)
	}, [isRolling, diceCount, rollHistory, updateStatistics])

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
		toast.success('История очищена')
	}

	// Keyboard shortcuts
	const shortcuts = [
		{
			key: ' ',
			description: 'Roll Dice',
			action: rollDice,
			enabled: !isRolling
		},
		...Array.from({ length: 6 }, (_, i) => ({
			key: (i + 1).toString(),
			description: `Set ${i + 1} Dice`,
			action: () => setDiceCount(i + 1)
		}))
	]

	useWidgetKeyboard({
		widgetId: 'dice-roller',
		shortcuts
	})

	const copyResults = () => {
		if (currentRoll.length === 0) {
			toast.error('Нет брошенных костей для копирования')
			return
		}

		const text = `🎲 Dice Roll: ${currentRoll.join(', ')} = ${currentRoll.reduce((a, b) => a + b, 0)}`
		navigator.clipboard.writeText(text)
		setCopiedText(true)
		toast.success('Результаты скопированы в буфер обмена')
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
		<div className='max-w-7xl mx-auto space-y-6'>
			{/* Main Dice Card */}
			<Card className='relative overflow-hidden'>
				<div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5' />
				<div className='relative p-6 space-y-6'>
					{/* Dice Count Selector - Compact at top */}
					<div className='flex items-center justify-center gap-2'>
						<span className='text-sm font-medium mr-2'>Костей:</span>
						{[1, 2, 3, 4, 5, 6].map(num => (
							<Button
								key={num}
								variant={diceCount === num ? 'default' : 'outline'}
								size='icon'
								onClick={() => setDiceCount(num)}
								className='w-8 h-8'
							>
								{num}
							</Button>
						))}
					</div>

					{/* 3D Dice Container - Responsive grid */}
					<div
						className={cn(
							'grid gap-3 mx-auto',
							diceCount === 1 && 'grid-cols-1 max-w-[80px]',
							diceCount === 2 && 'grid-cols-2 max-w-[172px]',
							diceCount === 3 && 'grid-cols-3 max-w-[264px]',
							diceCount === 4 &&
								'grid-cols-2 md:grid-cols-4 max-w-[172px] md:max-w-[356px]',
							diceCount === 5 &&
								'grid-cols-3 md:grid-cols-5 max-w-[264px] md:max-w-[448px]',
							diceCount === 6 &&
								'grid-cols-3 md:grid-cols-6 max-w-[264px] md:max-w-[540px]'
						)}
					>
						{Array.from({ length: diceCount }, (_, i) => (
							<div key={i} className='relative'>
								<div className='w-20 h-20 perspective-1000'>
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
											style={{ transform: 'translateZ(40px)' }}
										>
											<DiceFace value={1} />
										</div>
										{/* Face 2 - Right (2) */}
										<div
											className='absolute w-full h-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg text-black dark:text-white'
											style={{
												transform: 'rotateY(90deg) translateZ(40px)'
											}}
										>
											<DiceFace value={2} />
										</div>
										{/* Face 3 - Top (3) */}
										<div
											className='absolute w-full h-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg text-black dark:text-white'
											style={{
												transform: 'rotateX(90deg) translateZ(40px)'
											}}
										>
											<DiceFace value={3} />
										</div>
										{/* Face 4 - Bottom (4) */}
										<div
											className='absolute w-full h-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg text-black dark:text-white'
											style={{
												transform: 'rotateX(-90deg) translateZ(40px)'
											}}
										>
											<DiceFace value={4} />
										</div>
										{/* Face 5 - Left (5) */}
										<div
											className='absolute w-full h-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg text-black dark:text-white'
											style={{
												transform: 'rotateY(-90deg) translateZ(40px)'
											}}
										>
											<DiceFace value={5} />
										</div>
										{/* Face 6 - Back (6) */}
										<div
											className='absolute w-full h-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg text-black dark:text-white'
											style={{
												transform: 'rotateY(180deg) translateZ(40px)'
											}}
										>
											<DiceFace value={6} />
										</div>
									</motion.div>
								</div>
							</div>
						))}
					</div>

					{/* Result Display and Controls in one row */}
					<div className='flex items-center justify-between gap-4'>
						{/* Result on left */}
						<AnimatePresence mode='wait'>
							{currentRoll.length > 0 && !isRolling ? (
								<motion.div
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.8 }}
									className='flex items-baseline gap-3'
								>
									<h2 className='text-4xl font-bold'>
										{currentRoll.reduce((sum, val) => sum + val, 0)}
									</h2>
									<p className='text-sm text-muted-foreground'>
										{currentRoll.join(' + ')}
									</p>
								</motion.div>
							) : (
								<div className='text-muted-foreground'>
									Нажмите, чтобы бросить кости
								</div>
							)}
						</AnimatePresence>

						{/* Buttons on right */}
						<div className='flex gap-2'>
							<Button onClick={rollDice} size='default' disabled={isRolling}>
								<Dices
									className={cn('w-4 h-4 mr-2', isRolling && 'animate-spin')}
								/>
								{isRolling ? 'Бросаем...' : 'Бросить'}
							</Button>
							<Button
								onClick={copyResults}
								size='icon'
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
				</div>
			</Card>

			{/* Stats and History Row */}
			<div className='grid lg:grid-cols-2 gap-6'>
				{/* Compact Statistics */}
				<Card className='flex flex-col'>
					<div className='px-5 pt-5 pb-0'>
						<div className='flex items-center gap-2 mb-4'>
							<TrendingUp className='w-4 h-4 text-primary' />
							<h3 className='font-medium'>Статистика</h3>
						</div>

						{/* Stats Grid */}
						<div className='grid grid-cols-4 gap-3 mb-4'>
							<div className='text-center'>
								<p className='text-xl font-bold'>{statistics.totalRolls}</p>
								<p className='text-xs text-muted-foreground'>Броски</p>
							</div>
							<div className='text-center'>
								<p className='text-xl font-bold'>
									{statistics.average.toFixed(1)}
								</p>
								<p className='text-xs text-muted-foreground'>Среднее</p>
							</div>
							{statistics.doubles > 0 && (
								<div className='text-center'>
									<p className='text-xl font-bold'>{statistics.doubles}</p>
									<p className='text-xs text-muted-foreground'>2x</p>
								</div>
							)}
							{statistics.triples > 0 && (
								<div className='text-center'>
									<p className='text-xl font-bold'>{statistics.triples}</p>
									<p className='text-xs text-muted-foreground'>3x</p>
								</div>
							)}
						</div>
					</div>

					{/* Pie Chart */}
					<div className='flex-1 pb-0'>
						{statistics.totalDiceRolled > 0 ? (
							<div className='relative'>
								<ResponsiveContainer width='100%' height={200}>
									<PieChart>
										<Pie
											data={[1, 2, 3, 4, 5, 6].map(num => ({
												name: num,
												value: statistics.distribution[num] || 0,
												percentage:
													statistics.totalDiceRolled > 0
														? Math.round(
																((statistics.distribution[num] || 0) /
																	statistics.totalDiceRolled) *
																	100
															)
														: 0
											}))}
											dataKey='value'
											nameKey='name'
											cx='50%'
											cy='50%'
											innerRadius={40}
											outerRadius={70}
											label={({ name, percentage }) =>
												percentage > 0 ? `${percentage}%` : ''
											}
											labelLine={false}
										>
											{[1, 2, 3, 4, 5, 6].map((num, index) => (
												<Cell
													key={`cell-${index}`}
													fill={`hsl(var(--chart-${num}))`}
												/>
											))}
										</Pie>
										<ChartTooltip
											content={({ active, payload }) => {
												if (active && payload && payload.length) {
													const data = payload[0]
													const diceSymbols = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅']
													return (
														<div className='rounded-lg border bg-background p-3 shadow-md'>
															<div className='flex items-center gap-3'>
																<div
																	className='w-12 h-12 rounded-lg shadow-sm flex items-center justify-center text-white text-3xl'
																	style={{
																		backgroundColor: `hsl(var(--chart-${data.name}))`
																	}}
																>
																	{diceSymbols[(data.name as number) - 1]}
																</div>
																<div>
																	<p className='font-semibold text-base'>
																		{data.value} бросков
																	</p>
																	<p className='text-sm text-muted-foreground'>
																		{data.payload.percentage}%
																	</p>
																</div>
															</div>
														</div>
													)
												}
												return null
											}}
										/>
									</PieChart>
								</ResponsiveContainer>
							</div>
						) : (
							<div className='h-[200px] flex items-center justify-center'>
								<p className='text-sm text-muted-foreground'>Пока нет данных</p>
							</div>
						)}
					</div>

					{/* Distribution Numbers */}
					<div className='px-5 pb-5'>
						<div className='flex items-center justify-between gap-2'>
							{[1, 2, 3, 4, 5, 6].map(num => {
								const diceSymbols = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅']
								return (
									<div key={num} className='text-center flex-1'>
										<div
											className='w-12 h-12 mx-auto mb-2 rounded-lg shadow-sm flex items-center justify-center text-white text-3xl'
											style={{ backgroundColor: `hsl(var(--chart-${num}))` }}
										>
											{diceSymbols[num - 1]}
										</div>
										<p className='text-sm font-semibold'>
											{statistics.distribution[num] || 0}
										</p>
										{statistics.totalDiceRolled > 0 && (
											<p className='text-xs text-muted-foreground font-medium'>
												{(
													((statistics.distribution[num] || 0) /
														statistics.totalDiceRolled) *
													100
												).toFixed(0)}
												%
											</p>
										)}
									</div>
								)
							})}
						</div>
					</div>
				</Card>

				{/* Compact History */}
				<Card className='p-5'>
					<div className='flex items-center justify-between mb-3'>
						<h3 className='font-medium flex items-center gap-2'>
							<History className='w-4 h-4' />
							История
						</h3>
						{rollHistory.length > 0 && (
							<Button
								onClick={clearHistory}
								variant='ghost'
								size='icon'
								className='h-8 w-8'
							>
								<RotateCcw className='w-3 h-3' />
							</Button>
						)}
					</div>

					{rollHistory.length > 0 ? (
						<div className='space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700'>
							{rollHistory.map((roll, index) => {
								const diceSymbols = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅']
								return (
									<div
										key={roll.id}
										className='flex items-center justify-between p-2 rounded bg-muted/30 text-sm hover:bg-muted/40 transition-colors'
									>
										<div className='flex items-center gap-2'>
											<span className='text-xs text-muted-foreground font-medium'>
												#{rollHistory.length - index}
											</span>
											<div className='flex items-center gap-0.5'>
												{roll.values.map((value, i) => (
													<span key={i} className='text-2xl'>
														{diceSymbols[value - 1]}
													</span>
												))}
											</div>
											<span className='font-semibold ml-1'>= {roll.total}</span>
										</div>
										<span className='text-xs text-muted-foreground'>
											{roll.timestamp.toLocaleTimeString([], {
												hour: '2-digit',
												minute: '2-digit'
											})}
										</span>
									</div>
								)
							})}
						</div>
					) : (
						<div className='text-center py-8 text-muted-foreground text-sm'>
							Пока нет бросков
						</div>
					)}
				</Card>
			</div>
		</div>
	)
}

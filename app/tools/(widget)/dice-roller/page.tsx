'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dices, RotateCcw, Copy, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import { DiceFace } from '@/components/tools/DiceFace'

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
	}

	const copyResults = () => {
		if (currentRoll.length === 0) return

		const total = currentRoll.reduce((a, b) => a + b, 0)
		navigator.clipboard.writeText(`${currentRoll.join(', ')} = ${total}`)
		setCopiedText(true)
		setTimeout(() => setCopiedText(false), 2000)
	}

	if (!mounted) {
		return (
			<Card className='overflow-hidden p-0'>
				<div className='h-14 border-b bg-muted/30' />
				<div className='h-72 animate-pulse bg-muted/20' />
			</Card>
		)
	}

	const currentTotal = currentRoll.reduce((sum, value) => sum + value, 0)

	return (
		<>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: сколько костей бросаем. */}
				<div className={toolBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						<span className='mr-1 text-sm text-muted-foreground'>Костей</span>
						{[1, 2, 3, 4, 5, 6].map(num => (
							<button
								key={num}
								type='button'
								onClick={() => setDiceCount(num)}
								aria-pressed={diceCount === num}
								className={toolPill(diceCount === num, 'font-mono')}
							>
								{num}
							</button>
						))}
					</div>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={copyResults}
							disabled={currentRoll.length === 0}
							title='Скопировать результат'
							className={toolIconButton}
						>
							{copiedText ? (
								<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
							) : (
								<Copy className='h-4 w-4' />
							)}
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={clearHistory}
							disabled={rollHistory.length === 0}
							title='Очистить историю'
							className={toolIconButton}
						>
							<RotateCcw className='h-4 w-4' />
						</Button>
					</div>
				</div>

				<div className='flex flex-col items-center gap-6 px-5 py-8 sm:px-6'>
					<div className='flex flex-wrap items-center justify-center gap-3'>
						{Array.from({ length: diceCount }, (_, index) => (
							<motion.div
								key={index}
								animate={
									isRolling ? { rotate: [0, 12, -12, 0] } : { rotate: 0 }
								}
								transition={{
									duration: 0.35,
									repeat: isRolling ? Infinity : 0
								}}
								className='flex h-20 w-20 items-center justify-center rounded-xl border bg-background'
							>
								<DiceFace
									value={currentRoll[index] || 1}
									className='h-14 w-14'
								/>
							</motion.div>
						))}
					</div>

					<p className='h-9 font-mono text-3xl tabular-nums'>
						{currentRoll.length > 0 && !isRolling ? currentTotal : ''}
					</p>

					<Button
						onClick={rollDice}
						disabled={isRolling}
						className='cursor-pointer gap-2'
					>
						<Dices className={cn('h-4 w-4', isRolling && 'animate-spin')} />
						{isRolling ? 'Бросаем…' : 'Бросить'}
					</Button>
				</div>

				{/* Полоса статистики: она копится по всем броскам и объясняет,
				    насколько ровно ложатся грани. Раньше ради этого рисовалась
				    круговая диаграмма на recharts. */}
				{statistics.totalRolls > 0 && (
					<div className={toolFooterBar}>
						<span className='flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground'>
							<span>
								бросков{' '}
								<span className='font-mono text-foreground'>
									{statistics.totalRolls}
								</span>
							</span>
							<span>
								среднее{' '}
								<span className='font-mono text-foreground'>
									{statistics.average.toFixed(1)}
								</span>
							</span>
							{statistics.doubles > 0 && (
								<span>
									дублей{' '}
									<span className='font-mono text-foreground'>
										{statistics.doubles}
									</span>
								</span>
							)}
						</span>

						<span className='flex flex-wrap items-center gap-3 sm:ml-auto'>
							{[1, 2, 3, 4, 5, 6].map(value => {
								const count = statistics.distribution[value] || 0
								const share = statistics.totalDiceRolled
									? Math.round((count / statistics.totalDiceRolled) * 100)
									: 0
								return (
									<span
										key={value}
										title={`Грань ${value}: ${count} раз, ${share}%`}
										className='flex items-center gap-1 text-sm text-muted-foreground'
									>
										<span className='font-mono text-foreground'>{value}</span>
										<span className='font-mono text-xs'>{share}%</span>
									</span>
								)
							})}
						</span>
					</div>
				)}
			</Card>

			<div className='mt-6 space-y-3 text-sm text-muted-foreground'>
				<p>
					Грани выпадают по crypto.getRandomValues — источнику случайности
					операционной системы. Тряска кубиков только показывает, что бросок
					идёт, и на результат не влияет.
				</p>
				<p>
					Распределение по граням выравнивается медленно: на двадцати бросках
					перекос в полтора раза — норма, а не поломка кубика. Ровные 16—17% на
					каждой грани появляются на сотнях бросков.
				</p>
			</div>
		</>
	)
}

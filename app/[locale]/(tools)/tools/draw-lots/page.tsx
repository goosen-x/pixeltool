'use client'

import { useState, useEffect } from 'react'
import { Shuffle, RotateCcw, Edit2, Check, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface Lot {
	id: string
	value: string
	isRevealed: boolean
	order: number
}

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
	const newArray = [...array]
	for (let i = newArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
	}
	return newArray
}

export default function DrawLotsPage() {
	const [mounted, setMounted] = useState(false)
	const [inputText, setInputText] = useState(
		'Option 1\nOption 2\nOption 3\nOption 4\nOption 5'
	)
	const [pageTitle, setPageTitle] = useState('Draw Lots')
	const [isEditingTitle, setIsEditingTitle] = useState(false)
	const [tempTitle, setTempTitle] = useState(pageTitle)
	const [lots, setLots] = useState<Lot[]>([])
	const [isDrawing, setIsDrawing] = useState(false)
	const [selectedLot, setSelectedLot] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		setMounted(true)
	}, [])

	const startDrawing = () => {
		const lines = inputText
			.trim()
			.split('\n')
			.filter(line => line.trim() !== '')

		if (lines.length === 0) {
			setError('Please enter at least one item')
			return
		}

		if (lines.length > 100) {
			setError('Maximum 100 items allowed')
			return
		}

		setError(null)
		setSelectedLot(null)

		// Create lot objects with random order
		const lotObjects: Lot[] = lines.map((value, index) => ({
			id: crypto.randomUUID(),
			value: value.trim(),
			isRevealed: false,
			order: index
		}))

		// Shuffle the lots
		const shuffledLots = shuffleArray(lotObjects)
		setLots(shuffledLots)
		setIsDrawing(true)
	}

	const revealLot = (lotId: string) => {
		if (selectedLot) return // Only one lot can be selected

		setLots(prev =>
			prev.map(lot => (lot.id === lotId ? { ...lot, isRevealed: true } : lot))
		)

		const lot = lots.find(l => l.id === lotId)
		if (lot) {
			setSelectedLot(lot.value)
		}
	}

	const reset = () => {
		setLots([])
		setIsDrawing(false)
		setSelectedLot(null)
		setError(null)
	}

	const saveTitle = () => {
		setPageTitle(tempTitle.trim() || 'Draw Lots')
		setIsEditingTitle(false)
	}

	const cancelEditTitle = () => {
		setTempTitle(pageTitle)
		setIsEditingTitle(false)
	}

	if (!mounted) {
		return (
			<div className='max-w-6xl mx-auto space-y-8'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight mb-2'>Draw Lots</h1>
					<p className='text-muted-foreground'>
						Random selection made easy - draw straws digitally
					</p>
				</div>
				<div className='animate-pulse space-y-8'>
					<div className='h-64 bg-muted rounded-lg'></div>
				</div>
			</div>
		)
	}

	return (
		<div className='max-w-6xl mx-auto space-y-8'>
			{!isDrawing ? (
				<>
					{/* Input Section */}
					<Card className='p-6'>
						<Label
							htmlFor='items'
							className='text-base font-semibold mb-2 block'
						>
							Enter Items (one per line)
						</Label>
						<Textarea
							id='items'
							value={inputText}
							onChange={e => setInputText(e.target.value)}
							placeholder='Enter items to draw from...'
							className='min-h-[200px] font-mono'
							spellCheck={false}
						/>
						<p className='text-sm text-muted-foreground mt-2'>
							Enter each item on a new line. Maximum 100 items.
						</p>

						{error && (
							<Alert variant='destructive' className='mt-4'>
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<Button onClick={startDrawing} className='w-full mt-4' size='lg'>
							<Shuffle className='w-4 h-4 mr-2' />
							Start Drawing
						</Button>
					</Card>

					{/* Instructions */}
					<Card className='p-6 bg-muted/50'>
						<h3 className='font-semibold mb-3'>How to Use</h3>
						<ol className='space-y-2 text-sm text-muted-foreground'>
							<li>1. Enter items (names, options, tasks, etc.) one per line</li>
							<li>2. Click &quot;Start Drawing&quot; to create randomized cards</li>
							<li>3. Click any card to reveal what was drawn</li>
							<li>4. Only one card can be selected per draw</li>
						</ol>
					</Card>
				</>
			) : (
				<>
					{/* Drawing Area */}
					<Card className='p-6'>
						{selectedLot ? (
							<div className='text-center py-12'>
								<h2 className='text-2xl font-semibold mb-4'>Selected:</h2>
								<div className='bg-primary text-primary-foreground rounded-lg p-8 max-w-md mx-auto'>
									<p className='text-3xl font-bold'>{selectedLot}</p>
								</div>
								<Button onClick={reset} className='mt-8' variant='outline'>
									<RotateCcw className='w-4 h-4 mr-2' />
									Draw Again
								</Button>
							</div>
						) : (
							<>
								<h3 className='text-lg font-semibold mb-4'>
									Click a card to draw
								</h3>
								<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
									<AnimatePresence>
										{lots.map((lot, index) => (
											<motion.div
												key={lot.id}
												initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
												animate={{ opacity: 1, scale: 1, rotateY: 0 }}
												exit={{ opacity: 0, scale: 0.8 }}
												transition={{
													delay: index * 0.05,
													duration: 0.3,
													type: 'spring',
													stiffness: 300
												}}
											>
												<button
													onClick={() => revealLot(lot.id)}
													disabled={lot.isRevealed || selectedLot !== null}
													className={cn(
														'relative w-full aspect-[3/4] rounded-lg transition-all duration-300 transform-gpu',
														'hover:scale-105 hover:shadow-lg',
														'focus:outline-none focus:ring-2 focus:ring-primary',
														lot.isRevealed
															? 'cursor-default'
															: 'cursor-pointer hover:shadow-xl',
														selectedLot && !lot.isRevealed && 'opacity-50'
													)}
													style={{
														transformStyle: 'preserve-3d',
														perspective: '1000px'
													}}
												>
													<div
														className={cn(
															'absolute inset-0 rounded-lg transition-transform duration-500',
															'backface-hidden',
															lot.isRevealed && 'rotate-y-180'
														)}
														style={{
															transform: lot.isRevealed
																? 'rotateY(180deg)'
																: 'rotateY(0deg)',
															backfaceVisibility: 'hidden'
														}}
													>
														{/* Card Back */}
														<div className='w-full h-full bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center'>
															<div className='text-primary-foreground'>
																<div className='text-4xl font-bold mb-2'>?</div>
																<div className='text-sm opacity-80'>
																	Click to draw
																</div>
															</div>
														</div>
													</div>

													<div
														className={cn(
															'absolute inset-0 rounded-lg transition-transform duration-500',
															'backface-hidden',
															!lot.isRevealed && 'rotate-y-180'
														)}
														style={{
															transform: lot.isRevealed
																? 'rotateY(0deg)'
																: 'rotateY(-180deg)',
															backfaceVisibility: 'hidden'
														}}
													>
														{/* Card Front */}
														<div className='w-full h-full bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center p-4'>
															<p className='text-white font-semibold text-center break-words'>
																{lot.value}
															</p>
														</div>
													</div>
												</button>
											</motion.div>
										))}
									</AnimatePresence>
								</div>

								<Button
									onClick={reset}
									className='mt-6'
									variant='outline'
									size='sm'
								>
									<RotateCcw className='w-4 h-4 mr-2' />
									Reset
								</Button>
							</>
						)}
					</Card>
				</>
			)}

			{/* About Section */}
			<Card className='p-6 bg-muted/50'>
				<h3 className='font-semibold mb-3'>About This Tool</h3>
				<div className='space-y-2 text-sm text-muted-foreground'>
					<p>
						This digital draw lots tool simulates the traditional method of
						drawing straws or picking papers from a hat. It uses the
						Fisher-Yates shuffle algorithm to ensure truly random results.
					</p>
					<p>
						Perfect for making fair decisions, selecting winners, assigning
						tasks, or any situation where you need an unbiased random selection.
					</p>
					<p className='text-xs mt-4'>
						This tool is provided &quot;as is&quot; without warranties. Please follow
						local laws and regulations. Users are responsible for their use of
						this tool.
					</p>
				</div>
			</Card>
		</div>
	)
}

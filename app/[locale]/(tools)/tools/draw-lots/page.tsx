'use client'

import { useState, useEffect, useCallback } from 'react'
import { Shuffle, RotateCcw } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'

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
	const t = useTranslations('widgets.drawLots')
	const [mounted, setMounted] = useState(false)
	const [inputText, setInputText] = useState(
		'Option 1\nOption 2\nOption 3\nOption 4\nOption 5'
	)
	const [lots, setLots] = useState<Lot[]>([])
	const [isDrawing, setIsDrawing] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		setMounted(true)
	}, [])

	const startDrawing = useCallback(() => {
		const lines = inputText
			.trim()
			.split('\n')
			.filter(line => line.trim() !== '')

		if (lines.length === 0) {
			setError(t('errors.empty'))
			return
		}

		if (lines.length > 100) {
			setError(t('errors.tooMany'))
			return
		}

		setError(null)

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
	}, [inputText])

	const revealLot = useCallback((lotId: string) => {
		setLots(prev =>
			prev.map(lot => (lot.id === lotId ? { ...lot, isRevealed: true } : lot))
		)
	}, [])

	const reset = useCallback(() => {
		setLots([])
		setIsDrawing(false)
		setError(null)
	}, [])

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			// Space to draw card
			if (e.code === 'Space' && !isDrawing) {
				e.preventDefault()
				startDrawing()
			}
			// Enter to reveal a random card (if cards are available)
			if (e.key === 'Enter' && isDrawing && lots.length > 0) {
				e.preventDefault()
				const availableLots = lots.filter(lot => !lot.isRevealed)
				if (availableLots.length > 0) {
					const randomLot =
						availableLots[Math.floor(Math.random() * availableLots.length)]
					revealLot(randomLot.id)
				}
			}
			// Ctrl/Cmd + R to reset
			if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
				e.preventDefault()
				reset()
			}
		}

		window.addEventListener('keydown', handleKeyPress)
		return () => window.removeEventListener('keydown', handleKeyPress)
	}, [isDrawing, lots, startDrawing, revealLot, reset])

	if (!mounted) {
		return null
	}

	return (
		<div className='space-y-6'>
			{!isDrawing ? (
				<>
					{/* Input Section */}
					<Card className='p-6'>
						<Label
							htmlFor='items'
							className='text-base font-semibold mb-2 block'
						>
							{t('inputLabel')}
						</Label>
						<Textarea
							id='items'
							value={inputText}
							onChange={e => setInputText(e.target.value)}
							placeholder={t('inputPlaceholder')}
							className='min-h-[200px] font-mono'
							spellCheck={false}
						/>
						<p className='text-sm text-muted-foreground mt-2'>
							{t('inputHint')}
						</p>

						{error && (
							<Alert variant='destructive' className='mt-4'>
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<Button onClick={startDrawing} className='w-full mt-4' size='lg'>
							<Shuffle className='w-4 h-4 mr-2' />
							{t('startDrawing')}
						</Button>
					</Card>

					{/* Instructions */}
					<Card className='p-6 bg-muted/50'>
						<h3 className='font-semibold mb-3'>{t('howToUse.title')}</h3>
						<ol className='space-y-2 text-sm text-muted-foreground'>
							<li>{t('howToUse.step1')}</li>
							<li>{t('howToUse.step2')}</li>
							<li>{t('howToUse.step3')}</li>
							<li>{t('howToUse.step4')}</li>
						</ol>
					</Card>
				</>
			) : (
				<>
					{/* Drawing Area */}
					<Card className='p-6'>
						<div className='flex items-center justify-between mb-4'>
							<h3 className='text-lg font-semibold'>{t('clickToReveal')}</h3>
							<Button onClick={reset} variant='outline' size='sm'>
								<RotateCcw className='w-4 h-4 mr-2' />
								{t('reset')}
							</Button>
						</div>

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
											disabled={lot.isRevealed}
											className={cn(
												'relative w-full aspect-[3/4] rounded-lg transition-all duration-300 transform-gpu',
												'hover:scale-105 hover:shadow-lg',
												'focus:outline-none focus:ring-2 focus:ring-primary',
												lot.isRevealed
													? 'cursor-default'
													: 'cursor-pointer hover:shadow-xl'
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
															{t('clickToDraw')}
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
													<div className='text-center'>
														<p className='text-white font-bold text-lg break-words'>
															{lot.value}
														</p>
														<div className='mt-2 text-white/80 text-sm'>
															{t('selected')}
														</div>
													</div>
												</div>
											</div>
										</button>
									</motion.div>
								))}
							</AnimatePresence>
						</div>

						{lots.filter(lot => lot.isRevealed).length > 0 && (
							<div className='mt-6 p-4 bg-muted rounded-lg'>
								<h4 className='font-medium mb-2'>{t('revealed')}</h4>
								<div className='flex flex-wrap gap-2'>
									{lots
										.filter(lot => lot.isRevealed)
										.map(lot => (
											<Badge key={lot.id} variant='secondary'>
												{lot.value}
											</Badge>
										))}
								</div>
							</div>
						)}
					</Card>
				</>
			)}

			{/* About Section */}
			<Card className='p-6 bg-muted/50'>
				<h3 className='font-semibold mb-3'>{t('about.title')}</h3>
				<div className='space-y-2 text-sm text-muted-foreground'>
					<p>{t('about.description')}</p>
					<p>{t('about.useCases')}</p>
					<p className='text-xs mt-4'>{t('about.disclaimer')}</p>
				</div>
			</Card>
		</div>
	)
}

'use client'

import { useState, useEffect } from 'react'
import { Dices, Copy, Check, Download, History, Shuffle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useTranslations } from 'next-intl'

interface GeneratedResult {
	numbers: number[]
	timestamp: Date
	id: string
}

// Use crypto API for cryptographically secure random numbers
function getSecureRandomNumber(min: number, max: number): number {
	const range = max - min + 1
	const bytesNeeded = Math.ceil(Math.log2(range) / 8)
	const maxValid = Math.floor(256 ** bytesNeeded / range) * range

	let randomValue
	do {
		const randomBytes = new Uint8Array(bytesNeeded)
		crypto.getRandomValues(randomBytes)
		randomValue = randomBytes.reduce((acc, byte, i) => acc + byte * 256 ** i, 0)
	} while (randomValue >= maxValid)

	return min + (randomValue % range)
}

function generateRandomNumbers(
	min: number,
	max: number,
	count: number,
	unique: boolean
): number[] {
	if (unique && count > max - min + 1) {
		throw new Error('Cannot generate more unique numbers than the range allows')
	}

	const numbers: number[] = []
	const usedNumbers = new Set<number>()

	for (let i = 0; i < count; i++) {
		let num: number
		do {
			num = getSecureRandomNumber(min, max)
		} while (unique && usedNumbers.has(num))

		numbers.push(num)
		if (unique) {
			usedNumbers.add(num)
		}
	}

	return numbers
}

export default function RandomNumberGeneratorPage() {
	const t = useTranslations('widgets.randomNumberGenerator')
	const [min, setMin] = useState(1)
	const [max, setMax] = useState(10)
	const [count, setCount] = useState(5)
	const [unique, setUnique] = useState(true)
	const [results, setResults] = useState<GeneratedResult[]>([])
	const [error, setError] = useState<string | null>(null)
	const [copiedId, setCopiedId] = useState<string | null>(null)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
		// Generate initial result
		handleGenerate()
	}, [])

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			// Ctrl/Cmd + G to generate
			if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
				e.preventDefault()
				handleGenerate()
			}
			// Ctrl/Cmd + R to regenerate
			if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
				e.preventDefault()
				handleGenerate()
			}
			// Ctrl/Cmd + Shift + C to copy latest result
			if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
				e.preventDefault()
				if (results[0]) {
					copyToClipboard(results[0].numbers, results[0].id)
				}
			}
			// Ctrl/Cmd + D to download
			if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
				e.preventDefault()
				if (results.length > 0) {
					downloadResults()
				}
			}
			// U to toggle unique
			if (e.key === 'u' || e.key === 'U') {
				if (document.activeElement?.tagName !== 'INPUT') {
					e.preventDefault()
					setUnique(!unique)
				}
			}
		}

		window.addEventListener('keydown', handleKeyPress)
		return () => window.removeEventListener('keydown', handleKeyPress)
	}, [results, unique])

	const validate = (): string | null => {
		if (min < 0 || min > 999999) {
			return t('validation.minRange')
		}
		if (max < 0 || max > 999999) {
			return t('validation.maxRange')
		}
		if (min > max) {
			return t('validation.minGreaterThanMax')
		}
		if (count < 1 || count > 1000) {
			return t('validation.countRange')
		}
		if (unique && count > max - min + 1) {
			return t('validation.uniqueCount', { count, min, max })
		}
		return null
	}

	const handleGenerate = () => {
		const validationError = validate()
		if (validationError) {
			setError(validationError)
			return
		}

		setError(null)
		try {
			const numbers = generateRandomNumbers(min, max, count, unique)
			const newResult: GeneratedResult = {
				numbers,
				timestamp: new Date(),
				id: crypto.randomUUID()
			}
			setResults([newResult, ...results.slice(0, 9)]) // Keep last 10 results
		} catch (err) {
			setError(
				err instanceof Error ? err.message : t('validation.generationFailed')
			)
		}
	}

	const copyToClipboard = async (numbers: number[], id: string) => {
		try {
			await navigator.clipboard.writeText(numbers.join('    '))
			setCopiedId(id)
			toast.success(t('toast.copied'))
			setTimeout(() => setCopiedId(null), 2000)
		} catch (err) {
			toast.error(t('toast.copyFailed'))
		}
	}

	const downloadResults = () => {
		const content = results
			.map(
				result =>
					`${result.numbers.join('\t')}\t${result.timestamp.toLocaleString()}`
			)
			.join('\n')

		const blob = new Blob([content], { type: 'text/plain' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `random-numbers-${new Date().toISOString().split('T')[0]}.txt`
		a.click()
		URL.revokeObjectURL(url)
		toast.success(t('toast.downloaded'))
	}

	if (!mounted) {
		return null
	}

	const latestResult = results[0]

	return (
		<div className='w-full space-y-6'>
			{/* Combined Settings & Results Card */}
			<Card className='p-4 sm:p-6'>
				{/* Compact Settings Row */}
				<div className='space-y-4'>
					<div className='flex flex-wrap items-center gap-2 sm:gap-3'>
						<div className='flex items-center gap-1.5'>
							<label className='text-xs font-medium text-muted-foreground'>
								{t('inputs.minimum.label')}
							</label>
							<Input
								type='number'
								value={min}
								onChange={e => setMin(parseInt(e.target.value) || 0)}
								min={0}
								max={999999}
								className='w-20 h-8 text-sm'
								placeholder='1'
							/>
						</div>

						<div className='flex items-center gap-1.5'>
							<label className='text-xs font-medium text-muted-foreground'>
								{t('inputs.maximum.label')}
							</label>
							<Input
								type='number'
								value={max}
								onChange={e => setMax(parseInt(e.target.value) || 0)}
								min={0}
								max={999999}
								className='w-20 h-8 text-sm'
								placeholder='10'
							/>
						</div>

						<div className='flex items-center gap-1.5'>
							<label className='text-xs font-medium text-muted-foreground'>
								{t('inputs.count.label')}
							</label>
							<Input
								type='number'
								value={count}
								onChange={e => setCount(parseInt(e.target.value) || 1)}
								min={1}
								max={1000}
								className='w-20 h-8 text-sm'
								placeholder='5'
							/>
						</div>

						<div className='flex items-center gap-1.5 ml-auto'>
							<Switch
								id='unique'
								checked={unique}
								onCheckedChange={setUnique}
								className='scale-90'
							/>
							<label
								htmlFor='unique'
								className='text-xs font-medium cursor-pointer'
							>
								{t('inputs.unique')}
							</label>
						</div>
					</div>

					{/* Error Display */}
					{error && (
						<Alert variant='destructive' className='py-2'>
							<AlertDescription className='text-xs'>{error}</AlertDescription>
						</Alert>
					)}

					{/* Results Display */}
					{latestResult && (
						<div className='bg-muted/50 rounded-lg p-6 text-center'>
							<div className='flex flex-wrap justify-center gap-3 mb-3'>
								{latestResult.numbers.map((num, index) => (
									<span
										key={index}
										className='text-xl sm:text-2xl font-bold bg-background rounded-lg px-3 sm:px-4 py-2 shadow-sm border'
									>
										{num}
									</span>
								))}
							</div>
							<p className='text-xs text-muted-foreground'>
								{t('result.generatedAt')}{' '}
								{latestResult.timestamp.toLocaleString()}
							</p>
						</div>
					)}

					{/* Action Buttons */}
					<div className='flex flex-wrap gap-2 pt-2'>
						<Button
							onClick={handleGenerate}
							className='flex-1 sm:flex-none gap-2'
						>
							<Shuffle className='w-4 h-4' />
							{t('actions.generate')}
						</Button>
						{latestResult && (
							<>
								<Button
									variant='outline'
									size='default'
									onClick={() =>
										copyToClipboard(latestResult.numbers, latestResult.id)
									}
									className={cn(
										'gap-2',
										copiedId === latestResult.id && 'bg-green-500/10'
									)}
								>
									{copiedId === latestResult.id ? (
										<Check className='w-4 h-4' />
									) : (
										<Copy className='w-4 h-4' />
									)}
									{t('actions.copy')}
								</Button>
								{results.length > 1 && (
									<Button
										variant='outline'
										size='default'
										onClick={downloadResults}
										className='gap-2'
									>
										<Download className='w-4 h-4' />
										{t('actions.downloadAll')}
									</Button>
								)}
							</>
						)}
					</div>
				</div>
			</Card>

			{/* Error Display for initial state */}
			{!latestResult && error && (
				<Alert variant='destructive'>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{/* History Section */}
			{results.length > 1 && (
				<Card className='p-4 sm:p-6'>
					<div className='flex items-center justify-between mb-3'>
						<h2 className='text-base font-semibold flex items-center gap-2'>
							<History className='w-4 h-4' />
							{t('sections.history')}
							<span className='text-xs text-muted-foreground font-normal'>
								({results.length - 1})
							</span>
						</h2>
						<Button
							variant='ghost'
							size='sm'
							onClick={downloadResults}
							className='h-8 text-xs'
						>
							<Download className='w-3.5 h-3.5 mr-1' />
							{t('actions.downloadAll')}
						</Button>
					</div>

					<div className='space-y-1.5'>
						{results.slice(1, 6).map((result, index) => (
							<div
								key={result.id}
								className='group flex items-center gap-2 py-2 px-3 rounded-md hover:bg-muted/50 transition-colors'
							>
								<span className='text-xs text-muted-foreground w-4'>
									#{index + 2}
								</span>
								<div className='flex-1 flex items-center gap-3'>
									<div className='font-mono text-sm flex-1 truncate'>
										{result.numbers.join(' · ')}
									</div>
									<span className='text-xs text-muted-foreground whitespace-nowrap'>
										{result.timestamp.toLocaleTimeString([], {
											hour: '2-digit',
											minute: '2-digit'
										})}
									</span>
								</div>
								<Button
									variant='ghost'
									size='sm'
									onClick={() => copyToClipboard(result.numbers, result.id)}
									className={cn(
										'h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity',
										copiedId === result.id && 'opacity-100 text-green-600'
									)}
								>
									{copiedId === result.id ? (
										<Check className='w-3.5 h-3.5' />
									) : (
										<Copy className='w-3.5 h-3.5' />
									)}
								</Button>
							</div>
						))}

						{results.length > 6 && (
							<p className='text-xs text-muted-foreground text-center pt-2'>
								{t('sections.showingRecent', {
									count: 5,
									total: results.length - 1
								})}
							</p>
						)}
					</div>
				</Card>
			)}

			{/* Info Section */}
			<Card className='p-6'>
				<h2 className='text-lg font-semibold mb-4'>{t('sections.about')}</h2>
				<div className='space-y-3 text-sm text-muted-foreground'>
					<p>{t('info.description')}</p>
					<p>{t('info.cryptoApi')}</p>
					<ul className='list-disc list-inside space-y-1 mt-3'>
						<li>{t('info.features.range')}</li>
						<li>{t('info.features.maxResults')}</li>
						<li>{t('info.features.noDuplicates')}</li>
						<li>{t('info.features.timestamps')}</li>
					</ul>
				</div>
			</Card>
		</div>
	)
}

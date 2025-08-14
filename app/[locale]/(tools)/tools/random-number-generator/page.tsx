'use client'

import { useState, useEffect } from 'react'
import { Dices, Copy, Check, Download, History, Shuffle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { WidgetLayout } from '@/components/widgets/WidgetLayout'
import { WidgetSection } from '@/components/widgets/WidgetSection'
import { WidgetInput } from '@/components/widgets/WidgetInput'
import { WidgetOutput } from '@/components/widgets/WidgetOutput'
import { Input } from '@/components/ui/input'
import { useTranslations } from 'next-intl'
import { KeyboardShortcutInfo } from '@/components/widgets'

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
		<WidgetLayout>
			{/* Input Section */}
			<WidgetSection title={t('sections.settings')}>
				<div className='grid md:grid-cols-3 gap-4'>
					<WidgetInput label={t('inputs.minimum.label')} description={t('inputs.minimum.description')}>
						<Input
							type='number'
							value={min}
							onChange={e => setMin(parseInt(e.target.value) || 0)}
							min={0}
							max={999999}
							placeholder={t('inputs.minimum.placeholder')}
						/>
					</WidgetInput>
					
					<WidgetInput label={t('inputs.maximum.label')} description={t('inputs.maximum.description')}>
						<Input
							type='number'
							value={max}
							onChange={e => setMax(parseInt(e.target.value) || 0)}
							min={0}
							max={999999}
							placeholder={t('inputs.maximum.placeholder')}
						/>
					</WidgetInput>
					
					<WidgetInput label={t('inputs.count.label')} description={t('inputs.count.description')}>
						<Input
							type='number'
							value={count}
							onChange={e => setCount(parseInt(e.target.value) || 1)}
							min={1}
							max={1000}
							placeholder={t('inputs.count.placeholder')}
						/>
					</WidgetInput>
				</div>

				<div className='flex items-center justify-between mt-6'>
					<div className='flex items-center space-x-2'>
						<Switch id='unique' checked={unique} onCheckedChange={setUnique} />
						<label htmlFor='unique' className='text-sm font-medium cursor-pointer'>
							{t('inputs.unique')}
						</label>
					</div>

					<Button onClick={handleGenerate} className='gap-2'>
						<Shuffle className='w-4 h-4' />
						{t('actions.generate')}
					</Button>
				</div>
			</WidgetSection>

			{/* Error Display */}
			{error && (
				<Alert variant='destructive'>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{/* Output Section */}
			{latestResult && (
				<WidgetSection title={t('sections.result')}>
					<WidgetOutput>
					<div className='bg-muted rounded-lg p-6 text-center'>
						<div className='flex flex-wrap justify-center gap-4 mb-4'>
							{latestResult.numbers.map((num, index) => (
								<span
									key={index}
									className='text-2xl font-bold bg-background rounded-lg px-4 py-2 shadow-sm'
								>
									{num}
								</span>
							))}
						</div>
						<p className='text-sm text-muted-foreground'>
							{t('result.generatedAt')} {latestResult.timestamp.toLocaleString()}
						</p>
					</div>
				</WidgetOutput>
				</WidgetSection>
			)}

			{/* History Section */}
			{results.length > 1 && (
				<WidgetSection 
					title={t('sections.history')}
				>
					<div className="flex justify-between items-center mb-4">
						<h3 className="text-sm font-medium">{t('sections.allResults')}</h3>
						<Button variant='outline' size='sm' onClick={downloadResults}>
							<Download className='w-4 h-4 mr-1' />
							{t('actions.downloadAll')}
						</Button>
					</div>
					<div className='space-y-3'>
						{results.slice(1).map(result => (
							<div
								key={result.id}
								className='flex items-center justify-between p-3 bg-muted rounded-lg'
							>
								<div className='flex-1'>
									<p className='font-mono text-sm'>
										{result.numbers.join('  ')}
									</p>
									<p className='text-xs text-muted-foreground mt-1'>
										{result.timestamp.toLocaleString()}
									</p>
								</div>
								<Button
									variant='ghost'
									size='sm'
									onClick={() => copyToClipboard(result.numbers, result.id)}
									className={cn(
										'shrink-0',
										copiedId === result.id && 'bg-green-500/10'
									)}
								>
									{copiedId === result.id ? (
										<Check className='w-4 h-4' />
									) : (
										<Copy className='w-4 h-4' />
									)}
								</Button>
							</div>
						))}
					</div>
				</WidgetSection>
			)}

			{/* Info Section */}
			<WidgetSection title={t('sections.about')}>
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
			</WidgetSection>

			{/* Keyboard Shortcuts */}
			<WidgetSection title="Keyboard Shortcuts">
				<KeyboardShortcutInfo />
			</WidgetSection>
		</WidgetLayout>
	)
}

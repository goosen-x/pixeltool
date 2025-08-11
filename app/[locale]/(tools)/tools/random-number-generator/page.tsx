'use client'

import { useState, useEffect } from 'react'
import { Dices, Copy, Check, RefreshCw, Download } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

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

	const validate = (): string | null => {
		if (min < 0 || min > 999999) {
			return 'Minimum value must be between 0 and 999,999'
		}
		if (max < 0 || max > 999999) {
			return 'Maximum value must be between 0 and 999,999'
		}
		if (min > max) {
			return 'Minimum value cannot be greater than maximum value'
		}
		if (count < 1 || count > 1000) {
			return 'Count must be between 1 and 1000'
		}
		if (unique && count > max - min + 1) {
			return `Cannot generate ${count} unique numbers in range ${min}-${max}`
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
				err instanceof Error ? err.message : 'Failed to generate numbers'
			)
		}
	}

	const copyToClipboard = async (numbers: number[], id: string) => {
		try {
			await navigator.clipboard.writeText(numbers.join('    '))
			setCopiedId(id)
			toast.success('Numbers copied to clipboard')
			setTimeout(() => setCopiedId(null), 2000)
		} catch (err) {
			toast.error('Failed to copy numbers')
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
		toast.success('Results downloaded')
	}

	if (!mounted) {
		return null
	}

	const latestResult = results[0]

	return (
		<div className='max-w-6xl mx-auto space-y-8'>
			{/* Generator Settings */}
			<Card className='p-6'>
				<div className='grid md:grid-cols-3 gap-6'>
					<div>
						<Label htmlFor='min'>Minimum</Label>
						<Input
							id='min'
							type='number'
							value={min}
							onChange={e => setMin(parseInt(e.target.value) || 0)}
							min={0}
							max={999999}
							className='mt-1'
						/>
					</div>
					<div>
						<Label htmlFor='max'>Maximum</Label>
						<Input
							id='max'
							type='number'
							value={max}
							onChange={e => setMax(parseInt(e.target.value) || 0)}
							min={0}
							max={999999}
							className='mt-1'
						/>
					</div>
					<div>
						<Label htmlFor='count'>Count</Label>
						<Input
							id='count'
							type='number'
							value={count}
							onChange={e => setCount(parseInt(e.target.value) || 1)}
							min={1}
							max={1000}
							className='mt-1'
						/>
					</div>
				</div>

				<div className='mt-6 flex items-center justify-between'>
					<div className='flex items-center space-x-2'>
						<Switch id='unique' checked={unique} onCheckedChange={setUnique} />
						<Label htmlFor='unique' className='cursor-pointer'>
							No duplicates
						</Label>
					</div>

					<Button onClick={handleGenerate} className='gap-2'>
						<Dices className='w-4 h-4' />
						Generate
					</Button>
				</div>
			</Card>

			{/* Error Display */}
			{error && (
				<Alert variant='destructive'>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{/* Latest Result */}
			{latestResult && (
				<Card className='p-6'>
					<div className='flex items-center justify-between mb-4'>
						<h3 className='text-lg font-semibold'>Generated Numbers</h3>
						<Button
							variant='outline'
							size='sm'
							onClick={() =>
								copyToClipboard(latestResult.numbers, latestResult.id)
							}
							className={cn(
								copiedId === latestResult.id &&
									'bg-green-500/10 border-green-500'
							)}
						>
							{copiedId === latestResult.id ? (
								<>
									<Check className='w-4 h-4 mr-1' />
									Copied
								</>
							) : (
								<>
									<Copy className='w-4 h-4 mr-1' />
									Copy
								</>
							)}
						</Button>
					</div>

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
							{latestResult.timestamp.toLocaleString()}
						</p>
					</div>
				</Card>
			)}

			{/* History */}
			{results.length > 1 && (
				<Card className='p-6'>
					<div className='flex items-center justify-between mb-4'>
						<h3 className='text-lg font-semibold'>History</h3>
						<Button variant='outline' size='sm' onClick={downloadResults}>
							<Download className='w-4 h-4 mr-1' />
							Download All
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
				</Card>
			)}

			{/* Info */}
			<Card className='p-6 bg-muted/50'>
				<h3 className='font-semibold mb-4'>About This Generator</h3>
				<div className='space-y-2 text-sm text-muted-foreground'>
					<p>
						This random number generator (RNG) uses the Web Crypto API to
						generate cryptographically secure random numbers, suitable for most
						cryptographic applications.
					</p>
					<p>
						Unlike Math.random() or the Mersenne Twister algorithm,
						crypto.getRandomValues() provides true randomness from the operating
						system&apos;s entropy source.
					</p>
					<ul className='list-disc list-inside space-y-1 mt-2'>
						<li>Range: 0 to 999,999</li>
						<li>Maximum results: 1,000 numbers</li>
						<li>No duplicates option available</li>
						<li>Timestamps from your system clock</li>
					</ul>
				</div>
			</Card>
		</div>
	)
}

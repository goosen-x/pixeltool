'use client'

import { useState, useEffect } from 'react'
import {
	Shuffle,
	Copy,
	Check,
	Trash2,
	RotateCcw,
	Download,
	Upload
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// Fisher-Yates shuffle algorithm using crypto.getRandomValues for better randomness
function cryptoShuffle<T>(array: T[]): T[] {
	const newArray = [...array]
	const randomValues = new Uint32Array(newArray.length)

	for (let i = newArray.length - 1; i > 0; i--) {
		crypto.getRandomValues(randomValues)
		const j = randomValues[i] % (i + 1)
		;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
	}

	return newArray
}

export default function RandomListGeneratorPage() {
	const [mounted, setMounted] = useState(false)
	const [inputText, setInputText] = useState(
		'Item 1\nItem 2\nItem 3\nItem 4\nItem 5'
	)
	const [outputText, setOutputText] = useState('')
	const [isShuffling, setIsShuffling] = useState(false)
	const [copiedOutput, setCopiedOutput] = useState(false)
	const [itemCount, setItemCount] = useState(5)
	const [shuffleCount, setShuffleCount] = useState(0)

	useEffect(() => {
		setMounted(true)
		updateItemCount('Item 1\nItem 2\nItem 3\nItem 4\nItem 5')
	}, [])

	const updateItemCount = (text: string) => {
		const items = text
			.trim()
			.split('\n')
			.filter(line => line.trim() !== '')
		setItemCount(items.length)
	}

	const shuffleList = () => {
		const items = inputText
			.trim()
			.split('\n')
			.filter(line => line.trim() !== '')

		if (items.length === 0) {
			toast.error('Please enter at least one item')
			return
		}

		if (items.length > 10000) {
			toast.error('Maximum 10,000 items allowed')
			return
		}

		setIsShuffling(true)

		// Add animation delay
		setTimeout(() => {
			const shuffledItems = cryptoShuffle(items)
			setOutputText(shuffledItems.join('\n'))
			setShuffleCount(prev => prev + 1)
			setIsShuffling(false)
			toast.success('List shuffled successfully!')
		}, 300)
	}

	const copyToClipboard = async () => {
		if (!outputText) {
			toast.error('Nothing to copy')
			return
		}

		try {
			await navigator.clipboard.writeText(outputText)
			setCopiedOutput(true)
			toast.success('Copied to clipboard')
			setTimeout(() => setCopiedOutput(false), 2000)
		} catch (err) {
			toast.error('Failed to copy')
		}
	}

	const clearAll = () => {
		setInputText('')
		setOutputText('')
		setItemCount(0)
		setShuffleCount(0)
		toast.success('Cleared all data')
	}

	const resetToOriginal = () => {
		setOutputText('')
		setShuffleCount(0)
		toast.success('Reset to original order')
	}

	const downloadList = () => {
		if (!outputText) {
			toast.error('Nothing to download')
			return
		}

		const blob = new Blob([outputText], { type: 'text/plain' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `shuffled-list-${new Date().toISOString().split('T')[0]}.txt`
		a.click()
		URL.revokeObjectURL(url)
		toast.success('List downloaded')
	}

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		const reader = new FileReader()
		reader.onload = event => {
			const text = event.target?.result as string
			setInputText(text)
			updateItemCount(text)
			setOutputText('')
			setShuffleCount(0)
			toast.success('File uploaded successfully')
		}
		reader.readAsText(file)
	}

	if (!mounted) {
		return (
			<div className='max-w-6xl mx-auto space-y-8'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight mb-2'>
						Random List Generator
					</h1>
					<p className='text-muted-foreground'>
						Randomly shuffle and sort lists with cryptographic randomness
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
			{/* Main Content */}
			<div className='grid lg:grid-cols-2 gap-6'>
				{/* Input Section */}
				<Card className='p-6'>
					<div className='space-y-4'>
						<div className='flex items-center justify-between'>
							<Label htmlFor='input' className='text-base font-semibold'>
								Input List (one item per line)
							</Label>
							<div className='flex items-center gap-2'>
								<Badge variant='secondary'>
									{itemCount} {itemCount === 1 ? 'item' : 'items'}
								</Badge>
								<label htmlFor='file-upload' className='cursor-pointer'>
									<Button variant='outline' size='sm' asChild>
										<span>
											<Upload className='w-4 h-4 mr-1' />
											Upload
										</span>
									</Button>
									<input
										id='file-upload'
										type='file'
										accept='.txt'
										onChange={handleFileUpload}
										className='hidden'
									/>
								</label>
							</div>
						</div>

						<Textarea
							id='input'
							value={inputText}
							onChange={e => {
								setInputText(e.target.value)
								updateItemCount(e.target.value)
							}}
							placeholder='Enter items to shuffle...'
							className='min-h-[400px] font-mono text-sm'
							spellCheck={false}
						/>

						<div className='flex gap-2'>
							<Button
								onClick={shuffleList}
								className='flex-1'
								disabled={isShuffling || itemCount === 0}
							>
								<Shuffle
									className={cn('w-4 h-4 mr-2', isShuffling && 'animate-spin')}
								/>
								Shuffle List
							</Button>
							<Button
								onClick={clearAll}
								variant='outline'
								size='icon'
								disabled={!inputText}
							>
								<Trash2 className='w-4 h-4' />
							</Button>
						</div>
					</div>
				</Card>

				{/* Output Section */}
				<Card className='p-6'>
					<div className='space-y-4'>
						<div className='flex items-center justify-between'>
							<Label htmlFor='output' className='text-base font-semibold'>
								Shuffled Result
							</Label>
							<div className='flex items-center gap-2'>
								{shuffleCount > 0 && (
									<Badge variant='outline'>Shuffled {shuffleCount}x</Badge>
								)}
								<Button
									onClick={copyToClipboard}
									variant='outline'
									size='sm'
									disabled={!outputText}
								>
									{copiedOutput ? (
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
								<Button
									onClick={downloadList}
									variant='outline'
									size='sm'
									disabled={!outputText}
								>
									<Download className='w-4 h-4' />
								</Button>
							</div>
						</div>

						<Textarea
							id='output'
							value={outputText}
							onChange={e => setOutputText(e.target.value)}
							placeholder='Shuffled items will appear here...'
							className='min-h-[400px] font-mono text-sm'
							spellCheck={false}
						/>

						<div className='flex gap-2'>
							<Button
								onClick={shuffleList}
								className='flex-1'
								variant='secondary'
								disabled={!outputText || isShuffling}
							>
								<Shuffle
									className={cn('w-4 h-4 mr-2', isShuffling && 'animate-spin')}
								/>
								Re-shuffle
							</Button>
							<Button
								onClick={resetToOriginal}
								variant='outline'
								size='icon'
								disabled={!outputText}
							>
								<RotateCcw className='w-4 h-4' />
							</Button>
						</div>
					</div>
				</Card>
			</div>

			{/* Features Section */}
			<div className='grid md:grid-cols-3 gap-4'>
				<Card className='p-4'>
					<h3 className='font-semibold mb-2 text-sm'>
						Cryptographic Randomness
					</h3>
					<p className='text-xs text-muted-foreground'>
						Uses crypto.getRandomValues() for truly random shuffling, more
						secure than Math.random()
					</p>
				</Card>
				<Card className='p-4'>
					<h3 className='font-semibold mb-2 text-sm'>Editable Results</h3>
					<p className='text-xs text-muted-foreground'>
						Results can be edited directly in the output field before copying or
						downloading
					</p>
				</Card>
				<Card className='p-4'>
					<h3 className='font-semibold mb-2 text-sm'>Client-Side Processing</h3>
					<p className='text-xs text-muted-foreground'>
						All data is processed in your browser. Nothing is sent to any server
					</p>
				</Card>
			</div>

			{/* Info Section */}
			<Card className='p-6 bg-muted/50'>
				<h3 className='font-semibold mb-3'>About This Tool</h3>
				<div className='space-y-3 text-sm text-muted-foreground'>
					<p>
						This web application randomly sorts multiple items in a list using
						the Fisher-Yates shuffle algorithm with cryptographically secure
						random values. Items can be names, raffle entries, IDs, or numbers.
					</p>
					<p>
						Simply enter one item per line, then click the shuffle button to
						randomize the order. All processing happens in your browser - no
						data is sent to any server.
					</p>
					<p>
						Perfect for random sorting tasks that are difficult to do in Excel.
						Just copy and paste your data here for instant random shuffling.
					</p>
					<Alert className='mt-4'>
						<AlertDescription className='text-xs'>
							This application uses crypto.getRandomValues() for enhanced
							randomness instead of Math.random(). Please comply with local
							laws. Users are responsible for any violations. This service is
							provided &quot;as is&quot; without any warranties, express or implied.
						</AlertDescription>
					</Alert>
				</div>
			</Card>
		</div>
	)
}

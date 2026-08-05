'use client'

import { useState, useEffect } from 'react'
import { Copy, Check, Download, Shuffle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { RandomNumberGeneratorSeo } from './RandomNumberGeneratorSeo'

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
	const widget = getWidgetById('random-number-generator')!
	const [min, setMin] = useState(1)
	const [max, setMax] = useState(10)
	const [count, setCount] = useState(5)
	const [unique, setUnique] = useState(true)
	const [results, setResults] = useState<GeneratedResult[]>([])
	const [error, setError] = useState<string | null>(null)
	const [copiedId, setCopiedId] = useState<string | null>(null)

	const validate = (): string | null => {
		if (min < 0 || min > 999999) {
			return 'Минимальное значение должно быть от 0 до 999999'
		}
		if (max < 0 || max > 999999) {
			return 'Максимальное значение должно быть от 0 до 999999'
		}
		if (min > max) {
			return 'Минимальное значение не может быть больше максимального'
		}
		if (count < 1 || count > 1000) {
			return 'Количество должно быть от 1 до 1000'
		}
		if (unique && count > max - min + 1) {
			return `Невозможно сгенерировать ${count} уникальных чисел в диапазоне от ${min} до ${max}`
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
			setError(err instanceof Error ? err.message : 'Ошибка генерации')
		}
	}

	const copyToClipboard = async (numbers: number[], id: string) => {
		try {
			await navigator.clipboard.writeText(numbers.join('    '))
			setCopiedId(id)
			setTimeout(() => setCopiedId(null), 2000)
		} catch (err) {
			console.error('Не удалось скопировать:', err)
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
	}

	useEffect(() => {
		// Generate initial result
		handleGenerate()
	}, [])

	const latestResult = results[0]

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: диапазон и сколько чисел нужно. Это весь ввод
				    инструмента, прятать его под заголовком «Настройки» не за чем. */}
				<div className={toolBar}>
					<label className='flex items-center gap-2 text-sm text-muted-foreground'>
						от
						<input
							type='number'
							value={min}
							onChange={event => setMin(Number(event.target.value))}
							aria-label='Минимальное значение'
							className='w-24 rounded-md border bg-background px-2 py-1 text-center font-mono text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						/>
						до
						<input
							type='number'
							value={max}
							onChange={event => setMax(Number(event.target.value))}
							aria-label='Максимальное значение'
							className='w-24 rounded-md border bg-background px-2 py-1 text-center font-mono text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						/>
					</label>

					<label className='flex items-center gap-2 text-sm text-muted-foreground'>
						сколько
						<input
							type='number'
							value={count}
							onChange={event => setCount(Number(event.target.value))}
							aria-label='Количество чисел'
							className='w-20 rounded-md border bg-background px-2 py-1 text-center font-mono text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						/>
					</label>

					<button
						type='button'
						onClick={() => setUnique(!unique)}
						aria-pressed={unique}
						title='Числа не будут повторяться'
						className={toolPill(unique)}
					>
						без повторов
					</button>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={() =>
								latestResult &&
								copyToClipboard(latestResult.numbers, latestResult.id)
							}
							disabled={!latestResult}
							title='Скопировать числа'
							className={toolIconButton}
						>
							{latestResult && copiedId === latestResult.id ? (
								<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
							) : (
								<Copy className='h-4 w-4' />
							)}
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={downloadResults}
							disabled={results.length === 0}
							title='Скачать все броски'
							className={toolIconButton}
						>
							<Download className='h-4 w-4' />
						</Button>
					</div>
				</div>

				{/* Результат-герой: сами числа крупно, кнопка спокойная. */}
				<div className='px-5 py-10 text-center sm:px-6'>
					{error ? (
						<p className='text-sm text-destructive'>{error}</p>
					) : latestResult ? (
						<p className='flex flex-wrap items-center justify-center gap-x-6 gap-y-3 font-mono text-4xl tabular-nums sm:text-5xl'>
							{latestResult.numbers.map((number, index) => (
								<span key={index}>{number}</span>
							))}
						</p>
					) : (
						<p className='text-sm text-muted-foreground'>
							Задайте диапазон и нажмите «Сгенерировать»
						</p>
					)}

					<Button
						onClick={handleGenerate}
						className='mt-8 cursor-pointer gap-2'
					>
						<Shuffle className='h-4 w-4' />
						Сгенерировать
					</Button>
				</div>

				{/* Предыдущие броски — тихая полоса под результатом. */}
				{results.length > 1 && (
					<div className={toolFooterBar}>
						<span className='mr-1 text-sm text-muted-foreground'>Раньше</span>
						{results.slice(1).map(result => (
							<button
								key={result.id}
								type='button'
								onClick={() => copyToClipboard(result.numbers, result.id)}
								title='Скопировать'
								className={toolPill(false, 'font-mono')}
							>
								{copiedId === result.id ? '✓ ' : ''}
								{result.numbers.join(' ')}
							</button>
						))}
					</div>
				)}
			</Card>

			<RandomNumberGeneratorSeo />
		</WidgetSEOWrapper>
	)
}

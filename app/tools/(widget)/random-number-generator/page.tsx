'use client'

import { useState, useEffect } from 'react'
import { Copy, Check, Download, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { RandomNumberGeneratorSeo } from './RandomNumberGeneratorSeo'
import { TextRoll } from '@/components/core/text-roll'
import { toast } from 'sonner'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'

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
	count: number
): number[] {
	const numbers: number[] = []

	for (let i = 0; i < count; i++) {
		numbers.push(getSecureRandomNumber(min, max))
	}

	return numbers
}

export default function RandomNumberGeneratorPage() {
	const widget = getWidgetById('random-number-generator')!
	// Поля «от»/«до» держат сырой текст, а не число: контролируемый number-инпут
	// не даёт полю побыть пустым (Number('') === 0 тут же возвращается в DOM как
	// «0»), из-за чего 0 невозможно стереть и следующая цифра приклеивается к
	// нему («0111» вместо «111»). Текстовое поле такого не делает.
	const [minText, setMinText] = useState('1')
	const [maxText, setMaxText] = useState('10')
	const min = minText === '' ? NaN : Number(minText)
	const max = maxText === '' ? NaN : Number(maxText)
	const [count, setCount] = useState(5)
	const [results, setResults] = useState<GeneratedResult[]>([])
	const [error, setError] = useState<string | null>(null)
	const [copiedId, setCopiedId] = useState<string | null>(null)

	const validate = (): string | null => {
		if (Number.isNaN(min) || min < 0 || min > 999999) {
			return 'Минимальное значение должно быть от 0 до 999999'
		}
		if (Number.isNaN(max) || max < 0 || max > 999999) {
			return 'Максимальное значение должно быть от 0 до 999999'
		}
		if (min > max) {
			return 'Минимальное значение не может быть больше максимального'
		}
		if (count < 1 || count > 1000) {
			return 'Количество должно быть от 1 до 1000'
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
			const numbers = generateRandomNumbers(min, max, count)
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
			toast.success('Скопировано')
			setTimeout(() => setCopiedId(null), 2000)
		} catch {
			toast.error('Не удалось скопировать')
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
							type='text'
							inputMode='numeric'
							pattern='[0-9]*'
							value={minText}
							onChange={event => {
								const raw = event.target.value
								if (/^[0-9]*$/.test(raw)) setMinText(raw)
							}}
							aria-label='Минимальное значение'
							className='w-24 rounded-md border bg-background px-2 py-1 text-center font-mono text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						/>
						до
						<input
							type='text'
							inputMode='numeric'
							pattern='[0-9]*'
							value={maxText}
							onChange={event => {
								const raw = event.target.value
								if (/^[0-9]*$/.test(raw)) setMaxText(raw)
							}}
							aria-label='Максимальное значение'
							className='w-24 rounded-md border bg-background px-2 py-1 text-center font-mono text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						/>
					</label>

					<label className='flex items-center gap-2 text-sm text-muted-foreground'>
						сколько
						<span className='flex items-center gap-0.5 rounded-md border bg-background'>
							<Button
								size='icon'
								variant='ghost'
								onClick={() => setCount(c => Math.max(1, c - 1))}
								disabled={count <= 1}
								title='Меньше'
								className={cn(toolIconButton, 'h-7 w-7')}
							>
								<Minus className='h-3.5 w-3.5' />
							</Button>
							<span className='w-8 text-center font-mono text-sm text-foreground tabular-nums'>
								{count}
							</span>
							<Button
								size='icon'
								variant='ghost'
								onClick={() => setCount(c => Math.min(1000, c + 1))}
								disabled={count >= 1000}
								title='Больше'
								className={cn(toolIconButton, 'h-7 w-7')}
							>
								<Plus className='h-3.5 w-3.5' />
							</Button>
						</span>
					</label>

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
						<p className='flex flex-wrap items-center justify-center gap-x-12 gap-y-4 font-mono text-4xl tabular-nums sm:text-5xl'>
							{latestResult.numbers.map((number, index) => (
								<TextRoll
									key={`${latestResult.id}-${index}`}
									duration={0.4}
									getEnterDelay={i => index * 0.08 + i * 0.015}
									getExitDelay={i => index * 0.08 + i * 0.015}
									transition={{ ease: [0.25, 0.1, 0.25, 1] }}
									variants={{
										enter: {
											initial: { y: 0, opacity: 1 },
											animate: { y: -50, opacity: 0.1 }
										},
										exit: {
											initial: { y: 50, opacity: 0 },
											animate: { y: 0, opacity: 1 }
										}
									}}
								>
									{String(number)}
								</TextRoll>
							))}
						</p>
					) : (
						<p className='text-sm text-muted-foreground'>
							Задайте диапазон и нажмите «Сгенерировать»
						</p>
					)}

					<Button onClick={handleGenerate} className='mt-8 cursor-pointer'>
						Сгенерировать
					</Button>
				</div>

				{/* Предыдущие броски — тихая полоса под результатом. */}
				{results.length > 1 && (
					<div className={toolFooterBar}>
						<span className='mr-1 text-sm text-muted-foreground'>История</span>
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

			<ToolScreenshot slug='random-number-generator' />
			<RandomNumberGeneratorSeo />
		</WidgetSEOWrapper>
	)
}

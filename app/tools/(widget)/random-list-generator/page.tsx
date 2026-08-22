'use client'

import { useState, useEffect, useRef } from 'react'
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
import { toolBar, toolFooterBar, toolIconButton } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { RandomListGeneratorSeo } from './RandomListGeneratorSeo'

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
	const widget = getWidgetById('random-list-generator')!
	const [mounted, setMounted] = useState(false)
	const [inputText, setInputText] = useState(
		'Элемент 1\nЭлемент 2\nЭлемент 3\nЭлемент 4\nЭлемент 5'
	)
	const [outputText, setOutputText] = useState('')
	const [isShuffling, setIsShuffling] = useState(false)
	const [copiedOutput, setCopiedOutput] = useState(false)
	const [itemCount, setItemCount] = useState(5)
	const [shuffleCount, setShuffleCount] = useState(0)
	// Ошибка показывается строкой под полями: тост про «максимум 10 000
	// элементов» исчезал раньше, чем человек успевал понять, что не так.
	const [error, setError] = useState('')
	const fileInputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		setMounted(true)
		updateItemCount('Элемент 1\nЭлемент 2\nЭлемент 3\nЭлемент 4\nЭлемент 5')
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
			setError('Введите хотя бы одну строку')
			return
		}

		if (items.length > 10000) {
			setError('Максимум 10 000 строк')
			return
		}

		setError('')

		setIsShuffling(true)

		// Add animation delay
		setTimeout(() => {
			const shuffledItems = cryptoShuffle(items)
			setOutputText(shuffledItems.join('\n'))
			setShuffleCount(prev => prev + 1)
			setIsShuffling(false)
		}, 300)
	}

	const copyToClipboard = async () => {
		if (!outputText) return

		try {
			await navigator.clipboard.writeText(outputText)
			setCopiedOutput(true)
			setTimeout(() => setCopiedOutput(false), 2000)
		} catch (err) {
			console.error('Не удалось скопировать:', err)
		}
	}

	const clearAll = () => {
		setInputText('')
		setOutputText('')
		setItemCount(0)
		setShuffleCount(0)
		setError('')
	}

	const resetToOriginal = () => {
		setOutputText('')
		setShuffleCount(0)
	}

	const downloadList = () => {
		if (!outputText) return

		const blob = new Blob([outputText], { type: 'text/plain' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `shuffled-list-${new Date().toISOString().split('T')[0]}.txt`
		a.click()
		URL.revokeObjectURL(url)
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
		}
		reader.readAsText(file)
	}

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: сколько строк на входе и что сделать с
				    результатом. */}
				<div className={toolBar}>
					<span className='text-sm text-muted-foreground'>
						{itemCount} строк
						{shuffleCount > 0 && (
							<span className='ml-3'>перемешано {shuffleCount} раз</span>
						)}
					</span>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => fileInputRef.current?.click()}
							title='Загрузить список из файла'
							className={toolIconButton}
						>
							<Upload className='h-4 w-4' />
						</Button>
						<input
							ref={fileInputRef}
							type='file'
							accept='.txt,.csv'
							onChange={handleFileUpload}
							className='hidden'
							aria-label='Загрузить файл со списком'
						/>
						<Button
							size='icon'
							variant='ghost'
							onClick={copyToClipboard}
							disabled={!outputText}
							title='Скопировать результат'
							className={toolIconButton}
						>
							{copiedOutput ? (
								<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
							) : (
								<Copy className='h-4 w-4' />
							)}
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={downloadList}
							disabled={!outputText}
							title='Скачать результат'
							className={toolIconButton}
						>
							<Download className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={resetToOriginal}
							disabled={!outputText}
							title='Вернуть исходный порядок'
							className={toolIconButton}
						>
							<RotateCcw className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={clearAll}
							disabled={!inputText && !outputText}
							title='Очистить'
							className={toolIconButton}
						>
							<Trash2 className='h-4 w-4' />
						</Button>
					</div>
				</div>

				<div className='grid md:grid-cols-2'>
					<Textarea
						value={inputText}
						onChange={e => {
							setInputText(e.target.value)
							updateItemCount(e.target.value)
						}}
						placeholder={'Элемент 1\nЭлемент 2\nЭлемент 3'}
						spellCheck={false}
						aria-label='Исходный список'
						className='min-h-[16rem] resize-none rounded-none border-0 px-5 py-6 font-mono text-base focus-visible:ring-0 sm:px-6 md:border-r md:text-sm'
					/>

					{outputText ? (
						<Textarea
							value={outputText}
							readOnly
							aria-label='Перемешанный список'
							className='min-h-[16rem] resize-none rounded-none border-0 bg-muted/20 px-5 py-6 font-mono text-base focus-visible:ring-0 md:text-sm'
						/>
					) : (
						<p className='flex min-h-[16rem] items-center justify-center px-5 text-center text-sm text-muted-foreground'>
							Перемешанный список появится здесь
						</p>
					)}
				</div>

				<div className={toolFooterBar}>
					{error && <span className='text-sm text-destructive'>{error}</span>}

					<Button
						onClick={shuffleList}
						disabled={isShuffling || itemCount === 0}
						className='cursor-pointer gap-2 sm:ml-auto'
					>
						<Shuffle className='h-4 w-4' />
						{isShuffling ? 'Перемешиваем…' : 'Перемешать'}
					</Button>
				</div>
			</Card>

			<div className='mt-6 space-y-3 text-sm text-muted-foreground'>
				<p>
					Перемешивание списка нужно там, где важна честная очерёдность: порядок
					выступлений, задачи по исполнителям, вопросы в тесте, плейлист. Каждая
					перестановка равновероятна — это алгоритм Фишера — Йетса, а не
					сортировка по случайному ключу.
				</p>
			</div>

			<RandomListGeneratorSeo />
		</WidgetSEOWrapper>
	)
}

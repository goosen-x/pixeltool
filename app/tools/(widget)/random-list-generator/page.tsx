'use client'

import { useState, useRef } from 'react'
import {
	Shuffle,
	Copy,
	Check,
	Trash2,
	Download,
	Upload
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import { pluralizeRu } from '@/lib/utils/pluralize'
import {
	formatList,
	MAX_ITEMS,
	parseItems,
	sameOrder,
	shuffle
} from '@/lib/random-list'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { RandomListGeneratorSeo } from './RandomListGeneratorSeo'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'

export default function RandomListGeneratorPage() {
	const widget = getWidgetById('random-list-generator')!
	const [inputText, setInputText] = useState(
		'Элемент 1\nЭлемент 2\nЭлемент 3\nЭлемент 4\nЭлемент 5'
	)
	const [resultItems, setResultItems] = useState<string[]>([])
	const [numbered, setNumbered] = useState(false)
	const [isShuffling, setIsShuffling] = useState(false)
	const [copiedOutput, setCopiedOutput] = useState(false)
	const [shuffleCount, setShuffleCount] = useState(0)
	// При 2–3 элементах новый порядок часто совпадает с исходным, и без
	// подсказки кажется, что кнопка не сработала.
	const [unchanged, setUnchanged] = useState(false)
	// Ошибка показывается строкой под полями: тост про «максимум 10 000
	// элементов» исчезал раньше, чем человек успевал понять, что не так.
	const [error, setError] = useState('')
	const fileInputRef = useRef<HTMLInputElement>(null)

	const items = parseItems(inputText)
	const itemCount = items.length
	const outputText = formatList(resultItems, numbered)

	const resetResult = () => {
		setResultItems([])
		setShuffleCount(0)
		setUnchanged(false)
		setError('')
	}

	const shuffleList = () => {
		if (items.length === 0) {
			setError('Введите хотя бы одну строку')
			return
		}

		if (items.length > MAX_ITEMS) {
			setError('Максимум 10 000 элементов')
			return
		}

		if (items.length === 1) {
			setError(
				'В списке один элемент. Пишите каждый с новой строки или через запятую'
			)
			return
		}

		setError('')
		setIsShuffling(true)

		// Короткая пауза, чтобы было видно, что список перемешался заново.
		setTimeout(() => {
			const shuffled = shuffle(items)
			setResultItems(shuffled)
			setUnchanged(sameOrder(shuffled, items))
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
		resetResult()
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
			resetResult()
		}
		reader.readAsText(file)
		// Тот же файл можно выбрать повторно.
		e.target.value = ''
	}

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: сколько строк на входе и что сделать с
				    результатом. */}
				<div className={toolBar}>
					<span className='text-sm text-muted-foreground'>
						{itemCount}{' '}
						{pluralizeRu(itemCount, ['элемент', 'элемента', 'элементов'])}
						{shuffleCount > 0 && (
							<span className='ml-3'>
								перемешано {shuffleCount}{' '}
								{pluralizeRu(shuffleCount, ['раз', 'раза', 'раз'])}
							</span>
						)}
					</span>

					<button
						type='button'
						onClick={() => setNumbered(v => !v)}
						aria-pressed={numbered}
						className={toolPill(numbered)}
					>
						Нумеровать
					</button>

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
							setError('')
						}}
						placeholder={
							'Каждый элемент с новой строки:\nАня\nБоря\nВика\n\nили в одну строку через запятую'
						}
						spellCheck={false}
						aria-label='Исходный список'
						className='min-h-[10rem] md:min-h-[16rem] resize-none rounded-none border-0 px-5 py-6 font-mono text-base focus-visible:ring-0 sm:px-6 md:border-r md:text-sm'
					/>

					{outputText ? (
						<Textarea
							value={outputText}
							readOnly
							aria-label='Перемешанный список'
							className='min-h-[10rem] md:min-h-[16rem] resize-none rounded-none border-0 bg-muted/20 px-5 py-6 font-mono text-base focus-visible:ring-0 md:text-sm'
						/>
					) : (
						<p className='flex min-h-[10rem] md:min-h-[16rem] items-center justify-center px-5 text-center text-sm text-muted-foreground'>
							Вставьте список слева и нажмите «Перемешать»
						</p>
					)}
				</div>

				<div className={toolFooterBar}>
					{error ? (
						<span className='text-sm text-destructive'>{error}</span>
					) : (
						unchanged && (
							<span className='text-sm text-muted-foreground'>
								Порядок совпал с исходным: при коротком списке так бывает.
								Нажмите ещё раз
							</span>
						)
					)}

					<Button
						onClick={shuffleList}
						disabled={isShuffling}
						className='cursor-pointer gap-2 sm:ml-auto'
					>
						<Shuffle className='h-4 w-4' />
						{isShuffling
							? 'Перемешиваем…'
							: shuffleCount > 0
								? 'Перемешать ещё раз'
								: 'Перемешать'}
					</Button>
				</div>
			</Card>

			<div className='mt-6 space-y-3 text-sm text-muted-foreground'>
				<p>
					Перемешивание списка нужно там, где важна честная очерёдность: порядок
					выступлений, задачи по исполнителям, вопросы в тесте, плейлист.
					Элементы пишите с новой строки или в одну строку через запятую.
					Каждый порядок выпадает с равной вероятностью: список тасуется
					алгоритмом Фишера и Йетса на системном датчике случайных чисел.
				</p>
			</div>

			<ToolScreenshot slug='random-list-generator' />
			<RandomListGeneratorSeo />
		</WidgetSEOWrapper>
	)
}

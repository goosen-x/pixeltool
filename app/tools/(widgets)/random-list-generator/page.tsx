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
		'Элемент 1\nЭлемент 2\nЭлемент 3\nЭлемент 4\nЭлемент 5'
	)
	const [outputText, setOutputText] = useState('')
	const [isShuffling, setIsShuffling] = useState(false)
	const [copiedOutput, setCopiedOutput] = useState(false)
	const [itemCount, setItemCount] = useState(5)
	const [shuffleCount, setShuffleCount] = useState(0)

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
			toast.error('Введите хотя бы один элемент')
			return
		}

		if (items.length > 10000) {
			toast.error('Максимум 10 000 элементов')
			return
		}

		setIsShuffling(true)

		// Add animation delay
		setTimeout(() => {
			const shuffledItems = cryptoShuffle(items)
			setOutputText(shuffledItems.join('\n'))
			setShuffleCount(prev => prev + 1)
			setIsShuffling(false)
			toast.success('Список успешно перемешан!')
		}, 300)
	}

	const copyToClipboard = async () => {
		if (!outputText) {
			toast.error('Нечего копировать')
			return
		}

		try {
			await navigator.clipboard.writeText(outputText)
			setCopiedOutput(true)
			toast.success('Скопировано в буфер обмена')
			setTimeout(() => setCopiedOutput(false), 2000)
		} catch (err) {
			toast.error('Не удалось скопировать')
		}
	}

	const clearAll = () => {
		setInputText('')
		setOutputText('')
		setItemCount(0)
		setShuffleCount(0)
		toast.success('Все данные очищены')
	}

	const resetToOriginal = () => {
		setOutputText('')
		setShuffleCount(0)
		toast.success('Восстановлен исходный порядок')
	}

	const downloadList = () => {
		if (!outputText) {
			toast.error('Нечего скачивать')
			return
		}

		const blob = new Blob([outputText], { type: 'text/plain' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `shuffled-list-${new Date().toISOString().split('T')[0]}.txt`
		a.click()
		URL.revokeObjectURL(url)
		toast.success('Список скачан')
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
			toast.success('Файл успешно загружен')
		}
		reader.readAsText(file)
	}

	if (!mounted) {
		return (
			<div className='max-w-6xl mx-auto space-y-8'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight mb-2'>
						Генератор случайного списка
					</h1>
					<p className='text-muted-foreground'>
						Перемешивайте и сортируйте списки случайным образом с
						криптографической стойкостью
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
								Исходный список (по одному элементу в строке)
							</Label>
							<div className='flex items-center gap-2'>
								<Badge variant='secondary'>
									{itemCount} {itemCount === 1 ? 'элемент' : 'элементов'}
								</Badge>
								<label htmlFor='file-upload' className='cursor-pointer'>
									<Button variant='outline' size='sm' asChild>
										<span>
											<Upload className='w-4 h-4 mr-1' />
											Загрузить
										</span>
									</Button>
									<input
										id='file-upload'
										type='file'
										accept='.txt'
										onChange={handleFileUpload}
										className='hidden'
										aria-label='Загрузить текстовый файл со списком элементов'
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
							placeholder='Введите элементы для перемешивания...'
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
								Перемешать список
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
								Перемешанный результат
							</Label>
							<div className='flex items-center gap-2'>
								{shuffleCount > 0 && (
									<Badge variant='outline'>Перемешано {shuffleCount}x</Badge>
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
											Скопировано
										</>
									) : (
										<>
											<Copy className='w-4 h-4 mr-1' />
											Копировать
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
							placeholder='Здесь появятся перемешанные элементы...'
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
								Перемешать заново
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
						Криптографическая случайность
					</h3>
					<p className='text-xs text-muted-foreground'>
						Использует crypto.getRandomValues() для по-настоящему случайного
						перемешивания — надёжнее, чем Math.random()
					</p>
				</Card>
				<Card className='p-4'>
					<h3 className='font-semibold mb-2 text-sm'>
						Редактируемый результат
					</h3>
					<p className='text-xs text-muted-foreground'>
						Результат можно править прямо в поле вывода перед копированием или
						скачиванием
					</p>
				</Card>
				<Card className='p-4'>
					<h3 className='font-semibold mb-2 text-sm'>
						Обработка на устройстве
					</h3>
					<p className='text-xs text-muted-foreground'>
						Все данные обрабатываются в вашем браузере. Ничего не отправляется
						на сервер
					</p>
				</Card>
			</div>

			{/* Info Section */}
			<Card className='p-6 bg-muted/50'>
				<h3 className='font-semibold mb-3'>Об инструменте</h3>
				<div className='space-y-3 text-sm text-muted-foreground'>
					<p>
						Это веб-приложение случайным образом сортирует элементы списка с
						помощью алгоритма Fisher-Yates и криптографически стойких случайных
						значений. Элементами могут быть имена, участники розыгрыша,
						идентификаторы или числа.
					</p>
					<p>
						Просто введите по одному элементу в строке и нажмите кнопку
						перемешивания, чтобы изменить порядок. Вся обработка происходит в
						вашем браузере — данные никуда не отправляются.
					</p>
					<p>
						Идеально подходит для задач случайной сортировки, которые сложно
						выполнить в Excel. Просто скопируйте и вставьте данные сюда, чтобы
						мгновенно их перемешать.
					</p>
					<Alert className='mt-4'>
						<AlertDescription className='text-xs'>
							Приложение использует crypto.getRandomValues() для повышенной
							случайности вместо Math.random(). Пожалуйста, соблюдайте местное
							законодательство. Ответственность за любые нарушения несёт
							пользователь. Сервис предоставляется «как есть», без каких-либо
							гарантий, явных или подразумеваемых.
						</AlertDescription>
					</Alert>
				</div>
			</Card>
		</div>
	)
}

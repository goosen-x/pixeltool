'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
	Grid3X3,
	Plus,
	Minus,
	Shuffle,
	Copy,
	Share,
	Download,
	RefreshCw,
	CheckCircle,
	Circle,
	Sparkles
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { WidgetInput } from '@/components/widgets/WidgetInput'
import { WidgetOutput } from '@/components/widgets/WidgetOutput'

interface BingoCell {
	id: string
	text: string
	isCompleted: boolean
	isFree?: boolean
}

interface BingoTemplate {
	name: string
	items: string[]
}

export default function BingoGeneratorPage() {
	const [gridSize, setGridSize] = useState(5)
	const [bingoItems, setBingoItems] = useState<string[]>([''])
	const [bingoGrid, setBingoGrid] = useState<BingoCell[]>([])
	const [currentTemplate, setCurrentTemplate] = useState<string>('')
	const [shareUrl, setShareUrl] = useState<string>('')

	// Default bingo templates
	const templates: BingoTemplate[] = [
		{
			name: 'Рабочая встреча',
			items: [
				'Кто-то опоздал на встречу',
				'Технические проблемы со звуком',
				'"Видите мой экран?"',
				'Кто-то забыл включить микрофон',
				'Обсуждение не по теме',
				'"Давайте возьмем это офлайн"',
				'Эхо в динамиках',
				'Кто-то ест во время встречи',
				'"Можете повторить?"',
				'Встреча затянулась',
				'Кто-то подключился по телефону',
				'Проблемы с демонстрацией экрана',
				'"У меня еще одна встреча"',
				'Обсуждение бюджета',
				'Кто-то не подготовился',
				'"Запишем экшн-итемы"',
				'Неловкая пауза',
				'Кто-то работает в многозадачном режиме',
				'"А что думает команда?"',
				'Упоминание дедлайна',
				'Кто-то говорит в выключенный микрофон',
				'"Увидимся на следующей неделе"',
				'Проблемы с календарем',
				'"Отправлю письмо после встречи"',
				'Кто-то подключился поздно'
			]
		},
		{
			name: 'Путешествия',
			items: [
				'Забыли зарядку дома',
				'Очередь на регистрацию',
				'Задержка рейса',
				'Потеряли багаж',
				'Не работает Wi-Fi',
				'Переплата за роуминг',
				'Заблудились в аэропорту',
				'Плохая еда в самолете',
				'Соседи шумят в отеле',
				'Дождь весь отпуск',
				'Закрылись все магазины',
				'Языковой барьер',
				'Переплатили за такси',
				'Не работает карта',
				'Забыли паспорт дома',
				'Турбулентность в самолете',
				'Очередь в музей',
				'Разрядился телефон',
				'Отменили экскурсию',
				'Потеряли ключ от номера',
				'Солнечный ожог',
				'Не влезает в чемодан',
				'Обменяли деньги невыгодно',
				'Заблудились в городе',
				'Проспали экскурсию'
			]
		}
	]

	const generateBingoGrid = useCallback(() => {
		const totalCells = gridSize * gridSize
		const centerIndex = Math.floor(totalCells / 2)
		const isCenterFree = gridSize % 2 === 1

		// Filter out empty items
		const validItems = bingoItems.filter(item => item.trim() !== '')

		if (validItems.length === 0) {
			setBingoGrid([])
			return
		}

		// Create shuffled items array
		let shuffledItems = [...validItems]

		// If we need more items than available, repeat them
		while (shuffledItems.length < totalCells) {
			shuffledItems = [...shuffledItems, ...validItems]
		}

		// Shuffle the items
		for (let i = shuffledItems.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			;[shuffledItems[i], shuffledItems[j]] = [
				shuffledItems[j],
				shuffledItems[i]
			]
		}

		// Create grid cells
		const newGrid: BingoCell[] = []
		for (let i = 0; i < totalCells; i++) {
			const isCenter = isCenterFree && i === centerIndex
			newGrid.push({
				id: `cell-${i}`,
				text: isCenter ? 'СВОБОДНАЯ КЛЕТКА' : shuffledItems[i] || '',
				isCompleted: isCenter, // Free space starts completed
				isFree: isCenter
			})
		}

		setBingoGrid(newGrid)
	}, [gridSize, bingoItems])

	// Initialize grid on load and when size changes
	useEffect(() => {
		generateBingoGrid()
	}, [generateBingoGrid])

	// Load shared bingo from URL parameters
	useEffect(() => {
		const params = new URLSearchParams(window.location.search)
		const sharedData = params.get('data')

		if (sharedData) {
			try {
				const decodedData = JSON.parse(atob(sharedData))
				setGridSize(decodedData.size || 5)
				setBingoItems(decodedData.items || [''])
				if (decodedData.completed) {
					// Apply completed state after grid generation
					setTimeout(() => {
						setBingoGrid(prev =>
							prev.map(cell => ({
								...cell,
								isCompleted: decodedData.completed.includes(cell.id)
							}))
						)
					}, 100)
				}
			} catch (error) {
				toast.error('Неверная ссылка для обмена!')
			}
		}
	}, [])

	const addBingoItem = () => {
		setBingoItems([...bingoItems, ''])
	}

	const removeBingoItem = (index: number) => {
		if (bingoItems.length > 1) {
			const newItems = bingoItems.filter((_, i) => i !== index)
			setBingoItems(newItems)
		}
	}

	const updateBingoItem = (index: number, value: string) => {
		const newItems = [...bingoItems]
		newItems[index] = value
		setBingoItems(newItems)
	}

	const loadTemplate = (templateName: string) => {
		const template = templates.find(t => t.name === templateName)
		if (template) {
			setBingoItems(template.items)
			setCurrentTemplate(templateName)
			toast.success('Шаблон загружен!')
		}
	}

	const toggleCell = (cellId: string) => {
		setBingoGrid(prev =>
			prev.map(cell =>
				cell.id === cellId ? { ...cell, isCompleted: !cell.isCompleted } : cell
			)
		)
	}

	const resetGrid = () => {
		setBingoGrid(prev =>
			prev.map(cell => ({
				...cell,
				isCompleted: cell.isFree || false
			}))
		)
		toast.success('Прогресс сброшен!')
	}

	const shuffleGrid = () => {
		generateBingoGrid()
		toast.success('Карточка перемешана!')
	}

	const checkBingo = (): boolean => {
		const completedCells = bingoGrid
			.filter(cell => cell.isCompleted)
			.map(cell => bingoGrid.indexOf(cell))

		// Check rows
		for (let row = 0; row < gridSize; row++) {
			let rowComplete = true
			for (let col = 0; col < gridSize; col++) {
				const index = row * gridSize + col
				if (!completedCells.includes(index)) {
					rowComplete = false
					break
				}
			}
			if (rowComplete) return true
		}

		// Check columns
		for (let col = 0; col < gridSize; col++) {
			let colComplete = true
			for (let row = 0; row < gridSize; row++) {
				const index = row * gridSize + col
				if (!completedCells.includes(index)) {
					colComplete = false
					break
				}
			}
			if (colComplete) return true
		}

		// Check diagonals
		let diagonal1Complete = true
		let diagonal2Complete = true

		for (let i = 0; i < gridSize; i++) {
			if (!completedCells.includes(i * gridSize + i)) {
				diagonal1Complete = false
			}
			if (!completedCells.includes(i * gridSize + (gridSize - 1 - i))) {
				diagonal2Complete = false
			}
		}

		return diagonal1Complete || diagonal2Complete
	}

	const generateShareUrl = () => {
		const completedIds = bingoGrid
			.filter(cell => cell.isCompleted)
			.map(cell => cell.id)
		const shareData = {
			size: gridSize,
			items: bingoItems.filter(item => item.trim() !== ''),
			completed: completedIds
		}

		const encodedData = btoa(JSON.stringify(shareData))
		const url = `${window.location.origin}${window.location.pathname}?data=${encodedData}`

		navigator.clipboard.writeText(url)
		setShareUrl(url)
		toast.success('Ссылка скопирована в буфер обмена!')
	}

	const exportAsText = () => {
		let textOutput = `Карточка Бинго\n\n`

		for (let row = 0; row < gridSize; row++) {
			for (let col = 0; col < gridSize; col++) {
				const index = row * gridSize + col
				const cell = bingoGrid[index]
				const status = cell.isCompleted ? '✅' : '⬜'
				textOutput += `${status} ${cell.text}\n`
			}
			textOutput += '\n'
		}

		const blob = new Blob([textOutput], { type: 'text/plain' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = 'bingo-card.txt'
		a.click()
		URL.revokeObjectURL(url)

		toast.success('Файл экспортирован!')
	}

	const hasBingo = checkBingo()
	const progress = bingoGrid.filter(cell => cell.isCompleted).length
	const progressPercentage =
		bingoGrid.length > 0 ? (progress / bingoGrid.length) * 100 : 0

	return (
		<div className='space-y-6'>
			{/* Settings Section */}
			<Card className='p-6'>
				<div className='grid md:grid-cols-2 gap-6'>
					<WidgetInput
						label="Размер сетки"
						description="Количество ячеек по вертикали и горизонтали"
					>
						<div className='flex items-center gap-4'>
							<Button
								onClick={() => setGridSize(Math.max(3, gridSize - 1))}
								variant='outline'
								size='sm'
								disabled={gridSize <= 3}
							>
								<Minus className='w-4 h-4' />
							</Button>
							<span className='text-2xl font-bold w-8 text-center'>
								{gridSize}
							</span>
							<Button
								onClick={() => setGridSize(Math.min(7, gridSize + 1))}
								variant='outline'
								size='sm'
								disabled={gridSize >= 7}
							>
								<Plus className='w-4 h-4' />
							</Button>
							<Badge variant='outline'>
								{gridSize}x{gridSize}
							</Badge>
						</div>
					</WidgetInput>

					<div className='space-y-3'>
						<label className='text-sm font-medium'>
							Шаблоны
						</label>
						<p className='text-xs text-muted-foreground'>
							Выберите готовый набор элементов для игры
						</p>
						<div className='flex gap-2 flex-wrap'>
							{templates.map(template => (
								<Button
									key={template.name}
									onClick={() => loadTemplate(template.name)}
									variant={
										currentTemplate === template.name ? 'default' : 'outline'
									}
									size='sm'
								>
									{template.name}
								</Button>
							))}
						</div>
					</div>
				</div>
			</Card>

			{/* Bingo Items Input */}
			<Card className='p-6'>
				<div className='space-y-4'>
					<p className='text-sm text-muted-foreground'>
						Добавьте элементы для вашей карточки бинго. Рекомендуется не менее 25 элементов для сетки 5x5.
					</p>

					{bingoItems.map((item, index) => (
						<div key={index} className='flex items-center gap-3'>
							<span className='text-sm text-muted-foreground w-8'>
								{index + 1}.
							</span>
							<Input
								value={item}
								onChange={e => updateBingoItem(index, e.target.value)}
								placeholder="Введите элемент бинго..."
								className='flex-1'
							/>
							<Button
								onClick={() => removeBingoItem(index)}
								variant='outline'
								size='sm'
								disabled={bingoItems.length <= 1}
							>
								<Minus className='w-4 h-4' />
							</Button>
						</div>
					))}

					<div className='flex gap-2'>
						<Button onClick={addBingoItem} variant='outline' size='sm'>
							<Plus className='w-4 h-4 mr-2' />
							Добавить элемент
						</Button>

						<Button onClick={shuffleGrid} variant='outline' size='sm'>
							<Shuffle className='w-4 h-4 mr-2' />
							Перемешать
						</Button>
					</div>
				</div>
			</Card>

			{/* Bingo Grid */}
			{bingoGrid.length > 0 && (
				<Card className='p-6'>
					<WidgetOutput>
						<div className='space-y-6'>
							{/* Progress and Status */}
							<div className='flex items-center justify-between'>
								<div className='flex items-center gap-4'>
									<Badge
										variant={hasBingo ? 'default' : 'outline'}
										className='flex items-center gap-2'
									>
										{hasBingo ? (
											<CheckCircle className='w-4 h-4' />
										) : (
											<Grid3X3 className='w-4 h-4' />
										)}
										{hasBingo ? 'БИНГО!' : 'В процессе'}
									</Badge>
									<span className='text-sm text-muted-foreground'>
										{progress}/{bingoGrid.length} (
										{progressPercentage.toFixed(0)}%)
									</span>
								</div>

								<div className='flex gap-2'>
									<Button onClick={resetGrid} variant='outline' size='sm'>
										<RefreshCw className='w-4 h-4 mr-2' />
										Сбросить
									</Button>
									<Button
										onClick={generateShareUrl}
										variant='outline'
										size='sm'
									>
										<Share className='w-4 h-4 mr-2' />
										Поделиться
									</Button>
									<Button onClick={exportAsText} variant='outline' size='sm'>
										<Download className='w-4 h-4 mr-2' />
										Скачать
									</Button>
								</div>
							</div>

							{/* Bingo Grid */}
							<div
								className='grid gap-2 mx-auto max-w-6xl'
								style={{
									gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
									aspectRatio: '1'
								}}
							>
								{bingoGrid.map((cell, index) => (
									<button
										key={cell.id}
										onClick={() => !cell.isFree && toggleCell(cell.id)}
										className={cn(
											'p-3 rounded-lg border-2 transition-all duration-200 text-xs font-medium',
											'hover:scale-105 active:scale-95',
											'min-h-[80px] flex items-center justify-center text-center',
											cell.isCompleted
												? 'bg-green-500/20 border-green-500 text-green-700 dark:text-green-300'
												: 'bg-muted/30 border-muted-foreground/20 hover:border-primary/50',
											cell.isFree &&
												'bg-yellow-500/20 border-yellow-500 text-yellow-700 dark:text-yellow-300'
										)}
										disabled={cell.isFree}
									>
										<div className='space-y-1'>
											<div className='flex items-center justify-center'>
												{cell.isCompleted ? (
													<CheckCircle className='w-4 h-4 text-green-600' />
												) : (
													<Circle className='w-4 h-4 opacity-50' />
												)}
											</div>
											<span className='leading-tight'>{cell.text}</span>
										</div>
									</button>
								))}
							</div>

							{hasBingo && (
								<div className='text-center py-4'>
									<div className='flex items-center justify-center gap-2 mb-2'>
										<Sparkles className='w-6 h-6 text-yellow-500' />
										<span className='text-2xl font-bold text-yellow-600 dark:text-yellow-400'>
											Поздравляем!
										</span>
										<Sparkles className='w-6 h-6 text-yellow-500' />
									</div>
									<p className='text-muted-foreground'>
										Вы собрали линию и выиграли в бинго!
									</p>
								</div>
							)}
						</div>
					</WidgetOutput>
				</Card>
			)}

			{/* Info Section */}
			<Card className='p-6'>
				<div className='grid md:grid-cols-2 gap-6 text-sm'>
					<div className='space-y-3'>
						<div>
							<h4 className='font-medium mb-1'>Как играть</h4>
							<ul className='text-muted-foreground space-y-1'>
								<li>• Создайте сетку с вашими элементами</li>
								<li>• Нажимайте на ячейки для отметки</li>
								<li>• Соберите линию по горизонтали, вертикали или диагонали</li>
								<li>• Поделитесь прогрессом с друзьями</li>
							</ul>
						</div>
					</div>
					<div className='space-y-3'>
						<div>
							<h4 className='font-medium mb-1'>Возможности</h4>
							<ul className='text-muted-foreground space-y-1'>
								<li>• Готовые шаблоны для разных тем</li>
								<li>• Ссылки для обмена с сохранением прогресса</li>
								<li>• Экспорт карточки в текстовый файл</li>
								<li>• Отслеживание прогресса игры</li>
							</ul>
						</div>
					</div>
				</div>
			</Card>
		</div>
	)
}

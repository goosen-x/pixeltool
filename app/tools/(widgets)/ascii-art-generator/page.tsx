'use client'

import { useState, useRef } from 'react'
import {
	Type,
	Image as ImageIcon,
	Download,
	Copy,
	Palette,
	FileText
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import {
	WidgetLayout,
	WidgetSection,
	WidgetForm,
	WidgetInfo,
	WidgetTips,
	WidgetTutorial,
	type InputField
} from '@/components/widgets'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import type { BaseWidgetConfig } from '@/lib/types/widget-base'
import {
	asciiPatterns,
	asciiCategories,
	asciiCharsets,
	type AsciiCharset
} from '@/lib/data/ascii-art-data'
import {
	textToAscii,
	imageToAscii,
	createAsciiImage,
	downloadAsciiAsImage,
	downloadAsciiAsText
} from '@/lib/utils/ascii-converter'

export default function AsciiArtGeneratorPage() {
	const [activeTab, setActiveTab] = useState<'text' | 'image' | 'patterns'>(
		'text'
	)
	const [asciiOutput, setAsciiOutput] = useState('')
	const [selectedPattern, setSelectedPattern] = useState('')
	const [imagePreview, setImagePreview] = useState<string | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [showTutorial, setShowTutorial] = useState(false)

	const config: BaseWidgetConfig = {
		title: 'Генератор ASCII-арта',
		description:
			'Преобразуйте текст и изображения в ASCII-арт или используйте готовые шаблоны',
		icon: <Type className='w-6 h-6' />,
		category: 'Creative Tools',
		keywords: ['ascii', 'art', 'text', 'image', 'converter', 'generator']
	}

	// Text to ASCII fields
	const textFields: InputField[] = [
		{
			name: 'text',
			label: 'Текст для преобразования',
			type: 'text',
			placeholder: 'Введите текст для преобразования в ASCII-арт',
			required: true,
			icon: <Type className='w-4 h-4' />
		},
		{
			name: 'font',
			label: 'Стиль шрифта',
			type: 'select',
			value: 'standard',
			options: [
				{ label: 'Стандартный', value: 'standard' },
				{ label: 'Мелкий', value: 'small' },
				{ label: 'Крупный', value: 'big' }
			]
		}
	]

	// Image to ASCII fields
	const imageFields: InputField[] = [
		{
			name: 'width',
			label: 'Ширина (в символах)',
			type: 'slider',
			value: 80,
			min: 40,
			max: 200,
			step: 10
		},
		{
			name: 'charset',
			label: 'Набор символов',
			type: 'select',
			value: 'basic',
			options: Object.entries(asciiCharsets).map(([key, value]) => ({
				label: `${key.charAt(0).toUpperCase() + key.slice(1)} (${value.slice(0, 10)}...)`,
				value: key
			}))
		},
		{
			name: 'invert',
			label: 'Инвертировать яркость',
			type: 'switch',
			value: false
		}
	]

	const handleTextToAscii = (data: Record<string, any>) => {
		const { text, font } = data
		const ascii = textToAscii(text, font)
		setAsciiOutput(ascii)
		toast.success('Текст преобразован в ASCII-арт!')
	}

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		const reader = new FileReader()
		reader.onload = event => {
			const img = new window.Image()
			img.onload = () => {
				const canvas = document.createElement('canvas')
				const ctx = canvas.getContext('2d')!

				canvas.width = img.width
				canvas.height = img.height
				ctx.drawImage(img, 0, 0)

				const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
				setImagePreview(event.target?.result as string)

				// Auto convert with default settings
				const ascii = imageToAscii(imageData, {
					width: 80,
					charset: 'basic',
					invert: false
				})
				setAsciiOutput(ascii)
				toast.success('Изображение преобразовано в ASCII-арт!')
			}
			img.src = event.target?.result as string
		}
		reader.readAsDataURL(file)
	}

	const handleImageToAscii = (data: Record<string, any>) => {
		if (!imagePreview) {
			toast.error('Сначала загрузите изображение')
			return
		}

		const img = new window.Image()
		img.onload = () => {
			const canvas = document.createElement('canvas')
			const ctx = canvas.getContext('2d')!

			canvas.width = img.width
			canvas.height = img.height
			ctx.drawImage(img, 0, 0)

			const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
			const ascii = imageToAscii(imageData, {
				width: data.width,
				charset: data.charset as AsciiCharset,
				invert: data.invert
			})

			setAsciiOutput(ascii)
			toast.success('Изображение преобразовано с новыми настройками!')
		}
		img.src = imagePreview
	}

	const handlePatternSelect = (patternId: string) => {
		const pattern = asciiPatterns.find(p => p.id === patternId)
		if (pattern) {
			setAsciiOutput(pattern.pattern.trim())
			setSelectedPattern(patternId)
			toast.success(`Выбран шаблон «${pattern.name}»`)
		}
	}

	const handleCopyAscii = async () => {
		if (!asciiOutput) {
			toast.error('Нет ASCII-арта для копирования')
			return
		}
		try {
			await navigator.clipboard.writeText(asciiOutput)
			toast.success('ASCII-арт скопирован в буфер обмена!')
		} catch (error) {
			toast.error('Не удалось скопировать')
		}
	}

	const handleDownloadText = () => {
		downloadAsciiAsText(asciiOutput, 'ascii-art.txt')
		toast.success('Скачано в виде текстового файла!')
	}

	const handleDownloadImage = () => {
		downloadAsciiAsImage(asciiOutput, 'ascii-art.png', {
			fontSize: 12,
			color: '#000000',
			background: '#FFFFFF'
		})
		toast.success('Скачано в виде изображения!')
	}

	// Tutorial steps
	const tutorialSteps = [
		{
			id: 'welcome',
			title: 'Добро пожаловать в генератор ASCII-арта',
			description:
				'Этот инструмент помогает создавать ASCII-арт из текста, изображений или готовых шаблонов'
		},
		{
			id: 'tabs',
			title: 'Выберите тип ввода',
			description:
				'Выберите «Текст в ASCII» для арта из текста, «Изображение в ASCII» для конвертации фото или «Шаблоны» для готовых образцов',
			element: '.tabs-list',
			position: 'bottom' as const
		},
		{
			id: 'text-input',
			title: 'Введите текст',
			description: 'Наберите здесь любой текст и выберите стиль шрифта',
			element: 'input[name="text"]',
			position: 'top' as const,
			action: {
				type: 'input' as const,
				target: 'input[name="text"]',
				value: 'Hello ASCII!'
			}
		},
		{
			id: 'generate',
			title: 'Создайте ASCII-арт',
			description: 'Нажмите эту кнопку, чтобы создать ASCII-арт',
			element: 'button:has-text("Создать ASCII-арт")',
			position: 'top' as const,
			action: {
				type: 'click' as const,
				target: 'button:has-text("Создать ASCII-арт")'
			}
		},
		{
			id: 'copy',
			title: 'Копирование и скачивание',
			description:
				'Скопируйте результат в буфер обмена или скачайте как текстовый файл либо изображение',
			element: '.ascii-output',
			position: 'top' as const
		}
	]

	// Widget tips
	const asciiTips = [
		{
			id: 'font-styles',
			title: 'Несколько стилей шрифта',
			description:
				'Пробуйте разные стили шрифтов для различных художественных эффектов',
			category: 'basic' as const
		},
		{
			id: 'image-quality',
			title: 'Советы по качеству изображения',
			description:
				'Используйте контрастные изображения с чётким объектом для лучшего результата',
			category: 'advanced' as const
		},
		{
			id: 'width-adjustment',
			title: 'Настройка ширины',
			description: 'Меняйте ширину под ваш экран или конкретную задачу',
			category: 'basic' as const
		},
		{
			id: 'keyboard-shortcut',
			title: 'Быстрое создание',
			description: 'Нажмите Ctrl/Cmd + Enter, чтобы быстро создать ASCII-арт',
			category: 'shortcut' as const
		},
		{
			id: 'export-options',
			title: 'Варианты экспорта',
			description:
				'Скачивайте PNG для соцсетей или TXT для комментариев в коде',
			category: 'pro' as const
		}
	]

	return (
		<div className='space-y-6'>
			{/* Tips and Tutorial */}
			<div className='flex flex-col sm:flex-row gap-4 justify-between items-start'>
				<WidgetTips
					tips={asciiTips}
					widgetId='ascii-art-generator'
					variant='inline'
					className='flex-1'
				/>
				{!showTutorial && (
					<WidgetTutorial
						steps={tutorialSteps}
						widgetId='ascii-art-generator'
						onComplete={() => {
							toast.success(
								'Обучение пройдено! Теперь вы готовы создавать ASCII-арт'
							)
							setShowTutorial(false)
						}}
					/>
				)}
			</div>
			<Tabs value={activeTab} onValueChange={v => setActiveTab(v as any)}>
				<TabsList className='grid w-full grid-cols-3'>
					<TabsTrigger value='text' className='flex items-center gap-2'>
						<Type className='w-4 h-4' />
						Текст в ASCII
					</TabsTrigger>
					<TabsTrigger value='image' className='flex items-center gap-2'>
						<ImageIcon className='w-4 h-4' />
						Изображение в ASCII
					</TabsTrigger>
					<TabsTrigger value='patterns' className='flex items-center gap-2'>
						<Palette className='w-4 h-4' />
						Шаблоны
					</TabsTrigger>
				</TabsList>

				<TabsContent value='text' className='mt-6'>
					<WidgetForm
						fields={textFields}
						onSubmit={handleTextToAscii}
						submitLabel='Создать ASCII-арт'
					/>
				</TabsContent>

				<TabsContent value='image' className='mt-6 space-y-4'>
					<Card className='p-6'>
						<div className='space-y-4'>
							<div>
								<label className='block text-sm font-medium mb-2'>
									Загрузить изображение
								</label>
								<input
									ref={fileInputRef}
									type='file'
									accept='image/*'
									onChange={handleImageUpload}
									aria-label='Загрузить изображение'
									className='block w-full text-sm text-muted-foreground
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary file:text-primary-foreground
                      hover:file:bg-primary/90'
								/>
							</div>

							{imagePreview && (
								<div className='space-y-2'>
									<p className='text-sm text-muted-foreground'>Предпросмотр:</p>
									<Image
										src={imagePreview}
										alt='Предпросмотр загруженного изображения'
										width={300}
										height={200}
										className='max-w-xs rounded-lg border'
									/>
								</div>
							)}
						</div>
					</Card>

					{imagePreview && (
						<WidgetForm
							fields={imageFields}
							onSubmit={handleImageToAscii}
							submitLabel='Обновить ASCII-арт'
							showReset={false}
						/>
					)}
				</TabsContent>

				<TabsContent value='patterns' className='mt-6'>
					<div className='space-y-4'>
						{Object.entries(asciiCategories).map(([category, label]) => (
							<div key={category}>
								<h3 className='font-semibold mb-3'>{label}</h3>
								<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
									{asciiPatterns
										.filter(p => p.category === category)
										.map(pattern => (
											<Card
												key={pattern.id}
												className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
													selectedPattern === pattern.id
														? 'ring-2 ring-primary'
														: ''
												}`}
												onClick={() => handlePatternSelect(pattern.id)}
											>
												<h4 className='font-medium text-sm mb-2'>
													{pattern.name}
												</h4>
												<pre className='text-xs overflow-hidden whitespace-pre font-mono'>
													{pattern.pattern
														.trim()
														.split('\n')
														.slice(0, 3)
														.join('\n')}
													...
												</pre>
											</Card>
										))}
								</div>
							</div>
						))}
					</div>
				</TabsContent>
			</Tabs>

			{/* ASCII Output */}
			{asciiOutput && (
				<Card className='p-6'>
					<div className='flex items-center justify-between mb-4'>
						<h3 className='font-semibold'>Результат ASCII-арта</h3>
						<div className='flex items-center gap-2'>
							<Button onClick={handleCopyAscii} variant='outline' size='sm'>
								<Copy className='w-4 h-4 mr-2' />
								Копировать
							</Button>
							<Button onClick={handleDownloadText} variant='outline' size='sm'>
								<FileText className='w-4 h-4 mr-2' />
								Скачать текст
							</Button>
							<Button onClick={handleDownloadImage} variant='outline' size='sm'>
								<Download className='w-4 h-4 mr-2' />
								Скачать изображение
							</Button>
						</div>
					</div>

					<div className='relative'>
						<Textarea
							value={asciiOutput}
							readOnly
							className='font-mono text-xs leading-none h-96 resize-none'
							style={{ lineHeight: '1.2' }}
						/>
						<Badge variant='secondary' className='absolute top-2 right-2'>
							{asciiOutput.split('\n').length} строк
						</Badge>
					</div>
				</Card>
			)}

			<WidgetInfo
				howToUse={[
					'Текст в ASCII: введите любой текст и выберите стиль шрифта',
					'Изображение в ASCII: загрузите изображение для преобразования в ASCII-символы',
					'Шаблоны: просматривайте и выбирайте готовые образцы ASCII-арта',
					'Настраивайте параметры изображения — ширину и набор символов',
					'Скопируйте результат или скачайте как текстовый файл либо изображение'
				]}
				features={[
					'Преобразование текста в ASCII-арт с несколькими стилями шрифта',
					'Превращение изображений в ASCII-арт с настраиваемыми параметрами',
					'Библиотека готовых шаблонов ASCII-арта',
					'Несколько наборов символов для разных стилей',
					'Экспорт в текстовый файл или изображение PNG',
					'Предпросмотр и настройка в реальном времени'
				]}
				tips={[
					'Используйте простые контрастные изображения для лучшего результата',
					'Подбирайте ширину под то, где будете использовать ASCII-арт',
					'Пробуйте разные наборы символов для различных художественных эффектов',
					'Инвертируйте яркость для лучшего результата с тёмными изображениями'
				]}
				warnings={[
					'Обработка больших изображений может занять время',
					'ASCII-арт лучше всего выглядит с моноширинными шрифтами',
					'При конвертации изображения часть деталей будет потеряна'
				]}
			/>
		</div>
	)
}

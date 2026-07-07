'use client'

import React, { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { WidgetWrapper } from '@/components/widgets/WidgetWrapper'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	Upload,
	Download,
	Image as ImageIcon,
	Palette,
	Grid3x3,
	Monitor
} from 'lucide-react'
import { toast } from 'sonner'

// Favicon sizes for different platforms
const FAVICON_SIZES = [
	{ size: 16, name: 'Классический фавикон', format: 'ico' },
	{ size: 32, name: 'Стандартный фавикон', format: 'png' },
	{ size: 48, name: 'Иконка сайта Windows', format: 'png' },
	{ size: 57, name: 'Экран «Домой» iOS', format: 'png' },
	{ size: 76, name: 'Экран «Домой» iPad', format: 'png' },
	{ size: 120, name: 'iPhone Retina', format: 'png' },
	{ size: 152, name: 'iPad Retina', format: 'png' },
	{ size: 180, name: 'iPhone X/11/12', format: 'png' },
	{ size: 192, name: 'Android Chrome', format: 'png' },
	{ size: 512, name: 'Android Chrome (большой)', format: 'png' }
]

export default function FaviconGeneratorPage() {
	const [selectedImage, setSelectedImage] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string>('')
	const [generatedFavicons, setGeneratedFavicons] = useState<
		Array<{
			size: number
			name: string
			format: string
			dataUrl: string
		}>
	>([])
	const [isGenerating, setIsGenerating] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)

	const handleImageUpload = useCallback((file: File) => {
		if (!file.type.startsWith('image/')) {
			toast.error('Выберите корректный файл изображения')
			return
		}

		if (file.size > 5 * 1024 * 1024) {
			// 5MB limit
			toast.error('Размер изображения должен быть меньше 5 МБ')
			return
		}

		setSelectedImage(file)
		const reader = new FileReader()
		reader.onload = e => {
			setPreviewUrl(e.target?.result as string)
		}
		reader.readAsDataURL(file)
		toast.success('Изображение загружено')
	}, [])

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			handleImageUpload(file)
		}
	}

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault()
		const file = e.dataTransfer.files[0]
		if (file) {
			handleImageUpload(file)
		}
	}

	const generateFavicons = useCallback(async () => {
		if (!selectedImage || !previewUrl) {
			toast.error('Сначала выберите изображение')
			return
		}

		setIsGenerating(true)
		const canvas = canvasRef.current
		const ctx = canvas?.getContext('2d')
		if (!canvas || !ctx) return

		const img = new window.Image()
		img.onload = () => {
			const favicons = FAVICON_SIZES.map(({ size, name, format }) => {
				canvas.width = size
				canvas.height = size

				// Clear canvas
				ctx.clearRect(0, 0, size, size)

				// Draw image with proper scaling
				const minDim = Math.min(img.width, img.height)
				const x = (img.width - minDim) / 2
				const y = (img.height - minDim) / 2

				ctx.drawImage(img, x, y, minDim, minDim, 0, 0, size, size)

				// Convert to data URL
				const dataUrl = canvas.toDataURL(
					`image/${format === 'ico' ? 'png' : format}`
				)

				return {
					size,
					name,
					format,
					dataUrl
				}
			})

			setGeneratedFavicons(favicons)
			setIsGenerating(false)
			toast.success(`Создано размеров фавикона: ${favicons.length}`)
		}

		img.src = previewUrl
	}, [selectedImage, previewUrl])

	const downloadFavicon = (favicon: (typeof generatedFavicons)[0]) => {
		const link = document.createElement('a')
		link.download = `favicon-${favicon.size}x${favicon.size}.${favicon.format}`
		link.href = favicon.dataUrl
		link.click()
		toast.success(`Скачано: ${favicon.name}`)
	}

	const downloadAll = () => {
		if (generatedFavicons.length === 0) {
			toast.error('Нет фавиконов для скачивания')
			return
		}

		generatedFavicons.forEach((favicon, index) => {
			setTimeout(() => {
				downloadFavicon(favicon)
			}, index * 100) // Small delay between downloads
		})
		toast.success('Скачивание всех фавиконов...')
	}

	return (
		<WidgetWrapper>
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* Upload Section */}
				<div className='space-y-4'>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Upload className='w-4 h-4' />
								Загрузка изображения
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div
								className='border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center transition-colors hover:border-muted-foreground/50'
								onDrop={handleDrop}
								onDragOver={e => e.preventDefault()}
								onClick={() => fileInputRef.current?.click()}
							>
								<ImageIcon className='w-12 h-12 mx-auto mb-4 text-muted-foreground' />
								<p className='text-sm text-muted-foreground mb-2'>
									Перетащите изображение сюда или нажмите для загрузки
								</p>
								<p className='text-xs text-muted-foreground'>
									Поддерживает PNG, JPG, SVG • Макс. 5 МБ
								</p>
								<input
									ref={fileInputRef}
									type='file'
									accept='image/*'
									onChange={handleFileSelect}
									className='hidden'
									aria-label='Загрузить файл изображения для генерации фавикона'
								/>
							</div>

							{previewUrl && (
								<div className='space-y-3'>
									<h4 className='text-sm font-medium'>Предпросмотр</h4>
									<div className='bg-muted rounded-lg p-4 flex justify-center'>
										<div className='relative w-32 h-32'>
											<Image
												src={previewUrl}
												alt='Предпросмотр'
												fill
												className='object-contain rounded'
											/>
										</div>
									</div>
								</div>
							)}

							<Button
								onClick={generateFavicons}
								disabled={!selectedImage || isGenerating}
								className='w-full'
							>
								<Grid3x3 className='w-4 h-4 mr-2' />
								{isGenerating ? 'Генерация...' : 'Сгенерировать фавиконы'}
							</Button>
						</CardContent>
					</Card>

					{/* Tips */}
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Palette className='w-4 h-4' />
								Советы для лучшего результата
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-2 text-sm text-muted-foreground'>
							<p>• Используйте квадратные изображения (соотношение 1:1)</p>
							<p>• Минимальный рекомендуемый размер: 512x512px</p>
							<p>
								• Простые, контрастные изображения лучше смотрятся в малых
								размерах
							</p>
							<p>• Избегайте мелких деталей, которые не видны при 16px</p>
							<p>• Высокий контраст обеспечивает лучшую видимость</p>
						</CardContent>
					</Card>
				</div>

				{/* Generated Favicons */}
				<div className='space-y-4'>
					<Card>
						<CardHeader className='flex flex-row items-center justify-between'>
							<CardTitle className='flex items-center gap-2'>
								<Monitor className='w-4 h-4' />
								Сгенерированные фавиконы ({generatedFavicons.length})
							</CardTitle>
							{generatedFavicons.length > 0 && (
								<Button onClick={downloadAll} size='sm'>
									<Download className='w-4 h-4 mr-2' />
									Скачать все
								</Button>
							)}
						</CardHeader>
						<CardContent>
							{generatedFavicons.length === 0 ? (
								<div className='text-center py-8 text-muted-foreground'>
									<ImageIcon className='w-8 h-8 mx-auto mb-2 opacity-50' />
									<p>Фавиконы ещё не сгенерированы</p>
								</div>
							) : (
								<div className='space-y-3'>
									{generatedFavicons.map((favicon, index) => (
										<div
											key={index}
											className='flex items-center justify-between p-3 rounded-lg border bg-muted/30'
										>
											<div className='flex items-center gap-3'>
												<div className='flex-shrink-0'>
													<div
														className='relative rounded overflow-hidden'
														style={{
															width: Math.min(favicon.size, 32),
															height: Math.min(favicon.size, 32)
														}}
													>
														<Image
															src={favicon.dataUrl}
															alt={favicon.name}
															fill
															className='object-contain'
														/>
													</div>
												</div>
												<div>
													<p className='text-sm font-medium'>{favicon.name}</p>
													<div className='flex items-center gap-2 text-xs text-muted-foreground'>
														<Badge variant='outline' className='text-xs'>
															{favicon.size}×{favicon.size}
														</Badge>
														<Badge variant='outline' className='text-xs'>
															{favicon.format.toUpperCase()}
														</Badge>
													</div>
												</div>
											</div>
											<Button
												size='sm'
												variant='outline'
												onClick={() => downloadFavicon(favicon)}
											>
												<Download className='w-3 h-3' />
											</Button>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>

					{/* Usage Info */}
					{generatedFavicons.length > 0 && (
						<Card>
							<CardHeader>
								<CardTitle className='text-sm'>Как использовать</CardTitle>
							</CardHeader>
							<CardContent className='space-y-2 text-xs text-muted-foreground'>
								<p>
									<strong>HTML:</strong> Добавьте в секцию &lt;head&gt;:
								</p>
								<code className='inline-code block'>
									{`<link rel="icon" href="/favicon-32x32.png" sizes="32x32">`}
									<br />
									{`<link rel="icon" href="/favicon-16x16.png" sizes="16x16">`}
									<br />
									{`<link rel="apple-touch-icon" href="/favicon-180x180.png">`}
								</code>
							</CardContent>
						</Card>
					)}
				</div>
			</div>

			{/* Hidden canvas for image processing */}
			<canvas ref={canvasRef} className='hidden' width={512} height={512} />
		</WidgetWrapper>
	)
}

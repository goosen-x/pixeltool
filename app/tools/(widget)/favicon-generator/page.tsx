'use client'

import React, { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { WidgetWrapper } from '@/components/widgets/WidgetWrapper'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, Download, Grid3x3 } from 'lucide-react'
import { toast } from 'sonner'
import JSZip from 'jszip'
import { buildIco, buildIcoBuffer } from '@/lib/favicon/ico'
import { FaviconGuide } from './FaviconGuide'
import { FaviconLookup } from './FaviconLookup'

/** Размеры, которые кладём в favicon.ico — так его собирают все генераторы. */
const ICO_SIZES = [16, 32, 48]

/** Кладём и в архив, и на страницу — чтобы не разъезжались. */
const HEAD_SNIPPET = `<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon-32x32.png" type="image/png">
<link rel="apple-touch-icon" href="/favicon-180x180.png">`

// Favicon sizes for different platforms
const FAVICON_SIZES = [
	// Канвас отдаёт только PNG. Настоящий .ico собирается отдельно из 16/32/48.
	{ size: 16, name: 'Классический фавикон', format: 'png' },
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

				const dataUrl = canvas.toDataURL(`image/${format}`)

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

	/** data:image/png;base64,… → сырые байты PNG. */
	const dataUrlToBytes = (dataUrl: string): ArrayBuffer => {
		const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1)
		const binary = atob(base64)
		const bytes = new Uint8Array(binary.length)
		for (let i = 0; i < binary.length; i++) {
			bytes[i] = binary.charCodeAt(i)
		}
		return bytes.buffer
	}

	const downloadIco = () => {
		const frames = ICO_SIZES.map(size => {
			const favicon = generatedFavicons.find(item => item.size === size)
			return favicon ? { size, png: dataUrlToBytes(favicon.dataUrl) } : null
		}).filter(
			(frame): frame is { size: number; png: ArrayBuffer } => frame !== null
		)

		if (frames.length === 0) {
			toast.error('Сначала загрузите картинку')
			return
		}

		const url = URL.createObjectURL(buildIco(frames))
		const link = document.createElement('a')
		link.download = 'favicon.ico'
		link.href = url
		link.click()
		URL.revokeObjectURL(url)
		toast.success('Скачан favicon.ico — внутри 16, 32 и 48 пикселей')
	}

	/**
	 * Раньше здесь запускалось десять скачиваний подряд через setTimeout —
	 * браузеры блокируют такое после второго-третьего файла. Отдаём архив.
	 */
	const downloadAll = async () => {
		if (generatedFavicons.length === 0) {
			toast.error('Нет фавиконов для скачивания')
			return
		}

		const zip = new JSZip()

		for (const favicon of generatedFavicons) {
			zip.file(
				`favicon-${favicon.size}x${favicon.size}.png`,
				dataUrlToBytes(favicon.dataUrl)
			)
		}

		const icoFrames = ICO_SIZES.map(size =>
			generatedFavicons.find(item => item.size === size)
		).filter(Boolean) as typeof generatedFavicons

		if (icoFrames.length > 0) {
			zip.file(
				'favicon.ico',
				buildIcoBuffer(
					icoFrames.map(item => ({
						size: item.size,
						png: dataUrlToBytes(item.dataUrl)
					}))
				)
			)
		}

		zip.file('head.html', HEAD_SNIPPET)

		const blob = await zip.generateAsync({ type: 'blob' })
		const url = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.download = 'favicon.zip'
		link.href = url
		link.click()
		URL.revokeObjectURL(url)
		toast.success('Скачан favicon.zip')
	}

	return (
		<WidgetWrapper>
			<Card>
				<CardContent className='space-y-6 pt-6'>
					{/* Шаг 1 — картинка */}
					<div className='grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center'>
						<div
							className='cursor-pointer rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 text-center transition-colors hover:border-muted-foreground/50'
							onDrop={handleDrop}
							onDragOver={e => e.preventDefault()}
							onClick={() => fileInputRef.current?.click()}
						>
							<Upload className='mx-auto mb-2 h-8 w-8 text-muted-foreground' />
							<p className='text-sm'>
								Перетащите картинку или нажмите, чтобы выбрать
							</p>
							<p className='mt-1 text-xs text-muted-foreground'>
								PNG, JPG, SVG до 5 МБ. Лучше всего — квадрат от 512 пикселей:
								мелкие детали при 16 пикселях всё равно не видны.
							</p>
							<input
								ref={fileInputRef}
								type='file'
								accept='image/*'
								onChange={handleFileSelect}
								className='hidden'
								aria-label='Загрузить изображение для генерации фавикона'
							/>
						</div>

						{previewUrl && (
							<div className='relative mx-auto h-24 w-24 overflow-hidden rounded-lg bg-muted'>
								<Image
									src={previewUrl}
									alt='Предпросмотр загруженной картинки'
									fill
									className='object-contain p-2'
								/>
							</div>
						)}
					</div>

					<Button
						onClick={generateFavicons}
						disabled={!selectedImage || isGenerating}
						className='w-full cursor-pointer'
					>
						<Grid3x3 className='mr-2 h-4 w-4' />
						{isGenerating ? 'Генерация…' : 'Сгенерировать фавиконы'}
					</Button>

					{/* Шаг 2 — результат */}
					{generatedFavicons.length > 0 && (
						<>
							<div>
								<h3 className='mb-3 text-sm font-medium'>
									Размеры ({generatedFavicons.length})
								</h3>
								<div className='grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5'>
									{generatedFavicons.map(favicon => (
										<button
											key={favicon.size}
											type='button'
											onClick={() => downloadFavicon(favicon)}
											title={`${favicon.name} — скачать`}
											className='flex cursor-pointer flex-col items-center gap-1 rounded-lg border bg-muted/30 p-3 transition-colors hover:bg-muted'
										>
											<div className='relative h-8 w-8'>
												<Image
													src={favicon.dataUrl}
													alt={favicon.name}
													fill
													className='object-contain'
												/>
											</div>
											<span className='text-xs font-medium'>
												{favicon.size}×{favicon.size}
											</span>
											<span className='text-[0.625rem] text-muted-foreground'>
												{favicon.name}
											</span>
										</button>
									))}
								</div>
								<p className='mt-2 text-xs text-muted-foreground'>
									Нажмите на размер, чтобы скачать его отдельно.
								</p>
							</div>

							{/* Шаг 3 — скачивание */}
							<div className='grid gap-2 sm:grid-cols-2'>
								<Button onClick={downloadAll} className='cursor-pointer'>
									<Download className='mr-2 h-4 w-4' />
									Скачать всё архивом
								</Button>
								<Button
									variant='outline'
									onClick={downloadIco}
									className='cursor-pointer'
								>
									<Download className='mr-2 h-4 w-4' />
									Только favicon.ico
								</Button>
							</div>

							{/* Шаг 4 — как подключить */}
							<div className='space-y-2 rounded-lg border bg-muted/30 p-4'>
								<h3 className='text-sm font-medium'>Как подключить</h3>
								<p className='text-xs text-muted-foreground'>
									В архиве лежат PNG всех размеров и настоящий{' '}
									<code className='font-mono'>favicon.ico</code> — внутри него
									сразу 16, 32 и 48 пикселей, браузер сам возьмёт нужный.
									Положите файлы в корень сайта и добавьте в{' '}
									<code className='font-mono'>&lt;head&gt;</code>:
								</p>
								<pre className='overflow-x-auto rounded bg-background p-3 text-xs'>
									<code className='font-mono'>{HEAD_SNIPPET}</code>
								</pre>
								<p className='text-xs text-muted-foreground'>
									Первая строка — для вкладок и старых браузеров, вторая даёт
									чёткую иконку на плотных экранах, третья нужна, когда сайт
									сохраняют на домашний экран айфона.
								</p>
							</div>
						</>
					)}

					<div className='border-t pt-6'>
						<FaviconLookup />
					</div>
				</CardContent>
			</Card>

			<FaviconGuide />

			{/* Скрытый канвас для перерисовки картинки */}
			<canvas ref={canvasRef} className='hidden' width={512} height={512} />
		</WidgetWrapper>
	)
}

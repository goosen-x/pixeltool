'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, Download, FileDown, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import { toolBar, toolIconButton } from '@/lib/ui/tool-pill'
import JSZip from 'jszip'
import { buildIco, buildIcoBuffer } from '@/lib/favicon/ico'
import { FaviconGuide } from './FaviconGuide'
import { FaviconLookup } from './FaviconLookup'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'

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
	const [copied, setCopied] = useState(false)
	const [generatedFavicons, setGeneratedFavicons] = useState<
		Array<{
			size: number
			name: string
			format: string
			dataUrl: string
		}>
	>([])
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
		if (!selectedImage || !previewUrl) return

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
		}

		img.src = previewUrl
	}, [selectedImage, previewUrl])

	// Фавиконы генерируются сами, как только загружена картинка — отдельная
	// кнопка «Сгенерировать» не нужна.
	useEffect(() => {
		if (selectedImage && previewUrl) void generateFavicons()
	}, [selectedImage, previewUrl, generateFavicons])

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

	const copySnippet = () => {
		navigator.clipboard.writeText(HEAD_SNIPPET)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: что загружено и что с этим сделать. */}
				<div className={toolBar}>
					<span className='text-sm text-muted-foreground'>
						{generatedFavicons.length > 0
							? `${generatedFavicons.length} размеров готово`
							: 'Картинка не выбрана'}
					</span>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => fileInputRef.current?.click()}
							title='Выбрать картинку'
							className={toolIconButton}
						>
							<Upload className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={downloadIco}
							disabled={generatedFavicons.length === 0}
							title='Скачать только favicon.ico'
							className={toolIconButton}
						>
							<FileDown className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={downloadAll}
							disabled={generatedFavicons.length === 0}
							title='Скачать всё архивом'
							className={toolIconButton}
						>
							<Download className='h-4 w-4' />
						</Button>
					</div>
				</div>

				{/* Рабочая область — она же зона перетаскивания. */}
				<div
					onDrop={handleDrop}
					onDragOver={e => e.preventDefault()}
					className='px-5 py-6 sm:px-6'
				>
					<input
						ref={fileInputRef}
						type='file'
						accept='image/*'
						onChange={handleFileSelect}
						className='hidden'
						aria-label='Загрузить изображение для генерации фавикона'
					/>

					{generatedFavicons.length === 0 ? (
						<button
							type='button'
							onClick={() => fileInputRef.current?.click()}
							className='flex w-full cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed py-14 transition-colors hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						>
							<Upload className='h-8 w-8 text-muted-foreground' />
							<span className='text-sm'>
								Перетащите картинку или нажмите, чтобы выбрать
							</span>
							<span className='text-xs text-muted-foreground'>
								PNG, JPG, SVG до 5 МБ. Лучше квадрат от 512 пикселей — мелкие
								детали при 16 пикселях всё равно не видны
							</span>
						</button>
					) : (
						<div className='flex flex-wrap items-start gap-4'>
							{previewUrl && (
								<div className='relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border'>
									<Image
										src={previewUrl}
										alt='Исходная картинка'
										fill
										className='object-contain p-2'
									/>
								</div>
							)}

							<div className='grid min-w-0 flex-1 grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7'>
								{generatedFavicons.map(favicon => (
									<button
										key={favicon.size}
										type='button'
										onClick={() => downloadFavicon(favicon)}
										title={`${favicon.name} — скачать`}
										className='flex cursor-pointer flex-col items-center gap-1 rounded-lg border p-2 transition-colors hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
									>
										<span className='relative h-8 w-8'>
											<Image
												src={favicon.dataUrl}
												alt={favicon.name}
												fill
												className='object-contain'
											/>
										</span>
										<span className='font-mono text-xs'>{favicon.size}</span>
									</button>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Полоса подключения: код в <head> — последний шаг, без него
				    иконка не появится, поэтому он на виду, а не в инструкции. */}
				{generatedFavicons.length > 0 && (
					<div className='border-t'>
						<div className='flex items-center justify-between gap-2 px-5 pt-4 sm:px-6'>
							<span className='text-sm font-medium'>
								Вставьте в <code className='font-mono'>&lt;head&gt;</code>
							</span>
							<Button
								size='icon'
								variant='ghost'
								onClick={copySnippet}
								title='Скопировать'
								className={toolIconButton}
							>
								{copied ? (
									<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
								) : (
									<Copy className='h-4 w-4' />
								)}
							</Button>
						</div>
						<pre className='overflow-x-auto px-5 pt-2 pb-5 font-mono text-xs leading-relaxed sm:px-6'>
							{HEAD_SNIPPET}
						</pre>
					</div>
				)}
			</Card>

			<div className='mt-6'>
				<FaviconLookup />
			</div>

			<ToolScreenshot slug='favicon-generator' />
			<FaviconGuide />

			{/* Скрытый канвас для перерисовки картинки */}
			<canvas ref={canvasRef} className='hidden' width={512} height={512} />
		</>
	)
}

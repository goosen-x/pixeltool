'use client'

import { useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, Download, X, ImageIcon, Trash2 } from 'lucide-react'
import { toolBar, toolIconButton } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { ImageSizeCheckerSeo } from './ImageSizeCheckerSeo'
import { cn } from '@/lib/utils'

interface ImageInfo {
	name: string
	url: string
	width: number
	height: number
	aspectRatio: string
	fileSize: number
	fileSizeFormatted: string
	format: string
	lastModified: Date
}

export default function ImageSizeCheckerPage() {
	const widget = getWidgetById('image-size-checker')!
	const [images, setImages] = useState<ImageInfo[]>([])
	const [isDragging, setIsDragging] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)
	// Сообщение о том, что не получилось: тост тут не годится — он исчезает
	// раньше, чем человек успевает понять, какой файл не взяли.
	const [problem, setProblem] = useState('')

	const formatBytes = (bytes: number): string => {
		if (bytes === 0) return '0 Bytes'
		const k = 1024
		const sizes = ['Bytes', 'KB', 'MB', 'GB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
	}

	const getAspectRatio = (width: number, height: number): string => {
		const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
		const divisor = gcd(width, height)
		return `${width / divisor}:${height / divisor}`
	}

	const processImage = (file: File): Promise<ImageInfo> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()

			reader.onload = e => {
				const img = new window.Image()

				img.onload = () => {
					const imageInfo: ImageInfo = {
						name: file.name,
						url: e.target?.result as string,
						width: img.width,
						height: img.height,
						aspectRatio: getAspectRatio(img.width, img.height),
						fileSize: file.size,
						fileSizeFormatted: formatBytes(file.size),
						format: file.type || 'unknown',
						lastModified: new Date(file.lastModified)
					}
					resolve(imageInfo)
				}

				img.onerror = () => {
					reject(new Error('Failed to load image'))
				}

				img.src = e.target?.result as string
			}

			reader.onerror = () => {
				reject(new Error('Failed to read file'))
			}

			reader.readAsDataURL(file)
		})
	}

	const handleFiles = useCallback(async (files: FileList) => {
		const imageFiles = Array.from(files).filter(file =>
			file.type.startsWith('image/')
		)

		if (imageFiles.length === 0) {
			setProblem('Это не изображения — нужны JPG, PNG, GIF, WebP или SVG')
			return
		}

		setProblem('')

		const newImages: ImageInfo[] = []

		for (const file of imageFiles) {
			try {
				const imageInfo = await processImage(file)
				newImages.push(imageInfo)
			} catch (error) {
				setProblem(`Не удалось прочитать ${file.name}`)
			}
		}

		setImages(prev => [...prev, ...newImages])
	}, [])

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault()
			setIsDragging(false)
			handleFiles(e.dataTransfer.files)
		},
		[handleFiles]
	)

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(true)
	}, [])

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(false)
	}, [])

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			if (e.target.files) {
				handleFiles(e.target.files)
			}
		},
		[handleFiles]
	)

	const removeImage = useCallback((index: number) => {
		setImages(prev => prev.filter((_, i) => i !== index))
	}, [])

	const clearAll = useCallback(() => {
		setImages([])
		setProblem('')
	}, [])

	const exportData = useCallback(() => {
		const data = images.map(img => ({
			name: img.name,
			width: img.width,
			height: img.height,
			aspectRatio: img.aspectRatio,
			fileSize: img.fileSizeFormatted,
			format: img.format
		}))

		const csv = [
			'Name,Width,Height,Aspect Ratio,File Size,Format',
			...data.map(
				row =>
					`"${row.name}",${row.width},${row.height},"${row.aspectRatio}","${row.fileSize}","${row.format}"`
			)
		].join('\n')

		const blob = new Blob([csv], { type: 'text/csv' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = 'image-sizes.csv'
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		URL.revokeObjectURL(url)
	}, [images])

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: сколько картинок разобрано и что с ними делать.
				    Раньше это был заголовок «Результаты (N)» с двумя кнопками
				    между двумя карточками. */}
				<div className={toolBar}>
					<span
						className={cn(
							'text-sm',
							problem ? 'text-destructive' : 'text-muted-foreground'
						)}
					>
						{problem ||
							(images.length > 0
								? `${images.length} изображений`
								: 'Изображения не выбраны')}
					</span>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => fileInputRef.current?.click()}
							title='Выбрать файлы'
							className={toolIconButton}
						>
							<Upload className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={exportData}
							disabled={images.length === 0}
							title='Скачать таблицу CSV'
							className={toolIconButton}
						>
							<Download className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={clearAll}
							disabled={images.length === 0}
							title='Очистить'
							className={toolIconButton}
						>
							<Trash2 className='h-4 w-4' />
						</Button>
					</div>
				</div>

				{/* Рабочая область — она же зона перетаскивания: пока картинок нет,
				    это приглашение, а как появились — сетка с результатами, и
				    бросить файл можно прямо на неё. */}
				<div
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					className={cn(
						'relative px-5 py-6 transition-colors sm:px-6',
						isDragging && 'bg-primary/5'
					)}
				>
					<input
						ref={fileInputRef}
						type='file'
						multiple
						accept='image/*'
						onChange={handleInputChange}
						aria-label='Загрузить изображения'
						className='hidden'
					/>

					{images.length === 0 ? (
						<button
							type='button'
							onClick={() => fileInputRef.current?.click()}
							className='flex w-full cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed py-14 transition-colors hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						>
							<ImageIcon className='h-8 w-8 text-muted-foreground' />
							<span className='text-sm'>
								Перетащите изображения сюда или выберите файлы
							</span>
							<span className='text-xs text-muted-foreground'>
								JPG, PNG, GIF, WebP, SVG — всё считается прямо в браузере
							</span>
						</button>
					) : (
						<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
							{images.map((image, index) => (
								<div key={index} className='group'>
									<div className='relative aspect-video overflow-hidden rounded-xl border bg-muted'>
										<Image
											src={image.url}
											alt={image.name}
											fill
											className='object-contain'
										/>
										<Button
											size='icon'
											variant='ghost'
											onClick={() => removeImage(index)}
											title='Убрать'
											className={cn(
												toolIconButton,
												'absolute top-2 right-2 bg-background/90 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100'
											)}
										>
											<X className='h-4 w-4' />
										</Button>
									</div>

									<p className='mt-2 truncate px-1 text-sm' title={image.name}>
										{image.name}
									</p>
									<p className='flex flex-wrap items-center gap-x-3 px-1 text-xs text-muted-foreground'>
										<span className='font-mono text-foreground'>
											{image.width} × {image.height}
										</span>
										<span className='font-mono'>{image.aspectRatio}</span>
										<span className='font-mono'>{image.fileSizeFormatted}</span>
										<span className='font-mono'>
											{image.format.split('/')[1]?.toUpperCase() || '—'}
										</span>
									</p>
								</div>
							))}
						</div>
					)}
				</div>
			</Card>

			{/* Частые соотношения сторон — тихая полка под инструментом. */}
			<div className='mt-6'>
				<p className='px-1 text-sm text-muted-foreground'>
					Частые соотношения сторон
				</p>
				<div className='mt-2 grid gap-x-8 gap-y-2 rounded-xl border p-4 sm:grid-cols-2'>
					{[
						['1:1', 'квадрат — пост в Instagram'],
						['4:3', 'традиционное фото'],
						['3:2', 'классический кадр 35 мм'],
						['16:9', 'широкий экран, обложка YouTube'],
						['9:16', 'вертикальное видео и сторис'],
						['2:1', 'шапка профиля']
					].map(([ratio, description]) => (
						<div
							key={ratio}
							className='flex items-baseline justify-between gap-3 text-sm'
						>
							<span className='font-mono'>{ratio}</span>
							<span className='text-muted-foreground'>{description}</span>
						</div>
					))}
				</div>
			</div>

			<ImageSizeCheckerSeo />
		</WidgetSEOWrapper>
	)
}

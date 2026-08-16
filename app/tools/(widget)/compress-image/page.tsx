'use client'

import { useEffect, useRef, useState } from 'react'
import { Download, Loader2, Trash2, Upload } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import { formatBytes, percentSaved } from '@/lib/utils/format-bytes'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { CompressImageSeo } from './CompressImageSeo'

type OutputFormat = 'image/jpeg' | 'image/webp'
type Status = 'idle' | 'processing' | 'done' | 'error'

const FORMAT_LABELS: [OutputFormat, string][] = [
	['image/jpeg', 'JPEG'],
	['image/webp', 'WebP']
]

const EXTENSIONS: Record<OutputFormat, string> = {
	'image/jpeg': 'jpg',
	'image/webp': 'webp'
}

function loadImage(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new window.Image()
		img.onload = () => resolve(img)
		img.onerror = () => reject(new Error('Не удалось прочитать изображение'))
		img.src = url
	})
}

/**
 * JPEG не поддерживает альфа-канал — прозрачные области без подложки
 * превращаются в чёрный. Заливаем белым перед отрисовкой, как делают
 * все похожие конвертеры.
 */
async function compressImage(
	file: File,
	format: OutputFormat,
	quality: number
): Promise<Blob> {
	const objectUrl = URL.createObjectURL(file)
	try {
		const img = await loadImage(objectUrl)
		const canvas = document.createElement('canvas')
		canvas.width = img.naturalWidth
		canvas.height = img.naturalHeight
		const ctx = canvas.getContext('2d')!

		if (format === 'image/jpeg') {
			ctx.fillStyle = '#ffffff'
			ctx.fillRect(0, 0, canvas.width, canvas.height)
		}
		ctx.drawImage(img, 0, 0)

		return await new Promise<Blob>((resolve, reject) => {
			canvas.toBlob(
				blob => (blob ? resolve(blob) : reject(new Error('Не удалось сжать'))),
				format,
				quality / 100
			)
		})
	} finally {
		URL.revokeObjectURL(objectUrl)
	}
}

export default function CompressImagePage() {
	const widget = getWidgetById('compress-image')!

	const [status, setStatus] = useState<Status>('idle')
	const [originalFile, setOriginalFile] = useState<File | null>(null)
	const [originalUrl, setOriginalUrl] = useState<string | null>(null)
	const [format, setFormat] = useState<OutputFormat>('image/jpeg')
	const [quality, setQuality] = useState(80)
	const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null)
	const [compressedUrl, setCompressedUrl] = useState<string | null>(null)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	const fileInputRef = useRef<HTMLInputElement>(null)

	const runCompression = async (file: File, fmt: OutputFormat, q: number) => {
		setStatus('processing')
		setErrorMessage(null)
		try {
			const blob = await compressImage(file, fmt, q)
			setCompressedBlob(blob)
			setCompressedUrl(URL.createObjectURL(blob))
			setStatus('done')
		} catch (error) {
			console.error(error)
			setErrorMessage(
				'Не получилось сжать файл. Попробуйте другое изображение.'
			)
			setStatus('error')
		}
	}

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return

		setOriginalFile(file)
		setOriginalUrl(URL.createObjectURL(file))
		setCompressedBlob(null)
		setCompressedUrl(null)
		void runCompression(file, format, quality)
	}

	// Пересжимаем при смене формата/качества — с дебаунсом, чтобы не гонять
	// canvas на каждый пиксель движения ползунка.
	useEffect(() => {
		if (!originalFile) return
		const timeout = setTimeout(() => {
			void runCompression(originalFile, format, quality)
		}, 200)
		return () => clearTimeout(timeout)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [format, quality])

	const downloadResult = () => {
		if (!compressedUrl || !originalFile) return
		const baseName = originalFile.name.replace(/\.[^.]+$/, '')
		const link = document.createElement('a')
		link.href = compressedUrl
		link.download = `${baseName}-compressed.${EXTENSIONS[format]}`
		link.click()
	}

	const reset = () => {
		setOriginalFile(null)
		setOriginalUrl(null)
		setCompressedBlob(null)
		setCompressedUrl(null)
		setStatus('idle')
		setErrorMessage(null)
		if (fileInputRef.current) fileInputRef.current.value = ''
	}

	const savedPercent =
		originalFile && compressedBlob
			? percentSaved(originalFile.size, compressedBlob.size)
			: null

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						{FORMAT_LABELS.map(([value, label]) => (
							<button
								key={value}
								type='button'
								onClick={() => setFormat(value)}
								aria-pressed={format === value}
								className={toolPill(format === value)}
							>
								{label}
							</button>
						))}
					</div>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => fileInputRef.current?.click()}
							title={originalUrl ? 'Выбрать другое фото' : 'Загрузить фото'}
							className={toolIconButton}
						>
							<Upload className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={downloadResult}
							disabled={!compressedUrl}
							title='Скачать'
							className={toolIconButton}
						>
							<Download className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={reset}
							disabled={!originalUrl}
							title='Очистить'
							className={toolIconButton}
						>
							<Trash2 className='h-4 w-4' />
						</Button>
					</div>
				</div>

				<input
					ref={fileInputRef}
					type='file'
					accept='image/*'
					onChange={handleFileSelect}
					aria-label='Загрузить фото'
					className='hidden'
				/>

				{originalUrl && originalFile ? (
					<div className='grid md:grid-cols-2'>
						<div className='flex flex-col items-center gap-2 border-b px-5 py-6 sm:px-6 md:border-r md:border-b-0'>
							{/* eslint-disable-next-line @next/next/no-img-element -- object URL, не оптимизируем через next/image */}
							<img
								src={originalUrl}
								alt='Исходное изображение'
								className='max-h-72 w-auto rounded-xl border object-contain'
							/>
							<span className='text-sm text-muted-foreground'>
								Исходный: {formatBytes(originalFile.size)}
							</span>
						</div>

						<div className='flex flex-col items-center justify-center gap-2 px-5 py-6 sm:px-6'>
							{status === 'processing' ? (
								<div className='flex h-72 items-center justify-center gap-2 text-sm text-muted-foreground'>
									<Loader2 className='h-4 w-4 animate-spin' />
									Сжимаем…
								</div>
							) : compressedUrl && compressedBlob ? (
								<>
									{/* eslint-disable-next-line @next/next/no-img-element -- object URL, не оптимизируем через next/image */}
									<img
										src={compressedUrl}
										alt='Сжатое изображение'
										className='max-h-72 w-auto rounded-xl border object-contain'
									/>
									<span className='text-sm'>
										Стало: {formatBytes(compressedBlob.size)}{' '}
										{savedPercent !== null && (
											<span
												className={
													savedPercent >= 0
														? 'font-medium text-green-600 dark:text-green-400'
														: 'font-medium text-destructive'
												}
											>
												({savedPercent >= 0 ? '−' : '+'}
												{Math.abs(savedPercent)}%)
											</span>
										)}
									</span>
								</>
							) : (
								<p className='text-sm text-destructive'>{errorMessage}</p>
							)}
						</div>
					</div>
				) : (
					<div className='px-5 py-6 sm:px-6'>
						<button
							type='button'
							onClick={() => fileInputRef.current?.click()}
							className='flex w-full cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed py-16 transition-colors hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						>
							<Upload className='h-6 w-6 text-muted-foreground' />
							<span className='text-sm'>Выберите фото</span>
						</button>
					</div>
				)}

				<div className={toolFooterBar}>
					<label className='flex flex-1 items-center gap-2 text-sm text-muted-foreground'>
						<span className='shrink-0'>Качество</span>
						<Slider
							value={[quality]}
							onValueChange={([value]) => setQuality(value)}
							min={10}
							max={100}
							step={5}
							className='w-full max-w-xs cursor-pointer'
							aria-label='Качество сжатия'
						/>
						<span className='w-10 shrink-0 font-mono text-sm text-foreground tabular-nums'>
							{quality}%
						</span>
					</label>
				</div>
			</Card>

			<CompressImageSeo />
		</WidgetSEOWrapper>
	)
}

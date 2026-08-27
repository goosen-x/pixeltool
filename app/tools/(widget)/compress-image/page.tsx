'use client'

import { useEffect, useRef, useState } from 'react'
import {
	AlertTriangle,
	Check,
	Copy,
	Download,
	Loader2,
	Trash2,
	Upload
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolToggleOption,
	toolToggleTrack
} from '@/lib/ui/tool-pill'
import { formatBytes, percentSaved } from '@/lib/utils/format-bytes'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { useFileDrop } from '@/lib/hooks/useFileDrop'
import { useCopyToClipboard } from '@/lib/hooks/useCopyToClipboard'
import { cn } from '@/lib/utils'
import { takeHandoffFile } from '@/lib/tools/file-handoff'
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
 * все похожие конвертеры. Заливка передаётся сюда, а не делается в
 * вызывающем коде: canvas должен быть залит ДО отрисовки фото поверх, а
 * не после.
 *
 * На телефонах декод больших фото через <img> иногда «успевает» отдать
 * onload раньше, чем данные реально готовы — canvas после drawImage
 * остаётся пустым или битым без единой ошибки. createImageBitmap
 * декодирует до готового результата (или честно бросает исключение) и
 * заодно разворачивает фото по EXIF-ориентации, которую canvas сам не
 * учитывает. Тот же фикс, что раньше сделали в photo-color-picker.
 */
async function decodeToCanvas(
	file: File,
	canvas: HTMLCanvasElement,
	fillWhite: boolean
): Promise<{ width: number; height: number }> {
	const draw = (
		ctx: CanvasRenderingContext2D,
		width: number,
		height: number,
		source: CanvasImageSource
	) => {
		if (fillWhite) {
			ctx.fillStyle = '#ffffff'
			ctx.fillRect(0, 0, width, height)
		}
		ctx.drawImage(source, 0, 0)
	}

	if (typeof createImageBitmap === 'function') {
		const bitmap = await createImageBitmap(file, {
			imageOrientation: 'from-image'
		})
		if (bitmap.width === 0 || bitmap.height === 0) {
			bitmap.close()
			throw new Error('Изображение пустое')
		}
		canvas.width = bitmap.width
		canvas.height = bitmap.height
		draw(canvas.getContext('2d')!, bitmap.width, bitmap.height, bitmap)
		bitmap.close()
		return { width: bitmap.width, height: bitmap.height }
	}

	// Старые браузеры без createImageBitmap — прежний путь через <img>.
	const objectUrl = URL.createObjectURL(file)
	try {
		const img = await loadImage(objectUrl)
		if (img.naturalWidth === 0 || img.naturalHeight === 0) {
			throw new Error('Изображение пустое')
		}
		canvas.width = img.naturalWidth
		canvas.height = img.naturalHeight
		draw(canvas.getContext('2d')!, img.naturalWidth, img.naturalHeight, img)
		return { width: img.naturalWidth, height: img.naturalHeight }
	} finally {
		URL.revokeObjectURL(objectUrl)
	}
}

interface CompressResult {
	blob: Blob
	width: number
	height: number
}

async function compressImage(
	file: File,
	format: OutputFormat,
	quality: number
): Promise<CompressResult> {
	const canvas = document.createElement('canvas')
	const { width, height } = await decodeToCanvas(
		file,
		canvas,
		format === 'image/jpeg'
	)

	const blob = await new Promise<Blob>((resolve, reject) => {
		canvas.toBlob(
			blob => (blob ? resolve(blob) : reject(new Error('Не удалось сжать'))),
			format,
			quality / 100
		)
	})
	return { blob, width, height }
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
	const [dimensions, setDimensions] = useState<{
		width: number
		height: number
	} | null>(null)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	const fileInputRef = useRef<HTMLInputElement>(null)
	const { copyToClipboard, copiedItem } = useCopyToClipboard()

	const runCompression = async (file: File, fmt: OutputFormat, q: number) => {
		setStatus('processing')
		setErrorMessage(null)
		try {
			const result = await compressImage(file, fmt, q)
			setCompressedBlob(result.blob)
			setCompressedUrl(URL.createObjectURL(result.blob))
			setDimensions({ width: result.width, height: result.height })
			setStatus('done')
		} catch (error) {
			console.error(error)
			setErrorMessage(
				'Не получилось сжать файл. Попробуйте другое изображение.'
			)
			setStatus('error')
		}
	}

	const selectFile = (file: File) => {
		setOriginalFile(file)
		setOriginalUrl(URL.createObjectURL(file))
		setCompressedBlob(null)
		setCompressedUrl(null)
		setDimensions(null)
		void runCompression(file, format, quality)
	}

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) selectFile(file)
	}

	const { isDragging, ...dropHandlers } = useFileDrop(selectFile)

	// Подхватываем файл, переданный кнопкой «Сжать» с другого тула
	// (image-size-checker) — см. lib/tools/file-handoff.ts.
	useEffect(() => {
		void takeHandoffFile().then(file => {
			if (file) selectFile(file)
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

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
		link.download = `pixeltool.pro-${baseName}-compressed.${EXTENSIONS[format]}`
		link.click()
	}

	const reset = () => {
		setOriginalFile(null)
		setOriginalUrl(null)
		setCompressedBlob(null)
		setCompressedUrl(null)
		setDimensions(null)
		setStatus('idle')
		setErrorMessage(null)
		if (fileInputRef.current) fileInputRef.current.value = ''
	}

	const savedPercent =
		originalFile && compressedBlob
			? percentSaved(originalFile.size, compressedBlob.size)
			: null
	const isLarger = savedPercent !== null && savedPercent < 0

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card
				className={cn(
					'overflow-hidden p-0 transition-colors',
					isDragging && 'ring-2 ring-primary ring-inset'
				)}
				{...dropHandlers}
			>
				<div className={toolBar}>
					<div className={toolToggleTrack}>
						{FORMAT_LABELS.map(([value, label]) => (
							<button
								key={value}
								type='button'
								onClick={() => setFormat(value)}
								aria-pressed={format === value}
								className={toolToggleOption(format === value)}
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
							{dimensions && (
								<button
									type='button'
									onClick={() =>
										copyToClipboard(
											`${dimensions.width} × ${dimensions.height}`,
											'original-dimensions'
										)
									}
									title='Скопировать размер в пикселях'
									className='flex cursor-pointer items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground'
								>
									{dimensions.width} × {dimensions.height} px
									{copiedItem === 'original-dimensions' ? (
										<Check className='h-3 w-3 text-green-600 dark:text-green-400' />
									) : (
										<Copy className='h-3 w-3' />
									)}
								</button>
							)}
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
									{dimensions && (
										<button
											type='button'
											onClick={() =>
												copyToClipboard(
													`${dimensions.width} × ${dimensions.height}`,
													'compressed-dimensions'
												)
											}
											title='Скопировать размер в пикселях'
											className='flex cursor-pointer items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground'
										>
											{dimensions.width} × {dimensions.height} px
											{copiedItem === 'compressed-dimensions' ? (
												<Check className='h-3 w-3 text-green-600 dark:text-green-400' />
											) : (
												<Copy className='h-3 w-3' />
											)}
										</button>
									)}

									{isLarger && (
										<p className='flex items-center gap-1.5 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive'>
											<AlertTriangle className='h-3.5 w-3.5 shrink-0' />
											Результат тяжелее исходника — скачивание заблокировано,
											снизьте качество или выберите другой формат
										</p>
									)}

									<Button
										onClick={downloadResult}
										disabled={isLarger}
										title={
											isLarger
												? 'Заблокировано: результат тяжелее исходника'
												: undefined
										}
										className='mt-1 cursor-pointer gap-2'
									>
										<Download className='h-4 w-4' />
										Скачать
									</Button>
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
							className={cn(
								'flex w-full cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed py-16 transition-colors hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
								isDragging && 'border-primary bg-primary/5'
							)}
						>
							<Upload className='h-6 w-6 text-muted-foreground' />
							<span className='text-sm'>Выберите фото или перетащите сюда</span>
						</button>
					</div>
				)}

				<div className={toolFooterBar}>
					<label className='flex flex-1 items-center gap-2 text-sm text-muted-foreground'>
						<span className='shrink-0 whitespace-nowrap'>← Меньше вес</span>
						<Slider
							value={[quality]}
							onValueChange={([value]) => setQuality(value)}
							min={10}
							max={100}
							step={5}
							className='w-full max-w-xs cursor-pointer'
							aria-label='Качество сжатия: влево — меньше вес файла, вправо — выше качество изображения'
						/>
						<span className='shrink-0 whitespace-nowrap'>Выше качество →</span>
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

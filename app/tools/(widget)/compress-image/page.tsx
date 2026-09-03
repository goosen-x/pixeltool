'use client'

import { useRef, useState } from 'react'
import { Check, Copy, Download, Loader2, Trash2, Upload } from 'lucide-react'
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
import { formatBytes } from '@/lib/utils/format-bytes'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { useFileDrop } from '@/lib/hooks/useFileDrop'
import { useCopyToClipboard } from '@/lib/hooks/useCopyToClipboard'
import { useImageCompress } from '@/lib/hooks/useImageCompress'
import type { OutputFormat } from '@/lib/tools/image-compress'
import { cn } from '@/lib/utils'
import { CompressImageSeo } from './CompressImageSeo'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'

const FORMAT_LABELS: [OutputFormat, string][] = [
	['image/jpeg', 'JPEG'],
	['image/webp', 'WebP']
]

export default function CompressImagePage() {
	const widget = getWidgetById('compress-image')!

	const [originalFile, setOriginalFile] = useState<File | null>(null)
	const [originalUrl, setOriginalUrl] = useState<string | null>(null)

	const fileInputRef = useRef<HTMLInputElement>(null)
	const { copyToClipboard, copiedItem } = useCopyToClipboard()

	const {
		format,
		setFormat,
		quality,
		setQuality,
		status,
		compressedBlob,
		compressedUrl,
		dimensions,
		errorMessage,
		savedPercent,
		isOriginalBest,
		download
	} = useImageCompress(originalFile)

	const selectFile = (file: File) => {
		setOriginalFile(file)
		setOriginalUrl(URL.createObjectURL(file))
	}

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) selectFile(file)
	}

	const { isDragging, ...dropHandlers } = useFileDrop(selectFile)

	const downloadResult = () => {
		if (!originalFile) return
		download(originalFile.name.replace(/\.[^.]+$/, ''))
	}

	const reset = () => {
		setOriginalFile(null)
		setOriginalUrl(null)
		if (fileInputRef.current) fileInputRef.current.value = ''
	}

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
										{isOriginalBest ? (
											'Уже минимальный размер — скачается оригинал'
										) : (
											<>
												Стало: {formatBytes(compressedBlob.size)}{' '}
												{savedPercent !== null && (
													<span className='font-medium text-green-600 dark:text-green-400'>
														(−{savedPercent}%)
													</span>
												)}
											</>
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

									<Button
										onClick={downloadResult}
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

			<ToolScreenshot slug='compress-image' />
			<CompressImageSeo />
		</WidgetSEOWrapper>
	)
}

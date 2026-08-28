'use client'

import { Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { toolToggleOption, toolToggleTrack } from '@/lib/ui/tool-pill'
import { formatBytes } from '@/lib/utils/format-bytes'
import { useImageCompress } from '@/lib/hooks/useImageCompress'
import type { OutputFormat } from '@/lib/tools/image-compress'

const FORMAT_LABELS: [OutputFormat, string][] = [
	['image/jpeg', 'JPEG'],
	['image/webp', 'WebP']
]

interface ImageCompressPanelProps {
	file: File
}

/**
 * Компактная панель сжатия — разворачивается прямо под карточкой/строкой
 * image-size-checker по клику «Сжать», без перехода на отдельный тул и без
 * передачи файла через IndexedDB (раньше — lib/tools/file-handoff.ts,
 * убрано вместе с этим компонентом). Логика сжатия общая с compress-image —
 * useImageCompress.
 *
 * Три чётких ряда, а не один перегруженный: переключатель формата и
 * «Скачать» — управление сверху; превью с результатом — по центру; ползунок
 * качества — снизу во всю ширину. Раньше всё это было одной flex-строкой с
 * переносами вперемешку, которая на узкой колонке (одна карточка в
 * image-size-checker) выглядела косо.
 */
export function ImageCompressPanel({ file }: ImageCompressPanelProps) {
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
	} = useImageCompress(file)

	return (
		<div className='flex flex-col gap-4 rounded-xl border bg-muted/20 p-4'>
			<div className='flex items-center justify-between gap-3'>
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

				<Button
					onClick={() => download(file.name.replace(/\.[^.]+$/, ''))}
					disabled={!compressedUrl}
					size='sm'
					className='shrink-0 cursor-pointer gap-2'
				>
					<Download className='h-4 w-4' />
					Скачать
				</Button>
			</div>

			<div className='flex items-center gap-3'>
				{compressedUrl ? (
					// eslint-disable-next-line @next/next/no-img-element -- object URL, не оптимизируем через next/image
					<img
						src={compressedUrl}
						alt='Сжатое изображение'
						className='h-16 w-16 shrink-0 rounded-lg border bg-background object-cover'
					/>
				) : (
					<div className='flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border bg-background'>
						<Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
					</div>
				)}

				<div className='flex min-w-0 flex-col gap-1'>
					{status === 'processing' ? (
						<span className='flex items-center gap-1.5 text-sm text-muted-foreground'>
							<Loader2 className='h-3.5 w-3.5 animate-spin' />
							Сжимаем…
						</span>
					) : compressedBlob && savedPercent !== null ? (
						<>
							<span className='text-sm'>
								{isOriginalBest ? (
									'Уже минимальный размер — скачается оригинал'
								) : (
									<>
										{formatBytes(file.size)} →{' '}
										<span className='font-medium'>
											{formatBytes(compressedBlob.size)}
										</span>{' '}
										<span className='font-medium text-green-600 dark:text-green-400'>
											(−{savedPercent}%)
										</span>
									</>
								)}
							</span>
							{dimensions && (
								<span className='font-mono text-xs text-muted-foreground'>
									{dimensions.width} × {dimensions.height} px
								</span>
							)}
						</>
					) : errorMessage ? (
						<span className='text-sm text-destructive'>{errorMessage}</span>
					) : null}
				</div>
			</div>

			<label className='flex items-center gap-2 text-sm text-muted-foreground'>
				<span className='shrink-0 whitespace-nowrap'>← Меньше вес</span>
				<Slider
					value={[quality]}
					onValueChange={([value]) => setQuality(value)}
					min={10}
					max={100}
					step={5}
					className='w-full cursor-pointer'
					aria-label='Качество сжатия: влево — меньше вес файла, вправо — выше качество изображения'
				/>
				<span className='shrink-0 whitespace-nowrap'>Выше качество →</span>
				<span className='w-10 shrink-0 font-mono text-sm text-foreground tabular-nums'>
					{quality}%
				</span>
			</label>
		</div>
	)
}

'use client'

import { Download } from 'lucide-react'
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
	/** Сворачивает панель обратно в статичную строку веса — рендерится тут
	 *  же, в строке результата, а не отдельной кнопкой сверху: иначе тот же
	 *  вес файла показывался бы дважды (строка веса + строка результата). */
	onCollapse: () => void
}

/**
 * Управление сжатием — формат, ползунок качества, скачивание. Без своей
 * рамки/фона: встраивается в вес-секцию image-size-checker (см.
 * WeightSection в page.tsx), а не живёт отдельной карточкой внутри
 * карточки — раньше так и было, и на мобильном съедало половину ширины
 * впустую.
 *
 * Подписи ползунка — отдельной строкой НАД ним (не по бокам): «Меньше
 * вес» и «Выше качество» всегда видны парой на одной строке, а сам
 * ползунок во всю ширину под ними. По бокам они переносились независимо
 * друг от друга на узких экранах, и было не понять, что означает каждый
 * конец шкалы.
 */
export function ImageCompressPanel({ file, onCollapse }: ImageCompressPanelProps) {
	const {
		format,
		setFormat,
		quality,
		setQuality,
		status,
		compressedBlob,
		savedPercent,
		isOriginalBest,
		errorMessage,
		compressedUrl,
		download
	} = useImageCompress(file)

	return (
		<div className='flex flex-col gap-3'>
			<div className='flex flex-wrap items-center justify-between gap-2'>
				<span className='text-sm'>
					{status === 'processing' ? (
						'Сжимаем…'
					) : compressedBlob && savedPercent !== null ? (
						isOriginalBest ? (
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
						)
					) : errorMessage ? (
						<span className='text-destructive'>{errorMessage}</span>
					) : null}
				</span>

				<button
					type='button'
					onClick={onCollapse}
					className='cursor-pointer text-sm font-medium text-primary hover:underline'
				>
					Скрыть
				</button>
			</div>

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

			<div className='flex items-center justify-between text-xs text-muted-foreground'>
				<span>Меньше вес</span>
				<span>Выше качество</span>
			</div>
			<Slider
				value={[quality]}
				onValueChange={([value]) => setQuality(value)}
				min={10}
				max={100}
				step={5}
				className='w-full cursor-pointer'
				aria-label='Качество сжатия: слева — меньше вес файла, справа — выше качество изображения'
			/>

			<Button
				onClick={() => download(file.name.replace(/\.[^.]+$/, ''))}
				disabled={!compressedUrl}
				size='sm'
				className='w-full cursor-pointer gap-2'
			>
				<Download className='h-4 w-4' />
				Скачать
			</Button>
		</div>
	)
}

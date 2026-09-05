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
import { downloadBlob } from '@/lib/utils/download-blob'
import { useFileDrop } from '@/lib/hooks/useFileDrop'
import {
	convertImage,
	detectFormat,
	FORMATS,
	getFormat,
	isDecodable,
	outputName,
	type ImageFormat
} from '@/lib/tools/image-convert'
import { cn } from '@/lib/utils'

interface ImageConverterWidgetProps {
	/** На подстранице формат назначения задан заранее. */
	initialTarget?: ImageFormat
}

export function ImageConverterWidget({
	initialTarget
}: ImageConverterWidgetProps) {
	const [file, setFile] = useState<File | null>(null)
	const [sourceUrl, setSourceUrl] = useState<string | null>(null)
	const [target, setTarget] = useState<ImageFormat>(
		initialTarget ?? 'image/jpeg'
	)
	const [quality, setQuality] = useState(92)
	const [result, setResult] = useState<{
		blob: Blob
		url: string
		width: number
		height: number
	} | null>(null)
	const [busy, setBusy] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const inputRef = useRef<HTMLInputElement>(null)
	const sourceFormat = file ? detectFormat(file) : null
	const targetInfo = getFormat(target)!

	useEffect(() => {
		return () => {
			if (sourceUrl) URL.revokeObjectURL(sourceUrl)
		}
	}, [sourceUrl])

	useEffect(() => {
		return () => {
			if (result) URL.revokeObjectURL(result.url)
		}
	}, [result])

	const select = (chosen: File) => {
		if (!isDecodable(chosen)) {
			setError(
				/hei[cf]/i.test(chosen.type) || /\.hei[cf]$/i.test(chosen.name)
					? 'HEIC браузер не открывает: этот формат читает только Safari. Пересохраните фото в JPG на самом айфоне — Настройки → Камера → Форматы → Наиболее совместимый'
					: 'Не похоже на картинку, которую умеет открыть браузер'
			)
			return
		}
		setError(null)
		setResult(null)
		setFile(chosen)
		setSourceUrl(current => {
			if (current) URL.revokeObjectURL(current)
			return URL.createObjectURL(chosen)
		})
	}

	const { isDragging, ...dropHandlers } = useFileDrop(select)

	// Конвертируем при каждой смене формата или качества: файл уже в памяти,
	// а ждать нажатия кнопки ради операции на десятки миллисекунд незачем.
	useEffect(() => {
		if (!file) return
		let cancelled = false
		setBusy(true)

		convertImage(file, target, { quality: quality / 100 })
			.then(({ blob, width, height }) => {
				if (cancelled) return
				setResult(current => {
					if (current) URL.revokeObjectURL(current.url)
					return { blob, url: URL.createObjectURL(blob), width, height }
				})
			})
			.catch(() => {
				if (!cancelled) setError('Не удалось перекодировать изображение')
			})
			.finally(() => {
				if (!cancelled) setBusy(false)
			})

		return () => {
			cancelled = true
		}
	}, [file, target, quality])

	const saved =
		file && result ? percentSaved(file.size, result.blob.size) : null

	return (
		<Card
			className={cn(
				'overflow-hidden p-0 transition-colors',
				isDragging && 'ring-2 ring-primary ring-inset'
			)}
			{...dropHandlers}
		>
			<div className={toolBar}>
				<span className='flex flex-wrap items-center gap-1.5'>
					<span className='mr-1 text-sm text-muted-foreground'>
						{sourceFormat ? `${sourceFormat.label} →` : 'Конвертировать в'}
					</span>
					{FORMATS.map(f => (
						<button
							key={f.id}
							type='button'
							onClick={() => setTarget(f.id)}
							aria-pressed={target === f.id}
							className={toolPill(target === f.id)}
						>
							{f.label}
						</button>
					))}
				</span>

				<div className='flex items-center gap-0.5 sm:ml-auto'>
					<Button
						size='icon'
						variant='ghost'
						onClick={() => inputRef.current?.click()}
						title={file ? 'Выбрать другую картинку' : 'Загрузить картинку'}
						className={toolIconButton}
					>
						<Upload className='h-4 w-4' />
					</Button>
					<Button
						size='icon'
						variant='ghost'
						onClick={() => {
							setFile(null)
							setResult(null)
							setError(null)
						}}
						disabled={!file}
						title='Очистить'
						className={toolIconButton}
					>
						<Trash2 className='h-4 w-4' />
					</Button>
				</div>
			</div>

			<input
				ref={inputRef}
				type='file'
				accept='image/*'
				onChange={event => {
					const chosen = event.target.files?.[0]
					if (chosen) select(chosen)
					event.target.value = ''
				}}
				aria-label='Загрузить картинку'
				className='hidden'
			/>

			{file && sourceUrl ? (
				<div className='grid md:grid-cols-2'>
					<div className='flex flex-col items-center gap-2 border-b px-5 py-6 sm:px-6 md:border-r md:border-b-0'>
						{/* eslint-disable-next-line @next/next/no-img-element -- object URL */}
						<img
							src={sourceUrl}
							alt='Исходное изображение'
							className='max-h-72 w-auto rounded-xl border object-contain'
						/>
						<span className='text-sm text-muted-foreground'>
							{sourceFormat?.label ?? 'Исходник'} · {formatBytes(file.size)}
						</span>
					</div>

					<div className='flex flex-col items-center justify-center gap-2 px-5 py-6 sm:px-6'>
						{busy ? (
							<span className='flex h-72 items-center gap-2 text-sm text-muted-foreground'>
								<Loader2 className='h-4 w-4 animate-spin' />
								Конвертируем…
							</span>
						) : result ? (
							<>
								{/* eslint-disable-next-line @next/next/no-img-element -- object URL */}
								<img
									src={result.url}
									alt='Результат'
									className='max-h-72 w-auto rounded-xl border object-contain'
								/>
								<span className='text-sm'>
									{targetInfo.label} · {formatBytes(result.blob.size)}
									{saved !== null && saved > 0 && (
										<span className='ml-2 font-medium text-green-600 dark:text-green-400'>
											−{saved}%
										</span>
									)}
									{saved !== null && saved < 0 && (
										<span className='ml-2 text-muted-foreground'>
											стало тяжелее на {Math.abs(saved)}%
										</span>
									)}
								</span>
								<span className='font-mono text-xs text-muted-foreground'>
									{result.width} × {result.height} px
								</span>
								<Button
									onClick={() =>
										downloadBlob(result.blob, outputName(file.name, targetInfo))
									}
									className='mt-1 cursor-pointer gap-2'
								>
									<Download className='h-4 w-4' />
									Скачать {targetInfo.label}
								</Button>
							</>
						) : null}
					</div>
				</div>
			) : (
				<div className='px-5 py-6 sm:px-6'>
					<button
						type='button'
						onClick={() => inputRef.current?.click()}
						className={cn(
							'flex w-full cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed py-16 transition-colors hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
							isDragging && 'border-primary bg-primary/5'
						)}
					>
						<Upload className='h-6 w-6 text-muted-foreground' />
						<span className='text-sm'>
							Выберите картинку или перетащите сюда
						</span>
						<span className='text-xs text-muted-foreground'>
							JPG, PNG, WebP, GIF — файл не загружается на сервер
						</span>
					</button>
				</div>
			)}

			{error && (
				<p className='border-t px-5 py-3 text-sm text-destructive sm:px-6'>
					{error}
				</p>
			)}

			<div className={toolFooterBar}>
				{targetInfo.lossy ? (
					<label className='flex items-center gap-2 text-sm text-muted-foreground'>
						Качество
						<Slider
							value={[quality]}
							onValueChange={([value]) => setQuality(value)}
							min={40}
							max={100}
							step={1}
							className='w-32 cursor-pointer'
							aria-label='Качество сжатия'
						/>
						<span className='w-10 font-mono text-sm text-foreground tabular-nums'>
							{quality}%
						</span>
					</label>
				) : (
					<span className='text-sm text-muted-foreground'>
						PNG сжимает без потерь — ползунка качества у него нет
					</span>
				)}

				{!targetInfo.alpha && (
					<span className='text-sm text-muted-foreground sm:ml-auto'>
						У {targetInfo.label} нет прозрачности: она зальётся белым
					</span>
				)}
			</div>
		</Card>
	)
}

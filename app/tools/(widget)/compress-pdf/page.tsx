'use client'

import { useRef, useState } from 'react'
import { Download, FileText, Loader2, Trash2, Upload } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill,
	toolToggleOption,
	toolToggleTrack
} from '@/lib/ui/tool-pill'
import { formatBytes, percentSaved } from '@/lib/utils/format-bytes'
import { downloadBlob } from '@/lib/utils/download-blob'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { useFileDrop } from '@/lib/hooks/useFileDrop'
import { buildOutputName, checkPdfFile } from '@/lib/tools/pdf'
import { compressPdf, type CompressMode } from '@/lib/tools/pdf-compress'
import { pluralizeRu } from '@/lib/utils/pluralize'
import { cn } from '@/lib/utils'
import { CompressPdfSeo } from './CompressPdfSeo'

const MODES: [CompressMode, string][] = [
	['lossless', 'Бережно'],
	['raster', 'Сильно']
]

const DPI_OPTIONS = [96, 150, 300]

interface Result {
	blob: Blob
	pageCount: number
	mode: CompressMode
}

export default function CompressPdfPage() {
	const widget = getWidgetById('compress-pdf')!

	const [file, setFile] = useState<File | null>(null)
	const [bytes, setBytes] = useState<ArrayBuffer | null>(null)

	const [mode, setMode] = useState<CompressMode>('raster')
	const [dpi, setDpi] = useState(150)
	const [quality, setQuality] = useState(70)

	const [result, setResult] = useState<Result | null>(null)
	const [status, setStatus] = useState<'idle' | 'working'>('idle')
	const [progress, setProgress] = useState<{ done: number; total: number }>({
		done: 0,
		total: 0
	})
	const [error, setError] = useState<string | null>(null)

	const fileInputRef = useRef<HTMLInputElement>(null)

	const selectFile = async (chosen: File) => {
		const problem = checkPdfFile(chosen)
		if (problem) {
			setError(problem.message)
			return
		}

		setError(null)
		setResult(null)
		setFile(chosen)
		setBytes(await chosen.arrayBuffer())
	}

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const chosen = event.target.files?.[0]
		if (chosen) void selectFile(chosen)
		event.target.value = ''
	}

	const { isDragging, ...dropHandlers } = useFileDrop(chosen => {
		void selectFile(chosen)
	})

	const reset = () => {
		setFile(null)
		setBytes(null)
		setResult(null)
		setError(null)
	}

	const run = async () => {
		if (!bytes) return

		setError(null)
		setResult(null)
		setStatus('working')
		setProgress({ done: 0, total: 0 })

		try {
			const compressed = await compressPdf(bytes, {
				mode,
				dpi,
				quality: quality / 100,
				onProgress: ({ current, total }) =>
					setProgress({ done: current, total })
			})

			setResult({
				// Копия в новый массив: Blob должен получить обычный ArrayBuffer,
				// а не представление над буфером pdf-lib.
				blob: new Blob([compressed.bytes.slice().buffer], {
					type: 'application/pdf'
				}),
				pageCount: compressed.pageCount,
				mode
			})
		} catch (cause) {
			setError(
				cause instanceof Error && cause.name !== 'AbortError'
					? cause.message
					: 'Не удалось сжать документ'
			)
		} finally {
			setStatus('idle')
		}
	}

	const saved =
		file && result
			? Math.max(0, percentSaved(file.size, result.blob.size))
			: null
	const grew = Boolean(file && result && result.blob.size >= file.size)

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
						{MODES.map(([value, label]) => (
							<button
								key={value}
								type='button'
								onClick={() => {
									setMode(value)
									setResult(null)
								}}
								aria-pressed={mode === value}
								className={toolToggleOption(mode === value)}
							>
								{label}
							</button>
						))}
					</div>

					<span className='text-sm text-muted-foreground'>
						{mode === 'lossless'
							? 'текст, поиск и выделение сохраняются'
							: 'страницы станут картинками — поиск по тексту пропадёт'}
					</span>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => fileInputRef.current?.click()}
							title={file ? 'Выбрать другой файл' : 'Загрузить PDF'}
							className={toolIconButton}
						>
							<Upload className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={reset}
							disabled={!file}
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
					accept='application/pdf,.pdf'
					onChange={handleFileSelect}
					aria-label='Загрузить PDF'
					className='hidden'
				/>

				{file ? (
					<div className='grid md:grid-cols-2'>
						<div className='flex flex-col items-center justify-center gap-2 border-b px-5 py-10 sm:px-6 md:border-r md:border-b-0'>
							<FileText className='h-8 w-8 text-muted-foreground' />
							<span className='max-w-full truncate text-sm'>{file.name}</span>
							<span className='font-mono text-2xl tabular-nums'>
								{formatBytes(file.size)}
							</span>
							<span className='text-xs text-muted-foreground'>исходный</span>
						</div>

						<div className='flex flex-col items-center justify-center gap-2 px-5 py-10 sm:px-6'>
							{status === 'working' ? (
								<span className='flex items-center gap-2 text-sm text-muted-foreground'>
									<Loader2 className='h-4 w-4 animate-spin' />
									{progress.total > 1
										? `Страница ${progress.done} из ${progress.total}`
										: 'Пересобираем документ…'}
								</span>
							) : result ? (
								<>
									<span className='font-mono text-3xl tabular-nums'>
										{formatBytes(result.blob.size)}
									</span>
									{grew ? (
										<span className='max-w-xs text-center text-sm text-muted-foreground'>
											{result.mode === 'raster'
												? 'Стало тяжелее: на страницах текст, а не сканы — картинка такой страницы весит больше самого текста. Здесь поможет бережный режим, а не этот.'
												: 'Меньше не стало — документ уже оптимизирован'}
										</span>
									) : (
										<span className='text-sm font-medium text-green-600 dark:text-green-400'>
											−{saved}%
										</span>
									)}
									<span className='text-xs text-muted-foreground'>
										{result.pageCount}{' '}
										{pluralizeRu(result.pageCount, [
											'страница',
											'страницы',
											'страниц'
										])}
										{result.mode === 'raster' && ' · текстовый слой удалён'}
									</span>
									<Button
										onClick={() =>
											downloadBlob(
												result.blob,
												buildOutputName([file.name], 'compressed')
											)
										}
										className='mt-1 cursor-pointer gap-2'
									>
										<Download className='h-4 w-4' />
										Скачать
									</Button>
								</>
							) : (
								<span className='text-sm text-muted-foreground'>
									Результат появится здесь
								</span>
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
							<span className='text-sm'>Выберите PDF или перетащите сюда</span>
							<span className='text-xs text-muted-foreground'>
								Документ не загружается на сервер — сжатие идёт в браузере
							</span>
						</button>
					</div>
				)}

				{error && (
					<p className='border-t px-5 py-3 text-sm text-destructive sm:px-6'>
						{error}
					</p>
				)}

				{mode === 'raster' && (
					<div className={toolFooterBar}>
						<span className='flex items-center gap-2 text-sm text-muted-foreground'>
							Плотность
							{DPI_OPTIONS.map(value => (
								<button
									key={value}
									type='button'
									onClick={() => {
										setDpi(value)
										setResult(null)
									}}
									aria-pressed={dpi === value}
									className={toolPill(dpi === value)}
								>
									{value} dpi
								</button>
							))}
						</span>

						<label className='flex items-center gap-2 text-sm text-muted-foreground'>
							Качество
							<Slider
								value={[quality]}
								onValueChange={([value]) => {
									setQuality(value)
									setResult(null)
								}}
								min={30}
								max={95}
								step={5}
								className='w-32 cursor-pointer'
								aria-label='Качество страниц'
							/>
							<span className='w-10 font-mono text-sm text-foreground tabular-nums'>
								{quality}%
							</span>
						</label>
					</div>
				)}

				<div className={toolFooterBar}>
					<Button
						onClick={run}
						disabled={!file || status === 'working'}
						className='cursor-pointer gap-2'
					>
						{status === 'working' ? (
							<Loader2 className='h-4 w-4 animate-spin' />
						) : null}
						Сжать
					</Button>
				</div>
			</Card>

			<CompressPdfSeo />
		</WidgetSEOWrapper>
	)
}

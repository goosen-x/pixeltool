'use client'

import { useEffect, useRef, useState } from 'react'
import { Download, Loader2, Trash2, Upload } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill,
	toolToggleOption,
	toolToggleTrack
} from '@/lib/ui/tool-pill'
import { formatBytes } from '@/lib/utils/format-bytes'
import { downloadBlob } from '@/lib/utils/download-blob'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { useFileDrop } from '@/lib/hooks/useFileDrop'
import {
	buildOutputName,
	buildPageName,
	checkPdfFile,
	parsePageRange
} from '@/lib/tools/pdf'
import {
	canvasToBlob,
	closePdf,
	openPdf,
	releaseCanvas,
	renderPageToCanvas,
	scaleForDpi
} from '@/lib/tools/pdf-render'
import { pluralizeRu } from '@/lib/utils/pluralize'
import { cn } from '@/lib/utils'
import { PdfToJpgSeo } from './PdfToJpgSeo'

type Format = 'image/jpeg' | 'image/png'

const FORMATS: [Format, string][] = [
	['image/jpeg', 'JPEG'],
	['image/png', 'PNG']
]

const EXTENSIONS: Record<Format, string> = {
	'image/jpeg': 'jpg',
	'image/png': 'png'
}

const DPI_OPTIONS = [72, 150, 300]

export default function PdfToJpgPage() {
	const widget = getWidgetById('pdf-to-jpg')!

	const [file, setFile] = useState<File | null>(null)
	const [bytes, setBytes] = useState<ArrayBuffer | null>(null)
	const [totalPages, setTotalPages] = useState(0)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)

	const [format, setFormat] = useState<Format>('image/jpeg')
	const [dpi, setDpi] = useState(150)
	const [quality, setQuality] = useState(85)
	const [pagesInput, setPagesInput] = useState('')

	const [status, setStatus] = useState<'idle' | 'reading' | 'exporting'>('idle')
	const [progress, setProgress] = useState<{ done: number; total: number }>({
		done: 0,
		total: 0
	})
	const [error, setError] = useState<string | null>(null)

	const fileInputRef = useRef<HTMLInputElement>(null)

	// Превью живёт в объектном URL — его нужно отзывать, иначе на десятке
	// сменённых файлов вкладка держит в памяти все прошлые картинки.
	useEffect(() => {
		return () => {
			if (previewUrl) URL.revokeObjectURL(previewUrl)
		}
	}, [previewUrl])

	const selectFile = async (chosen: File) => {
		const problem = checkPdfFile(chosen)
		if (problem) {
			setError(problem.message)
			return
		}

		setError(null)
		setStatus('reading')
		setFile(chosen)
		setPagesInput('')

		try {
			const buffer = await chosen.arrayBuffer()
			const pdf = await openPdf(buffer)
			setBytes(buffer)
			setTotalPages(pdf.numPages)

			const firstPage = await pdf.getPage(1)
			const canvas = await renderPageToCanvas(firstPage, scaleForDpi(96))
			const blob = await canvasToBlob(canvas, 'image/jpeg', 0.8)
			releaseCanvas(canvas)
			await closePdf(pdf)

			setPreviewUrl(current => {
				if (current) URL.revokeObjectURL(current)
				return URL.createObjectURL(blob)
			})
		} catch {
			setError('Не удалось прочитать PDF — файл повреждён или запаролен')
			setFile(null)
			setBytes(null)
			setTotalPages(0)
		} finally {
			setStatus('idle')
		}
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
		setTotalPages(0)
		setPagesInput('')
		setError(null)
		setPreviewUrl(current => {
			if (current) URL.revokeObjectURL(current)
			return null
		})
	}

	const selectedPages = totalPages ? parsePageRange(pagesInput, totalPages) : []

	const exportPages = async () => {
		if (!file || !bytes || selectedPages.length === 0) return

		setError(null)
		setStatus('exporting')
		setProgress({ done: 0, total: selectedPages.length })

		const pdf = await openPdf(bytes)

		try {
			const rendered: { name: string; blob: Blob }[] = []

			for (const [index, pageNumber] of selectedPages.entries()) {
				const page = await pdf.getPage(pageNumber)
				const canvas = await renderPageToCanvas(page, scaleForDpi(dpi))

				try {
					// PNG не знает про качество — параметр canvas молча игнорирует.
					const blob = await canvasToBlob(canvas, format, quality / 100)
					rendered.push({
						name: buildPageName(
							file.name,
							pageNumber,
							totalPages,
							EXTENSIONS[format]
						),
						blob
					})
				} finally {
					releaseCanvas(canvas)
					page.cleanup()
				}

				setProgress({ done: index + 1, total: selectedPages.length })
			}

			if (rendered.length === 1) {
				downloadBlob(rendered[0].blob, rendered[0].name)
			} else {
				// jszip грузится только здесь: он нужен ровно в момент выгрузки
				// нескольких страниц и не должен весить в бандле у всех остальных.
				const { default: JSZip } = await import('jszip')
				const zip = new JSZip()
				for (const item of rendered) zip.file(item.name, item.blob)

				const archive = await zip.generateAsync({
					type: 'blob',
					// Картинки уже сжаты — второй проход дефлейтом отнял бы секунды
					// и не выиграл почти ничего.
					compression: 'STORE'
				})
				downloadBlob(archive, buildOutputName([file.name], 'pages', 'zip'))
			}
		} catch {
			setError('Не удалось сохранить страницы')
		} finally {
			await closePdf(pdf)
			setStatus('idle')
		}
	}

	const canExport =
		Boolean(file) && selectedPages.length > 0 && status === 'idle'

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
						{FORMATS.map(([value, label]) => (
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

					{file && (
						<span className='text-sm text-muted-foreground'>
							{totalPages}{' '}
							{pluralizeRu(totalPages, ['страница', 'страницы', 'страниц'])} ·{' '}
							{formatBytes(file.size)}
						</span>
					)}

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
					<div className='flex flex-col items-center gap-3 px-5 py-6 sm:px-6'>
						{status === 'reading' ? (
							<div className='flex h-72 items-center justify-center gap-2 text-sm text-muted-foreground'>
								<Loader2 className='h-4 w-4 animate-spin' />
								Читаем документ…
							</div>
						) : previewUrl ? (
							<>
								{/* eslint-disable-next-line @next/next/no-img-element -- object URL, не оптимизируем через next/image */}
								<img
									src={previewUrl}
									alt='Первая страница документа'
									className='max-h-96 w-auto rounded-xl border object-contain'
								/>
								<span className='text-xs text-muted-foreground'>
									превью первой страницы
								</span>
							</>
						) : null}
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
								Файл не загружается на сервер — страницы рисует сам браузер
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
					<span className='flex items-center gap-2 text-sm text-muted-foreground'>
						Плотность
						{DPI_OPTIONS.map(value => (
							<button
								key={value}
								type='button'
								onClick={() => setDpi(value)}
								aria-pressed={dpi === value}
								className={toolPill(dpi === value)}
							>
								{value} dpi
							</button>
						))}
					</span>

					{format === 'image/jpeg' && (
						<label className='flex items-center gap-2 text-sm text-muted-foreground'>
							Качество
							<Slider
								value={[quality]}
								onValueChange={([value]) => setQuality(value)}
								min={40}
								max={100}
								step={5}
								className='w-32 cursor-pointer'
								aria-label='Качество JPEG'
							/>
							<span className='w-10 font-mono text-sm text-foreground tabular-nums'>
								{quality}%
							</span>
						</label>
					)}

					<label className='flex items-center gap-2 text-sm text-muted-foreground'>
						Страницы
						<Input
							value={pagesInput}
							onChange={event => setPagesInput(event.target.value)}
							placeholder={totalPages ? `все, 1-${totalPages}` : 'все'}
							disabled={!file}
							aria-label='Номера страниц: например 1-3, 7'
							className='h-8 w-32 font-mono text-sm'
						/>
					</label>
				</div>

				<div className={toolFooterBar}>
					<Button
						onClick={exportPages}
						disabled={!canExport}
						className='cursor-pointer gap-2'
					>
						{status === 'exporting' ? (
							<Loader2 className='h-4 w-4 animate-spin' />
						) : (
							<Download className='h-4 w-4' />
						)}
						{selectedPages.length > 1 ? 'Скачать архивом' : 'Скачать картинку'}
					</Button>

					<span className='text-sm text-muted-foreground'>
						{status === 'exporting'
							? `Готово ${progress.done} из ${progress.total}`
							: file && selectedPages.length > 0
								? `Выбрано ${selectedPages.length} ${pluralizeRu(selectedPages.length, ['страница', 'страницы', 'страниц'])}`
								: file
									? 'Ни одна страница не выбрана'
									: ''}
					</span>
				</div>
			</Card>

			<PdfToJpgSeo />
		</WidgetSEOWrapper>
	)
}

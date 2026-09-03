'use client'

import { useRef, useState } from 'react'
import {
	ArrowDown,
	ArrowUp,
	Download,
	FileText,
	Loader2,
	Trash2,
	Upload,
	X
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toolBar, toolFooterBar, toolIconButton } from '@/lib/ui/tool-pill'
import { formatBytes } from '@/lib/utils/format-bytes'
import { downloadBlob } from '@/lib/utils/download-blob'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { useFilesDrop } from '@/lib/hooks/useFileDrop'
import { buildOutputName, checkPdfFile } from '@/lib/tools/pdf'
import { mergePdfs, readPageCount } from '@/lib/tools/pdf-merge'
import { pluralizeRu } from '@/lib/utils/pluralize'
import { cn } from '@/lib/utils'
import { MergePdfSeo } from './MergePdfSeo'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'

interface QueueItem {
	/** Свой идентификатор, а не имя файла: одинаковые имена в очереди —
	 *  норма (два «Скан.pdf» из разных папок), а ключ React должен быть
	 *  уникальным, иначе перестановка строк ломает разметку. */
	id: number
	file: File
	bytes: ArrayBuffer
	pageCount: number | null
}

let nextId = 0

export default function MergePdfPage() {
	const widget = getWidgetById('merge-pdf')!

	const [items, setItems] = useState<QueueItem[]>([])
	const [rejected, setRejected] = useState<string[]>([])
	const [status, setStatus] = useState<'idle' | 'reading' | 'merging'>('idle')
	const [error, setError] = useState<string | null>(null)

	const fileInputRef = useRef<HTMLInputElement>(null)

	const addFiles = async (files: File[]) => {
		setError(null)
		setStatus('reading')

		const accepted: QueueItem[] = []
		const skipped: string[] = []

		for (const file of files) {
			const problem = checkPdfFile(file)
			if (problem) {
				skipped.push(`${file.name} — ${problem.message.toLowerCase()}`)
				continue
			}

			const bytes = await file.arrayBuffer()
			accepted.push({
				id: nextId++,
				file,
				bytes,
				pageCount: await readPageCount(bytes)
			})
		}

		setItems(current => [...current, ...accepted])
		setRejected(skipped)
		setStatus('idle')
	}

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files ?? [])
		if (files.length > 0) void addFiles(files)
		// Сбрасываем input: иначе повторный выбор того же файла не даст
		// события change, и человек решит, что кнопка сломалась.
		event.target.value = ''
	}

	const { isDragging, ...dropHandlers } = useFilesDrop(files => {
		void addFiles(files)
	})

	const move = (index: number, direction: -1 | 1) => {
		const target = index + direction
		setItems(current => {
			if (target < 0 || target >= current.length) return current
			const next = [...current]
			;[next[index], next[target]] = [next[target], next[index]]
			return next
		})
	}

	const remove = (id: number) => {
		setItems(current => current.filter(item => item.id !== id))
		setError(null)
	}

	const reset = () => {
		setItems([])
		setRejected([])
		setError(null)
	}

	const merge = async () => {
		setError(null)
		setStatus('merging')

		try {
			const bytes = await mergePdfs(
				items.map(item => ({ name: item.file.name, bytes: item.bytes }))
			)
			// Копия в новый массив: Blob должен получить обычный ArrayBuffer, а
			// не представление над буфером pdf-lib.
			const blob = new Blob([bytes.slice().buffer], { type: 'application/pdf' })
			downloadBlob(
				blob,
				buildOutputName(
					items.map(item => item.file.name),
					'merged'
				)
			)
		} catch (cause) {
			setError(
				cause instanceof Error ? cause.message : 'Не удалось объединить файлы'
			)
		} finally {
			setStatus('idle')
		}
	}

	const readablePages = items.reduce(
		(total, item) => total + (item.pageCount ?? 0),
		0
	)
	const hasUnreadable = items.some(item => item.pageCount === null)
	const canMerge = items.length >= 2 && !hasUnreadable && status === 'idle'

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
					<span className='text-sm text-muted-foreground'>
						{items.length === 0
							? 'Файлы склеятся в том порядке, в каком лежат в списке'
							: `${items.length} ${pluralizeRu(items.length, ['файл', 'файла', 'файлов'])} · ${readablePages} ${pluralizeRu(readablePages, ['страница', 'страницы', 'страниц'])}`}
					</span>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => fileInputRef.current?.click()}
							title='Добавить файлы'
							className={toolIconButton}
						>
							<Upload className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={reset}
							disabled={items.length === 0}
							title='Очистить список'
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
					multiple
					onChange={handleFileSelect}
					aria-label='Выбрать PDF-файлы'
					className='hidden'
				/>

				{items.length > 0 ? (
					<ul className='divide-y'>
						{items.map((item, index) => (
							<li
								key={item.id}
								className='flex items-center gap-3 px-5 py-3 sm:px-6'
							>
								<span className='w-6 shrink-0 text-center font-mono text-sm text-muted-foreground tabular-nums'>
									{index + 1}
								</span>
								<FileText className='h-4 w-4 shrink-0 text-muted-foreground' />

								<span className='min-w-0 flex-1'>
									<span className='block truncate text-sm'>
										{item.file.name}
									</span>
									<span className='block text-xs text-muted-foreground'>
										{item.pageCount === null ? (
											<span className='text-destructive'>
												не читается — уберите из списка
											</span>
										) : (
											<>
												{item.pageCount}{' '}
												{pluralizeRu(item.pageCount, [
													'страница',
													'страницы',
													'страниц'
												])}{' '}
												· {formatBytes(item.file.size)}
											</>
										)}
									</span>
								</span>

								<span className='flex shrink-0 items-center gap-0.5'>
									<Button
										size='icon'
										variant='ghost'
										onClick={() => move(index, -1)}
										disabled={index === 0}
										title='Выше'
										className={toolIconButton}
									>
										<ArrowUp className='h-4 w-4' />
									</Button>
									<Button
										size='icon'
										variant='ghost'
										onClick={() => move(index, 1)}
										disabled={index === items.length - 1}
										title='Ниже'
										className={toolIconButton}
									>
										<ArrowDown className='h-4 w-4' />
									</Button>
									<Button
										size='icon'
										variant='ghost'
										onClick={() => remove(item.id)}
										title='Убрать из списка'
										className={toolIconButton}
									>
										<X className='h-4 w-4' />
									</Button>
								</span>
							</li>
						))}
					</ul>
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
							<span className='text-sm'>
								Выберите PDF-файлы или перетащите сюда
							</span>
							<span className='text-xs text-muted-foreground'>
								Файлы не загружаются на сервер — склейка идёт в браузере
							</span>
						</button>
					</div>
				)}

				{(rejected.length > 0 || error) && (
					<div className='border-t px-5 py-3 text-sm text-destructive sm:px-6'>
						{error && <p>{error}</p>}
						{rejected.map(line => (
							<p key={line}>Пропущен {line}</p>
						))}
					</div>
				)}

				<div className={toolFooterBar}>
					<Button
						onClick={merge}
						disabled={!canMerge}
						className='cursor-pointer gap-2'
					>
						{status === 'merging' ? (
							<Loader2 className='h-4 w-4 animate-spin' />
						) : (
							<Download className='h-4 w-4' />
						)}
						Объединить и скачать
					</Button>

					{items.length === 1 && (
						<span className='text-sm text-muted-foreground'>
							Добавьте хотя бы ещё один файл
						</span>
					)}
					{status === 'reading' && (
						<span className='flex items-center gap-2 text-sm text-muted-foreground'>
							<Loader2 className='h-4 w-4 animate-spin' />
							Читаем файлы…
						</span>
					)}
				</div>
			</Card>

			<ToolScreenshot slug='merge-pdf' />
			<MergePdfSeo />
		</WidgetSEOWrapper>
	)
}

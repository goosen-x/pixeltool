'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
	ChevronLeft,
	ChevronRight,
	Download,
	Loader2,
	Pen,
	Stamp,
	Trash2,
	Upload,
	X
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import { downloadBlob } from '@/lib/utils/download-blob'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { useFileDrop } from '@/lib/hooks/useFileDrop'
import { SignaturePad } from '@/components/tools/SignaturePad'
import { buildOutputName, checkPdfFile } from '@/lib/tools/pdf'
import {
	canvasToBlob,
	closePdf,
	openPdf,
	releaseCanvas,
	renderPageToCanvas,
	scaleForDpi
} from '@/lib/tools/pdf-render'
import { signPdf, type StampImage } from '@/lib/tools/pdf-sign'
import {
	clampPlacement,
	DEFAULT_SIGNATURE_WIDTH,
	DEFAULT_STAMP_WIDTH,
	type Placement
} from '@/lib/tools/pdf-stamp'
import {
	canvasToPngBlob,
	fileToCanvas,
	removeBackground,
	trimCanvas
} from '@/lib/tools/signature-image'
import { cn } from '@/lib/utils'
import { SignPdfSeo } from './SignPdfSeo'

type AssetKind = 'signature' | 'stamp'

interface Asset {
	id: number
	kind: AssetKind
	/** Исходник загруженной картинки — нужен, чтобы переобработать её при
	 *  смене настройки фона. У нарисованной подписи его нет: она и так
	 *  прозрачная. */
	source: File | null
	blob: Blob
	url: string
	aspect: number
}

interface PagePreview {
	url: string
	/** Размер листа в пунктах, уже с учётом поворота страницы. */
	width: number
	height: number
}

const KIND_LABELS: Record<AssetKind, string> = {
	signature: 'Подпись',
	stamp: 'Печать'
}

let nextId = 0

export default function SignPdfPage() {
	const widget = getWidgetById('sign-pdf')!

	const [file, setFile] = useState<File | null>(null)
	const [bytes, setBytes] = useState<ArrayBuffer | null>(null)
	const [totalPages, setTotalPages] = useState(0)
	const [pageNumber, setPageNumber] = useState(1)
	const [previews, setPreviews] = useState<Map<number, PagePreview>>(new Map())

	const [assets, setAssets] = useState<Asset[]>([])
	const [placements, setPlacements] = useState<Placement[]>([])
	const [selectedId, setSelectedId] = useState<number | null>(null)
	const [dropWhite, setDropWhite] = useState(true)

	const [drawing, setDrawing] = useState(false)
	const [status, setStatus] = useState<
		'idle' | 'reading' | 'rendering' | 'saving'
	>('idle')
	const [error, setError] = useState<string | null>(null)

	const pdfInputRef = useRef<HTMLInputElement>(null)
	const imageInputRef = useRef<HTMLInputElement>(null)
	const uploadKind = useRef<AssetKind>('signature')
	const stageRef = useRef<HTMLDivElement>(null)
	const dragOffset = useRef<{ x: number; y: number } | null>(null)

	// Объектные URL живут, пока живёт вкладка, поэтому отзываем их сами.
	useEffect(() => {
		return () => {
			for (const asset of assets) URL.revokeObjectURL(asset.url)
		}
	}, [assets])

	useEffect(() => {
		return () => {
			for (const preview of previews.values()) URL.revokeObjectURL(preview.url)
		}
	}, [previews])

	const selectPdf = async (chosen: File) => {
		const problem = checkPdfFile(chosen)
		if (problem) {
			setError(problem.message)
			return
		}

		setError(null)
		setStatus('reading')
		setPlacements([])
		setSelectedId(null)
		setPreviews(new Map())
		setPageNumber(1)

		try {
			const buffer = await chosen.arrayBuffer()
			const pdf = await openPdf(buffer)
			setTotalPages(pdf.numPages)
			await closePdf(pdf)
			setFile(chosen)
			setBytes(buffer)
		} catch {
			setError('Не удалось прочитать PDF — файл повреждён или запаролен')
			setFile(null)
			setBytes(null)
			setTotalPages(0)
		} finally {
			setStatus('idle')
		}
	}

	/** Превью страницы рисуется по требованию и запоминается: перелистывать
	 *  туда-сюда по стостраничному договору, каждый раз рисуя заново, — это
	 *  секунды ожидания на каждое нажатие. */
	const ensurePreview = useCallback(
		async (page: number) => {
			if (!bytes || previews.has(page)) return

			setStatus('rendering')
			try {
				const pdf = await openPdf(bytes)
				const target = await pdf.getPage(page)
				const viewport = target.getViewport({ scale: 1 })
				const canvas = await renderPageToCanvas(target, scaleForDpi(110))
				const blob = await canvasToBlob(canvas, 'image/jpeg', 0.85)
				releaseCanvas(canvas)
				target.cleanup()
				await closePdf(pdf)

				setPreviews(current => {
					if (current.has(page)) return current
					const next = new Map(current)
					next.set(page, {
						url: URL.createObjectURL(blob),
						width: viewport.width,
						height: viewport.height
					})
					return next
				})
			} catch {
				setError('Не удалось показать страницу')
			} finally {
				setStatus('idle')
			}
		},
		[bytes, previews]
	)

	useEffect(() => {
		if (bytes && totalPages > 0) void ensurePreview(pageNumber)
	}, [bytes, totalPages, pageNumber, ensurePreview])

	const handlePdfSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const chosen = event.target.files?.[0]
		if (chosen) void selectPdf(chosen)
		event.target.value = ''
	}

	const { isDragging, ...dropHandlers } = useFileDrop(chosen => {
		void selectPdf(chosen)
	})

	/** Готовит картинку к постановке: убирает фон, если попросили, и
	 *  обрезает пустые поля. */
	const prepareImage = async (source: File, drop: boolean) => {
		const canvas = await fileToCanvas(source)
		if (drop) removeBackground(canvas)
		const trimmed = trimCanvas(canvas)
		return {
			blob: await canvasToPngBlob(trimmed),
			aspect: trimmed.width / trimmed.height
		}
	}

	const handleImageSelect = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const chosen = event.target.files?.[0]
		event.target.value = ''
		if (!chosen) return

		if (!chosen.type.startsWith('image/')) {
			setError('Нужна картинка — PNG или JPEG')
			return
		}

		setError(null)
		try {
			const { blob, aspect } = await prepareImage(chosen, dropWhite)
			addAsset(uploadKind.current, blob, aspect, chosen)
		} catch {
			setError('Не удалось прочитать картинку')
		}
	}

	const addAsset = (
		kind: AssetKind,
		blob: Blob,
		aspect: number,
		source: File | null
	) => {
		const asset: Asset = {
			id: nextId++,
			kind,
			source,
			blob,
			url: URL.createObjectURL(blob),
			aspect
		}
		// На каждый вид держим одну картинку: две подписи в интерфейсе — это
		// вопрос «а какая из них моя», которого быть не должно.
		setAssets(current => {
			const previous = current.find(item => item.kind === kind)
			if (previous) URL.revokeObjectURL(previous.url)
			return [...current.filter(item => item.kind !== kind), asset]
		})
		setPlacements(current =>
			current.filter(placement => placement.kind !== kind)
		)
		place(asset)
	}

	/** Ставит картинку в середину видимой страницы. */
	const place = (asset: Asset) => {
		const width =
			asset.kind === 'signature' ? DEFAULT_SIGNATURE_WIDTH : DEFAULT_STAMP_WIDTH
		const preview = previews.get(pageNumber)
		const visual = preview
			? { width: preview.width, height: preview.height }
			: { width: 595, height: 842 }

		const centered = clampPlacement(
			{
				x: 0.5 - width / 2,
				y: 0.62,
				width
			},
			asset.aspect,
			visual
		)

		const placement: Placement = {
			id: nextId++,
			kind: asset.kind,
			imageId: asset.id,
			pageNumber,
			...centered
		}
		setPlacements(current => [...current, placement])
		setSelectedId(placement.id)
	}

	// Смена настройки фона переобрабатывает уже загруженные картинки: иначе
	// тумблер выглядел бы сломанным — переключаешь, а на странице ничего.
	const toggleDropWhite = async () => {
		const next = !dropWhite
		setDropWhite(next)

		for (const asset of assets) {
			if (!asset.source) continue
			try {
				const { blob, aspect } = await prepareImage(asset.source, next)
				const url = URL.createObjectURL(blob)
				URL.revokeObjectURL(asset.url)

				setAssets(current =>
					current.map(item =>
						item.id === asset.id ? { ...item, blob, url, aspect } : item
					)
				)
			} catch {
				setError('Не удалось переобработать картинку')
			}
		}
	}

	const selected = placements.find(item => item.id === selectedId) ?? null
	const preview = previews.get(pageNumber) ?? null
	const visualSize = preview
		? { width: preview.width, height: preview.height }
		: { width: 595, height: 842 }

	const updateSelected = (
		patch: Partial<Pick<Placement, 'x' | 'y' | 'width'>>
	) => {
		if (!selected) return
		const asset = assets.find(item => item.id === selected.imageId)
		if (!asset) return

		const merged = {
			x: selected.x,
			y: selected.y,
			width: selected.width,
			...patch
		}
		const clamped = clampPlacement(merged, asset.aspect, visualSize)

		setPlacements(current =>
			current.map(item =>
				item.id === selected.id ? { ...item, ...clamped } : item
			)
		)
	}

	const startDrag = (
		event: React.PointerEvent<HTMLDivElement>,
		placement: Placement
	) => {
		const stage = stageRef.current
		if (!stage) return

		event.preventDefault()
		event.currentTarget.setPointerCapture(event.pointerId)
		setSelectedId(placement.id)

		const rect = stage.getBoundingClientRect()
		dragOffset.current = {
			x: (event.clientX - rect.left) / rect.width - placement.x,
			y: (event.clientY - rect.top) / rect.height - placement.y
		}
	}

	const moveDrag = (event: React.PointerEvent<HTMLDivElement>) => {
		const stage = stageRef.current
		const offset = dragOffset.current
		if (!stage || !offset) return

		const rect = stage.getBoundingClientRect()
		updateSelected({
			x: (event.clientX - rect.left) / rect.width - offset.x,
			y: (event.clientY - rect.top) / rect.height - offset.y
		})
	}

	const endDrag = () => {
		dragOffset.current = null
	}

	const removeSelected = () => {
		if (!selected) return
		setPlacements(current => current.filter(item => item.id !== selected.id))
		setSelectedId(null)
	}

	const reset = () => {
		setFile(null)
		setBytes(null)
		setTotalPages(0)
		setPlacements([])
		setSelectedId(null)
		setPreviews(new Map())
		setError(null)
	}

	const save = async () => {
		if (!bytes || !file) return

		setError(null)
		setStatus('saving')
		try {
			const images = new Map<number, StampImage>()
			for (const asset of assets) {
				images.set(asset.id, {
					bytes: await asset.blob.arrayBuffer(),
					aspect: asset.aspect
				})
			}

			const result = await signPdf(bytes, images, placements)
			downloadBlob(
				new Blob([result.slice().buffer], { type: 'application/pdf' }),
				buildOutputName([file.name], 'signed')
			)
		} catch (cause) {
			setError(
				cause instanceof Error ? cause.message : 'Не удалось собрать документ'
			)
		} finally {
			setStatus('idle')
		}
	}

	const onPage = placements.filter(item => item.pageNumber === pageNumber)
	const signature = assets.find(item => item.kind === 'signature') ?? null
	const stamp = assets.find(item => item.kind === 'stamp') ?? null

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
						{file
							? `${file.name} · ${totalPages} стр.`
							: 'Подпись и печать ставятся поверх страниц, текст документа не меняется'}
					</span>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => pdfInputRef.current?.click()}
							title={file ? 'Выбрать другой документ' : 'Загрузить PDF'}
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
					ref={pdfInputRef}
					type='file'
					accept='application/pdf,.pdf'
					onChange={handlePdfSelect}
					aria-label='Загрузить PDF'
					className='hidden'
				/>
				<input
					ref={imageInputRef}
					type='file'
					accept='image/*'
					onChange={event => void handleImageSelect(event)}
					aria-label='Загрузить картинку подписи или печати'
					className='hidden'
				/>

				{!file ? (
					<div className='px-5 py-6 sm:px-6'>
						<button
							type='button'
							onClick={() => pdfInputRef.current?.click()}
							className={cn(
								'flex w-full cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed py-16 transition-colors hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
								isDragging && 'border-primary bg-primary/5'
							)}
						>
							<Upload className='h-6 w-6 text-muted-foreground' />
							<span className='text-sm'>Выберите PDF или перетащите сюда</span>
							<span className='text-xs text-muted-foreground'>
								Документ не загружается на сервер — всё происходит в браузере
							</span>
						</button>
					</div>
				) : drawing ? (
					<SignaturePad
						onCancel={() => setDrawing(false)}
						onDone={async blob => {
							setDrawing(false)
							const bitmap = await createImageBitmap(blob)
							addAsset('signature', blob, bitmap.width / bitmap.height, null)
							bitmap.close()
						}}
					/>
				) : (
					<div className='flex justify-center bg-muted/20 px-5 py-6 sm:px-6'>
						{preview ? (
							<div
								ref={stageRef}
								className='relative w-full max-w-lg touch-none select-none'
								onPointerMove={moveDrag}
								onPointerUp={endDrag}
								onPointerLeave={endDrag}
							>
								{/* eslint-disable-next-line @next/next/no-img-element -- object URL, не оптимизируем через next/image */}
								<img
									src={preview.url}
									alt={`Страница ${pageNumber}`}
									className='w-full rounded-lg border bg-background shadow-sm'
									draggable={false}
								/>

								{onPage.map(placement => {
									const asset = assets.find(
										item => item.id === placement.imageId
									)
									if (!asset) return null

									return (
										<div
											key={placement.id}
											onPointerDown={event => startDrag(event, placement)}
											role='button'
											tabIndex={0}
											aria-label={`${KIND_LABELS[placement.kind]} на странице ${placement.pageNumber}`}
											className={cn(
												'absolute cursor-move rounded-sm ring-offset-1',
												placement.id === selectedId
													? 'ring-2 ring-primary'
													: 'ring-1 ring-transparent hover:ring-primary/40'
											)}
											style={{
												left: `${placement.x * 100}%`,
												top: `${placement.y * 100}%`,
												width: `${placement.width * 100}%`
											}}
										>
											{/* eslint-disable-next-line @next/next/no-img-element -- object URL, не оптимизируем через next/image */}
											<img
												src={asset.url}
												alt=''
												className='pointer-events-none w-full'
												draggable={false}
											/>
										</div>
									)
								})}
							</div>
						) : (
							<div className='flex h-96 items-center justify-center gap-2 text-sm text-muted-foreground'>
								<Loader2 className='h-4 w-4 animate-spin' />
								Готовим страницу…
							</div>
						)}
					</div>
				)}

				{error && (
					<p className='border-t px-5 py-3 text-sm text-destructive sm:px-6'>
						{error}
					</p>
				)}

				{file && !drawing && (
					<>
						<div className={toolFooterBar}>
							<span className='flex items-center gap-2 text-sm text-muted-foreground'>
								<Pen className='h-4 w-4' />
								Подпись
								{signature ? (
									<>
										{/* eslint-disable-next-line @next/next/no-img-element -- object URL */}
										<img
											src={signature.url}
											alt='Ваша подпись'
											className='h-7 w-auto rounded border bg-background px-1'
										/>
										<button
											type='button'
											onClick={() => place(signature)}
											className={toolPill(false)}
										>
											поставить
										</button>
									</>
								) : (
									<>
										<button
											type='button'
											onClick={() => setDrawing(true)}
											className={toolPill(false)}
										>
											нарисовать
										</button>
										<button
											type='button'
											onClick={() => {
												uploadKind.current = 'signature'
												imageInputRef.current?.click()
											}}
											className={toolPill(false)}
										>
											загрузить
										</button>
									</>
								)}
							</span>

							<span className='flex items-center gap-2 text-sm text-muted-foreground'>
								<Stamp className='h-4 w-4' />
								Печать
								{stamp ? (
									<>
										{/* eslint-disable-next-line @next/next/no-img-element -- object URL */}
										<img
											src={stamp.url}
											alt='Ваша печать'
											className='h-7 w-auto rounded border bg-background px-1'
										/>
										<button
											type='button'
											onClick={() => place(stamp)}
											className={toolPill(false)}
										>
											поставить
										</button>
									</>
								) : (
									<button
										type='button'
										onClick={() => {
											uploadKind.current = 'stamp'
											imageInputRef.current?.click()
										}}
										className={toolPill(false)}
									>
										загрузить
									</button>
								)}
							</span>

							<button
								type='button'
								onClick={() => void toggleDropWhite()}
								aria-pressed={dropWhite}
								className={toolPill(dropWhite, 'sm:ml-auto')}
							>
								убрать белый фон
							</button>
						</div>

						<div className={toolFooterBar}>
							<span className='flex items-center gap-1'>
								<Button
									size='icon'
									variant='ghost'
									onClick={() => setPageNumber(page => Math.max(1, page - 1))}
									disabled={pageNumber <= 1}
									title='Предыдущая страница'
									className={toolIconButton}
								>
									<ChevronLeft className='h-4 w-4' />
								</Button>
								<span className='font-mono text-sm tabular-nums'>
									{pageNumber} / {totalPages}
								</span>
								<Button
									size='icon'
									variant='ghost'
									onClick={() =>
										setPageNumber(page => Math.min(totalPages, page + 1))
									}
									disabled={pageNumber >= totalPages}
									title='Следующая страница'
									className={toolIconButton}
								>
									<ChevronRight className='h-4 w-4' />
								</Button>
							</span>

							{selected ? (
								<>
									<label className='flex items-center gap-2 text-sm text-muted-foreground'>
										Размер
										<Slider
											value={[Math.round(selected.width * 100)]}
											onValueChange={([value]) =>
												updateSelected({ width: value / 100 })
											}
											min={5}
											max={90}
											step={1}
											className='w-32 cursor-pointer'
											aria-label='Размер выбранной картинки'
										/>
										<span className='w-10 font-mono text-sm text-foreground tabular-nums'>
											{Math.round(selected.width * 100)}%
										</span>
									</label>

									<Button
										size='icon'
										variant='ghost'
										onClick={removeSelected}
										title='Убрать со страницы'
										className={toolIconButton}
									>
										<X className='h-4 w-4' />
									</Button>
								</>
							) : (
								<span className='text-sm text-muted-foreground'>
									{onPage.length > 0
										? 'Выберите подпись на странице, чтобы изменить размер'
										: 'Поставьте подпись или печать на страницу'}
								</span>
							)}

							<Button
								onClick={save}
								disabled={placements.length === 0 || status === 'saving'}
								className='cursor-pointer gap-2 sm:ml-auto'
							>
								{status === 'saving' ? (
									<Loader2 className='h-4 w-4 animate-spin' />
								) : (
									<Download className='h-4 w-4' />
								)}
								Скачать PDF
							</Button>
						</div>
					</>
				)}
			</Card>

			<SignPdfSeo />
		</WidgetSEOWrapper>
	)
}

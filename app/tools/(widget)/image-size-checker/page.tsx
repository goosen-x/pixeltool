'use client'

import { useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
	Upload,
	Download,
	X,
	ImageIcon,
	Trash2,
	Copy,
	Check,
	AlertTriangle,
	Minimize2
} from 'lucide-react'
import { toolBar, toolIconButton } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { ImageSizeCheckerSeo } from './ImageSizeCheckerSeo'
import { cn } from '@/lib/utils'
import { pluralizeRu } from '@/lib/utils/pluralize'
import { useCopyToClipboard } from '@/lib/hooks/useCopyToClipboard'
import { setHandoffFile } from '@/lib/tools/file-handoff'

interface ImageInfo {
	name: string
	url: string
	width: number
	height: number
	aspectRatio: string
	fileSize: number
	fileSizeFormatted: string
	format: string
	lastModified: Date
	/** Оригинальный файл — нужен, чтобы передать его в compress-image по клику «Сжать», а не только показать метаданные. */
	file: File
}

const STANDARD_RATIOS = [
	{ label: '1:1', value: 1 },
	{ label: '4:3', value: 4 / 3 },
	{ label: '3:2', value: 3 / 2 },
	{ label: '16:9', value: 16 / 9 },
	{ label: '9:16', value: 9 / 16 },
	{ label: '2:1', value: 2 }
]

// Ориентир из SEO-текста ниже («до 200–300 КБ на иллюстрацию»).
const HEAVY_THRESHOLD_BYTES = 300 * 1024

// Если реальное соотношение уже точно совпадает с одним из частых — подсказка
// не нужна, оно и так узнаваемо. Если нет — берём ближайшее, но только в
// пределах 15% отклонения: для сильно нестандартного кадра «ближайший»
// стандарт всё равно бесполезен и только шумит.
function closestRatioHint(image: ImageInfo): string | null {
	if (STANDARD_RATIOS.some(r => r.label === image.aspectRatio)) return null
	const ratio = image.width / image.height
	let best = STANDARD_RATIOS[0]
	let bestDiff = Infinity
	for (const r of STANDARD_RATIOS) {
		const diff = Math.abs(ratio - r.value)
		if (diff < bestDiff) {
			bestDiff = diff
			best = r
		}
	}
	return bestDiff / best.value < 0.15 ? best.label : null
}

function copyText(image: ImageInfo): string {
	return `${image.width} × ${image.height}, ${image.aspectRatio}, ${image.fileSizeFormatted}, ${image.format.split('/')[1]?.toUpperCase() || image.format}`
}

function RatioBadge({ image }: { image: ImageInfo }) {
	const hint = closestRatioHint(image)
	if (!hint) {
		return (
			<Badge variant='outline' className='font-mono'>
				{image.aspectRatio}
			</Badge>
		)
	}
	return (
		<Badge
			variant='outline'
			title={`Точное соотношение ${image.aspectRatio} — ближе всего к ${hint}, но не совпадает. При вставке в формат ${hint} края обрежутся.`}
			className='gap-1 border-amber-500/40 font-mono text-amber-700 dark:text-amber-400'
		>
			Примерно {hint}
		</Badge>
	)
}

function WeightLabel({ image }: { image: ImageInfo }) {
	const heavy = image.fileSize > HEAVY_THRESHOLD_BYTES
	return (
		<span className='inline-flex flex-wrap items-center gap-1.5'>
			<span
				className={cn(
					'font-mono',
					heavy ? 'text-amber-700 dark:text-amber-400' : 'text-muted-foreground'
				)}
			>
				{image.fileSizeFormatted}
			</span>
			{heavy && (
				<Badge
					variant='outline'
					title='Тяжелее ориентира ~300 КБ для обычной картинки на сайте'
					className='gap-1 border-amber-500/40 text-amber-700 dark:text-amber-400'
				>
					<AlertTriangle className='h-3 w-3' />
					Большой файл
				</Badge>
			)}
		</span>
	)
}

function megapixels(image: ImageInfo): string {
	return ((image.width * image.height) / 1_000_000).toFixed(1)
}

/** Мегапиксели и дата изменения — метаданные, которые уже были в объекте ImageInfo, но нигде не показывались. */
function MetaLine({ image }: { image: ImageInfo }) {
	return (
		<div className='flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground'>
			<span>{megapixels(image)} Мп</span>
			<span>Изменён: {image.lastModified.toLocaleDateString('ru-RU')}</span>
		</div>
	)
}

function CopyButton({
	image,
	copiedId,
	id,
	onCopy,
	className
}: {
	image: ImageInfo
	copiedId: string | null
	id: string
	onCopy: (text: string, id: string) => void
	className?: string
}) {
	const copied = copiedId === id

	return (
		<Button
			size='icon'
			variant='ghost'
			title='Скопировать данные'
			onClick={() => onCopy(copyText(image), id)}
			className={cn(toolIconButton, className)}
		>
			{copied ? (
				<Check className='h-4 w-4 text-emerald-600' />
			) : (
				<Copy className='h-4 w-4' />
			)}
		</Button>
	)
}

export default function ImageSizeCheckerPage() {
	const widget = getWidgetById('image-size-checker')!
	const router = useRouter()
	const [images, setImages] = useState<ImageInfo[]>([])
	const [isDragging, setIsDragging] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)
	// Сообщение о том, что не получилось: тост тут не годится — он исчезает
	// раньше, чем человек успевает понять, какой файл не взяли.
	const [problem, setProblem] = useState('')
	const { copyToClipboard, copiedItem } = useCopyToClipboard({
		successMessage: 'Данные скопированы'
	})

	const formatBytes = (bytes: number): string => {
		if (bytes === 0) return '0 Bytes'
		const k = 1024
		const sizes = ['Bytes', 'KB', 'MB', 'GB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
	}

	const getAspectRatio = (width: number, height: number): string => {
		const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
		const divisor = gcd(width, height)
		return `${width / divisor}:${height / divisor}`
	}

	const processImage = (file: File): Promise<ImageInfo> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()

			reader.onload = e => {
				const img = new window.Image()

				img.onload = () => {
					const imageInfo: ImageInfo = {
						name: file.name,
						url: e.target?.result as string,
						width: img.width,
						height: img.height,
						aspectRatio: getAspectRatio(img.width, img.height),
						fileSize: file.size,
						fileSizeFormatted: formatBytes(file.size),
						format: file.type || 'unknown',
						lastModified: new Date(file.lastModified),
						file
					}
					resolve(imageInfo)
				}

				img.onerror = () => {
					reject(new Error('Failed to load image'))
				}

				img.src = e.target?.result as string
			}

			reader.onerror = () => {
				reject(new Error('Failed to read file'))
			}

			reader.readAsDataURL(file)
		})
	}

	const handleFiles = useCallback(async (files: FileList) => {
		const fileList = Array.from(files)
		if (fileList.length === 0) return

		// Не отсекаем по file.type заранее: у части файлов браузер/ОС не
		// проставляет MIME-тип (пустая строка) даже для настоящих картинок —
		// нестандартное расширение, отдельные источники drag-and-drop,
		// файлы без корректных метаданных. Реальная проверка — попытка
		// декодировать через <img>, она и так уже была в processImage.
		setProblem('')
		const newImages: ImageInfo[] = []
		const failedNames: string[] = []

		for (const file of fileList) {
			try {
				const imageInfo = await processImage(file)
				newImages.push(imageInfo)
			} catch {
				failedNames.push(file.name)
			}
		}

		if (newImages.length === 0) {
			setProblem('Это не изображения — нужны JPG, PNG, GIF, WebP или SVG')
		} else if (failedNames.length > 0) {
			setProblem(`Не удалось прочитать: ${failedNames.join(', ')}`)
		}

		setImages(prev => [...prev, ...newImages])
	}, [])

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault()
			setIsDragging(false)
			handleFiles(e.dataTransfer.files)
		},
		[handleFiles]
	)

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(true)
	}, [])

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(false)
	}, [])

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			if (e.target.files) {
				handleFiles(e.target.files)
			}
		},
		[handleFiles]
	)

	// Передаём исходный File, а не его дата-URL: так compress-image может
	// прочитать файл ровно так же, как если бы его выбрали там напрямую.
	const compressImage = useCallback(
		(image: ImageInfo) => {
			setHandoffFile(image.file)
			router.push('/tools/compress-image')
		},
		[router]
	)

	const removeImage = useCallback((index: number) => {
		setImages(prev => prev.filter((_, i) => i !== index))
	}, [])

	const clearAll = useCallback(() => {
		setImages([])
		setProblem('')
	}, [])

	const exportData = useCallback(() => {
		const data = images.map(img => ({
			name: img.name,
			width: img.width,
			height: img.height,
			aspectRatio: img.aspectRatio,
			fileSize: img.fileSizeFormatted,
			format: img.format
		}))

		const csv = [
			'Name,Width,Height,Aspect Ratio,File Size,Format',
			...data.map(
				row =>
					`"${row.name}",${row.width},${row.height},"${row.aspectRatio}","${row.fileSize}","${row.format}"`
			)
		].join('\n')

		const blob = new Blob([csv], { type: 'text/csv' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = 'image-sizes.csv'
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		URL.revokeObjectURL(url)
	}, [images])

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: сколько картинок разобрано и что с ними делать.
				    Раньше это был заголовок «Результаты (N)» с двумя кнопками
				    между двумя карточками. */}
				<div className={toolBar}>
					<span
						className={cn(
							'text-sm',
							problem ? 'text-destructive' : 'text-muted-foreground'
						)}
					>
						{problem ||
							(images.length > 0
								? `${images.length} ${pluralizeRu(images.length, ['изображение', 'изображения', 'изображений'])}`
								: 'Изображения не выбраны')}
					</span>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => fileInputRef.current?.click()}
							title='Выбрать файлы'
							className={toolIconButton}
						>
							<Upload className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={exportData}
							disabled={images.length === 0}
							title='Скачать таблицу CSV'
							className={toolIconButton}
						>
							<Download className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={clearAll}
							disabled={images.length === 0}
							title='Очистить'
							className={toolIconButton}
						>
							<Trash2 className='h-4 w-4' />
						</Button>
					</div>
				</div>

				{/* Рабочая область — она же зона перетаскивания: пока картинок нет,
				    это приглашение, один файл — крупный «геройский» результат (не
				    теряется мелкой карточкой), несколько — таблица, там данные
				    важнее превью. Бросить ещё файл можно прямо на любое из трёх. */}
				<div
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					className={cn(
						'relative transition-colors',
						images.length === 0 && 'px-5 py-6 sm:px-6',
						isDragging && 'bg-primary/5'
					)}
				>
					<input
						ref={fileInputRef}
						type='file'
						multiple
						accept='image/*'
						onChange={handleInputChange}
						aria-label='Загрузить изображения'
						className='hidden'
					/>

					{images.length === 0 && (
						<button
							type='button'
							onClick={() => fileInputRef.current?.click()}
							className='flex w-full cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed py-14 transition-colors hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						>
							<ImageIcon className='h-8 w-8 text-muted-foreground' />
							<span className='hidden text-sm sm:inline'>
								Перетащите изображения сюда или выберите файлы
							</span>
							<span className='text-sm sm:hidden'>Выберите файлы</span>
							<span className='text-xs text-muted-foreground'>
								JPG, PNG, GIF, WebP, SVG
							</span>
						</button>
					)}

					{images.length === 1 && (
						<div className='grid gap-6 p-5 sm:grid-cols-[1.2fr_1fr] sm:p-8'>
							<div className='relative flex h-64 items-center justify-center overflow-hidden rounded-xl border bg-muted sm:h-auto sm:max-h-96'>
								<Image
									src={images[0].url}
									alt={images[0].name}
									fill
									className='object-contain'
								/>
							</div>

							<div className='flex min-w-0 flex-col justify-center gap-4'>
								<p
									className='truncate text-sm text-muted-foreground'
									title={images[0].name}
								>
									{images[0].name}
								</p>

								<p className='font-mono text-3xl font-bold tracking-tight sm:text-4xl'>
									{images[0].width} × {images[0].height}
								</p>

								<div className='flex flex-wrap items-center gap-2 text-sm'>
									<RatioBadge image={images[0]} />
									<WeightLabel image={images[0]} />
									<Badge variant='outline'>
										{images[0].format.split('/')[1]?.toUpperCase() || '—'}
									</Badge>
								</div>

								<MetaLine image={images[0]} />

								<div className='flex flex-wrap gap-2'>
									<Button
										variant='outline'
										className='w-fit cursor-pointer gap-2'
										onClick={() =>
											copyToClipboard(copyText(images[0]), 'single')
										}
									>
										{copiedItem === 'single' ? (
											<Check className='h-4 w-4 text-emerald-600' />
										) : (
											<Copy className='h-4 w-4' />
										)}
										Скопировать данные
									</Button>

									{images[0].fileSize > HEAVY_THRESHOLD_BYTES && (
										<Button
											variant='outline'
											className='w-fit cursor-pointer gap-2 border-amber-500/40 text-amber-700 hover:border-amber-500/60 hover:bg-amber-500/10 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-400'
											onClick={() => compressImage(images[0])}
										>
											<Minimize2 className='h-4 w-4' />
											Сжать в компрессоре
										</Button>
									)}
								</div>
							</div>
						</div>
					)}

					{images.length > 1 && (
						<div className='overflow-x-auto'>
							<table className='w-full text-sm'>
								<thead>
									<tr className='border-b text-left text-xs text-muted-foreground'>
										<th className='px-4 py-2 font-medium'></th>
										<th className='px-2 py-2 font-medium'>Имя</th>
										<th className='px-2 py-2 font-medium'>Размер, px</th>
										<th className='px-2 py-2 font-medium'>Соотношение</th>
										<th className='px-2 py-2 font-medium'>Вес</th>
										<th className='px-2 py-2 font-medium'>Формат</th>
										<th className='px-2 py-2'></th>
									</tr>
								</thead>
								<tbody>
									{images.map((image, index) => (
										<tr
											key={index}
											className='group border-b last:border-0 hover:bg-muted/30'
										>
											<td className='px-4 py-2'>
												<div className='relative h-9 w-9 overflow-hidden rounded-md border bg-muted'>
													<Image
														src={image.url}
														alt=''
														fill
														className='object-cover'
													/>
												</div>
											</td>
											<td className='max-w-48 px-2 py-2'>
												<p className='truncate' title={image.name}>
													{image.name}
												</p>
												<p className='text-xs text-muted-foreground'>
													Изменён:{' '}
													{image.lastModified.toLocaleDateString('ru-RU')}
												</p>
											</td>
											<td className='px-2 py-2 font-mono'>
												{image.width} × {image.height}
												<p className='font-sans text-xs text-muted-foreground'>
													{megapixels(image)} Мп
												</p>
											</td>
											<td className='px-2 py-2'>
												<RatioBadge image={image} />
											</td>
											<td className='px-2 py-2'>
												<WeightLabel image={image} />
											</td>
											<td className='px-2 py-2 text-muted-foreground'>
												{image.format.split('/')[1]?.toUpperCase() || '—'}
											</td>
											<td className='px-2 py-2 text-right'>
												<div className='flex items-center justify-end opacity-60 group-hover:opacity-100'>
													{image.fileSize > HEAVY_THRESHOLD_BYTES && (
														<Button
															size='icon'
															variant='ghost'
															onClick={() => compressImage(image)}
															title='Сжать в компрессоре — большой файл'
															className={cn(
																toolIconButton,
																'text-amber-700 hover:text-amber-800 dark:text-amber-400'
															)}
														>
															<Minimize2 className='h-4 w-4' />
														</Button>
													)}
													<CopyButton
														image={image}
														id={`${index}`}
														copiedId={copiedItem}
														onCopy={copyToClipboard}
													/>
													<Button
														size='icon'
														variant='ghost'
														onClick={() => removeImage(index)}
														title='Убрать'
														className={toolIconButton}
													>
														<X className='h-4 w-4' />
													</Button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</Card>

			<ImageSizeCheckerSeo />
		</WidgetSEOWrapper>
	)
}

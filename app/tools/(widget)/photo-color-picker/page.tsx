'use client'

import {
	useEffect,
	useRef,
	useState,
	type MouseEvent,
	type TouchEvent
} from 'react'
import { Check, Copy, Trash2, Upload } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toolBar, toolFooterBar, toolIconButton } from '@/lib/ui/tool-pill'
import { useFileDrop } from '@/lib/hooks/useFileDrop'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import {
	rgbToHex,
	rgbToHsl,
	formatHsl,
	type RGB
} from '@/lib/utils/color-converter'
import { PhotoColorPickerSeo } from './PhotoColorPickerSeo'

const MAX_CANVAS_DIMENSION = 1600
const MAGNIFIER_SIZE = 110
const MAGNIFIER_ZOOM = 8
const HISTORY_LIMIT = 8

function loadImage(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new window.Image()
		img.onload = () => resolve(img)
		img.onerror = () => reject(new Error('Не удалось прочитать изображение'))
		img.src = url
	})
}

export default function PhotoColorPickerPage() {
	const widget = getWidgetById('photo-color-picker')!

	const canvasRef = useRef<HTMLCanvasElement>(null)
	const magnifierRef = useRef<HTMLCanvasElement>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const [hasImage, setHasImage] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(
		null
	)
	const [picked, setPicked] = useState<RGB | null>(null)
	const [history, setHistory] = useState<RGB[]>([])
	const [copiedFormat, setCopiedFormat] = useState<string | null>(null)

	const readPixel = (x: number, y: number): RGB | null => {
		const canvas = canvasRef.current
		const ctx = canvas?.getContext('2d')
		if (!canvas || !ctx) return null
		if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return null
		const data = ctx.getImageData(x, y, 1, 1).data
		return { r: data[0], g: data[1], b: data[2] }
	}

	const drawMagnifier = (x: number, y: number) => {
		const canvas = canvasRef.current
		const magnifier = magnifierRef.current
		const ctx = magnifier?.getContext('2d')
		if (!canvas || !magnifier || !ctx) return
		const half = MAGNIFIER_SIZE / MAGNIFIER_ZOOM / 2
		ctx.imageSmoothingEnabled = false
		ctx.clearRect(0, 0, MAGNIFIER_SIZE, MAGNIFIER_SIZE)
		ctx.drawImage(
			canvas,
			x - half,
			y - half,
			half * 2,
			half * 2,
			0,
			0,
			MAGNIFIER_SIZE,
			MAGNIFIER_SIZE
		)
		// Рамка вокруг центрального пикселя — иначе на пёстром фото не видно,
		// какая именно точка сейчас читается.
		const cell = MAGNIFIER_SIZE / (half * 2)
		ctx.strokeStyle = '#ffffff'
		ctx.lineWidth = 2
		ctx.strokeRect(
			MAGNIFIER_SIZE / 2 - cell / 2,
			MAGNIFIER_SIZE / 2 - cell / 2,
			cell,
			cell
		)
		ctx.strokeStyle = '#00000080'
		ctx.lineWidth = 1
		ctx.strokeRect(
			MAGNIFIER_SIZE / 2 - cell / 2 + 1,
			MAGNIFIER_SIZE / 2 - cell / 2 + 1,
			cell - 2,
			cell - 2
		)
	}

	const eventToCanvasPoint = (clientX: number, clientY: number) => {
		const canvas = canvasRef.current
		if (!canvas) return null
		const rect = canvas.getBoundingClientRect()
		const scaleX = canvas.width / rect.width
		const scaleY = canvas.height / rect.height
		const x = Math.floor((clientX - rect.left) * scaleX)
		const y = Math.floor((clientY - rect.top) * scaleY)
		return { x, y }
	}

	const handleMove = (clientX: number, clientY: number) => {
		const point = eventToCanvasPoint(clientX, clientY)
		if (!point) return
		setHoverPos(point)
	}

	// Отрисовка лупы — отдельным эффектом, а не прямо в обработчике: раньше
	// canvas лупы монтировался по условию hoverPos, и на самом первом
	// наведении прямой вызов из handleMove бил в null ref. Теперь canvas
	// рисуется всегда, но очищать его при уходе курсора всё равно нужно
	// эффектом, а не в обработчике — иначе на экране остаётся последний кадр.
	useEffect(() => {
		if (hoverPos) {
			drawMagnifier(hoverPos.x, hoverPos.y)
			return
		}
		const ctx = magnifierRef.current?.getContext('2d')
		ctx?.clearRect(0, 0, MAGNIFIER_SIZE, MAGNIFIER_SIZE)
	}, [hoverPos])

	const handlePick = (clientX: number, clientY: number) => {
		const point = eventToCanvasPoint(clientX, clientY)
		if (!point) return
		const rgb = readPixel(point.x, point.y)
		if (!rgb) return
		setPicked(rgb)
		setHistory(prev => [rgb, ...prev].slice(0, HISTORY_LIMIT))
	}

	const onCanvasMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
		handleMove(event.clientX, event.clientY)
	}

	const onCanvasClick = (event: MouseEvent<HTMLCanvasElement>) => {
		handlePick(event.clientX, event.clientY)
	}

	const onCanvasMouseLeave = () => {
		setHoverPos(null)
	}

	const onCanvasTouchMove = (event: TouchEvent<HTMLCanvasElement>) => {
		event.preventDefault()
		const touch = event.touches[0]
		if (touch) handleMove(touch.clientX, touch.clientY)
	}

	const onCanvasTouchEnd = (event: TouchEvent<HTMLCanvasElement>) => {
		const touch = event.changedTouches[0]
		if (touch) handlePick(touch.clientX, touch.clientY)
		setHoverPos(null)
	}

	const loadFile = async (file: File) => {
		setErrorMessage(null)
		const objectUrl = URL.createObjectURL(file)
		try {
			const img = await loadImage(objectUrl)
			const canvas = canvasRef.current
			if (!canvas) return
			const scale = Math.min(
				1,
				MAX_CANVAS_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight)
			)
			canvas.width = Math.round(img.naturalWidth * scale)
			canvas.height = Math.round(img.naturalHeight * scale)
			const ctx = canvas.getContext('2d')!
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
			setHasImage(true)
			setPicked(null)
			setHistory([])
		} catch {
			setErrorMessage('Не получилось прочитать файл. Попробуйте другое фото.')
		} finally {
			URL.revokeObjectURL(objectUrl)
		}
	}

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) void loadFile(file)
	}

	const { isDragging, ...dropHandlers } = useFileDrop(
		file => void loadFile(file)
	)

	const reset = () => {
		setHasImage(false)
		setPicked(null)
		setHistory([])
		setHoverPos(null)
		setErrorMessage(null)
		if (fileInputRef.current) fileInputRef.current.value = ''
	}

	const copyToClipboard = (text: string, format: string) => {
		navigator.clipboard.writeText(text)
		setCopiedFormat(format)
		setTimeout(() => setCopiedFormat(null), 2000)
	}

	const hex = picked ? rgbToHex(picked) : null
	const hsl = picked ? formatHsl(rgbToHsl(picked)) : null
	const rgbText = picked ? `rgb(${picked.r}, ${picked.g}, ${picked.b})` : null

	const FORMATS = picked
		? [
				{ title: 'HEX', value: hex!.toUpperCase() },
				{ title: 'RGB', value: rgbText! },
				{ title: 'HSL', value: hsl! }
			]
		: []

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
						{hasImage
							? 'Наведите пипетку на фото или коснитесь нужной точки'
							: 'Загрузите фото, чтобы определить цвет'}
					</span>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => fileInputRef.current?.click()}
							title={hasImage ? 'Выбрать другое фото' : 'Загрузить фото'}
							className={toolIconButton}
						>
							<Upload className='h-4 w-4' />
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

				<div className={cn('grid', hasImage && 'md:grid-cols-[3fr_2fr]')}>
					<div
						className={cn(
							'relative flex min-w-0 items-center justify-center px-5 py-6 sm:px-6',
							hasImage && 'border-b md:border-r md:border-b-0'
						)}
					>
						{hasImage && (
							<Button
								size='icon'
								variant='secondary'
								onClick={reset}
								title='Очистить фото'
								className='absolute top-3 right-3 h-8 w-8 cursor-pointer shadow-sm'
							>
								<Trash2 className='h-4 w-4' />
							</Button>
						)}

						{!hasImage && (
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
									Выберите фото или перетащите сюда
								</span>
							</button>
						)}

						<canvas
							ref={canvasRef}
							onMouseMove={onCanvasMouseMove}
							onMouseLeave={onCanvasMouseLeave}
							onClick={onCanvasClick}
							onTouchMove={onCanvasTouchMove}
							onTouchEnd={onCanvasTouchEnd}
							className={cn(
								'max-h-96 max-w-full touch-none rounded-xl border',
								hasImage ? 'block cursor-crosshair' : 'hidden'
							)}
						/>

						{errorMessage && (
							<p className='mt-3 text-sm text-destructive'>{errorMessage}</p>
						)}
					</div>

					{hasImage && (
						<div className='grid grid-cols-2 gap-4 px-5 py-6 sm:px-6'>
							{/* Лупа — сам canvas и есть ячейка, без обёртки. Рисуется
							    всегда: так ref гарантированно примонтирован ещё до
							    первого наведения, а не появляется по условию. */}
							<canvas
								ref={magnifierRef}
								width={MAGNIFIER_SIZE}
								height={MAGNIFIER_SIZE}
								className='aspect-square w-full rounded-xl border bg-muted/20'
							/>

							{/* Полученный цвет — тоже сама ячейка, без обёртки. */}
							<div
								className='flex aspect-square w-full items-center justify-center rounded-xl border'
								style={picked ? { backgroundColor: hex! } : undefined}
							>
								{!picked && (
									<p className='px-3 text-center text-xs text-muted-foreground'>
										{hoverPos
											? 'Нажмите, чтобы зафиксировать цвет'
											: 'Цвет появится здесь после клика по фото'}
									</p>
								)}
							</div>

							{/* Все форматы — простым списком друг под другом, без карточек:
							    строка целиком кликабельна и копирует значение. */}
							{picked && (
								<div className='col-span-2 divide-y'>
									{FORMATS.map(format => (
										<button
											key={format.title}
											type='button'
											onClick={() =>
												copyToClipboard(format.value, format.title)
											}
											title='Скопировать'
											className='group -mx-2 flex w-[calc(100%+1rem)] cursor-pointer items-baseline justify-between gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-muted/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
										>
											<span className='flex items-baseline gap-3'>
												<span className='w-10 shrink-0 font-mono text-xs text-muted-foreground uppercase'>
													{format.title}
												</span>
												<span className='font-mono text-sm break-all'>
													{format.value}
												</span>
											</span>
											{copiedFormat === format.title ? (
												<Check className='h-4 w-4 shrink-0 text-green-600 dark:text-green-400' />
											) : (
												<Copy className='h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100' />
											)}
										</button>
									))}
								</div>
							)}
						</div>
					)}
				</div>

				{hasImage && history.length > 0 && (
					<div className={toolFooterBar}>
						<span className='text-sm text-muted-foreground'>История</span>
						{history.map((color, index) => {
							const colorHex = rgbToHex(color)
							return (
								<button
									key={`${colorHex}-${index}`}
									type='button'
									onClick={() => setPicked(color)}
									title={colorHex.toUpperCase()}
									className='h-6 w-6 cursor-pointer rounded-full border transition-transform hover:scale-110'
									style={{ backgroundColor: colorHex }}
								/>
							)
						})}
					</div>
				)}
			</Card>

			<PhotoColorPickerSeo />
		</WidgetSEOWrapper>
	)
}

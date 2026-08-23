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
import { reportClientError } from '@/lib/utils/report-client-error'
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
// На тач-устройствах точка сэмплинга прячется под самим пальцем — лупа в
// боковой панели её не спасает, потому что на мобильной раскладке уезжает
// под фото. Решение как в лупе выделения текста iOS: плавающий кружок
// всплывает НАД точкой касания со сдвигом, а не под пальцем — так видно
// и палец, и то, что он вот-вот выберет.
const MAGNIFIER_TOUCH_GAP = 40
const MAGNIFIER_EDGE_MARGIN = 8

function loadImage(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new window.Image()
		img.onload = () => resolve(img)
		img.onerror = () => reject(new Error('Не удалось прочитать изображение'))
		img.src = url
	})
}

// На телефонах декод больших фото через <img> иногда «успевает» отдать
// onload раньше, чем данные реально готовы — canvas после drawImage
// остаётся пустым без единой ошибки. createImageBitmap декодирует до
// готового результата (или честно бросает исключение) и заодно
// разворачивает фото по EXIF-ориентации, которую canvas сам не учитывает.
async function decodeToCanvas(file: File, canvas: HTMLCanvasElement) {
	if (typeof createImageBitmap === 'function') {
		const bitmap = await createImageBitmap(file, {
			imageOrientation: 'from-image'
		})
		if (bitmap.width === 0 || bitmap.height === 0) {
			bitmap.close()
			throw new Error('Изображение пустое')
		}
		const scale = Math.min(
			1,
			MAX_CANVAS_DIMENSION / Math.max(bitmap.width, bitmap.height)
		)
		canvas.width = Math.round(bitmap.width * scale)
		canvas.height = Math.round(bitmap.height * scale)
		const ctx = canvas.getContext('2d')!
		ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
		bitmap.close()
		return
	}

	// Старые браузеры без createImageBitmap — прежний путь через <img>.
	const objectUrl = URL.createObjectURL(file)
	try {
		const img = await loadImage(objectUrl)
		if (img.naturalWidth === 0 || img.naturalHeight === 0) {
			throw new Error('Изображение пустое')
		}
		const scale = Math.min(
			1,
			MAX_CANVAS_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight)
		)
		canvas.width = Math.round(img.naturalWidth * scale)
		canvas.height = Math.round(img.naturalHeight * scale)
		const ctx = canvas.getContext('2d')!
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
	} finally {
		URL.revokeObjectURL(objectUrl)
	}
}

export default function PhotoColorPickerPage() {
	const widget = getWidgetById('photo-color-picker')!

	const canvasRef = useRef<HTMLCanvasElement>(null)
	const magnifierRef = useRef<HTMLCanvasElement>(null)
	const magnifierFloatRef = useRef<HTMLCanvasElement>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const canvasWrapRef = useRef<HTMLDivElement>(null)

	const [hasImage, setHasImage] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(
		null
	)
	// Позиция плавающей лупы — в CSS-пикселях относительно обёртки canvas
	// (не в пикселях самой картинки, как hoverPos): нужна для style.left/top
	// DOM-элемента, а не для чтения пикселя. wrapRect ловим тут же, чтобы не
	// дёргать getBoundingClientRect ещё раз при каждом ре-рендере лупы.
	const [touchLoupe, setTouchLoupe] = useState<{
		x: number
		y: number
		wrapWidth: number
		wrapHeight: number
	} | null>(null)
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

	const drawMagnifier = (
		x: number,
		y: number,
		magnifier: HTMLCanvasElement | null
	) => {
		const canvas = canvasRef.current
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
			drawMagnifier(hoverPos.x, hoverPos.y, magnifierRef.current)
			if (touchLoupe)
				drawMagnifier(hoverPos.x, hoverPos.y, magnifierFloatRef.current)
			return
		}
		const ctx = magnifierRef.current?.getContext('2d')
		ctx?.clearRect(0, 0, MAGNIFIER_SIZE, MAGNIFIER_SIZE)
	}, [hoverPos, touchLoupe])

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

	const updateTouchLoupe = (clientX: number, clientY: number) => {
		handleMove(clientX, clientY)
		const wrap = canvasWrapRef.current
		if (!wrap) return
		const wrapRect = wrap.getBoundingClientRect()
		setTouchLoupe({
			x: clientX - wrapRect.left,
			y: clientY - wrapRect.top,
			wrapWidth: wrapRect.width,
			wrapHeight: wrapRect.height
		})
	}

	const onCanvasTouchStart = (event: TouchEvent<HTMLCanvasElement>) => {
		const touch = event.touches[0]
		if (touch) updateTouchLoupe(touch.clientX, touch.clientY)
	}

	const onCanvasTouchMove = (event: TouchEvent<HTMLCanvasElement>) => {
		event.preventDefault()
		const touch = event.touches[0]
		if (touch) updateTouchLoupe(touch.clientX, touch.clientY)
	}

	const onCanvasTouchEnd = (event: TouchEvent<HTMLCanvasElement>) => {
		const touch = event.changedTouches[0]
		if (touch) handlePick(touch.clientX, touch.clientY)
		setHoverPos(null)
		setTouchLoupe(null)
	}

	const onCanvasTouchCancel = () => {
		setHoverPos(null)
		setTouchLoupe(null)
	}

	const loadFile = async (file: File) => {
		setErrorMessage(null)

		// accept='image/*' на инпуте не защищает drag-and-drop — сюда может
		// прилететь любой файл. MIME иногда пуст (некоторые ОС не знают тип
		// HEIC) — отклоняем только явно НЕ-картинки, не пустой тип.
		if (file.type && !file.type.startsWith('image/')) {
			setErrorMessage('Это не изображение. Перетащите файл фото.')
			return
		}

		const canvas = canvasRef.current
		if (!canvas) return

		try {
			await decodeToCanvas(file, canvas)
			setHasImage(true)
			setPicked(null)
			setHistory([])
		} catch (err) {
			setErrorMessage('Не получилось прочитать файл. Попробуйте другое фото.')
			// Раньше причина сбоя терялась на экране пользователя и никуда
			// больше не попадала — мы о нём не узнавали, пока человек сам не
			// напишет через форму обратной связи.
			const message = err instanceof Error ? err.message : String(err)
			void reportClientError({
				title: 'photo-color-picker: не удалось прочитать файл',
				description: `Ошибка: ${message}\nФайл: ${file.type || 'без MIME-типа'}, ${file.size} байт, ${file.name}`,
				widget: 'photo-color-picker'
			})
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
						ref={canvasWrapRef}
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
							onTouchStart={onCanvasTouchStart}
							onTouchMove={onCanvasTouchMove}
							onTouchEnd={onCanvasTouchEnd}
							onTouchCancel={onCanvasTouchCancel}
							className={cn(
								'max-h-96 max-w-full touch-none rounded-xl border',
								hasImage ? 'block cursor-crosshair' : 'hidden'
							)}
						/>

						{touchLoupe && (
							<div
								className='pointer-events-none absolute z-10 overflow-hidden rounded-full border-2 border-background shadow-lg'
								style={{
									width: MAGNIFIER_SIZE,
									height: MAGNIFIER_SIZE,
									left: Math.min(
										Math.max(
											touchLoupe.x - MAGNIFIER_SIZE / 2,
											MAGNIFIER_EDGE_MARGIN
										),
										touchLoupe.wrapWidth -
											MAGNIFIER_SIZE -
											MAGNIFIER_EDGE_MARGIN
									),
									top:
										touchLoupe.y - MAGNIFIER_TOUCH_GAP - MAGNIFIER_SIZE >=
										MAGNIFIER_EDGE_MARGIN
											? touchLoupe.y - MAGNIFIER_TOUCH_GAP - MAGNIFIER_SIZE
											: touchLoupe.y + MAGNIFIER_TOUCH_GAP
								}}
							>
								<canvas
									ref={magnifierFloatRef}
									width={MAGNIFIER_SIZE}
									height={MAGNIFIER_SIZE}
									className='h-full w-full'
								/>
							</div>
						)}

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
												<Copy className='h-4 w-4 shrink-0 text-muted-foreground opacity-60 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100' />
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

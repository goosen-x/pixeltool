'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Стенд для выбора жеста пипетки на мобильном (см. /dev/pipetka).
 *
 * Общее у всех трёх вариантов — слушатели касаний вешаются нативно, через
 * addEventListener с { passive: false }. Через React-пропы (onTouchMove и
 * прочие) это не работает: React с 17-й версии вешает touchstart, touchmove и
 * wheel на корень документа пассивно, а в пассивном слушателе preventDefault()
 * не делает ничего. Именно поэтому в проде photo-color-picker одновременно
 * ведёт лупу и скроллит страницу: решение о жесте код принимает, но браузер о
 * нём не узнаёт.
 */
export type LabGesture = 'direction' | 'hold' | 'target'

type RGB = { r: number; g: number; b: number }

const LOUPE_SIZE = 96
const LOUPE_ZOOM = 7
const LOUPE_GAP = 28
const LOUPE_MARGIN = 6
// 8 px — меньше порога, с которого браузер начинает прокрутку (touch slop),
// поэтому решение успевает принять наш код, а не браузер.
const DECISION_DISTANCE = 8
const HOLD_MS = 280
const HOLD_SLOP = 10

function toHex({ r, g, b }: RGB): string {
	return `#${[r, g, b]
		.map(v => v.toString(16).padStart(2, '0'))
		.join('')
		.toUpperCase()}`
}

/** Демо-картинка: закат с разными зонами + ряд чистых плашек для проверки попадания. */
function buildDemoImage(): HTMLCanvasElement {
	const canvas = document.createElement('canvas')
	canvas.width = 1200
	canvas.height = 800
	const ctx = canvas.getContext('2d')
	if (!ctx) return canvas

	const sky = ctx.createLinearGradient(0, 0, 0, 800)
	sky.addColorStop(0, '#1b3a5c')
	sky.addColorStop(0.45, '#4c7fa8')
	sky.addColorStop(0.62, '#e0a06a')
	sky.addColorStop(1, '#2c2f3f')
	ctx.fillStyle = sky
	ctx.fillRect(0, 0, 1200, 800)

	const sun = ctx.createRadialGradient(880, 430, 10, 880, 430, 190)
	sun.addColorStop(0, '#ffe9b0')
	sun.addColorStop(0.35, '#f6b25e')
	sun.addColorStop(1, 'rgba(246,178,94,0)')
	ctx.fillStyle = sun
	ctx.fillRect(600, 200, 600, 460)

	ctx.fillStyle = '#20303f'
	ctx.beginPath()
	ctx.moveTo(0, 560)
	ctx.lineTo(220, 400)
	ctx.lineTo(420, 545)
	ctx.lineTo(640, 360)
	ctx.lineTo(900, 560)
	ctx.lineTo(1200, 470)
	ctx.lineTo(1200, 800)
	ctx.lineTo(0, 800)
	ctx.closePath()
	ctx.fill()

	ctx.fillStyle = '#16212c'
	ctx.beginPath()
	ctx.moveTo(0, 690)
	ctx.lineTo(300, 620)
	ctx.lineTo(560, 700)
	ctx.lineTo(880, 640)
	ctx.lineTo(1200, 720)
	ctx.lineTo(1200, 800)
	ctx.lineTo(0, 800)
	ctx.closePath()
	ctx.fill()

	const swatches = [
		'#e2574c',
		'#f2a541',
		'#2f9e6f',
		'#3d7fd1',
		'#8d5bb5',
		'#f4f1ea'
	]
	swatches.forEach((color, i) => {
		ctx.fillStyle = color
		ctx.beginPath()
		ctx.arc(120 + i * 130, 170, 52, 0, Math.PI * 2)
		ctx.fill()
	})

	return canvas
}

export function GestureLabPicker({ gesture }: { gesture: LabGesture }) {
	const photoRef = useRef<HTMLCanvasElement>(null)
	const stageRef = useRef<HTMLDivElement>(null)
	const loupeRef = useRef<HTMLDivElement>(null)
	const loupeCanvasRef = useRef<HTMLCanvasElement>(null)
	const targetRef = useRef<HTMLButtonElement>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const sourceRef = useRef<
		CanvasImageSource & { width: number; height: number }
	>(null)
	const dprRef = useRef(1)
	// Позиция прицела в CSS-пикселях сцены. В ref, а не в state: её трогает
	// pointermove на каждый кадр, ре-рендер React там ни к чему.
	const targetPosRef = useRef<{ x: number; y: number } | null>(null)
	const scrollAtStartRef = useRef<number | null>(null)

	const [picked, setPicked] = useState<RGB | null>(null)
	const [drift, setDrift] = useState<number | null>(null)
	const [lastGesture, setLastGesture] = useState<string | null>(null)
	const [tight, setTight] = useState(false)
	const [photoSize, setPhotoSize] = useState<{ w: number; h: number } | null>(
		null
	)

	const readPixel = useCallback((cssX: number, cssY: number): RGB | null => {
		const photo = photoRef.current
		const ctx = photo?.getContext('2d', { willReadFrequently: true })
		if (!photo || !ctx) return null
		const dpr = dprRef.current
		const px = Math.round(cssX * dpr)
		const py = Math.round(cssY * dpr)
		if (px < 0 || py < 0 || px >= photo.width || py >= photo.height) return null
		const data = ctx.getImageData(px, py, 1, 1).data
		return { r: data[0], g: data[1], b: data[2] }
	}, [])

	const layout = useCallback(() => {
		const photo = photoRef.current
		const stage = stageRef.current
		const source = sourceRef.current
		const ctx = photo?.getContext('2d', { willReadFrequently: true })
		if (!photo || !stage || !source || !ctx) return

		const dpr = Math.min(window.devicePixelRatio || 1, 2)
		dprRef.current = dpr

		const ratio = source.height / source.width
		let cssW = stage.clientWidth
		let cssH = Math.round(cssW * ratio)
		const maxH = Math.round(Math.min(window.innerHeight * 0.5, 420))
		if (cssH > maxH) {
			cssH = maxH
			cssW = Math.round(cssH / ratio)
		}

		photo.style.width = `${cssW}px`
		photo.style.height = `${cssH}px`
		photo.width = Math.round(cssW * dpr)
		photo.height = Math.round(cssH * dpr)
		ctx.drawImage(source, 0, 0, photo.width, photo.height)
		setPhotoSize({ w: cssW, h: cssH })
	}, [])

	const hideLoupe = useCallback(() => {
		const loupe = loupeRef.current
		if (loupe) loupe.style.display = 'none'
	}, [])

	const showLoupeAt = useCallback((clientX: number, clientY: number) => {
		const photo = photoRef.current
		const stage = stageRef.current
		const loupe = loupeRef.current
		const lctx = loupeCanvasRef.current?.getContext('2d')
		if (!photo || !stage || !loupe || !lctx) return

		const photoRect = photo.getBoundingClientRect()
		const x = clientX - photoRect.left
		const y = clientY - photoRect.top
		const dpr = dprRef.current
		const half = LOUPE_SIZE / (2 * LOUPE_ZOOM)

		lctx.imageSmoothingEnabled = false
		lctx.clearRect(0, 0, LOUPE_SIZE, LOUPE_SIZE)
		lctx.drawImage(
			photo,
			(x - half) * dpr,
			(y - half) * dpr,
			half * 2 * dpr,
			half * 2 * dpr,
			0,
			0,
			LOUPE_SIZE,
			LOUPE_SIZE
		)
		lctx.strokeStyle = 'rgba(255,255,255,.9)'
		lctx.lineWidth = 1
		lctx.strokeRect(LOUPE_SIZE / 2 - 4, LOUPE_SIZE / 2 - 4, 8, 8)
		lctx.strokeStyle = 'rgba(0,0,0,.55)'
		lctx.strokeRect(LOUPE_SIZE / 2 - 5, LOUPE_SIZE / 2 - 5, 10, 10)

		const stageRect = stage.getBoundingClientRect()
		const sx = clientX - stageRect.left
		const sy = clientY - stageRect.top
		const left = Math.min(
			Math.max(sx - LOUPE_SIZE / 2, LOUPE_MARGIN),
			stage.clientWidth - LOUPE_SIZE - LOUPE_MARGIN
		)
		const above = sy - LOUPE_GAP - LOUPE_SIZE
		loupe.style.left = `${left}px`
		loupe.style.top = `${above >= LOUPE_MARGIN ? above : sy + LOUPE_GAP}px`
		loupe.style.display = 'block'
	}, [])

	const trackAt = useCallback(
		(clientX: number, clientY: number) => {
			const photo = photoRef.current
			if (!photo) return
			const rect = photo.getBoundingClientRect()
			const color = readPixel(clientX - rect.left, clientY - rect.top)
			if (!color) return
			setPicked(color)
			showLoupeAt(clientX, clientY)
		},
		[readPixel, showLoupeAt]
	)

	const pickAt = useCallback(
		(clientX: number, clientY: number) => {
			const photo = photoRef.current
			if (!photo) return
			const rect = photo.getBoundingClientRect()
			const color = readPixel(clientX - rect.left, clientY - rect.top)
			if (color) setPicked(color)
		},
		[readPixel]
	)

	// Сколько страница уехала за время жеста. Ради этого числа стенд и сделан:
	// «0 px» при ведении пипетки — то, чего сейчас нет в проде.
	const beginGesture = useCallback(() => {
		scrollAtStartRef.current = window.scrollY
		setDrift(null)
		setLastGesture(null)
	}, [])

	const endGesture = useCallback((kind: string) => {
		const start = scrollAtStartRef.current
		if (start !== null) setDrift(Math.abs(window.scrollY - start))
		scrollAtStartRef.current = null
		setLastGesture(kind)
	}, [])

	/* --- инициализация --- */
	useEffect(() => {
		sourceRef.current = buildDemoImage()
		layout()

		let timer: ReturnType<typeof setTimeout>
		const onResize = () => {
			clearTimeout(timer)
			timer = setTimeout(layout, 120)
		}
		window.addEventListener('resize', onResize)
		return () => {
			clearTimeout(timer)
			window.removeEventListener('resize', onResize)
		}
	}, [layout])

	useEffect(() => {
		layout()
	}, [tight, layout])

	/* --- мышь: одинаково во всех режимах, кроме прицела --- */
	useEffect(() => {
		const photo = photoRef.current
		if (!photo || gesture === 'target') return

		const onMove = (e: MouseEvent) => trackAt(e.clientX, e.clientY)
		const onLeave = () => hideLoupe()
		const onClick = (e: MouseEvent) => pickAt(e.clientX, e.clientY)

		photo.addEventListener('mousemove', onMove)
		photo.addEventListener('mouseleave', onLeave)
		photo.addEventListener('click', onClick)
		return () => {
			photo.removeEventListener('mousemove', onMove)
			photo.removeEventListener('mouseleave', onLeave)
			photo.removeEventListener('click', onClick)
		}
	}, [gesture, trackAt, pickAt, hideLoupe])

	/* --- вариант A: направление жеста --- */
	useEffect(() => {
		const photo = photoRef.current
		if (!photo || gesture !== 'direction') return

		// pan-y объявляет браузеру заранее: вертикаль твоя, горизонталь наша.
		// Значение touch-action фиксируется в момент начала жеста, менять его
		// на полпути бесполезно — поэтому решение и вынесено в CSS, а не в JS.
		photo.style.touchAction = 'pan-y'

		let start: { x: number; y: number } | null = null
		let decision: 'undecided' | 'pick' | 'scroll' = 'undecided'

		const onStart = (e: TouchEvent) => {
			const touch = e.touches[0]
			if (!touch) return
			start = { x: touch.clientX, y: touch.clientY }
			decision = 'undecided'
			beginGesture()
		}

		const onMove = (e: TouchEvent) => {
			const touch = e.touches[0]
			if (!touch || !start) return

			if (decision === 'undecided') {
				const dx = touch.clientX - start.x
				const dy = touch.clientY - start.y
				if (Math.hypot(dx, dy) < DECISION_DISTANCE) return
				decision = Math.abs(dy) > Math.abs(dx) ? 'scroll' : 'pick'
				if (decision === 'scroll') hideLoupe()
			}

			if (decision === 'scroll') return

			e.preventDefault()
			trackAt(touch.clientX, touch.clientY)
		}

		const onEnd = (e: TouchEvent) => {
			const touch = e.changedTouches[0]
			if (touch && decision !== 'scroll') pickAt(touch.clientX, touch.clientY)
			endGesture(decision === 'undecided' ? 'tap' : decision)
			hideLoupe()
			start = null
			decision = 'undecided'
		}

		photo.addEventListener('touchstart', onStart, { passive: true })
		photo.addEventListener('touchmove', onMove, { passive: false })
		photo.addEventListener('touchend', onEnd)
		photo.addEventListener('touchcancel', onEnd)
		return () => {
			photo.removeEventListener('touchstart', onStart)
			photo.removeEventListener('touchmove', onMove)
			photo.removeEventListener('touchend', onEnd)
			photo.removeEventListener('touchcancel', onEnd)
		}
	}, [gesture, beginGesture, endGesture, trackAt, pickAt, hideLoupe])

	/* --- вариант B: удержание --- */
	useEffect(() => {
		const photo = photoRef.current
		if (!photo || gesture !== 'hold') return

		photo.style.touchAction = 'auto'

		let start: { x: number; y: number } | null = null
		let timer: ReturnType<typeof setTimeout> | null = null
		let armed = false

		const disarm = () => {
			if (timer) clearTimeout(timer)
			timer = null
		}

		const onStart = (e: TouchEvent) => {
			const touch = e.touches[0]
			if (!touch) return
			start = { x: touch.clientX, y: touch.clientY }
			armed = false
			beginGesture()
			// Пока палец неподвижен, браузер прокрутку ещё не начал — значит
			// preventDefault() на первом же движении её и не даст начать.
			timer = setTimeout(() => {
				armed = true
				navigator.vibrate?.(8)
				if (start) trackAt(start.x, start.y)
			}, HOLD_MS)
		}

		const onMove = (e: TouchEvent) => {
			const touch = e.touches[0]
			if (!touch || !start) return

			if (!armed) {
				const moved = Math.hypot(
					touch.clientX - start.x,
					touch.clientY - start.y
				)
				if (moved > HOLD_SLOP) disarm()
				return
			}

			e.preventDefault()
			trackAt(touch.clientX, touch.clientY)
		}

		const onEnd = (e: TouchEvent) => {
			disarm()
			const touch = e.changedTouches[0]
			const moved =
				touch && start
					? Math.hypot(touch.clientX - start.x, touch.clientY - start.y)
					: 0
			const kind = armed ? 'pick' : moved <= HOLD_SLOP ? 'tap' : 'scroll'
			if (touch && kind !== 'scroll') pickAt(touch.clientX, touch.clientY)
			endGesture(kind)
			hideLoupe()
			armed = false
			start = null
		}

		photo.addEventListener('touchstart', onStart, { passive: true })
		photo.addEventListener('touchmove', onMove, { passive: false })
		photo.addEventListener('touchend', onEnd)
		photo.addEventListener('touchcancel', onEnd)
		return () => {
			disarm()
			photo.removeEventListener('touchstart', onStart)
			photo.removeEventListener('touchmove', onMove)
			photo.removeEventListener('touchend', onEnd)
			photo.removeEventListener('touchcancel', onEnd)
		}
	}, [gesture, beginGesture, endGesture, trackAt, pickAt, hideLoupe])

	/* --- вариант C: перетаскиваемый прицел --- */
	useEffect(() => {
		const photo = photoRef.current
		const stage = stageRef.current
		const target = targetRef.current
		if (!photo || !stage || !target || gesture !== 'target') return

		// Фото для браузера — обычная картинка, прокрутка по нему не ломается
		// в принципе. touch-action: none висит только на 44 px прицела.
		photo.style.touchAction = 'auto'

		const place = (stageX: number, stageY: number) => {
			targetPosRef.current = { x: stageX, y: stageY }
			target.style.left = `${stageX}px`
			target.style.top = `${stageY}px`
			target.style.display = 'block'
		}

		if (!targetPosRef.current) {
			const photoRect = photo.getBoundingClientRect()
			const stageRect = stage.getBoundingClientRect()
			place(
				photoRect.left - stageRect.left + photo.clientWidth / 2,
				photoRect.top - stageRect.top + photo.clientHeight / 2
			)
		} else {
			place(targetPosRef.current.x, targetPosRef.current.y)
		}

		const moveTo = (clientX: number, clientY: number) => {
			const photoRect = photo.getBoundingClientRect()
			const stageRect = stage.getBoundingClientRect()
			const cx = Math.min(
				Math.max(clientX, photoRect.left),
				photoRect.right - 1
			)
			const cy = Math.min(
				Math.max(clientY, photoRect.top),
				photoRect.bottom - 1
			)
			place(cx - stageRect.left, cy - stageRect.top)
			trackAt(cx, cy)
		}

		const onPointerDown = (e: PointerEvent) => {
			// Захват — чтобы палец мог уйти за край фото и жест не потерялся.
			target.setPointerCapture(e.pointerId)
			beginGesture()
			moveTo(e.clientX, e.clientY)
		}

		const onPointerMove = (e: PointerEvent) => {
			if (!target.hasPointerCapture(e.pointerId)) return
			e.preventDefault()
			moveTo(e.clientX, e.clientY)
		}

		const onPointerUp = (e: PointerEvent) => {
			if (target.hasPointerCapture(e.pointerId))
				target.releasePointerCapture(e.pointerId)
			endGesture('pick')
			hideLoupe()
		}

		const onPhotoTap = (e: MouseEvent) => {
			const stageRect = stage.getBoundingClientRect()
			place(e.clientX - stageRect.left, e.clientY - stageRect.top)
			pickAt(e.clientX, e.clientY)
			setDrift(0)
			setLastGesture('tap')
		}

		target.addEventListener('pointerdown', onPointerDown)
		target.addEventListener('pointermove', onPointerMove)
		target.addEventListener('pointerup', onPointerUp)
		target.addEventListener('pointercancel', onPointerUp)
		photo.addEventListener('click', onPhotoTap)
		return () => {
			target.removeEventListener('pointerdown', onPointerDown)
			target.removeEventListener('pointermove', onPointerMove)
			target.removeEventListener('pointerup', onPointerUp)
			target.removeEventListener('pointercancel', onPointerUp)
			photo.removeEventListener('click', onPhotoTap)
			target.style.display = 'none'
		}
	}, [gesture, beginGesture, endGesture, trackAt, pickAt, hideLoupe])

	const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return
		const url = URL.createObjectURL(file)
		const image = new Image()
		image.onload = () => {
			sourceRef.current = image
			targetPosRef.current = null
			layout()
			URL.revokeObjectURL(url)
		}
		image.src = url
	}

	const hex = picked ? toHex(picked) : null

	return (
		<div className='overflow-hidden rounded-xl border bg-card'>
			<div
				className={cn(
					'transition-[padding]',
					tight ? 'px-0 py-3' : 'px-5 py-5'
				)}
			>
				<div
					ref={stageRef}
					className={cn(
						'relative flex justify-center overflow-hidden bg-muted/40',
						tight ? 'border-y' : 'rounded-lg border'
					)}
				>
					<canvas ref={photoRef} className='block h-auto max-w-full' />

					<div
						ref={loupeRef}
						className='pointer-events-none absolute z-20 hidden overflow-hidden rounded-full border-[3px] border-background shadow-lg'
						style={{ width: LOUPE_SIZE, height: LOUPE_SIZE }}
					>
						<canvas
							ref={loupeCanvasRef}
							width={LOUPE_SIZE}
							height={LOUPE_SIZE}
							className='h-full w-full'
						/>
					</div>

					<button
						ref={targetRef}
						type='button'
						aria-label='Прицел пипетки'
						className='absolute z-10 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none rounded-full border-2 border-background shadow-[0_0_0_1.5px_rgba(0,0,0,.35)] active:cursor-grabbing'
						style={{ background: hex ?? 'transparent' }}
					/>
				</div>
			</div>

			<div className='flex items-center gap-4 border-t px-5 py-4'>
				<div
					className='h-12 w-12 shrink-0 rounded-lg border'
					style={{ background: hex ?? 'transparent' }}
				/>
				<div className='min-w-0'>
					<p className='font-mono text-lg'>{hex ?? '—'}</p>
					<p className='font-mono text-xs text-muted-foreground'>
						{picked
							? `rgb(${picked.r}, ${picked.g}, ${picked.b})`
							: 'коснитесь фото'}
					</p>
				</div>
			</div>

			<div className='flex flex-wrap gap-2 px-5 pb-4'>
				<span
					className={cn(
						'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs',
						drift === null && 'text-muted-foreground',
						drift !== null &&
							drift <= 2 &&
							'border-transparent bg-green-500/10 text-green-700 dark:text-green-400',
						drift !== null &&
							drift > 2 &&
							'border-transparent bg-red-500/10 text-red-700 dark:text-red-400'
					)}
				>
					страница за жест:{' '}
					<span className='font-mono tabular-nums'>
						{drift === null ? '—' : `${drift} px`}
					</span>
				</span>
				<span className='inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs text-muted-foreground'>
					жест: <span className='font-mono'>{lastGesture ?? '—'}</span>
				</span>
			</div>

			<div className='flex flex-wrap items-center gap-2 border-t bg-muted/30 px-5 py-4'>
				<Button
					variant='outline'
					size='sm'
					onClick={() => fileInputRef.current?.click()}
					className='cursor-pointer'
				>
					Своё фото
				</Button>
				<Button
					variant={tight ? 'default' : 'outline'}
					size='sm'
					onClick={() => setTight(v => !v)}
					className='cursor-pointer'
				>
					{tight ? 'Вернуть отступы' : 'Убрать отступы'}
				</Button>
				<span className='ml-auto font-mono text-xs tabular-nums text-muted-foreground'>
					{photoSize ? `картинка ${photoSize.w}×${photoSize.h}` : '—'}
				</span>
				<input
					ref={fileInputRef}
					type='file'
					accept='image/*'
					onChange={handleFile}
					className='hidden'
					aria-label='Загрузить фото'
				/>
			</div>
		</div>
	)
}

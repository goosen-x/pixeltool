'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Eraser, X } from 'lucide-react'
import { canvasToPngBlob, trimCanvas } from '@/lib/tools/signature-image'

interface SignaturePadProps {
	onDone: (blob: Blob) => void
	onCancel: () => void
}

/** Ширина пера в точках холста. */
const STROKE_WIDTH = 3

/**
 * Поле для росписи мышью или пальцем.
 *
 * Холст держится в удвоенном разрешении относительно своего размера на
 * экране: подпись потом ложится на документ и может быть увеличена, а
 * линия, нарисованная один к одному, при этом расплылась бы. Рисуем
 * указателями, а не мышью и касаниями по отдельности — один обработчик
 * покрывает мышь, палец и перо, и не приходится гасить прокрутку вручную.
 */
export function SignaturePad({ onDone, onCancel }: SignaturePadProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const drawing = useRef(false)
	const lastPoint = useRef<{ x: number; y: number } | null>(null)
	const [hasInk, setHasInk] = useState(false)

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const rect = canvas.getBoundingClientRect()
		canvas.width = rect.width * 2
		canvas.height = rect.height * 2

		const context = canvas.getContext('2d')
		if (!context) return
		context.scale(2, 2)
		context.lineWidth = STROKE_WIDTH
		context.lineCap = 'round'
		context.lineJoin = 'round'
		context.strokeStyle = '#111827'
	}, [])

	const pointFrom = (event: React.PointerEvent<HTMLCanvasElement>) => {
		const rect = event.currentTarget.getBoundingClientRect()
		return { x: event.clientX - rect.left, y: event.clientY - rect.top }
	}

	const start = (event: React.PointerEvent<HTMLCanvasElement>) => {
		event.currentTarget.setPointerCapture(event.pointerId)
		drawing.current = true
		lastPoint.current = pointFrom(event)
	}

	const move = (event: React.PointerEvent<HTMLCanvasElement>) => {
		if (!drawing.current) return
		const context = canvasRef.current?.getContext('2d')
		const from = lastPoint.current
		if (!context || !from) return

		const to = pointFrom(event)
		context.beginPath()
		context.moveTo(from.x, from.y)
		context.lineTo(to.x, to.y)
		context.stroke()

		lastPoint.current = to
		if (!hasInk) setHasInk(true)
	}

	const end = () => {
		drawing.current = false
		lastPoint.current = null
	}

	const clear = () => {
		const canvas = canvasRef.current
		const context = canvas?.getContext('2d')
		if (!canvas || !context) return
		context.clearRect(0, 0, canvas.width, canvas.height)
		setHasInk(false)
	}

	const done = async () => {
		const canvas = canvasRef.current
		if (!canvas || !hasInk) return
		// Обрезаем пустые поля: иначе размер подписи на документе задавала бы
		// величина холста, а не сама роспись.
		onDone(await canvasToPngBlob(trimCanvas(canvas)))
	}

	return (
		<div className='flex flex-col gap-3 px-5 py-6 sm:px-6'>
			<canvas
				ref={canvasRef}
				onPointerDown={start}
				onPointerMove={move}
				onPointerUp={end}
				onPointerLeave={end}
				aria-label='Поле для росписи'
				className='h-48 w-full cursor-crosshair touch-none rounded-xl border border-dashed bg-background'
			/>

			<div className='flex flex-wrap items-center gap-2'>
				<Button
					onClick={done}
					disabled={!hasInk}
					className='cursor-pointer gap-2'
				>
					<Check className='h-4 w-4' />
					Готово
				</Button>
				<Button
					variant='ghost'
					onClick={clear}
					disabled={!hasInk}
					className='cursor-pointer gap-2'
				>
					<Eraser className='h-4 w-4' />
					Стереть
				</Button>
				<Button
					variant='ghost'
					onClick={onCancel}
					className='cursor-pointer gap-2'
				>
					<X className='h-4 w-4' />
					Отмена
				</Button>

				<span className='text-sm text-muted-foreground sm:ml-auto'>
					распишитесь мышью или пальцем
				</span>
			</div>
		</div>
	)
}

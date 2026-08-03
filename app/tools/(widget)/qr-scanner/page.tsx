'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toolBar, toolPill } from '@/lib/ui/tool-pill'
import { Camera, Upload, Copy, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { getWidgetById } from '@/lib/constants/widgets'
import { decodeImageData } from '@/lib/qr-scanner/decode'
import { QrScannerSeo } from './QrScannerSeo'

type ScanMode = 'camera' | 'upload'

// Максимальная сторона кадра, который реально прогоняем через jsQR.
const MAX_SCAN_DIMENSION = 800

function isHttpUrl(text: string): boolean {
	try {
		const url = new URL(text)
		return url.protocol === 'http:' || url.protocol === 'https:'
	} catch {
		return false
	}
}

export default function QRScannerPage() {
	const widget = getWidgetById('qr-scanner')!

	const [mode, setMode] = useState<ScanMode>('camera')
	const [result, setResult] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [cameraActive, setCameraActive] = useState(false)
	const [starting, setStarting] = useState(false)

	const videoRef = useRef<HTMLVideoElement>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const streamRef = useRef<MediaStream | null>(null)
	const rafRef = useRef<number | null>(null)
	const modeRef = useRef(mode)

	const stopCamera = useCallback(() => {
		if (rafRef.current !== null) {
			cancelAnimationFrame(rafRef.current)
			rafRef.current = null
		}
		streamRef.current?.getTracks().forEach(track => track.stop())
		streamRef.current = null
		setCameraActive(false)
	}, [])

	// Пока камера включена, гоняем кадры через jsQR в requestAnimationFrame —
	// это штатный способ непрерывного сканирования, без кнопки "сделать снимок".
	const scanFrame = useCallback(() => {
		const video = videoRef.current
		const canvas = canvasRef.current

		if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
			rafRef.current = requestAnimationFrame(scanFrame)
			return
		}

		// На телефоне видео с камеры может быть в разы больше MAX_SCAN_DIMENSION
		// (даже с constraint'ами ниже — не все браузеры их точно соблюдают).
		// jsQR на каждый кадр на таком разрешении вешает основной поток так,
		// что сканирование выглядит как "не работает" — даунскейлим перед декодом.
		const scale = Math.min(
			1,
			MAX_SCAN_DIMENSION / Math.max(video.videoWidth, video.videoHeight)
		)
		canvas.width = Math.round(video.videoWidth * scale)
		canvas.height = Math.round(video.videoHeight * scale)
		const ctx = canvas.getContext('2d', { willReadFrequently: true })

		if (ctx) {
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
			const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
			const decoded = decodeImageData(imageData)
			if (decoded) setResult(decoded)
		}

		rafRef.current = requestAnimationFrame(scanFrame)
	}, [])

	const startCamera = async () => {
		if (starting) return
		setStarting(true)
		setError(null)
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: 'environment',
					width: { ideal: 1280 },
					height: { ideal: 720 }
				}
			})
			// Пользователь мог переключиться на вкладку загрузки, пока мы ждали
			// разрешение на камеру — тогда просто останавливаем полученный поток.
			if (modeRef.current !== 'camera') {
				stream.getTracks().forEach(track => track.stop())
				return
			}
			streamRef.current = stream
			if (videoRef.current) {
				videoRef.current.srcObject = stream
				await videoRef.current.play()
			}
			setCameraActive(true)
			rafRef.current = requestAnimationFrame(scanFrame)
		} catch (err) {
			console.error(err)
			setError(
				'Не удалось получить доступ к камере. Разрешите доступ в настройках браузера или загрузите изображение во вкладке «Изображение».'
			)
		} finally {
			setStarting(false)
		}
	}

	// Останавливаем камеру при уходе со страницы и при переключении на вкладку
	// загрузки — незачем держать поток открытым, когда он не используется.
	useEffect(() => stopCamera, [stopCamera])
	useEffect(() => {
		modeRef.current = mode
		if (mode !== 'camera') stopCamera()
	}, [mode, stopCamera])

	const handleFileUpload = (file: File) => {
		setError(null)
		const objectUrl = URL.createObjectURL(file)
		const img = new Image()

		img.onload = () => {
			URL.revokeObjectURL(objectUrl)
			const canvas = document.createElement('canvas')
			canvas.width = img.naturalWidth
			canvas.height = img.naturalHeight
			const ctx = canvas.getContext('2d')
			if (!ctx) return

			ctx.drawImage(img, 0, 0)
			const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
			const decoded = decodeImageData(imageData)

			if (decoded) {
				setResult(decoded)
			} else {
				setError('QR-код не найден на изображении.')
			}
		}

		img.onerror = () => {
			URL.revokeObjectURL(objectUrl)
			setError('Не удалось открыть файл как изображение.')
		}

		img.src = objectUrl
	}

	const copyResult = async () => {
		if (!result) return
		await navigator.clipboard.writeText(result)
		toast.success('Скопировано')
	}

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: откуда читаем код. Вкладками это быть перестало —
				    два варианта не стоят полноразмерного переключателя во всю ширину. */}
				<div className={toolBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						{(
							[
								{ key: 'camera', label: 'С камеры' },
								{ key: 'upload', label: 'Из картинки' }
							] as { key: ScanMode; label: string }[]
						).map(item => (
							<button
								key={item.key}
								type='button'
								onClick={() => setMode(item.key)}
								aria-pressed={mode === item.key}
								className={toolPill(mode === item.key)}
							>
								{item.label}
							</button>
						))}
					</div>
				</div>

				<div className='px-5 py-6 sm:px-6'>
					{mode === 'camera' ? (
						<div className='relative aspect-video overflow-hidden rounded-xl bg-black'>
							<video
								ref={videoRef}
								className='h-full w-full object-cover'
								muted
								playsInline
							/>

							{/* Кнопка живёт по центру самого кадра, а не в верхней полосе:
							    там она была единственным залитым элементом и спорила с
							    переключателями режима. Пока камера выключена, центр всё
							    равно пустой — действие стоит ровно там, куда смотрят. */}
							{!cameraActive ? (
								<div className='absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center'>
									<Button
										onClick={startCamera}
										disabled={starting}
										className='h-10 cursor-pointer px-6'
									>
										<Camera className='mr-2 h-4 w-4' />
										{starting ? 'Запрашиваем доступ…' : 'Включить камеру'}
									</Button>
									<p className='text-sm text-white/60'>
										Наведите камеру на QR-код — он распознается сам
									</p>
								</div>
							) : (
								// Поверх работающего кадра — приглушённая кнопка внизу, чтобы
								// не перекрывать то, что человек наводит на код.
								<Button
									onClick={stopCamera}
									variant='secondary'
									size='sm'
									className='absolute bottom-3 left-1/2 h-8 -translate-x-1/2 cursor-pointer'
								>
									Остановить
								</Button>
							)}
						</div>
					) : (
						<label
							htmlFor='qr-image-upload'
							onDragOver={e => e.preventDefault()}
							onDrop={e => {
								e.preventDefault()
								const file = e.dataTransfer.files?.[0]
								if (file) handleFileUpload(file)
							}}
							className='flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-10 text-center text-muted-foreground transition-colors hover:border-primary hover:bg-muted/30'
						>
							<Upload className='h-6 w-6' />
							<span>
								Перетащите картинку сюда или нажмите, чтобы выбрать файл
							</span>
							<input
								id='qr-image-upload'
								type='file'
								accept='image/*'
								className='hidden'
								onChange={e => {
									const file = e.target.files?.[0]
									if (file) handleFileUpload(file)
								}}
							/>
						</label>
					)}

					<canvas ref={canvasRef} className='hidden' />
				</div>

				{/* Результат — нижняя полоса той же карточки, а не вторая колонка:
				    на телефоне вторая колонка всё равно уезжала под сканер, и её
				    приходилось искать скроллом. */}
				<div className='border-t px-5 py-4 sm:px-6'>
					{error ? (
						<p className='text-sm text-destructive'>{error}</p>
					) : result ? (
						<div className='flex flex-wrap items-center gap-x-4 gap-y-3'>
							<p className='min-w-0 flex-1 font-mono text-sm break-all'>
								{result}
							</p>
							<div className='flex items-center gap-1'>
								<Button
									onClick={copyResult}
									variant='ghost'
									size='sm'
									className='cursor-pointer gap-1.5'
								>
									<Copy className='h-3.5 w-3.5' />
									Копировать
								</Button>
								{isHttpUrl(result) && (
									<Button asChild size='sm' className='cursor-pointer gap-1.5'>
										<a href={result} target='_blank' rel='noopener noreferrer'>
											<ExternalLink className='h-3.5 w-3.5' />
											Открыть
										</a>
									</Button>
								)}
							</div>
						</div>
					) : (
						<p className='text-sm text-muted-foreground'>
							Наведите камеру на QR-код или загрузите изображение — распознанный
							текст появится здесь.
						</p>
					)}
				</div>
			</Card>
			<QrScannerSeo />
		</WidgetSEOWrapper>
	)
}

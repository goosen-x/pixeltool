'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { WidgetSection } from '@/components/widgets/WidgetSection'
import { WidgetOutput } from '@/components/widgets/WidgetOutput'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Camera, Upload, Copy, ExternalLink, ScanQrCode } from 'lucide-react'
import { toast } from 'sonner'
import { getWidgetById } from '@/lib/constants/widgets'
import { decodeImageData } from '@/lib/qr-scanner/decode'
import { QrScannerSeo } from './QrScannerSeo'

type ScanMode = 'camera' | 'upload'

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

		canvas.width = video.videoWidth
		canvas.height = video.videoHeight
		const ctx = canvas.getContext('2d')

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
				video: { facingMode: 'environment' }
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
			<div className='grid gap-6 lg:grid-cols-2'>
				<WidgetSection icon={<ScanQrCode className='w-5 h-5' />} title='Сканер'>
					<Tabs value={mode} onValueChange={v => setMode(v as ScanMode)}>
						<TabsList className='grid w-full grid-cols-2'>
							<TabsTrigger value='camera'>
								<Camera className='w-4 h-4 mr-2' />
								Камера
							</TabsTrigger>
							<TabsTrigger value='upload'>
								<Upload className='w-4 h-4 mr-2' />
								Изображение
							</TabsTrigger>
						</TabsList>

						<TabsContent value='camera' className='space-y-4'>
							<div className='relative aspect-video overflow-hidden rounded-lg bg-black'>
								{/* eslint-disable-next-line jsx-a11y/media-has-caption */}
								<video
									ref={videoRef}
									className='h-full w-full object-cover'
									muted
									playsInline
								/>
							</div>
							{cameraActive ? (
								<Button
									onClick={stopCamera}
									variant='outline'
									className='w-full'
								>
									Остановить камеру
								</Button>
							) : (
								<Button
									onClick={startCamera}
									disabled={starting}
									className='w-full'
								>
									Включить камеру
								</Button>
							)}
						</TabsContent>

						<TabsContent value='upload' className='space-y-4'>
							<label
								htmlFor='qr-image-upload'
								onDragOver={e => e.preventDefault()}
								onDrop={e => {
									e.preventDefault()
									const file = e.dataTransfer.files?.[0]
									if (file) handleFileUpload(file)
								}}
								className='flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-10 text-center text-muted-foreground hover:border-primary'
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
						</TabsContent>
					</Tabs>
				</WidgetSection>

				<WidgetSection
					icon={<ScanQrCode className='w-5 h-5' />}
					title='Результат'
				>
					{error && <p className='text-sm text-destructive'>{error}</p>}
					{!error && !result && (
						<p className='text-sm text-muted-foreground'>
							Наведите камеру на QR-код или загрузите изображение — результат
							появится здесь.
						</p>
					)}
					{result && (
						<WidgetOutput>
							<p className='break-all font-mono text-sm'>{result}</p>
							<div className='mt-4 flex gap-2'>
								<Button onClick={copyResult} variant='outline' size='sm'>
									<Copy className='mr-2 h-4 w-4' />
									Копировать
								</Button>
								{isHttpUrl(result) && (
									<Button asChild size='sm'>
										<a href={result} target='_blank' rel='noopener noreferrer'>
											<ExternalLink className='mr-2 h-4 w-4' />
											Открыть ссылку
										</a>
									</Button>
								)}
							</div>
						</WidgetOutput>
					)}
					<canvas ref={canvasRef} className='hidden' />
				</WidgetSection>
			</div>
			<QrScannerSeo />
		</WidgetSEOWrapper>
	)
}

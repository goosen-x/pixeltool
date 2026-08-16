'use client'

import { useEffect, useRef, useState } from 'react'
import {
	Check,
	Download,
	Loader2,
	Scissors,
	Trash2,
	Upload
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toolBar, toolIconButton } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { RemoveBackgroundSeo } from './RemoveBackgroundSeo'
import { BeforeAfterSlider } from './BeforeAfterSlider'

type Status = 'idle' | 'processing' | 'done' | 'error'

// Библиотека сама не пишет никуда, кроме HTTP-кэша браузера (см. её исходники
// — ни Cache Storage, ни IndexedDB) — а он не гарантирован (например,
// отключается чек-боксом «Disable cache» в открытых DevTools). Этот флаг —
// наша отдельная, честная подсказка «на этом устройстве модель точно
// скачивали хотя бы раз», не зависящая от того, сработал ли HTTP-кэш.
const MODEL_READY_KEY = 'remove-background-model-ready'

export default function RemoveBackgroundPage() {
	const widget = getWidgetById('remove-background')!

	const [status, setStatus] = useState<Status>('idle')
	const [sourceFile, setSourceFile] = useState<File | null>(null)
	const [sourceUrl, setSourceUrl] = useState<string | null>(null)
	const [resultUrl, setResultUrl] = useState<string | null>(null)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [progress, setProgress] = useState<{
		current: number
		total: number
	} | null>(null)
	const [modelReady, setModelReady] = useState(false)

	useEffect(() => {
		setModelReady(localStorage.getItem(MODEL_READY_KEY) === 'true')
	}, [])

	const fileInputRef = useRef<HTMLInputElement>(null)
	// Прогресс складывается из нескольких файлов (модель + wasm) — сумма по
	// ключам, не последний колбэк, иначе бар прыгает туда-сюда.
	const progressByKey = useRef<Map<string, { current: number; total: number }>>(
		new Map()
	)

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return

		setSourceFile(file)
		setSourceUrl(URL.createObjectURL(file))
		setResultUrl(null)
		setStatus('idle')
		setErrorMessage(null)
	}

	const removeBackground = async () => {
		if (!sourceFile) return

		setStatus('processing')
		setErrorMessage(null)
		progressByKey.current = new Map()
		setProgress(null)

		try {
			const { removeBackground } = await import('@imgly/background-removal')

			// Передаём File, а не blob:-URL строкой: библиотека для строк делает
			// fetch(image) сама (см. imageSourceToImageData в её исходниках), а
			// File — это уже Blob, декодируется напрямую без сетевого запроса.
			// Так надёжнее и меньше точек отказа.
			const blob = await removeBackground(sourceFile, {
				// isnet_quint8 — самая лёгкая из трёх моделей (~40 МБ, квантованная
				// int8). isnet_fp16 (~80 МБ) и isnet (~170 МБ) точнее, но тяжелее
				// скачивать на мобильном — не оправдано для первой версии.
				model: 'isnet_quint8',
				progress: (key: string, current: number, total: number) => {
					progressByKey.current.set(key, { current, total })
					let sumCurrent = 0
					let sumTotal = 0
					for (const value of progressByKey.current.values()) {
						sumCurrent += value.current
						sumTotal += value.total
					}
					setProgress({ current: sumCurrent, total: sumTotal })
				}
			})

			setResultUrl(URL.createObjectURL(blob))
			setStatus('done')
			localStorage.setItem(MODEL_READY_KEY, 'true')
			setModelReady(true)
		} catch (error) {
			console.error(error)
			setErrorMessage(
				'Не получилось обработать фото. Попробуйте другой файл или обновите страницу.'
			)
			setStatus('error')
		}
	}

	const downloadResult = () => {
		if (!resultUrl) return
		const link = document.createElement('a')
		link.href = resultUrl
		link.download = 'no-background.png'
		link.click()
	}

	const reset = () => {
		setSourceFile(null)
		setSourceUrl(null)
		setResultUrl(null)
		setStatus('idle')
		setErrorMessage(null)
		setProgress(null)
		if (fileInputRef.current) fileInputRef.current.value = ''
	}

	const progressPercent =
		progress && progress.total > 0
			? Math.min(100, Math.round((progress.current / progress.total) * 100))
			: null

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<div className='flex flex-wrap items-center gap-3'>
						<span className='text-sm text-muted-foreground'>
							Обработка целиком в браузере — фото не отправляется на сервер
						</span>
						{modelReady ? (
							<span className='inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400'>
								<Check className='h-3 w-3' />
								Модель уже загружена
							</span>
						) : (
							<span className='inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground'>
								Модель ещё не скачана (~40 МБ)
							</span>
						)}
					</div>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => fileInputRef.current?.click()}
							title={sourceUrl ? 'Выбрать другое фото' : 'Загрузить фото'}
							className={toolIconButton}
						>
							<Upload className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={downloadResult}
							disabled={!resultUrl}
							title='Скачать PNG'
							className={toolIconButton}
						>
							<Download className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={reset}
							disabled={!sourceUrl}
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
					accept='image/*'
					onChange={handleFileSelect}
					aria-label='Загрузить фото'
					className='hidden'
				/>

				{resultUrl && sourceUrl ? (
					// Результат готов — слайдер «до/после» во всю ширину и высоту
					// карточки, без отступов. Заменить фото — иконка Upload в toolBar.
					<BeforeAfterSlider beforeUrl={sourceUrl} afterUrl={resultUrl} />
				) : (
					<div className='flex flex-col items-center gap-4 px-5 py-6 sm:px-6'>
						{sourceUrl ? (
							<button
								type='button'
								onClick={() => fileInputRef.current?.click()}
								title='Выбрать другое фото'
								className='cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
							>
								{/* eslint-disable-next-line @next/next/no-img-element -- object URL, не оптимизируем через next/image */}
								<img
									src={sourceUrl}
									alt='Исходное фото'
									className='max-h-80 w-auto rounded-xl border object-contain'
								/>
							</button>
						) : (
							<button
								type='button'
								onClick={() => fileInputRef.current?.click()}
								className='flex w-full cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed py-16 transition-colors hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
							>
								<Upload className='h-6 w-6 text-muted-foreground' />
								<span className='text-sm'>Выберите фото</span>
							</button>
						)}

						{sourceUrl && status !== 'processing' && (
							<div className='w-full max-w-xs space-y-2 text-center'>
								<Button
									onClick={removeBackground}
									className='w-full cursor-pointer gap-2'
								>
									<Scissors className='h-4 w-4' />
									Убрать фон
								</Button>
								<p className='text-xs text-muted-foreground'>
									{modelReady
										? 'Модель уже загружена на этом устройстве — обработка займёт пару секунд.'
										: 'При первом запуске на этом устройстве скачается модель ИИ (~40 МБ) — дальше она в кэше браузера, повторно скачивать не придётся.'}
								</p>
							</div>
						)}

						{status === 'processing' && (
							<div className='w-full max-w-xs space-y-2'>
								<div className='flex items-center justify-center gap-2 text-sm text-muted-foreground'>
									<Loader2 className='h-4 w-4 animate-spin' />
									{/* modelReady — уже видели успешный прогон на этом устройстве:
									    даже если колбэк progress ещё раз тикнет (читает из кэша),
									    не пишем «загружаем модель» — это будет неправдой. */}
									{!modelReady && progressPercent !== null
										? `Загружаем модель… ${progressPercent}%`
										: 'Убираем фон…'}
								</div>
								{!modelReady && progressPercent !== null && (
									<div className='h-1.5 w-full overflow-hidden rounded-full bg-muted'>
										<div
											className='h-full bg-primary transition-all'
											style={{ width: `${progressPercent}%` }}
										/>
									</div>
								)}
							</div>
						)}

						{errorMessage && (
							<p className='text-sm text-destructive'>{errorMessage}</p>
						)}
					</div>
				)}
			</Card>

			<RemoveBackgroundSeo />
		</WidgetSEOWrapper>
	)
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Download, Scissors, Trash2, Upload } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toolBar, toolIconButton } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { useFileDrop } from '@/lib/hooks/useFileDrop'
import { cn } from '@/lib/utils'
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

	const selectFile = (file: File) => {
		setSourceUrl(URL.createObjectURL(file))
		setResultUrl(null)
		setErrorMessage(null)
		// Обработка стартует сразу — лишний клик по отдельной кнопке «Убрать
		// фон» ничего не решал, результат детерминирован от файла.
		void processFile(file)
	}

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) selectFile(file)
	}

	const { isDragging, ...dropHandlers } = useFileDrop(selectFile)

	const processFile = async (file: File) => {
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
			const blob = await removeBackground(file, {
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
		link.download = 'pixeltool.pro-no-background.png'
		link.click()
	}

	const reset = () => {
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
			<Card
				className={cn(
					'overflow-hidden p-0 transition-colors',
					isDragging && 'ring-2 ring-primary ring-inset'
				)}
				{...dropHandlers}
			>
				<div className={toolBar}>
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
				) : status === 'processing' ? (
					// Крупный спиннер вместо строки текста — обработка стартует сразу
					// после выбора фото, отдельной кнопки-подтверждения больше нет.
					<div className='flex flex-col items-center gap-5 px-5 py-20 text-center sm:px-6'>
						<div className='relative flex h-16 w-16 items-center justify-center'>
							<div className='absolute inset-0 animate-spin rounded-full border-4 border-primary/15 border-t-primary' />
							<Scissors className='h-6 w-6 text-primary' />
						</div>
						<div className='w-full max-w-xs space-y-2'>
							<p className='font-medium text-foreground'>
								{/* modelReady — уже видели успешный прогон на этом устройстве:
								    даже если колбэк progress ещё раз тикнет (читает из кэша),
								    не пишем «загружаем модель» — это будет неправдой. */}
								{!modelReady && progressPercent !== null
									? `Загружаем модель… ${progressPercent}%`
									: 'Убираем фон…'}
							</p>
							{!modelReady && progressPercent !== null && (
								<div className='h-1.5 w-full overflow-hidden rounded-full bg-muted'>
									<div
										className='h-full bg-primary transition-all'
										style={{ width: `${progressPercent}%` }}
									/>
								</div>
							)}
						</div>
					</div>
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

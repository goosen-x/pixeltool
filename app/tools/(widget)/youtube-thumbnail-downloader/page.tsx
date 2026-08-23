'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Check, Download, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { toolBar, toolIconButton, toolPill } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { YoutubeThumbnailSeo } from './YoutubeThumbnailSeo'

/**
 * Пять размеров, которые YouTube отдаёт по фиксированным адресам. Кроме них
 * есть три кадра из самого видео (1.jpg, 2.jpg, 3.jpg) — они добавляются к
 * списку ниже: формально это тоже обложки, только выбранные автоматически.
 */
const THUMBNAIL_TYPES = [
	{
		quality: 'maxresdefault',
		label: 'Максимальное',
		width: 1280,
		height: 720
	},
	{ quality: 'sddefault', label: 'Стандартное', width: 640, height: 480 },
	{ quality: 'hqdefault', label: 'Высокое', width: 480, height: 360 },
	{ quality: 'mqdefault', label: 'Среднее', width: 320, height: 180 },
	{ quality: 'default', label: 'Миниатюра', width: 120, height: 90 }
]

const EXAMPLE_URLS = [
	'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
	'https://youtu.be/dQw4w9WgXcQ',
	'dQw4w9WgXcQ'
]

export default function YouTubeThumbnailPage() {
	const widget = getWidgetById('youtube-thumbnail')!
	const [url, setUrl] = useState('')
	const [videoId, setVideoId] = useState('')
	const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
	const [error, setError] = useState('')

	const extractVideoId = (url: string) => {
		setError('')

		// Reset if empty
		if (!url) {
			setVideoId('')
			return
		}

		// Direct video ID (11 characters)
		if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
			setVideoId(url)
			return
		}

		// Regular YouTube URLs
		const patterns = [
			/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
			/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
		]

		for (const pattern of patterns) {
			const match = url.match(pattern)
			if (match) {
				setVideoId(match[1])
				return
			}
		}

		setError('Не похоже на ссылку YouTube')
		setVideoId('')
	}

	const handleUrlChange = (value: string) => {
		setUrl(value)
		extractVideoId(value)
	}

	const copyToClipboard = async (text: string) => {
		await navigator.clipboard.writeText(text)
		setCopiedUrl(text)
		setTimeout(() => setCopiedUrl(null), 2000)
	}

	const downloadImage = async (imageUrl: string, filename: string) => {
		try {
			const response = await fetch(imageUrl)
			const blob = await response.blob()
			const url = URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = filename
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
			URL.revokeObjectURL(url)
		} catch (error) {
			console.error('Download failed:', error)
		}
	}

	// Обложки и кадры из видео живут в одной сетке: для человека это всё
	// «картинки с этого ролика», а не два разных списка с заголовками.
	const thumbnails = videoId
		? [
				...THUMBNAIL_TYPES.map(type => ({
					key: type.quality,
					label: type.label,
					hint: `${type.width} × ${type.height}`,
					url: `https://img.youtube.com/vi/${videoId}/${type.quality}.jpg`,
					filename: `${videoId}-${type.quality}.jpg`
				})),
				...[1, 2, 3].map(num => ({
					key: `frame-${num}`,
					label: `Кадр ${num}`,
					hint: 'из видео',
					url: `https://img.youtube.com/vi/${videoId}/${num}.jpg`,
					filename: `${videoId}-alt${num}.jpg`
				}))
			]
		: []

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: сама ссылка и распознанный из неё id. Раньше поле
			    ввода было в отдельной карточке над результатом. */}
				<div className={toolBar}>
					<input
						value={url}
						onChange={event => handleUrlChange(event.target.value)}
						placeholder='Ссылка на видео или его id'
						spellCheck={false}
						aria-label='Ссылка на видео YouTube'
						className='min-w-0 flex-1 rounded-md border bg-background px-2 py-1 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-w-[20rem]'
					/>

					{videoId && (
						<button
							type='button'
							onClick={() => copyToClipboard(videoId)}
							title='Скопировать id видео'
							className={toolPill(false, 'font-mono')}
						>
							{copiedUrl === videoId ? '✓ ' : ''}
							{videoId}
						</button>
					)}

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<button
							type='button'
							onClick={() => handleUrlChange(EXAMPLE_URLS[0])}
							className={toolPill(false)}
						>
							Пример
						</button>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => handleUrlChange('')}
							disabled={!url}
							title='Очистить'
							className={toolIconButton}
						>
							<Trash2 className='h-4 w-4' />
						</Button>
					</div>
				</div>

				{videoId ? (
					<div className='grid gap-4 px-5 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-3'>
						{thumbnails.map(thumbnail => (
							<div key={thumbnail.key} className='group'>
								<div className='relative aspect-video overflow-hidden rounded-xl border bg-muted'>
									<Image
										src={thumbnail.url}
										alt={`Обложка видео — ${thumbnail.label}`}
										fill
										className='object-cover'
										unoptimized
										onError={event => {
											// YouTube отдаёт заглушку вместо 404, если размера нет,
											// поэтому картинку просто прячем и пишем прямо.
											const target = event.target as HTMLImageElement
											target.style.display = 'none'
											const parent = target.parentElement
											if (parent && !parent.dataset.failed) {
												parent.dataset.failed = 'true'
												const note = document.createElement('div')
												note.className =
													'absolute inset-0 flex items-center justify-center text-sm text-muted-foreground'
												note.textContent = 'Нет такого размера'
												parent.appendChild(note)
											}
										}}
									/>

									<div className='absolute top-2 right-2 flex gap-0.5 opacity-60 transition-opacity group-hover:opacity-100 focus-within:opacity-100'>
										<Button
											size='icon'
											variant='ghost'
											onClick={() => copyToClipboard(thumbnail.url)}
											title='Скопировать ссылку'
											className={cn(toolIconButton, 'bg-background/90')}
										>
											{copiedUrl === thumbnail.url ? (
												<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
											) : (
												<Copy className='h-4 w-4' />
											)}
										</Button>
										<Button
											size='icon'
											variant='ghost'
											onClick={() =>
												downloadImage(thumbnail.url, thumbnail.filename)
											}
											title='Скачать'
											className={cn(toolIconButton, 'bg-background/90')}
										>
											<Download className='h-4 w-4' />
										</Button>
									</div>
								</div>

								<p className='mt-2 flex items-center justify-between gap-2 px-1 text-sm'>
									<span>{thumbnail.label}</span>
									<span className='font-mono text-xs text-muted-foreground'>
										{thumbnail.hint}
									</span>
								</p>
							</div>
						))}
					</div>
				) : (
					<div className='px-5 py-12 text-center sm:px-6'>
						<p className='text-sm text-muted-foreground'>
							{error || 'Вставьте ссылку — обложки появятся здесь'}
						</p>
						<div className='mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground'>
							<span>Понимает форматы:</span>
							{EXAMPLE_URLS.map(example => (
								<button
									key={example}
									type='button'
									onClick={() => handleUrlChange(example)}
									className='cursor-pointer font-mono transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
								>
									{example}
								</button>
							))}
						</div>
					</div>
				)}
			</Card>

			<YoutubeThumbnailSeo />
		</WidgetSEOWrapper>
	)
}

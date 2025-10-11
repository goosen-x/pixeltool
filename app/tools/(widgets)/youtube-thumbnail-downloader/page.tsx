'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Copy, Check, Download, Youtube } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

interface ThumbnailType {
	name: string
	quality: string
	width: number
	height: number
	getUrl: (videoId: string) => string
}

const thumbnailTypes = [
	{
		quality: 'maxresdefault',
		width: 1280,
		height: 720,
		getUrl: (id: string) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
	},
	{
		quality: 'sddefault',
		width: 640,
		height: 480,
		getUrl: (id: string) => `https://img.youtube.com/vi/${id}/sddefault.jpg`
	},
	{
		quality: 'hqdefault',
		width: 480,
		height: 360,
		getUrl: (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`
	},
	{
		quality: 'mqdefault',
		width: 320,
		height: 180,
		getUrl: (id: string) => `https://img.youtube.com/vi/${id}/mqdefault.jpg`
	},
	{
		quality: 'default',
		width: 120,
		height: 90,
		getUrl: (id: string) => `https://img.youtube.com/vi/${id}/default.jpg`
	}
]

export default function YouTubeThumbnailPage() {
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

		setError('Неверная ссылка YouTube')
		setVideoId('')
	}

	const handleUrlChange = (value: string) => {
		setUrl(value)
		extractVideoId(value)
	}

	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text)
			setCopiedUrl(text)
			setTimeout(() => setCopiedUrl(null), 2000)
			toast.success('Скопировано в буфер обмена')
		} catch (err) {
			toast.error('Ошибка копирования')
		}
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
			toast.success('Изображение загружено')
		} catch (error) {
			console.error('Download failed:', error)
			toast.error('Ошибка загрузки')
		}
	}

	const exampleUrls = [
		'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
		'https://youtu.be/dQw4w9WgXcQ',
		'dQw4w9WgXcQ'
	]

	return (
		<>
			<Card className='p-6 mb-6'>
				<div className='space-y-4'>
					<div>
						<Label
							htmlFor='youtube-url'
							className='text-base font-semibold mb-2 block'
						>
							Введите ссылку YouTube
						</Label>
						<div className='flex gap-2'>
							<div className='flex-1 flex gap-2'>
								<Input
									id='youtube-url'
									type='text'
									value={url}
									onChange={e => handleUrlChange(e.target.value)}
									placeholder='https://www.youtube.com/watch?v=dQw4w9WgXcQ'
									className='flex-1'
								/>
								{videoId && (
									<div className='flex items-center gap-2 px-3 bg-muted/50 rounded-md'>
										<Youtube className='w-4 h-4 text-red-500' />
										<code className='text-sm font-mono'>{videoId}</code>
										<Button
											size='sm'
											variant='ghost'
											onClick={() => copyToClipboard(videoId)}
											className='h-6 w-6 p-0'
										>
											{copiedUrl === videoId ? (
												<Check className='h-3 w-3 text-green-500' />
											) : (
												<Copy className='h-3 w-3' />
											)}
										</Button>
									</div>
								)}
							</div>
							<Button
								variant='outline'
								onClick={() => handleUrlChange(exampleUrls[0])}
							>
								Пример
							</Button>
						</div>
						{error && <p className='text-sm text-destructive mt-2'>{error}</p>}
					</div>

					<div className='flex items-center gap-2 text-xs text-muted-foreground flex-wrap'>
						<span>Поддерживаемые форматы:</span>
						{exampleUrls.map((example, index) => (
							<span key={index} className='flex items-center gap-2'>
								{index > 0 && <span>•</span>}
								<button
									onClick={() => handleUrlChange(example)}
									className='hover:text-foreground transition-colors'
								>
									<code className='font-mono'>{example}</code>
								</button>
							</span>
						))}
					</div>
				</div>
			</Card>

			{videoId && (
				<>
					<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
						{thumbnailTypes.map(type => {
							const imageUrl = type.getUrl(videoId)
							const nameKey =
								type.quality === 'maxresdefault'
									? 'Максимальное качество'
									: type.quality === 'sddefault'
										? 'Стандартное качество'
										: type.quality === 'hqdefault'
											? 'Высокое качество'
											: type.quality === 'mqdefault'
												? 'Среднее качество'
												: 'Миниатюрное качество'
							return (
								<Card key={type.quality} className='overflow-hidden group'>
									<div className='relative aspect-video bg-muted'>
										<Image
											src={imageUrl}
											alt={`${nameKey} миниатюра`}
											fill
											className='object-cover transition-transform group-hover:scale-105'
											unoptimized
											onError={e => {
												const target = e.target as HTMLImageElement
												target.style.display = 'none'
												const parent = target.parentElement
												if (parent) {
													const errorDiv = document.createElement('div')
													errorDiv.className =
														'absolute inset-0 flex items-center justify-center text-muted-foreground text-sm'
													errorDiv.textContent = 'Недоступно'
													parent.appendChild(errorDiv)
												}
											}}
										/>
										<div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors' />
										<div className='absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
											<Button
												size='icon'
												variant='secondary'
												className='h-8 w-8 bg-background/90 backdrop-blur-sm'
												onClick={() => copyToClipboard(imageUrl)}
												title='Копировать ссылку'
											>
												{copiedUrl === imageUrl ? (
													<Check className='h-4 w-4 text-green-500' />
												) : (
													<Copy className='h-4 w-4' />
												)}
											</Button>
											<Button
												size='icon'
												variant='secondary'
												className='h-8 w-8 bg-background/90 backdrop-blur-sm'
												onClick={() =>
													downloadImage(
														imageUrl,
														`${videoId}-${type.quality}.jpg`
													)
												}
												title='Скачать'
											>
												<Download className='h-4 w-4' />
											</Button>
										</div>
									</div>
									<div className='p-3'>
										<div className='flex items-center justify-between'>
											<h3 className='font-medium text-sm'>{nameKey}</h3>
											<span className='text-xs text-muted-foreground'>
												{type.width} × {type.height}
											</span>
										</div>
									</div>
								</Card>
							)
						})}
					</div>

					{/* Alternative thumbnails */}
					<div className='mt-8'>
						<h3 className='text-sm font-medium text-muted-foreground mb-4'>
							Альтернативные миниатюры
						</h3>
						<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
							{[1, 2, 3].map(num => {
								const imageUrl = `https://img.youtube.com/vi/${videoId}/${num}.jpg`
								return (
									<Card key={num} className='overflow-hidden group'>
										<div className='relative aspect-video bg-muted'>
											<Image
												src={imageUrl}
												alt={`Миниатюра ${num}`}
												fill
												className='object-cover transition-transform group-hover:scale-105'
												unoptimized
												onError={e => {
													const target = e.target as HTMLImageElement
													target.style.display = 'none'
													const parent = target.parentElement
													if (parent) {
														const errorDiv = document.createElement('div')
														errorDiv.className =
															'absolute inset-0 flex items-center justify-center text-muted-foreground text-sm'
														errorDiv.textContent = 'Недоступно'
														parent.appendChild(errorDiv)
													}
												}}
											/>
											<div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors' />
											<div className='absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
												<Button
													size='icon'
													variant='secondary'
													className='h-8 w-8 bg-background/90 backdrop-blur-sm'
													onClick={() => copyToClipboard(imageUrl)}
													title='Копировать ссылку'
												>
													{copiedUrl === imageUrl ? (
														<Check className='h-4 w-4 text-green-500' />
													) : (
														<Copy className='h-4 w-4' />
													)}
												</Button>
												<Button
													size='icon'
													variant='secondary'
													className='h-8 w-8 bg-background/90 backdrop-blur-sm'
													onClick={() =>
														downloadImage(imageUrl, `${videoId}-alt${num}.jpg`)
													}
													title='Скачать'
												>
													<Download className='h-4 w-4' />
												</Button>
											</div>
										</div>
										<div className='p-3'>
											<div className='flex items-center justify-between'>
												<h3 className='font-medium text-sm'>Миниатюра {num}</h3>
												<span className='text-xs text-muted-foreground'>
													Alternative
												</span>
											</div>
										</div>
									</Card>
								)
							})}
						</div>
					</div>
				</>
			)}
		</>
	)
}

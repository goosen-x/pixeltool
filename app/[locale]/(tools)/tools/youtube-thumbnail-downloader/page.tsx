'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Copy, Check, Download, Youtube } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

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
	const t = useTranslations('widgets.youtubeThumbnail')
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

		setError(t('errors.invalid'))
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
			toast.success(t('toast.copied'))
		} catch (err) {
			toast.error(t('toast.copyError'))
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
			toast.success(t('toast.downloaded'))
		} catch (error) {
			console.error('Download failed:', error)
			toast.error(t('toast.downloadError'))
		}
	}

	const exampleUrls = [
		'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
		'https://youtu.be/dQw4w9WgXcQ',
		'dQw4w9WgXcQ'
	]

	return (
		<>
			<Card className="p-6 mb-6">
				<Label htmlFor="youtube-url" className="text-base font-semibold mb-2 block">
					{t('inputLabel')}
				</Label>
				<div className="flex gap-2">
					<Input
						id="youtube-url"
						type="text"
						value={url}
						onChange={(e) => handleUrlChange(e.target.value)}
						placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
						className="flex-1"
					/>
					<Button
						variant="outline"
						onClick={() => handleUrlChange(exampleUrls[0])}
					>
						{t('example')}
					</Button>
				</div>
				{error && (
					<p className="text-sm text-destructive mt-2">{error}</p>
				)}
				<div className="mt-3 space-y-1">
					<p className="text-sm text-muted-foreground">{t('supportedFormats')}</p>
					<ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
						{exampleUrls.map((example, index) => (
							<li key={index}>
								<code className="inline-code">
									{example}
								</code>
							</li>
						))}
					</ul>
				</div>
			</Card>

			{videoId && (
				<>
					<div className="mb-6">
						<Card className="p-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Youtube className="w-5 h-5 text-red-500" />
									<span className="font-medium">{t('videoId')}</span>
									<code className="inline-code">
										{videoId}
									</code>
								</div>
								<Button
									size="sm"
									variant="outline"
									onClick={() => copyToClipboard(videoId)}
									className="hover:bg-accent hover:text-white"
								>
									{copiedUrl === videoId ? (
										<Check className="h-4 w-4 text-green-500" />
									) : (
										<Copy className="h-4 w-4" />
									)}
								</Button>
							</div>
						</Card>
					</div>

					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{thumbnailTypes.map((type) => {
							const imageUrl = type.getUrl(videoId)
							const nameKey = `resolution.${type.quality === 'maxresdefault' ? 'max' : type.quality === 'sddefault' ? 'standard' : type.quality === 'hqdefault' ? 'high' : type.quality === 'mqdefault' ? 'medium' : 'default'}`
							return (
								<Card key={type.quality} className="overflow-hidden">
									<div className="relative aspect-video bg-muted">
										<Image
											src={imageUrl}
											alt={`${t(nameKey)} thumbnail`}
											fill
											className="object-cover"
											unoptimized
											onError={(e) => {
												const target = e.target as HTMLImageElement
												target.style.display = 'none'
												const parent = target.parentElement
												if (parent) {
													const errorDiv = document.createElement('div')
													errorDiv.className = 'absolute inset-0 flex items-center justify-center text-muted-foreground'
													errorDiv.textContent = t('notAvailable')
													parent.appendChild(errorDiv)
												}
											}}
										/>
									</div>
									<div className="p-4">
										<h3 className="font-semibold">{t(nameKey)}</h3>
										<p className="text-sm text-muted-foreground mb-3">
											{type.width} × {type.height}
										</p>
										<div className="flex gap-2">
											<Button
												size="sm"
												variant="outline"
												className="flex-1 hover:bg-accent hover:text-white"
												onClick={() => copyToClipboard(imageUrl)}
											>
												{copiedUrl === imageUrl ? (
													<Check className="h-4 w-4 text-green-500" />
												) : (
													<Copy className="h-4 w-4" />
												)}
												<span className="ml-1">{t('copyUrl')}</span>
											</Button>
											<Button
												size="sm"
												variant="outline"
												onClick={() => downloadImage(imageUrl, `${videoId}-${type.quality}.jpg`)}
											>
												<Download className="h-4 w-4" />
											</Button>
										</div>
									</div>
								</Card>
							)
						})}
					</div>

					<Card className="mt-6 p-6">
						<h3 className="font-semibold mb-4">{t('alternativeUrls')}</h3>
						<div className="space-y-3">
							<div>
								<p className="text-sm font-medium mb-1">{t('thumbnail')} 1:</p>
								<code className="inline-code block overflow-x-auto">
									{`https://img.youtube.com/vi/${videoId}/1.jpg`}
								</code>
							</div>
							<div>
								<p className="text-sm font-medium mb-1">{t('thumbnail')} 2:</p>
								<code className="inline-code block overflow-x-auto">
									{`https://img.youtube.com/vi/${videoId}/2.jpg`}
								</code>
							</div>
							<div>
								<p className="text-sm font-medium mb-1">{t('thumbnail')} 3:</p>
								<code className="inline-code block overflow-x-auto">
									{`https://img.youtube.com/vi/${videoId}/3.jpg`}
								</code>
							</div>
						</div>
					</Card>
				</>
			)}
		</>
	)
}
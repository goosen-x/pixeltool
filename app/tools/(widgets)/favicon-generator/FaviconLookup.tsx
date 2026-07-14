'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Download, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

/** По умолчанию показываем свой сайт — так сразу видно, что инструмент делает. */
const DEFAULT_SITE = 'pixeltool.pro'

interface FoundIcon {
	url: string
	rel: string
	sizes: string | null
	contentType: string | null
	bytes: number | null
	reachable: boolean
}

interface LookupResult {
	site: string
	title: string
	icons: FoundIcon[]
}

export function FaviconLookup() {
	const [site, setSite] = useState(DEFAULT_SITE)
	const [result, setResult] = useState<LookupResult | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	const lookup = async () => {
		const trimmed = site.trim()
		if (!trimmed) {
			toast.error('Введите адрес сайта')
			return
		}

		setIsLoading(true)
		setResult(null)

		try {
			const response = await fetch(
				`/api/favicon-lookup?url=${encodeURIComponent(trimmed)}`
			)
			const data = await response.json()

			if (!response.ok) {
				toast.error(data.error ?? 'Не удалось найти фавикон')
				return
			}

			setResult(data as LookupResult)

			const found = (data.icons as FoundIcon[]).filter(icon => icon.reachable)
			if (found.length === 0) {
				toast.warning('Фавикон не найден — сайт его не объявил и /favicon.ico пуст')
			} else {
				toast.success(`Найдено иконок: ${found.length}`)
			}
		} catch {
			toast.error('Не удалось связаться с сайтом')
		} finally {
			setIsLoading(false)
		}
	}

	const download = async (icon: FoundIcon) => {
		try {
			const response = await fetch(icon.url)
			const blob = await response.blob()
			const url = URL.createObjectURL(blob)
			const link = document.createElement('a')
			link.href = url
			link.download = icon.url.split('/').pop()?.split('?')[0] || 'favicon'
			link.click()
			URL.revokeObjectURL(url)
		} catch {
			toast.error('Файл не скачался — сайт мог запретить прямой доступ')
		}
	}

	const formatSize = (bytes: number | null) =>
		bytes === null ? '' : bytes < 1024 ? `${bytes} Б` : `${Math.round(bytes / 1024)} КБ`

	return (
		<div className='space-y-4'>
			<div>
				<h3 className='text-sm font-medium'>Найти фавикон чужого сайта</h3>
				<p className='mt-1 text-xs text-muted-foreground'>
					Введите адрес — покажем, какие иконки объявлены в разметке и лежит ли
					что-то по стандартному пути /favicon.ico.
				</p>
			</div>

			<div className='flex gap-2'>
				<Input
					value={site}
					onChange={event => setSite(event.target.value)}
					onKeyDown={event => event.key === 'Enter' && lookup()}
					placeholder='example.com'
					aria-label='Адрес сайта для поиска фавикона'
				/>
				<Button
					onClick={lookup}
					disabled={isLoading}
					className='shrink-0 cursor-pointer'
				>
					<Search className='mr-2 h-4 w-4' />
					{isLoading ? 'Ищем…' : 'Найти'}
				</Button>
			</div>

			{result && (
				<div className='space-y-2'>
					{result.title && (
						<p className='text-xs text-muted-foreground'>
							{result.title} — {result.icons.filter(i => i.reachable).length} из{' '}
							{result.icons.length} иконок доступны
						</p>
					)}

					{result.icons.map(icon => (
						<div
							key={icon.url}
							className='flex items-center gap-3 rounded-lg border bg-muted/30 p-3'
						>
							{icon.reachable ? (
								// Чужой домен — Image с оптимизацией сюда не подходит.
								// eslint-disable-next-line @next/next/no-img-element
								<img
									src={icon.url}
									alt=''
									className='h-8 w-8 shrink-0 object-contain'
								/>
							) : (
								<div className='h-8 w-8 shrink-0 rounded bg-muted' />
							)}

							<div className='min-w-0 flex-1'>
								<div className='flex flex-wrap items-center gap-1.5'>
									<Badge variant='outline' className='text-xs'>
										{icon.rel}
									</Badge>
									{icon.sizes && (
										<Badge variant='outline' className='text-xs'>
											{icon.sizes}
										</Badge>
									)}
									{!icon.reachable && (
										<Badge variant='destructive' className='text-xs'>
											не открывается
										</Badge>
									)}
									{icon.bytes !== null && (
										<span className='text-xs text-muted-foreground'>
											{formatSize(icon.bytes)}
										</span>
									)}
								</div>
								<p className='mt-1 truncate text-xs text-muted-foreground'>
									{icon.url}
								</p>
							</div>

							{icon.reachable && (
								<div className='flex shrink-0 gap-1'>
									<Button
										size='sm'
										variant='outline'
										className='cursor-pointer'
										onClick={() => download(icon)}
										title='Скачать'
									>
										<Download className='h-3 w-3' />
									</Button>
									<Button
										size='sm'
										variant='outline'
										className='cursor-pointer'
										asChild
									>
										<a
											href={icon.url}
											target='_blank'
											rel='noopener noreferrer'
											title='Открыть в новой вкладке'
										>
											<ExternalLink className='h-3 w-3' />
										</a>
									</Button>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	)
}

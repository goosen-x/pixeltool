'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover'
import { Star, Clock, Share2, Link2, Check } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { getWidgetById, type Widget } from '@/lib/constants/widgets'
import { useToolHistory } from '@/lib/hooks/useToolHistory'

interface Props {
	widget: Widget
}

function ToolRow({
	id,
	starred,
	onToggle
}: {
	id: string
	starred: boolean
	onToggle: (id: string) => void
}) {
	const widget = getWidgetById(id)
	if (!widget) return null

	return (
		<li className='flex items-center gap-1'>
			<Link
				href={`/tools/${widget.path}`}
				className='flex-1 cursor-pointer truncate rounded px-2 py-1.5 text-sm transition-colors hover:bg-muted'
			>
				{widget.title || widget.id}
			</Link>
			<Button
				variant='ghost'
				size='icon'
				className='h-7 w-7 shrink-0 cursor-pointer'
				onClick={() => onToggle(id)}
				aria-label={starred ? 'Убрать из избранного' : 'Добавить в избранное'}
				aria-pressed={starred}
			>
				<Star
					className={cn(
						'h-3.5 w-3.5',
						starred ? 'fill-current text-amber-500' : 'text-muted-foreground'
					)}
				/>
			</Button>
		</li>
	)
}

// Иконки соцсетей в lucide отсутствуют — рисуем свои, чтобы не тащить пакет
function TelegramIcon({ className }: { className?: string }) {
	return (
		<svg viewBox='0 0 24 24' fill='currentColor' className={className}>
			<path d='M21.94 4.6l-3.02 14.25c-.23 1.01-.83 1.26-1.68.78l-4.65-3.43-2.24 2.16c-.25.25-.46.46-.94.46l.33-4.74 8.63-7.8c.38-.33-.08-.52-.58-.19L7.13 12.9l-4.6-1.44c-1-.31-1.02-1 .21-1.48l17.97-6.93c.83-.3 1.56.2 1.23 1.55z' />
		</svg>
	)
}

function VkIcon({ className }: { className?: string }) {
	return (
		<svg viewBox='0 0 24 24' fill='currentColor' className={className}>
			<path d='M12.79 16.95c-5.32 0-8.5-3.68-8.62-9.79h2.68c.09 4.49 2.1 6.4 3.67 6.79V7.16h2.54v3.86c1.55-.17 3.17-1.94 3.72-3.86h2.52a7.44 7.44 0 01-3.42 4.87 7.7 7.7 0 013.99 4.92h-2.77c-.63-1.96-2.12-3.48-4.04-3.68v3.68h-.27z' />
		</svg>
	)
}

function WhatsappIcon({ className }: { className?: string }) {
	return (
		<svg viewBox='0 0 24 24' fill='currentColor' className={className}>
			<path d='M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 01-4.79-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.36 9.36 0 01-1.44-5.01c0-5.18 4.22-9.4 9.42-9.4 2.51 0 4.88.98 6.65 2.76a9.35 9.35 0 012.75 6.65c0 5.18-4.22 9.41-9.41 9.41zM20.52 3.49A11.78 11.78 0 0012.05 0C5.5 0 .17 5.33.16 11.88c0 2.1.55 4.14 1.6 5.95L.06 24l6.31-1.65a11.9 11.9 0 005.68 1.45h.01c6.55 0 11.88-5.33 11.89-11.88a11.8 11.8 0 00-3.43-8.43z' />
		</svg>
	)
}

export function RecentToolsCard({ widget }: Props) {
	const { recent, favorites, ready, toggleFavorite, isFavorite } =
		useToolHistory(widget.id)
	const [copied, setCopied] = useState(false)

	const copyLink = () => {
		navigator.clipboard.writeText(window.location.href)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
		toast.success('Ссылка скопирована')
	}

	// Окно соцсети открываем на клик, из обработчика — так его не режет
	// блокировщик всплывающих окон
	const shareTo = (network: 'telegram' | 'vk' | 'whatsapp') => {
		const url = encodeURIComponent(window.location.href)
		const text = encodeURIComponent(widget.title || document.title)

		const links = {
			telegram: `https://t.me/share/url?url=${url}&text=${text}`,
			vk: `https://vk.com/share.php?url=${url}&title=${text}`,
			whatsapp: `https://api.whatsapp.com/send?text=${text}%20${url}`
		}

		window.open(links[network], '_blank', 'noopener,noreferrer')
	}

	// До монтирования localStorage недоступен — карточка появляется после него
	const hasContent = ready && (favorites.length > 0 || recent.length > 0)

	return (
		<Card>
			<CardHeader className='pb-3'>
				<CardTitle className='flex items-center gap-2 text-sm'>
					<Clock className='h-4 w-4' />
					Ваши инструменты
				</CardTitle>
			</CardHeader>
			<CardContent className='space-y-4'>
				{!hasContent ? (
					<p className='text-xs text-muted-foreground'>
						Отметьте инструмент звёздочкой — он закрепится здесь. Недавно
						открытые появятся сами.
					</p>
				) : (
					<>
						{favorites.length > 0 && (
							<div className='space-y-1'>
								<p className='px-2 text-xs font-medium text-muted-foreground'>
									Избранное
								</p>
								<ul className='space-y-0.5'>
									{favorites.map(id => (
										<ToolRow
											key={id}
											id={id}
											starred
											onToggle={toggleFavorite}
										/>
									))}
								</ul>
							</div>
						)}

						{recent.filter(id => !isFavorite(id)).length > 0 && (
							<div className='space-y-1'>
								<p className='px-2 text-xs font-medium text-muted-foreground'>
									Недавние
								</p>
								<ul className='space-y-0.5'>
									{recent
										.filter(id => !isFavorite(id))
										.map(id => (
											<ToolRow
												key={id}
												id={id}
												starred={false}
												onToggle={toggleFavorite}
											/>
										))}
								</ul>
							</div>
						)}
					</>
				)}

				<div className='flex items-center gap-1 border-t pt-3'>
					<Button
						variant='ghost'
						size='sm'
						className='h-8 cursor-pointer gap-2 text-xs'
						onClick={() => toggleFavorite(widget.id)}
					>
						<Star
							className={cn(
								'h-3.5 w-3.5',
								isFavorite(widget.id)
									? 'fill-current text-amber-500'
									: 'text-muted-foreground'
							)}
						/>
						{isFavorite(widget.id) ? 'В избранном' : 'В избранное'}
					</Button>

					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant='ghost'
								size='sm'
								className='ml-auto h-8 cursor-pointer gap-2 text-xs'
							>
								<Share2 className='h-3.5 w-3.5' />
								Поделиться
							</Button>
						</PopoverTrigger>
						<PopoverContent align='end' className='w-52 p-1.5'>
							<button
								onClick={() => shareTo('telegram')}
								className='flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors hover:bg-muted'
							>
								<TelegramIcon className='h-4 w-4 text-[#26A5E4]' />
								Telegram
							</button>
							<button
								onClick={() => shareTo('whatsapp')}
								className='flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors hover:bg-muted'
							>
								<WhatsappIcon className='h-4 w-4 text-[#25D366]' />
								WhatsApp
							</button>
							<button
								onClick={() => shareTo('vk')}
								className='flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors hover:bg-muted'
							>
								<VkIcon className='h-4 w-4 text-[#0077FF]' />
								ВКонтакте
							</button>

							<div className='my-1 border-t' />

							<button
								onClick={copyLink}
								className='flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors hover:bg-muted'
							>
								{copied ? (
									<Check className='h-4 w-4 text-green-600' />
								) : (
									<Link2 className='h-4 w-4 text-muted-foreground' />
								)}
								{copied ? 'Скопировано' : 'Копировать ссылку'}
							</button>
						</PopoverContent>
					</Popover>
				</div>
			</CardContent>
		</Card>
	)
}

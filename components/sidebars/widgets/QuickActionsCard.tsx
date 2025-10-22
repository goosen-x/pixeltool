'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Share2, Link2, Heart } from 'lucide-react'
import { toast } from 'sonner'

export function QuickActionsCard() {
	const handleShare = async () => {
		const url = window.location.href

		// Проверяем поддержку Web Share API
		if (navigator.share) {
			try {
				await navigator.share({
					title: document.title,
					url: url
				})
				toast.success('Спасибо за распространение!')
			} catch (error) {
				// Пользователь отменил - не показываем ошибку
				if ((error as Error).name !== 'AbortError') {
					// Fallback к копированию
					handleCopyLink(url)
				}
			}
		} else {
			// Fallback к копированию
			handleCopyLink(url)
		}
	}

	const handleCopyLink = (url: string) => {
		navigator.clipboard.writeText(url)
		toast.success('Ссылка скопирована')
	}

	return (
		<Card>
			<CardHeader className='pb-3'>
				<CardTitle className='text-sm flex items-center gap-2'>
					<Share2 className='w-4 h-4' />
					Быстрые действия
				</CardTitle>
			</CardHeader>
			<CardContent className='space-y-2'>
				<Button
					variant='outline'
					size='sm'
					className='w-full justify-start text-xs lg:text-sm'
					onClick={handleShare}
				>
					<Share2 className='w-3 h-3 lg:w-4 lg:h-4 mr-2 flex-shrink-0' />
					<span className='truncate'>Поделиться</span>
				</Button>

				<Button
					variant='outline'
					size='sm'
					className='w-full justify-start text-xs lg:text-sm'
					onClick={() => handleCopyLink(window.location.href)}
				>
					<Link2 className='w-3 h-3 lg:w-4 lg:h-4 mr-2 flex-shrink-0' />
					<span className='truncate'>Копировать ссылку</span>
				</Button>
			</CardContent>
		</Card>
	)
}

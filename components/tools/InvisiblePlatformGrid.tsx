'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import type { IconType } from 'react-icons'
import {
	SiApple,
	SiDiscord,
	SiInstagram,
	SiRoblox,
	SiSteam,
	SiTelegram,
	SiTiktok,
	SiVk,
	SiWhatsapp,
	SiX
} from 'react-icons/si'
import { Ban, Check, Copy } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { FeedbackModal } from '@/components/feedback/FeedbackModal'
import {
	invisiblePlatforms,
	getInvisibleChar,
	invisibleCharacters
} from '@/lib/data/invisible-characters'

// Официальный логотип PUBG Mobile сложнее плоской монохромной марки simple
// icons (это экспорт из Illustrator, ~34 КБ путей даже после svgo) — держим
// файлом в /public, а не инлайним, и красим через dark:invert, раз
// currentColor тут недоступен (SVG грузится как <img>, не как разметка).
function PubgMobileIcon({ className }: { className?: string }) {
	return (
		<img
			src='/icons/pubg-mobile.svg'
			alt=''
			className={`${className ?? ''} dark:invert`}
		/>
	)
}

/**
 * Иконки держим здесь, а не в данных: файл с символами описывает факты о
 * юникоде и не должен тянуть за собой React.
 */
const ICONS: Record<string, IconType | typeof PubgMobileIcon> = {
	telegram: SiTelegram,
	discord: SiDiscord,
	steam: SiSteam,
	roblox: SiRoblox,
	pubg: PubgMobileIcon,
	instagram: SiInstagram,
	whatsapp: SiWhatsapp,
	ios: SiApple,
	vk: SiVk,
	tiktok: SiTiktok,
	x: SiX
}

export function InvisiblePlatformGrid() {
	const [copiedId, setCopiedId] = useState<string | null>(null)

	const copyFor = async (
		platformId: string,
		charId: string,
		platformName: string,
		charName: string
	) => {
		const char = getInvisibleChar(charId)
		if (!char) return

		// Символ невидим, поэтому в тосте называем его и площадку: пустое
		// уведомление выглядело бы поломкой (см. коммит 9f0ee46 выше по списку).
		try {
			await navigator.clipboard.writeText(char)
			setCopiedId(platformId)
			setTimeout(() => setCopiedId(null), 2000)
			toast.success(`${platformName}: скопирован ${charName}`)
		} catch {
			toast.error('Не удалось скопировать символ')
		}
	}

	return (
		<Card className='mt-6 overflow-hidden p-0'>
			<div className='border-b bg-muted/30 px-5 py-3 sm:px-6'>
				<p className='text-sm text-muted-foreground'>
					Площадки периодически закрывают лазейки с невидимыми символами,
					поэтому список быстро устаревает. Нашли рабочий символ —{' '}
					<FeedbackModal
						defaultType='feature'
						trigger={
							<button
								type='button'
								className='cursor-pointer text-primary hover:underline'
							>
								напишите нам
							</button>
						}
					/>
				</p>
			</div>

			<div className='grid gap-px bg-border sm:grid-cols-2'>
				{invisiblePlatforms.map(platform => {
					const Icon = ICONS[platform.id]
					const char = invisibleCharacters.find(c => c.id === platform.charId)
					const copied = copiedId === platform.id
					const blocked = !platform.charId

					// Площадка без символа копировать нечего, поэтому строка перестаёт
					// быть кнопкой: рисуем её же разметку обычным блоком.
					const Row = blocked ? 'div' : 'button'

					return (
						<Row
							key={platform.id}
							{...(blocked
								? {}
								: {
										type: 'button' as const,
										onClick: () =>
											copyFor(
												platform.id,
												platform.charId as string,
												platform.name,
												char?.name ?? 'символ'
											),
										title: `Скопировать символ для ${platform.name}`
									})}
							className={
								blocked
									? 'flex items-center gap-4 bg-background px-5 py-4 text-left sm:px-6'
									: 'group flex cursor-pointer items-center gap-4 bg-background px-5 py-4 text-left transition-colors hover:bg-muted/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset sm:px-6'
							}
						>
							{Icon ? (
								<Icon
									className='h-6 w-6 shrink-0 text-muted-foreground group-hover:text-foreground'
									aria-hidden
								/>
							) : null}

							<span className='min-w-0 flex-1'>
								<span className='font-medium text-foreground'>
									{platform.name}
								</span>

								<span className='mt-0.5 block text-xs text-muted-foreground'>
									{blocked
										? 'заблокировано разработчиками'
										: `${char?.name} ${char?.codepoint}`}
								</span>
							</span>

							<span className='shrink-0 text-muted-foreground group-hover:text-foreground'>
								{blocked ? (
									<Ban className='h-4 w-4' />
								) : copied ? (
									<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
								) : (
									<Copy className='h-4 w-4' />
								)}
							</span>
						</Row>
					)
				})}
			</div>
		</Card>
	)
}

'use client'

import { useState } from 'react'
import type { IconType } from 'react-icons'
import {
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
import { Apple, Check, Copy, Gamepad2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import {
	invisiblePlatforms,
	getInvisibleChar,
	invisibleCharacters
} from '@/lib/data/invisible-characters'

/**
 * Иконки держим здесь, а не в данных: файл с символами описывает факты о
 * юникоде и не должен тянуть за собой React. Для PUBG и Free Fire у simple
 * icons нет годных марок, поэтому джойстик из lucide как нейтральная замена.
 */
const ICONS: Record<string, IconType | typeof Apple> = {
	telegram: SiTelegram,
	discord: SiDiscord,
	steam: SiSteam,
	roblox: SiRoblox,
	pubg: Gamepad2,
	freefire: Gamepad2,
	instagram: SiInstagram,
	whatsapp: SiWhatsapp,
	ios: Apple,
	vk: SiVk,
	tiktok: SiTiktok,
	x: SiX
}

const CONFIDENCE_LABEL: Record<string, string> = {
	verified: 'проверено вручную',
	sources: 'по источникам',
	thin: 'данных мало'
}

export function InvisiblePlatformGrid() {
	const [copiedId, setCopiedId] = useState<string | null>(null)

	const copyFor = async (platformId: string, charId: string) => {
		const char = getInvisibleChar(charId)
		if (!char) return

		await navigator.clipboard.writeText(char)
		setCopiedId(platformId)
		setTimeout(() => setCopiedId(null), 2000)
	}

	return (
		<Card className='mt-6 overflow-hidden p-0'>
			<div className='border-b bg-muted/30 px-5 py-3 sm:px-6'>
				<h2 className='font-medium text-foreground'>Символ под площадку</h2>
				<p className='mt-0.5 text-sm text-muted-foreground'>
					Кнопка копирует тот символ, который на этой площадке проходит чаще
					остальных. Если не сохранилось, пробуйте соседние из списка выше.
				</p>
			</div>

			<div className='grid gap-px bg-border sm:grid-cols-2'>
				{invisiblePlatforms.map(platform => {
					const Icon = ICONS[platform.id]
					const char = invisibleCharacters.find(c => c.id === platform.charId)
					const copied = copiedId === platform.id

					return (
						<button
							key={platform.id}
							type='button'
							onClick={() => copyFor(platform.id, platform.charId)}
							title={`Скопировать символ для ${platform.name}`}
							className='group flex cursor-pointer items-center gap-4 bg-background px-5 py-4 text-left transition-colors hover:bg-muted/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset sm:px-6'
						>
							{Icon ? (
								<Icon
									className='h-6 w-6 shrink-0 text-muted-foreground group-hover:text-foreground'
									aria-hidden
								/>
							) : null}

							<span className='min-w-0 flex-1'>
								<span className='flex flex-wrap items-center gap-x-2 gap-y-0.5'>
									<span className='font-medium text-foreground'>
										{platform.name}
									</span>
									<span className='text-xs text-muted-foreground'>
										{platform.field}
									</span>
								</span>

								<span className='mt-0.5 block text-xs text-muted-foreground'>
									{char?.name} {char?.codepoint}
									{' · '}
									{CONFIDENCE_LABEL[platform.confidence]}
								</span>

								{platform.caveat ? (
									<span className='mt-1 block text-xs text-muted-foreground/80'>
										{platform.caveat}
									</span>
								) : null}
							</span>

							<span className='shrink-0 text-muted-foreground group-hover:text-foreground'>
								{copied ? (
									<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
								) : (
									<Copy className='h-4 w-4' />
								)}
							</span>
						</button>
					)
				})}
			</div>
		</Card>
	)
}

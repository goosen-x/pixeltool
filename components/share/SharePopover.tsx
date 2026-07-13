'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover'
import { Share2, Link2, Check } from 'lucide-react'
import { toast } from 'sonner'

// Иконок соцсетей в lucide нет — пути из Simple Icons (официальные логотипы)
function TelegramIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox='0 0 24 24'
			fill='currentColor'
			className={className}
			aria-hidden
		>
			<path d='M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z' />
		</svg>
	)
}

function VkIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox='0 0 24 24'
			fill='currentColor'
			className={className}
			aria-hidden
		>
			<path d='m9.489.004.729-.003h3.564l.73.003.914.01.433.007.418.011.403.014.388.016.374.021.36.025.345.03.333.033c1.74.196 2.933.616 3.833 1.516.9.9 1.32 2.092 1.516 3.833l.034.333.029.346.025.36.02.373.025.588.012.41.013.644.009.915.004.98-.001 3.313-.003.73-.01.914-.007.433-.011.418-.014.403-.016.388-.021.374-.025.36-.03.345-.033.333c-.196 1.74-.616 2.933-1.516 3.833-.9.9-2.092 1.32-3.833 1.516l-.333.034-.346.029-.36.025-.373.02-.588.025-.41.012-.644.013-.915.009-.98.004-3.313-.001-.73-.003-.914-.01-.433-.007-.418-.011-.403-.014-.388-.016-.374-.021-.36-.025-.345-.03-.333-.033c-1.74-.196-2.933-.616-3.833-1.516-.9-.9-1.32-2.092-1.516-3.833l-.034-.333-.029-.346-.025-.36-.02-.373-.025-.588-.012-.41-.013-.644-.009-.915-.004-.98.001-3.313.003-.73.01-.914.007-.433.011-.418.014-.403.016-.388.021-.374.025-.36.03-.345.033-.333c.196-1.74.616-2.933 1.516-3.833.9-.9 2.092-1.32 3.833-1.516l.333-.034.346-.029.36-.025.373-.02.588-.025.41-.012.644-.013.915-.009ZM6.79 7.3H4.05c.13 6.24 3.25 9.99 8.72 9.99h.31v-3.57c2.01.2 3.53 1.67 4.14 3.57h2.84c-.78-2.84-2.83-4.41-4.11-5.01 1.28-.74 3.08-2.54 3.51-4.98h-2.58c-.56 1.98-2.22 3.78-3.8 3.95V7.3H10.5v6.92c-1.6-.4-3.62-2.34-3.71-6.92Z' />
		</svg>
	)
}

function WhatsappIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox='0 0 24 24'
			fill='currentColor'
			className={className}
			aria-hidden
		>
			<path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488' />
		</svg>
	)
}

interface Props {
	/** Что подставить в текст репоста. По умолчанию — заголовок страницы */
	title?: string
	/** Компактный вид: только иконка, без подписи */
	iconOnly?: boolean
}

export function SharePopover({ title, iconOnly = false }: Props) {
	const [copied, setCopied] = useState(false)

	const copyLink = () => {
		navigator.clipboard.writeText(window.location.href)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
		toast.success('Ссылка скопирована')
	}

	// Окно соцсети открываем прямо из обработчика клика, иначе его режет
	// блокировщик всплывающих окон
	const shareTo = (network: 'telegram' | 'vk' | 'whatsapp') => {
		const url = encodeURIComponent(window.location.href)
		const text = encodeURIComponent(title || document.title)

		const links = {
			telegram: `https://t.me/share/url?url=${url}&text=${text}`,
			vk: `https://vk.com/share.php?url=${url}&title=${text}`,
			whatsapp: `https://api.whatsapp.com/send?text=${text}%20${url}`
		}

		window.open(links[network], '_blank', 'noopener,noreferrer')
	}

	const item =
		'flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors hover:bg-muted'

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					size='sm'
					className='cursor-pointer gap-2'
					aria-label='Поделиться'
				>
					<Share2 className='h-4 w-4' />
					{!iconOnly && 'Поделиться'}
				</Button>
			</PopoverTrigger>
			<PopoverContent align='end' className='w-52 p-1.5'>
				<button onClick={() => shareTo('telegram')} className={item}>
					<TelegramIcon className='h-4 w-4 text-[#26A5E4]' />
					Telegram
				</button>
				<button onClick={() => shareTo('whatsapp')} className={item}>
					<WhatsappIcon className='h-4 w-4 text-[#25D366]' />
					WhatsApp
				</button>
				<button onClick={() => shareTo('vk')} className={item}>
					<VkIcon className='h-4 w-4 text-[#0077FF]' />
					ВКонтакте
				</button>

				<div className='my-1 border-t' />

				<button onClick={copyLink} className={item}>
					{copied ? (
						<Check className='h-4 w-4 text-green-600' />
					) : (
						<Link2 className='h-4 w-4 text-muted-foreground' />
					)}
					{copied ? 'Скопировано' : 'Копировать ссылку'}
				</button>
			</PopoverContent>
		</Popover>
	)
}

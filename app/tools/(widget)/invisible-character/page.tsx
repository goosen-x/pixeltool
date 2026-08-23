'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { invisibleCharacters } from '@/lib/data/invisible-characters'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { InvisibleCharacterSeo } from './InvisibleCharacterSeo'

export default function InvisibleCharacterPage() {
	const widget = getWidgetById('invisible-character')!
	const [copiedId, setCopiedId] = useState<string | null>(null)

	// Символ невидим, поэтому в отличие от других тулов тост показывает не
	// сам скопированный символ, а его название — иначе уведомление выглядело
	// бы пустым.
	const copyChar = async (id: string, char: string, name: string) => {
		try {
			await navigator.clipboard.writeText(char)
			setCopiedId(id)
			toast.success(`Скопировано: ${name}`)
			setTimeout(() => setCopiedId(null), 2000)
		} catch {
			toast.error('Не удалось скопировать символ')
		}
	}

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className='grid gap-px border-b bg-border sm:grid-cols-2'>
					{invisibleCharacters.map(item => (
						<button
							key={item.id}
							type='button'
							onClick={() => copyChar(item.id, item.char, item.name)}
							title='Скопировать'
							className='group flex cursor-pointer items-start gap-4 bg-background px-5 py-4 text-left transition-colors hover:bg-muted/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset sm:px-6'
						>
							{/* Символ невидим — рамка нужна, чтобы было видно, что именно
							    попадёт в буфер обмена. */}
							<span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-dashed bg-muted/50 font-mono text-sm text-muted-foreground'>
								{item.char}
							</span>

							<span className='min-w-0 flex-1'>
								<span className='flex items-center gap-2'>
									<span className='font-medium text-foreground'>
										{item.name}
									</span>
									<span className='font-mono text-xs text-muted-foreground'>
										{item.codepoint}
									</span>
								</span>
								<span className='mt-0.5 block text-xs text-muted-foreground'>
									Подходит: {item.worksWell}
								</span>
								<span className='mt-1 block text-sm text-muted-foreground'>
									{item.note}
								</span>
							</span>

							<span className='mt-1 shrink-0 text-muted-foreground group-hover:text-foreground'>
								{copiedId === item.id ? (
									<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
								) : (
									<Copy className='h-4 w-4' />
								)}
							</span>
						</button>
					))}
				</div>
			</Card>

			<InvisibleCharacterSeo />
		</WidgetSEOWrapper>
	)
}

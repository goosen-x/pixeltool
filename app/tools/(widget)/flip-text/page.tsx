'use client'

import { useMemo, useState } from 'react'
import { Check, Copy, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import { flipUpsideDown, reverseText } from '@/lib/utils/flip-text'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { FlipTextSeo } from './FlipTextSeo'

type Mode = 'upsideDown' | 'reverse'

export default function FlipTextPage() {
	const widget = getWidgetById('flip-text')!

	const [mode, setMode] = useState<Mode>('upsideDown')
	const [input, setInput] = useState('')
	const [copied, setCopied] = useState(false)

	const result = useMemo(() => {
		if (!input) return ''
		return mode === 'upsideDown' ? flipUpsideDown(input) : reverseText(input)
	}, [input, mode])

	const copyResult = async () => {
		if (!result) return
		await navigator.clipboard.writeText(result)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				{/* Шапка: режим слева, действия справа. */}
				<div className={toolBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						{(
							[
								['upsideDown', 'Вверх ногами'],
								['reverse', 'Задом наперёд']
							] as [Mode, string][]
						).map(([value, label]) => (
							<button
								key={value}
								type='button'
								onClick={() => setMode(value)}
								aria-pressed={mode === value}
								className={toolPill(mode === value)}
							>
								{label}
							</button>
						))}
					</div>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={copyResult}
							disabled={!result}
							title='Скопировать результат'
							className={toolIconButton}
						>
							{copied ? (
								<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
							) : (
								<Copy className='h-4 w-4' />
							)}
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => setInput('')}
							disabled={!input}
							title='Очистить'
							className={toolIconButton}
						>
							<Trash2 className='h-4 w-4' />
						</Button>
					</div>
				</div>

				{/* Рабочая область: ввод слева, результат справа. */}
				<div className='grid md:grid-cols-2'>
					<Textarea
						value={input}
						onChange={event => setInput(event.target.value)}
						placeholder='Введите текст'
						spellCheck={false}
						aria-label='Исходный текст'
						className='min-h-[10rem] resize-none rounded-none border-0 px-5 py-6 text-base focus-visible:ring-0 sm:px-6 md:border-r md:text-sm'
					/>

					{result ? (
						<p className='min-h-[10rem] overflow-auto px-5 py-6 text-lg break-words sm:px-6'>
							{result}
						</p>
					) : (
						<p className='flex min-h-[10rem] items-center justify-center px-5 text-center text-sm text-muted-foreground'>
							Результат появится здесь
						</p>
					)}
				</div>

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						{mode === 'upsideDown'
							? 'Кириллица переворачивается только по порядку символов — своих юникод-глифов у неё нет'
							: 'Просто обратный порядок символов, без замены глифов'}
					</span>
				</div>
			</Card>

			<FlipTextSeo />
		</WidgetSEOWrapper>
	)
}

'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Check, Copy } from 'lucide-react'

interface CopySymbolInlineProps {
	char: string
	codepoint: string
	name: string
	label: string
}

export function CopySymbolInline({
	char,
	codepoint,
	name,
	label
}: CopySymbolInlineProps) {
	const [copied, setCopied] = useState(false)

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(char)
			setCopied(true)
			toast.success(`Скопировано: ${name} (${codepoint})`)
			window.setTimeout(() => setCopied(false), 2000)
		} catch {
			toast.error('Не удалось скопировать символ')
		}
	}

	return (
		<button
			type='button'
			onClick={copy}
			className='not-prose my-6 flex w-full cursor-pointer flex-col gap-3 rounded-xl border bg-muted/30 px-5 py-4 text-left transition-colors hover:border-primary/40 hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-row sm:items-center sm:gap-4'
		>
			<span className='flex min-w-0 flex-1 items-center gap-4'>
				<span
					aria-hidden
					className='flex h-11 w-16 flex-shrink-0 items-center justify-center rounded-lg border bg-background font-mono text-xs text-muted-foreground'
				>
					{codepoint}
				</span>
				<span className='min-w-0 flex-1'>
					<span className='block text-sm font-medium text-foreground'>
						{label}
					</span>
					<span className='block text-xs text-muted-foreground'>
						{name} · {codepoint}
					</span>
				</span>
			</span>
			<span className='flex w-full flex-shrink-0 items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground sm:w-auto'>
				{copied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
				{copied ? 'Скопировано' : 'Скопировать'}
			</span>
		</button>
	)
}

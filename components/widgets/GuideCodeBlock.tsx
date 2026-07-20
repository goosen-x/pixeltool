'use client'

import { useEffect, useState } from 'react'
import { codeToHtml } from 'shiki'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
	code: string
	language?: string
	className?: string
}

// Та же тема и разметка, что и в код-блоках статей блога
// (lib/helpers/markdownToHtml.ts) — код-блок всегда тёмный, независимо от
// темы сайта, и использует готовые классы .code-block/.shiki из globals.css.
// Раньше здесь был react-syntax-highlighter с подгонкой под тему сайта —
// из-за рассинхрона next-themes и отдельного ThemeScript код на светлой
// странице иногда красился в тёмную палитру (яркий текст на белом фоне).
const SHIKI_THEME = 'github-dark'

export function GuideCodeBlock({ code, language = 'css', className }: Props) {
	const [html, setHtml] = useState<string | null>(null)
	const [copied, setCopied] = useState(false)

	useEffect(() => {
		let cancelled = false
		codeToHtml(code, { lang: language, theme: SHIKI_THEME })
			.catch(() => codeToHtml(code, { lang: 'text', theme: SHIKI_THEME }))
			.then(result => {
				if (!cancelled) setHtml(result)
			})
		return () => {
			cancelled = true
		}
	}, [code, language])

	const copyCode = async () => {
		await navigator.clipboard.writeText(code)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<div className={cn('code-block', className)}>
			<div className='code-block__header flex items-center gap-2 bg-[#1c2128] px-3.5 py-2.5'>
				<span className='h-3 w-3 rounded-full bg-[#ff5f56]' />
				<span className='h-3 w-3 rounded-full bg-[#febc2e]' />
				<span className='h-3 w-3 rounded-full bg-[#28c840]' />
				<span className='mr-auto ml-1 font-mono text-xs tracking-wide text-[#8b949e]'>
					{language}
				</span>
				<button
					type='button'
					onClick={copyCode}
					className='code-block__copy flex items-center gap-1 rounded-md border border-[#30363d] bg-transparent px-2.5 py-1 text-xs text-[#adbac7] transition-colors'
				>
					{copied ? (
						<Check className='h-3 w-3' />
					) : (
						<Copy className='h-3 w-3' />
					)}
					{copied ? 'Скопировано' : 'Копировать'}
				</button>
			</div>
			{html ? (
				<div dangerouslySetInnerHTML={{ __html: html }} />
			) : (
				<pre className='m-0 overflow-x-auto bg-[#0d1117] p-5 text-sm text-[#c9d1d9]'>
					<code className='font-mono'>{code}</code>
				</pre>
			)}
		</div>
	)
}

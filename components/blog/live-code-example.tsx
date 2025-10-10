'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
	Play,
	RotateCcw,
	Copy,
	Check,
	Maximize2,
	Minimize2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import {
	atomDark,
	oneLight
} from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from 'next-themes'

interface LiveCodeExampleProps {
	html?: string
	css?: string
	js?: string
	title?: string
	className?: string
}

export function LiveCodeExample({
	html = '',
	css = '',
	js = '',
	title,
	className
}: LiveCodeExampleProps) {
	const { resolvedTheme } = useTheme()
	const [mounted, setMounted] = useState(false)
	const isDark = resolvedTheme === 'dark'

	// Debug logging
	useEffect(() => {
		console.log(
			'LiveCodeExample - resolvedTheme:',
			resolvedTheme,
			'isDark:',
			isDark
		)
	}, [resolvedTheme, isDark])
	const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js' | 'result'>(
		'result'
	)
	const [isCopied, setIsCopied] = useState(false)
	const [isFullscreen, setIsFullscreen] = useState(false)
	const iframeRef = useRef<HTMLIFrameElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		setMounted(true)
	}, [])

	const hasHtml = html.trim() !== ''
	const hasCss = css.trim() !== ''
	const hasJs = js.trim() !== ''

	const tabs = [
		...(hasHtml ? [{ id: 'html' as const, label: 'HTML' }] : []),
		...(hasCss ? [{ id: 'css' as const, label: 'CSS' }] : []),
		...(hasJs ? [{ id: 'js' as const, label: 'JS' }] : []),
		{ id: 'result' as const, label: 'Result' }
	]

	const getActiveCode = () => {
		switch (activeTab) {
			case 'html':
				return html
			case 'css':
				return css
			case 'js':
				return js
			default:
				return ''
		}
	}

	const [srcDoc, setSrcDoc] = useState('')

	const generateSrcDoc = () => {
		const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            padding: 1rem;
            color: #1a1a1a;
            background: #ffffff;
          }
          @media (prefers-color-scheme: dark) {
            body {
              color: #e1e1e1;
              background: #0a0a0a;
            }
          }
          ${css}
        </style>
      </head>
      <body>
        ${html}
        <script>
          try {
            ${js}
          } catch (error) {
            console.error('Error in example:', error);
          }
        </script>
      </body>
      </html>
    `
		return fullHtml
	}

	const runCode = () => {
		setSrcDoc(generateSrcDoc())
	}

	useEffect(() => {
		runCode()
	}, [html, css, js])

	const copyCode = async () => {
		const code = getActiveCode()
		if (!code) return

		try {
			await navigator.clipboard.writeText(code)
			setIsCopied(true)
			setTimeout(() => setIsCopied(false), 2000)
		} catch (err) {
			console.error('Failed to copy:', err)
		}
	}

	const toggleFullscreen = () => {
		if (!containerRef.current) return

		if (!isFullscreen) {
			if (containerRef.current.requestFullscreen) {
				containerRef.current.requestFullscreen()
			}
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen()
			}
		}
		setIsFullscreen(!isFullscreen)
	}

	return (
		<div
			ref={containerRef}
			className={cn(
				'my-6 overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
				className
			)}
		>
			{title && (
				<div className='border-b border-neutral-200 px-4 py-2 dark:border-neutral-800'>
					<h4 className='text-sm font-medium text-neutral-900 dark:text-neutral-100'>
						{title}
					</h4>
				</div>
			)}

			<div className='flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-2 dark:border-neutral-800 dark:bg-neutral-900'>
				<div className='flex'>
					{tabs.map(tab => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={cn(
								'px-4 py-2 text-sm font-medium transition-colors',
								activeTab === tab.id
									? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
									: 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
							)}
						>
							{tab.label}
						</button>
					))}
				</div>

				<div className='flex items-center gap-1'>
					{activeTab === 'result' && (
						<Button
							variant='ghost'
							size='icon'
							onClick={runCode}
							className='h-8 w-8'
							title='Refresh preview'
						>
							<RotateCcw className='h-4 w-4' />
						</Button>
					)}
					{activeTab !== 'result' && (
						<Button
							variant='ghost'
							size='icon'
							onClick={copyCode}
							className='h-8 w-8'
							title='Copy code'
						>
							{isCopied ? (
								<Check className='h-4 w-4 text-green-500' />
							) : (
								<Copy className='h-4 w-4' />
							)}
						</Button>
					)}
					<Button
						variant='ghost'
						size='icon'
						onClick={toggleFullscreen}
						className='h-8 w-8'
						title='Toggle fullscreen'
					>
						{isFullscreen ? (
							<Minimize2 className='h-4 w-4' />
						) : (
							<Maximize2 className='h-4 w-4' />
						)}
					</Button>
				</div>
			</div>

			<div className='relative'>
				{activeTab === 'result' ? (
					<div className='h-[400px] bg-white dark:bg-neutral-950'>
						<iframe
							ref={iframeRef}
							className='h-full w-full'
							title='Live preview'
							sandbox='allow-scripts'
							srcDoc={srcDoc}
						/>
					</div>
				) : (
					<div className='h-[400px] overflow-auto'>
						{mounted && resolvedTheme ? (
							<div
								className='h-full'
								style={{
									background: isDark ? 'rgb(15 23 42)' : 'rgb(250 250 250)'
								}}
							>
								<SyntaxHighlighter
									key={`${activeTab}-${resolvedTheme}`}
									language={activeTab}
									style={isDark ? atomDark : oneLight}
									customStyle={{
										margin: 0,
										height: '100%',
										background: 'transparent',
										fontSize: '0.875rem',
										lineHeight: '1.7'
									}}
									showLineNumbers
									lineNumberStyle={{
										minWidth: '3em',
										paddingRight: '1em',
										color: isDark ? 'rgb(100 116 139)' : 'rgb(148 163 184)',
										userSelect: 'none'
									}}
								>
									{getActiveCode()}
								</SyntaxHighlighter>
							</div>
						) : (
							<div className='h-full bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center'>
								<div className='text-neutral-400'>Loading...</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

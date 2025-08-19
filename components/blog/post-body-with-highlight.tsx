'use client'

import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import markdownStyles from './markdown-styles.module.css'
import { LiveCodeExample } from './live-code-example'

type Props = {
	content: string
}

export function PostBodyWithHighlight({ content }: Props) {
	// Parse HTML and replace code blocks with syntax highlighted versions
	const renderContent = () => {
		console.log(
			'PostBodyWithHighlight - Sample content:',
			content.substring(0, 500)
		)
		// Regular expression to match code blocks - support both rehype-highlight and plain formats
		const codeBlockRegex =
			/<pre><code(?:\s+class="(?:language-)?(\w+)")?>([\s\S]*?)<\/code><\/pre>/g
		// Regular expression to match live code examples
		const liveExampleRegex = /<div data-live-example='([^']+)'><\/div>/g

		let lastIndex = 0
		const parts: React.ReactNode[] = []
		let codeMatch
		let liveMatch

		// Combine all matches and sort by index
		const allMatches: Array<{ type: 'code' | 'live'; match: RegExpExecArray }> =
			[]

		while ((codeMatch = codeBlockRegex.exec(content)) !== null) {
			allMatches.push({ type: 'code', match: codeMatch })
		}

		while ((liveMatch = liveExampleRegex.exec(content)) !== null) {
			allMatches.push({ type: 'live', match: liveMatch })
		}

		// Sort matches by their position in content
		allMatches.sort((a, b) => a.match.index - b.match.index)

		// Process matches in order
		for (const { type, match } of allMatches) {
			// Add content before current match
			if (match.index > lastIndex) {
				parts.push(
					<div
						key={`text-${lastIndex}`}
						dangerouslySetInnerHTML={{
							__html: content.slice(lastIndex, match.index)
						}}
					/>
				)
			}

			if (type === 'live') {
				// Handle live code example
				const dataStr = match[1].replace(/&#39;/g, "'")
				try {
					const data = JSON.parse(dataStr)
					parts.push(
						<LiveCodeExample
							key={`live-${match.index}`}
							html={data.html}
							css={data.css}
							js={data.js}
							title={data.title}
						/>
					)
				} catch (error) {
					console.error('Failed to parse live example data:', error)
				}
			} else {
				// Handle regular code block
				const language = match[1] || 'text'
				const code = match[2]
					.replace(/&lt;/g, '<')
					.replace(/&gt;/g, '>')
					.replace(/&amp;/g, '&')
					.replace(/&quot;/g, '"')
					.replace(/&#39;/g, "'")

				// Add syntax highlighted code block
				parts.push(
					<div
						key={`code-${match.index}`}
						className='my-6 rounded-lg overflow-hidden'
					>
						<div className='flex items-center justify-between bg-slate-900 px-4 py-2 border-b border-slate-800'>
							<div className='flex items-center gap-2'>
								<div className='flex items-center gap-1.5'>
									<div className='w-3 h-3 rounded-full bg-red-500/20' />
									<div className='w-3 h-3 rounded-full bg-yellow-500/20' />
									<div className='w-3 h-3 rounded-full bg-green-500/20' />
								</div>
								<span className='text-xs text-slate-400 ml-2'>{language}</span>
							</div>
							<button
								onClick={() => {
									navigator.clipboard.writeText(code.trim())
									// You could add a toast notification here
								}}
								className='text-xs text-slate-400 hover:text-slate-200 transition-colors px-3 py-1 rounded hover:bg-slate-800'
							>
								Copy
							</button>
						</div>
						<SyntaxHighlighter
							language={language}
							style={atomDark}
							customStyle={{
								margin: 0,
								padding: '1.5rem',
								background: 'rgb(15 23 42)',
								fontSize: '0.875rem',
								lineHeight: '1.7'
							}}
							showLineNumbers
							lineNumberStyle={{
								minWidth: '3em',
								paddingRight: '1em',
								color: 'rgb(100 116 139)',
								userSelect: 'none'
							}}
						>
							{code.trim()}
						</SyntaxHighlighter>
					</div>
				)
			}

			lastIndex = match.index + match[0].length
		}

		// Add remaining content
		if (lastIndex < content.length) {
			parts.push(
				<div
					key={`text-${lastIndex}`}
					dangerouslySetInnerHTML={{ __html: content.slice(lastIndex) }}
				/>
			)
		}

		return parts
	}

	return (
		<div className='max-w-2xl mx-auto'>
			<div className={markdownStyles['markdown']}>{renderContent()}</div>
		</div>
	)
}

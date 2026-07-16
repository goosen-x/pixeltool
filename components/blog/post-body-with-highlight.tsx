'use client'

import React, { useEffect, useRef } from 'react'
import markdownStyles from './markdown-styles.module.css'
import { LiveCodeExample } from './live-code-example'
import { ToolLink } from './tool-link'

type Props = {
	content: string
}

// Стиль ссылок внутри HTML-текста статьи. Не задевает карточки инструментов
// (ToolLink) — те рендерятся отдельным React-компонентом, а не внутри HTML.
const LINK_STYLES =
	'[&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-primary/80'

export function PostBodyWithHighlight({ content }: Props) {
	const containerRef = useRef<HTMLDivElement>(null)

	// Код-блоки подсвечены Shiki на этапе сборки — на клиенте остаётся лишь
	// оживить кнопку «Копировать». Делаем это делегированием, чтобы не вешать
	// обработчик на каждый блок.
	useEffect(() => {
		const root = containerRef.current
		if (!root) return

		const onClick = (e: MouseEvent) => {
			const button = (e.target as HTMLElement).closest('.code-block__copy')
			if (!button) return
			const block = button.closest('.code-block')
			const code = block?.querySelector('pre')?.textContent
			if (!code) return
			navigator.clipboard.writeText(code).then(() => {
				const prev = button.textContent
				button.textContent = 'Скопировано'
				window.setTimeout(() => {
					button.textContent = prev
				}, 2000)
			})
		}

		root.addEventListener('click', onClick)
		return () => root.removeEventListener('click', onClick)
	}, [])

	// Тело статьи — HTML со вставленными плейсхолдерами двух видов:
	// <div data-live-example> и <div data-tool-link>. Их заменяем на React-
	// компоненты, а всё между ними (включая подсвеченные код-блоки) выводим как
	// есть. Код-блоки трогать не нужно — они уже готовый HTML от Shiki.
	const renderContent = () => {
		const liveExampleRegex = /<div data-live-example='([^']+)'><\/div>/g
		const toolLinkRegex = /<div data-tool-link='([^']+)'><\/div>/g

		const allMatches: Array<{
			type: 'live' | 'tool'
			match: RegExpExecArray
		}> = []

		let liveMatch
		while ((liveMatch = liveExampleRegex.exec(content)) !== null) {
			allMatches.push({ type: 'live', match: liveMatch })
		}
		let toolMatch
		while ((toolMatch = toolLinkRegex.exec(content)) !== null) {
			allMatches.push({ type: 'tool', match: toolMatch })
		}

		allMatches.sort((a, b) => a.match.index - b.match.index)

		let lastIndex = 0
		const parts: React.ReactNode[] = []

		for (const { type, match } of allMatches) {
			if (match.index > lastIndex) {
				parts.push(
					<div
						key={`text-${lastIndex}`}
						className={LINK_STYLES}
						dangerouslySetInnerHTML={{
							__html: content.slice(lastIndex, match.index)
						}}
					/>
				)
			}

			if (type === 'live') {
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
				const dataStr = match[1].replace(/&#39;/g, "'")
				try {
					const data = JSON.parse(dataStr)
					parts.push(
						<ToolLink
							key={`tool-${match.index}`}
							href={data.href}
							title={data.title}
							subtitle={data.subtitle}
							description={data.description}
							iconName={data.iconName}
							gradient={data.gradient}
						/>
					)
				} catch (error) {
					console.error('Failed to parse tool link data:', error)
				}
			}

			lastIndex = match.index + match[0].length
		}

		if (lastIndex < content.length) {
			parts.push(
				<div
					key={`text-${lastIndex}`}
					className={LINK_STYLES}
					dangerouslySetInnerHTML={{ __html: content.slice(lastIndex) }}
				/>
			)
		}

		return parts
	}

	return (
		<div className='max-w-3xl mx-auto' ref={containerRef}>
			<div className={markdownStyles['markdown']}>{renderContent()}</div>
		</div>
	)
}

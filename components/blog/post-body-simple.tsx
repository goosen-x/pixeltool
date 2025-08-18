'use client'

import React, { useEffect } from 'react'
import markdownStyles from './markdown-styles.module.css'
import 'prismjs/themes/prism-tomorrow.css'

type Props = {
	content: string
}

export function PostBodySimple({ content }: Props) {
	useEffect(() => {
		// Highlight all code blocks after component mounts
		const loadPrism = async () => {
			const Prism = (await import('prismjs')).default

			// Import languages
			await import('prismjs/components/prism-javascript')
			await import('prismjs/components/prism-typescript')
			await import('prismjs/components/prism-jsx')
			await import('prismjs/components/prism-tsx')
			await import('prismjs/components/prism-css')
			await import('prismjs/components/prism-json')
			await import('prismjs/components/prism-bash')

			Prism.highlightAll()
		}

		loadPrism()
	}, [content])

	return (
		<div className='max-w-2xl mx-auto'>
			<div
				className={markdownStyles['markdown']}
				dangerouslySetInnerHTML={{ __html: content }}
			/>
		</div>
	)
}

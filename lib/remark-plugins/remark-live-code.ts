import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root, Code } from 'mdast'

interface LiveCodeData {
	html?: string
	css?: string
	js?: string
	title?: string
}

const remarkLiveCode: Plugin<[], Root> = () => {
	return tree => {
		const liveCodeBlocks: { index: number; data: LiveCodeData }[] = []
		let currentLiveCode: LiveCodeData | null = null
		let startIndex = -1

		visit(tree, 'code', (node: Code, index, parent) => {
			if (!parent || index === undefined) return

			// Check if this is a live code block
			if (
				node.lang === 'html:live' ||
				node.lang === 'css:live' ||
				node.lang === 'js:live'
			) {
				const [lang] = node.lang.split(':')

				// Start new live code block if needed
				if (!currentLiveCode) {
					currentLiveCode = {}
					startIndex = index
				}

				// Add code to current block
				currentLiveCode[lang as keyof LiveCodeData] = node.value

				// Check if this is followed by another live code block
				const nextNode = parent.children[index + 1]
				const isLastLiveBlock =
					!nextNode ||
					nextNode.type !== 'code' ||
					!(nextNode as Code).lang?.endsWith(':live')

				if (isLastLiveBlock && currentLiveCode) {
					// Extract title if present in a comment at the beginning
					const firstCode =
						currentLiveCode.html ||
						currentLiveCode.css ||
						currentLiveCode.js ||
						''
					const titleMatch = firstCode.match(/^\/\/\s*title:\s*(.+)$/m)
					if (titleMatch) {
						currentLiveCode.title = titleMatch[1]
						// Remove title comment from code
						if (currentLiveCode.html?.startsWith('// title:')) {
							currentLiveCode.html = currentLiveCode.html
								.split('\n')
								.slice(1)
								.join('\n')
						}
						if (currentLiveCode.css?.startsWith('// title:')) {
							currentLiveCode.css = currentLiveCode.css
								.split('\n')
								.slice(1)
								.join('\n')
						}
						if (currentLiveCode.js?.startsWith('// title:')) {
							currentLiveCode.js = currentLiveCode.js
								.split('\n')
								.slice(1)
								.join('\n')
						}
					}

					liveCodeBlocks.push({
						index: startIndex,
						data: currentLiveCode
					})
					currentLiveCode = null
					startIndex = -1
				}
			}
		})

		// Replace code blocks with live examples
		for (let i = liveCodeBlocks.length - 1; i >= 0; i--) {
			const { index, data } = liveCodeBlocks[i]

			visit(tree, (node, nodeIndex, parent) => {
				if (!parent || nodeIndex !== index || node.type !== 'code') return

				// Count how many consecutive live code blocks we have
				let count = 1
				while (
					parent.children[nodeIndex + count] &&
					parent.children[nodeIndex + count].type === 'code' &&
					(parent.children[nodeIndex + count] as Code).lang?.endsWith(':live')
				) {
					count++
				}

				// Create placeholder for live example
				const liveExampleNode = {
					type: 'html',
					value: `<div data-live-example='${JSON.stringify(data).replace(/'/g, '&#39;')}'></div>`
				} as any

				// Replace all consecutive live code blocks with single live example
				parent.children.splice(nodeIndex, count, liveExampleNode)
			})
		}
	}
}

export default remarkLiveCode

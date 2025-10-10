import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root, Paragraph, Text, Link } from 'mdast'
import { widgets } from '@/lib/constants/widgets'

interface ToolLinkData {
	href: string
	title: string
	description?: string
	iconName?: string
	gradient?: string
}

// Build metadata map from widgets
const TOOL_METADATA: Record<
	string,
	{
		title: string
		description: string
		iconName: string
		gradient: string
	}
> = {}

widgets.forEach(widget => {
	const href = `/tools/${widget.path}`

	TOOL_METADATA[href] = {
		title: widget.title || widget.id,
		description: widget.description || widget.useCase || '',
		iconName: widget.iconName || 'Wrench',
		gradient: widget.gradient
	}
})

const remarkToolLink: Plugin<[], Root> = () => {
	return tree => {
		visit(tree, 'paragraph', (node: Paragraph, index, parent) => {
			if (!parent || index === undefined) return

			// Check if paragraph contains only a tool link
			if (node.children.length === 1) {
				const child = node.children[0]

				// Check for plain text tool link (e.g., "/tools/css-clamp-calculator")
				if (child.type === 'text') {
					const text = (child as Text).value.trim()
					const toolLinkMatch = text.match(/^\/tools\/[\w-]+$/)

					if (toolLinkMatch) {
						const href = text
						const metadata = TOOL_METADATA[href] || {
							title: href.split('/').pop()?.replace(/-/g, ' ') || 'Tool',
							description: '',
							iconName: 'Wrench',
							gradient: 'from-blue-500 to-cyan-500'
						}

						const toolLinkData: ToolLinkData = {
							href,
							title: metadata.title,
							description: metadata.description,
							iconName: metadata.iconName,
							gradient: metadata.gradient
						}

						// Replace paragraph with tool link HTML
						const toolLinkNode = {
							type: 'html',
							value: `<div data-tool-link='${JSON.stringify(toolLinkData).replace(/'/g, '&#39;')}'></div>`
						} as any

						parent.children[index] = toolLinkNode
					}
				}

				// Check for markdown link to tool (e.g., [Tool Name](/tools/css-clamp-calculator))
				if (child.type === 'link') {
					const linkNode = child as Link
					const href = linkNode.url

					if (href.startsWith('/tools/')) {
						const metadata = TOOL_METADATA[href] || {
							title:
								(linkNode.children[0] as Text)?.value ||
								href.split('/').pop()?.replace(/-/g, ' ') ||
								'Tool',
							description: '',
							iconName: 'Wrench',
							gradient: 'from-blue-500 to-cyan-500'
						}

						const toolLinkData: ToolLinkData = {
							href,
							title: metadata.title,
							description: metadata.description,
							iconName: metadata.iconName,
							gradient: metadata.gradient
						}

						// Replace paragraph with tool link HTML
						const toolLinkNode = {
							type: 'html',
							value: `<div data-tool-link='${JSON.stringify(toolLinkData).replace(/'/g, '&#39;')}'></div>`
						} as any

						parent.children[index] = toolLinkNode
					}
				}
			}
		})
	}
}

export default remarkToolLink

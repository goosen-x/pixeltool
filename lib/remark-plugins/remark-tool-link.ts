import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root, Paragraph, Text, Link } from 'mdast'

interface ToolLinkData {
	href: string
	title: string
	description?: string
}

// Map of tool paths to their metadata
const TOOL_METADATA: Record<string, { title: string; description: string }> = {
	'/tools/css-clamp-calculator': {
		title: 'CSS Clamp() Калькулятор',
		description:
			'Генератор выражений clamp() для адаптивной типографики и размеров'
	},
	'/tools/age-calculator': {
		title: 'Калькулятор возраста',
		description: 'Точный расчёт возраста с учётом дней, месяцев и лет'
	},
	'/tools/bmi-calculator': {
		title: 'Калькулятор ИМТ',
		description: 'Расчёт индекса массы тела и рекомендации'
	},
	'/tools/password-generator': {
		title: 'Генератор паролей',
		description: 'Создание надёжных паролей с настройками сложности'
	},
	'/tools/qr-generator': {
		title: 'Генератор QR-кодов',
		description: 'Создание QR-кодов для ссылок, текста и контактов'
	},
	'/tools/uuid-generator': {
		title: 'Генератор UUID',
		description: 'Генерация уникальных идентификаторов UUID v4'
	},
	'/tools/regex-tester': {
		title: 'Тестер регулярных выражений',
		description: 'Проверка и отладка регулярных выражений в реальном времени'
	},
	'/tools/jwt-decoder': {
		title: 'JWT декодер',
		description: 'Декодирование и просмотр содержимого JWT токенов'
	},
	'/tools/base64-encoder': {
		title: 'Base64 кодировщик',
		description: 'Кодирование и декодирование данных в Base64'
	},
	'/tools/text-counter': {
		title: 'Счётчик текста',
		description: 'Подсчёт символов, слов, строк и времени чтения'
	},
	'/tools/color-converter': {
		title: 'Конвертер цветов',
		description: 'Преобразование между HEX, RGB, HSL и другими форматами'
	}
}

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
							description: undefined
						}

						const toolLinkData: ToolLinkData = {
							href,
							title: metadata.title,
							description: metadata.description
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
							description: undefined
						}

						const toolLinkData: ToolLinkData = {
							href,
							title: metadata.title,
							description: metadata.description
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

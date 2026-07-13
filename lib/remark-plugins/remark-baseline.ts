import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root, Paragraph, Text } from 'mdast'
import { BASELINE_FEATURES } from '@/lib/data/baseline-features'

/**
 * Строка вида `!baseline container-type` в статье превращается в плашку
 * поддержки браузерами. Механизм тот же, что у remark-tool-link: плагин
 * оставляет в HTML маркер-div, а PostBodyWithHighlight подменяет его
 * React-компонентом.
 */
const remarkBaseline: Plugin<[], Root> = () => {
	return tree => {
		visit(tree, 'paragraph', (node: Paragraph, index, parent) => {
			if (!parent || index === undefined) return
			if (node.children.length !== 1) return

			const child = node.children[0]
			if (child.type !== 'text') return

			const match = (child as Text).value.trim().match(/^!baseline\s+([\w-]+)$/)
			if (!match) return

			const key = match[1]
			const feature = BASELINE_FEATURES[key]

			// Неизвестный ключ — молча пропускаем: лучше не показать плашку,
			// чем вывести в статью пустую коробку или строку «!baseline foo»
			if (!feature) return

			const payload = JSON.stringify({ feature: key, ...feature })

			parent.children[index] = {
				type: 'html',
				value: `<div data-baseline='${payload.replace(/'/g, '&#39;')}'></div>`
			} as never
		})
	}
}

export default remarkBaseline

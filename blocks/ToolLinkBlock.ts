import type { Block } from 'payload'
import { widgets } from '../lib/constants/widgets'

export const ToolLinkBlock: Block = {
	slug: 'toolLink',
	labels: {
		singular: 'Карточка инструмента',
		plural: 'Карточки инструментов'
	},
	fields: [
		{
			name: 'toolPath',
			type: 'select',
			required: true,
			options: widgets.map(w => ({
				label: w.title || w.id,
				value: w.path
			}))
		},
		{
			name: 'subtitle',
			type: 'text',
			required: false
		}
	]
}

import type { CollectionConfig } from 'payload'

export const Authors: CollectionConfig = {
	slug: 'authors',
	admin: {
		useAsTitle: 'name'
	},
	fields: [
		{
			name: 'name',
			type: 'text',
			required: true
		},
		{
			name: 'picture',
			type: 'upload',
			relationTo: 'media',
			required: false
		}
	]
}

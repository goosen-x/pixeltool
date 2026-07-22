import type { CollectionConfig } from 'payload'
import {
	lexicalEditor,
	BlocksFeature,
	UploadFeature
} from '@payloadcms/richtext-lexical'
import { ToolLinkBlock } from '../blocks/ToolLinkBlock'

export const Posts: CollectionConfig = {
	slug: 'posts',
	admin: {
		useAsTitle: 'title'
	},
	fields: [
		{ name: 'title', type: 'text', required: true },
		{ name: 'slug', type: 'text', required: true, unique: true, index: true },
		{ name: 'excerpt', type: 'textarea', required: true },
		{ name: 'coverImage', type: 'upload', relationTo: 'media', required: false },
		{ name: 'date', type: 'date', required: true },
		{ name: 'author', type: 'relationship', relationTo: 'authors', required: true },
		{
			name: 'related',
			type: 'relationship',
			relationTo: 'posts',
			hasMany: true,
			required: false
		},
		{
			name: 'content',
			type: 'richText',
			required: true,
			editor: lexicalEditor({
				features: ({ defaultFeatures }) => [
					...defaultFeatures,
					BlocksFeature({ blocks: [ToolLinkBlock] }),
					UploadFeature({
						collections: {
							media: { fields: [] }
						}
					})
				]
			})
		}
	]
}

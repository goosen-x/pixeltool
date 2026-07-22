import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
	secret: process.env.PAYLOAD_SECRET || '',
	admin: {
		user: Users.slug
	},
	collections: [Users, Media],
	editor: lexicalEditor({}),
	db: sqliteAdapter({
		client: {
			url: process.env.DATABASE_URI || 'file:./payload.db'
		}
	}),
	plugins: [
		s3Storage({
			collections: {
				media: {
					disablePayloadAccessControl: true
				}
			},
			bucket: process.env.S3_BUCKET || '',
			config: {
				endpoint: process.env.S3_ENDPOINT,
				region: process.env.S3_REGION || 'ru-1',
				credentials: {
					accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
					secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || ''
				},
				forcePathStyle: true
			}
		})
	],
	// @ts-expect-error sharp's bundled .d.ts overloads don't structurally match
	// payload's SharpDependency type under TS 5.9 (mismatch is type-only; sharp
	// works fine at runtime). See payloadcms/payload sharp typing issues.
	sharp,
	typescript: {
		outputFile: path.resolve(dirname, 'payload-types.ts')
	}
})

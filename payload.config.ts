import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
	secret: process.env.PAYLOAD_SECRET || '',
	admin: {
		user: Users.slug
	},
	collections: [Users],
	editor: lexicalEditor({}),
	db: sqliteAdapter({
		client: {
			url: process.env.DATABASE_URI || 'file:./payload.db'
		}
	}),
	// @ts-expect-error sharp's bundled .d.ts overloads don't structurally match
	// payload's SharpDependency type under TS 5.9 (mismatch is type-only; sharp
	// works fine at runtime). See payloadcms/payload sharp typing issues.
	sharp,
	typescript: {
		outputFile: path.resolve(dirname, 'payload-types.ts')
	}
})

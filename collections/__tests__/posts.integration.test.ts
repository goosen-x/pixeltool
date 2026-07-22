// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fs from 'fs'
import os from 'os'
import path from 'path'
import type { Payload } from 'payload'

const TEST_DB = path.join(os.tmpdir(), `payload-posts-test-${Date.now()}.db`)

describe('Posts collection', () => {
	let payload: Payload

	beforeAll(async () => {
		process.env.DATABASE_URI = `file:${TEST_DB}`
		// payload.config.mts reads PAYLOAD_SECRET at module-evaluation time;
		// tests don't load .env.local, so provide a throwaway test secret if
		// one isn't already present in the environment.
		process.env.PAYLOAD_SECRET =
			process.env.PAYLOAD_SECRET || 'test-secret-for-integration-tests'

		// Dynamic import so payload.config only evaluates (and reads
		// DATABASE_URI) after we've set the env var above — a static
		// top-level import would be hoisted and evaluate the config
		// (and its default `file:./payload.db` fallback) too early.
		const { getPayload } = await import('payload')
		const { default: config } = await import('@/payload.config')

		payload = await getPayload({ config })
	})

	afterAll(async () => {
		await payload?.destroy?.()
		fs.rmSync(TEST_DB, { force: true })
		fs.rmSync(`${TEST_DB}-journal`, { force: true })
		fs.rmSync(`${TEST_DB}-wal`, { force: true })
		fs.rmSync(`${TEST_DB}-shm`, { force: true })
	})

	it('creates and reads back a post with an author and a toolLink block', async () => {
		const author = await payload.create({
			collection: 'authors',
			data: { name: 'Тестовый автор' }
		})

		const post = await payload.create({
			collection: 'posts',
			data: {
				title: 'Тестовая статья',
				slug: 'test-post',
				excerpt: 'Кратко',
				date: new Date().toISOString(),
				author: author.id,
				content: {
					root: {
						type: 'root',
						format: '',
						indent: 0,
						version: 1,
						direction: 'ltr',
						children: [
							{
								type: 'block',
								version: 2,
								format: '',
								fields: {
									blockType: 'toolLink',
									toolPath: 'password-generator',
									subtitle: null
								}
							}
						]
					}
				}
			}
		})

		const found = await payload.findByID({ collection: 'posts', id: post.id })
		expect(found.slug).toBe('test-post')
		expect(found.author).toBeTruthy()

		const toolLinkNode = (found.content.root.children as any[]).find(
			node => node.type === 'block' && node.fields?.blockType === 'toolLink'
		)
		expect(toolLinkNode).toBeTruthy()
		expect(toolLinkNode.fields.toolPath).toBe('password-generator')
		expect(toolLinkNode.fields.subtitle).toBeNull()
	})
})

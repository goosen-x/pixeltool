import { z } from 'zod'

export const viewActionSchema = z.object({
	postId: z.string().min(1),
	action: z.literal('view')
})

export const rateActionSchema = z.object({
	postId: z.string().min(1),
	action: z.literal('rate'),
	value: z.union([
		z.literal(1),
		z.literal(2),
		z.literal(3),
		z.literal(4),
		z.literal(5)
	])
})

export const blogStatsActionSchema = z.discriminatedUnion('action', [
	viewActionSchema,
	rateActionSchema
])

export type BlogStatsAction = z.infer<typeof blogStatsActionSchema>

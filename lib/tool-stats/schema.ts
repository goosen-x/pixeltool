import { z } from 'zod'

export const viewActionSchema = z.object({
	toolId: z.string().min(1),
	action: z.literal('view')
})

export const rateActionSchema = z.object({
	toolId: z.string().min(1),
	action: z.literal('rate'),
	value: z.union([
		z.literal(1),
		z.literal(2),
		z.literal(3),
		z.literal(4),
		z.literal(5)
	])
})

export const feedbackActionSchema = z.object({
	toolId: z.string().min(1),
	action: z.literal('feedback'),
	rating: z.union([z.literal(1), z.literal(2), z.literal(3)]),
	comment: z.string().trim().min(1).max(1000)
})

export const toolStatsActionSchema = z.discriminatedUnion('action', [
	viewActionSchema,
	rateActionSchema,
	feedbackActionSchema
])

export type ToolStatsAction = z.infer<typeof toolStatsActionSchema>

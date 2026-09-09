import { z } from 'zod'

export const webmasterStatRowSchema = z.object({
	path: z.string().min(1),
	periodStart: z.string().date(),
	periodEnd: z.string().date(),
	impressions: z.number().nonnegative(),
	clicks: z.number().nonnegative(),
	ctr: z.number().nonnegative(),
	avgPosition: z.number().nonnegative().nullable(),
	avgClickPosition: z.number().nonnegative().nullable()
})

export type WebmasterStatRow = z.infer<typeof webmasterStatRowSchema>

export const importWebmasterStatsSchema = z.object({
	csv: z.string().min(1)
})

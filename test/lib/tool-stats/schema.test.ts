import { describe, it, expect } from 'vitest'
import { toolStatsActionSchema } from '@/lib/tool-stats/schema'

describe('toolStatsActionSchema', () => {
	it('принимает валидное действие view', () => {
		const result = toolStatsActionSchema.safeParse({
			toolId: 'qr-generator',
			action: 'view'
		})
		expect(result.success).toBe(true)
	})

	it('принимает валидное действие rate со значением 1-5', () => {
		const result = toolStatsActionSchema.safeParse({
			toolId: 'qr-generator',
			action: 'rate',
			value: 4
		})
		expect(result.success).toBe(true)
	})

	it('отклоняет rate со значением вне 1-5', () => {
		const result = toolStatsActionSchema.safeParse({
			toolId: 'qr-generator',
			action: 'rate',
			value: 6
		})
		expect(result.success).toBe(false)
	})

	it('отклоняет отсутствующий toolId', () => {
		const result = toolStatsActionSchema.safeParse({ action: 'view' })
		expect(result.success).toBe(false)
	})

	it('отклоняет неизвестное action', () => {
		const result = toolStatsActionSchema.safeParse({
			toolId: 'x',
			action: 'like'
		})
		expect(result.success).toBe(false)
	})
})

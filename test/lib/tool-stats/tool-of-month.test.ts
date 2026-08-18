import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
	currentYearMonth,
	previousYearMonth,
	resolveToolOfMonth
} from '@/lib/tool-stats/tool-of-month'
import { publicWidgets } from '@/lib/constants/widgets'

describe('currentYearMonth', () => {
	it('форматирует дату как YYYY-MM в UTC', () => {
		const date = new Date(Date.UTC(2026, 7, 18)) // месяц 7 = август (0-based)
		expect(currentYearMonth(date)).toBe('2026-08')
	})
})

describe('previousYearMonth', () => {
	it('возвращает предыдущий месяц в пределах года', () => {
		const date = new Date(Date.UTC(2026, 7, 18))
		expect(previousYearMonth(date)).toBe('2026-07')
	})

	it('переходит на декабрь предыдущего года, если текущий месяц — январь', () => {
		const date = new Date(Date.UTC(2026, 0, 15))
		expect(previousYearMonth(date)).toBe('2025-12')
	})
})

describe('resolveToolOfMonth', () => {
	it('возвращает первый id, который резолвится в publicWidgets', () => {
		const realId = publicWidgets[0].id
		const widget = resolveToolOfMonth(['несуществующий-id', realId])
		expect(widget?.id).toBe(realId)
	})

	it('пропускает id тулов, которых нет в publicWidgets (демо/удалённые)', () => {
		const widget = resolveToolOfMonth(['точно-не-существующий-id'])
		expect(widget).toBeNull()
	})

	it('возвращает null для пустого списка кандидатов', () => {
		expect(resolveToolOfMonth([])).toBeNull()
	})
})

import { getToolOfTheMonth } from '@/lib/tool-stats/tool-of-month'

const mockQuery = vi.fn()

vi.mock('@/lib/db', () => ({
	getDb: async () => ({ query: mockQuery })
}))

describe('getToolOfTheMonth', () => {
	const realId = publicWidgets[0].id
	const realId2 = publicWidgets[1].id

	beforeEach(() => {
		mockQuery.mockReset()
	})

	it('берёт лидера текущего месяца, если данные есть', async () => {
		mockQuery.mockImplementationOnce(async (sql: string) => {
			expect(sql).toContain('tool_views_monthly')
			return { rows: [{ tool_id: realId }] }
		})

		const widget = await getToolOfTheMonth()
		expect(widget?.id).toBe(realId)
		expect(mockQuery).toHaveBeenCalledTimes(1)
	})

	it('фоллбэк на прошлый месяц, если текущий пуст', async () => {
		mockQuery
			.mockImplementationOnce(async () => ({ rows: [] })) // текущий месяц
			.mockImplementationOnce(async () => ({ rows: [{ tool_id: realId }] })) // прошлый месяц

		const widget = await getToolOfTheMonth()
		expect(widget?.id).toBe(realId)
		expect(mockQuery).toHaveBeenCalledTimes(2)
	})

	it('фоллбэк на all-time, если и текущий, и прошлый месяц пусты', async () => {
		mockQuery
			.mockImplementationOnce(async () => ({ rows: [] })) // текущий месяц
			.mockImplementationOnce(async () => ({ rows: [] })) // прошлый месяц
			.mockImplementationOnce(async (sql: string) => {
				expect(sql).toContain('tool_stats')
				return { rows: [{ tool_id: realId2 }] }
			})

		const widget = await getToolOfTheMonth()
		expect(widget?.id).toBe(realId2)
		expect(mockQuery).toHaveBeenCalledTimes(3)
	})

	it('возвращает null, если данных нет вообще', async () => {
		mockQuery.mockImplementation(async () => ({ rows: [] }))

		const widget = await getToolOfTheMonth()
		expect(widget).toBeNull()
	})
})

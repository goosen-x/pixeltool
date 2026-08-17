import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToolStatsProvider } from '@/components/providers/ToolStatsProvider'
import { ToolRatingWidget } from '../ToolRatingWidget'

describe('ToolRatingWidget', () => {
	beforeEach(() => {
		localStorage.clear()
		vi.stubGlobal(
			'fetch',
			vi.fn().mockImplementation((_url: string, init?: RequestInit) => {
				if (!init?.method || init.method === 'GET') {
					return Promise.resolve({ ok: true, json: async () => ({}) })
				}
				return Promise.resolve({
					ok: true,
					json: async () => ({ rating: 5, ratingCount: 1 })
				})
			})
		)
	})

	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('рисует 5 звёзд, кликабельных, пока не проголосовал', () => {
		render(
			<ToolStatsProvider>
				<ToolRatingWidget toolId='qr-generator' />
			</ToolStatsProvider>
		)

		expect(screen.getAllByRole('button')).toHaveLength(5)
	})

	it('клик по звезде отправляет оценку и прячет интерактивность', async () => {
		const user = userEvent.setup()
		render(
			<ToolStatsProvider>
				<ToolRatingWidget toolId='qr-generator' />
			</ToolStatsProvider>
		)

		await user.click(screen.getByRole('button', { name: 'Оценить на 5 из 5' }))

		expect(fetch).toHaveBeenCalledWith(
			'/api/tool-stats',
			expect.objectContaining({ method: 'POST' })
		)
		expect(await screen.findByText('5.0 · 1')).toBeInTheDocument()
	})
})

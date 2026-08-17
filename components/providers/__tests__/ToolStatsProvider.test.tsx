import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { ToolStatsProvider } from '../ToolStatsProvider'
import { useToolStats } from '@/lib/hooks/useToolStats'

function StatsProbe({ toolId }: { toolId: string }) {
	const { views, rating, ratingCount } = useToolStats(toolId)
	return (
		<div>
			<span data-testid='views'>{views}</span>
			<span data-testid='rating'>{rating}</span>
			<span data-testid='count'>{ratingCount}</span>
		</div>
	)
}

describe('ToolStatsProvider + useToolStats', () => {
	beforeEach(() => {
		localStorage.clear()
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				json: async () => ({
					'qr-generator': { views: 120, rating: 4.5, ratingCount: 10 }
				})
			})
		)
	})

	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('подтягивает статистику при монтировании и отдаёт её через хук', async () => {
		render(
			<ToolStatsProvider>
				<StatsProbe toolId='qr-generator' />
			</ToolStatsProvider>
		)

		await waitFor(() => {
			expect(screen.getByTestId('views')).toHaveTextContent('120')
		})
		expect(screen.getByTestId('rating')).toHaveTextContent('4.5')
		expect(screen.getByTestId('count')).toHaveTextContent('10')
	})

	it('для тула без данных отдаёт нули', async () => {
		render(
			<ToolStatsProvider>
				<StatsProbe toolId='unknown-tool' />
			</ToolStatsProvider>
		)

		await waitFor(() => {
			expect(fetch).toHaveBeenCalledWith('/api/tool-stats')
		})
		expect(screen.getByTestId('views')).toHaveTextContent('0')
	})
})

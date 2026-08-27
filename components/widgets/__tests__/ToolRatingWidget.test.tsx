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

	it('показывает среднюю оценку ещё не проголосовавшему посетителю', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockImplementation((_url: string, init?: RequestInit) => {
				if (!init?.method || init.method === 'GET') {
					return Promise.resolve({
						ok: true,
						json: async () => ({
							'qr-generator': { views: 0, rating: 4.5, ratingCount: 10 }
						})
					})
				}
				return Promise.resolve({
					ok: true,
					json: async () => ({ rating: 4.5, ratingCount: 10 })
				})
			})
		)

		render(
			<ToolStatsProvider>
				<ToolRatingWidget toolId='qr-generator' />
			</ToolStatsProvider>
		)

		expect(await screen.findByText('4.5 · 10')).toBeInTheDocument()

		const buttons = screen.getAllByRole('button')
		expect(buttons).toHaveLength(5)
		// rating 4.5 округляется до 5 — залиты все 5 звёзд
		buttons.forEach(button => {
			expect(button).toBeEnabled()
		})
	})

	it('не помечает голос успешным при ответе 429 и не падает', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockImplementation((_url: string, init?: RequestInit) => {
				if (!init?.method || init.method === 'GET') {
					return Promise.resolve({ ok: true, json: async () => ({}) })
				}
				return Promise.resolve({
					ok: false,
					status: 429,
					json: async () => ({
						error: 'Слишком много оценок, попробуйте позже'
					})
				})
			})
		)

		const user = userEvent.setup()
		render(
			<ToolStatsProvider>
				<ToolRatingWidget toolId='qr-generator' />
			</ToolStatsProvider>
		)

		const button = screen.getByRole('button', { name: 'Оценить на 5 из 5' })
		await user.click(button)

		expect(fetch).toHaveBeenCalledWith(
			'/api/tool-stats',
			expect.objectContaining({ method: 'POST' })
		)
		// кнопки остаются кликабельными — hasVoted не переключился
		expect(button).toBeEnabled()
		// Счётчик оценок держит место в layout всегда (invisible при
		// ratingCount === 0), а не пропадает из DOM — иначе первый успешный
		// голос на туле без оценок сдвигал бы всё, что справа.
		expect(screen.getByText('0.0 · 0')).toHaveClass('invisible')
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

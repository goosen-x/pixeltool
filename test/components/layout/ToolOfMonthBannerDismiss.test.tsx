import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToolOfMonthBannerDismiss } from '@/components/layout/ToolOfMonthBannerDismiss'

// Ключ хранилища компонент считает сам на клиенте (а не берёт пропом с сервера,
// который может быть из ISR-кэша прошлого месяца), поэтому дату фиксируем.
describe('ToolOfMonthBannerDismiss', () => {
	beforeEach(() => {
		localStorage.clear()
		vi.useFakeTimers({ shouldAdvanceTime: true })
		vi.setSystemTime(new Date('2026-08-18T12:00:00.000Z'))
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('показывает содержимое, если баннер ещё не закрывали в этом месяце', () => {
		render(
			<ToolOfMonthBannerDismiss>
				<span>Контент баннера</span>
			</ToolOfMonthBannerDismiss>
		)

		expect(screen.getByText('Контент баннера')).toBeInTheDocument()
	})

	it('не показывает содержимое, если флаг закрытия уже стоит для этого месяца', () => {
		localStorage.setItem('pixeltool:tool-of-month-dismissed:2026-08', '1')

		render(
			<ToolOfMonthBannerDismiss>
				<span>Контент баннера</span>
			</ToolOfMonthBannerDismiss>
		)

		expect(screen.queryByText('Контент баннера')).not.toBeInTheDocument()
	})

	it('показывает содержимое, если флаг стоит для другого месяца', () => {
		localStorage.setItem('pixeltool:tool-of-month-dismissed:2026-07', '1')

		render(
			<ToolOfMonthBannerDismiss>
				<span>Контент баннера</span>
			</ToolOfMonthBannerDismiss>
		)

		expect(screen.getByText('Контент баннера')).toBeInTheDocument()
	})

	it('после смены месяца старый флаг больше не прячет баннер', () => {
		localStorage.setItem('pixeltool:tool-of-month-dismissed:2026-08', '1')
		vi.setSystemTime(new Date('2026-09-01T00:00:00.000Z'))

		render(
			<ToolOfMonthBannerDismiss>
				<span>Контент баннера</span>
			</ToolOfMonthBannerDismiss>
		)

		expect(screen.getByText('Контент баннера')).toBeInTheDocument()
	})

	it('клик по крестику скрывает баннер и ставит флаг в localStorage', async () => {
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
		render(
			<ToolOfMonthBannerDismiss>
				<span>Контент баннера</span>
			</ToolOfMonthBannerDismiss>
		)

		await user.click(screen.getByRole('button', { name: 'Закрыть' }))

		expect(screen.queryByText('Контент баннера')).not.toBeInTheDocument()
		expect(
			localStorage.getItem('pixeltool:tool-of-month-dismissed:2026-08')
		).toBe('1')
	})

	it('рендерит содержимое в разметке сразу (без hide-then-reveal — нет сдвига)', () => {
		const { container } = render(
			<ToolOfMonthBannerDismiss>
				<span>Контент баннера</span>
			</ToolOfMonthBannerDismiss>
		)

		// Инлайн-скрипт, который прячет уже закрытый баннер ДО первой отрисовки,
		// стоит первым ребёнком — иначе он не успеет отработать до paint.
		const banner = container.querySelector('#tool-of-month-banner')
		expect(banner).not.toBeNull()
		expect(banner?.firstElementChild?.tagName).toBe('SCRIPT')
		expect(banner?.firstElementChild?.innerHTML).toContain(
			'pixeltool:tool-of-month-dismissed:'
		)
	})
})

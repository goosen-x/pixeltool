import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToolOfMonthBannerDismiss } from '@/components/layout/ToolOfMonthBannerDismiss'

describe('ToolOfMonthBannerDismiss', () => {
	beforeEach(() => {
		localStorage.clear()
	})

	it('показывает содержимое, если баннер ещё не закрывали в этом месяце', () => {
		render(
			<ToolOfMonthBannerDismiss yearMonth='2026-08'>
				<span>Контент баннера</span>
			</ToolOfMonthBannerDismiss>
		)

		expect(screen.getByText('Контент баннера')).toBeInTheDocument()
	})

	it('не показывает содержимое, если флаг закрытия уже стоит для этого месяца', () => {
		localStorage.setItem('pixeltool:tool-of-month-dismissed:2026-08', '1')

		render(
			<ToolOfMonthBannerDismiss yearMonth='2026-08'>
				<span>Контент баннера</span>
			</ToolOfMonthBannerDismiss>
		)

		expect(screen.queryByText('Контент баннера')).not.toBeInTheDocument()
	})

	it('показывает содержимое, если флаг стоит для другого месяца', () => {
		localStorage.setItem('pixeltool:tool-of-month-dismissed:2026-07', '1')

		render(
			<ToolOfMonthBannerDismiss yearMonth='2026-08'>
				<span>Контент баннера</span>
			</ToolOfMonthBannerDismiss>
		)

		expect(screen.getByText('Контент баннера')).toBeInTheDocument()
	})

	it('клик по крестику скрывает баннер и ставит флаг в localStorage', async () => {
		const user = userEvent.setup()
		render(
			<ToolOfMonthBannerDismiss yearMonth='2026-08'>
				<span>Контент баннера</span>
			</ToolOfMonthBannerDismiss>
		)

		await user.click(screen.getByRole('button', { name: 'Закрыть' }))

		expect(screen.queryByText('Контент баннера')).not.toBeInTheDocument()
		expect(
			localStorage.getItem('pixeltool:tool-of-month-dismissed:2026-08')
		).toBe('1')
	})
})

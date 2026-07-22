import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Header from '@/components/layout/Header/Header'

// Mock next/link
vi.mock('next/link', () => ({
	default: ({ children, href, ...rest }: any) => (
		<a href={href} {...rest}>
			{children}
		</a>
	)
}))

const mockPush = vi.fn()
let mockPathname = '/'

vi.mock('next/navigation', () => ({
	usePathname: () => mockPathname,
	useRouter: () => ({ push: mockPush })
}))

describe('Header navigation', () => {
	beforeEach(() => {
		mockPathname = '/'
		mockPush.mockClear()
	})

	it('renders main navigation links', () => {
		render(<Header />)

		expect(screen.getByRole('link', { name: 'Главная' })).toHaveAttribute(
			'href',
			'/'
		)
		expect(screen.getByRole('link', { name: 'Инструменты' })).toHaveAttribute(
			'href',
			'/tools'
		)
		expect(screen.getByRole('link', { name: 'Блог' })).toHaveAttribute(
			'href',
			'/blog'
		)
		expect(screen.getByRole('link', { name: 'Контакты' })).toHaveAttribute(
			'href',
			'/contact'
		)
	})

	it('highlights active navigation item', () => {
		mockPathname = '/tools'

		render(<Header />)

		const toolsLink = screen.getByRole('link', { name: 'Инструменты' })
		expect(toolsLink).toHaveClass('bg-primary', 'text-primary-foreground')
		expect(toolsLink).toHaveAttribute('aria-current', 'page')
	})

	it('shows mobile menu with the same nav items when the burger button is clicked', async () => {
		const user = userEvent.setup()
		render(<Header />)

		const menuButton = screen.getByRole('button', { name: 'Открыть меню' })
		await user.click(menuButton)

		const mobileNav = screen.getByRole('navigation', {
			name: 'Основная навигация'
		})
		expect(
			within(mobileNav).getByRole('link', { name: /Инструменты/ })
		).toHaveAttribute('href', '/tools')
	})

	it('renders logo with a link to the homepage', () => {
		render(<Header />)

		const logoLink = screen.getByRole('link', { name: /PixelTool/i })
		expect(logoLink).toHaveAttribute('href', '/')
	})
})

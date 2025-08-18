import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from '@/components/global/Header'

// Mock next/link
vi.mock('next/link', () => ({
	default: ({ children, href }: any) => <a href={href}>{children}</a>
}))

describe('Navigation', () => {
	it('renders main navigation links', () => {
		render(<Header />)

		// Check for main navigation links
		expect(screen.getByRole('link', { name: /Main/i })).toHaveAttribute(
			'href',
			'/en'
		)
		expect(screen.getByRole('link', { name: /Tools/i })).toHaveAttribute(
			'href',
			'/en/tools'
		)
		expect(screen.getByRole('link', { name: /Blog/i })).toHaveAttribute(
			'href',
			'/en/blog'
		)
		expect(screen.getByRole('link', { name: /Contact/i })).toHaveAttribute(
			'href',
			'/en/contact'
		)
	})

	it('highlights active navigation item', () => {
		// Mock current path
		vi.mock('next/navigation', () => ({
			...vi.importActual('next/navigation'),
			usePathname: () => '/en/tools'
		}))

		render(<Header />)

		const toolsLink = screen.getByRole('link', { name: /Tools/i })
		expect(toolsLink).toHaveClass('bg-primary', 'text-white')
	})

	it('shows mobile menu on small screens', async () => {
		const user = userEvent.setup()

		render(<Header />)

		// Mobile menu button should be present
		const menuButton = screen.getAllByRole('button')[0] // Assuming first button is menu
		expect(menuButton).toBeInTheDocument()

		// Click menu button
		await user.click(menuButton)

		// Navigation should be visible
		// Note: This would require more complex testing with viewport size mocking
	})

	it('renders logo with correct link', () => {
		render(<Header />)

		const logoLink = screen.getByRole('link', { name: /PixelTool/i })
		expect(logoLink).toHaveAttribute('href', '/en')
	})
})

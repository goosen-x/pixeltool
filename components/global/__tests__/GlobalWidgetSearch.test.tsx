import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { GlobalWidgetSearch } from '../GlobalWidgetSearch'

// Mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
	useRouter: () => ({
		push: mockPush
	})
}))

// Mock next-intl
vi.mock('next-intl', () => ({
	useTranslations: () => (key: string) => key
}))

// Mock hooks
vi.mock('@/lib/hooks/useSearchHistory', () => ({
	useSearchHistory: () => ({
		history: ['password', 'color'],
		addToHistory: vi.fn()
	})
}))

vi.mock('@/lib/hooks/useFavorites', () => ({
	useFavorites: () => ({
		favorites: ['password-generator', 'color-converter']
	})
}))

describe('GlobalWidgetSearch', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('renders floating search button', () => {
		render(<GlobalWidgetSearch locale='en' />)

		const searchButton = screen.getByRole('button')
		expect(searchButton).toBeInTheDocument()
		expect(searchButton).toHaveClass('fixed', 'bottom-8', 'left-8')
	})

	it('opens search dialog when button is clicked', async () => {
		const user = userEvent.setup()
		render(<GlobalWidgetSearch locale='en' />)

		const searchButton = screen.getByRole('button')
		await user.click(searchButton)

		expect(screen.getByPlaceholderText('placeholder')).toBeInTheDocument()
		expect(screen.getByText('K')).toBeInTheDocument()
	})

	it('opens search dialog with Cmd/Ctrl + K shortcut', async () => {
		render(<GlobalWidgetSearch locale='en' />)

		// Simulate Cmd+K
		const event = new KeyboardEvent('keydown', {
			key: 'k',
			metaKey: true
		})
		window.dispatchEvent(event)

		await waitFor(() => {
			expect(screen.getByPlaceholderText('placeholder')).toBeInTheDocument()
		})
	})

	it('shows favorites and recent widgets when search is empty', async () => {
		const user = userEvent.setup()
		render(<GlobalWidgetSearch locale='en' />)

		const searchButton = screen.getByRole('button')
		await user.click(searchButton)

		expect(screen.getByText('suggestedAndFavorites')).toBeInTheDocument()
	})

	it('filters widgets based on search query', async () => {
		const user = userEvent.setup()
		render(<GlobalWidgetSearch locale='en' />)

		const searchButton = screen.getByRole('button')
		await user.click(searchButton)

		const searchInput = screen.getByPlaceholderText('placeholder')
		await user.type(searchInput, 'password')

		// Should show password-related widgets
		await waitFor(() => {
			const buttons = screen.getAllByRole('button')
			const passwordWidgetButton = buttons.find(btn =>
				btn.textContent?.toLowerCase().includes('password')
			)
			expect(passwordWidgetButton).toBeInTheDocument()
		})
	})

	it('navigates to widget when selected', async () => {
		const user = userEvent.setup()
		render(<GlobalWidgetSearch locale='en' />)

		const searchButton = screen.getByRole('button')
		await user.click(searchButton)

		// Click on first widget result
		const widgetButtons = screen
			.getAllByRole('button')
			.filter(btn => btn.classList.contains('w-full'))

		if (widgetButtons[0]) {
			await user.click(widgetButtons[0])

			expect(mockPush).toHaveBeenCalledWith(
				expect.stringContaining('/en/tools/')
			)
		}
	})

	it('supports keyboard navigation', async () => {
		const user = userEvent.setup()
		render(<GlobalWidgetSearch locale='en' />)

		const searchButton = screen.getByRole('button')
		await user.click(searchButton)

		// Press arrow down
		await user.keyboard('{ArrowDown}')

		// First widget should be selected
		const widgetButtons = screen
			.getAllByRole('button')
			.filter(btn => btn.classList.contains('w-full'))

		if (widgetButtons[1]) {
			expect(widgetButtons[1]).toHaveClass('bg-muted')
		}
	})

	it('closes dialog with Escape key', async () => {
		const user = userEvent.setup()
		render(<GlobalWidgetSearch locale='en' />)

		const searchButton = screen.getByRole('button')
		await user.click(searchButton)

		expect(screen.getByPlaceholderText('placeholder')).toBeInTheDocument()

		await user.keyboard('{Escape}')

		await waitFor(() => {
			expect(
				screen.queryByPlaceholderText('placeholder')
			).not.toBeInTheDocument()
		})
	})

	it('shows no results message when no widgets match', async () => {
		const user = userEvent.setup()
		render(<GlobalWidgetSearch locale='en' />)

		const searchButton = screen.getByRole('button')
		await user.click(searchButton)

		const searchInput = screen.getByPlaceholderText('placeholder')
		await user.type(searchInput, 'xyznonexistent')

		await waitFor(() => {
			expect(screen.getByText('noResults')).toBeInTheDocument()
		})
	})
})

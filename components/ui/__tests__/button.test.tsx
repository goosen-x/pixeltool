import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../button'

describe('Button', () => {
	it('renders children correctly', () => {
		render(<Button>Click me</Button>)
		expect(screen.getByRole('button')).toHaveTextContent('Click me')
	})

	it('applies variant classes correctly', () => {
		const { rerender } = render(<Button variant='default'>Default</Button>)
		expect(screen.getByRole('button')).toHaveClass('bg-primary')

		rerender(<Button variant='destructive'>Destructive</Button>)
		expect(screen.getByRole('button')).toHaveClass('bg-destructive')

		rerender(<Button variant='outline'>Outline</Button>)
		expect(screen.getByRole('button')).toHaveClass('border')

		rerender(<Button variant='ghost'>Ghost</Button>)
		expect(screen.getByRole('button')).toHaveClass('hover:bg-accent')
	})

	it('applies size classes correctly', () => {
		const { rerender } = render(<Button size='default'>Default</Button>)
		expect(screen.getByRole('button')).toHaveClass('h-10')

		rerender(<Button size='sm'>Small</Button>)
		expect(screen.getByRole('button')).toHaveClass('h-9')

		rerender(<Button size='lg'>Large</Button>)
		expect(screen.getByRole('button')).toHaveClass('h-11')

		rerender(<Button size='icon'>Icon</Button>)
		expect(screen.getByRole('button')).toHaveClass('h-10', 'w-10')
	})

	it('handles click events', async () => {
		const user = userEvent.setup()
		let clicked = false
		const handleClick = () => {
			clicked = true
		}

		render(<Button onClick={handleClick}>Click me</Button>)

		await user.click(screen.getByRole('button'))
		expect(clicked).toBe(true)
	})

	it('can be disabled', () => {
		render(<Button disabled>Disabled</Button>)
		const button = screen.getByRole('button')

		expect(button).toBeDisabled()
		expect(button).toHaveClass(
			'disabled:pointer-events-none',
			'disabled:opacity-50'
		)
	})

	it('renders as child when asChild is true', () => {
		render(
			<Button asChild>
				<a href='/test'>Link Button</a>
			</Button>
		)

		const link = screen.getByRole('link')
		expect(link).toHaveAttribute('href', '/test')
		expect(link).toHaveTextContent('Link Button')
	})
})

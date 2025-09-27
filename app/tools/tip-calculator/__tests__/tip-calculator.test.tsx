import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TipCalculatorPage from '../page'

describe('TipCalculator', () => {
	beforeEach(() => {
		render(<TipCalculatorPage />)
	})

	it('renders all main components', () => {
		expect(screen.getByText('title')).toBeInTheDocument()
		expect(screen.getByText('description')).toBeInTheDocument()
		expect(screen.getByText('inputSection')).toBeInTheDocument()
		expect(screen.getByText('results')).toBeInTheDocument()
	})

	it('calculates tip correctly with default values', () => {
		// Default: $100 bill, 15% tip
		expect(screen.getByText('$15.00')).toBeInTheDocument() // Tip amount
		expect(screen.getByText('$115.00')).toBeInTheDocument() // Total with tip
	})

	it('updates calculations when bill amount changes', async () => {
		const user = userEvent.setup()
		const billInput = screen.getByLabelText('billAmount')

		await user.clear(billInput)
		await user.type(billInput, '200')

		// 15% of $200 = $30
		expect(screen.getByText('$30.00')).toBeInTheDocument()
		expect(screen.getByText('$230.00')).toBeInTheDocument()
	})

	it('updates calculations when tip percentage changes', async () => {
		const user = userEvent.setup()

		// Click 20% preset button
		const twentyPercentButton = screen.getByRole('button', { name: '20%' })
		await user.click(twentyPercentButton)

		// 20% of $100 = $20
		expect(screen.getByText('$20.00')).toBeInTheDocument()
		expect(screen.getByText('$120.00')).toBeInTheDocument()
	})

	it('allows custom tip percentage', async () => {
		const user = userEvent.setup()
		const customTipInput = screen.getByPlaceholderText('customTip')

		await user.type(customTipInput, '12.5')

		// 12.5% of $100 = $12.50
		expect(screen.getByText('$12.50')).toBeInTheDocument()
		expect(screen.getByText('$112.50')).toBeInTheDocument()
	})

	it('splits bill among multiple people', async () => {
		const user = userEvent.setup()
		const peopleInput = screen.getByLabelText('numberOfPeople')

		await user.clear(peopleInput)
		await user.type(peopleInput, '4')

		// $100 bill, 15% tip = $115 total
		// Split 4 ways: $28.75 per person
		expect(screen.getByText('perPerson')).toBeInTheDocument()
		expect(screen.getAllByText('$3.75')[0]).toBeInTheDocument() // Tip per person
		expect(screen.getAllByText('$28.75')[0]).toBeInTheDocument() // Total per person
	})

	it('handles zero bill amount gracefully', async () => {
		const user = userEvent.setup()
		const billInput = screen.getByLabelText('billAmount')

		await user.clear(billInput)
		await user.type(billInput, '0')

		expect(screen.getByText('$0.00')).toBeInTheDocument()
	})

	it('handles invalid input gracefully', async () => {
		const user = userEvent.setup()
		const billInput = screen.getByLabelText('billAmount')

		await user.clear(billInput)
		await user.type(billInput, 'abc')

		// Should show $0.00 for invalid input
		expect(screen.getByText('$0.00')).toBeInTheDocument()
	})

	it('updates slider when percentage changes', async () => {
		const user = userEvent.setup()
		const slider = screen.getByRole('slider')

		// Slider should start at 15%
		expect(slider).toHaveAttribute('aria-valuenow', '15')

		// Click 25% button
		const twentyFiveButton = screen.getByRole('button', { name: '25%' })
		await user.click(twentyFiveButton)

		// Slider should update to 25%
		expect(slider).toHaveAttribute('aria-valuenow', '25')
	})

	it('displays tip guide', () => {
		expect(screen.getByText('tipGuide.title')).toBeInTheDocument()
		expect(screen.getByText('10-15%')).toBeInTheDocument()
		expect(screen.getByText('15-20%')).toBeInTheDocument()
		expect(screen.getByText('20%+')).toBeInTheDocument()
	})
})

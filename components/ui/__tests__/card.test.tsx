import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '../card'

describe('Card Components', () => {
  describe('Card', () => {
    it('renders with default classes', () => {
      render(<Card data-testid="card">Card content</Card>)
      const card = screen.getByTestId('card')
      
      expect(card).toHaveClass('rounded-lg', 'border', 'bg-card', 'text-card-foreground', 'shadow-sm')
    })

    it('accepts custom className', () => {
      render(<Card className="custom-class" data-testid="card">Content</Card>)
      const card = screen.getByTestId('card')
      
      expect(card).toHaveClass('custom-class')
    })
  })

  describe('CardHeader', () => {
    it('renders with correct spacing', () => {
      render(<CardHeader data-testid="header">Header content</CardHeader>)
      const header = screen.getByTestId('header')
      
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6')
    })
  })

  describe('CardTitle', () => {
    it('renders as h3 by default', () => {
      render(<CardTitle>Title</CardTitle>)
      const title = screen.getByText('Title')
      
      expect(title.tagName).toBe('H3')
      expect(title).toHaveClass('text-2xl', 'font-semibold', 'leading-none', 'tracking-tight')
    })
  })

  describe('CardDescription', () => {
    it('renders with correct styling', () => {
      render(<CardDescription>Description text</CardDescription>)
      const description = screen.getByText('Description text')
      
      expect(description).toHaveClass('text-sm', 'text-muted-foreground')
    })
  })

  describe('CardContent', () => {
    it('renders with correct padding', () => {
      render(<CardContent data-testid="content">Content</CardContent>)
      const content = screen.getByTestId('content')
      
      expect(content).toHaveClass('p-6', 'pt-0')
    })
  })

  describe('CardFooter', () => {
    it('renders with flex layout', () => {
      render(<CardFooter data-testid="footer">Footer</CardFooter>)
      const footer = screen.getByTestId('footer')
      
      expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0')
    })
  })

  describe('Complete Card', () => {
    it('renders a complete card structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
            <CardDescription>This is a test card</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card content goes here</p>
          </CardContent>
          <CardFooter>
            <button>Action</button>
          </CardFooter>
        </Card>
      )

      expect(screen.getByText('Test Card')).toBeInTheDocument()
      expect(screen.getByText('This is a test card')).toBeInTheDocument()
      expect(screen.getByText('Card content goes here')).toBeInTheDocument()
      expect(screen.getByText('Action')).toBeInTheDocument()
    })
  })
})
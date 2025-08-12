import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { AnalyticsDashboard } from '../AnalyticsDashboard'
import { widgets } from '@/lib/constants/widgets'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key
}))

// Mock fetch
global.fetch = vi.fn()

describe('AnalyticsDashboard', () => {
  const mockWidgets = widgets.slice(0, 3) // Use first 3 widgets for testing
  
  const mockStats = {
    viewsToday: 150,
    totalViews: 5000,
    uniqueSessionsToday: 75,
    totalSessions: 2500,
    averageSessionDuration: '2m 30s',
    averageSessionSeconds: 150,
    onlineUsers: 5,
    hourlyViews: Array.from({ length: 24 }, (_, i) => ({ hour: i, views: Math.floor(Math.random() * 100) })),
    timeframe: '7d'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockStats
    })
  })

  it('renders overview cards with total stats', async () => {
    render(<AnalyticsDashboard widgets={mockWidgets} locale="en" />)
    
    await waitFor(() => {
      expect(screen.getByText('totalViews')).toBeInTheDocument()
      expect(screen.getByText('totalSessions')).toBeInTheDocument()
      expect(screen.getByText('avgDuration')).toBeInTheDocument()
      expect(screen.getByText('onlineNow')).toBeInTheDocument()
    })
  })

  it('displays top widgets section', async () => {
    render(<AnalyticsDashboard widgets={mockWidgets} locale="en" />)
    
    await waitFor(() => {
      expect(screen.getByText('topWidgets')).toBeInTheDocument()
    })
  })

  it('allows switching between timeframes', async () => {
    const user = userEvent.setup()
    render(<AnalyticsDashboard widgets={mockWidgets} locale="en" />)
    
    // Click on timeframe selector
    const timeframeSelector = screen.getByRole('combobox')
    await user.click(timeframeSelector)
    
    // Select 30 days option
    const option30d = screen.getByText('last30Days')
    await user.click(option30d)
    
    // Verify fetch was called with new timeframe
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('timeframe=30d')
      )
    })
  })

  it('allows selecting a widget to view detailed stats', async () => {
    const user = userEvent.setup()
    render(<AnalyticsDashboard widgets={mockWidgets} locale="en" />)
    
    await waitFor(() => {
      expect(screen.getByText('selectWidget')).toBeInTheDocument()
    })
    
    // Click on first widget button
    const firstWidgetButton = screen.getAllByRole('button').find(btn => 
      btn.textContent?.includes('widgets.')
    )
    
    if (firstWidgetButton) {
      await user.click(firstWidgetButton)
      
      await waitFor(() => {
        expect(screen.getByText('performance')).toBeInTheDocument()
        expect(screen.getByText('hourlyViews')).toBeInTheDocument()
      })
    }
  })

  it('switches between widget analytics and trends tabs', async () => {
    const user = userEvent.setup()
    render(<AnalyticsDashboard widgets={mockWidgets} locale="en" />)
    
    await waitFor(() => {
      expect(screen.getByText('widgetAnalytics')).toBeInTheDocument()
    })
    
    // Click on trends tab
    const trendsTab = screen.getByText('trends')
    await user.click(trendsTab)
    
    await waitFor(() => {
      expect(screen.getByText('usageTrends')).toBeInTheDocument()
    })
  })

  it('handles API errors gracefully', async () => {
    ;(global.fetch as any).mockRejectedValueOnce(new Error('API Error'))
    
    render(<AnalyticsDashboard widgets={mockWidgets} locale="en" />)
    
    // Should still render without crashing
    await waitFor(() => {
      expect(screen.getByText('totalViews')).toBeInTheDocument()
    })
  })
})
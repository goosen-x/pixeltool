'use client'

import { useEffect } from 'react'
import { useAnalytics } from '@/lib/hooks/useAnalytics'

interface WidgetAnalyticsWrapperProps {
  widgetId: string
  children: React.ReactNode
}

export function WidgetAnalyticsWrapper({ widgetId, children }: WidgetAnalyticsWrapperProps) {
  const { trackView } = useAnalytics(widgetId)
  
  useEffect(() => {
    // Track page view when widget is loaded
    trackView()
  }, [trackView])
  
  return <>{children}</>
}
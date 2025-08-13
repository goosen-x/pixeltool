'use client'

import { useAnalytics } from '@/lib/hooks/useAnalytics'

interface WidgetAnalyticsWrapperProps {
  widgetId: string
  children: React.ReactNode
}

export function WidgetAnalyticsWrapper({ widgetId, children }: WidgetAnalyticsWrapperProps) {
  // useAnalytics already tracks view on mount, no need to track again
  useAnalytics(widgetId)
  
  return <>{children}</>
}
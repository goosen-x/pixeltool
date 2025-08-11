'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useLocale } from 'next-intl'

// Generate a session ID that persists for the browser session
const getSessionId = () => {
  if (typeof window === 'undefined') return ''
  
  let sessionId = sessionStorage.getItem('analytics-session-id')
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36)
    sessionStorage.setItem('analytics-session-id', sessionId)
  }
  return sessionId
}

interface AnalyticsEvent {
  sessionId: string
  widgetId: string
  eventType: 'view' | 'session_start' | 'session_end' | 'action'
  locale?: string
  metadata?: Record<string, any>
}

export function useAnalytics(widgetId: string) {
  const locale = useLocale()
  const sessionStartTime = useRef<number>(Date.now())
  const sessionId = useRef<string>('')
  const hasTrackedView = useRef<boolean>(false)

  // Initialize session ID
  useEffect(() => {
    sessionId.current = getSessionId()
  }, [])

  // Track analytics event
  const trackEvent = useCallback(async (eventType: AnalyticsEvent['eventType'], metadata?: Record<string, any>) => {
    try {
      if (!sessionId.current) return

      const event: AnalyticsEvent = {
        sessionId: sessionId.current,
        widgetId,
        eventType,
        locale,
        metadata: {
          ...metadata,
          userAgent: navigator.userAgent,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          timestamp: new Date().toISOString()
        }
      }

      // Send to API (don't await to avoid blocking)
      console.log('📊 Sending analytics event:', event)
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      })
        .then(res => {
          console.log('📊 Analytics response:', res.status)
          return res.json()
        })
        .then(data => {
          console.log('📊 Analytics data:', data)
        })
        .catch(error => {
          console.warn('Analytics tracking failed:', error)
        })
    } catch (error) {
      console.warn('Analytics tracking error:', error)
    }
  }, [widgetId, locale])

  // Track page view
  const trackView = useCallback(() => {
    if (!hasTrackedView.current) {
      trackEvent('view')
      hasTrackedView.current = true
    }
  }, [trackEvent])

  // Track session start
  const trackSessionStart = useCallback(() => {
    sessionStartTime.current = Date.now()
    trackEvent('session_start')
  }, [trackEvent])

  // Track session end
  const trackSessionEnd = useCallback(() => {
    const sessionDuration = Date.now() - sessionStartTime.current
    trackEvent('session_end', { 
      sessionDuration: Math.round(sessionDuration / 1000) // in seconds
    })
  }, [trackEvent])

  // Track custom action
  const trackAction = useCallback((actionName: string, metadata?: Record<string, any>) => {
    trackEvent('action', { action: actionName, ...metadata })
  }, [trackEvent])

  // Auto-track view and session start on mount
  useEffect(() => {
    if (widgetId) {
      trackView()
      trackSessionStart()

      // Track session end on page unload
      const handleBeforeUnload = () => {
        trackSessionEnd()
      }

      // Track session end on visibility change (when tab becomes hidden)
      const handleVisibilityChange = () => {
        if (document.hidden) {
          trackSessionEnd()
        }
      }

      window.addEventListener('beforeunload', handleBeforeUnload)
      document.addEventListener('visibilitychange', handleVisibilityChange)

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        trackSessionEnd()
      }
    }
  }, [widgetId, trackView, trackSessionStart, trackSessionEnd])

  return {
    trackEvent,
    trackView,
    trackAction,
    trackSessionStart,
    trackSessionEnd,
    sessionId: sessionId.current
  }
}
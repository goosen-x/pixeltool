'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

// Generate or get session ID
const getSessionId = () => {
  if (typeof window === 'undefined') return ''
  
  const SESSION_KEY = 'analytics_session_id'
  const TAB_KEY = 'analytics_tab_id'
  const SESSION_DURATION = 30 * 60 * 1000 // 30 minutes
  
  // Get or generate tab ID (unique per tab)
  let tabId = sessionStorage.getItem(TAB_KEY)
  if (!tabId) {
    tabId = Math.random().toString(36).substring(2) + '_tab_' + Date.now().toString(36)
    sessionStorage.setItem(TAB_KEY, tabId)
  }
  
  // Get or generate session ID (shared across tabs, but we'll append tab ID)
  const stored = localStorage.getItem(SESSION_KEY)
  let sessionId = ''
  
  if (stored) {
    const { id, timestamp } = JSON.parse(stored)
    if (Date.now() - timestamp < SESSION_DURATION) {
      sessionId = id
    }
  }
  
  if (!sessionId) {
    // Generate new session ID
    sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36)
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      id: sessionId,
      timestamp: Date.now()
    }))
  }
  
  // Combine session ID with tab ID for unique identification
  return `${sessionId}_${tabId}`
}

interface AnalyticsTrackerProps {
  widgetId: string
}

export function AnalyticsTracker({ widgetId }: AnalyticsTrackerProps) {
  const pathname = usePathname()
  const trackedRef = useRef(false)
  const sessionIdRef = useRef('')
  
  useEffect(() => {
    // Only track once per page load
    if (trackedRef.current) return
    trackedRef.current = true
    
    // Get or create session ID
    const sessionId = getSessionId()
    sessionIdRef.current = sessionId
    
    // Track page view
    const trackEvent = async (eventType: string, metadata = {}) => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            widgetId,
            sessionId,
            eventType,
            metadata: {
              ...metadata,
              pathname,
              timestamp: new Date().toISOString()
            }
          })
        })
      } catch (error) {
        console.error('Failed to track analytics:', error)
      }
    }
    
    // Track initial view
    trackEvent('view')
    
    // Track session start (per tab)
    const TAB_SESSION_KEY = `session_started_${sessionId}`
    const isNewSession = !sessionStorage.getItem(TAB_SESSION_KEY)
    if (isNewSession) {
      trackEvent('session_start')
      sessionStorage.setItem(TAB_SESSION_KEY, 'true')
    }
    
    // Track session end on page unload
    const handleUnload = () => {
      trackEvent('session_end')
    }
    
    window.addEventListener('beforeunload', handleUnload)
    
    // Track time spent on page
    let startTime = Date.now()
    const trackTimeSpent = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000)
      if (timeSpent > 5) { // Only track if spent more than 5 seconds
        trackEvent('time_spent', { seconds: timeSpent })
      }
    }
    
    // Track when page becomes hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        trackTimeSpent()
      } else {
        startTime = Date.now() // Reset when page becomes visible again
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      window.removeEventListener('beforeunload', handleUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      trackTimeSpent()
    }
  }, [widgetId, pathname])
  
  return null
}
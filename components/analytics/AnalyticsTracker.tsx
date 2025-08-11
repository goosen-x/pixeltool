'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

// Generate or get session ID
const getSessionId = () => {
  if (typeof window === 'undefined') return ''
  
  const SESSION_KEY = 'analytics_session_id'
  const SESSION_DURATION = 30 * 60 * 1000 // 30 minutes
  
  const stored = sessionStorage.getItem(SESSION_KEY)
  if (stored) {
    const { id, timestamp } = JSON.parse(stored)
    if (Date.now() - timestamp < SESSION_DURATION) {
      return id
    }
  }
  
  // Generate new session ID
  const newId = Math.random().toString(36).substring(2) + Date.now().toString(36)
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({
    id: newId,
    timestamp: Date.now()
  }))
  
  return newId
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
    
    // Track session start
    const isNewSession = !sessionStorage.getItem('session_started')
    if (isNewSession) {
      trackEvent('session_start')
      sessionStorage.setItem('session_started', 'true')
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
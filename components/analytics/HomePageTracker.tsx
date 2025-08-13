'use client'

import { useEffect, useRef } from 'react'

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

export function HomePageTracker() {
  const trackedRef = useRef(false)
  
  useEffect(() => {
    // Only track once per page load
    if (trackedRef.current) return
    trackedRef.current = true
    
    // Get or create session ID
    const sessionId = getSessionId()
    
    // Track homepage view
    const trackEvent = async () => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            widgetId: 'homepage',
            sessionId,
            eventType: 'view',
            metadata: {
              pathname: '/',
              timestamp: new Date().toISOString()
            }
          })
        })
      } catch (error) {
        console.error('Failed to track homepage analytics:', error)
      }
    }
    
    trackEvent()
    
    // Send heartbeat every 20 seconds to show we're still online
    const heartbeatInterval = setInterval(() => {
      trackEvent()
    }, 20000)
    
    return () => {
      clearInterval(heartbeatInterval)
    }
  }, [])
  
  return null
}
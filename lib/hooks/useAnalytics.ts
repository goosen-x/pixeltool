'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useLocale } from 'next-intl'
import { useCookieConsent } from './useCookieConsent'

// Generate or retrieve session ID (30 minute sessions)
const getSessionId = () => {
	if (typeof window === 'undefined') return ''

	const SESSION_DURATION = 30 * 60 * 1000 // 30 minutes
	const now = Date.now()

	const stored = localStorage.getItem('analytics_session')
	if (stored) {
		try {
			const { id, timestamp } = JSON.parse(stored)
			if (now - timestamp < SESSION_DURATION) {
				return id
			}
		} catch (e) {
			// Invalid stored data, generate new
		}
	}

	// Generate new session ID
	const newId = `session_${now}_${Math.random().toString(36).substr(2, 9)}`
	localStorage.setItem(
		'analytics_session',
		JSON.stringify({
			id: newId,
			timestamp: now
		})
	)

	return newId
}

interface AnalyticsEvent {
	sessionId: string
	widgetId: string
	eventType:
		| 'view'
		| 'use'
		| 'share'
		| 'favorite'
		| 'export'
		| 'session_start'
		| 'session_end'
		| 'action'
	locale?: string
	metadata?: Record<string, any>
}

export function useAnalytics(widgetId: string) {
	const locale = useLocale()
	const { hasConsent } = useCookieConsent()
	const sessionStartTime = useRef<number>(Date.now())
	const sessionId = useRef<string>('')
	const hasTrackedView = useRef<boolean>(false)

	// Initialize session ID
	useEffect(() => {
		sessionId.current = getSessionId()
	}, [])

	// Batch analytics events to reduce requests
	const eventQueue = useRef<AnalyticsEvent[]>([])
	const flushTimeout = useRef<NodeJS.Timeout | undefined>(undefined)
	const lastEventTime = useRef<number>(0)
	const isFlushingRef = useRef<boolean>(false)

	// Flush queue to server
	const flushEvents = useCallback(async () => {
		if (eventQueue.current.length === 0 || isFlushingRef.current) return

		isFlushingRef.current = true
		const events = [...eventQueue.current]
		eventQueue.current = []

		try {
			if (process.env.NODE_ENV === 'development') {
				console.log('📊 Flushing analytics events:', events.length)
			}

			await fetch('/api/analytics/track', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ events })
			})
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.warn('Analytics tracking failed:', error)
			}
			// Re-add failed events to queue for retry (but limit retries)
			if (events.length < 10) {
				eventQueue.current.unshift(...events)
			}
		} finally {
			isFlushingRef.current = false
		}
	}, [])

	// Track analytics event with debouncing
	const trackEvent = useCallback(
		async (
			eventType: AnalyticsEvent['eventType'],
			metadata?: Record<string, any>
		) => {
			try {
				// Check if user has given consent for analytics and not in development mode
				if (
					!hasConsent ||
					!sessionId.current ||
					process.env.NODE_ENV === 'development'
				)
					return

				const now = Date.now()

				// Debounce rapid identical events (within 500ms)
				if (eventType === 'action' && now - lastEventTime.current < 500) {
					return
				}

				lastEventTime.current = now

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

				// Add to queue
				eventQueue.current.push(event)

				// Clear existing timeout
				if (flushTimeout.current) {
					clearTimeout(flushTimeout.current)
				}

				// Flush after 2 seconds of inactivity or when queue reaches 10 events
				if (eventQueue.current.length >= 10) {
					flushEvents()
				} else {
					flushTimeout.current = setTimeout(flushEvents, 2000)
				}
			} catch (error) {
				if (process.env.NODE_ENV === 'development') {
					console.warn('Analytics tracking error:', error)
				}
			}
		},
		[widgetId, locale, hasConsent, flushEvents]
	)

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
	const trackAction = useCallback(
		(actionName: string, metadata?: Record<string, any>) => {
			trackEvent('action', { action: actionName, ...metadata })
		},
		[trackEvent]
	)

	// Track widget use
	const trackUse = useCallback(
		(action?: string, metadata?: Record<string, any>) => {
			trackEvent('use', { action, ...metadata })
		},
		[trackEvent]
	)

	// Track share event
	const trackShare = useCallback(
		(platform?: string, metadata?: Record<string, any>) => {
			trackEvent('share', { platform, ...metadata })
		},
		[trackEvent]
	)

	// Track favorite toggle
	const trackFavorite = useCallback(
		(isFavorite: boolean, metadata?: Record<string, any>) => {
			trackEvent('favorite', { isFavorite, ...metadata })
		},
		[trackEvent]
	)

	// Track export event
	const trackExport = useCallback(
		(format?: string, metadata?: Record<string, any>) => {
			trackEvent('export', { format, ...metadata })
		},
		[trackEvent]
	)

	// Auto-track view and session start on mount
	useEffect(() => {
		if (widgetId && !hasTrackedView.current) {
			// Track view only once
			trackEvent('view')
			hasTrackedView.current = true

			// Track session start
			sessionStartTime.current = Date.now()
			trackEvent('session_start')

			// Track session end on page unload
			const handleBeforeUnload = () => {
				// Flush remaining events before page unload
				if (eventQueue.current.length > 0) {
					flushEvents()
				}
				const sessionDuration = Date.now() - sessionStartTime.current
				trackEvent('session_end', {
					sessionDuration: Math.round(sessionDuration / 1000) // in seconds
				})
			}

			// Track session end on visibility change (when tab becomes hidden)
			const handleVisibilityChange = () => {
				if (document.hidden) {
					// Flush remaining events when tab becomes hidden
					if (eventQueue.current.length > 0) {
						flushEvents()
					}
					const sessionDuration = Date.now() - sessionStartTime.current
					trackEvent('session_end', {
						sessionDuration: Math.round(sessionDuration / 1000) // in seconds
					})
				}
			}

			window.addEventListener('beforeunload', handleBeforeUnload)
			document.addEventListener('visibilitychange', handleVisibilityChange)

			return () => {
				window.removeEventListener('beforeunload', handleBeforeUnload)
				document.removeEventListener('visibilitychange', handleVisibilityChange)

				// Flush any remaining events on cleanup
				if (eventQueue.current.length > 0) {
					flushEvents()
				}

				const sessionDuration = Date.now() - sessionStartTime.current
				trackEvent('session_end', {
					sessionDuration: Math.round(sessionDuration / 1000) // in seconds
				})
			}
		}
	}, [widgetId, trackEvent, flushEvents])

	return {
		trackEvent,
		trackView,
		trackAction,
		trackUse,
		trackShare,
		trackFavorite,
		trackExport,
		trackSessionStart,
		trackSessionEnd,
		sessionId: sessionId.current
	}
}

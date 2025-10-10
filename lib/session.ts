import { v4 as uuidv4 } from 'uuid'

const SESSION_KEY = 'pixeltool_session_id'

/**
 * Gets or creates a session ID for the current browser.
 * Session ID is stored in localStorage for persistence.
 */
export function getOrCreateSessionId(): string {
	if (typeof window === 'undefined') {
		return '' // Server-side, return empty
	}

	try {
		let sessionId = localStorage.getItem(SESSION_KEY)
		if (!sessionId) {
			sessionId = uuidv4()
			localStorage.setItem(SESSION_KEY, sessionId)
		}
		return sessionId
	} catch (e) {
		// Fallback if localStorage is unavailable
		console.warn('localStorage not available:', e)
		return uuidv4()
	}
}

/**
 * Sends a heartbeat to the server to mark this session as active.
 * Should be called periodically (e.g., every 60 seconds).
 */
export async function sendHeartbeat(widgetId?: string): Promise<boolean> {
	const sessionId = getOrCreateSessionId()
	if (!sessionId) return false

	try {
		const response = await fetch('/api/online/heartbeat', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ sessionId, widgetId })
		})

		const data = await response.json()
		return data.ok === true
	} catch (e) {
		console.error('Heartbeat failed:', e)
		return false
	}
}

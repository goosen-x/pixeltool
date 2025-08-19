'use client'

import { useState, useEffect } from 'react'

export function useCookieConsent() {
	const [consent, setConsent] = useState<'accepted' | 'declined' | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const stored = localStorage.getItem('cookieConsent')
		if (stored === 'accepted' || stored === 'declined') {
			setConsent(stored)
		}
		setIsLoading(false)
	}, [])

	const hasConsent = consent === 'accepted'
	const hasDeclined = consent === 'declined'
	const isUndecided = consent === null

	return {
		consent,
		hasConsent,
		hasDeclined,
		isUndecided,
		isLoading
	}
}

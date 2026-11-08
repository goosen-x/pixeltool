'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { captureAttribution } from '@/lib/attribution'

// Запоминает UTM-метки и источник перехода, чтобы отправить их с заявкой.
export default function AttributionTracker() {
	const pathname = usePathname()

	useEffect(() => {
		captureAttribution()
	}, [pathname])

	return null
}

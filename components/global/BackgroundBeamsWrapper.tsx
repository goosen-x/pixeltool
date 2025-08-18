'use client'

import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { BackgroundBeams } from '@/components/ui/background-beams'

export const BackgroundBeamsWrapper = () => {
	const isDesktop = useMediaQuery('(min-width: 768px)')

	if (!isDesktop) {
		return null
	}

	return <BackgroundBeams className='-z-10' />
}

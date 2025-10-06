'use client'

import { Block } from '@/components/ui/block'
import { Globus } from '@/components/global/Globus'

import { FaLocationDot } from 'react-icons/fa6'

import { useMediaQuery } from '@/lib/hooks/useMediaQuery'

export const LocationBlock = () => {
	const isDesktop = useMediaQuery('(min-width: 768px)')

	return (
		<Block className='hidden md:block col-span-12 md:col-span-4 relative p-0 max-h-80 overflow-hidden'>
			<p className='flex gap-3 absolute top-4 left-4 text-2xl'>
				<FaLocationDot className='text-foreground text-2xl' />
				'Россия, Москва'
			</p>
			{isDesktop && <Globus />}
		</Block>
	)
}

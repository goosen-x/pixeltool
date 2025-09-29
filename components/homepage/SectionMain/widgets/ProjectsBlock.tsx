import { Block } from '@/components/ui/block'

import Link from 'next/link'
import React from 'react'
import { FiArrowRight, FiCode } from 'react-icons/fi'

export const ProjectsBlock = () => {

	const locale = 'ru'

	return (
		<Block className='col-span-12 md:col-span-4 p-6'>
			<Link href='/tools' className='group flex flex-col h-full'>
				<div className='flex items-center gap-3 mb-3'>
					<FiCode className='w-8 h-8 text-accent' />
					<h3 className='text-xl font-semibold'>Инструменты</h3>
				</div>
				<p className='text-muted-foreground mb-4 flex-1'>
					Explore my collection of interactive tools and demos
				</p>
				<div className='flex items-center gap-2 text-accent group-hover:translate-x-2 transition-transform duration-300'>
					<span>View Tools</span>
					<FiArrowRight />
				</div>
			</Link>
		</Block>
	)
}

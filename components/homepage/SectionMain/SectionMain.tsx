'use client'

import { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

import {
	AboutBlock,
	EmailListBlock,
	HeaderBlock,
	LocationBlock,
	SocialsBlock
} from './widgets'

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1
		}
	}
}

const item = {
	hidden: { opacity: 0, y: 20 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.6,
			ease: [0.21, 1.11, 0.81, 0.99] as [number, number, number, number]
		}
	}
}

export const SectionMain = ({
	className,
	id
}: {
	className?: string
	id?: string
}) => {
	return (
		<motion.section
			id={id}
			className={cn('grid grid-cols-12 gap-4 mb-24', className)}
			initial='hidden'
			animate='show'
			variants={container}
		>
			<motion.div variants={item} className='contents'>
				<HeaderBlock />
			</motion.div>
			<motion.div variants={item} className='contents'>
				<SocialsBlock />
			</motion.div>
			<motion.div variants={item} className='contents'>
				<LocationBlock />
			</motion.div>
			<motion.div variants={item} className='contents'>
				<AboutBlock />
			</motion.div>
			<motion.div variants={item} className='contents'>
				<EmailListBlock />
			</motion.div>
		</motion.section>
	)
}

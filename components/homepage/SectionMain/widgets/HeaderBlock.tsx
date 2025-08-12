import { Block } from '@/components/ui/block'
import { useTranslations } from 'next-intl'
import { OptimizedImage } from '@/components/ui/optimized-image'
import Link from 'next/link'
import React from 'react'
import { FiArrowRight } from 'react-icons/fi'

import avatarImg from '@/public/images/avatar.jpeg'

export const HeaderBlock = () => {
	const t = useTranslations('SectionMain')

	const email = 'dmitryborisenko.msk@gmail.com'
	const subject = t('email.subject')
	const body = t('email.body')

	const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
		subject
	)}&body=${encodeURIComponent(body)}`

	return (
		<Block className='col-span-12 row-span-2 md:col-span-8'>
			<OptimizedImage
				className='group-hover/block:z-0 mb-4 size-20 rounded-full object-cover group-hover/block:w-32 group-hover/block:h-32 transition-all duration-500'
				src={avatarImg.src}
				width={500}
				height={500}
				alt='Borisenko Dmitry'
			/>
			<h1 className='mb-12 text-3xl text-foreground font-medium leading-tight'>
				{t('job')}
				<span className='text-accent text-4xl md:group-hover/block:text-5xl font-bold block transition-all duration-500'>
					{t('name')}
				</span>
			</h1>
			<Link
				className='group-hover/block:translate-x-2 transition w-fit flex items-center gap-2 text-accent/50 hover:underline duration-500'
				href={mailtoLink}
			>
				{t('contact')}{' '}
				<FiArrowRight className='group-hover/block:scale-x-150 transition-all duration-500' />
			</Link>
		</Block>
	)
}

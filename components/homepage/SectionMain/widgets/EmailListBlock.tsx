import { Block } from '@/components/ui/block'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTranslations } from 'next-intl'

import React from 'react'
import { FiMail } from 'react-icons/fi'

export const EmailListBlock = () => {
	const t = useTranslations('SectionMain')

	return (
		<Block className='col-span-12 md:col-span-4'>
			<p className='mb-3 text-lg'>{t('subscribeTitle')}</p>
			<form className='flex flex-col md:flex-row items-conter gap-2'>
				<Input type='email' placeholder={t('subscribePlaceholder')} />
				<Button className='flex gap-2'>
					<FiMail /> {t('subscribeButton')}
				</Button>
			</form>
		</Block>
	)
}

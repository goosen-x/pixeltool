import { Block } from '@/components/ui/block'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import React from 'react'
import { FiMail } from 'react-icons/fi'

export const EmailListBlock = () => {

	return (
		<Block className='col-span-12 md:col-span-4'>
			<p className='mb-3 text-lg'>Подписаться на рассылку</p>
			<form className='flex flex-col md:flex-row items-conter gap-2'>
				<Input type='email' placeholder='Введите ваш email' />
				<Button className='flex gap-2'>
					<FiMail /> Подписаться
				</Button>
			</form>
		</Block>
	)
}

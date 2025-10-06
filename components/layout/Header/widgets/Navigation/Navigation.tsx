'use client'

import React, { Dispatch, SetStateAction } from 'react'
import { LogoLink } from '../LogoLink/LogoLink'
import Link from 'next/link'

type NavigationProps = {
	burger?: boolean
	setOpen?: Dispatch<SetStateAction<boolean>>
}

export const Navigation = ({ burger = false, setOpen }: NavigationProps) => {
	const locale = 'ru'

	// Только страницы, якори убраны в ScrollSpy
	const menuItems = [
		{ title: 'Инструменты', href: '/tools' },
		{ title: 'Блог', href: '/blog' },
		{ title: 'Контакты', href: '/contact' }
	]

	return (
		<nav
			className={
				burger
					? 'grid gap-6 text-lg font-medium'
					: 'hidden flex-col gap-6 text-lg font-medium lg:flex lg:flex-row lg:items-center lg:text-sm lg:gap-6'
			}
		>
			<LogoLink />
			{menuItems.map(item => (
				<Link
					className='text-muted-foreground transition-colors hover:text-foreground'
					href={item.href}
					key={item.title}
					onClick={() => burger && setOpen && setOpen(false)}
				>
					{item.title}
				</Link>
			))}
		</nav>
	)
}

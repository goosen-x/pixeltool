'use client'

import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetTrigger
} from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { Navigation } from '../Navigation/Navigation'
import { useState } from 'react'
import ThemeToggle from '@/components/global/ThemeToggle'

export const Burger = () => {
	const [open, setOpen] = useState(false)

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant='outline' size='icon' className='shrink-0 lg:hidden'>
					<Menu className='h-5 w-5' />
					<span className='sr-only'>Toggle navigation menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side='left' className='flex flex-col gap-4 justify-between'>
				<Navigation burger setOpen={setOpen} />
				<div className='flex items-center gap-4 mt-auto'>
					<ThemeToggle />
				</div>
			</SheetContent>
		</Sheet>
	)
}
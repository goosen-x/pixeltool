'use client'

import ThemeToggle from '@/components/global/ThemeToggle'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlobalWidgetSearch } from '@/components/global/GlobalWidgetSearch'

import { Breadcrumbs } from './widgets/Breadcrumbs'
import { Navigation } from './widgets/Navigation'
import { Burger } from './widgets/Burger'
import { SearchButton } from './widgets/SearchButton'

const Header = () => {
	const [isSearchOpen, setIsSearchOpen] = useState(false)

	return (
		<header className='border-b border-border/50 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 w-full'>
			<div className='w-full px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between h-20'>
					<Breadcrumbs />
					<Navigation />
					<div className='hidden md:flex items-center gap-2'>
						<div className='h-8 w-px bg-border/50' />
						<SearchButton setIsSearchOpen={setIsSearchOpen} />
						<div className='h-8 w-px bg-border/50' />
						<ThemeToggle />
					</div>
					<Burger setIsSearchOpen={setIsSearchOpen} />
				</div>
			</div>

			{/* Global Widget Search */}
			<GlobalWidgetSearch open={isSearchOpen} onOpenChange={setIsSearchOpen} />
		</header>
	)
}

export default Header

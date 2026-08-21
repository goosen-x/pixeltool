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

	// data-site-header: якорь для measureChromeHeight() (lib/ui/chrome-height.ts)
	return (
		<header
			data-site-header
			className='border-b border-border/50 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 w-full'
		>
			<div className='w-full px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between h-20'>
					<Breadcrumbs />
					<Navigation />
					{/* Разделитель слева от поиска убран: поиск и так отделён от
					    навигации собственной рамкой, вертикальная палка рядом с ней
					    читалась как обрезок таблицы. */}
					{/* lg — тот же брейкпоинт, что у Navigation (hidden lg:flex) и
					    Burger (lg:hidden). Раньше здесь был md (768px), а у
					    навигации и бургера — lg (1024px): в промежутке 768–1023px
					    нав-ссылки уже прятались, а десктопные поиск+тема ещё
					    показывались рядом с гамбургером одновременно. */}
					<div className='hidden lg:flex items-center gap-2'>
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

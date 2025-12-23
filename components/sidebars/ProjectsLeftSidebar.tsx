'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SidebarHeader } from './widgets/SidebarHeader'
import { CategoriesNavigation } from './widgets/CategoriesNavigation'

type Props = { onLinkClick?: () => void }

export const ProjectsLeftSidebar = ({ onLinkClick }: Props = {}) => {
	const pathname = usePathname()
	const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

	const toggleCategory = (key: string) => {
		const next = new Set(collapsed)
		if (next.has(key)) {
			next.delete(key)
		} else {
			next.add(key)
		}
		setCollapsed(next)
	}

	return (
		<aside className='w-64 lg:w-56 xl:w-64 h-[calc(100vh-5rem)] lg:h-full border-r bg-background lg:bg-muted/30 backdrop-blur-sm flex-shrink-0'>
			<div className='flex h-full flex-col'>
				<SidebarHeader />

				<CategoriesNavigation
					collapsed={collapsed}
					toggleCategory={toggleCategory}
					onItemClick={onLinkClick}
				/>

				<div className='border-t p-4'>
					<Link
						href='/settings'
						onClick={onLinkClick}
						aria-current={pathname === '/settings' ? 'page' : undefined}
						className={cn(
							'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-primary/10 hover:text-primary',
							pathname === '/settings' && 'bg-primary text-white'
						)}
					>
						<Settings className='w-4 h-4' />
						<span className='flex-1 truncate text-left'>Настройки</span>
					</Link>
				</div>
			</div>
		</aside>
	)
}

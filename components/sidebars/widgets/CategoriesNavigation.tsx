'use client'

import { ComponentProps, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { widgetCategories, getWidgetsByCategory } from '@/lib/constants/widgets'
import { ToolCategory } from './ToolCategory'
import { cn } from '@/lib/utils'

type Props = {
	className?: string
	collapsed: Set<string>
	toggleCategory: (key: string) => void
	onItemClick?: () => void
}

export const CategoriesNavigation = ({
	className,
	collapsed,
	toggleCategory,
	onItemClick
}: Props) => {
	const pathname = usePathname()

	const categories = useMemo(() => {
		return Object.entries(widgetCategories)
			.map(([key, name]) => {
				const list = getWidgetsByCategory(key as keyof typeof widgetCategories)
				if (!list.length) return null
				const items = list.map(w => ({
					id: w.id,
					href: `/tools/${w.path}`,
					title: w.title ?? w.path,
					Icon: w.icon,
					active: pathname === `/tools/${w.path}`
				}))
				return {
					key,
					name,
					items,
					isCollapsed: collapsed.has(key)
				}
			})
			.filter(Boolean) as Array<{
			key: string
			name: string
			items: {
				id: string | number
				href: string
				title: string
				Icon: React.ComponentType<{ className?: string }>
				active: boolean
			}[]
			isCollapsed: boolean
		}>
	}, [pathname, collapsed])

	return (
		<nav
			className={cn(
				className,
				'flex-1 overflow-y-auto p-3 lg:p-4 projects-scroll'
			)}
			aria-label='Навигация по инструментам'
		>
			{categories.map((cat, idx) => (
				<ToolCategory
					key={cat.key}
					name={cat.name}
					items={cat.items}
					collapsed={cat.isCollapsed}
					hydrated={true}
					zIndex={10 - idx}
					onToggle={() => toggleCategory(cat.key)}
					onItemClick={onItemClick}
				/>
			))}
		</nav>
	)
}

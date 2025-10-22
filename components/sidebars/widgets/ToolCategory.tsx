'use client'

import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ToolLink } from './ToolLink'

type Item = {
	id: string | number
	href: string
	title: string
	Icon: React.ComponentType<{ className?: string }>
	active: boolean
}

type Props = {
	name: string
	items: Item[]
	collapsed: boolean
	hydrated: boolean
	zIndex?: number
	onToggle: () => void
	onItemClick?: () => void
}

export const ToolCategory = ({
	name,
	items,
	collapsed,
	hydrated,
	zIndex = 10,
	onToggle,
	onItemClick
}: Props) => {
	return (
		<div className='relative mb-2' style={{ zIndex }}>
			<button
				onClick={onToggle}
				className='w-full flex items-center justify-between mb-2 px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground hover:bg-primary/5 transition-all duration-200 rounded-md group relative z-10'
				aria-expanded={!collapsed}
				aria-controls={`cat-${name}`}
			>
				<span className='group-hover:translate-x-1 transition-transform duration-200'>
					{name}
				</span>
				<ChevronDown
					className={cn(
						'w-3 h-3 transition-all duration-300 ease-out group-hover:scale-110',
						collapsed ? 'rotate-180' : 'rotate-0'
					)}
				/>
			</button>

			<div
				id={`cat-${name}`}
				className={cn(
					'transition-all duration-300 ease-out space-y-0.5 pb-1',
					collapsed
						? 'max-h-0 opacity-0 -translate-y-2 pb-0 overflow-hidden'
						: 'opacity-100 translate-y-0'
				)}
			>
				{items.map((w, i) => (
					<ToolLink
						key={w.id}
						href={w.href}
						title={w.title ?? ''} // на случай undefined
						Icon={w.Icon}
						active={w.active}
						onClick={onItemClick}
						transitionDelayMs={collapsed || !hydrated ? 0 : i * 50}
					/>
				))}
			</div>
		</div>
	)
}

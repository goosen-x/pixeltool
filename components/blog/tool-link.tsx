'use client'

import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import * as LucideIcons from 'lucide-react'

interface ToolLinkProps {
	href: string
	title: string
	description?: string
	iconName?: string
	gradient?: string
}

export function ToolLink({
	href,
	title,
	description,
	iconName = 'Wrench',
	gradient = 'from-blue-500 to-cyan-500'
}: ToolLinkProps) {
	const isExternal = href.startsWith('http')
	const buttonText = 'Попробовать →'

	// Get icon component dynamically
	const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Wrench

	return (
		<Link
			href={href}
			target={isExternal ? '_blank' : undefined}
			rel={isExternal ? 'noopener noreferrer' : undefined}
			className='group relative block my-6 p-4 rounded-xl border-2 border-border/50 bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300'
		>
			<div className='flex items-start gap-4'>
				<div className='flex-shrink-0 mt-0.5'>
					<div
						className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}
					>
						<IconComponent className='w-6 h-6 text-white' />
					</div>
				</div>

				<div className='flex-1 min-w-0'>
					<div className='flex items-center gap-2 mb-1'>
						<h4 className='font-semibold text-foreground group-hover:text-primary transition-colors'>
							{title}
						</h4>
						{isExternal && (
							<ExternalLink className='w-4 h-4 text-muted-foreground flex-shrink-0' />
						)}
					</div>
					{description && (
						<p className='text-sm text-muted-foreground line-clamp-2'>
							{description}
						</p>
					)}
				</div>

				<div className='flex-shrink-0 flex items-center'>
					<div className='px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium group-hover:bg-primary/90 transition-colors shadow-sm'>
						{buttonText}
					</div>
				</div>
			</div>
		</Link>
	)
}

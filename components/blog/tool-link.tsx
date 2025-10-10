'use client'

import Link from 'next/link'
import { ExternalLink, Wrench } from 'lucide-react'

interface ToolLinkProps {
	href: string
	title: string
	description?: string
}

export function ToolLink({ href, title, description }: ToolLinkProps) {
	const isExternal = href.startsWith('http')
	const buttonText = 'Попробовать →'

	return (
		<Link
			href={href}
			target={isExternal ? '_blank' : undefined}
			rel={isExternal ? 'noopener noreferrer' : undefined}
			className='group relative block my-6 p-4 rounded-lg border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 hover:border-primary/40 hover:from-primary/10 hover:to-primary/15 transition-all duration-300'
		>
			<div className='flex items-start gap-3'>
				<div className='flex-shrink-0 mt-0.5'>
					<div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
						<Wrench className='w-5 h-5 text-primary' />
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

				<div className='flex-shrink-0'>
					<div className='px-3 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium group-hover:bg-primary/20 transition-colors'>
						{buttonText}
					</div>
				</div>
			</div>
		</Link>
	)
}

import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface WidgetLayoutProps {
	children: ReactNode
	className?: string
}

interface WidgetHeroProps {
	title: string
	description: string
	className?: string
}

interface WidgetCardProps {
	children: ReactNode
	className?: string
	noPadding?: boolean
	fullWidth?: boolean
}

interface WidgetSectionProps {
	children: ReactNode
	className?: string
}

// Main layout wrapper
export function WidgetLayout({ children, className }: WidgetLayoutProps) {
	return <div className={cn('space-y-8', className)}>{children}</div>
}

// Hero section for widget title and description
export function WidgetHero({ title, description, className }: WidgetHeroProps) {
	return (
		<div className={cn('text-center max-w-3xl mx-auto', className)}>
			<h1 className='text-3xl sm:text-4xl font-heading font-bold mb-3'>
				<span className='bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
					{title}
				</span>
			</h1>
			<p className='text-lg text-muted-foreground mb-8'>{description}</p>
		</div>
	)
}

// Card wrapper with modern styling
export function WidgetCard({
	children,
	className,
	noPadding = false,
	fullWidth = false
}: WidgetCardProps) {
	return (
		<div
			className={cn(
				'relative',
				fullWidth ? 'max-w-4xl mx-auto' : 'max-w-2xl mx-auto',
				className
			)}
		>
			<div className='absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-3xl' />
			<Card className='relative bg-background/60 backdrop-blur-sm border-border/50 shadow-xl'>
				{noPadding ? (
					children
				) : (
					<CardContent className='p-8'>{children}</CardContent>
				)}
			</Card>
		</div>
	)
}

// Section wrapper for widget content areas
export function WidgetSection({ children, className }: WidgetSectionProps) {
	return <div className={cn('space-y-6', className)}>{children}</div>
}

// Grid layout for options/settings
export function WidgetGrid({
	children,
	className
}: {
	children: ReactNode
	className?: string
}) {
	return (
		<div className={cn('grid gap-6 lg:grid-cols-2', className)}>{children}</div>
	)
}

// Styled card for grid items
export function WidgetGridCard({
	title,
	children,
	className
}: {
	title?: string
	children: ReactNode
	className?: string
}) {
	return (
		<Card
			className={cn(
				'bg-background/60 backdrop-blur-sm border-border/50 shadow-lg',
				className
			)}
		>
			{title && (
				<CardHeader>
					<CardTitle>{title}</CardTitle>
				</CardHeader>
			)}
			<CardContent className='space-y-6'>{children}</CardContent>
		</Card>
	)
}

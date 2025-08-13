import { Button, ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface WidgetButtonProps extends ButtonProps {
	children: ReactNode
	icon?: ReactNode
}

// Primary action button with gradient
export function WidgetPrimaryButton({ 
	children, 
	icon, 
	className, 
	size = "lg",
	...props 
}: WidgetButtonProps) {
	return (
		<Button
			size={size}
			className={cn(
				"h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90",
				"transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105",
				className
			)}
			{...props}
		>
			{icon && <span className="mr-2">{icon}</span>}
			{children}
		</Button>
	)
}

// Secondary button with outline
export function WidgetSecondaryButton({ 
	children, 
	icon, 
	className,
	size = "lg", 
	...props 
}: WidgetButtonProps) {
	return (
		<Button
			variant="outline"
			size={size}
			className={cn(
				"h-12 bg-background/80",
				"hover:bg-primary hover:text-primary-foreground hover:border-primary",
				"transition-all duration-300",
				className
			)}
			{...props}
		>
			{icon && <span className="mr-2">{icon}</span>}
			{children}
		</Button>
	)
}

// Icon button for actions
export function WidgetIconButton({ 
	children, 
	className, 
	...props 
}: ButtonProps) {
	return (
		<Button
			size="icon"
			variant="ghost"
			className={cn(
				"h-9 w-9",
				"hover:bg-primary hover:text-primary-foreground",
				"transition-colors",
				className
			)}
			{...props}
		>
			{children}
		</Button>
	)
}

// Button group wrapper
export function WidgetButtonGroup({ 
	children, 
	className 
}: { 
	children: ReactNode
	className?: string 
}) {
	return (
		<div className={cn("flex gap-3", className)}>
			{children}
		</div>
	)
}
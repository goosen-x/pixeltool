import { Input, InputProps } from '@/components/ui/input'
import { Textarea, TextareaProps } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface WidgetInputProps extends InputProps {
	icon?: React.ReactNode
	actions?: React.ReactNode
}

interface WidgetTextareaProps extends TextareaProps {
	actions?: React.ReactNode
}

// Styled input with modern design
export function WidgetInput({ 
	className, 
	icon,
	actions,
	...props 
}: WidgetInputProps) {
	if (icon || actions) {
		return (
			<div className="relative">
				{icon && (
					<div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
						{icon}
					</div>
				)}
				<Input
					className={cn(
						"h-14 text-lg rounded-2xl",
						"bg-background/80 border-border/50",
						"focus:bg-background transition-all duration-300",
						icon && "pl-12",
						actions && "pr-28",
						className
					)}
					{...props}
				/>
				{actions && (
					<div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
						{actions}
					</div>
				)}
			</div>
		)
	}

	return (
		<Input
			className={cn(
				"h-14 text-lg rounded-2xl",
				"bg-background/80 border-border/50",
				"focus:bg-background transition-all duration-300",
				className
			)}
			{...props}
		/>
	)
}

// Styled textarea with modern design
export function WidgetTextarea({ 
	className,
	actions,
	...props 
}: WidgetTextareaProps) {
	if (actions) {
		return (
			<div className="relative">
				<Textarea
					className={cn(
						"min-h-[120px] text-lg rounded-2xl resize-none",
						"bg-background/80 border-border/50",
						"focus:bg-background transition-all duration-300",
						"pr-16",
						className
					)}
					{...props}
				/>
				<div className="absolute right-3 top-3 flex gap-2">
					{actions}
				</div>
			</div>
		)
	}

	return (
		<Textarea
			className={cn(
				"min-h-[120px] text-lg rounded-2xl resize-none",
				"bg-background/80 border-border/50",
				"focus:bg-background transition-all duration-300",
				className
			)}
			{...props}
		/>
	)
}

// Code/Mono input
export function WidgetCodeInput({ className, ...props }: WidgetInputProps) {
	return (
		<WidgetInput
			className={cn("font-mono", className)}
			{...props}
		/>
	)
}

// Code/Mono textarea
export function WidgetCodeTextarea({ className, ...props }: WidgetTextareaProps) {
	return (
		<WidgetTextarea
			className={cn("font-mono text-base", className)}
			{...props}
		/>
	)
}
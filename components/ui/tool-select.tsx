import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

/**
 * Общий стиль <select> во всех тулах — раньше один и тот же класс был
 * скопирован дословно в 7 файлах (и уже успел разойтись — где-то py-1,
 * где-то py-2). Вынесено сюда по аналогии с toolPill/toolIconButton
 * в lib/ui/tool-pill.ts.
 */
export const ToolSelect = forwardRef<
	HTMLSelectElement,
	SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
	<select
		ref={ref}
		className={cn(
			'cursor-pointer rounded-md border bg-background px-2 py-1 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
			className
		)}
		{...props}
	/>
))

ToolSelect.displayName = 'ToolSelect'

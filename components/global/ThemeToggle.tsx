'use client'

import { Moon, Sun } from 'lucide-react'
import useThemeWithTransition from '@/lib/hooks/useThemeWithTransition'
import { ComponentPropsWithoutRef, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const ThemeToggle = ({ className }: ComponentPropsWithoutRef<'button'>) => {
	const { theme, setTheme } = useThemeWithTransition()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	// Avoid hydration mismatch by not rendering until mounted
	if (!mounted) {
		return (
			<button className={cn('h-10 w-10 rounded-xl bg-background/50 animate-pulse border border-border/50', className)}>
				<div className="w-5 h-5" />
			</button>
		)
	}

	return (
		<button
			onClick={(e) => setTheme(theme === 'dark' ? 'light' : 'dark', e)}
			className={cn(
				'h-10 w-10 rounded-xl border border-border/50 bg-background/50 hover:bg-muted/80 hover:border-border transition-all duration-300 flex items-center justify-center group',
				className
			)}
			aria-label="Toggle theme"
		>
			{theme === 'dark' ? (
				<Sun className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
			) : (
				<Moon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
			)}
		</button>
	)
}

export default ThemeToggle
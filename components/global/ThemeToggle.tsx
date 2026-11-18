'use client'

import { Moon, Sun } from 'lucide-react'
import useThemeWithTransition from '@/lib/hooks/useThemeWithTransition'
import { ComponentPropsWithoutRef, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const ThemeToggle = ({ className }: ComponentPropsWithoutRef<'button'>) => {
	// theme бывает 'system', поэтому смотрим на фактически применённую тему,
	// иначе при тёмной системной теме первый клик ставил 'dark' и ничего не менял
	const { resolvedTheme, setTheme } = useThemeWithTransition()
	const isDark = resolvedTheme === 'dark'
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	// Avoid hydration mismatch by not rendering until mounted
	if (!mounted) {
		return (
			<button
				aria-label='Переключить тему'
				className={cn(
					'h-10 w-10 rounded-xl bg-background/50 animate-pulse border border-border/50',
					className
				)}
			>
				<span className='w-5 h-5 block' />
			</button>
		)
	}

	return (
		<button
			onClick={() => setTheme(isDark ? 'light' : 'dark')}
			className={cn(
				'h-10 w-10 rounded-xl border border-border/50 bg-background/50 hover:bg-muted/80 hover:border-border transition-all duration-300 flex items-center justify-center group',
				className
			)}
			aria-label='Переключить тему'
		>
			{isDark ? (
				<Sun className='w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors' />
			) : (
				<Moon className='w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors' />
			)}
		</button>
	)
}

export default ThemeToggle

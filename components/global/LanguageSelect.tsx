'use client'

import { usePathname } from 'next/navigation'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import {
	SelectItemIndicator,
	SelectItemText,
	SelectPortal,
	SelectViewport
} from '@radix-ui/react-select'
import { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

export const LOCALES = [
	{ key: 'ENGLISH', value: 'en', flag: '🇺🇸' },
	{ key: 'RUSSIAN', value: 'ru', flag: '🇷🇺' }
] as const

type Props = {
	locale: string
} & ComponentPropsWithoutRef<'div'>

export const LanguageSelect = ({ className, locale }: Props) => {
	const pathname = usePathname()

	// Use current pathname directly since locale is no longer in the path
	const pathWithoutLocale = pathname || '/'

	const handleLanguageChange = (newLocale: string) => {
		// For now, just redirect to the same path (will be handled by middleware)
		window.location.href = pathWithoutLocale
	}

	return (
		<div className={cn('shrink-0', className)}>
			<Select value={locale} onValueChange={handleLanguageChange}>
				<SelectTrigger className='h-10 px-3 rounded-xl border border-border/50 bg-background/50 hover:bg-muted/80 hover:border-border transition-all duration-300 text-foreground'>
					<SelectValue aria-label={locale}>
						<span className='flex items-center gap-2'>
							<span className='text-lg'>
								{LOCALES.find(LOCALE => LOCALE.value === locale)?.flag}
							</span>
						</span>
					</SelectValue>
				</SelectTrigger>
				<SelectContent className='rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl z-[9999]'>
					{LOCALES.map(LOCALE => (
						<SelectItem
							value={LOCALE.value}
							key={LOCALE.key}
							className='rounded-lg hover:bg-muted/80 cursor-pointer transition-colors'
						>
							<span className='flex items-center gap-3 py-1'>
								<span className='text-lg'>{LOCALE.flag}</span>
								<span className='text-sm font-medium text-foreground'>
									{LOCALE.key}
								</span>
							</span>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}

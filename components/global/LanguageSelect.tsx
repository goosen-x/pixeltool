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

	// Удаляем текущую локаль из пути, чтобы получить относительный путь
	const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'

	const handleLanguageChange = (newLocale: string) => {
		// Используем window.location для сохранения темы
		window.location.href = `/${newLocale}${pathWithoutLocale}`
	}

	return (
		<div className={cn('shrink-0', className)}>
			<Select value={locale} onValueChange={handleLanguageChange}>
				<SelectTrigger className='h-8'>
					<SelectValue aria-label={locale}>
						{LOCALES.find(LOCALE => LOCALE.value === locale)?.flag}
					</SelectValue>
				</SelectTrigger>
				<SelectPortal>
					<SelectContent>
						<SelectViewport>
							{LOCALES.map(LOCALE => (
								<SelectItem value={LOCALE.value} key={LOCALE.key}>
									<SelectItemText>{LOCALE.key}</SelectItemText>
									<SelectItemIndicator>…</SelectItemIndicator>
								</SelectItem>
							))}
						</SelectViewport>
					</SelectContent>
				</SelectPortal>
			</Select>
		</div>
	)
}

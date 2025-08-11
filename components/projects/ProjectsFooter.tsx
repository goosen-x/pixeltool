'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'

export function ProjectsFooter() {
	const t = useTranslations('Footer')

	return (
		<footer className="border-t bg-background px-6 py-3">
			<div className='flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground'>
				{/* Shortcuts */}
				<div className='flex items-center gap-3'>
					<span className='font-medium'>{t('shortcuts.title')}</span>
					<span className='opacity-70'>{t('shortcuts.copy')}</span>
					<span className='opacity-70'>{t('shortcuts.clear')}</span>
					<span className='opacity-70'>{t('shortcuts.save')}</span>
				</div>
				
				{/* Copyright */}
				<div className='flex items-center gap-2'>
					<span>{t('copyright')}</span>
					<span>•</span>
					<Link
						className='text-foreground hover:underline'
						href='https://github.com/goosen-x/next-portfolio'
						target='_blank'
					>
						{t('description')}
					</Link>
				</div>
			</div>
		</footer>
	)
}
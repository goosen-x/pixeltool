'use client'

import { Search } from 'lucide-react'
import { useCallback } from 'react'

interface QuickSearchBarProps {
	placeholder: string
}

export function QuickSearchBar({ placeholder }: QuickSearchBarProps) {
	const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
		e.preventDefault()
		const searchSection = document.getElementById('tools-search')
		if (searchSection) {
			searchSection.scrollIntoView({ behavior: 'smooth' })
			// Focus on the actual search input after scroll
			setTimeout(() => {
				const searchInput = searchSection.querySelector('input[type="text"]')
				if (searchInput instanceof HTMLInputElement) {
					searchInput.focus()
				}
			}, 500)
		}
	}, [])

	return (
		<div className='relative w-full sm:w-96'>
			<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground' />
			<input
				type='text'
				placeholder={placeholder}
				className='w-full h-12 pl-10 pr-4 rounded-xl border border-border/50 bg-background/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
				onFocus={handleFocus}
			/>
		</div>
	)
}

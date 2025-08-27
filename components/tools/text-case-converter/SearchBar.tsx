'use client'

import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface SearchBarProps {
	value: string
	onChange: (value: string) => void
	placeholder?: string
	categories: string[]
	selectedCategory: string | null
	onCategoryChange: (category: string | null) => void
	resultCount?: number
	filterLabel?: string
	allLabel?: string
	resultsFoundLabel?: string
}

export function SearchBar({
	value,
	onChange,
	placeholder = 'Search cases...',
	categories,
	selectedCategory,
	onCategoryChange,
	resultCount,
	filterLabel = 'Filter:',
	allLabel = 'All',
	resultsFoundLabel = 'results'
}: SearchBarProps) {
	return (
		<div className='space-y-3'>
			<div className='relative'>
				<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
				<Input
					value={value}
					onChange={e => onChange(e.target.value)}
					placeholder={placeholder}
					className='pl-10 pr-10'
				/>
				{value && (
					<Button
						size='icon'
						variant='ghost'
						className='absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2'
						onClick={() => onChange('')}
					>
						<X className='h-4 w-4' />
					</Button>
				)}
			</div>

			<div className='flex items-center gap-2 flex-wrap'>
				<span className='text-sm text-muted-foreground'>{filterLabel}</span>
				<Badge
					variant={selectedCategory === null ? 'default' : 'outline'}
					className={cn(
						'cursor-pointer transition-colors',
						selectedCategory === null && 'bg-primary hover:bg-primary/90'
					)}
					onClick={() => onCategoryChange(null)}
				>
					{allLabel}
				</Badge>
				{categories.map(category => (
					<Badge
						key={category}
						variant={selectedCategory === category ? 'default' : 'outline'}
						className={cn(
							'cursor-pointer transition-colors',
							selectedCategory === category && 'bg-primary hover:bg-primary/90'
						)}
						onClick={() => onCategoryChange(category)}
					>
						{category}
					</Badge>
				))}
				{resultCount !== undefined && (
					<span className='ml-auto text-sm text-muted-foreground'>
						{resultCount} {resultsFoundLabel}
					</span>
				)}
			</div>
		</div>
	)
}

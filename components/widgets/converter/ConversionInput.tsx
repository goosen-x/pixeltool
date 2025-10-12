'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConversionInputProps {
	value: string
	onChange: (value: string) => void
	onClear?: () => void
	placeholder?: string
	className?: string
}

export function ConversionInput({
	value,
	onChange,
	onClear,
	placeholder = 'Enter value (e.g., 24px, 1.5rem, 2em)',
	className
}: ConversionInputProps) {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.value)
	}

	const handleClear = () => {
		onChange('')
		onClear?.()
	}

	return (
		<div className={cn('relative', className)}>
			<Input
				type='text'
				value={value}
				onChange={handleChange}
				placeholder={placeholder}
				className='h-14 text-lg font-mono pr-12'
				autoFocus
			/>
			{value && (
				<Button
					variant='ghost'
					size='icon'
					onClick={handleClear}
					className='absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8'
					title='Clear input'
				>
					<X className='h-4 w-4' />
				</Button>
			)}
		</div>
	)
}

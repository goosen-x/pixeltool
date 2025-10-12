'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Unit } from '@/lib/utils/unit-converter'

interface ResultCardProps {
	label: string
	value: number
	unit: Unit
	isEditable?: boolean
	onCopy: () => void
	onEdit?: (value: string) => void
	isActive?: boolean
	colorScheme?: 'blue' | 'green' | 'orange' | 'purple' | 'pink' | 'cyan'
}

const COLOR_SCHEMES = {
	blue: {
		gradient: 'from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20',
		border: 'border-blue-200 dark:border-blue-800',
		text: 'text-blue-700 dark:text-blue-300',
		hover: 'hover:border-blue-400 dark:hover:border-blue-600'
	},
	green: {
		gradient: 'from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20',
		border: 'border-green-200 dark:border-green-800',
		text: 'text-green-700 dark:text-green-300',
		hover: 'hover:border-green-400 dark:hover:border-green-600'
	},
	orange: {
		gradient:
			'from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20',
		border: 'border-orange-200 dark:border-orange-800',
		text: 'text-orange-700 dark:text-orange-300',
		hover: 'hover:border-orange-400 dark:hover:border-orange-600'
	},
	purple: {
		gradient:
			'from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20',
		border: 'border-purple-200 dark:border-purple-800',
		text: 'text-purple-700 dark:text-purple-300',
		hover: 'hover:border-purple-400 dark:hover:border-purple-600'
	},
	pink: {
		gradient: 'from-pink-50 to-pink-100 dark:from-pink-950/20 dark:to-pink-900/20',
		border: 'border-pink-200 dark:border-pink-800',
		text: 'text-pink-700 dark:text-pink-300',
		hover: 'hover:border-pink-400 dark:hover:border-pink-600'
	},
	cyan: {
		gradient: 'from-cyan-50 to-cyan-100 dark:from-cyan-950/20 dark:to-cyan-900/20',
		border: 'border-cyan-200 dark:border-cyan-800',
		text: 'text-cyan-700 dark:text-cyan-300',
		hover: 'hover:border-cyan-400 dark:hover:border-cyan-600'
	}
}

export function ResultCard({
	label,
	value,
	unit,
	isEditable = false,
	onCopy,
	onEdit,
	isActive = false,
	colorScheme = 'blue'
}: ResultCardProps) {
	const [isCopied, setIsCopied] = useState(false)
	const [isEditing, setIsEditing] = useState(false)
	const [editValue, setEditValue] = useState('')

	const scheme = COLOR_SCHEMES[colorScheme]

	const handleCopy = () => {
		setIsCopied(true)
		onCopy()
		setTimeout(() => setIsCopied(false), 2000)
	}

	const handleEdit = () => {
		if (isEditable && onEdit) {
			setIsEditing(true)
			setEditValue(value.toString())
		}
	}

	const handleSave = () => {
		if (onEdit && editValue) {
			onEdit(editValue)
		}
		setIsEditing(false)
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSave()
		} else if (e.key === 'Escape') {
			setIsEditing(false)
		}
	}

	return (
		<div
			className={cn(
				'group relative p-4 rounded-xl border-2 bg-gradient-to-br transition-all',
				scheme.gradient,
				scheme.border,
				scheme.hover,
				isActive && 'ring-2 ring-primary ring-offset-2',
				isEditable && 'cursor-pointer',
				'hover:shadow-md'
			)}
			onClick={isEditable && !isEditing ? handleEdit : undefined}
		>
			<div className='flex items-start justify-between gap-3'>
				<div className='flex-1 min-w-0'>
					{/* Label */}
					<div className='flex items-center gap-2 mb-2'>
						<h4
							className={cn(
								'text-xs font-semibold uppercase tracking-wide',
								scheme.text
							)}
						>
							{label}
						</h4>
						{isActive && (
							<span className='text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded'>
								Active
							</span>
						)}
					</div>

					{/* Value */}
					{isEditing ? (
						<Input
							type='number'
							value={editValue}
							onChange={e => setEditValue(e.target.value)}
							onBlur={handleSave}
							onKeyDown={handleKeyDown}
							className='h-10 font-mono text-lg font-semibold'
							autoFocus
						/>
					) : (
						<code className='block font-mono text-xl font-bold break-all'>
							{value.toFixed(3).replace(/\.?0+$/, '')}
							<span className='text-sm font-medium ml-0.5 opacity-80'>{unit}</span>
						</code>
					)}
				</div>

				{/* Copy Button */}
				<Button
					size='sm'
					variant='ghost'
					onClick={e => {
						e.stopPropagation()
						handleCopy()
					}}
					className={cn(
						'h-9 w-9 p-0 flex-shrink-0 transition-all',
						isCopied && 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
					)}
					title={`Copy ${label}`}
				>
					{isCopied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
				</Button>
			</div>

			{/* Editable hint */}
			{isEditable && !isEditing && (
				<div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none'>
					<div className='absolute top-2 right-12 text-[10px] bg-primary/20 text-primary px-2 py-1 rounded'>
						Click to edit
					</div>
				</div>
			)}
		</div>
	)
}

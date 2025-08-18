'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import { Keyboard, Command, X, Info, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { KeyboardShortcut } from '@/lib/hooks/useWidgetKeyboard'

interface WidgetKeyboardShortcutsProps {
	shortcuts: KeyboardShortcut[]
	variant?: 'inline' | 'dialog' | 'floating'
	position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left'
	className?: string
}

export function WidgetKeyboardShortcuts({
	shortcuts,
	variant = 'floating',
	position = 'bottom-right',
	className
}: WidgetKeyboardShortcutsProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [showHint, setShowHint] = useState(false)
	const isMac =
		typeof window !== 'undefined' &&
		/Mac|iPod|iPhone|iPad/.test(window.navigator.platform)

	useEffect(() => {
		// Show hint on first visit
		const hasSeenHint = localStorage.getItem('keyboard-shortcuts-hint')
		if (!hasSeenHint && variant === 'floating') {
			setTimeout(() => {
				setShowHint(true)
				setTimeout(() => setShowHint(false), 5000)
			}, 2000)
			localStorage.setItem('keyboard-shortcuts-hint', 'true')
		}
	}, [variant])

	const formatKey = (key: string): string => {
		const specialKeys: Record<string, string> = {
			Enter: '↵',
			Escape: 'Esc',
			ArrowUp: '↑',
			ArrowDown: '↓',
			ArrowLeft: '←',
			ArrowRight: '→',
			Tab: '↹',
			Backspace: '⌫',
			Delete: 'Del',
			' ': 'Space'
		}
		return specialKeys[key] || key.toUpperCase()
	}

	const formatModifiers = (shortcut: KeyboardShortcut): string[] => {
		const modifiers: string[] = []

		if (shortcut.ctrl) modifiers.push(isMac ? '⌃' : 'Ctrl')
		if (shortcut.meta) modifiers.push(isMac ? '⌘' : 'Win')
		if (shortcut.alt) modifiers.push(isMac ? '⌥' : 'Alt')
		if (shortcut.shift) modifiers.push(isMac ? '⇧' : 'Shift')

		return modifiers
	}

	const ShortcutKey = ({
		children,
		variant = 'default'
	}: {
		children: React.ReactNode
		variant?: 'default' | 'outline'
	}) => (
		<kbd
			className={cn(
				'inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 text-xs font-mono rounded border',
				variant === 'default'
					? 'bg-muted border-border shadow-sm'
					: 'bg-background border-muted-foreground/20'
			)}
		>
			{children}
		</kbd>
	)

	const ShortcutsList = () => (
		<div className='space-y-3'>
			{shortcuts
				.filter(s => s.enabled !== false)
				.map((shortcut, index) => {
					const modifiers = formatModifiers(shortcut)
					const key = formatKey(shortcut.key)

					return (
						<div
							key={index}
							className='flex items-center justify-between gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors'
						>
							<span className='text-sm text-muted-foreground'>
								{shortcut.description}
							</span>
							<div className='flex items-center gap-1'>
								{modifiers.map((mod, i) => (
									<div key={i} className='flex items-center gap-1'>
										<ShortcutKey>{mod}</ShortcutKey>
										{i < modifiers.length - 1 || shortcut.key ? '+' : ''}
									</div>
								))}
								{shortcut.key && (
									<>
										{modifiers.length > 0 && ' '}
										<ShortcutKey variant='outline'>{key}</ShortcutKey>
									</>
								)}
							</div>
						</div>
					)
				})}

			<div className='pt-2 mt-2 border-t'>
				<div className='flex items-center justify-between gap-4 p-2 rounded-lg bg-muted/30'>
					<span className='text-sm font-medium'>Show all shortcuts</span>
					<div className='flex items-center gap-1'>
						<ShortcutKey>Shift</ShortcutKey>
						<span className='text-xs'>+</span>
						<ShortcutKey variant='outline'>?</ShortcutKey>
					</div>
				</div>
			</div>
		</div>
	)

	if (variant === 'inline') {
		return (
			<Card className={cn('p-4', className)}>
				<div className='flex items-center gap-2 mb-3'>
					<Keyboard className='w-4 h-4' />
					<h3 className='font-medium text-sm'>Keyboard Shortcuts</h3>
				</div>
				<ShortcutsList />
			</Card>
		)
	}

	if (variant === 'dialog') {
		return (
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger asChild>
					<Button
						variant='outline'
						size='sm'
						className={cn('gap-2', className)}
					>
						<Keyboard className='w-4 h-4' />
						Shortcuts
					</Button>
				</DialogTrigger>
				<DialogContent className='max-w-md'>
					<DialogHeader>
						<DialogTitle className='flex items-center gap-2'>
							<Keyboard className='w-5 h-5' />
							Keyboard Shortcuts
						</DialogTitle>
						<DialogDescription>
							Speed up your workflow with these keyboard shortcuts
						</DialogDescription>
					</DialogHeader>
					<ShortcutsList />
				</DialogContent>
			</Dialog>
		)
	}

	// Floating variant
	const positionClasses = {
		'top-right': 'top-4 right-4',
		'bottom-right': 'bottom-4 right-4',
		'top-left': 'top-4 left-4',
		'bottom-left': 'bottom-4 left-4'
	}

	return (
		<>
			{/* Floating button */}
			<div className={cn('fixed z-30', positionClasses[position], className)}>
				{showHint && (
					<div className='absolute bottom-full right-0 mb-2 animate-in fade-in slide-in-from-bottom-2'>
						<Card className='p-3 pr-8 shadow-lg'>
							<Button
								onClick={() => setShowHint(false)}
								variant='ghost'
								size='icon'
								className='absolute top-1 right-1 h-6 w-6'
							>
								<X className='w-3 h-3' />
							</Button>
							<div className='flex items-center gap-2 text-sm'>
								<Sparkles className='w-4 h-4 text-primary' />
								<span>
									Press <ShortcutKey>?</ShortcutKey> for shortcuts
								</span>
							</div>
						</Card>
					</div>
				)}

				<Button
					onClick={() => setIsOpen(!isOpen)}
					variant='outline'
					size='icon'
					className='shadow-lg hover:shadow-xl transition-all'
					title='Keyboard shortcuts (Shift + ?)'
				>
					<Keyboard className='w-4 h-4' />
				</Button>
			</div>

			{/* Floating panel */}
			{isOpen && (
				<>
					<div
						className='fixed inset-0 z-40'
						onClick={() => setIsOpen(false)}
					/>
					<Card
						className={cn(
							'fixed z-50 w-80 p-4 shadow-xl animate-in fade-in slide-in-from-bottom-4',
							position.includes('right') ? 'right-4' : 'left-4',
							position.includes('bottom') ? 'bottom-16' : 'top-16'
						)}
					>
						<div className='flex items-center justify-between mb-3'>
							<div className='flex items-center gap-2'>
								<Keyboard className='w-4 h-4' />
								<h3 className='font-medium'>Keyboard Shortcuts</h3>
							</div>
							<Button
								onClick={() => setIsOpen(false)}
								variant='ghost'
								size='icon'
								className='h-6 w-6'
							>
								<X className='w-3 h-3' />
							</Button>
						</div>
						<ShortcutsList />
					</Card>
				</>
			)}
		</>
	)
}

// Helper component for displaying a single shortcut inline
export function ShortcutHint({
	shortcut,
	className
}: {
	shortcut: KeyboardShortcut
	className?: string
}) {
	const modifiers = formatModifiers(shortcut)
	const key = formatKey(shortcut.key)
	const isMac =
		typeof window !== 'undefined' &&
		/Mac|iPod|iPhone|iPad/.test(window.navigator.platform)

	return (
		<div
			className={cn(
				'inline-flex items-center gap-1 text-xs text-muted-foreground',
				className
			)}
		>
			{modifiers.map((mod, i) => (
				<span key={i} className='inline-flex items-center gap-0.5'>
					<kbd className='inline-flex items-center justify-center min-w-[20px] h-5 px-1 font-mono text-[10px] bg-muted rounded border border-border'>
						{mod}
					</kbd>
					{i < modifiers.length - 1 || shortcut.key ? '+' : ''}
				</span>
			))}
			{shortcut.key && (
				<kbd className='inline-flex items-center justify-center min-w-[20px] h-5 px-1 font-mono text-[10px] bg-muted rounded border border-border'>
					{key}
				</kbd>
			)}
		</div>
	)
}

function formatModifiers(shortcut: KeyboardShortcut): string[] {
	const modifiers: string[] = []
	const isMac =
		typeof window !== 'undefined' &&
		/Mac|iPod|iPhone|iPad/.test(window.navigator.platform)

	if (shortcut.ctrl) modifiers.push(isMac ? '⌃' : 'Ctrl')
	if (shortcut.meta) modifiers.push(isMac ? '⌘' : 'Win')
	if (shortcut.alt) modifiers.push(isMac ? '⌥' : 'Alt')
	if (shortcut.shift) modifiers.push(isMac ? '⇧' : 'Shift')

	return modifiers
}

function formatKey(key: string): string {
	const specialKeys: Record<string, string> = {
		Enter: '↵',
		Escape: 'Esc',
		ArrowUp: '↑',
		ArrowDown: '↓',
		ArrowLeft: '←',
		ArrowRight: '→',
		Tab: '↹',
		Backspace: '⌫',
		Delete: 'Del',
		' ': 'Space'
	}
	return specialKeys[key] || key.toUpperCase()
}

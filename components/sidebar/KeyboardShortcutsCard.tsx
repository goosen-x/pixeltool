'use client'

import { useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Keyboard, ChevronDown, ChevronUp } from 'lucide-react'

// Компонент для отображения клавиши
const ShortcutKey = ({ children }: { children: React.ReactNode }) => (
	<kbd className='inline-flex items-center justify-center min-w-[18px] h-5 px-1 text-[10px] font-mono rounded border bg-muted border-border'>
		{children}
	</kbd>
)

interface KeyboardShortcutsCardProps {
	widgetShortcuts: {
		shortcuts: string[]
	} | null
}

export function KeyboardShortcutsCard({
	widgetShortcuts
}: KeyboardShortcutsCardProps) {

	const locale = 'ru'
	// const tSidebar = useTranslations('widgets.rightSidebar')
	const [showAllShortcuts, setShowAllShortcuts] = useState(false)

	if (!widgetShortcuts) return null

	return (
		<Card>
			<CardHeader className='pb-3'>
				<CardTitle className='text-sm flex items-center gap-2'>
					<Keyboard className='w-4 h-4' />
					Горячие клавиши
				</CardTitle>
			</CardHeader>
			<CardContent className='space-y-2'>
				<div className='space-y-2'>
					{(showAllShortcuts
						? widgetShortcuts.shortcuts
						: widgetShortcuts.shortcuts.slice(0, 4)
					).map((shortcut, index) => {
						const [keys, ...descriptionParts] = shortcut.split(' ')
						const description = descriptionParts.join(' ')

						return (
							<div
								key={index}
								className='flex items-center justify-between gap-2'
							>
								<span className='text-xs text-muted-foreground truncate'>
									{description}
								</span>
								<div className='flex items-center gap-1 whitespace-nowrap'>
									{keys.split('+').map((key, keyIndex, array) => (
										<div key={keyIndex} className='flex items-center gap-0.5'>
											<ShortcutKey>{key}</ShortcutKey>
											{keyIndex < array.length - 1 && (
												<span className='text-xs text-muted-foreground'>+</span>
											)}
										</div>
									))}
								</div>
							</div>
						)
					})}
				</div>
				{widgetShortcuts.shortcuts.length > 4 && (
					<Button
						variant='outline'
						size='sm'
						onClick={() => setShowAllShortcuts(!showAllShortcuts)}
						className='w-full h-7 text-xs hover:bg-accent hover:text-accent-foreground mt-2'
					>
						{showAllShortcuts ? (
							<>
								<ChevronUp className='w-3 h-3 mr-1' />
								{locale === 'ru' ? 'Скрыть' : 'Show less'}
							</>
						) : (
							<>
								<ChevronDown className='w-3 h-3 mr-1' />+
								{widgetShortcuts.shortcuts.length - 4}{' '}
								{locale === 'ru' ? 'ещё' : 'more'}
							</>
						)}
					</Button>
				)}
			</CardContent>
		</Card>
	)
}

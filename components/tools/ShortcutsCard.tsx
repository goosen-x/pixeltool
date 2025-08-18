import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Keyboard } from 'lucide-react'

interface Shortcut {
	keys: string
	description: string
}

interface ShortcutsCardProps {
	shortcuts: Shortcut[]
	className?: string
}

export function ShortcutsCard({
	shortcuts,
	className = ''
}: ShortcutsCardProps) {
	return (
		<Card className={`max-w-2xl mx-auto ${className}`}>
			<CardHeader className='pb-3'>
				<CardTitle className='text-sm flex items-center gap-2'>
					<Keyboard className='w-4 h-4' />
					Keyboard Shortcuts
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='flex flex-wrap gap-x-6 gap-y-2 text-sm'>
					{shortcuts.map((shortcut, index) => (
						<div key={index} className='flex items-center gap-2'>
							<kbd className='px-2 py-1 text-xs font-mono bg-muted rounded border border-border'>
								{shortcut.keys}
							</kbd>
							<span className='text-muted-foreground'>
								{shortcut.description}
							</span>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}

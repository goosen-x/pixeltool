import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

type Props = {
	setIsSearchOpen: Dispatch<SetStateAction<boolean>>
	/**
	 * Только иконка, без слова «Поиск» и подсказки о ⌘K. Нужен в мобильной
	 * шапке: там на кнопки остаётся полоска рядом с бургером, а сочетание
	 * клавиш на телефоне всё равно не нажать.
	 */
	compact?: boolean
}

export const SearchButton = ({ setIsSearchOpen, compact }: Props) => {
	if (compact) {
		return (
			<Button
				variant='ghost'
				size='icon'
				onClick={() => setIsSearchOpen(true)}
				aria-label='Поиск инструментов'
				title='Поиск инструментов'
			>
				<Search className='h-5 w-5' />
			</Button>
		)
	}

	return (
		<Button
			variant='ghost'
			onClick={() => setIsSearchOpen(true)}
			className='h-10 px-4 rounded-xl border border-border/50 bg-background/50 hover:bg-muted/80 hover:border-border transition-all duration-300 flex items-center gap-2'
		>
			<Search className='w-4 h-4 text-muted-foreground' />
			<span className='text-muted-foreground'>Поиск</span>
			<kbd className='hidden lg:inline-flex h-5 select-none items-center gap-1 rounded-lg border border-border/50 bg-muted/50 px-1.5 font-mono text-xs font-medium text-muted-foreground'>
				<span className='text-xs'>⌘</span>K
			</kbd>
		</Button>
	)
}

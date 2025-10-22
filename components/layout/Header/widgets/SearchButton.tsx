import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

type Props = {
	setIsSearchOpen: Dispatch<SetStateAction<boolean>>
}

export const SearchButton = ({ setIsSearchOpen }: Props) => {
	return (
		<Button
			variant='ghost'
			onClick={() => setIsSearchOpen(true)}
			className='h-10 px-4 rounded-xl border border-border/50 bg-background/50 hover:bg-muted/80 hover:border-border transition-all duration-300 flex items-center gap-2'
			aria-label='Search tools'
		>
			<Search className='w-4 h-4 text-muted-foreground' />
			<span className='text-muted-foreground'>Поиск</span>
			<kbd className='hidden lg:inline-flex h-5 select-none items-center gap-1 rounded-lg border border-border/50 bg-muted/50 px-1.5 font-mono text-xs font-medium text-muted-foreground'>
				<span className='text-xs'>⌘</span>K
			</kbd>
		</Button>
	)
}

import { Navigation } from './widgets/Navigation/Navigation'
import { Burger } from './widgets/Burger/Burger'
import { DownloadCV } from '@/components/global/DownloadCV'
import { LanguageSelect } from '@/components/global/LanguageSelect'
import ThemeToggle from '@/components/global/ThemeToggle'

export const Header = () => {
	return (
		<header className='sticky top-0 flex justify-between h-16 items-center gap-4 border-b bg-background px-4 lg:px-6 z-50'>
			<Navigation />
			<Burger />
			<div className='flex items-center gap-4 md:gap-2 lg:gap-4'>
				<DownloadCV />
				<LanguageSelect className='hidden lg:block' />
				<ThemeToggle className='hidden lg:flex shrink-0' />
			</div>
		</header>
	)
}

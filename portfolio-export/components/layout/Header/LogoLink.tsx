import Link from 'next/link'
import { useLocale } from 'next-intl'

export const LogoLink = () => {
	const locale = useLocale()
	
	return (
		<Link
			href={`/${locale}`}
			className='flex items-center gap-2 text-lg font-semibold md:text-base'
		>
			<span className='font-bold text-xl'>Dmitry Borisenko</span>
		</Link>
	)
}
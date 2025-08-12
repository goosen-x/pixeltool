import Link from 'next/link'
import { OptimizedImage } from '@/components/ui/optimized-image'
import logo from '@/public/images/logo.png'

export const LogoLink = () => {
	return (
		<Link
			href='/'
			className='flex items-center gap-2 text-lg font-semibold md:text-base'
		>
			<OptimizedImage
				className='w-10 h-10 rounded-full border-4'
				width={100}
				height={100}
				src={logo}
				alt='PixelTool logo'
			/>
			<span className='font-bold text-xl'>PixelTool</span>
		</Link>
	)
}

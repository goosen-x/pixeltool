import Link from 'next/link'
import Image from 'next/image'
import logo from '@/public/images/logo.png'

export const LogoLink = () => {
	return (
		<Link
			href='/'
			className='flex items-center gap-2 text-lg font-semibold md:text-base'
		>
			<Image
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

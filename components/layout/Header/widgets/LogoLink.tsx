import Link from 'next/link'

export const LogoLink = () => {
	return (
		<Link
			href='/'
			className='flex items-center gap-2 text-lg font-semibold md:text-base'
		>
			<div className='w-10 h-10 rounded-lg overflow-hidden'>
				<svg
					width='40'
					height='40'
					viewBox='0 0 512 512'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<rect width='512' height='512' rx='100' fill='white' />
					<g transform='translate(106, 106)'>
						<rect x='0' y='0' width='100' height='100' fill='#E84330' />
						<rect x='100' y='0' width='100' height='100' fill='#FD850F' />
						<rect x='200' y='0' width='100' height='100' fill='#FFCD00' />
						<rect x='0' y='100' width='100' height='100' fill='#FD850F' />
						<rect x='100' y='100' width='100' height='100' fill='#FFCD00' />
						<rect x='200' y='100' width='100' height='100' fill='#70C727' />
						<rect x='0' y='200' width='100' height='100' fill='#FFCD00' />
						<rect x='100' y='200' width='100' height='100' fill='#70C727' />
						<rect x='200' y='200' width='100' height='100' fill='#2D96D7' />
					</g>
				</svg>
			</div>
			<span className='font-bold text-xl'>PixelTool</span>
		</Link>
	)
}

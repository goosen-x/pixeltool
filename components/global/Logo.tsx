import React from 'react'

interface LogoProps {
	size?: number
	className?: string
}

export const Logo: React.FC<LogoProps> = ({ size = 32, className = '' }) => {
	return (
		<div
			className={`inline-block ${className}`}
			style={{ width: size, height: size }}
		>
			<svg
				width={size}
				height={size}
				viewBox='0 0 30 30'
				className='rounded-sm'
			>
				{/* Grid of 9 squares with no gaps */}
				<rect x='0' y='0' width='10' height='10' fill='#E84330' />
				<rect x='10' y='0' width='10' height='10' fill='#FD850F' />
				<rect x='20' y='0' width='10' height='10' fill='#FFCD00' />

				<rect x='0' y='10' width='10' height='10' fill='#FD850F' />
				<rect x='10' y='10' width='10' height='10' fill='#FFCD00' />
				<rect x='20' y='10' width='10' height='10' fill='#70C727' />

				<rect x='0' y='20' width='10' height='10' fill='#FFCD00' />
				<rect x='10' y='20' width='10' height='10' fill='#70C727' />
				<rect x='20' y='20' width='10' height='10' fill='#2D96D7' />
			</svg>
		</div>
	)
}

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
				viewBox="0 0 32 32" 
				className="rounded-sm"
			>
				{/* Grid of 9 squares with colors from the image */}
				<rect x="0" y="0" width="10" height="10" fill="#E53E3E" />
				<rect x="11" y="0" width="10" height="10" fill="#FD9426" />
				<rect x="22" y="0" width="10" height="10" fill="#FFD93D" />
				
				<rect x="0" y="11" width="10" height="10" fill="#FF9500" />
				<rect x="11" y="11" width="10" height="10" fill="#68D391" />
				<rect x="22" y="11" width="10" height="10" fill="#FFD93D" />
				
				<rect x="0" y="22" width="10" height="10" fill="#68D391" />
				<rect x="11" y="22" width="10" height="10" fill="#4299E1" />
				<rect x="22" y="22" width="10" height="10" fill="#0EA5E9" />
			</svg>
		</div>
	)
}
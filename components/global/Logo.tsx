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
				{/* Grid of 9 squares with different colors */}
				<rect x="0" y="0" width="10" height="10" fill="#FF6B6B" />
				<rect x="11" y="0" width="10" height="10" fill="#4ECDC4" />
				<rect x="22" y="0" width="10" height="10" fill="#45B7D1" />
				
				<rect x="0" y="11" width="10" height="10" fill="#96CEB4" />
				<rect x="11" y="11" width="10" height="10" fill="#FFEAA7" />
				<rect x="22" y="11" width="10" height="10" fill="#DDA0DD" />
				
				<rect x="0" y="22" width="10" height="10" fill="#FFA07A" />
				<rect x="11" y="22" width="10" height="10" fill="#98D8C8" />
				<rect x="22" y="22" width="10" height="10" fill="#F7DC6F" />
			</svg>
		</div>
	)
}
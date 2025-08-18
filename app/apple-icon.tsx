import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
	return new ImageResponse(
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: 'white',
					borderRadius: '20px'
				}}
			>
				<svg
					width='140'
					height='140'
					viewBox='0 0 30 30'
					style={{
						width: '140px',
						height: '140px'
					}}
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
		),
		{
			...size
		}
	)
}

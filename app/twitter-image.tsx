import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'PixelTool - Professional Developer Tools'
export const size = {
	width: 1200,
	height: 630
}
export const contentType = 'image/png'

export default async function Image() {
	return new ImageResponse(
		<div
			style={{
				background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				position: 'relative'
			}}
		>
			{/* Background pattern */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 40% 20%, rgba(34, 197, 94, 0.15) 0%, transparent 50%)
            `
				}}
			/>

			{/* Logo */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					marginBottom: 20
				}}
			>
				<svg
					width='100'
					height='100'
					viewBox='0 0 512 512'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<rect width='512' height='512' rx='100' fill='url(#gradient)' />
					<path
						d='M320 170.667H362.667C386.24 170.667 405.333 189.76 405.333 213.333V298.667C405.333 322.24 386.24 341.333 362.667 341.333H320M192 341.333H149.333C125.76 341.333 106.667 322.24 106.667 298.667V213.333C106.667 189.76 125.76 170.667 149.333 170.667H192M170.667 256H341.333'
						stroke='white'
						strokeWidth='32'
						strokeLinecap='round'
						strokeLinejoin='round'
					/>
					<defs>
						<linearGradient id='gradient' x1='0' y1='0' x2='512' y2='512'>
							<stop stopColor='#3B82F6' />
							<stop offset='1' stopColor='#8B5CF6' />
						</linearGradient>
					</defs>
				</svg>
			</div>

			{/* Title */}
			<h1
				style={{
					fontSize: 72,
					fontWeight: 700,
					color: 'white',
					margin: 0,
					marginBottom: 16,
					textAlign: 'center',
					letterSpacing: '-0.02em'
				}}
			>
				PixelTool
			</h1>

			{/* Subtitle */}
			<p
				style={{
					fontSize: 28,
					color: 'rgba(255, 255, 255, 0.8)',
					margin: 0,
					marginBottom: 40,
					textAlign: 'center',
					maxWidth: 800,
					lineHeight: 1.4
				}}
			>
				Professional Developer Tools & Utilities
			</p>

			{/* Features */}
			<div
				style={{
					display: 'flex',
					gap: 40,
					alignItems: 'center'
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 12,
						color: 'rgba(255, 255, 255, 0.9)',
						fontSize: 20
					}}
				>
					<svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
						<path
							d='M9 11L12 14L22 4'
							stroke='#22C55E'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
						<path
							d='M21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16'
							stroke='#22C55E'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>
					50+ Tools
				</div>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 12,
						color: 'rgba(255, 255, 255, 0.9)',
						fontSize: 20
					}}
				>
					<svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
						<path
							d='M13 2L3 14H12L11 22L21 10H12L13 2Z'
							stroke='#FBBF24'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>
					No Installation
				</div>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 12,
						color: 'rgba(255, 255, 255, 0.9)',
						fontSize: 20
					}}
				>
					<svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
						<circle cx='12' cy='12' r='10' stroke='#3B82F6' strokeWidth='2' />
						<path
							d='M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22'
							stroke='#3B82F6'
							strokeWidth='2'
						/>
						<path d='M2 12H22' stroke='#3B82F6' strokeWidth='2' />
						<path
							d='M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22'
							stroke='#3B82F6'
							strokeWidth='2'
						/>
					</svg>
					100% Free
				</div>
			</div>

			{/* URL */}
			<div
				style={{
					position: 'absolute',
					bottom: 40,
					fontSize: 18,
					color: 'rgba(255, 255, 255, 0.5)',
					letterSpacing: '0.05em'
				}}
			>
				pixeltool.pro
			</div>
		</div>,
		{
			...size
		}
	)
}

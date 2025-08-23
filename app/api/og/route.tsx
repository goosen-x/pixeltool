import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { getWidgetById } from '@/lib/constants/widgets'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)

		// Get parameters
		const title = searchParams.get('title') || 'PixelTool'
		const description =
			searchParams.get('description') || 'Professional Developer Tools'
		const widgetId = searchParams.get('widget')
		const locale = searchParams.get('locale') || 'en'
		
		// Get widget data if available
		const widget = widgetId ? getWidgetById(widgetId) : null
		
		// Category emoji mapping
		const categoryEmojis: Record<string, string> = {
			webdev: '🌐',
			business: '💼',
			content: '📝',
			security: '🔒',
			multimedia: '🎨',
			analytics: '📊',
			lifestyle: '🎯'
		}
		
		const categoryEmoji = widget ? categoryEmojis[widget.category] || '🛠️' : '🛠️'

		return new ImageResponse(
			(
				<div
					style={{
						height: '100%',
						width: '100%',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						backgroundColor: '#0f172a',
						backgroundImage:
							'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
						position: 'relative',
						overflow: 'hidden'
					}}
				>
					{/* Background pattern */}
					<div
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							opacity: 0.05,
							backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(255,255,255,0.05) 10px,
                rgba(255,255,255,0.05) 20px
              )`
						}}
					/>

					{/* Content container */}
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							padding: '60px',
							textAlign: 'center',
							zIndex: 10
						}}
					>
						{/* Widget Icon or Emoji */}
						{widget && (
							<div
								style={{
									width: 80,
									height: 80,
									marginBottom: 20,
									background: widget.gradient || 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
									borderRadius: 16,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: 40,
									color: 'white',
									fontWeight: 'bold'
								}}
							>
								{categoryEmoji}
							</div>
						)}

						{/* Title */}
						<h1
							style={{
								fontSize: widgetId ? 48 : 60,
								fontWeight: 'bold',
								color: '#f1f5f9',
								marginBottom: 20,
								lineHeight: 1.2,
								maxWidth: '900px'
							}}
						>
							{title}
						</h1>

						{/* Description */}
						<p
							style={{
								fontSize: 28,
								color: '#cbd5e1',
								marginBottom: 40,
								lineHeight: 1.4,
								maxWidth: '800px'
							}}
						>
							{description}
						</p>

						{/* Brand */}
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 10,
								marginTop: 'auto'
							}}
						>
							<span
								style={{
									fontSize: 36,
									fontWeight: 'bold',
									color: '#3b82f6'
								}}
							>
								Pixel
							</span>
							<span
								style={{
									fontSize: 36,
									fontWeight: 'bold',
									color: '#10b981'
								}}
							>
								Tool
							</span>
							{widget && (
								<span
									style={{
										fontSize: 24,
										color: '#94a3b8',
										marginLeft: 20
									}}
								>
									{locale === 'ru' ? 'Бесплатные инструменты' : 'Free Tools'}
								</span>
							)}
						</div>
					</div>

					{/* URL */}
					<div
						style={{
							position: 'absolute',
							bottom: 30,
							right: 30,
							fontSize: 20,
							color: '#64748b'
						}}
					>
						pixeltool.pro
					</div>
				</div>
			),
			{
				width: 1200,
				height: 630
			}
		)
	} catch (e) {
		return new Response(`Failed to generate image`, {
			status: 500
		})
	}
}

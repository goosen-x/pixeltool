import { ReactNode } from 'react'
import { SidebarAd } from '@/components/ads/SidebarAd'

interface WidgetWrapperWithAdsProps {
	children: ReactNode
	showAds?: boolean
}

export function WidgetWrapperWithAds({
	children,
	showAds = true
}: WidgetWrapperWithAdsProps) {
	return (
		<div className='min-h-screen bg-background'>
			<main className='container mx-auto px-4 py-6 sm:py-8 lg:py-12'>
				<div className='mx-auto max-w-7xl'>
					<div className='lg:grid lg:grid-cols-[1fr,336px] lg:gap-8'>
						{/* Основной контент */}
						<div className='w-full'>{children}</div>

						{/* Правый сайдбар с рекламой (скрыт на мобильных) */}
						{showAds && (
							<aside className='hidden lg:block'>
								<div className='sticky top-24'>
									<SidebarAd />
								</div>
							</aside>
						)}
					</div>
				</div>
			</main>
		</div>
	)
}

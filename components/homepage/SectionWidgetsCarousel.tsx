'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { widgets } from '@/lib/constants/widgets'
import { useLocale } from 'next-intl'
import { ToolCard } from '@/components/tools/ToolCard'

export function SectionWidgetsCarousel() {
	const t = useTranslations('HomePage')
	const tWidgets = useTranslations('widgets')
	const locale = useLocale()
	const [activeIndex, setActiveIndex] = useState(0)
	const [isAutoPlaying, setIsAutoPlaying] = useState(true)
	const [itemsPerView, setItemsPerView] = useState(3)
	const containerRef = useRef<HTMLDivElement>(null)
	const intervalRef = useRef<NodeJS.Timeout | null>(null)

	// Get popular widgets (you can customize this selection)
	const popularWidgets = widgets.slice(0, 15) // Show first 15 widgets
	const maxIndex = Math.max(0, popularWidgets.length - itemsPerView)

	// Responsive items per view
	useEffect(() => {
		const updateItemsPerView = () => {
			if (window.innerWidth < 640) {
				setItemsPerView(1)
			} else if (window.innerWidth < 1024) {
				setItemsPerView(2)
			} else {
				setItemsPerView(3)
			}
		}

		updateItemsPerView()
		window.addEventListener('resize', updateItemsPerView)
		return () => window.removeEventListener('resize', updateItemsPerView)
	}, [])

	useEffect(() => {
		if (isAutoPlaying) {
			intervalRef.current = setInterval(() => {
				setActiveIndex(prev => (prev + 1 > maxIndex ? 0 : prev + 1))
			}, 4000)
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
			}
		}
	}, [isAutoPlaying, maxIndex])

	const handlePrevious = () => {
		setIsAutoPlaying(false)
		setActiveIndex(prev => (prev - 1 < 0 ? maxIndex : prev - 1))
	}

	const handleNext = () => {
		setIsAutoPlaying(false)
		setActiveIndex(prev => (prev + 1 > maxIndex ? 0 : prev + 1))
	}

	const handleDotClick = (index: number) => {
		setIsAutoPlaying(false)
		setActiveIndex(index)
	}

	return (
		<section className='relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden'>
			{/* Background decoration */}
			<div className='absolute inset-0 -z-10'>
				<div className='absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-full blur-3xl' />
			</div>

			<div className='max-w-7xl mx-auto'>
				{/* Section Header */}
				<div className='text-center mb-12'>
					<div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 backdrop-blur-sm mb-6'>
						<Sparkles className='w-4 h-4 text-primary' />
						<span className='text-sm font-medium text-primary'>
							{t('widgetsCarousel.badge')}
						</span>
					</div>
					<h2 className='text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
						{t('widgetsCarousel.title')}
					</h2>
					<p className='text-lg text-muted-foreground max-w-3xl mx-auto mb-8'>
						{t('widgetsCarousel.description')}
					</p>
				</div>

				{/* Carousel Container */}
				<div className='relative'>
					{/* Navigation Buttons */}
					<Button
						variant='outline'
						size='icon'
						onClick={handlePrevious}
						className='absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-1/2 w-12 h-12 rounded-full bg-background/90 backdrop-blur-sm border-border/50 hover:bg-background hover:border-primary/50 shadow-lg transition-all'
					>
						<ChevronLeft className='h-5 w-5' />
					</Button>
					<Button
						variant='outline'
						size='icon'
						onClick={handleNext}
						className='absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-1/2 w-12 h-12 rounded-full bg-background/90 backdrop-blur-sm border-border/50 hover:bg-background hover:border-primary/50 shadow-lg transition-all'
					>
						<ChevronRight className='h-5 w-5' />
					</Button>

					{/* Carousel Items */}
					<div ref={containerRef} className='overflow-hidden'>
						<div
							className='flex transition-transform duration-500 ease-out gap-6'
							style={{
								transform: `translateX(-${activeIndex * (100 / itemsPerView)}%)`
							}}
						>
							{popularWidgets.map(widget => (
								<div
									key={widget.id}
									className={cn(
										'flex-shrink-0 transition-all duration-300',
										itemsPerView === 1
											? 'w-full'
											: itemsPerView === 2
												? 'w-[calc(50%-12px)]'
												: 'w-[calc(33.333%-16px)]'
									)}
								>
									<ToolCard
										widget={widget}
										locale={locale}
										showFavoriteButton={false}
									/>
								</div>
							))}
						</div>
					</div>

					{/* Dots Indicator */}
					<div className='flex justify-center gap-2 mt-6'>
						{Array.from({ length: maxIndex + 1 }).map((_, index) => (
							<button
								key={index}
								onClick={() => handleDotClick(index)}
								className={cn(
									'w-2 h-2 rounded-full transition-all duration-300',
									index === activeIndex
										? 'w-8 bg-gradient-to-r from-primary to-accent'
										: 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
								)}
								aria-label={`Go to slide ${index + 1}`}
							/>
						))}
					</div>
				</div>

				{/* CTA Button */}
				<div className='text-center mt-12'>
					<Link href={`/${locale}/tools`}>
						<Button size='lg' variant='outline' className='gap-2'>
							{t('widgetsCarousel.viewAll')}
							<ArrowRight className='h-4 w-4' />
						</Button>
					</Link>
				</div>
			</div>
		</section>
	)
}

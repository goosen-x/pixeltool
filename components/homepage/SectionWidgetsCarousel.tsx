'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { widgets } from '@/lib/constants/widgets'
import { ToolCard } from '@/components/tools/ToolCard'

export function SectionWidgetsCarousel() {
	// const tWidgets = useTranslations('widgets') // Removed translations

	const locale = 'ru'
	const [activeIndex, setActiveIndex] = useState(0)
	const [isAutoPlaying, setIsAutoPlaying] = useState(true)
	const [itemsPerView, setItemsPerView] = useState(3)
	const [isDragging, setIsDragging] = useState(false)
	const [startX, setStartX] = useState(0)
	const [scrollLeft, setScrollLeft] = useState(0)
	const containerRef = useRef<HTMLDivElement>(null)
	const intervalRef = useRef<NodeJS.Timeout | null>(null)
	const sliderRef = useRef<HTMLDivElement>(null)

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

	// Touch/Mouse handlers for swipe support
	const handleTouchStart = useCallback(
		(e: React.TouchEvent | React.MouseEvent) => {
			setIsAutoPlaying(false)
			setIsDragging(true)
			const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX
			setStartX(pageX)
			setScrollLeft(activeIndex)
		},
		[activeIndex]
	)

	const handleTouchMove = useCallback(
		(e: React.TouchEvent | React.MouseEvent) => {
			if (!isDragging) return
			e.preventDefault()
			const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX
			const walk = (pageX - startX) * -1
			const containerWidth = containerRef.current?.offsetWidth || 1
			const swipeRatio = walk / containerWidth
			const newIndex = scrollLeft + swipeRatio * itemsPerView

			// Constrain the index
			const constrainedIndex = Math.max(0, Math.min(maxIndex, newIndex))
			setActiveIndex(constrainedIndex)
		},
		[isDragging, startX, scrollLeft, maxIndex, itemsPerView]
	)

	const handleTouchEnd = useCallback(() => {
		setIsDragging(false)
		// Snap to nearest index
		const roundedIndex = Math.round(activeIndex)
		setActiveIndex(Math.max(0, Math.min(maxIndex, roundedIndex)))
	}, [activeIndex, maxIndex])

	return (
		<section className='relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden'>
			{/* Background decoration */}
			<div className='absolute inset-0 -z-10'>
				<div className='absolute top-0 left-1/2 -translate-x-1/2 w-[400px] sm:w-[600px] lg:w-[800px] h-[400px] sm:h-[600px] lg:h-[800px] bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-full blur-3xl' />
			</div>

			<div className='max-w-7xl mx-auto'>
				{/* Section Header */}
				<div className='text-center mb-8 sm:mb-12'>
					<div className='inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 backdrop-blur-sm mb-4 sm:mb-6'>
						<Sparkles className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary' />
						<span className='text-xs sm:text-sm font-medium text-primary'>
							Популярные инструменты
						</span>
					</div>
					<h2 className='text-3xl sm:text-4xl lg:text-6xl font-heading font-bold mb-4 sm:mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
						Исследуйте наши самые используемые инструменты
					</h2>
					<p className='text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 px-4 sm:px-0'>
						От CSS генераторов до утилит безопасности - откройте для себя
						профессиональные инструменты, которые тысячи разработчиков
						используют ежедневно
					</p>
				</div>

				{/* Carousel Container */}
				<div className='relative sm:px-8'>
					{/* Navigation Buttons - Hidden on mobile, visible on larger screens */}
					<Button
						variant='outline'
						size='icon'
						onClick={handlePrevious}
						className='hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 -translate-x-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background/90 backdrop-blur-sm border-border/50 hover:bg-background hover:border-primary/50 shadow-lg transition-all'
					>
						<ChevronLeft className='h-4 w-4 sm:h-5 sm:w-5' />
					</Button>
					<Button
						variant='outline'
						size='icon'
						onClick={handleNext}
						className='hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 translate-x-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background/90 backdrop-blur-sm border-border/50 hover:bg-background hover:border-primary/50 shadow-lg transition-all'
					>
						<ChevronRight className='h-4 w-4 sm:h-5 sm:w-5' />
					</Button>

					{/* Mobile Navigation - Visible only on mobile */}
					<div className='flex sm:hidden justify-between items-center mb-4'>
						<Button
							variant='ghost'
							size='sm'
							onClick={handlePrevious}
							disabled={activeIndex === 0}
							className='p-2'
						>
							<ChevronLeft className='h-5 w-5' />
						</Button>
						<span className='text-sm text-muted-foreground'>
							{Math.round(activeIndex) + 1} / {maxIndex + 1}
						</span>
						<Button
							variant='ghost'
							size='sm'
							onClick={handleNext}
							disabled={activeIndex === maxIndex}
							className='p-2'
						>
							<ChevronRight className='h-5 w-5' />
						</Button>
					</div>

					{/* Carousel Items */}
					<div ref={containerRef} className='overflow-hidden py-4'>
						<div
							ref={sliderRef}
							className={cn(
								'flex transition-transform ease-out',
								isDragging ? 'duration-0' : 'duration-500',
								itemsPerView === 1 ? 'gap-4' : 'gap-4 sm:gap-6'
							)}
							style={{
								transform:
									itemsPerView === 1
										? `translateX(calc(-${activeIndex * 100}% - ${activeIndex * 16}px))`
										: `translateX(-${activeIndex * (100 / itemsPerView)}%)`
							}}
							onTouchStart={handleTouchStart}
							onTouchMove={handleTouchMove}
							onTouchEnd={handleTouchEnd}
							onMouseDown={handleTouchStart}
							onMouseMove={handleTouchMove}
							onMouseUp={handleTouchEnd}
							onMouseLeave={handleTouchEnd}
						>
							{popularWidgets.map(widget => (
								<div
									key={widget.id}
									className={cn(
										'flex-shrink-0 transition-all duration-300 select-none',
										itemsPerView === 1
											? 'w-[calc(100%-32px)] mx-4 first:ml-4 last:mr-4'
											: itemsPerView === 2
												? 'w-[calc(50%-8px)]'
												: 'w-[calc(33.333%-16px)]'
									)}
								>
									<ToolCard
										widget={widget}
										locale={locale}
										showFavoriteButton={false}
										className='h-full'
									/>
								</div>
							))}
						</div>
					</div>

					{/* Dots Indicator */}
					<div className='flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6'>
						{Array.from({ length: maxIndex + 1 }).map((_, index) => (
							<button
								key={index}
								onClick={() => handleDotClick(index)}
								className={cn(
									'h-2 rounded-full transition-all duration-300',
									index === activeIndex
										? 'w-6 sm:w-8 bg-gradient-to-r from-primary to-accent'
										: 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
								)}
								aria-label={`Go to slide ${index + 1}`}
							/>
						))}
					</div>

					{/* Touch hint - shown only on mobile */}
					<p className='sm:hidden text-xs text-muted-foreground text-center mt-4'>
						Свайпайте для просмотра
					</p>
				</div>

				{/* CTA Button */}
				<div className='text-center mt-8 sm:mt-12'>
					<Link
						href='/tools'
						className='inline-flex items-center justify-center whitespace-nowrap rounded-xl font-semibold focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-all duration-200 ease-out border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent h-10 px-5 py-2.5 gap-2 text-sm sm:text-base'
					>
						Все инструменты
						<ArrowRight className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
					</Link>
				</div>
			</div>
		</section>
	)
}

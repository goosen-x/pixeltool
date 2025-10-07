'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { widgets } from '@/lib/constants/widgets'
import { ToolCard } from '@/components/tools/ToolCard'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'

export function SectionWidgetsCarousel() {
	// Get popular widgets (first 15)
	const popularWidgets = widgets.slice(0, 15)

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
					<h2 className='text-3xl sm:text-4xl lg:text-6xl font-heading font-bold mb-4 sm:mb-6'>
						Исследуйте наши самые используемые инструменты
					</h2>
					<p className='text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 px-4 sm:px-0'>
						От CSS генераторов до утилит безопасности - откройте для себя
						профессиональные инструменты, которые тысячи разработчиков
						используют ежедневно
					</p>
				</div>

				{/* Carousel */}
				<div className='relative px-4 sm:px-12 lg:px-16'>
					<Carousel
						opts={{
							align: 'start',
							loop: true
						}}
						plugins={[
							Autoplay({
								delay: 4000,
								stopOnInteraction: true
							})
						]}
						className='w-full'
					>
						<CarouselContent className='-ml-2 md:-ml-4 py-4'>
							{popularWidgets.map(widget => (
								<CarouselItem
									key={widget.id}
									className='pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3'
								>
									<ToolCard widget={widget} className='h-full' />
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious className='hidden sm:flex -left-4 lg:-left-6' />
						<CarouselNext className='hidden sm:flex -right-4 lg:-right-6' />
					</Carousel>

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

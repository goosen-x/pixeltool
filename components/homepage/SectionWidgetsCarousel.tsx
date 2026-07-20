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

// Порядок — по замеренному спросу (docs/seo/wordstat.md), а не по алфавиту или
// порядку в коде. Раньше здесь стоял widgets.slice(0, 15), и поскольку widgets
// собран как [...cssWidgets, ...htmlWidgets, ...], блок «Популярные инструменты»
// показывал 12 CSS и 3 HTML — то есть ровно тот кластер, который даёт 0,3%
// спроса, и ни одного из тех, что дают 72%.
const POPULAR_IDS = [
	'random-number-generator', // случайное число — 507k/мес
	'emoji-list', // эмодзи — 541k валовых
	'password-generator', // генератор паролей — 103k
	'qr-generator', // генератор qr — 41k
	'coin-flip',
	'dice-roller',
	'team-randomizer',
	'draw-lots',
	'text-counter',
	'special-symbols-picker',
	'text-case-converter',
	'uuid-generator',
	'base64-encoder',
	'color-contrast', // контраст — 4244, топ CSS-раздела
	'css-box-shadow' // тень — 2758
] as const

export function SectionWidgetsCarousel() {
	// filter(Boolean) — страховка: если id переименуют, блок потеряет карточку,
	// но не упадёт с undefined в ToolCard.
	const popularWidgets = POPULAR_IDS.map(id =>
		widgets.find(widget => widget.id === id)
	).filter((widget): widget is NonNullable<typeof widget> => Boolean(widget))

	return (
		<section className='relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden'>
			{/* Background decoration */}
			<div className='absolute inset-0 -z-10'>
				<div className='absolute top-0 left-1/2 -translate-x-1/2 w-[400px] sm:w-[600px] lg:w-[800px] h-[400px] sm:h-[600px] lg:h-[800px] bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-full blur-3xl' />
			</div>

			<div className='max-w-7xl mx-auto'>
				{/* Section Header */}
				<div className='text-center mb-8 sm:mb-12'>
					<div className='-rotate-3 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 backdrop-blur-sm mb-4 sm:mb-6'>
						<Sparkles className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary' />
						<span className='text-xs sm:text-sm font-medium text-primary'>
							Чаще всего открывают
						</span>
					</div>
					<h2 className='text-3xl sm:text-4xl lg:text-6xl font-heading font-bold mb-4 sm:mb-6 text-balance'>
						Популярные инструменты
					</h2>
					<p className='text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 px-4 sm:px-0'>
						То, за чем приходят чаще всего: случайные числа, QR-коды, пароли и
						эмодзи. Открывается сразу, ничего устанавливать не нужно.
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
						<CarouselContent className='-ml-2 md:-ml-4 py-4 items-stretch'>
							{popularWidgets.map(widget => (
								<CarouselItem
									key={widget.id}
									className='pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 flex'
								>
									<ToolCard widget={widget} className='h-full w-full' />
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious className='hidden sm:flex -left-8 lg:-left-12' />
						<CarouselNext className='hidden sm:flex -right-8 lg:-right-12' />
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

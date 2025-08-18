'use client'

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from '@/components/ui/carousel'
import { BlogCard } from './BlogCard'
import type { Post } from '@/lib/db/schema'
import Autoplay from 'embla-carousel-autoplay'

type Props = {
	posts: Post[]
	locale: string
}

export const BlogCarousel = ({ posts, locale }: Props) => {
	return (
		<Carousel
			opts={{
				align: 'start',
				loop: true
			}}
			plugins={[
				Autoplay({
					delay: 5000
				})
			]}
			className='w-full'
		>
			<CarouselContent className='-ml-2 md:-ml-4'>
				{posts.map(post => (
					<CarouselItem
						key={post.id}
						className='pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3'
					>
						<BlogCard post={post} locale={locale} />
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious className='hidden md:flex' />
			<CarouselNext className='hidden md:flex' />
		</Carousel>
	)
}

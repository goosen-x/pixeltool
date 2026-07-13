'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from '@/components/ui/carousel'
import type { Post } from '@/lib/types/post'

interface Props {
	posts: Post[]
}

/**
 * Карусель связанных статей. Обложка — главный элемент карточки: по картинке
 * тему статьи считывают быстрее, чем по заголовку.
 */
export function RelatedPostsCarousel({ posts }: Props) {
	return (
		<Carousel opts={{ align: 'start', loop: true }} className='mt-6'>
			{/* По две карточки в кадре, а не по три: embla отключает зацикливание,
			    если все слайды и так помещаются на экран — карусель упиралась бы
			    в край вместо того, чтобы идти по кругу */}
			<CarouselContent className='-ml-4'>
				{posts.map(post => (
					<CarouselItem key={post.slug} className='pl-4 sm:basis-1/2'>
						<Link
							href={`/blog/${post.slug}`}
							className='group block h-full cursor-pointer overflow-hidden rounded-xl border bg-card transition-colors hover:border-primary/40'
						>
							<div className='relative aspect-[16/9] overflow-hidden bg-muted'>
								<Image
									src={post.coverImage}
									alt={post.title}
									fill
									sizes='(max-width: 640px) 90vw, 320px'
									className='object-cover transition-transform duration-300 group-hover:scale-[1.03]'
								/>
							</div>

							<div className='p-4'>
								<h3 className='line-clamp-2 text-sm font-semibold transition-colors group-hover:text-primary'>
									{post.title}
								</h3>
								<p className='mt-2 line-clamp-2 text-xs text-muted-foreground'>
									{post.excerpt}
								</p>
							</div>
						</Link>
					</CarouselItem>
				))}
			</CarouselContent>

			{posts.length > 1 && (
				<>
					<CarouselPrevious className='hidden cursor-pointer sm:flex' />
					<CarouselNext className='hidden cursor-pointer sm:flex' />
				</>
			)}
		</Carousel>
	)
}

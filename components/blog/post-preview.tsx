import Link from 'next/link'
import { OptimizedImage } from '@/components/ui/optimized-image'
import { Author } from '@/lib/types/author'
import DateFormatter from './date-formatter'

import { PostCover } from './post-cover'

type Props = {
	title: string
	coverImage: string
	date: string
	excerpt: string
	author: Author
	slug: string
}

export function PostPreview({
	title,
	coverImage,
	date,
	excerpt,
	author,
	slug
}: Props) {

	const locale = 'ru'

	return (
		<article>
			<div className='mb-5'>
				<Link href={`/blog/${slug}`} className='group'>
					<PostCover title={title} slug={slug} className='aspect-[16/9]' />
				</Link>
			</div>
			<h3 className='text-3xl mb-3 leading-snug'></h3>
			<div className='flex items-center gap-4 mb-4'>
				<OptimizedImage
					src={author.picture}
					alt={author.name}
					className='w-10 h-10 rounded-full object-cover'
					width={40}
					height={40}
				/>
				<div className='flex flex-col'>
					<div className='font-semibold'>{author.name}</div>
					<div className='text-sm text-gray-500'>
						<DateFormatter dateString={date} />
					</div>
				</div>
			</div>
			<p className='text-lg leading-relaxed'>{excerpt}</p>
		</article>
	)
}

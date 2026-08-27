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
					<PostCover
						title={title}
						slug={slug}
						coverImage={coverImage}
						className='aspect-[16/9]'
					/>
				</Link>
			</div>
			<h3 className='mb-3 text-2xl font-bold leading-snug text-balance'>
				<Link
					href={`/blog/${slug}`}
					className='transition-colors hover:text-primary'
				>
					{title}
				</Link>
			</h3>
			<Link
				href='/blog/author'
				className='flex items-center gap-4 mb-4 w-fit cursor-pointer group'
			>
				<OptimizedImage
					src={author.picture}
					alt={author.name}
					className='w-10 h-10 rounded-full object-cover'
					width={40}
					height={40}
				/>
				<div className='flex flex-col'>
					<div className='font-semibold group-hover:text-primary transition-colors'>
						{author.name}
					</div>
					<div className='text-sm text-gray-500'>
						<DateFormatter dateString={date} />
					</div>
				</div>
			</Link>
			<p className='text-lg leading-relaxed'>{excerpt}</p>
		</article>
	)
}

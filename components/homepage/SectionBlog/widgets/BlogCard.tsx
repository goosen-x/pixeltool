import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PostCover } from '@/components/blog/post-cover'
import type { Post } from '@/lib/db/schema'
import { formatDate } from '@/lib/utils'

type Props = {
	post: Post
	locale: string
}

export const BlogCard = ({ post, locale }: Props) => {
	const formattedDate = formatDate(post.publishedAt.toISOString(), locale)

	return (
		<Link href={`/${locale}/blog/${post.slug}`}>
			<Card className='h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden group cursor-pointer'>
				<div className='h-48'>
					<PostCover title={post.title} slug={post.slug} className='h-full' />
				</div>
				<CardHeader className='space-y-2'>
					<div className='flex items-center justify-between'>
						<Badge variant='secondary' className='text-xs'>
							{post.category}
						</Badge>
						<time className='text-xs text-muted-foreground'>
							{formattedDate}
						</time>
					</div>
					<h3 className='text-lg font-heading font-semibold line-clamp-2 group-hover:text-accent transition-colors'>
						{post.title}
					</h3>
				</CardHeader>
				<CardContent>
					<p className='text-sm text-muted-foreground line-clamp-3'>
						{post.excerpt}
					</p>
					<div className='mt-4 flex items-center gap-2'>
						<span className='text-xs text-muted-foreground'>
							{post.readingTime} min read
						</span>
					</div>
				</CardContent>
			</Card>
		</Link>
	)
}

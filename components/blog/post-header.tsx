import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import DateFormatter from './date-formatter'
import { PostCover } from './post-cover'
import { getReadingTime } from '@/lib/blog/reading-time'
import { pluralizeRu } from '@/lib/utils/pluralize'
import { BlogPostActions } from './BlogPostActions'

type Props = {
	title: string
	coverImage: string
	date: string
	author: {
		name: string
		picture: string
	}
	slug: string
	content: string
}

export function PostHeader({
	title,
	coverImage,
	date,
	author,
	slug,
	content
}: Props) {
	const readingTime = getReadingTime(content)
	return (
		<>
			{/* Та же центрированная колонка, что у текста: иначе обложка и текст
			    начинаются с разных линий. Соотношение 16:9 — как у самих картинок
			    (1672x941), при других пропорциях object-cover срезает края */}
			<div className='mx-auto mb-8 max-w-3xl'>
				<PostCover
					title={title}
					slug={slug}
					coverImage={coverImage}
					className='aspect-[16/9] rounded-xl'
				/>
			</div>
			<div className='max-w-3xl mx-auto'>
				<h1 className='text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-8'>
					{title}
				</h1>
				<div className='flex flex-wrap items-center justify-between gap-4 mb-8'>
					<div className='flex items-center gap-4'>
						<Avatar>
							<AvatarImage
								src={author.picture}
								alt={author.name}
								className='object-cover'
							/>
							<AvatarFallback>
								{author.name
									.split(' ')
									.map(n => n[0])
									.join('')}
							</AvatarFallback>
						</Avatar>
						<div>
							<div className='font-semibold'>{author.name}</div>
							<div className='text-sm text-gray-500'>
								<DateFormatter dateString={date} /> · {readingTime}{' '}
								{pluralizeRu(readingTime, ['минута', 'минуты', 'минут'])} чтения
							</div>
						</div>
					</div>
					<BlogPostActions postId={slug} title={title} />
				</div>
			</div>
		</>
	)
}

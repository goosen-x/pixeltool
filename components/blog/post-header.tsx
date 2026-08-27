import Link from 'next/link'
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
					<Link
						href='/blog/author'
						className='flex items-center gap-4 cursor-pointer group'
					>
						<Avatar>
							{/* width/height как HTML-атрибуты, не только классы: без них,
							    если CSS не загрузился, голый <img> рендерится в свой
							    настоящий размер (854×1280 у avatar.jpeg) вместо 40×40,
							    а HTML-атрибуты размера работают независимо от CSS. */}
							<AvatarImage
								src={author.picture}
								alt={author.name}
								width={40}
								height={40}
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
							<div className='font-semibold group-hover:text-primary transition-colors'>
								{author.name}
							</div>
							<div className='text-sm text-gray-500'>
								<DateFormatter dateString={date} /> · {readingTime}{' '}
								{pluralizeRu(readingTime, ['минута', 'минуты', 'минут'])} чтения
							</div>
						</div>
					</Link>
					<BlogPostActions postId={slug} title={title} />
				</div>
			</div>
		</>
	)
}

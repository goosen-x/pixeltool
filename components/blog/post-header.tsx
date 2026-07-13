import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import DateFormatter from './date-formatter'
import { PostCover } from './post-cover'

type Props = {
	title: string
	coverImage: string
	date: string
	author: {
		name: string
		picture: string
	}
	slug: string
}

export function PostHeader({ title, coverImage, date, author, slug }: Props) {
	return (
		<>
			{/* Обложка занимает всю колонку статьи — до сайдбара. Соотношение 16:9,
			    как у самих картинок (1672x941), иначе object-cover срезает края */}
			<div className='mb-8'>
				<PostCover
					title={title}
					slug={slug}
					coverImage={coverImage}
					className='aspect-[16/9] rounded-xl'
				/>
			</div>
			<div className='max-w-2xl'>
				<h1 className='text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-8'>
					{title}
				</h1>
				<div className='flex items-center gap-4 mb-8'>
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
							<DateFormatter dateString={date} />
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

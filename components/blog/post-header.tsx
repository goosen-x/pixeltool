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

export function PostHeader({ title, date, author, slug }: Props) {
	return (
		<>
			<div className='mb-8'>
				<PostCover title={title} slug={slug} />
			</div>
			<div className='max-w-2xl mx-auto'>
				<h1 className='text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight mb-8'>
					{title}
				</h1>
				<div className='flex items-center gap-4 mb-8'>
					<Avatar>
						<AvatarImage src={author.picture} alt={author.name} />
						<AvatarFallback>
							{author.name.split(' ').map(n => n[0]).join('')}
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

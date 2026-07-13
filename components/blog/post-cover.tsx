import Image from 'next/image'
import { cn } from '@/lib/utils'
import { ComponentProps } from 'react'

type Props = {
	title: string
	slug: string
	/** Обложка статьи. Если её нет — рисуем градиентную заглушку */
	coverImage?: string
} & ComponentProps<'div'>

const coverPatterns = [
	{
		background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
		pattern: `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(0,0,0,0.1) 0%, transparent 70%)`
	},
	{
		background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
		pattern: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px),
              repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)`
	},
	{
		background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
		pattern: `radial-gradient(ellipse at top, rgba(255,255,255,0.2) 0%, transparent 70%),
              radial-gradient(ellipse at bottom, rgba(0,0,0,0.1) 0%, transparent 70%)`
	},
	{
		background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
		pattern: `conic-gradient(from 180deg at 50% 50%, rgba(255,255,255,0.15) 0deg, transparent 60deg, rgba(255,255,255,0.1) 120deg, transparent 180deg, rgba(255,255,255,0.05) 240deg, transparent 300deg, rgba(255,255,255,0.15) 360deg)`
	},
	{
		background: 'linear-gradient(135deg, #3494E6 0%, #EC6EAD 100%)',
		pattern: `repeating-radial-gradient(circle at 0 0, transparent 0, rgba(255,255,255,0.15) 15px, transparent 30px),
              repeating-radial-gradient(circle at 100% 100%, transparent 0, rgba(0,0,0,0.1) 15px, transparent 30px)`
	},
	{
		background: 'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)',
		pattern: `linear-gradient(30deg, rgba(255,255,255,0.2) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.2) 87.5%, rgba(255,255,255,0.2)),
              linear-gradient(150deg, rgba(255,255,255,0.2) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.2) 87.5%, rgba(255,255,255,0.2))`
	}
]

function getPatternForSlug(slug: string): (typeof coverPatterns)[0] {
	// Generate consistent pattern based on slug
	const index =
		slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) %
		coverPatterns.length
	return coverPatterns[index]
}

export function PostCover({ className, title, slug, coverImage }: Props) {
	const pattern = getPatternForSlug(slug)

	// Обложка есть — показываем её. Раньше coverImage игнорировался, и все
	// статьи получали одинаковую градиентную заглушку с заголовком поверх
	const hasCover = Boolean(coverImage) && coverImage !== '/images/avatar.jpeg'

	if (hasCover) {
		return (
			<div
				className={cn(
					'relative overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-[1.02]',
					className
				)}
			>
				<Image
					src={coverImage as string}
					alt={title}
					fill
					sizes='(max-width: 768px) 100vw, 900px'
					className='object-cover'
					priority
				/>
			</div>
		)
	}

	return (
		<div
			className={cn(
				'relative overflow-hidden flex items-center justify-center p-8 transition-transform duration-300 group-hover:scale-[1.02]',
				'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
				className
			)}
			style={{
				background: pattern.background
			}}
		>
			<div
				className='absolute inset-0 transition-opacity duration-300 group-hover:opacity-70'
				style={{
					backgroundImage: pattern.pattern
				}}
			/>
			<div className='relative z-10 text-center'>
				<h2 className='text-white text-xl md:text-2xl lg:text-3xl font-bold drop-shadow-lg line-clamp-3'>
					{title}
				</h2>
			</div>
		</div>
	)
}

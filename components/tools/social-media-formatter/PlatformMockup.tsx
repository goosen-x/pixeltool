'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
	Heart,
	MessageCircle,
	Share,
	Bookmark,
	MoreHorizontal,
	CheckCircle,
	Repeat2
} from 'lucide-react'

export interface PlatformMockupProps {
	platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok'
	text: string
	className?: string
}

export function PlatformMockup({
	platform,
	text,
	className
}: PlatformMockupProps) {
	const formatText = (text: string) => {
		if (!text.trim()) return 'Your formatted text will appear here...'
		return text
	}

	if (platform === 'instagram') {
		return (
			<Card
				className={cn(
					'max-w-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800',
					className
				)}
			>
				{/* Header */}
				<div className='p-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800'>
					<div className='flex items-center gap-3'>
						<Avatar className='w-8 h-8'>
							<AvatarImage src='/placeholder-user.jpg' />
							<AvatarFallback className='bg-gradient-to-br from-purple-400 to-pink-400 text-white text-xs'>
								JD
							</AvatarFallback>
						</Avatar>
						<div>
							<div className='flex items-center gap-1'>
								<span className='text-sm font-semibold'>johndoe</span>
								<CheckCircle className='w-3 h-3 text-blue-500' />
							</div>
							<span className='text-xs text-gray-500'>2 hours ago</span>
						</div>
					</div>
					<MoreHorizontal className='w-5 h-5 text-gray-600' />
				</div>

				{/* Image placeholder */}
				<div className='aspect-square bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900 dark:to-purple-900 flex items-center justify-center'>
					<div className='text-6xl opacity-20'>📸</div>
				</div>

				{/* Actions */}
				<div className='p-3 space-y-2'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-4'>
							<Heart className='w-6 h-6 text-gray-700 dark:text-gray-300' />
							<MessageCircle className='w-6 h-6 text-gray-700 dark:text-gray-300' />
							<Share className='w-6 h-6 text-gray-700 dark:text-gray-300' />
						</div>
						<Bookmark className='w-6 h-6 text-gray-700 dark:text-gray-300' />
					</div>

					<div className='text-sm'>
						<span className='font-semibold'>1,234 likes</span>
					</div>

					{/* Caption */}
					<div className='text-sm'>
						<span className='font-semibold mr-2'>johndoe</span>
						<span className='whitespace-pre-wrap text-gray-800 dark:text-gray-200'>
							{formatText(text)}
						</span>
					</div>

					<div className='text-xs text-gray-500'>View all 89 comments</div>
				</div>
			</Card>
		)
	}

	if (platform === 'facebook') {
		return (
			<Card
				className={cn(
					'max-w-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800',
					className
				)}
			>
				{/* Header */}
				<div className='p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800'>
					<div className='flex items-center gap-3'>
						<Avatar className='w-10 h-10'>
							<AvatarImage src='/placeholder-user.jpg' />
							<AvatarFallback className='bg-blue-500 text-white'>
								JD
							</AvatarFallback>
						</Avatar>
						<div>
							<div className='flex items-center gap-2'>
								<span className='font-semibold'>John Doe</span>
								<Badge variant='secondary' className='text-xs'>
									Following
								</Badge>
							</div>
							<span className='text-xs text-gray-500'>2h • 🌍</span>
						</div>
					</div>
					<MoreHorizontal className='w-5 h-5 text-gray-600' />
				</div>

				{/* Content */}
				<div className='p-4'>
					<div className='text-sm whitespace-pre-wrap text-gray-800 dark:text-gray-200'>
						{formatText(text)}
					</div>
				</div>

				{/* Actions */}
				<div className='border-t border-gray-100 dark:border-gray-800'>
					<div className='px-4 py-2 flex items-center justify-between text-xs text-gray-500'>
						<span>👍❤️😊 You and 127 others</span>
						<span>23 comments • 5 shares</span>
					</div>
					<div className='border-t border-gray-100 dark:border-gray-800 flex'>
						<button className='flex-1 py-2 flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'>
							<Heart className='w-4 h-4' />
							<span className='text-sm'>Like</span>
						</button>
						<button className='flex-1 py-2 flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'>
							<MessageCircle className='w-4 h-4' />
							<span className='text-sm'>Comment</span>
						</button>
						<button className='flex-1 py-2 flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'>
							<Share className='w-4 h-4' />
							<span className='text-sm'>Share</span>
						</button>
					</div>
				</div>
			</Card>
		)
	}

	if (platform === 'twitter') {
		return (
			<Card
				className={cn(
					'max-w-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800',
					className
				)}
			>
				<div className='p-4'>
					{/* Header */}
					<div className='flex items-start gap-3'>
						<Avatar className='w-12 h-12'>
							<AvatarImage src='/placeholder-user.jpg' />
							<AvatarFallback className='bg-blue-500 text-white'>
								JD
							</AvatarFallback>
						</Avatar>

						<div className='flex-1 min-w-0'>
							<div className='flex items-center gap-1 flex-wrap'>
								<span className='font-bold text-gray-900 dark:text-white'>
									John Doe
								</span>
								<CheckCircle className='w-4 h-4 text-blue-500' />
								<span className='text-gray-500'>@johndoe</span>
								<span className='text-gray-500'>•</span>
								<span className='text-gray-500 text-sm'>2h</span>
								<MoreHorizontal className='w-5 h-5 text-gray-500 ml-auto' />
							</div>

							{/* Content */}
							<div className='mt-2 text-gray-900 dark:text-white whitespace-pre-wrap'>
								{formatText(text)}
							</div>

							{/* Actions */}
							<div className='flex items-center justify-between mt-4 max-w-md'>
								<button className='flex items-center gap-2 text-gray-500 hover:text-blue-500 group'>
									<div className='p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 -m-2'>
										<MessageCircle className='w-5 h-5' />
									</div>
									<span className='text-sm'>47</span>
								</button>
								<button className='flex items-center gap-2 text-gray-500 hover:text-green-500 group'>
									<div className='p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20 -m-2'>
										<Repeat2 className='w-5 h-5' />
									</div>
									<span className='text-sm'>12</span>
								</button>
								<button className='flex items-center gap-2 text-gray-500 hover:text-red-500 group'>
									<div className='p-2 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-900/20 -m-2'>
										<Heart className='w-5 h-5' />
									</div>
									<span className='text-sm'>184</span>
								</button>
								<button className='flex items-center gap-2 text-gray-500 hover:text-blue-500 group'>
									<div className='p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 -m-2'>
										<Share className='w-5 h-5' />
									</div>
								</button>
							</div>
						</div>
					</div>
				</div>
			</Card>
		)
	}

	if (platform === 'linkedin') {
		return (
			<Card
				className={cn(
					'max-w-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800',
					className
				)}
			>
				<div className='p-4'>
					{/* Header */}
					<div className='flex items-center gap-3 mb-3'>
						<Avatar className='w-12 h-12'>
							<AvatarImage src='/placeholder-user.jpg' />
							<AvatarFallback className='bg-blue-600 text-white'>
								JD
							</AvatarFallback>
						</Avatar>
						<div className='flex-1'>
							<div className='flex items-center justify-between'>
								<div>
									<div className='font-semibold text-gray-900 dark:text-white'>
										John Doe
									</div>
									<div className='text-sm text-gray-600 dark:text-gray-400'>
										Senior Developer at TechCorp
									</div>
									<div className='text-xs text-gray-500'>2h • 🌍</div>
								</div>
								<MoreHorizontal className='w-5 h-5 text-gray-600' />
							</div>
						</div>
					</div>

					{/* Content */}
					<div className='text-sm text-gray-900 dark:text-white whitespace-pre-wrap mb-4'>
						{formatText(text)}
					</div>

					{/* Actions */}
					<div className='border-t border-gray-100 dark:border-gray-800 pt-2'>
						<div className='flex items-center text-xs text-gray-500 mb-2'>
							<span>👍💡❤️ 47 reactions • 12 comments</span>
						</div>
						<div className='flex items-center justify-around'>
							<button className='flex items-center gap-2 py-2 px-4 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded'>
								<Heart className='w-4 h-4' />
								<span className='text-sm'>Like</span>
							</button>
							<button className='flex items-center gap-2 py-2 px-4 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded'>
								<MessageCircle className='w-4 h-4' />
								<span className='text-sm'>Comment</span>
							</button>
							<button className='flex items-center gap-2 py-2 px-4 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded'>
								<Repeat2 className='w-4 h-4' />
								<span className='text-sm'>Repost</span>
							</button>
							<button className='flex items-center gap-2 py-2 px-4 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded'>
								<Share className='w-4 h-4' />
								<span className='text-sm'>Send</span>
							</button>
						</div>
					</div>
				</div>
			</Card>
		)
	}

	if (platform === 'tiktok') {
		return (
			<Card
				className={cn(
					'max-w-sm bg-black text-white border-gray-800',
					className
				)}
			>
				<div className='aspect-[9/16] relative overflow-hidden'>
					{/* Background */}
					<div className='absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 opacity-30'></div>

					{/* Content overlay */}
					<div className='absolute inset-0 p-4 flex flex-col justify-between'>
						{/* Top */}
						<div className='flex items-center justify-between'>
							<div className='text-white text-sm'>Following</div>
							<div className='text-white text-sm'>For You</div>
						</div>

						{/* Bottom content */}
						<div className='space-y-4'>
							{/* Text content */}
							<div className='text-white text-sm whitespace-pre-wrap'>
								{formatText(text)}
							</div>

							{/* User info and actions */}
							<div className='flex items-end justify-between'>
								<div className='flex-1'>
									<div className='flex items-center gap-2 mb-2'>
										<Avatar className='w-8 h-8 border-2 border-white'>
											<AvatarImage src='/placeholder-user.jpg' />
											<AvatarFallback className='bg-pink-500 text-white text-xs'>
												JD
											</AvatarFallback>
										</Avatar>
										<span className='font-semibold text-white'>@johndoe</span>
									</div>

									<div className='text-xs text-gray-300'>
										🎵 Original sound - johndoe
									</div>
								</div>

								{/* Side actions */}
								<div className='flex flex-col items-center gap-4 ml-4'>
									<div className='text-center'>
										<div className='w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-1'>
											<Heart className='w-6 h-6 text-white' />
										</div>
										<div className='text-xs text-white'>12.3K</div>
									</div>
									<div className='text-center'>
										<div className='w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-1'>
											<MessageCircle className='w-6 h-6 text-white' />
										</div>
										<div className='text-xs text-white'>1,234</div>
									</div>
									<div className='text-center'>
										<div className='w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-1'>
											<Share className='w-6 h-6 text-white' />
										</div>
										<div className='text-xs text-white'>Share</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Card>
		)
	}

	return null
}

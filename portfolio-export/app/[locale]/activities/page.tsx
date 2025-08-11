import { getTranslations } from 'next-intl/server'
import {
	Code2,
	Users,
	BookOpen,
	Award,
	GitBranch,
	MessageSquare,
	Lightbulb,
	Calendar,
	ExternalLink,
	Trophy,
	Target,
	Zap,
	TrendingUp
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Image from 'next/image'
import { GitHubActivity } from '@/components/activities/GitHubActivity'
import { cn } from '@/lib/utils'

type Props = {
	params: Promise<{
		locale: string
	}>
}

export default async function ActivitiesPage({ params }: Props) {
	const locale = (await params).locale
	const t = await getTranslations('activities')

	return (
		<main className='pt-12'>
			<div className='max-w-7xl mx-auto px-5'>
				<div className='mb-12'>
					<h1 className='text-4xl font-bold mb-4'>{t('title')}</h1>
					<p className='text-xl text-muted-foreground'>{t('description')}</p>
				</div>

				{/* Bento Grid Layout */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12'>
					{/* GitHub Activity - Large card spanning 2 columns and 2 rows */}
					<div className='md:col-span-2 lg:row-span-2'>
						<GitHubActivity username='goosen-x' />
					</div>

					{/* Stats Cards - 4 small cards */}
					<Card className='p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20'>
						<div className='flex items-center justify-between mb-2'>
							<GitBranch className='w-8 h-8 text-blue-600' />
							<Badge variant='secondary' className='bg-blue-500/20'>
								{t('badges.active')}
							</Badge>
						</div>
						<div className='text-3xl font-bold mb-1'>9</div>
						<p className='text-sm text-muted-foreground'>
							{t('stats.completed')}
						</p>
					</Card>

					<Card className='p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20'>
						<div className='flex items-center justify-between mb-2'>
							<MessageSquare className='w-8 h-8 text-purple-600' />
							<Badge variant='secondary' className='bg-purple-500/20'>
								{t('badges.planned')}
							</Badge>
						</div>
						<div className='text-3xl font-bold mb-1'>1</div>
						<p className='text-sm text-muted-foreground'>
							{t('stats.csstalk')}
						</p>
					</Card>

					<Card className='p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20'>
						<div className='flex items-center justify-between mb-2'>
							<BookOpen className='w-8 h-8 text-green-600' />
							<Badge variant='secondary' className='bg-green-500/20'>
								{t('badges.ongoing')}
							</Badge>
						</div>
						<div className='text-3xl font-bold mb-1'>16</div>
						<p className='text-sm text-muted-foreground'>
							{t('stats.courses')}
						</p>
					</Card>

					<Card className='p-6 bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20'>
						<div className='flex items-center justify-between mb-2'>
							<Lightbulb className='w-8 h-8 text-orange-600' />
							<Badge variant='secondary' className='bg-orange-500/20'>
								{t('badges.live')}
							</Badge>
						</div>
						<div className='text-3xl font-bold mb-1'>3</div>
						<p className='text-sm text-muted-foreground'>
							{t('stats.projects')}
						</p>
					</Card>

					{/* Codewars Badge - Medium card */}
					<Card className='md:col-span-2 lg:col-span-2 p-6'>
						<div className='flex items-center justify-between mb-4'>
							<div className='flex items-center gap-3'>
								<div className='p-2 rounded-lg bg-red-500/10'>
									<Code2 className='w-6 h-6 text-red-600' />
								</div>
								<h3 className='text-xl font-bold'>{t('sections.codewars')}</h3>
							</div>
							<Link
								href='https://www.codewars.com/users/gysen'
								target='_blank'
								rel='noopener noreferrer'
								className='text-muted-foreground hover:text-primary transition-colors'
								title={t('viewProfile')}
							>
								<ExternalLink className='w-5 h-5' />
							</Link>
						</div>
						<div className='flex justify-start py-2'>
							<Image
								src='https://www.codewars.com/users/gysen/badges/large'
								alt='Codewars Badge'
								width={400}
								height={60}
								className='max-w-full h-auto'
								unoptimized
							/>
						</div>
					</Card>

					{/* Recent Achievement */}
					<Card className='lg:col-span-2 p-6 bg-gradient-to-br from-yellow-500/10 to-amber-600/10 border-yellow-500/20'>
						<div className='flex items-start gap-4'>
							<div className='p-3 rounded-lg bg-yellow-500/20'>
								<Trophy className='w-8 h-8 text-yellow-600' />
							</div>
							<div className='flex-1'>
								<h3 className='font-semibold text-lg mb-1'>
									{t('sections.achievement')}
								</h3>
								<p className='text-sm text-muted-foreground mb-3'>
									{t('sections.achievementText')}
								</p>
								<div className='flex items-center gap-2 text-sm'>
									<Calendar className='w-4 h-4' />
									<span className='text-muted-foreground'>
										{t('february')} 2025
									</span>
								</div>
							</div>
						</div>
					</Card>

					{/* Community Involvement - Large card */}
					<Card className='md:col-span-2 lg:col-span-2 p-6'>
						<div className='flex items-start justify-between mb-4'>
							<div className='flex items-center gap-3'>
								<div className='p-2 rounded-lg bg-blue-500/10'>
									<Users className='w-6 h-6 text-blue-600' />
								</div>
								<h3 className='text-xl font-bold'>{t('sections.community')}</h3>
							</div>
						</div>
						<div className='space-y-3'>
							<div className='flex items-center gap-3'>
								<div className='w-2 h-2 rounded-full bg-blue-500' />
								<span className='text-sm'>
									{t('sections.communityItems.react')}
								</span>
							</div>
							<div className='flex items-center gap-3'>
								<div className='w-2 h-2 rounded-full bg-blue-500' />
								<span className='text-sm'>
									{t('sections.communityItems.meetups')}
								</span>
							</div>
							<div className='flex items-center gap-3'>
								<div className='w-2 h-2 rounded-full bg-blue-500' />
								<span className='text-sm'>
									{t('sections.communityItems.mentor')}
								</span>
							</div>
						</div>
					</Card>

					{/* Learning Path - Tall card */}
					<Card className='lg:row-span-2 p-6'>
						<div className='flex items-center gap-3 mb-4'>
							<div className='p-2 rounded-lg bg-purple-500/10'>
								<TrendingUp className='w-6 h-6 text-purple-600' />
							</div>
							<h3 className='text-lg font-bold'>{t('sections.learning')}</h3>
						</div>
						<div className='space-y-4'>
							<div className='relative'>
								<div className='absolute left-2 top-2 bottom-0 w-0.5 bg-purple-200 dark:bg-purple-800' />
								<div className='space-y-4'>
									<div className='flex gap-3'>
										<div className='w-4 h-4 rounded-full bg-purple-500 mt-1 relative z-10' />
										<div className='flex-1'>
											<p className='font-medium text-sm'>
												{t('sections.learningItems.ai')}
											</p>
											<p className='text-xs text-muted-foreground'>
												{t('sections.status.progress')}
											</p>
										</div>
									</div>
									<div className='flex gap-3'>
										<div className='w-4 h-4 rounded-full bg-purple-300 mt-1 relative z-10' />
										<div className='flex-1'>
											<p className='font-medium text-sm'>
												{t('sections.learningItems.system')}
											</p>
											<p className='text-xs text-muted-foreground'>
												{t('sections.status.completed')}
											</p>
										</div>
									</div>
									<div className='flex gap-3'>
										<div className='w-4 h-4 rounded-full bg-purple-300 mt-1 relative z-10' />
										<div className='flex-1'>
											<p className='font-medium text-sm'>
												{t('sections.learningItems.typescript')}
											</p>
											<p className='text-xs text-muted-foreground'>
												{t('sections.status.completed')}
											</p>
										</div>
									</div>
									<div className='flex gap-3'>
										<div className='w-4 h-4 rounded-full bg-purple-300 mt-1 relative z-10' />
										<div className='flex-1'>
											<p className='font-medium text-sm'>
												{t('sections.learningItems.performance')}
											</p>
											<p className='text-xs text-muted-foreground'>
												{t('sections.status.completed')}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Card>

					{/* Quick Skills */}
					<Card className='p-6'>
						<div className='flex items-center gap-3 mb-4'>
							<div className='p-2 rounded-lg bg-green-500/10'>
								<Zap className='w-6 h-6 text-green-600' />
							</div>
							<h3 className='text-lg font-bold'>{t('sections.skills')}</h3>
						</div>
						<div className='flex flex-wrap gap-2'>
							<Badge variant='secondary'>React</Badge>
							<Badge variant='secondary'>TypeScript</Badge>
							<Badge variant='secondary'>Next.js</Badge>
							<Badge variant='secondary'>Node.js</Badge>
							<Badge variant='secondary'>PostgreSQL</Badge>
						</div>
					</Card>

					{/* Goals */}
					<Card className='md:col-span-2 lg:col-span-2 p-6 bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 border-indigo-500/20'>
						<div className='flex items-center gap-3 mb-4'>
							<div className='p-2 rounded-lg bg-indigo-500/20'>
								<Target className='w-6 h-6 text-indigo-600' />
							</div>
							<h3 className='text-lg font-bold'>{t('sections.goals')}</h3>
						</div>
						<div className='grid grid-cols-2 gap-4'>
							<div>
								<p className='text-xs font-medium mb-1'>
									{t('sections.goalsItems.oss')}
								</p>
								<div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
									<div
										className='bg-indigo-500 h-2 rounded-full'
										style={{ width: '50%' }}
									/>
								</div>
							</div>
							<div>
								<p className='text-xs font-medium mb-1'>
									{t('sections.goalsItems.rust')}
								</p>
								<div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
									<div
										className='bg-indigo-500 h-2 rounded-full'
										style={{ width: '15%' }}
									/>
								</div>
							</div>
						</div>
					</Card>
				</div>

				{/* Call to Action */}
				<Card className='p-8 text-center bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20'>
					<h3 className='text-2xl font-bold mb-4'>{t('cta.title')}</h3>
					<p className='text-muted-foreground mb-6 max-w-2xl mx-auto'>
						{t('cta.description')}
					</p>
					<div className='flex justify-center gap-4'>
						<Link href={`/${locale}/contact`}>
							<button className='px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'>
								{t('cta.button')}
							</button>
						</Link>
					</div>
				</Card>
			</div>
		</main>
	)
}
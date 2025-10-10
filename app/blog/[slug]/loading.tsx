import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function BlogPostLoading() {
	return (
		<div className='min-h-screen bg-gradient-to-b from-background to-background/80'>
			<div className='container max-w-4xl mx-auto px-4 py-16'>
				{/* Header */}
				<div className='space-y-6 mb-12'>
					{/* Breadcrumbs */}
					<div className='flex gap-2 text-sm'>
						<Skeleton className='h-5 w-16' />
						<span className='text-muted-foreground'>/</span>
						<Skeleton className='h-5 w-24' />
						<span className='text-muted-foreground'>/</span>
						<Skeleton className='h-5 w-48' />
					</div>

					{/* Title */}
					<Skeleton className='h-14 w-3/4' />

					{/* Meta */}
					<div className='flex items-center gap-4'>
						<Skeleton className='h-10 w-10 rounded-full' />
						<div className='space-y-2'>
							<Skeleton className='h-4 w-32' />
							<Skeleton className='h-3 w-24' />
						</div>
					</div>
				</div>

				{/* Cover Image */}
				<Card className='mb-12 overflow-hidden'>
					<Skeleton className='h-96 w-full' />
				</Card>

				{/* Content */}
				<article className='prose prose-lg dark:prose-invert max-w-none'>
					<div className='space-y-4'>
						<Skeleton className='h-6 w-full' />
						<Skeleton className='h-6 w-full' />
						<Skeleton className='h-6 w-4/5' />

						<div className='py-4'>
							<Skeleton className='h-10 w-48 mb-4' />
							<Skeleton className='h-5 w-full' />
							<Skeleton className='h-5 w-full' />
							<Skeleton className='h-5 w-3/4' />
						</div>

						<Skeleton className='h-6 w-full' />
						<Skeleton className='h-6 w-full' />
						<Skeleton className='h-6 w-5/6' />

						{/* Code Block */}
						<Card className='my-8'>
							<CardContent className='p-6'>
								<div className='space-y-2'>
									<Skeleton className='h-4 w-full' />
									<Skeleton className='h-4 w-5/6' />
									<Skeleton className='h-4 w-4/6' />
									<Skeleton className='h-4 w-full' />
								</div>
							</CardContent>
						</Card>

						<Skeleton className='h-6 w-full' />
						<Skeleton className='h-6 w-full' />
						<Skeleton className='h-6 w-2/3' />
					</div>
				</article>

				{/* Related Posts */}
				<div className='mt-16 space-y-6'>
					<Skeleton className='h-8 w-48' />
					<div className='grid gap-6 md:grid-cols-3'>
						{[1, 2, 3].map(i => (
							<Card key={i}>
								<Skeleton className='h-48 w-full rounded-t-lg' />
								<CardContent className='p-4 space-y-2'>
									<Skeleton className='h-6 w-full' />
									<Skeleton className='h-4 w-4/5' />
									<Skeleton className='h-3 w-24' />
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

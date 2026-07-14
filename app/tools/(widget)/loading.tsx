import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function ToolLoading() {
	return (
		<div className='container max-w-7xl mx-auto px-4 py-8'>
			<div className='grid gap-6 lg:grid-cols-[1fr_300px]'>
				{/* Main Content */}
				<div className='space-y-6'>
					{/* Header */}
					<div className='space-y-4'>
						<Skeleton className='h-12 w-3/4' />
						<Skeleton className='h-6 w-full' />
						<Skeleton className='h-6 w-2/3' />
					</div>

					{/* Widget Card */}
					<Card>
						<CardHeader>
							<Skeleton className='h-8 w-48' />
						</CardHeader>
						<CardContent className='space-y-4'>
							<Skeleton className='h-12 w-full' />
							<Skeleton className='h-12 w-full' />
							<Skeleton className='h-24 w-full' />
						</CardContent>
					</Card>

					{/* Result Card */}
					<Card>
						<CardHeader>
							<Skeleton className='h-8 w-32' />
						</CardHeader>
						<CardContent>
							<Skeleton className='h-48 w-full' />
						</CardContent>
					</Card>
				</div>

				{/* Sidebar */}
				<aside className='space-y-4'>
					<Card>
						<CardHeader>
							<Skeleton className='h-6 w-32' />
						</CardHeader>
						<CardContent className='space-y-3'>
							<Skeleton className='h-4 w-full' />
							<Skeleton className='h-4 w-3/4' />
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<Skeleton className='h-6 w-24' />
						</CardHeader>
						<CardContent className='space-y-2'>
							<Skeleton className='h-8 w-full' />
							<Skeleton className='h-8 w-full' />
						</CardContent>
					</Card>
				</aside>
			</div>
		</div>
	)
}

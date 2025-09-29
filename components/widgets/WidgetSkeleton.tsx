'use client'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { usePathname } from 'next/navigation'

export function WidgetSkeleton() {
	const pathname = usePathname()
	const widgetPath = pathname.split('/').pop()

	// Use specialized skeleton for speed test
	if (widgetPath === 'internet-speed-test') {
		return <WidgetSkeletonSpeedTest />
	}


	return (
		<div className='max-w-6xl mx-auto space-y-8 skeleton-fade-in'>
			{/* Header Skeleton */}
			{/* <div>
        <Skeleton className="h-9 w-72 mb-2" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div> */}

			{/* Main Content Area */}
			<div className='grid gap-6 lg:grid-cols-2'>
				{/* Left Column - Input Area */}
				<Card className='p-6'>
					<Skeleton className='h-6 w-32 mb-4' />
					<div className='space-y-4'>
						<div>
							<Skeleton className='h-4 w-20 mb-2' />
							<Skeleton className='h-10 w-full' />
						</div>
						<div>
							<Skeleton className='h-4 w-24 mb-2' />
							<Skeleton className='h-10 w-full' />
						</div>
						<div className='flex gap-4'>
							<div className='flex-1'>
								<Skeleton className='h-4 w-16 mb-2' />
								<Skeleton className='h-10 w-full' />
							</div>
							<div className='flex-1'>
								<Skeleton className='h-4 w-20 mb-2' />
								<Skeleton className='h-10 w-full' />
							</div>
						</div>
					</div>
					<div className='flex gap-2 mt-6'>
						<Skeleton className='h-10 flex-1' />
						<Skeleton className='h-10 w-24' />
					</div>
				</Card>

				{/* Right Column - Output Area */}
				<Card className='p-6'>
					<Skeleton className='h-6 w-28 mb-4' />
					<div className='space-y-4'>
						<Skeleton className='h-32 w-full rounded-lg' />
						<div className='flex items-center justify-between'>
							<Skeleton className='h-4 w-32' />
							<div className='flex gap-2'>
								<Skeleton className='h-8 w-20' />
								<Skeleton className='h-8 w-20' />
							</div>
						</div>
					</div>
				</Card>
			</div>

			{/* Related Tools Section */}
			<Card className='mt-8'>
				<div className='p-6'>
					<Skeleton className='h-6 w-40 mb-4' />
					<div className='grid gap-3 sm:grid-cols-3'>
						{[1, 2, 3].map(i => (
							<div
								key={i}
								className='flex items-center gap-3 rounded-lg border p-3'
							>
								<Skeleton className='w-10 h-10 rounded-lg flex-shrink-0' />
								<Skeleton className='h-4 flex-1' />
								<Skeleton className='h-4 w-4' />
							</div>
						))}
					</div>
				</div>
			</Card>

			{/* FAQ Section */}
			<Card className='mt-8'>
				<div className='p-6'>
					<Skeleton className='h-6 w-48 mb-6' />
					<div className='space-y-4'>
						{[1, 2, 3, 4, 5].map(i => (
							<div key={i} className='border rounded-lg p-4'>
								<div className='flex items-center justify-between'>
									<Skeleton className='h-5 flex-1 mr-4' />
									<Skeleton className='h-5 w-5' />
								</div>
							</div>
						))}
					</div>
				</div>
			</Card>

			{/* Bottom Info Section */}
			<Card className='p-6 bg-muted/50'>
				<Skeleton className='h-6 w-40 mb-3' />
				<div className='grid md:grid-cols-2 gap-4'>
					<div>
						<Skeleton className='h-5 w-32 mb-2' />
						<Skeleton className='h-4 w-full' />
						<Skeleton className='h-4 w-3/4 mt-1' />
					</div>
					<div>
						<Skeleton className='h-5 w-28 mb-2' />
						<Skeleton className='h-4 w-full' />
						<Skeleton className='h-4 w-5/6 mt-1' />
					</div>
				</div>
			</Card>
		</div>
	)
}

export function WidgetSkeletonSpeedTest() {
	return (
		<div className='max-w-6xl mx-auto space-y-8 skeleton-fade-in'>
			{/* Header Skeleton */}
			<div>
				<Skeleton className='h-9 w-72 mb-2' />
				<Skeleton className='h-5 w-96 max-w-full' />
			</div>

			{/* Tabs */}
			<div className='flex space-x-1 mb-6'>
				<Skeleton className='h-10 w-32 rounded-lg' />
				<Skeleton className='h-10 w-32 rounded-lg' />
				<Skeleton className='h-10 w-32 rounded-lg' />
			</div>

			{/* Main Speed Test Card */}
			<Card className='overflow-hidden'>
				<div className='p-8'>
					{/* Circular Progress Meter */}
					<div className='mb-8 flex justify-center'>
						<div className='relative w-64 h-64'>
							<Skeleton className='w-full h-full rounded-full' />
							<div className='absolute inset-0 flex items-center justify-center'>
								<div className='text-center'>
									<Skeleton className='h-12 w-24 mb-2' />
									<Skeleton className='h-4 w-12' />
								</div>
							</div>
						</div>
					</div>

					{/* Speed Cards */}
					<div className='grid gap-4 md:grid-cols-3 mb-6'>
						{[1, 2, 3].map(i => (
							<div key={i} className='p-4 rounded-lg border'>
								<div className='flex items-center gap-2 mb-2'>
									<Skeleton className='w-8 h-8 rounded-lg' />
									<Skeleton className='h-4 w-20' />
								</div>
								<Skeleton className='h-7 w-16 mb-1' />
								<Skeleton className='h-3 w-8' />
							</div>
						))}
					</div>

					{/* Connection Info */}
					<div className='flex items-center justify-center gap-6 mb-6'>
						<div className='flex items-center gap-2'>
							<Skeleton className='w-4 h-4' />
							<Skeleton className='h-4 w-24' />
						</div>
						<Skeleton className='w-px h-4' />
						<div className='flex items-center gap-2'>
							<Skeleton className='w-4 h-4' />
							<Skeleton className='h-4 w-28' />
						</div>
					</div>

					{/* Start Button */}
					<div className='flex justify-center'>
						<Skeleton className='h-12 w-40 rounded-md' />
					</div>
				</div>
			</Card>

			{/* Info Card */}
			<Card>
				<div className='p-6'>
					<Skeleton className='h-6 w-40 mb-4' />
					<div className='space-y-3'>
						<Skeleton className='h-4 w-full' />
						<Skeleton className='h-4 w-3/4' />
						<div className='mt-4'>
							<Skeleton className='h-5 w-32 mb-3' />
							<div className='space-y-2'>
								<Skeleton className='h-4 w-full' />
								<Skeleton className='h-4 w-5/6' />
								<Skeleton className='h-4 w-4/5' />
							</div>
						</div>
					</div>
				</div>
			</Card>

			{/* Related Tools Section */}
			<Card className='mt-8'>
				<div className='p-6'>
					<Skeleton className='h-6 w-40 mb-4' />
					<div className='grid gap-3 sm:grid-cols-3'>
						{[1, 2, 3].map(i => (
							<div
								key={i}
								className='flex items-center gap-3 rounded-lg border p-3'
							>
								<Skeleton className='w-10 h-10 rounded-lg flex-shrink-0' />
								<Skeleton className='h-4 flex-1' />
								<Skeleton className='h-4 w-4' />
							</div>
						))}
					</div>
				</div>
			</Card>

			{/* FAQ Section */}
			<Card className='mt-8'>
				<div className='p-6'>
					<Skeleton className='h-6 w-48 mb-6' />
					<div className='space-y-4'>
						{[1, 2, 3, 4, 5].map(i => (
							<div key={i} className='border rounded-lg p-4'>
								<div className='flex items-center justify-between'>
									<Skeleton className='h-5 flex-1 mr-4' />
									<Skeleton className='h-5 w-5' />
								</div>
							</div>
						))}
					</div>
				</div>
			</Card>
		</div>
	)
}


export function WidgetSkeletonSimple() {
	return (
		<div className='max-w-6xl mx-auto space-y-8 skeleton-fade-in'>
			{/* Header Skeleton */}
			<div>
				<Skeleton className='h-9 w-64 mb-2' />
				<Skeleton className='h-5 w-80 max-w-full' />
			</div>

			{/* Single Card */}
			<Card className='p-6'>
				<div className='space-y-4'>
					<div>
						<Skeleton className='h-4 w-24 mb-2' />
						<Skeleton className='h-10 w-full' />
					</div>
					<div>
						<Skeleton className='h-4 w-20 mb-2' />
						<Skeleton className='h-24 w-full rounded' />
					</div>
					<div className='flex gap-2'>
						<Skeleton className='h-10 w-32' />
						<Skeleton className='h-10 w-24' />
					</div>
				</div>
			</Card>

			{/* Related Tools Section */}
			<Card className='mt-8'>
				<div className='p-6'>
					<Skeleton className='h-6 w-40 mb-4' />
					<div className='grid gap-3 sm:grid-cols-3'>
						{[1, 2, 3].map(i => (
							<div
								key={i}
								className='flex items-center gap-3 rounded-lg border p-3'
							>
								<Skeleton className='w-10 h-10 rounded-lg flex-shrink-0' />
								<Skeleton className='h-4 flex-1' />
								<Skeleton className='h-4 w-4' />
							</div>
						))}
					</div>
				</div>
			</Card>

			{/* FAQ Section */}
			<Card className='mt-8'>
				<div className='p-6'>
					<Skeleton className='h-6 w-48 mb-6' />
					<div className='space-y-4'>
						{[1, 2, 3, 4, 5].map(i => (
							<div key={i} className='border rounded-lg p-4'>
								<div className='flex items-center justify-between'>
									<Skeleton className='h-5 flex-1 mr-4' />
									<Skeleton className='h-5 w-5' />
								</div>
							</div>
						))}
					</div>
				</div>
			</Card>

			{/* Info Section */}
			<Card className='p-6 bg-muted/50'>
				<Skeleton className='h-6 w-36 mb-3' />
				<div className='grid md:grid-cols-2 gap-4'>
					<div>
						<Skeleton className='h-5 w-28 mb-2' />
						<Skeleton className='h-4 w-full' />
						<Skeleton className='h-4 w-4/5 mt-1' />
					</div>
					<div>
						<Skeleton className='h-5 w-32 mb-2' />
						<Skeleton className='h-4 w-full' />
						<Skeleton className='h-4 w-3/4 mt-1' />
					</div>
				</div>
			</Card>
		</div>
	)
}

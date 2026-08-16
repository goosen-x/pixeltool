import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { toolBar, toolFooterBar } from '@/lib/ui/tool-pill'

/**
 * Next.js route-level fallback для `(widget)` во время серверной навигации.
 *
 * Подставляется только вместо `{children}` в `ProjectsLayoutWrapper` — шапка
 * тула, breadcrumbs, сайдбар и подвал уже отрисованы им самим и здесь не
 * дублируются. Форма повторяет единую карточку тула, см. WidgetSkeleton.
 */
export default function ToolLoading() {
	return (
		<Card className='overflow-hidden p-0'>
			<div className={toolBar}>
				<div className='flex flex-wrap items-center gap-1.5'>
					<Skeleton className='h-7 w-16 rounded-full' />
					<Skeleton className='h-7 w-16 rounded-full' />
					<Skeleton className='h-7 w-16 rounded-full' />
				</div>
				<div className='flex items-center gap-0.5 sm:ml-auto'>
					<Skeleton className='h-8 w-8' />
					<Skeleton className='h-8 w-8' />
				</div>
			</div>

			<div className='grid md:grid-cols-2'>
				<div className='space-y-3 px-5 py-6 sm:px-6 md:border-r'>
					<Skeleton className='h-4 w-24' />
					<Skeleton className='h-24 w-full' />
				</div>
				<div className='space-y-3 px-5 py-6 sm:px-6'>
					<Skeleton className='h-4 w-24' />
					<Skeleton className='h-24 w-full' />
				</div>
			</div>

			<div className={toolFooterBar}>
				<Skeleton className='h-7 w-28 rounded-full' />
				<Skeleton className='ml-auto h-4 w-20' />
			</div>
		</Card>
	)
}

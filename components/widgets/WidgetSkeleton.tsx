import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { toolBar, toolFooterBar } from '@/lib/ui/tool-pill'

/**
 * Плейсхолдер на время переключения между инструментами (см. WidgetWrapper).
 *
 * Повторяет реальную разметку страницы тула — единую для всех 48 инструментов
 * (см. `_template`, `lib/ui/tool-pill.ts`): одна карточка с полосой сверху
 * (режимы/пресеты), рабочей областью и полосой снизу (параметры), а под ней —
 * «Похожие инструменты» и FAQ вне карточки. Раньше здесь была вкладочная
 * раскладка из двух карточек, оставшаяся от дизайна до 05.08.2026, и она не
 * совпадала с тем, что показывается после загрузки — переключение между
 * тулами дёргало вёрстку.
 */
export function WidgetSkeleton() {
	return (
		<div className='space-y-16 skeleton-fade-in'>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: режимы/пресеты слева, иконки-действия справа. */}
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

				{/* Рабочая область: ввод слева, результат справа. */}
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

				{/* Нижняя полоса: параметры, влияющие на результат. */}
				<div className={toolFooterBar}>
					<Skeleton className='h-7 w-28 rounded-full' />
					<Skeleton className='ml-auto h-4 w-20' />
				</div>
			</Card>

			{/* Похожие инструменты — секция вне карточки, как RelatedTools. */}
			<div>
				<Skeleton className='h-8 w-56' />
				<Skeleton className='mt-2 h-4 w-72' />
				<div className='mt-3 grid gap-4 px-4 sm:grid-cols-2 sm:px-12'>
					<Skeleton className='h-44 w-full rounded-3xl' />
					<Skeleton className='hidden h-44 w-full rounded-3xl sm:block' />
				</div>
			</div>

			{/* FAQ — секция вне карточки, как WidgetFAQ/FaqAccordion. */}
			<div>
				<Skeleton className='h-8 w-64' />
				<div className='mt-6 space-y-3'>
					{[1, 2, 3, 4, 5].map(i => (
						<div
							key={i}
							className='flex items-center gap-4 rounded-2xl border px-5 py-4'
						>
							<Skeleton className='h-5 flex-1' />
							<Skeleton className='ml-auto h-8 w-8 shrink-0 rounded-xl' />
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

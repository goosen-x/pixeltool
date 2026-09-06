import Link from 'next/link'
import type { Metadata } from 'next'
import { NOINDEX, VARIANTS } from '@/components/dev/GestureLabPage'

export const metadata: Metadata = {
	title: 'Стенд пипетки — три жеста',
	robots: NOINDEX
}

export default function Page() {
	return (
		<main className='mx-auto max-w-2xl px-4 pt-10 pb-24'>
			<span className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>
				внутренняя страница · photo-color-picker
			</span>

			<h1 className='mt-3 text-3xl font-bold tracking-tight'>
				Три жеста пипетки
			</h1>

			<p className='mt-4 text-muted-foreground'>
				Один и тот же экран, три способа развести выбор цвета и прокрутку
				страницы. Откройте с телефона, поводите пальцем по фото в каждом
				варианте и посмотрите на строку «страница за жест» — она считает, уехала
				ли страница, пока вы целились.
			</p>

			<div className='mt-8 flex flex-col gap-3'>
				{VARIANTS.map(variant => (
					<Link
						key={variant.slug}
						href={`/dev/pipetka/${variant.slug}`}
						rel='nofollow'
						className='flex flex-col gap-2 rounded-xl border px-5 py-4 transition-colors hover:border-primary/50'
					>
						<span className='text-lg font-semibold'>
							<span className='font-mono text-sm text-muted-foreground'>
								{variant.letter}.
							</span>{' '}
							{variant.title}
						</span>
						<span className='flex flex-col gap-1'>
							{variant.rules.map(([gesture, result]) => (
								<span
									key={gesture}
									className='flex items-baseline gap-2 text-sm'
								>
									<span className='shrink-0 font-mono text-xs text-primary'>
										{gesture}
									</span>
									<span className='text-muted-foreground'>{result}</span>
								</span>
							))}
						</span>
					</Link>
				))}
			</div>

			<p className='mt-8 text-sm text-muted-foreground'>
				Общее у всех трёх: слушатели касаний повешены нативно, через
				addEventListener с passive: false. Через React-пропы это не работает —
				React вешает touchstart, touchmove и wheel на корень документа пассивно,
				а в пассивном слушателе preventDefault() не делает ничего. Ровно поэтому
				в проде лупа и прокрутка едут одновременно.
			</p>
		</main>
	)
}

import { Check, Sparkles, TriangleAlert, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BaselineFeature } from '@/lib/data/baseline-features'

const STATUS = {
	widely: {
		icon: Check,
		label: 'Baseline',
		tone: 'text-green-700 dark:text-green-400',
		badge:
			'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300',
		summary: (f: BaselineFeature) =>
			f.since
				? `Работает во всех браузерах с ${f.since} — можно без оглядки`
				: 'Работает во всех браузерах — можно без оглядки'
	},
	newly: {
		icon: Sparkles,
		label: 'Baseline · недавно',
		tone: 'text-blue-700 dark:text-blue-400',
		badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300',
		summary: (f: BaselineFeature) =>
			f.since
				? `Есть во всех движках с ${f.since} — но у части людей браузер ещё старее`
				: 'Есть во всех движках, но недавно'
	},
	limited: {
		icon: TriangleAlert,
		label: 'Ограниченная поддержка',
		tone: 'text-amber-700 dark:text-amber-400',
		badge:
			'bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-300',
		summary: () =>
			'Поддерживают не все движки — только как улучшение, с фолбэком'
	}
} as const

interface Props extends BaselineFeature {
	feature: string
}

/**
 * Плашка поддержки браузерами. Нужна потому, что статьи годами накапливают
 * устаревшие сведения о поддержке: советуют полифилы к фичам, которые давно
 * Baseline, или называют «будущим» то, что работает третий год.
 */
export function BaselineSupport(props: Props) {
	const status = STATUS[props.status]
	const Icon = status.icon

	return (
		<div className='my-6 rounded-xl border bg-card p-4'>
			<div className='flex flex-wrap items-center gap-x-3 gap-y-2'>
				<span className='font-mono text-sm font-semibold'>{props.title}</span>

				<span
					className={cn(
						'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
						status.badge
					)}
				>
					<Icon className='h-3 w-3' />
					{status.label}
				</span>
			</div>

			<p className={cn('mt-2 text-sm', status.tone)}>{status.summary(props)}</p>

			{props.browsers && (
				<p className='mt-1 font-mono text-xs text-muted-foreground'>
					{props.browsers}
				</p>
			)}

			{props.note && (
				<p className='mt-2 text-sm text-muted-foreground'>{props.note}</p>
			)}

			{props.mdn && (
				<a
					href={props.mdn}
					target='_blank'
					rel='noopener noreferrer'
					className='mt-3 inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-primary hover:underline'
				>
					Документация MDN
					<ExternalLink className='h-3 w-3' />
				</a>
			)}
		</div>
	)
}

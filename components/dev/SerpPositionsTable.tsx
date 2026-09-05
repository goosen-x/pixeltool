'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { toolPill } from '@/lib/ui/tool-pill'

export interface SerpRow {
	/** Дословный текст запроса, которым мерили позицию. */
	name: string
	slug: string
	category: string
	/** Позиция в Яндексе 1–30; пусто — проверено и не найдено в топ-30. */
	yandex: string
	/** То же для Google; пусто у всех, пока нет оплаченного Custom Search API. */
	google: string
	competitor: string
	top3: string
	/**
	 * 'title' — фраза взята из заголовка страницы тула, реальный запрос может
	 * отличаться. 'wordstat' — фраза подтверждена Вордстатом при принятии
	 * решения делать тул (см. docs/seo/candidates.tsv, статус built:), это
	 * надёжнее.
	 */
	source: 'title' | 'wordstat'
}

/** Ссылка на живую выдачу Яндекса по той же фразе — для ручной проверки. */
function yandexSearchUrl(phrase: string): string {
	return `https://yandex.ru/search/?text=${encodeURIComponent(phrase)}`
}

type SortKey = 'name' | 'category' | 'yandex'
type SortDir = 'asc' | 'desc'

type Tier = 'top1' | 'top3' | 'top10' | 'top30' | 'none'

function tierOf(yandex: string): Tier {
	if (!yandex) return 'none'
	const n = Number(yandex)
	if (n === 1) return 'top1'
	if (n <= 3) return 'top3'
	if (n <= 10) return 'top10'
	return 'top30'
}

const TIER_LABELS: Record<Tier, string> = {
	top1: 'Позиция 1',
	top3: 'Топ-3',
	top10: 'Топ-10',
	top30: 'Топ-30',
	none: 'Вне топ-30'
}

const TIER_STYLES: Record<Tier, string> = {
	top1: 'bg-green-500/10 text-green-700 dark:text-green-400',
	top3: 'bg-green-500/10 text-green-700 dark:text-green-400',
	top10: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
	top30: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
	none: 'bg-muted text-muted-foreground'
}

function YandexCell({ value }: { value: string }) {
	if (!value)
		return <span className='text-muted-foreground/50'>вне топ-30</span>
	return <span>{value}</span>
}

export function SerpPositionsTable({ rows }: { rows: SerpRow[] }) {
	const [search, setSearch] = useState('')
	const [category, setCategory] = useState<string | null>(null)
	const [tier, setTier] = useState<Tier | null>(null)
	const [onlyWordstat, setOnlyWordstat] = useState(false)
	const [sortKey, setSortKey] = useState<SortKey>('yandex')
	const [sortDir, setSortDir] = useState<SortDir>('asc')

	const categories = useMemo(
		() => [...new Set(rows.map(r => r.category))].filter(Boolean).sort(),
		[rows]
	)

	const tierCounts = useMemo(() => {
		const counts: Record<Tier, number> = {
			top1: 0,
			top3: 0,
			top10: 0,
			top30: 0,
			none: 0
		}
		for (const r of rows) counts[tierOf(r.yandex)]++
		return counts
	}, [rows])

	const maxTierCount = Math.max(...Object.values(tierCounts))

	const filtered = useMemo(() => {
		const query = search.trim().toLowerCase()
		return rows.filter(r => {
			if (category && r.category !== category) return false
			if (tier && tierOf(r.yandex) !== tier) return false
			if (onlyWordstat && r.source !== 'wordstat') return false
			if (query && !r.name.toLowerCase().includes(query)) return false
			return true
		})
	}, [rows, search, category, tier, onlyWordstat])

	const sorted = useMemo(() => {
		const copy = [...filtered]
		copy.sort((a, b) => {
			let result = 0
			if (sortKey === 'yandex') {
				const av = a.yandex ? Number(a.yandex) : 999
				const bv = b.yandex ? Number(b.yandex) : 999
				result = av - bv
			} else {
				result = a[sortKey].localeCompare(b[sortKey], 'ru')
			}
			return sortDir === 'asc' ? result : -result
		})
		return copy
	}, [filtered, sortKey, sortDir])

	const toggleSort = (key: SortKey) => {
		if (key === sortKey) {
			setSortDir(dir => (dir === 'asc' ? 'desc' : 'asc'))
		} else {
			setSortKey(key)
			setSortDir('asc')
		}
	}

	const sortIndicator = (key: SortKey) =>
		sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''

	return (
		<div className='mt-6'>
			{/* Распределение по тирам */}
			<div className='rounded-lg border p-4'>
				<div className='flex flex-col gap-2'>
					{(['top1', 'top3', 'top10', 'top30', 'none'] as Tier[]).map(t => (
						<button
							key={t}
							type='button'
							onClick={() => setTier(current => (current === t ? null : t))}
							className={cn(
								'group grid grid-cols-[100px_1fr_40px] items-center gap-3 rounded-md px-1 py-1 text-left',
								tier === t && 'ring-1 ring-primary/40'
							)}
						>
							<span className='text-sm text-muted-foreground'>
								{TIER_LABELS[t]}
							</span>
							<span className='h-5 overflow-hidden rounded bg-muted/40'>
								<span
									className={cn(
										'block h-full rounded',
										TIER_STYLES[t].split(' ')[0]
									)}
									style={{
										width: `${(tierCounts[t] / maxTierCount) * 100}%`
									}}
								/>
							</span>
							<span className='font-mono text-sm tabular-nums'>
								{tierCounts[t]}
							</span>
						</button>
					))}
				</div>
			</div>

			<div className='mt-4 flex flex-wrap items-center gap-3'>
				<Input
					placeholder='Поиск по названию'
					value={search}
					onChange={event => setSearch(event.target.value)}
					className='max-w-xs'
				/>
				<span className='text-sm text-muted-foreground'>
					{sorted.length} из {rows.length}
				</span>
			</div>

			<div className='mt-3 flex flex-wrap items-center gap-1.5'>
				<button
					type='button'
					onClick={() => setCategory(null)}
					className={toolPill(category === null)}
				>
					Все категории
				</button>
				{categories.map(value => (
					<button
						key={value}
						type='button'
						onClick={() =>
							setCategory(current => (current === value ? null : value))
						}
						className={toolPill(category === value)}
					>
						{value}
					</button>
				))}
			</div>

			<div className='mt-2 flex flex-wrap items-center gap-1.5'>
				<button
					type='button'
					onClick={() => setOnlyWordstat(v => !v)}
					className={toolPill(onlyWordstat)}
					title='Показать только фразы, подтверждённые Вордстатом при принятии решения делать тул — не заголовок страницы'
				>
					Только реальные фразы (Вордстат)
				</button>
			</div>

			<p className='mt-3 text-xs text-muted-foreground'>
				Метка <strong>Вордстат</strong> в колонке «Источник» — фраза
				подтверждена спросом ещё до постройки тула (docs/seo/candidates.tsv).
				Метка <strong>title</strong> — заголовок страницы, реальный запрос может
				отличаться, число менее надёжно. Глубина проверки — 3 страницы выдачи
				(топ-30), регион и язык — ru. Значок ↗ открывает ту же фразу в Яндексе
				напрямую, для ручной перепроверки.
			</p>

			<div className='mt-2 overflow-x-auto rounded-lg border'>
				<table className='w-full min-w-[860px] text-left text-sm'>
					<thead className='bg-muted/40'>
						<tr>
							<th
								className='cursor-pointer select-none px-3 py-2 font-medium'
								onClick={() => toggleSort('name')}
							>
								Инструмент / запрос{sortIndicator('name')}
							</th>
							<th
								className='cursor-pointer select-none px-3 py-2 font-medium'
								onClick={() => toggleSort('category')}
							>
								Категория{sortIndicator('category')}
							</th>
							<th
								className='cursor-pointer select-none px-3 py-2 font-medium'
								onClick={() => toggleSort('yandex')}
							>
								Яндекс{sortIndicator('yandex')}
							</th>
							<th className='px-3 py-2 font-medium'>Источник</th>
							<th className='px-3 py-2 font-medium'>Лидер выдачи</th>
							<th className='px-3 py-2 font-medium'>Топ-3</th>
						</tr>
					</thead>
					<tbody>
						{sorted.map(r => (
							<tr
								key={`${r.slug}-${r.name}`}
								className='border-t align-top odd:bg-muted/20'
							>
								<td className='px-3 py-2 font-medium'>
									<Link
										href={`/tools/${r.slug}`}
										className='cursor-pointer underline-offset-2 hover:underline'
									>
										{r.name}
									</Link>
									<a
										href={yandexSearchUrl(r.name)}
										target='_blank'
										rel='noopener noreferrer'
										title={`Открыть запрос «${r.name}» в Яндексе`}
										className='ml-1.5 cursor-pointer text-muted-foreground hover:text-primary'
									>
										↗
									</a>
								</td>
								<td className='px-3 py-2 text-muted-foreground'>
									{r.category}
								</td>
								<td className='px-3 py-2 font-mono tabular-nums'>
									<YandexCell value={r.yandex} />
								</td>
								<td className='px-3 py-2'>
									<span
										className={cn(
											'inline-block rounded-full px-2 py-0.5 text-xs',
											r.source === 'wordstat'
												? 'bg-green-500/10 text-green-700 dark:text-green-400'
												: 'bg-muted text-muted-foreground'
										)}
									>
										{r.source === 'wordstat' ? 'Вордстат' : 'title'}
									</span>
								</td>
								<td className='px-3 py-2 text-muted-foreground'>
									{r.competitor}
								</td>
								<td className='max-w-md px-3 py-2 text-muted-foreground'>
									{r.top3}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

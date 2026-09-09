'use client'

import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface WebmasterStatRow {
	path: string
	periodStart: string
	periodEnd: string
	impressions: number
	clicks: number
	ctr: number
	avgPosition: number | null
	avgClickPosition: number | null
}

type SortKey = 'path' | 'impressions' | 'clicks' | 'ctr' | 'avgPosition'
type SortDir = 'asc' | 'desc'

function SortHeader({
	label,
	sortKey,
	activeKey,
	dir,
	onClick
}: {
	label: string
	sortKey: SortKey
	activeKey: SortKey
	dir: SortDir
	onClick: (key: SortKey) => void
}) {
	const active = sortKey === activeKey
	return (
		<th
			onClick={() => onClick(sortKey)}
			className='cursor-pointer select-none whitespace-nowrap px-3 py-2 text-left text-xs font-medium text-muted-foreground hover:text-foreground'
		>
			{label} {active && (dir === 'asc' ? '↑' : '↓')}
		</th>
	)
}

export function WebmasterStatsTable({ rows }: { rows: WebmasterStatRow[] }) {
	const [search, setSearch] = useState('')
	const [sortKey, setSortKey] = useState<SortKey>('impressions')
	const [sortDir, setSortDir] = useState<SortDir>('desc')

	const filtered = useMemo(() => {
		const query = search.trim().toLowerCase()
		const result = query
			? rows.filter(row => row.path.toLowerCase().includes(query))
			: rows

		const sorted = [...result].sort((a, b) => {
			const dir = sortDir === 'asc' ? 1 : -1
			if (sortKey === 'path') return a.path.localeCompare(b.path) * dir
			if (sortKey === 'avgPosition') {
				return ((a.avgPosition ?? 999) - (b.avgPosition ?? 999)) * dir
			}
			return (a[sortKey] - b[sortKey]) * dir
		})
		return sorted
	}, [rows, search, sortKey, sortDir])

	const toggleSort = (key: SortKey) => {
		if (key === sortKey) {
			setSortDir(dir => (dir === 'asc' ? 'desc' : 'asc'))
		} else {
			setSortKey(key)
			setSortDir('desc')
		}
	}

	return (
		<div className='mt-4'>
			<Input
				placeholder='Фильтр по пути...'
				value={search}
				onChange={e => setSearch(e.target.value)}
				className='mb-3 max-w-sm'
			/>
			<div className='overflow-x-auto rounded-md border'>
				<table className='w-full text-sm'>
					<thead className='border-b bg-muted/50'>
						<tr>
							<SortHeader
								label='URL'
								sortKey='path'
								activeKey={sortKey}
								dir={sortDir}
								onClick={toggleSort}
							/>
							<th className='whitespace-nowrap px-3 py-2 text-left text-xs font-medium text-muted-foreground'>
								Период
							</th>
							<SortHeader
								label='Показы'
								sortKey='impressions'
								activeKey={sortKey}
								dir={sortDir}
								onClick={toggleSort}
							/>
							<SortHeader
								label='Клики'
								sortKey='clicks'
								activeKey={sortKey}
								dir={sortDir}
								onClick={toggleSort}
							/>
							<SortHeader
								label='CTR %'
								sortKey='ctr'
								activeKey={sortKey}
								dir={sortDir}
								onClick={toggleSort}
							/>
							<SortHeader
								label='Ср. позиция'
								sortKey='avgPosition'
								activeKey={sortKey}
								dir={sortDir}
								onClick={toggleSort}
							/>
						</tr>
					</thead>
					<tbody>
						{filtered.map(row => (
							<tr
								key={`${row.path}|${row.periodStart}|${row.periodEnd}`}
								className={cn(
									'border-b last:border-0 hover:bg-muted/30',
									row.impressions >= 800 && row.ctr < 1 && 'bg-amber-500/5'
								)}
							>
								<td className='px-3 py-2 font-mono text-xs'>{row.path}</td>
								<td className='whitespace-nowrap px-3 py-2 text-xs text-muted-foreground'>
									{row.periodStart} — {row.periodEnd}
								</td>
								<td className='px-3 py-2'>
									{row.impressions.toLocaleString('ru-RU')}
								</td>
								<td className='px-3 py-2'>
									{row.clicks.toLocaleString('ru-RU')}
								</td>
								<td className='px-3 py-2'>{row.ctr.toFixed(2)}</td>
								<td className='px-3 py-2'>
									{row.avgPosition === null ? '—' : row.avgPosition.toFixed(2)}
								</td>
							</tr>
						))}
						{filtered.length === 0 && (
							<tr>
								<td
									colSpan={6}
									className='px-3 py-8 text-center text-muted-foreground'
								>
									Нет данных — импортируйте CSV выше.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			<p className='mt-2 text-xs text-muted-foreground'>
				Подсвечены строки с показами ≥800 и CTR &lt;1% — зона удара (много
				показов, мало кликов).
			</p>
		</div>
	)
}

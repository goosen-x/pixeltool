'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { toolPill } from '@/lib/ui/tool-pill'

export interface Candidate {
	name: string
	volume: number
	category: string
	status: string
	source: string
	comment: string
	/** Позиция в Яндексе по головной фразе; пусто — не измеряли, '>30' — вне глубины. */
	yandex: string
	/** То же для Google. Пока пусто у всех: нужен Custom Search API и cx. */
	google: string
	/** Какой фразой мерили — без неё цифра непроверяема. */
	serpPhrase: string
}

type SortKey = 'name' | 'volume' | 'category' | 'status'
type SortDir = 'asc' | 'desc'

const STATUS_STYLES: Record<string, string> = {
	built:
		'border-transparent bg-green-500/10 text-green-700 dark:text-green-400',
	candidate:
		'border-transparent bg-blue-500/10 text-blue-700 dark:text-blue-400',
	rejected: 'border-transparent bg-red-500/10 text-red-700 dark:text-red-400',
	weak: 'border-transparent bg-muted text-muted-foreground',
	unverified:
		'border-transparent bg-amber-500/10 text-amber-700 dark:text-amber-400'
}

const STATUS_LABELS: Record<string, string> = {
	built: 'построен',
	candidate: 'кандидат',
	rejected: 'отклонён',
	weak: 'слабый',
	unverified: 'не проверен'
}

function statusKind(status: string): string {
	return status.startsWith('built:') ? 'built' : status
}

function statusLabel(status: string): string {
	return STATUS_LABELS[statusKind(status)] ?? status
}

/**
 * Позиция в выдаче. Пустая строка значит «не измеряли» и рисуется прочерком:
 * это не то же самое, что «вне топ-30», и путать их нельзя.
 */
function SerpCell({ value, phrase }: { value: string; phrase: string }) {
	if (!value) return <span className='text-muted-foreground/50'>—</span>

	const numeric = Number(value)
	const good = Number.isFinite(numeric) && numeric <= 10
	return (
		<span
			title={phrase ? `Замер по фразе «${phrase}»` : undefined}
			className={cn(
				good && 'text-green-700 dark:text-green-400',
				value.startsWith('>') && 'text-muted-foreground'
			)}
		>
			{value}
		</span>
	)
}

function builtSlug(status: string): string | null {
	return status.startsWith('built:') ? status.slice('built:'.length) : null
}

export function CandidatesTable({ candidates }: { candidates: Candidate[] }) {
	const [search, setSearch] = useState('')
	const [category, setCategory] = useState<string | null>(null)
	const [status, setStatus] = useState<string | null>(null)
	const [sortKey, setSortKey] = useState<SortKey>('volume')
	const [sortDir, setSortDir] = useState<SortDir>('desc')

	const categories = useMemo(
		() => [...new Set(candidates.map(c => c.category))].sort(),
		[candidates]
	)
	const statuses = useMemo(
		() => [...new Set(candidates.map(c => statusKind(c.status)))].sort(),
		[candidates]
	)

	const filtered = useMemo(() => {
		const query = search.trim().toLowerCase()
		return candidates.filter(c => {
			if (category && c.category !== category) return false
			if (status && statusKind(c.status) !== status) return false
			if (
				query &&
				!c.name.toLowerCase().includes(query) &&
				!c.comment.toLowerCase().includes(query)
			)
				return false
			return true
		})
	}, [candidates, search, category, status])

	const sorted = useMemo(() => {
		const copy = [...filtered]
		copy.sort((a, b) => {
			let result = 0
			if (sortKey === 'volume') result = a.volume - b.volume
			else result = a[sortKey].localeCompare(b[sortKey], 'ru')
			return sortDir === 'asc' ? result : -result
		})
		return copy
	}, [filtered, sortKey, sortDir])

	const toggleSort = (key: SortKey) => {
		if (key === sortKey) {
			setSortDir(dir => (dir === 'asc' ? 'desc' : 'asc'))
		} else {
			setSortKey(key)
			setSortDir(key === 'volume' ? 'desc' : 'asc')
		}
	}

	const sortIndicator = (key: SortKey) =>
		sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''

	return (
		<div className='mt-6'>
			<div className='flex flex-wrap items-center gap-3'>
				<Input
					placeholder='Поиск по названию или комментарию'
					value={search}
					onChange={event => setSearch(event.target.value)}
					className='max-w-xs'
				/>
				<span className='text-sm text-muted-foreground'>
					{sorted.length} из {candidates.length}
				</span>
			</div>

			<div className='mt-3 flex flex-wrap items-center gap-1.5'>
				<button
					type='button'
					onClick={() => setStatus(null)}
					className={toolPill(status === null)}
				>
					Все статусы
				</button>
				{statuses.map(value => (
					<button
						key={value}
						type='button'
						onClick={() =>
							setStatus(current => (current === value ? null : value))
						}
						className={toolPill(status === value)}
					>
						{statusLabel(value)}
					</button>
				))}
			</div>

			<div className='mt-2 flex flex-wrap items-center gap-1.5'>
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

			<div className='mt-4 overflow-x-auto rounded-lg border'>
				<table className='w-full min-w-[900px] text-left text-sm'>
					<thead className='bg-muted/40'>
						<tr>
							<th
								className='cursor-pointer select-none px-3 py-2 font-medium'
								onClick={() => toggleSort('name')}
							>
								Название{sortIndicator('name')}
							</th>
							<th
								className='cursor-pointer select-none px-3 py-2 font-medium'
								onClick={() => toggleSort('volume')}
							>
								Спрос/мес{sortIndicator('volume')}
							</th>
							<th
								className='cursor-pointer select-none px-3 py-2 font-medium'
								onClick={() => toggleSort('category')}
							>
								Категория{sortIndicator('category')}
							</th>
							<th
								className='cursor-pointer select-none px-3 py-2 font-medium'
								onClick={() => toggleSort('status')}
							>
								Статус{sortIndicator('status')}
							</th>
							<th
								className='px-3 py-2 font-medium'
								title='Позиция в Яндексе по головной фразе'
							>
								Яндекс
							</th>
							<th
								className='px-3 py-2 font-medium'
								title='Позиция в Google по головной фразе'
							>
								Google
							</th>
							<th className='px-3 py-2 font-medium'>Источник</th>
							<th className='px-3 py-2 font-medium'>Комментарий</th>
						</tr>
					</thead>
					<tbody>
						{sorted.map(c => {
							const slug = builtSlug(c.status)
							return (
								<tr key={c.name} className='border-t align-top odd:bg-muted/20'>
									<td className='px-3 py-2 font-medium'>{c.name}</td>
									<td className='px-3 py-2 font-mono tabular-nums'>
										{c.volume.toLocaleString('ru-RU')}
									</td>
									<td className='px-3 py-2 text-muted-foreground'>
										{c.category}
									</td>
									<td className='px-3 py-2'>
										<Badge
											variant='outline'
											className={cn(STATUS_STYLES[statusKind(c.status)])}
										>
											{statusLabel(c.status)}
										</Badge>
										{slug && (
											<Link
												href={`/tools/${slug}`}
												className='ml-2 cursor-pointer text-xs text-primary underline underline-offset-2'
											>
												{slug}
											</Link>
										)}
									</td>
									<td className='px-3 py-2 font-mono tabular-nums'>
										<SerpCell value={c.yandex} phrase={c.serpPhrase} />
									</td>
									<td className='px-3 py-2 font-mono tabular-nums'>
										<SerpCell value={c.google} phrase={c.serpPhrase} />
									</td>
									<td className='px-3 py-2 text-muted-foreground'>
										{c.source}
									</td>
									<td className='max-w-md px-3 py-2 text-muted-foreground'>
										{c.comment}
									</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>
		</div>
	)
}

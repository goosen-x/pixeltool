'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { ToolSelect } from '@/components/ui/tool-select'
import { toolBar, toolFooterBar } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { ZODIAC_SIGNS, type ZodiacId } from '@/lib/utils/zodiac'
import {
	compatibilityScore,
	getCompatibility
} from '@/lib/utils/zodiac-compatibility'
import { ZodiacCompatibilitySeo } from './ZodiacCompatibilitySeo'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'

/** Цвет клетки матрицы по оценке — от конфликтной к гармоничной. */
function scoreClass(score: number): string {
	if (score >= 5)
		return 'bg-emerald-500/20 text-emerald-900 dark:text-emerald-200'
	if (score === 4) return 'bg-teal-500/15 text-teal-900 dark:text-teal-200'
	if (score === 2) return 'bg-amber-500/15 text-amber-900 dark:text-amber-200'
	if (score <= 1) return 'bg-rose-500/15 text-rose-900 dark:text-rose-200'
	return 'bg-muted'
}

export default function ZodiacCompatibilityPage() {
	const widget = getWidgetById('zodiac-compatibility')!

	const [firstId, setFirstId] = useState<ZodiacId>('oven')
	const [secondId, setSecondId] = useState<ZodiacId>('vesy')

	const first = ZODIAC_SIGNS.find(s => s.id === firstId)!
	const second = ZODIAC_SIGNS.find(s => s.id === secondId)!
	const result = getCompatibility(first, second)

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<label className='flex items-center gap-2 text-sm text-muted-foreground'>
						Первый знак
						<ToolSelect
							value={firstId}
							onChange={event => setFirstId(event.target.value as ZodiacId)}
							aria-label='Первый знак'
						>
							{ZODIAC_SIGNS.map(s => (
								<option key={s.id} value={s.id}>
									{s.symbol} {s.name}
								</option>
							))}
						</ToolSelect>
					</label>
					<label className='flex items-center gap-2 text-sm text-muted-foreground'>
						Второй знак
						<ToolSelect
							value={secondId}
							onChange={event => setSecondId(event.target.value as ZodiacId)}
							aria-label='Второй знак'
						>
							{ZODIAC_SIGNS.map(s => (
								<option key={s.id} value={s.id}>
									{s.symbol} {s.name}
								</option>
							))}
						</ToolSelect>
					</label>
				</div>

				<div className='space-y-4 px-5 py-8 sm:px-6'>
					<div className='flex flex-wrap items-baseline justify-center gap-x-3 text-center'>
						<span className='text-2xl font-bold tracking-tight'>
							{first.symbol} {first.name} и {second.symbol} {second.name}
						</span>
					</div>

					<p className='text-center'>
						<span className='text-lg font-medium'>{result.aspect.name}</span>
						<span className='text-muted-foreground'>
							{' '}
							· {result.aspect.degrees}° · {result.aspect.summary}
						</span>
					</p>

					<p
						className='text-center'
						aria-label={`Оценка ${result.aspect.score} из 5`}
					>
						{'★'.repeat(result.aspect.score)}
						<span className='text-muted-foreground'>
							{'★'.repeat(5 - result.aspect.score)}
						</span>
					</p>

					<p className='mx-auto max-w-2xl text-muted-foreground'>
						{result.aspect.detail}
					</p>

					<ul className='mx-auto max-w-2xl space-y-2'>
						{result.notes.map(note => (
							<li key={note} className='text-sm text-muted-foreground'>
								{note}
							</li>
						))}
					</ul>
				</div>

				{/* Матрица 12×12 — то, ради чего половина людей и приходит:
				    посмотреть всю картину сразу, а не одну пару. */}
				<div className='overflow-x-auto border-t px-3 py-5 sm:px-5'>
					<table className='w-full border-collapse text-center text-xs'>
						<caption className='sr-only'>
							Таблица совместимости всех знаков зодиака
						</caption>
						<thead>
							<tr>
								<th className='p-1' />
								{ZODIAC_SIGNS.map(s => (
									<th
										key={s.id}
										scope='col'
										className='p-1 font-normal text-muted-foreground'
										title={s.name}
									>
										{s.symbol}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{ZODIAC_SIGNS.map(row => (
								<tr key={row.id}>
									<th
										scope='row'
										className='p-1 text-right font-normal whitespace-nowrap text-muted-foreground'
									>
										{row.symbol} {row.name}
									</th>
									{ZODIAC_SIGNS.map(col => {
										const score = compatibilityScore(row, col)
										const active =
											(row.id === firstId && col.id === secondId) ||
											(row.id === secondId && col.id === firstId)
										return (
											<td key={col.id} className='p-0.5'>
												<button
													type='button'
													onClick={() => {
														setFirstId(row.id)
														setSecondId(col.id)
													}}
													title={`${row.name} и ${col.name}: ${getCompatibility(row, col).aspect.name}`}
													className={`h-7 w-7 cursor-pointer rounded ${scoreClass(score)} ${
														active ? 'ring-2 ring-primary' : ''
													}`}
												>
													{score}
												</button>
											</td>
										)
									})}
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						Оценка выводится из угла между знаками в круге, а не написана на
						глаз — поэтому таблица симметрична и объяснима
					</span>
					<Link
						href='/tools/zodiac-sign'
						className='cursor-pointer text-sm font-medium text-primary hover:underline sm:ml-auto'
					>
						Не знаете свой знак?
					</Link>
				</div>
			</Card>

			<ToolScreenshot slug='zodiac-compatibility' />
			<ZodiacCompatibilitySeo />
		</WidgetSEOWrapper>
	)
}

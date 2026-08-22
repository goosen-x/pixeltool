'use client'

import { useMemo, useState } from 'react'
import { Check, Copy, Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { toolBar, toolPill } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import {
	HTTP_STATUS_CODES,
	statusClassOf,
	type HttpStatusClass
} from '@/lib/data/http-status-codes'
import { HttpStatusCodesSeo } from './HttpStatusCodesSeo'

const CLASSES: HttpStatusClass[] = ['1xx', '2xx', '3xx', '4xx', '5xx']

const CLASS_ACCENT: Record<HttpStatusClass, string> = {
	'1xx': 'text-sky-600 dark:text-sky-400',
	'2xx': 'text-green-600 dark:text-green-400',
	'3xx': 'text-amber-600 dark:text-amber-400',
	'4xx': 'text-orange-600 dark:text-orange-400',
	'5xx': 'text-red-600 dark:text-red-400'
}

export default function HttpStatusCodesPage() {
	const widget = getWidgetById('http-status-codes')!

	const [query, setQuery] = useState('')
	const [activeClass, setActiveClass] = useState<HttpStatusClass | null>(null)
	const [copiedCode, setCopiedCode] = useState<number | null>(null)

	const filtered = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase()
		return HTTP_STATUS_CODES.filter(item => {
			if (activeClass && statusClassOf(item.code) !== activeClass) return false
			if (!normalizedQuery) return true
			return (
				String(item.code).includes(normalizedQuery) ||
				item.title.toLowerCase().includes(normalizedQuery) ||
				item.description.toLowerCase().includes(normalizedQuery)
			)
		})
	}, [query, activeClass])

	const copyCode = (code: number) => {
		navigator.clipboard.writeText(String(code))
		setCopiedCode(code)
		setTimeout(() => setCopiedCode(null), 2000)
	}

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						<button
							type='button'
							onClick={() => setActiveClass(null)}
							aria-pressed={activeClass === null}
							className={toolPill(activeClass === null)}
						>
							Все
						</button>
						{CLASSES.map(cls => (
							<button
								key={cls}
								type='button'
								onClick={() => setActiveClass(cls)}
								aria-pressed={activeClass === cls}
								className={toolPill(activeClass === cls)}
							>
								{cls}
							</button>
						))}
					</div>

					<label className='relative ml-auto flex w-full items-center sm:w-64'>
						<Search className='pointer-events-none absolute left-2.5 h-4 w-4 text-muted-foreground' />
						<input
							type='text'
							value={query}
							onChange={event => setQuery(event.target.value)}
							placeholder='Код или слово, например 404'
							aria-label='Поиск по коду или описанию'
							className='w-full rounded-md border bg-background py-1.5 pl-8 pr-3 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						/>
					</label>
				</div>

				<div className='divide-y'>
					{filtered.length === 0 ? (
						<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
							Ничего не найдено
						</p>
					) : (
						filtered.map(item => {
							const cls = statusClassOf(item.code)
							return (
								<div
									key={item.code}
									className='flex items-start gap-4 px-5 py-4 sm:px-6'
								>
									<span
										className={`w-14 shrink-0 font-mono text-2xl font-bold ${CLASS_ACCENT[cls]}`}
									>
										{item.code}
									</span>
									<div className='min-w-0 flex-1'>
										<p className='font-medium text-foreground'>{item.title}</p>
										<p className='mt-0.5 text-sm text-muted-foreground'>
											{item.description}
										</p>
									</div>
									<button
										type='button'
										onClick={() => copyCode(item.code)}
										title='Скопировать код'
										className='shrink-0 cursor-pointer rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground'
									>
										{copiedCode === item.code ? (
											<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
										) : (
											<Copy className='h-4 w-4' />
										)}
									</button>
								</div>
							)
						})
					)}
				</div>
			</Card>

			<HttpStatusCodesSeo />
		</WidgetSEOWrapper>
	)
}

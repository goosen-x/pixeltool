'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Check, Copy } from 'lucide-react'
import { Card } from '@/components/ui/card'
import {
	invisibleCharacterCatalog,
	INVISIBLE_GROUPS,
	type InvisibleGroup
} from '@/lib/data/invisible-characters'

/** Порядок групп: от бытового к экзотике. */
const ORDER: InvisibleGroup[] = [
	'filler',
	'zerowidth',
	'space',
	'bidi',
	'other'
]

/** Предупреждения по группам, где символ ведёт себя не так, как ожидают. */
const GROUP_NOTES: Partial<Record<InvisibleGroup, string>> = {
	space:
		'Занимают ширину и потому чаще всего обрезаются полями, которые чистят пробелы.',
	bidi: 'Меняют направление письма: соседний текст может перемешаться местами.',
	other:
		'Редкие служебные знаки. Именно их фильтры обычно забывают перечислить.'
}

export function InvisibleCharacterCatalog() {
	const [copied, setCopied] = useState<string | null>(null)

	const copy = async (codepoint: string, char: string, name: string) => {
		try {
			await navigator.clipboard.writeText(char)
			setCopied(codepoint)
			setTimeout(() => setCopied(null), 2000)
			toast.success(`Скопировано: ${name} (${codepoint})`)
		} catch {
			toast.error('Не удалось скопировать символ')
		}
	}

	return (
		<div className='mt-6'>
			<h2 className='mb-2 text-sm font-medium text-muted-foreground'>
				Все существующие невидимые символы
			</h2>

			<Card className='overflow-hidden p-0'>
				<div className='divide-y'>
					{ORDER.map(group => {
						const items = invisibleCharacterCatalog.filter(
							entry => entry.group === group
						)
						if (items.length === 0) return null

						return (
							<section key={group} className='px-5 py-4 sm:px-6'>
								<h3 className='text-sm font-medium text-foreground'>
									{INVISIBLE_GROUPS[group]}{' '}
									<span className='font-normal text-muted-foreground'>
										({items.length})
									</span>
								</h3>

								{GROUP_NOTES[group] ? (
									<p className='mt-1 text-xs text-muted-foreground'>
										{GROUP_NOTES[group]}
									</p>
								) : null}

								<div className='mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>
									{items.map(entry => (
										<button
											key={entry.codepoint}
											type='button'
											onClick={() =>
												copy(entry.codepoint, entry.char, entry.name)
											}
											title={`Скопировать ${entry.name}`}
											className='group flex cursor-pointer items-center gap-3 rounded-md border bg-background px-3 py-2 text-left transition-colors hover:border-primary/40 hover:bg-muted/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
										>
											<span className='min-w-0 flex-1'>
												<span className='block truncate text-sm text-foreground'>
													{entry.name}
												</span>
												<span className='block font-mono text-xs text-muted-foreground'>
													{entry.codepoint} · {entry.category}
												</span>
											</span>

											<span className='shrink-0 text-muted-foreground group-hover:text-foreground'>
												{copied === entry.codepoint ? (
													<Check className='h-3.5 w-3.5 text-green-600 dark:text-green-400' />
												) : (
													<Copy className='h-3.5 w-3.5' />
												)}
											</span>
										</button>
									))}
								</div>
							</section>
						)
					})}
				</div>
			</Card>
		</div>
	)
}

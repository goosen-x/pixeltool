'use client'

import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { ToolSelect } from '@/components/ui/tool-select'
import {
	toolBar,
	toolFooterBar,
	toolToggleOption,
	toolToggleTrack
} from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import {
	containerLabel,
	containersFor,
	containersOf,
	describeAmount,
	fallbackContainer,
	getContainer,
	getProduct,
	gramsIn,
	parseAmount,
	PRODUCTS,
	tableFor
} from '@/lib/utils/cooking'
import { pluralizeRu } from '@/lib/utils/pluralize'
import { GramsToCupsSeo } from './GramsToCupsSeo'

type Mode = 'toGrams' | 'toContainers'

const GROUPS = ['Сыпучие', 'Жидкости', 'Молочное', 'Прочее'] as const

function round(value: number): string {
	return value >= 100
		? String(Math.round(value))
		: String(Math.round(value * 10) / 10).replace('.', ',')
}

export default function GramsToCupsPage() {
	const widget = getWidgetById('grams-to-cups')!

	const [mode, setMode] = useState<Mode>('toGrams')
	const [productId, setProductId] = useState('flour')
	const [containerId, setContainerId] = useState('glass-250')
	const [amount, setAmount] = useState('1')
	const [grams, setGrams] = useState('250')

	const product = getProduct(productId)!
	// У жидкостей нет ложки с горкой: если она была выбрана, берём ту же
	// ложку без горки, а не показываем пустую меру.
	const container = fallbackContainer(getContainer(containerId)!, product)
	const containerName = containerLabel(container, product)

	const result = useMemo(() => {
		if (mode === 'toGrams') {
			const count = parseAmount(amount)
			if (count === null) return null
			return {
				kind: 'grams' as const,
				value: gramsIn(product, container) * count
			}
		}
		const weight = parseAmount(grams)
		if (weight === null) return null
		return {
			kind: 'containers' as const,
			value: containersFor(weight, product, container)
		}
	}, [mode, amount, grams, product, container])

	const unitsWord = (value: number) =>
		pluralizeRu(Math.round(value), ['грамм', 'грамма', 'граммов'])

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<div className={toolToggleTrack}>
						{(
							[
								['toGrams', 'Стаканы → граммы'],
								['toContainers', 'Граммы → стаканы']
							] as [Mode, string][]
						).map(([value, label]) => (
							<button
								key={value}
								type='button'
								onClick={() => setMode(value)}
								aria-pressed={mode === value}
								className={toolToggleOption(mode === value)}
							>
								{label}
							</button>
						))}
					</div>

					<label className='flex items-center gap-2 text-sm text-muted-foreground sm:ml-auto'>
						Продукт
						<ToolSelect
							value={productId}
							onChange={event => setProductId(event.target.value)}
							aria-label='Продукт'
						>
							{GROUPS.map(group => {
								const items = PRODUCTS.filter(p => p.group === group)
								if (items.length === 0) return null
								return (
									<optgroup key={group} label={group}>
										{items.map(p => (
											<option key={p.id} value={p.id}>
												{p.name}
											</option>
										))}
									</optgroup>
								)
							})}
						</ToolSelect>
					</label>
				</div>

				<div className='flex flex-col items-center gap-4 px-5 py-8 sm:px-6'>
					<div className='flex flex-wrap items-end justify-center gap-3'>
						<label className='block'>
							<span className='mb-1.5 block text-sm text-muted-foreground'>
								{mode === 'toGrams' ? 'Сколько мер' : 'Граммов'}
							</span>
							<input
								type='text'
								inputMode='decimal'
								value={mode === 'toGrams' ? amount : grams}
								onChange={event =>
									mode === 'toGrams'
										? setAmount(event.target.value)
										: setGrams(event.target.value)
								}
								aria-label={
									mode === 'toGrams' ? 'Количество ёмкостей' : 'Вес в граммах'
								}
								className='w-28 rounded-md border bg-background px-3 py-2 text-center font-mono text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
							/>
						</label>

						<label className='block'>
							<span className='mb-1.5 block text-sm text-muted-foreground'>
								Мера
							</span>
							<ToolSelect
								value={container.id}
								onChange={event => setContainerId(event.target.value)}
								aria-label='Мера'
								className='py-2'
							>
								{containersOf(product).map(c => (
									<option key={c.id} value={c.id}>
										{containerLabel(c, product)}
									</option>
								))}
							</ToolSelect>
						</label>
					</div>

					{result ? (
						<p className='text-center'>
							<span className='block font-mono text-4xl font-bold tracking-tight tabular-nums'>
								{result.kind === 'grams'
									? `${round(result.value)} г`
									: describeAmount(result.value)}
							</span>
							<span className='mt-2 block text-sm text-muted-foreground'>
								{result.kind === 'grams'
									? `${product.name}: ${amount.trim() || '0'} × «${containerName.toLowerCase()}» = ${round(result.value)} ${unitsWord(result.value)}`
									: `${product.name}: ${grams.trim() || '0'} г ≈ ${round(result.value)} × «${containerName.toLowerCase()}», крупно — с точностью до четверти меры`}
							</span>
						</p>
					) : (
						<p className='text-sm text-muted-foreground'>
							Введите число: 1,5 или 1/2
						</p>
					)}
				</div>

				{/* Таблица по всем мерам — ради неё половина спроса: «сколько грамм
				    в стакане» спрашивают чаще, чем пересчитывают конкретный вес. */}
				<div className='border-t px-5 py-5 sm:px-6'>
					<span className='mb-3 block text-sm text-muted-foreground'>
						{product.name} во всех мерах
					</span>
					<div className='overflow-x-auto'>
						<table className='w-full border-collapse text-sm'>
							<tbody>
								{tableFor(product).map(({ container: c, grams: g }) => (
									<tr
										key={c.id}
										onClick={() => setContainerId(c.id)}
										className={`cursor-pointer border-b last:border-0 hover:bg-muted/50 ${c.id === container.id ? 'bg-muted/50 font-medium' : ''}`}
									>
										<th
											scope='row'
											className='py-2 pr-4 text-left font-normal whitespace-nowrap'
										>
											{containerLabel(c, product)}
											{c.hint && (
												<span className='ml-2 text-xs text-muted-foreground'>
													{c.hint}
												</span>
											)}
										</th>
										<td className='py-2 text-right font-mono tabular-nums'>
											{round(g)} г
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						{`Стаканы считаются из насыпной плотности: ${String(product.density).replace('.', ',')} г/мл. `}
						{product.spoons
							? 'Ложки взяты из кухонных таблиц: ложку зачерпывают, и вес зависит от горки. Разброс между источниками до десяти процентов'
							: 'Ложки считаются по объёму: столовая 15 мл, чайная 5 мл'}
					</span>
				</div>
			</Card>

			<GramsToCupsSeo />
		</WidgetSEOWrapper>
	)
}

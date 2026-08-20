'use client'

import { useMemo, useState } from 'react'
import { ArrowLeftRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ToolSelect } from '@/components/ui/tool-select'
import { toolBar, toolIconButton, toolPill } from '@/lib/ui/tool-pill'
import {
	unitCategories,
	getUnitCategory,
	convert,
	type UnitCategoryId
} from '@/lib/constants/units'

interface UnitConverterWidgetProps {
	initialCategory?: UnitCategoryId
	initialFrom?: string
	initialTo?: string
}

function toNumber(value: string): number | null {
	const parsed = parseFloat(value.replace(',', '.'))
	return Number.isFinite(parsed) ? parsed : null
}

function formatNumber(value: number): string {
	return value.toLocaleString('ru-RU', { maximumFractionDigits: 6 })
}

export function UnitConverterWidget({
	initialCategory = 'length',
	initialFrom,
	initialTo
}: UnitConverterWidgetProps) {
	const [categoryId, setCategoryId] = useState<UnitCategoryId>(initialCategory)
	const category = getUnitCategory(categoryId)

	const [fromId, setFromId] = useState(initialFrom || category.units[0].id)
	const [toId, setToId] = useState(initialTo || category.units[1].id)
	const [fromValue, setFromValue] = useState('1')

	// Единицы предыдущей категории не подходят новой — сбрасываем на первые
	// две прямо в обработчике клика, не через эффект (иначе он срезал бы
	// initialFrom/initialTo при первом рендере).
	const selectCategory = (id: UnitCategoryId) => {
		setCategoryId(id)
		const units = getUnitCategory(id).units
		setFromId(units[0].id)
		setToId(units[1].id)
	}

	const toValue = useMemo(() => {
		const num = toNumber(fromValue)
		if (num === null) return null
		return convert(categoryId, fromId, toId, num)
	}, [categoryId, fromId, toId, fromValue])

	const swap = () => {
		setFromId(toId)
		setToId(fromId)
		if (toValue !== null) setFromValue(String(toValue))
	}

	return (
		<Card className='overflow-hidden p-0'>
			<div className={toolBar}>
				<div className='flex flex-wrap items-center gap-1.5'>
					{unitCategories.map(c => (
						<button
							key={c.id}
							type='button'
							onClick={() => selectCategory(c.id)}
							aria-pressed={categoryId === c.id}
							className={toolPill(categoryId === c.id)}
						>
							{c.nameRu}
						</button>
					))}
				</div>
			</div>

			<div className='grid items-end gap-4 px-5 py-8 sm:grid-cols-[1fr_auto_1fr] sm:px-6'>
				<label className='block'>
					<span className='mb-1.5 block text-sm text-muted-foreground'>Из</span>
					<div className='flex gap-2'>
						<input
							type='text'
							inputMode='decimal'
							value={fromValue}
							onChange={event => setFromValue(event.target.value)}
							aria-label='Исходное значение'
							className='w-full rounded-md border bg-background px-3 py-2 font-mono text-lg text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						/>
						<ToolSelect
							value={fromId}
							onChange={event => setFromId(event.target.value)}
							aria-label='Исходная единица'
						>
							{category.units.map(u => (
								<option key={u.id} value={u.id}>
									{u.symbol}
								</option>
							))}
						</ToolSelect>
					</div>
				</label>

				<Button
					size='icon'
					variant='ghost'
					onClick={swap}
					title='Поменять местами'
					className={toolIconButton}
				>
					<ArrowLeftRight className='h-4 w-4' />
				</Button>

				<label className='block'>
					<span className='mb-1.5 block text-sm text-muted-foreground'>В</span>
					<div className='flex gap-2'>
						<input
							type='text'
							readOnly
							value={toValue === null ? '' : formatNumber(toValue)}
							aria-label='Результат'
							className='w-full rounded-md border bg-muted/30 px-3 py-2 font-mono text-lg text-foreground focus:outline-none'
						/>
						<ToolSelect
							value={toId}
							onChange={event => setToId(event.target.value)}
							aria-label='Единица результата'
						>
							{category.units.map(u => (
								<option key={u.id} value={u.id}>
									{u.symbol}
								</option>
							))}
						</ToolSelect>
					</div>
				</label>
			</div>
		</Card>
	)
}

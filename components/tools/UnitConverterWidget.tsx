'use client'

import { useMemo, useState } from 'react'
import { ArrowLeftRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ToolSelect } from '@/components/ui/tool-select'
import { toolBar, toolIconButton, toolPill } from '@/lib/ui/tool-pill'
import {
	formatUnitResult,
	parseUnitInput,
	toInputString
} from '@/lib/utils/unit-input'
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
	initialValue?: string
}

export function UnitConverterWidget({
	initialCategory = 'length',
	initialFrom,
	initialTo,
	initialValue
}: UnitConverterWidgetProps) {
	const [categoryId, setCategoryId] = useState<UnitCategoryId>(initialCategory)
	const category = getUnitCategory(categoryId)

	const [fromId, setFromId] = useState(initialFrom || category.units[0].id)
	const [toId, setToId] = useState(initialTo || category.units[1].id)
	const [fromValue, setFromValue] = useState(initialValue || '1')

	// Единицы предыдущей категории не подходят новой — сбрасываем на первые
	// две прямо в обработчике клика, не через эффект (иначе он срезал бы
	// initialFrom/initialTo при первом рендере).
	const selectCategory = (id: UnitCategoryId) => {
		setCategoryId(id)
		const units = getUnitCategory(id).units
		setFromId(units[0].id)
		setToId(units[1].id)
	}

	const fromNumber = parseUnitInput(fromValue)
	const isEmpty = fromValue.trim() === ''
	const isInvalid = !isEmpty && fromNumber === null

	const toValue = useMemo(() => {
		if (fromNumber === null) return null
		return convert(categoryId, fromId, toId, fromNumber)
	}, [categoryId, fromId, toId, fromNumber])

	const fromUnit = category.units.find(u => u.id === fromId)
	const toUnit = category.units.find(u => u.id === toId)
	// Коэффициент «1 исходная = N целевых» — по нему видно, что считается,
	// и его можно перепроверить. Для температуры коэффициента нет: шкалы
	// сдвинуты друг относительно друга, а не растянуты.
	const rate =
		categoryId === 'temperature' || fromId === toId
			? null
			: convert(categoryId, fromId, toId, 1)

	const swap = () => {
		setFromId(toId)
		setToId(fromId)
		if (toValue !== null) setFromValue(toInputString(toValue))
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
							aria-invalid={isInvalid}
							placeholder='Например, 12,5'
							className='w-full min-w-0 rounded-md border bg-background px-3 py-2 font-mono text-lg text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						/>
						<ToolSelect
							value={fromId}
							onChange={event => setFromId(event.target.value)}
							aria-label='Исходная единица'
							className='w-32 shrink-0 sm:w-40'
						>
							{category.units.map(u => (
								<option key={u.id} value={u.id}>
									{u.symbol === u.nameRu ? u.symbol : `${u.symbol} · ${u.nameRu}`}
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
							value={toValue === null ? '' : formatUnitResult(toValue)}
							aria-label='Результат'
							className='w-full min-w-0 rounded-md border bg-muted/30 px-3 py-2 font-mono text-lg text-foreground focus:outline-none'
						/>
						<ToolSelect
							value={toId}
							onChange={event => setToId(event.target.value)}
							aria-label='Единица результата'
							className='w-32 shrink-0 sm:w-40'
						>
							{category.units.map(u => (
								<option key={u.id} value={u.id}>
									{u.symbol === u.nameRu ? u.symbol : `${u.symbol} · ${u.nameRu}`}
								</option>
							))}
						</ToolSelect>
					</div>
				</label>
			</div>

			<div
				className='border-t px-5 py-3 text-sm sm:px-6'
				aria-live='polite'
			>
				{isInvalid ? (
					<p className='text-destructive'>
						Не похоже на число. Введите цифры, дробную часть можно через
						запятую или точку: 12,5 или 1 500.
					</p>
				) : isEmpty ? (
					<p className='text-muted-foreground'>
						Введите число в поле «Из», результат появится справа.
					</p>
				) : (
					<p className='text-muted-foreground'>
						{fromNumber !== null && toValue !== null && fromUnit && toUnit && (
							<span className='font-mono text-foreground'>
								{formatUnitResult(fromNumber)} {fromUnit.symbol} ={' '}
								{formatUnitResult(toValue)} {toUnit.symbol}
							</span>
						)}
						{rate !== null && fromNumber !== 1 && fromUnit && toUnit && (
							<span className='block font-mono text-xs sm:ml-3 sm:inline'>
								1 {fromUnit.symbol} = {formatUnitResult(rate)} {toUnit.symbol}
							</span>
						)}
					</p>
				)}
			</div>
		</Card>
	)
}

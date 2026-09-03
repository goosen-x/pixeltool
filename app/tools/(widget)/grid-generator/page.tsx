'use client'

import { useState, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { GridGuide } from './GridGuide'
import { Slider } from '@/components/ui/slider'
import { ToolSelect } from '@/components/ui/tool-select'
import { Button } from '@/components/ui/button'
import { Copy, RotateCcw, Plus, Minus, Check } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'
interface GridProps {
	columns: string
	rows: string
	gap: number
	rowGap: number
	columnGap: number
	justifyItems: string
	alignItems: string
	justifyContent: string
	alignContent: string
	autoFlow: string
}

const defaultProps: GridProps = {
	columns: '1fr 1fr 1fr',
	rows: '1fr 1fr',
	gap: 16,
	rowGap: 16,
	columnGap: 16,
	justifyItems: 'stretch',
	alignItems: 'stretch',
	justifyContent: 'start',
	alignContent: 'start',
	autoFlow: 'row'
}

export default function GridGeneratorPage() {
	const locale = 'ru'
	const widget = getWidgetById('grid-generator')!
	const [props, setProps] = useState<GridProps>(defaultProps)
	const [itemCount, setItemCount] = useState(6)
	const [showItemNumbers, setShowItemNumbers] = useState(true)
	const [useUniformGap, setUseUniformGap] = useState(true)
	const [copiedTailwind, setCopiedTailwind] = useState(false)
	const [copiedCSS, setCopiedCSS] = useState(false)

	const updateProp = useCallback(
		(key: keyof GridProps, value: string | number) => {
			if (key === 'gap' && useUniformGap) {
				setProps(prev => ({
					...prev,
					gap: value as number,
					rowGap: value as number,
					columnGap: value as number
				}))
			} else {
				setProps(prev => ({ ...prev, [key]: value }))
			}
		},
		[useUniformGap]
	)

	const generateCSS = () => {
		const css = `.container {
  display: grid;
  grid-template-columns: ${props.columns};
  grid-template-rows: ${props.rows};${
		useUniformGap
			? `\n  gap: ${props.gap}px;`
			: `\n  row-gap: ${props.rowGap}px;\n  column-gap: ${props.columnGap}px;`
	}
  justify-items: ${props.justifyItems};
  align-items: ${props.alignItems};
  justify-content: ${props.justifyContent};
  align-content: ${props.alignContent};
  grid-auto-flow: ${props.autoFlow};
}`
		return css
	}

	const generateTailwind = () => {
		// Map CSS grid values to Tailwind classes
		const justifyItemsMap: Record<string, string> = {
			start: 'justify-items-start',
			end: 'justify-items-end',
			center: 'justify-items-center',
			stretch: 'justify-items-stretch'
		}

		const alignItemsMap: Record<string, string> = {
			start: 'items-start',
			end: 'items-end',
			center: 'items-center',
			stretch: 'items-stretch'
		}

		const justifyContentMap: Record<string, string> = {
			start: 'justify-start',
			end: 'justify-end',
			center: 'justify-center',
			stretch: 'justify-stretch',
			'space-between': 'justify-between',
			'space-around': 'justify-around',
			'space-evenly': 'justify-evenly'
		}

		const alignContentMap: Record<string, string> = {
			start: 'content-start',
			end: 'content-end',
			center: 'content-center',
			stretch: 'content-stretch',
			'space-between': 'content-between',
			'space-around': 'content-around',
			'space-evenly': 'content-evenly'
		}

		const autoFlowMap: Record<string, string> = {
			row: 'grid-flow-row',
			column: 'grid-flow-col',
			dense: 'grid-flow-dense',
			'row dense': 'grid-flow-row-dense',
			'column dense': 'grid-flow-col-dense'
		}

		// Generate grid template classes
		const columnsClass = `grid-cols-[${props.columns}]`
		const rowsClass = `grid-rows-[${props.rows}]`

		// Generate gap classes
		let gapClasses = ''
		if (useUniformGap) {
			const gapValue = props.gap
			gapClasses =
				gapValue % 4 === 0 && gapValue <= 96
					? `gap-${gapValue / 4}`
					: `gap-[${gapValue}px]`
		} else {
			const rowGapValue = props.rowGap
			const colGapValue = props.columnGap
			const rowGapClass =
				rowGapValue % 4 === 0 && rowGapValue <= 96
					? `gap-y-${rowGapValue / 4}`
					: `gap-y-[${rowGapValue}px]`
			const colGapClass =
				colGapValue % 4 === 0 && colGapValue <= 96
					? `gap-x-${colGapValue / 4}`
					: `gap-x-[${colGapValue}px]`
			gapClasses = `${rowGapClass} ${colGapClass}`
		}

		// Combine all classes
		const classes = [
			'grid',
			columnsClass,
			rowsClass,
			gapClasses,
			justifyItemsMap[props.justifyItems],
			alignItemsMap[props.alignItems],
			justifyContentMap[props.justifyContent],
			alignContentMap[props.alignContent],
			autoFlowMap[props.autoFlow]
		]
			.filter(Boolean)
			.join(' ')

		return classes
	}

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(generateCSS())
			setCopiedCSS(true)
			setTimeout(() => setCopiedCSS(false), 2000)
			toast.success('CSS код скопирован в буфер обмена')
		} catch (err) {
			toast.error('Ошибка копирования')
		}
	}

	const copyTailwindToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(generateTailwind())
			setCopiedTailwind(true)
			setTimeout(() => setCopiedTailwind(false), 2000)
			toast.success('Tailwind классы скопированы в буфер обмена')
		} catch (err) {
			toast.error('Ошибка копирования')
		}
	}

	const resetProps = useCallback(() => {
		setProps(defaultProps)
		setUseUniformGap(true)
		setItemCount(6)
		setShowItemNumbers(true)
		toast.success('Настройки сброшены')
	}, [locale])

	const addColumn = useCallback(() => {
		const columns = props.columns.split(' ')
		columns.push('1fr')
		updateProp('columns', columns.join(' '))
	}, [props.columns, updateProp])

	const removeColumn = useCallback(() => {
		const columns = props.columns.split(' ')
		if (columns.length > 1) {
			columns.pop()
			updateProp('columns', columns.join(' '))
		}
	}, [props.columns, updateProp])

	const addRow = useCallback(() => {
		const rows = props.rows.split(' ')
		rows.push('1fr')
		updateProp('rows', rows.join(' '))
	}, [props.rows, updateProp])

	const removeRow = useCallback(() => {
		const rows = props.rows.split(' ')
		if (rows.length > 1) {
			rows.pop()
			updateProp('rows', rows.join(' '))
		}
	}, [props.rows, updateProp])

	const containerStyle: React.CSSProperties = {
		display: 'grid',
		gridTemplateColumns: props.columns,
		gridTemplateRows: props.rows,
		...(useUniformGap
			? { gap: `${props.gap}px` }
			: { rowGap: `${props.rowGap}px`, columnGap: `${props.columnGap}px` }),
		justifyItems: props.justifyItems as any,
		alignItems: props.alignItems as any,
		justifyContent: props.justifyContent as any,
		alignContent: props.alignContent as any,
		gridAutoFlow: props.autoFlow as any,
		minHeight: '400px',
		backgroundColor: 'hsl(var(--muted))',
		borderRadius: '8px',
		padding: '20px',
		border: '2px dashed hsl(var(--border))',
		// Как и во флексбокс-генераторе: при fit-content сетка обжималась по
		// содержимому, и колонки в `1fr` теряли смысл — делить было нечего.
		width: '100%'
	}

	// Keyboard shortcuts - matching widgetShortcuts.ts configuration
	const SELECTS: {
		key: keyof GridProps
		label: string
		options: string[]
	}[] = [
		{
			key: 'justifyItems',
			label: 'justify-items',
			options: ['start', 'end', 'center', 'stretch']
		},
		{
			key: 'alignItems',
			label: 'align-items',
			options: ['start', 'end', 'center', 'stretch']
		},
		{
			key: 'autoFlow',
			label: 'grid-auto-flow',
			options: ['row', 'column', 'dense', 'row dense', 'column dense']
		}
	]

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: сколько ячеек показывать. К самому CSS это
				    отношения не имеет, поэтому и вынесено из полосы свойств. */}
				<div className={toolBar}>
					<div className='flex items-center gap-3'>
						<span className='text-sm text-muted-foreground'>Элементов</span>
						<Slider
							value={[itemCount]}
							onValueChange={([value]) => setItemCount(value)}
							min={1}
							max={20}
							step={1}
							className='w-28 cursor-pointer'
							aria-label='Количество элементов'
						/>
						<span className='w-6 font-mono text-sm tabular-nums'>
							{itemCount}
						</span>
					</div>

					<button
						type='button'
						onClick={() => setShowItemNumbers(value => !value)}
						aria-pressed={showItemNumbers}
						className={toolPill(showItemNumbers)}
					>
						Номера
					</button>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={resetProps}
							title='Сбросить свойства'
							className={toolIconButton}
						>
							<RotateCcw className='h-4 w-4' />
						</Button>
					</div>
				</div>

				<div className='overflow-x-auto px-5 py-8 sm:px-6'>
					<div style={containerStyle}>
						{Array.from({ length: itemCount }).map((_, i) => (
							<div
								key={i}
								className='flex min-h-[3.75rem] items-center justify-center rounded-md bg-primary p-4 font-semibold text-primary-foreground'
							>
								{showItemNumbers && i + 1}
							</div>
						))}
					</div>
				</div>

				{/* Полоса разметки сетки: колонки и ряды — главное, что здесь
				    настраивают, поэтому они первыми и с кнопками «плюс/минус». */}
				<div className={toolFooterBar}>
					{[
						{
							label: 'columns',
							value: props.columns,
							onChange: (value: string) => updateProp('columns', value),
							onAdd: addColumn,
							onRemove: removeColumn,
							placeholder: '1fr 1fr 1fr'
						},
						{
							label: 'rows',
							value: props.rows,
							onChange: (value: string) => updateProp('rows', value),
							onAdd: addRow,
							onRemove: removeRow,
							placeholder: '1fr 1fr'
						}
					].map(track => (
						<label
							key={track.label}
							className='flex items-center gap-2 text-sm text-muted-foreground'
						>
							<span className='font-mono text-xs'>{track.label}</span>
							<input
								value={track.value}
								onChange={event => track.onChange(event.target.value)}
								placeholder={track.placeholder}
								spellCheck={false}
								className='w-40 rounded-md border bg-background px-2 py-1 font-mono text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
							/>
							<span className='flex items-center gap-0.5'>
								<Button
									size='icon'
									variant='ghost'
									onClick={track.onRemove}
									title='Убрать'
									className={cn(toolIconButton, 'h-7 w-7')}
								>
									<Minus className='h-3.5 w-3.5' />
								</Button>
								<Button
									size='icon'
									variant='ghost'
									onClick={track.onAdd}
									title='Добавить'
									className={cn(toolIconButton, 'h-7 w-7')}
								>
									<Plus className='h-3.5 w-3.5' />
								</Button>
							</span>
						</label>
					))}
				</div>

				<div className={toolFooterBar}>
					{SELECTS.map(select => (
						<label
							key={select.key}
							className='flex items-center gap-2 text-sm text-muted-foreground'
						>
							<span className='font-mono text-xs'>{select.label}</span>
							<ToolSelect
								value={props[select.key] as string}
								onChange={event => updateProp(select.key, event.target.value)}
								className='font-mono'
							>
								{select.options.map(option => (
									<option key={option} value={option}>
										{option}
									</option>
								))}
							</ToolSelect>
						</label>
					))}

					<button
						type='button'
						onClick={() => setUseUniformGap(value => !value)}
						aria-pressed={!useUniformGap}
						title='Разные отступы по вертикали и горизонтали'
						className={toolPill(!useUniformGap)}
					>
						Отступы врозь
					</button>

					{useUniformGap ? (
						<label className='flex items-center gap-2 text-sm text-muted-foreground'>
							<span className='font-mono text-xs'>gap</span>
							<Slider
								value={[props.gap]}
								onValueChange={([value]) => updateProp('gap', value)}
								min={0}
								max={50}
								step={1}
								className='w-24 cursor-pointer'
								aria-label='Отступ между элементами'
							/>
							<span className='w-10 font-mono text-sm tabular-nums text-foreground'>
								{props.gap}px
							</span>
						</label>
					) : (
						[
							{
								label: 'row-gap',
								value: props.rowGap,
								key: 'rowGap' as const
							},
							{
								label: 'column-gap',
								value: props.columnGap,
								key: 'columnGap' as const
							}
						].map(item => (
							<label
								key={item.key}
								className='flex items-center gap-2 text-sm text-muted-foreground'
							>
								<span className='font-mono text-xs'>{item.label}</span>
								<Slider
									value={[item.value]}
									onValueChange={([value]) => updateProp(item.key, value)}
									min={0}
									max={50}
									step={1}
									className='w-20 cursor-pointer'
									aria-label={item.label}
								/>
								<span className='w-10 font-mono text-sm tabular-nums text-foreground'>
									{item.value}px
								</span>
							</label>
						))
					)}
				</div>

				<div className='grid border-t md:grid-cols-2'>
					{[
						{
							title: 'CSS',
							value: generateCSS(),
							copied: copiedCSS,
							onCopy: copyToClipboard
						},
						{
							title: 'Tailwind',
							value: generateTailwind(),
							copied: copiedTailwind,
							onCopy: copyTailwindToClipboard
						}
					].map((pane, index) => (
						<div
							key={pane.title}
							className={cn(
								'flex min-w-0 flex-col',
								index === 0 && 'md:border-r',
								index === 1 && 'border-t md:border-t-0'
							)}
						>
							<div className='flex items-center justify-between gap-2 px-5 pt-4 sm:px-6'>
								<span className='text-sm font-medium'>{pane.title}</span>
								<Button
									size='icon'
									variant='ghost'
									onClick={pane.onCopy}
									title='Скопировать'
									className={toolIconButton}
								>
									{pane.copied ? (
										<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
									) : (
										<Copy className='h-4 w-4' />
									)}
								</Button>
							</div>
							<pre className='overflow-x-auto px-5 pt-2 pb-5 font-mono text-xs leading-relaxed whitespace-pre-wrap sm:px-6'>
								{pane.value}
							</pre>
						</div>
					))}
				</div>
			</Card>

			<ToolScreenshot slug='grid-generator' />
			<GridGuide />
		</WidgetSEOWrapper>
	)
}

'use client'

import { useState, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Copy, RotateCcw, Plus, Minus, HelpCircle, Check } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslations, useLocale } from 'next-intl'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@/components/ui/tooltip'
import { useWidgetKeyboard } from '@/lib/hooks/useWidgetKeyboard'

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
	const t = useTranslations('widgets.gridGenerator')
	const locale = useLocale()
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
			toast.success(
				locale === 'ru'
					? 'CSS код скопирован в буфер обмена'
					: 'CSS code copied to clipboard'
			)
		} catch (err) {
			toast.error(t('toast.copyError'))
		}
	}

	const copyTailwindToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(generateTailwind())
			setCopiedTailwind(true)
			setTimeout(() => setCopiedTailwind(false), 2000)
			toast.success(
				locale === 'ru'
					? 'Tailwind классы скопированы в буфер обмена'
					: 'Tailwind classes copied to clipboard'
			)
		} catch (err) {
			toast.error(t('toast.copyError'))
		}
	}

	const resetProps = useCallback(() => {
		setProps(defaultProps)
		setUseUniformGap(true)
		setItemCount(6)
		setShowItemNumbers(true)
		toast.success(locale === 'ru' ? 'Настройки сброшены' : 'Settings reset')
	}, [locale])

	const renderLabel = (key: string, englishLabel: string) => {
		if (locale !== 'ru') {
			return <Label className='text-xs'>{t(key)}</Label>
		}

		return (
			<div className='flex items-center gap-1'>
				<Label className='text-xs'>{englishLabel}</Label>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<HelpCircle className='h-3 w-3 text-muted-foreground' />
						</TooltipTrigger>
						<TooltipContent>
							<p className='text-xs'>{t(key)}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		)
	}

	const addColumn = useCallback(() => {
		const columns = props.columns.split(' ')
		columns.push('1fr')
		updateProp('columns', columns.join(' '))
		toast.info(locale === 'ru' ? 'Колонка добавлена' : 'Column added')
	}, [props.columns, locale, updateProp])

	const removeColumn = useCallback(() => {
		const columns = props.columns.split(' ')
		if (columns.length > 1) {
			columns.pop()
			updateProp('columns', columns.join(' '))
			toast.info(locale === 'ru' ? 'Колонка удалена' : 'Column removed')
		}
	}, [props.columns, locale, updateProp])

	const addRow = useCallback(() => {
		const rows = props.rows.split(' ')
		rows.push('1fr')
		updateProp('rows', rows.join(' '))
		toast.info(locale === 'ru' ? 'Ряд добавлен' : 'Row added')
	}, [props.rows, locale, updateProp])

	const removeRow = useCallback(() => {
		const rows = props.rows.split(' ')
		if (rows.length > 1) {
			rows.pop()
			updateProp('rows', rows.join(' '))
			toast.info(locale === 'ru' ? 'Ряд удален' : 'Row removed')
		}
	}, [props.rows, locale, updateProp])

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
		border: '2px dashed hsl(var(--border))'
	}

	// Keyboard shortcuts - matching widgetShortcuts.ts configuration
	useWidgetKeyboard({
		widgetId: 'grid-generator',
		shortcuts: [
			{
				key: '1',
				primary: true,
				description: 'Copy CSS',
				action: copyToClipboard
			},
			{
				key: '2',
				primary: true,
				description: 'Copy Tailwind',
				action: copyTailwindToClipboard
			},
			{
				key: 'r',
				primary: true,
				shift: true,
				description: 'Reset',
				action: resetProps
			},
			{
				key: 'a',
				primary: true,
				shift: true,
				description: 'Add Column',
				action: addColumn
			},
			{
				key: 'd',
				primary: true,
				shift: true,
				description: 'Remove Column',
				action: removeColumn
			}
		]
	})

	return (
		<div className='grid gap-6 lg:grid-cols-3'>
			{/* Controls */}
			<Card className='lg:col-span-1'>
				<CardHeader>
					<CardTitle className='flex items-center justify-between'>
						<span>{t('properties')}</span>
						<Button
							variant='ghost'
							size='sm'
							onClick={resetProps}
							className='h-8 hover:bg-accent hover:text-white'
						>
							<RotateCcw className='w-4 h-4 mr-1' />
							{t('reset')}
						</Button>
					</CardTitle>
				</CardHeader>
				<CardContent className='space-y-3'>
					<div className='grid grid-cols-2 gap-3'>
						<div className='space-y-1'>
							{renderLabel('columns', 'grid-template-columns')}
							<div className='flex gap-1'>
								<Input
									value={props.columns}
									onChange={e => updateProp('columns', e.target.value)}
									placeholder='1fr 1fr 1fr'
									className='h-9 text-sm'
								/>
								<Button
									size='icon'
									variant='outline'
									onClick={addColumn}
									className='h-9 w-9'
								>
									<Plus className='w-3 h-3' />
								</Button>
								<Button
									size='icon'
									variant='outline'
									onClick={removeColumn}
									className='h-9 w-9'
								>
									<Minus className='w-3 h-3' />
								</Button>
							</div>
						</div>

						<div className='space-y-1'>
							{renderLabel('rows', 'grid-template-rows')}
							<div className='flex gap-1'>
								<Input
									value={props.rows}
									onChange={e => updateProp('rows', e.target.value)}
									placeholder='1fr 1fr'
									className='h-9 text-sm'
								/>
								<Button
									size='icon'
									variant='outline'
									onClick={addRow}
									className='h-9 w-9'
								>
									<Plus className='w-3 h-3' />
								</Button>
								<Button
									size='icon'
									variant='outline'
									onClick={removeRow}
									className='h-9 w-9'
								>
									<Minus className='w-3 h-3' />
								</Button>
							</div>
						</div>
					</div>

					<div className='space-y-1'>
						<div className='flex items-center justify-between'>
							{locale === 'ru' ? (
								<div className='flex items-center gap-1'>
									<Label className='text-xs'>gap</Label>
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<HelpCircle className='h-3 w-3 text-muted-foreground' />
											</TooltipTrigger>
											<TooltipContent>
												<p className='text-xs'>{t('gap')}</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</div>
							) : (
								<Label className='text-xs'>{t('gap')}</Label>
							)}
							<Switch
								checked={useUniformGap}
								onCheckedChange={setUseUniformGap}
							/>
						</div>
						{useUniformGap ? (
							<div className='space-y-1'>
								<Label className='text-xs text-muted-foreground'>
									gap: {props.gap}px
								</Label>
								<Slider
									value={[props.gap]}
									onValueChange={([value]) => updateProp('gap', value)}
									min={0}
									max={50}
									step={1}
									className='h-8'
								/>
							</div>
						) : (
							<div className='grid grid-cols-2 gap-3'>
								<div className='space-y-1'>
									<Label className='text-xs text-muted-foreground'>
										row-gap: {props.rowGap}px
									</Label>
									<Slider
										value={[props.rowGap]}
										onValueChange={([value]) => updateProp('rowGap', value)}
										min={0}
										max={50}
										step={1}
										className='h-8'
									/>
								</div>
								<div className='space-y-1'>
									<Label className='text-xs text-muted-foreground'>
										column-gap: {props.columnGap}px
									</Label>
									<Slider
										value={[props.columnGap]}
										onValueChange={([value]) => updateProp('columnGap', value)}
										min={0}
										max={50}
										step={1}
										className='h-8'
									/>
								</div>
							</div>
						)}
					</div>

					<div className='grid grid-cols-2 gap-3'>
						<div className='space-y-1'>
							{renderLabel('justifyItems', 'justify-items')}
							<Select
								value={props.justifyItems}
								onValueChange={value => updateProp('justifyItems', value)}
							>
								<SelectTrigger className='h-9'>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='start'>start</SelectItem>
									<SelectItem value='end'>end</SelectItem>
									<SelectItem value='center'>center</SelectItem>
									<SelectItem value='stretch'>stretch</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className='space-y-1'>
							{renderLabel('alignItems', 'align-items')}
							<Select
								value={props.alignItems}
								onValueChange={value => updateProp('alignItems', value)}
							>
								<SelectTrigger className='h-9'>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='start'>start</SelectItem>
									<SelectItem value='end'>end</SelectItem>
									<SelectItem value='center'>center</SelectItem>
									<SelectItem value='stretch'>stretch</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className='space-y-1'>
						{renderLabel('autoFlow', 'grid-auto-flow')}
						<Select
							value={props.autoFlow}
							onValueChange={value => updateProp('autoFlow', value)}
						>
							<SelectTrigger className='h-9'>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='row'>row</SelectItem>
								<SelectItem value='column'>column</SelectItem>
								<SelectItem value='dense'>dense</SelectItem>
								<SelectItem value='row dense'>row dense</SelectItem>
								<SelectItem value='column dense'>column dense</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className='grid grid-cols-2 gap-3'>
						<div className='space-y-1'>
							<Label className='text-xs'>
								{t('items')}: {itemCount}
							</Label>
							<Slider
								value={[itemCount]}
								onValueChange={([value]) => setItemCount(value)}
								min={1}
								max={20}
								step={1}
								className='h-8'
							/>
						</div>

						<div className='space-y-1'>
							<Label className='text-xs'>{t('showNumbers')}</Label>
							<div className='h-8 flex items-center'>
								<Switch
									checked={showItemNumbers}
									onCheckedChange={setShowItemNumbers}
								/>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Preview */}
			<Card className='lg:col-span-2'>
				<CardHeader>
					<CardTitle>{t('preview')}</CardTitle>
				</CardHeader>
				<CardContent>
					<div style={containerStyle}>
						{Array.from({ length: itemCount }).map((_, i) => (
							<div
								key={i}
								className='bg-primary text-primary-foreground rounded-md p-4 min-h-[60px] flex items-center justify-center font-semibold'
							>
								{showItemNumbers && i + 1}
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Generated CSS */}
			<Card className='lg:col-span-3'>
				<CardHeader>
					<CardTitle>{t('generatedCss')}</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='grid md:grid-cols-2 gap-4'>
						{/* CSS Result */}
						<div>
							<div className='flex items-center justify-between mb-2'>
								<Label className='text-sm text-muted-foreground'>CSS</Label>
								<Button
									size='sm'
									variant='ghost'
									onClick={copyToClipboard}
									className='h-8 px-2 hover:bg-accent hover:text-white'
								>
									{copiedCSS ? (
										<Check className='h-3 w-3 text-green-500' />
									) : (
										<Copy className='h-3 w-3' />
									)}
								</Button>
							</div>
							<div className='bg-secondary rounded-lg p-4'>
								<pre className='text-secondary-foreground font-mono text-xs overflow-x-auto'>
									{generateCSS()}
								</pre>
							</div>
						</div>

						{/* Tailwind Result */}
						<div>
							<div className='flex items-center justify-between mb-2'>
								<Label className='text-sm text-muted-foreground'>
									Tailwind CSS
								</Label>
								<Button
									size='sm'
									variant='ghost'
									onClick={copyTailwindToClipboard}
									className='h-8 px-2 hover:bg-accent hover:text-white'
								>
									{copiedTailwind ? (
										<Check className='h-3 w-3 text-green-500' />
									) : (
										<Copy className='h-3 w-3' />
									)}
								</Button>
							</div>
							<div className='bg-secondary rounded-lg p-4'>
								<span className='text-secondary-foreground font-mono text-xs break-words'>
									{generateTailwind()}
								</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

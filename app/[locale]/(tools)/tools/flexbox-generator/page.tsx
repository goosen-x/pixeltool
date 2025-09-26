'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
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
import { Copy, RotateCcw, HelpCircle, Check } from 'lucide-react'
import { toast } from 'sonner'
import { useLocale } from 'next-intl'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@/components/ui/tooltip'
import { useWidgetKeyboard } from '@/lib/hooks/useWidgetKeyboard'

interface FlexboxProps {
	flexDirection: string
	justifyContent: string
	alignItems: string
	alignContent: string
	flexWrap: string
	gap: number
}

const defaultProps: FlexboxProps = {
	flexDirection: 'row',
	justifyContent: 'flex-start',
	alignItems: 'stretch',
	alignContent: 'stretch',
	flexWrap: 'nowrap',
	gap: 16
}

export default function FlexboxGeneratorPage() {
	const locale = useLocale()
	const [props, setProps] = useState<FlexboxProps>(defaultProps)
	const [itemCount, setItemCount] = useState(3)
	const [showItemNumbers, setShowItemNumbers] = useState(true)
	const [copiedTailwind, setCopiedTailwind] = useState(false)
	const [copiedCSS, setCopiedCSS] = useState(false)

	const updateProp = (key: keyof FlexboxProps, value: string | number) => {
		setProps(prev => ({ ...prev, [key]: value }))
	}

	const generateCSS = () => {
		const css = `.container {
  display: flex;
  flex-direction: ${props.flexDirection};
  justify-content: ${props.justifyContent};
  align-items: ${props.alignItems};
  align-content: ${props.alignContent};
  flex-wrap: ${props.flexWrap};
  gap: ${props.gap}px;
}`
		return css
	}

	const generateTailwind = () => {
		// Map CSS values to Tailwind classes
		const flexDirectionMap: Record<string, string> = {
			row: 'flex-row',
			'row-reverse': 'flex-row-reverse',
			column: 'flex-col',
			'column-reverse': 'flex-col-reverse'
		}

		const justifyContentMap: Record<string, string> = {
			'flex-start': 'justify-start',
			'flex-end': 'justify-end',
			center: 'justify-center',
			'space-between': 'justify-between',
			'space-around': 'justify-around',
			'space-evenly': 'justify-evenly'
		}

		const alignItemsMap: Record<string, string> = {
			'flex-start': 'items-start',
			'flex-end': 'items-end',
			center: 'items-center',
			stretch: 'items-stretch',
			baseline: 'items-baseline'
		}

		const alignContentMap: Record<string, string> = {
			'flex-start': 'content-start',
			'flex-end': 'content-end',
			center: 'content-center',
			stretch: 'content-stretch',
			'space-between': 'content-between',
			'space-around': 'content-around'
		}

		const flexWrapMap: Record<string, string> = {
			nowrap: 'flex-nowrap',
			wrap: 'flex-wrap',
			'wrap-reverse': 'flex-wrap-reverse'
		}

		// Generate gap class
		const gapClass =
			props.gap % 4 === 0 && props.gap <= 96
				? `gap-${props.gap / 4}`
				: `gap-[${props.gap}px]`

		// Combine all classes
		const classes = [
			'flex',
			flexDirectionMap[props.flexDirection],
			justifyContentMap[props.justifyContent],
			alignItemsMap[props.alignItems],
			alignContentMap[props.alignContent],
			flexWrapMap[props.flexWrap],
			gapClass
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
			toast.error('Ошибка копирования')
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
			toast.error('Ошибка копирования')
		}
	}

	const resetProps = useCallback(() => {
		setProps(defaultProps)
		setItemCount(3)
		setShowItemNumbers(true)
		toast.success(locale === 'ru' ? 'Настройки сброшены' : 'Settings reset')
	}, [locale])

	const addItem = useCallback(() => {
		if (itemCount < 12) {
			setItemCount(prev => prev + 1)
			toast.info(
				locale === 'ru'
					? `Добавлен элемент ${itemCount + 1}`
					: `Added item ${itemCount + 1}`
			)
		}
	}, [itemCount, locale])

	const removeItem = useCallback(() => {
		if (itemCount > 1) {
			setItemCount(prev => prev - 1)
			toast.info(
				locale === 'ru'
					? `Удален элемент ${itemCount}`
					: `Removed item ${itemCount}`
			)
		}
	}, [itemCount, locale])

	const renderLabel = (key: string, englishLabel: string) => {
		if (locale !== 'ru') {
			return <Label className='text-xs'>{englishLabel}</Label>
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
							<p className='text-xs'>Описание свойства CSS Flexbox</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		)
	}

	const containerStyle: React.CSSProperties = {
		display: 'flex',
		flexDirection: props.flexDirection as any,
		justifyContent: props.justifyContent as any,
		alignItems: props.alignItems as any,
		alignContent: props.alignContent as any,
		flexWrap: props.flexWrap as any,
		gap: `${props.gap}px`,
		minHeight: '300px',
		backgroundColor: 'hsl(var(--muted))',
		borderRadius: '8px',
		padding: '20px',
		border: '2px dashed hsl(var(--border))',
		overflow: 'hidden'
	}

	// Keyboard shortcuts
	useWidgetKeyboard({
		widgetId: 'flexbox-generator',
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
				description: 'Add Item',
				action: addItem
			},
			{
				key: 'd',
				primary: true,
				shift: true,
				description: 'Remove Item',
				action: removeItem
			}
		]
	})

	return (
		<div className='grid gap-6 lg:grid-cols-3'>
			{/* Controls */}
			<Card className='lg:col-span-1'>
				<CardHeader>
					<CardTitle className='flex items-center justify-between'>
						<span>Свойства</span>
						<Button
							variant='ghost'
							size='sm'
							onClick={resetProps}
							className='h-8 hover:bg-accent hover:text-white'
						>
							<RotateCcw className='w-4 h-4 mr-1' />
							Сброс
						</Button>
					</CardTitle>
				</CardHeader>
				<CardContent className='space-y-3'>
					<div className='grid grid-cols-2 gap-3'>
						<div className='space-y-1'>
							{renderLabel('direction', 'flex-direction')}
							<Select
								value={props.flexDirection}
								onValueChange={value => updateProp('flexDirection', value)}
							>
								<SelectTrigger className='h-9'>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='row'>row</SelectItem>
									<SelectItem value='row-reverse'>row-reverse</SelectItem>
									<SelectItem value='column'>column</SelectItem>
									<SelectItem value='column-reverse'>column-reverse</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className='space-y-1'>
							{renderLabel('flexWrap', 'flex-wrap')}
							<Select
								value={props.flexWrap}
								onValueChange={value => updateProp('flexWrap', value)}
							>
								<SelectTrigger className='h-9'>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='nowrap'>nowrap</SelectItem>
									<SelectItem value='wrap'>wrap</SelectItem>
									<SelectItem value='wrap-reverse'>wrap-reverse</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className='space-y-1'>
							{renderLabel('justifyContent', 'justify-content')}
							<Select
								value={props.justifyContent}
								onValueChange={value => updateProp('justifyContent', value)}
							>
								<SelectTrigger className='h-9'>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='flex-start'>flex-start</SelectItem>
									<SelectItem value='flex-end'>flex-end</SelectItem>
									<SelectItem value='center'>center</SelectItem>
									<SelectItem value='space-between'>space-between</SelectItem>
									<SelectItem value='space-around'>space-around</SelectItem>
									<SelectItem value='space-evenly'>space-evenly</SelectItem>
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
									<SelectItem value='flex-start'>flex-start</SelectItem>
									<SelectItem value='flex-end'>flex-end</SelectItem>
									<SelectItem value='center'>center</SelectItem>
									<SelectItem value='stretch'>stretch</SelectItem>
									<SelectItem value='baseline'>baseline</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className='grid grid-cols-2 gap-3'>
						<div className='space-y-1'>
							{renderLabel('alignContent', 'align-content')}
							<Select
								value={props.alignContent}
								onValueChange={value => updateProp('alignContent', value)}
							>
								<SelectTrigger className='h-9'>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='flex-start'>flex-start</SelectItem>
									<SelectItem value='flex-end'>flex-end</SelectItem>
									<SelectItem value='center'>center</SelectItem>
									<SelectItem value='stretch'>stretch</SelectItem>
									<SelectItem value='space-between'>space-between</SelectItem>
									<SelectItem value='space-around'>space-around</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className='space-y-1'>
							<Label className='text-xs'>Показать номера</Label>
							<div className='h-9 flex items-center'>
								<Switch
									checked={showItemNumbers}
									onCheckedChange={setShowItemNumbers}
								/>
							</div>
						</div>
					</div>

					<div className='grid grid-cols-2 gap-3'>
						<div className='space-y-1'>
							{locale === 'ru' ? (
								<div className='flex items-center gap-1'>
									<Label className='text-xs'>gap: {props.gap}px</Label>
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<HelpCircle className='h-3 w-3 text-muted-foreground' />
											</TooltipTrigger>
											<TooltipContent>
												<p className='text-xs'>Отступ между элементами</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</div>
							) : (
								<Label className='text-xs'>Отступ: {props.gap}px</Label>
							)}
							<Slider
								value={[props.gap]}
								onValueChange={([value]) => updateProp('gap', value)}
								min={0}
								max={50}
								step={1}
								className='h-8'
							/>
						</div>

						<div className='space-y-1'>
							<Label className='text-xs'>Элементы: {itemCount}</Label>
							<Slider
								value={[itemCount]}
								onValueChange={([value]) => setItemCount(value)}
								min={1}
								max={12}
								step={1}
								className='h-8'
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Preview */}
			<Card className='lg:col-span-2'>
				<CardHeader>
					<CardTitle>Превью</CardTitle>
				</CardHeader>
				<CardContent>
					<div style={containerStyle}>
						{Array.from({ length: itemCount }).map((_, i) => (
							<div
								key={i}
								className='bg-primary text-primary-foreground rounded-md p-4 min-w-[60px] min-h-[60px] flex items-center justify-center font-semibold'
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
					<CardTitle>Сгенерированный CSS</CardTitle>
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

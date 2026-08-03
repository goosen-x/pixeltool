'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { FlexboxGuide } from './FlexboxGuide'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Copy, RotateCcw, Check } from 'lucide-react'
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
	const widget = getWidgetById('flexbox-generator')!
	const locale = 'ru'
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
		setItemCount(3)
		setShowItemNumbers(true)
		toast.success('Настройки сброшены')
	}, [locale])

	const addItem = useCallback(() => {
		if (itemCount < 12) {
			setItemCount(prev => prev + 1)
			toast.info(`Added item ${itemCount + 1}`)
		}
	}, [itemCount, locale])

	const removeItem = useCallback(() => {
		if (itemCount > 1) {
			setItemCount(prev => prev - 1)
			toast.info(`Removed item ${itemCount}`)
		}
	}, [itemCount, locale])

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
		// Было fit-content — контейнер обжимал элементы по содержимому, и
		// justify-content визуально не делал ничего: распределять свободное место
		// можно только когда оно есть. Ради этого свойства инструмент и открывают,
		// оно даже вынесено в заголовок страницы.
		width: '100%'
	}

	// Списки значений держим рядом с разметкой: подписи к ним не нужны —
	// это буквально значения CSS-свойств, они и есть их собственные названия.
	const PROPERTIES: {
		key: keyof FlexboxProps
		label: string
		options: string[]
	}[] = [
		{
			key: 'flexDirection',
			label: 'flex-direction',
			options: ['row', 'row-reverse', 'column', 'column-reverse']
		},
		{
			key: 'flexWrap',
			label: 'flex-wrap',
			options: ['nowrap', 'wrap', 'wrap-reverse']
		},
		{
			key: 'justifyContent',
			label: 'justify-content',
			options: [
				'flex-start',
				'flex-end',
				'center',
				'space-between',
				'space-around',
				'space-evenly'
			]
		},
		{
			key: 'alignItems',
			label: 'align-items',
			options: ['flex-start', 'flex-end', 'center', 'stretch', 'baseline']
		},
		{
			key: 'alignContent',
			label: 'align-content',
			options: [
				'flex-start',
				'flex-end',
				'center',
				'stretch',
				'space-between',
				'space-around'
			]
		}
	]

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: сколько элементов в контейнере и что с ними
				    показывать. Раньше это жило в карточке «Свойства» вперемешку с
				    самими CSS-свойствами, хотя к CSS не относится вообще. */}
				<div className={toolBar}>
					<div className='flex items-center gap-3'>
						<span className='text-sm text-muted-foreground'>Элементов</span>
						<Slider
							value={[itemCount]}
							onValueChange={([value]) => setItemCount(value)}
							min={1}
							max={12}
							step={1}
							className='w-28 cursor-pointer'
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

				{/* Предпросмотр — то, ради чего инструмент открывают, поэтому он
				    занимает всю ширину, а не треть экрана рядом с настройками. */}
				<div className='overflow-x-auto px-5 py-8 sm:px-6'>
					<div style={containerStyle}>
						{Array.from({ length: itemCount }).map((_, i) => (
							<div
								key={i}
								className='flex min-h-[3.75rem] min-w-[3.75rem] items-center justify-center rounded-md bg-primary p-4 font-semibold text-primary-foreground'
							>
								{showItemNumbers && i + 1}
							</div>
						))}
					</div>
				</div>

				{/* Полоса свойств. Пять списков в одну строку вместо колонки на треть
				    экрана: значения CSS-свойств длинные, но их всего пять. */}
				<div className={toolFooterBar}>
					{PROPERTIES.map(property => (
						<label
							key={property.key}
							className='flex items-center gap-2 text-sm text-muted-foreground'
						>
							<span className='font-mono text-xs'>{property.label}</span>
							<select
								value={props[property.key] as string}
								onChange={event => updateProp(property.key, event.target.value)}
								className='cursor-pointer rounded-md border bg-background px-2 py-1 font-mono text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
							>
								{property.options.map(option => (
									<option key={option} value={option}>
										{option}
									</option>
								))}
							</select>
						</label>
					))}

					<label className='flex items-center gap-2 text-sm text-muted-foreground'>
						<span className='font-mono text-xs'>gap</span>
						<Slider
							value={[props.gap]}
							onValueChange={([value]) => updateProp('gap', value)}
							min={0}
							max={50}
							step={1}
							className='w-24 cursor-pointer'
						/>
						<span className='w-10 font-mono text-sm tabular-nums text-foreground'>
							{props.gap}px
						</span>
					</label>
				</div>

				{/* Готовый код — две панели в одной карточке, как у base64. */}
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

			<FlexboxGuide />
		</WidgetSEOWrapper>
	)
}

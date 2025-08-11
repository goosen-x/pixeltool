'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Copy, RotateCcw, HelpCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslations, useLocale } from 'next-intl'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

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
	const t = useTranslations('widgets.flexboxGenerator')
	const locale = useLocale()
	const [props, setProps] = useState<FlexboxProps>(defaultProps)
	const [itemCount, setItemCount] = useState(3)
	const [showItemNumbers, setShowItemNumbers] = useState(true)

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

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(generateCSS())
			toast.success(t('toast.copied'))
		} catch (err) {
			toast.error(t('toast.copyError'))
		}
	}

	const resetProps = () => {
		setProps(defaultProps)
	}

	const renderLabel = (key: string, englishLabel: string) => {
		if (locale !== 'ru') {
			return <Label className="text-xs">{t(key)}</Label>
		}
		
		return (
			<div className="flex items-center gap-1">
				<Label className="text-xs">{englishLabel}</Label>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<HelpCircle className="h-3 w-3 text-muted-foreground" />
						</TooltipTrigger>
						<TooltipContent>
							<p className="text-xs">{t(key)}</p>
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

	return (

			<div className="grid gap-6 lg:grid-cols-3">
				{/* Controls */}
				<Card className="lg:col-span-1">
					<CardHeader>
						<CardTitle className="flex items-center justify-between">
							<span>{t('properties')}</span>
							<Button
								variant="ghost"
								size="sm"
								onClick={resetProps}
								className="h-8 hover:bg-accent hover:text-white"
							>
								<RotateCcw className="w-4 h-4 mr-1" />
								{t('reset')}
							</Button>
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1">
								{renderLabel('direction', 'flex-direction')}
								<Select value={props.flexDirection} onValueChange={(value) => updateProp('flexDirection', value)}>
									<SelectTrigger className="h-9">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="row">row</SelectItem>
										<SelectItem value="row-reverse">row-reverse</SelectItem>
										<SelectItem value="column">column</SelectItem>
										<SelectItem value="column-reverse">column-reverse</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-1">
								{renderLabel('flexWrap', 'flex-wrap')}
								<Select value={props.flexWrap} onValueChange={(value) => updateProp('flexWrap', value)}>
									<SelectTrigger className="h-9">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="nowrap">nowrap</SelectItem>
										<SelectItem value="wrap">wrap</SelectItem>
										<SelectItem value="wrap-reverse">wrap-reverse</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-1">
								{renderLabel('justifyContent', 'justify-content')}
								<Select value={props.justifyContent} onValueChange={(value) => updateProp('justifyContent', value)}>
									<SelectTrigger className="h-9">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="flex-start">flex-start</SelectItem>
										<SelectItem value="flex-end">flex-end</SelectItem>
										<SelectItem value="center">center</SelectItem>
										<SelectItem value="space-between">space-between</SelectItem>
										<SelectItem value="space-around">space-around</SelectItem>
										<SelectItem value="space-evenly">space-evenly</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-1">
								{renderLabel('alignItems', 'align-items')}
								<Select value={props.alignItems} onValueChange={(value) => updateProp('alignItems', value)}>
									<SelectTrigger className="h-9">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="flex-start">flex-start</SelectItem>
										<SelectItem value="flex-end">flex-end</SelectItem>
										<SelectItem value="center">center</SelectItem>
										<SelectItem value="stretch">stretch</SelectItem>
										<SelectItem value="baseline">baseline</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1">
								{renderLabel('alignContent', 'align-content')}
								<Select value={props.alignContent} onValueChange={(value) => updateProp('alignContent', value)}>
									<SelectTrigger className="h-9">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="flex-start">flex-start</SelectItem>
										<SelectItem value="flex-end">flex-end</SelectItem>
										<SelectItem value="center">center</SelectItem>
										<SelectItem value="stretch">stretch</SelectItem>
										<SelectItem value="space-between">space-between</SelectItem>
										<SelectItem value="space-around">space-around</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-1">
								<Label className="text-xs">{t('showNumbers')}</Label>
								<div className="h-9 flex items-center">
									<Switch
										checked={showItemNumbers}
										onCheckedChange={setShowItemNumbers}
									/>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1">
								{locale === 'ru' ? (
									<div className="flex items-center gap-1">
										<Label className="text-xs">gap: {props.gap}px</Label>
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<HelpCircle className="h-3 w-3 text-muted-foreground" />
												</TooltipTrigger>
												<TooltipContent>
													<p className="text-xs">{t('gap')}</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</div>
								) : (
									<Label className="text-xs">{t('gap')}: {props.gap}px</Label>
								)}
								<Slider
									value={[props.gap]}
									onValueChange={([value]) => updateProp('gap', value)}
									min={0}
									max={50}
									step={1}
									className="h-8"
								/>
							</div>

							<div className="space-y-1">
								<Label className="text-xs">{t('items')}: {itemCount}</Label>
								<Slider
									value={[itemCount]}
									onValueChange={([value]) => setItemCount(value)}
									min={1}
									max={12}
									step={1}
									className="h-8"
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Preview */}
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle>{t('preview')}</CardTitle>
					</CardHeader>
					<CardContent>
						<div style={containerStyle}>
							{Array.from({ length: itemCount }).map((_, i) => (
								<div
									key={i}
									className="bg-primary text-primary-foreground rounded-md p-4 min-w-[60px] min-h-[60px] flex items-center justify-center font-semibold"
								>
									{showItemNumbers && (i + 1)}
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Generated CSS */}
				<Card className="lg:col-span-3">
					<CardHeader>
						<CardTitle className="flex items-center justify-between">
							<span>{t('generatedCss')}</span>
							<Button
								variant="outline"
								size="sm"
								onClick={copyToClipboard}
								className="hover:bg-accent hover:text-white"
							>
								<Copy className="w-4 h-4 mr-1" />
								{t('copy')}
							</Button>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<pre className="bg-muted p-4 rounded-md overflow-x-auto">
							<code className="text-sm">{generateCSS()}</code>
						</pre>
					</CardContent>
				</Card>
			</div>
			
	)
}
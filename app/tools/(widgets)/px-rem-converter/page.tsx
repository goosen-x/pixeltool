'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp, Info, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { useConverter } from '@/lib/hooks/widgets/useConverter'
import {
	ConversionInput,
	ResultCard,
	SettingsInline,
	QuickPresets
} from '@/components/widgets/converter'

export default function PxRemConverterPage() {
	const converter = useConverter()
	const [showAdvanced, setShowAdvanced] = useState(false)
	const [showTable, setShowTable] = useState(false)

	const handleCopy = (value: number, unit: string) => {
		const formatted = converter.formatValueWithUnit(value, unit as any)
		navigator.clipboard.writeText(formatted)
		toast.success(`Скопировано: ${formatted}`)
	}

	const handleReset = () => {
		converter.reset()
		toast.success('Настройки сброшены')
	}

	return (
		<div className='max-w-5xl mx-auto space-y-6'>
			{/* Main Conversion Section */}
			<Card>
				<CardContent className='p-6 space-y-6'>
					{/* Input */}
					<div className='space-y-2'>
						<label className='text-sm font-medium text-muted-foreground'>
							Введите любое значение
						</label>
						<ConversionInput
							value={converter.inputValue}
							onChange={converter.setInputValue}
							onClear={() => converter.setInputValue('')}
							placeholder='24px, 1.5rem, 2em...'
						/>
						<p className='text-xs text-muted-foreground'>
							Поддерживаются px, rem, em, %, pt, vw, vh — просто начните печатать
						</p>
					</div>

					{/* Primary Results - Always Visible */}
					{converter.results && (
						<>
							<div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
								<ResultCard
									label='PX'
									value={converter.results.px}
									unit='px'
									isEditable={true}
									onCopy={() => handleCopy(converter.results!.px, 'px')}
									onEdit={value => converter.setFieldValue('px', value)}
									isActive={converter.lastEditedField === 'px'}
									colorScheme='blue'
								/>
								<ResultCard
									label='REM'
									value={converter.results.rem}
									unit='rem'
									isEditable={true}
									onCopy={() => handleCopy(converter.results!.rem, 'rem')}
									onEdit={value => converter.setFieldValue('rem', value)}
									isActive={converter.lastEditedField === 'rem'}
									colorScheme='green'
								/>
								<ResultCard
									label='EM'
									value={converter.results.em}
									unit='em'
									isEditable={true}
									onCopy={() => handleCopy(converter.results!.em, 'em')}
									onEdit={value => converter.setFieldValue('em', value)}
									isActive={converter.lastEditedField === 'em'}
									colorScheme='orange'
								/>
							</div>

							{/* Toggle Advanced Units */}
							<div className='flex items-center justify-center'>
								<Button
									variant='ghost'
									size='sm'
									onClick={() => setShowAdvanced(!showAdvanced)}
									className='gap-2'
								>
									{showAdvanced ? (
										<>
											<ChevronUp className='h-4 w-4' />
											Скрыть дополнительные единицы
										</>
									) : (
										<>
											<ChevronDown className='h-4 w-4' />
											Показать дополнительные единицы
										</>
									)}
								</Button>
							</div>

							{/* Advanced Results - Collapsible */}
							{showAdvanced && (
								<div className='grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t'>
									<ResultCard
										label='PERCENT'
										value={converter.results.percent}
										unit='%'
										onCopy={() => handleCopy(converter.results!.percent, '%')}
										colorScheme='purple'
									/>
									<ResultCard
										label='PT'
										value={converter.results.pt}
										unit='pt'
										onCopy={() => handleCopy(converter.results!.pt, 'pt')}
										colorScheme='pink'
									/>
									<ResultCard
										label='VW'
										value={converter.results.vw}
										unit='vw'
										onCopy={() => handleCopy(converter.results!.vw, 'vw')}
										colorScheme='cyan'
									/>
									<ResultCard
										label='VH'
										value={converter.results.vh}
										unit='vh'
										onCopy={() => handleCopy(converter.results!.vh, 'vh')}
										colorScheme='cyan'
									/>
								</div>
							)}
						</>
					)}

					{/* Empty State */}
					{!converter.results && (
						<div className='text-center py-12 text-muted-foreground'>
							<div className='text-4xl mb-3'>🔢</div>
							<p className='text-sm'>Введите значение для начала конвертации</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Settings */}
			<SettingsInline
				config={converter.config}
				onBaseChange={converter.setBaseFont}
				onParentChange={converter.setParentFont}
				onViewportWidthChange={converter.setViewportWidth}
				onViewportHeightChange={converter.setViewportHeight}
				onReset={handleReset}
			/>

			{/* Quick Presets */}
			{converter.results && (
				<Card>
					<CardContent className='p-6'>
						<QuickPresets
							onSelect={px => {
								converter.loadPreset(px)
								toast.success(`Загружен размер: ${px}px`)
							}}
							activeValue={
								converter.inputUnit === 'px'
									? parseFloat(converter.inputValue)
									: undefined
							}
						/>
					</CardContent>
				</Card>
			)}

			{/* Conversion Table - Collapsible */}
			<Card>
				<CardContent className='p-6'>
					<div className='flex items-center justify-between mb-4'>
						<h3 className='font-semibold flex items-center gap-2'>
							<Info className='w-4 h-4' />
							Таблица популярных значений
						</h3>
						<Button
							variant='ghost'
							size='sm'
							onClick={() => setShowTable(!showTable)}
						>
							{showTable ? 'Скрыть' : 'Показать'}
						</Button>
					</div>

					{showTable && (
						<div className='overflow-x-auto'>
							<table className='w-full text-sm'>
								<thead>
									<tr className='border-b'>
										<th className='text-left p-2 font-semibold'>PX</th>
										<th className='text-left p-2 font-semibold'>REM</th>
										<th className='text-left p-2 font-semibold'>EM</th>
										<th className='text-left p-2 font-semibold'>%</th>
									</tr>
								</thead>
								<tbody>
									{[8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64].map(
										px => {
											const rem = px / converter.config.baseFontSize
											const em = px / converter.config.parentFontSize
											const percent =
												(px / converter.config.parentFontSize) * 100

											return (
												<tr
													key={px}
													className='border-b hover:bg-muted/30 transition-colors cursor-pointer'
													onClick={() => {
														converter.loadPreset(px)
														toast.success(`Загружен: ${px}px`)
													}}
												>
													<td className='p-2 font-mono'>{px}px</td>
													<td className='p-2 font-mono'>
														{converter.formatValue(rem)}rem
													</td>
													<td className='p-2 font-mono'>
														{converter.formatValue(em)}em
													</td>
													<td className='p-2 font-mono'>
														{converter.formatValue(percent)}%
													</td>
												</tr>
											)
										}
									)}
								</tbody>
							</table>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Info Card */}
			<Card className='bg-muted/50'>
				<CardContent className='p-6'>
					<h3 className='font-semibold mb-4 flex items-center gap-2'>
						<Info className='w-4 h-4' />О единицах измерения CSS
					</h3>

					<div className='grid md:grid-cols-3 gap-6 text-sm'>
						<div>
							<h4 className='font-medium mb-2'>Абсолютные единицы</h4>
							<ul className='text-muted-foreground space-y-1'>
								<li>
									• <strong className='font-semibold'>px</strong> - пиксели,
									фиксированный размер
								</li>
								<li>
									• <strong className='font-semibold'>pt</strong> - пункты (1pt =
									1/72 дюйма)
								</li>
							</ul>
						</div>
						<div>
							<h4 className='font-medium mb-2'>Относительные единицы</h4>
							<ul className='text-muted-foreground space-y-1'>
								<li>
									• <strong className='font-semibold'>rem</strong> - относительно
									корневого элемента
								</li>
								<li>
									• <strong className='font-semibold'>em</strong> - относительно
									родительского элемента
								</li>
								<li>
									• <strong className='font-semibold'>%</strong> - процент от родителя
								</li>
								<li>
									• <strong className='font-semibold'>vw/vh</strong> - процент от
									viewport
								</li>
							</ul>
						</div>
						<div>
							<h4 className='font-medium mb-2'>Рекомендации</h4>
							<ul className='text-muted-foreground space-y-1'>
								<li>• Используйте rem для типографики</li>
								<li>• Применяйте em для отступов компонентов</li>
								<li>• Избегайте px для адаптивного дизайна</li>
								<li>• Комбинируйте единицы для гибкости</li>
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

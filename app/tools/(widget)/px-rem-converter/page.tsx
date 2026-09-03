'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Copy, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import { useConverter } from '@/lib/hooks/widgets/useConverter'
import type { Unit } from '@/lib/utils/unit-converter'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { RemGuide } from './RemGuide'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'

/** Размеры, которые реально набирают чаще всего — типографика и шаг сетки. */
const PRESETS = [12, 14, 16, 18, 24, 32, 48]

/** Строки таблицы соответствий под инструментом. */
const TABLE_ROWS = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64]

export default function PxRemConverterPage() {
	const widget = getWidgetById('px-rem-converter')!
	const converter = useConverter()
	const [copied, setCopied] = useState<string | null>(null)

	const copy = (value: number, unit: Unit) => {
		navigator.clipboard.writeText(converter.formatValueWithUnit(value, unit))
		setCopied(unit)
		setTimeout(() => setCopied(null), 2000)
	}

	const results = converter.results

	// Три главные единицы — редактируемые: правка любой пересчитывает остальные,
	// поэтому это не «результат», а равноправные поля одного значения.
	const primary: {
		unit: 'px' | 'rem' | 'em'
		label: string
		value: number
	}[] = results
		? [
				{ unit: 'px', label: 'px', value: results.px },
				{ unit: 'rem', label: 'rem', value: results.rem },
				{ unit: 'em', label: 'em', value: results.em }
			]
		: []

	// Остальные единицы показываем тихой строкой: их смотрят изредка, но прятать
	// за кнопкой «показать дополнительные» не за чем — места они почти не берут.
	const secondary: { unit: Unit; label: string; value: number }[] = results
		? [
				{ unit: '%', label: '%', value: results.percent },
				{ unit: 'pt', label: 'pt', value: results.pt },
				{ unit: 'vw', label: 'vw', value: results.vw },
				{ unit: 'vh', label: 'vh', value: results.vh }
			]
		: []

	const settings: {
		label: string
		value: number
		onChange: (value: number) => void
		title: string
	}[] = [
		{
			label: 'Базовый шрифт',
			value: converter.config.baseFontSize,
			onChange: converter.setBaseFont,
			title: 'font-size у html — от него считается rem'
		},
		{
			label: 'Родительский',
			value: converter.config.parentFontSize,
			onChange: converter.setParentFont,
			title: 'font-size родительского элемента — от него считается em'
		},
		{
			label: 'Ширина экрана',
			value: converter.config.viewportWidth,
			onChange: converter.setViewportWidth,
			title: 'Для пересчёта в vw'
		},
		{
			label: 'Высота экрана',
			value: converter.config.viewportHeight,
			onChange: converter.setViewportHeight,
			title: 'Для пересчёта в vh'
		}
	]

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: частые размеры одним кликом. Раньше это была
				    отдельная карточка «Быстрый доступ» с тремя вкладками на 25
				    пресетов — под задачу «перевести 24px в rem» это перебор. */}
				<div className={toolBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						<span className='mr-1 text-sm text-muted-foreground'>Часто</span>
						{PRESETS.map(px => (
							<button
								key={px}
								type='button'
								onClick={() => converter.loadPreset(px)}
								aria-pressed={converter.inputValue === String(px)}
								className={toolPill(
									converter.inputValue === String(px),
									'font-mono'
								)}
							>
								{px}
							</button>
						))}
					</div>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={converter.reset}
							title='Сбросить значение и настройки'
							className={toolIconButton}
						>
							<RotateCcw className='h-4 w-4' />
						</Button>
					</div>
				</div>

				<div className='px-5 py-8 sm:px-6'>
					{/* Одно поле на любую единицу: инструмент сам понимает, что ему
					    дали — 24px, 1.5rem или 2em. Отдельного переключателя «из чего
					    конвертируем» поэтому не нужно. */}
					<input
						value={converter.inputValue}
						onChange={event => converter.setInputValue(event.target.value)}
						spellCheck={false}
						placeholder='24px, 1.5rem, 2em…'
						aria-label='Значение для конвертации'
						className='w-full bg-transparent text-center font-mono text-3xl placeholder:font-sans placeholder:text-xl placeholder:text-muted-foreground/60 focus:outline-none sm:text-4xl'
					/>

					{results ? (
						<>
							<div className='mt-10 grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-3'>
								{primary.map(item => (
									<div
										key={item.unit}
										className='group/unit flex flex-col gap-1 bg-background px-4 py-4'
									>
										<div className='flex items-center justify-between'>
											<span className='font-mono text-xs tracking-wide text-muted-foreground uppercase'>
												{item.label}
											</span>
											<Button
												size='icon'
												variant='ghost'
												onClick={() => copy(item.value, item.unit)}
												title='Скопировать'
												className={cn(
													toolIconButton,
													'h-7 w-7 opacity-0 transition-opacity group-hover/unit:opacity-100 focus-visible:opacity-100'
												)}
											>
												{copied === item.unit ? (
													<Check className='h-3.5 w-3.5 text-green-600 dark:text-green-400' />
												) : (
													<Copy className='h-3.5 w-3.5' />
												)}
											</Button>
										</div>
										<input
											value={converter.formatValue(item.value)}
											onChange={event =>
												converter.setFieldValue(item.unit, event.target.value)
											}
											spellCheck={false}
											aria-label={`Значение в ${item.label}`}
											className='w-full bg-transparent font-mono text-2xl focus:outline-none'
										/>
									</div>
								))}
							</div>

							<div className='mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground'>
								{secondary.map(item => (
									<button
										key={item.unit}
										type='button'
										onClick={() => copy(item.value, item.unit)}
										title='Скопировать'
										className='cursor-pointer transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
									>
										<span className='font-mono'>
											{converter.formatValue(item.value)}
										</span>
										<span className='ml-1 font-mono text-xs'>{item.label}</span>
									</button>
								))}
							</div>
						</>
					) : (
						<p className='mt-10 text-center text-sm text-muted-foreground'>
							Введите значение — пересчёт появится здесь
						</p>
					)}
				</div>

				{/* Полоса настроек. От базового шрифта зависит весь пересчёт rem,
				    поэтому она на виду, а не спрятана за шестерёнкой. */}
				<div className={toolFooterBar}>
					{settings.map(setting => (
						<label
							key={setting.label}
							title={setting.title}
							className='flex items-center gap-2 text-sm text-muted-foreground'
						>
							{setting.label}
							<input
								type='number'
								value={setting.value}
								onChange={event => setting.onChange(Number(event.target.value))}
								className='w-20 rounded-md border bg-background px-2 py-1 text-center font-mono text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
							/>
						</label>
					))}
				</div>
			</Card>

			{/* Таблица соответствий — тихий список под инструментом, а не вторая
			    карточка с заголовком и кнопкой «показать». */}
			<div className='mt-6'>
				<p className='px-1 text-sm text-muted-foreground'>
					Частые значения при базовом шрифте {converter.config.baseFontSize}px
				</p>
				<div className='mt-2 overflow-x-auto rounded-xl border'>
					<table className='w-full text-sm'>
						<thead>
							<tr className='border-b text-left text-muted-foreground'>
								<th className='px-4 py-2 font-medium'>px</th>
								<th className='px-4 py-2 font-medium'>rem</th>
								<th className='px-4 py-2 font-medium'>em</th>
								<th className='px-4 py-2 font-medium'>%</th>
							</tr>
						</thead>
						<tbody className='font-mono'>
							{TABLE_ROWS.map(px => {
								const rem = px / converter.config.baseFontSize
								const em = px / converter.config.parentFontSize
								return (
									<tr key={px} className='border-b last:border-0'>
										<td className='px-4 py-2'>{px}</td>
										<td className='px-4 py-2 text-muted-foreground'>
											{converter.formatValue(rem)}
										</td>
										<td className='px-4 py-2 text-muted-foreground'>
											{converter.formatValue(em)}
										</td>
										<td className='px-4 py-2 text-muted-foreground'>
											{converter.formatValue(em * 100)}
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			</div>

			<ToolScreenshot slug='px-rem-converter' />
			<RemGuide />
		</WidgetSEOWrapper>
	)
}

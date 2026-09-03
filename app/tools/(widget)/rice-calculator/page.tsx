'use client'

import { useMemo, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolToggleOption,
	toolToggleTrack
} from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'
import { RiceCalculatorSeo } from './RiceCalculatorSeo'

type Mode = 'rice' | 'ice'

const IMPACT_OPTIONS: [number, string][] = [
	[3, 'Огромное — 3'],
	[2, 'Большое — 2'],
	[1, 'Среднее — 1'],
	[0.5, 'Малое — 0,5'],
	[0.25, 'Минимальное — 0,25']
]

function toNumber(value: string): number | null {
	const parsed = parseFloat(value.replace(/\s/g, '').replace(',', '.'))
	return Number.isFinite(parsed) ? parsed : null
}

function fmt(value: number, digits = 1): string {
	return value.toLocaleString('ru-RU', { maximumFractionDigits: digits })
}

const inputClass =
	'w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'

export default function RiceCalculatorPage() {
	const widget = getWidgetById('rice-calculator')!

	const [mode, setMode] = useState<Mode>('rice')

	const [reach, setReach] = useState('2000')
	const [impact, setImpact] = useState('2')
	const [confidence, setConfidence] = useState('80')
	const [effort, setEffort] = useState('3')

	const [iceImpact, setIceImpact] = useState('7')
	const [iceConfidence, setIceConfidence] = useState('6')
	const [iceEase, setIceEase] = useState('8')

	const [copied, setCopied] = useState(false)

	const result = useMemo(() => {
		if (mode === 'rice') {
			const r = toNumber(reach)
			const i = toNumber(impact)
			const c = toNumber(confidence)
			const e = toNumber(effort)
			if (r === null || i === null || c === null || e === null || e <= 0)
				return null
			return (r * i * (c / 100)) / e
		}
		const i = toNumber(iceImpact)
		const c = toNumber(iceConfidence)
		const e = toNumber(iceEase)
		if (i === null || c === null || e === null) return null
		return i * c * e
	}, [
		mode,
		reach,
		impact,
		confidence,
		effort,
		iceImpact,
		iceConfidence,
		iceEase
	])

	const summary =
		result !== null ? `${mode.toUpperCase()}-балл: ${fmt(result)}` : ''

	const copy = async () => {
		if (!summary) return
		await navigator.clipboard.writeText(summary)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<div className={toolToggleTrack}>
						{(
							[
								['rice', 'RICE'],
								['ice', 'ICE']
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
					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={copy}
							disabled={!summary}
							title='Скопировать результат'
							className={toolIconButton}
						>
							{copied ? (
								<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
							) : (
								<Copy className='h-4 w-4' />
							)}
						</Button>
					</div>
				</div>

				{mode === 'rice' ? (
					<div className='grid gap-4 border-b px-5 py-6 sm:grid-cols-2 sm:px-6'>
						<label className='block'>
							<span className='mb-1.5 block text-sm text-muted-foreground'>
								Reach — охват за период, людей
							</span>
							<input
								type='text'
								inputMode='decimal'
								value={reach}
								onChange={e => setReach(e.target.value)}
								aria-label='Reach'
								className={inputClass}
							/>
						</label>
						<label className='block'>
							<span className='mb-1.5 block text-sm text-muted-foreground'>
								Impact — сила эффекта
							</span>
							<select
								value={impact}
								onChange={e => setImpact(e.target.value)}
								aria-label='Impact'
								className={inputClass}
							>
								{IMPACT_OPTIONS.map(([v, l]) => (
									<option key={v} value={v}>
										{l}
									</option>
								))}
							</select>
						</label>
						<label className='block'>
							<span className='mb-1.5 block text-sm text-muted-foreground'>
								Confidence — уверенность, %
							</span>
							<input
								type='text'
								inputMode='decimal'
								value={confidence}
								onChange={e => setConfidence(e.target.value)}
								aria-label='Confidence'
								className={inputClass}
							/>
						</label>
						<label className='block'>
							<span className='mb-1.5 block text-sm text-muted-foreground'>
								Effort — трудозатраты, человеко-месяцев
							</span>
							<input
								type='text'
								inputMode='decimal'
								value={effort}
								onChange={e => setEffort(e.target.value)}
								aria-label='Effort'
								className={inputClass}
							/>
						</label>
					</div>
				) : (
					<div className='grid gap-4 border-b px-5 py-6 sm:grid-cols-3 sm:px-6'>
						{[
							['Impact — эффект, 1–10', iceImpact, setIceImpact, 'Impact'],
							[
								'Confidence — уверенность, 1–10',
								iceConfidence,
								setIceConfidence,
								'Confidence'
							],
							['Ease — простота, 1–10', iceEase, setIceEase, 'Ease']
						].map(([label, value, setter, aria]) => (
							<label key={label as string} className='block'>
								<span className='mb-1.5 block text-sm text-muted-foreground'>
									{label as string}
								</span>
								<input
									type='text'
									inputMode='decimal'
									value={value as string}
									onChange={e =>
										(setter as (v: string) => void)(e.target.value)
									}
									aria-label={aria as string}
									className={inputClass}
								/>
							</label>
						))}
					</div>
				)}

				{result !== null ? (
					<div className='px-5 py-8 text-center sm:px-6'>
						<span className='block font-mono text-5xl font-bold tracking-tight text-foreground sm:text-6xl'>
							{fmt(result)}
						</span>
						<span className='mt-1 block text-sm text-muted-foreground'>
							{mode.toUpperCase()}-балл · сравнивайте с другими задачами по той
							же шкале
						</span>
					</div>
				) : (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						Заполните все поля
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						{mode === 'rice'
							? 'RICE = Reach × Impact × Confidence ÷ Effort'
							: 'ICE = Impact × Confidence × Ease'}{' '}
						· абсолютное значение балла смысла не несёт, важен порядок
					</span>
				</div>
			</Card>

			<ToolScreenshot slug='rice-calculator' />
			<RiceCalculatorSeo />
		</WidgetSEOWrapper>
	)
}

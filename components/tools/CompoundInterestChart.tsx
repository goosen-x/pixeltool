'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig
} from '@/components/ui/chart'
import type { MonthRow } from '@/lib/utils/compound-interest'

/**
 * Цвета проверены валидатором палитры в обеих темах: на светлом фоне
 * (#ffffff) и на фоне карточки в тёмной (#131a25). Худшая пара по
 * дальтонизму — ΔE 23.1 в светлой и 19.6 в тёмной при пороге 8, для
 * обычного зрения 24.0 и 20.9 при пороге 15.
 *
 * У аквы контраст к белому 2.82:1, ниже порога 3:1 — валидатор требует за
 * это «подпорку»: подписи и табличное представление. И то и другое здесь
 * есть: легенда с названиями рядов, всплывающая подсказка с числами и
 * таблица под графиком, где те же данные лежат текстом.
 */
const chartConfig = {
	totalContributed: {
		label: 'Внесено',
		theme: { light: '#2a78d6', dark: '#3987e5' }
	},
	totalInterest: {
		label: 'Начислено процентов',
		theme: { light: '#1baf7a', dark: '#199e70' }
	}
} satisfies ChartConfig

interface CompoundInterestChartProps {
	months: MonthRow[]
}

function formatAxisMoney(value: number): string {
	if (value >= 1_000_000) {
		return `${(value / 1_000_000).toLocaleString('ru-RU', { maximumFractionDigits: 1 })} млн`
	}
	if (value >= 1_000) {
		return `${Math.round(value / 1_000)} тыс.`
	}
	return String(Math.round(value))
}

function formatMoney(value: number): string {
	return `${Math.round(value).toLocaleString('ru-RU')} ₽`
}

/**
 * Накопительные области: внесённое снизу, начисленные проценты сверху, а их
 * общая высота — сумма на счёте. Смысл именно в разделении: видно точку, где
 * доход начинает обгонять собственные взносы, ради которой сложный процент и
 * считают. Две линии рядом такого не показывают, а один общий график роста
 * не отвечает на вопрос «сколько тут моего, а сколько наросло».
 */
export function CompoundInterestChart({ months }: CompoundInterestChartProps) {
	// Год для подписи оси: у долгих сроков подпись на каждый месяц
	// превратилась бы в сплошную линию из цифр.
	const yearTicks = months
		.filter(row => row.month % 12 === 0)
		.map(row => row.month)

	return (
		<ChartContainer
			config={chartConfig}
			className='aspect-auto h-64 w-full sm:h-80'
		>
			<AreaChart data={months} margin={{ left: 4, right: 8, top: 8 }}>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey='month'
					ticks={yearTicks.length > 1 ? yearTicks : undefined}
					tickFormatter={month => `${Math.round(month / 12)} г.`}
					tickLine={false}
					axisLine={false}
					tickMargin={8}
					minTickGap={16}
				/>
				<YAxis
					tickFormatter={formatAxisMoney}
					tickLine={false}
					axisLine={false}
					tickMargin={8}
					width={80}
				/>
				<ChartTooltip
					content={
						<ChartTooltipContent
							/*
							 * Номер месяца берём из самой точки данных, а не из
							 * первого аргумента: обёртка подставляет туда подпись
							 * ряда из config, и в заголовке оказывалось «Месяц
							 * Внесено». Заодно выносим сюда итог — сумму на счёте,
							 * ради которой график и смотрят; по двум слагаемым
							 * ниже её пришлось бы складывать в уме.
							 */
							labelFormatter={(_, payload) => {
								const row = payload?.[0]?.payload as MonthRow | undefined
								if (!row) return null
								return `Месяц ${row.month} · на счёте ${formatMoney(row.balance)}`
							}}
							formatter={(value, name) => (
								<>
									<span className='text-muted-foreground'>
										{chartConfig[name as keyof typeof chartConfig]?.label ??
											name}
									</span>
									<span className='ml-auto font-mono font-medium tabular-nums text-foreground'>
										{formatMoney(Number(value))}
									</span>
								</>
							)}
						/>
					}
				/>
				<Area
					dataKey='totalContributed'
					type='monotone'
					stackId='balance'
					fill='var(--color-totalContributed)'
					fillOpacity={0.35}
					stroke='var(--color-totalContributed)'
					strokeWidth={2}
				/>
				<Area
					dataKey='totalInterest'
					type='monotone'
					stackId='balance'
					fill='var(--color-totalInterest)'
					fillOpacity={0.35}
					stroke='var(--color-totalInterest)'
					strokeWidth={2}
				/>
				<ChartLegend content={<ChartLegendContent />} />
			</AreaChart>
		</ChartContainer>
	)
}

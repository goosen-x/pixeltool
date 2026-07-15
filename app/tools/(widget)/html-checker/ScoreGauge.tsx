'use client'

import {
	PolarAngleAxis,
	RadialBar,
	RadialBarChart,
	ResponsiveContainer
} from 'recharts'

/** Цвет датчика по баллу — те же пороги, что у чисел категорий. */
function color(score: number): string {
	if (score >= 90) return 'hsl(142 71% 45%)' // green-600
	if (score >= 60) return 'hsl(38 92% 50%)' // amber-600
	return 'hsl(0 72% 51%)' // red-600
}

/**
 * Полукруглый датчик общего балла. recharts: PolarAngleAxis с доменом 0–100
 * превращает значение в угол дуги, background рисует серый жёлоб под ней.
 */
export function ScoreGauge({ score }: { score: number }) {
	return (
		<div className='relative h-40 w-full'>
			<ResponsiveContainer width='100%' height='100%'>
				<RadialBarChart
					data={[{ value: score, fill: color(score) }]}
					startAngle={180}
					endAngle={0}
					innerRadius='80%'
					outerRadius='140%'
					cy='75%'
				>
					<PolarAngleAxis
						type='number'
						domain={[0, 100]}
						angleAxisId={0}
						tick={false}
					/>
					<RadialBar
						dataKey='value'
						background={{ fill: 'hsl(var(--muted))' }}
						cornerRadius={999}
					/>
				</RadialBarChart>
			</ResponsiveContainer>

			<div className='absolute inset-x-0 bottom-2 flex flex-col items-center'>
				<span
					className='text-4xl font-bold'
					style={{ color: color(score) }}
				>
					{score}
				</span>
				<span className='text-xs text-muted-foreground'>из 100</span>
			</div>
		</div>
	)
}

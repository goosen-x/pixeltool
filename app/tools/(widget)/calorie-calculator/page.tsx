'use client'

import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import {
	toolBar,
	toolFooterBar,
	toolPill,
	toolToggleOption,
	toolToggleTrack
} from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { CalorieCalculatorSeo } from './CalorieCalculatorSeo'

type Gender = 'male' | 'female'
type Activity = 'minimal' | 'low' | 'medium' | 'high' | 'veryHigh'
type Goal = 'lose' | 'maintain' | 'gain'

const ACTIVITY_LABELS: Record<Activity, string> = {
	minimal: 'Минимальная',
	low: 'Низкая',
	medium: 'Средняя',
	high: 'Высокая',
	veryHigh: 'Очень высокая'
}

// Стандартные коэффициенты активности для формулы Миффлина-Сан Жеора.
const ACTIVITY_FACTORS: Record<Activity, number> = {
	minimal: 1.2,
	low: 1.375,
	medium: 1.55,
	high: 1.725,
	veryHigh: 1.9
}

const GOAL_LABELS: Record<Goal, string> = {
	lose: 'Похудение',
	maintain: 'Поддержание',
	gain: 'Набор массы'
}

// ±15% от поддерживающей нормы — стандартный, не агрессивный дефицит/профицит.
const GOAL_ADJUSTMENT: Record<Goal, number> = {
	lose: 0.85,
	maintain: 1,
	gain: 1.15
}

interface Macros {
	protein: number
	fat: number
	carbs: number
}

// 30% калорий из белка, 30% из жира, остаток — углеводы. Стандартное
// распределение для универсального (не специализированного под спорт) расчёта.
function macrosFromCalories(calories: number): Macros {
	const proteinCalories = calories * 0.3
	const fatCalories = calories * 0.3
	const carbsCalories = calories - proteinCalories - fatCalories

	return {
		protein: proteinCalories / 4,
		fat: fatCalories / 9,
		carbs: carbsCalories / 4
	}
}

export default function CalorieCalculatorPage() {
	const widget = getWidgetById('calorie-calculator')!

	const [gender, setGender] = useState<Gender>('male')
	const [weight, setWeight] = useState('70')
	const [height, setHeight] = useState('175')
	const [age, setAge] = useState('30')
	const [activity, setActivity] = useState<Activity>('medium')
	const [goal, setGoal] = useState<Goal>('maintain')

	const result = useMemo(() => {
		const w = parseFloat(weight.replace(',', '.'))
		const h = parseFloat(height.replace(',', '.'))
		const a = parseFloat(age.replace(',', '.'))
		if (!w || !h || !a || w <= 0 || h <= 0 || a <= 0) return null

		const bmr =
			gender === 'male'
				? 10 * w + 6.25 * h - 5 * a + 5
				: 10 * w + 6.25 * h - 5 * a - 161

		const maintenance = bmr * ACTIVITY_FACTORS[activity]
		const calories = maintenance * GOAL_ADJUSTMENT[goal]

		return { calories, macros: macrosFromCalories(calories) }
	}, [gender, weight, height, age, activity, goal])

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<span className='text-sm text-muted-foreground'>Пол</span>
					<div className={toolToggleTrack}>
						<button
							type='button'
							onClick={() => setGender('male')}
							className={toolToggleOption(gender === 'male')}
						>
							Мужской
						</button>
						<button
							type='button'
							onClick={() => setGender('female')}
							className={toolToggleOption(gender === 'female')}
						>
							Женский
						</button>
					</div>
				</div>

				<div className='grid gap-4 border-b px-5 py-6 sm:grid-cols-3 sm:px-6'>
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Вес, кг
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={weight}
							onChange={event => setWeight(event.target.value)}
							aria-label='Вес в килограммах'
							className='w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						/>
					</label>

					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Рост, см
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={height}
							onChange={event => setHeight(event.target.value)}
							aria-label='Рост в сантиметрах'
							className='w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						/>
					</label>

					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Возраст, лет
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={age}
							onChange={event => setAge(event.target.value)}
							aria-label='Возраст в годах'
							className='w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						/>
					</label>
				</div>

				<div className='flex flex-wrap items-center gap-x-6 gap-y-3 border-b px-5 py-4 sm:px-6'>
					<span className='text-sm text-muted-foreground'>Активность</span>
					<div className='flex flex-wrap gap-2'>
						{(Object.keys(ACTIVITY_LABELS) as Activity[]).map(key => (
							<button
								key={key}
								type='button'
								onClick={() => setActivity(key)}
								className={toolPill(activity === key)}
							>
								{ACTIVITY_LABELS[key]}
							</button>
						))}
					</div>
				</div>

				<div className='flex flex-wrap items-center gap-x-6 gap-y-3 border-b px-5 py-4 sm:px-6'>
					<span className='text-sm text-muted-foreground'>Цель</span>
					<div className='flex flex-wrap gap-2'>
						{(Object.keys(GOAL_LABELS) as Goal[]).map(key => (
							<button
								key={key}
								type='button'
								onClick={() => setGoal(key)}
								className={toolPill(goal === key)}
							>
								{GOAL_LABELS[key]}
							</button>
						))}
					</div>
				</div>

				{result ? (
					<>
						<div className='px-5 py-8 text-center sm:px-6'>
							<span className='block font-mono text-5xl font-bold tracking-tight text-foreground sm:text-6xl'>
								{Math.round(result.calories)}
							</span>
							<span className='mt-2 block text-base font-medium text-muted-foreground'>
								ккал/день
							</span>
						</div>

						<div className='grid grid-cols-3 gap-4 border-t px-5 py-6 text-center sm:px-6'>
							<div>
								<span className='block font-mono text-2xl font-semibold text-foreground'>
									{Math.round(result.macros.protein)} г
								</span>
								<span className='mt-1 block text-sm text-muted-foreground'>
									Белки
								</span>
							</div>
							<div>
								<span className='block font-mono text-2xl font-semibold text-foreground'>
									{Math.round(result.macros.fat)} г
								</span>
								<span className='mt-1 block text-sm text-muted-foreground'>
									Жиры
								</span>
							</div>
							<div>
								<span className='block font-mono text-2xl font-semibold text-foreground'>
									{Math.round(result.macros.carbs)} г
								</span>
								<span className='mt-1 block text-sm text-muted-foreground'>
									Углеводы
								</span>
							</div>
						</div>
					</>
				) : (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						Укажите вес, рост и возраст
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						Формула Миффлина-Сан Жеора — ориентир, не медицинское назначение
					</span>
				</div>
			</Card>

			<CalorieCalculatorSeo />
		</WidgetSEOWrapper>
	)
}

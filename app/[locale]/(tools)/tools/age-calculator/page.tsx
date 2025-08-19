'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
	Calendar as CalendarIcon,
	Clock,
	Gift,
	Copy,
	RefreshCw,
	Heart,
	Star,
	Cake
} from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { ru, enUS } from 'date-fns/locale'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { WidgetLayout } from '@/components/widgets/WidgetLayout'
import { WidgetSection } from '@/components/widgets/WidgetSection'
import { KeyboardShortcutInfo } from '@/components/widgets'
import { WidgetInput } from '@/components/widgets/WidgetInput'
import { WidgetOutput } from '@/components/widgets/WidgetOutput'
import { useTranslations, useLocale } from 'next-intl'

interface AgeData {
	years: number
	months: number
	days: number
	totalDays: number
	totalWeeks: number
	totalHours: number
	totalMinutes: number
	totalSeconds: number
	nextBirthday: {
		date: Date
		daysUntil: number
		dayOfWeek: string
	}
	zodiacSign: string
	chineseZodiac: string
	lifeStage: string
}

const ZODIAC_SIGNS = [
	{ name: 'Козерог', start: '12-22', end: '01-19' },
	{ name: 'Водолей', start: '01-20', end: '02-18' },
	{ name: 'Рыбы', start: '02-19', end: '03-20' },
	{ name: 'Овен', start: '03-21', end: '04-19' },
	{ name: 'Телец', start: '04-20', end: '05-20' },
	{ name: 'Близнецы', start: '05-21', end: '06-20' },
	{ name: 'Рак', start: '06-21', end: '07-22' },
	{ name: 'Лев', start: '07-23', end: '08-22' },
	{ name: 'Дева', start: '08-23', end: '09-22' },
	{ name: 'Весы', start: '09-23', end: '10-22' },
	{ name: 'Скорпион', start: '10-23', end: '11-21' },
	{ name: 'Стрелец', start: '11-22', end: '12-21' }
]

const CHINESE_ZODIAC = [
	'Крыса',
	'Бык',
	'Тигр',
	'Кролик',
	'Дракон',
	'Змея',
	'Лошадь',
	'Коза',
	'Обезьяна',
	'Петух',
	'Собака',
	'Свинья'
]

const LIFE_STAGES = [
	{ name: 'Младенец', min: 0, max: 1 },
	{ name: 'Малыш', min: 1, max: 3 },
	{ name: 'Дошкольник', min: 3, max: 6 },
	{ name: 'Школьник', min: 6, max: 12 },
	{ name: 'Подросток', min: 12, max: 18 },
	{ name: 'Молодой взрослый', min: 18, max: 30 },
	{ name: 'Взрослый', min: 30, max: 50 },
	{ name: 'Средний возраст', min: 50, max: 65 },
	{ name: 'Пожилой', min: 65, max: 80 },
	{ name: 'Преклонный возраст', min: 80, max: 150 }
]

const DAY_NAMES = [
	'Воскресенье',
	'Понедельник',
	'Вторник',
	'Среда',
	'Четверг',
	'Пятница',
	'Суббота'
]

export default function AgeCalculatorPage() {
	const t = useTranslations('widgets.ageCalculator')
	const locale = useLocale()
	const [birthDate, setBirthDate] = useState<Date | undefined>()
	const [ageData, setAgeData] = useState<AgeData | null>(null)
	const [isCalculating, setIsCalculating] = useState(false)
	const [isCalendarOpen, setIsCalendarOpen] = useState(false)

	const getZodiacSign = useCallback((date: Date): string => {
		const month = date.getMonth() + 1
		const day = date.getDate()
		const dateStr = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`

		for (const sign of ZODIAC_SIGNS) {
			const [startMonth, startDay] = sign.start.split('-').map(Number)
			const [endMonth, endDay] = sign.end.split('-').map(Number)

			if (startMonth === endMonth) {
				if (month === startMonth && day >= startDay && day <= endDay) {
					return sign.name
				}
			} else {
				if (
					(month === startMonth && day >= startDay) ||
					(month === endMonth && day <= endDay)
				) {
					return sign.name
				}
			}
		}

		return ZODIAC_SIGNS[0].name // Козерог как fallback
	}, [])

	const getChineseZodiac = useCallback((year: number): string => {
		const baseYear = 1900 // Год крысы
		const index = (year - baseYear) % 12
		return CHINESE_ZODIAC[index]
	}, [])

	const getLifeStage = useCallback((age: number): string => {
		const stage = LIFE_STAGES.find(s => age >= s.min && age < s.max)
		return stage ? stage.name : 'Неопределенный возраст'
	}, [])

	const calculateAge = useCallback(
		(birthDate: Date): AgeData => {
			const now = new Date()
			const birth = new Date(birthDate)

			// Проверка на будущую дату
			if (birth > now) {
				throw new Error('Дата рождения не может быть в будущем')
			}

			// Расчет возраста
			let years = now.getFullYear() - birth.getFullYear()
			let months = now.getMonth() - birth.getMonth()
			let days = now.getDate() - birth.getDate()

			if (days < 0) {
				months--
				const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
				days += lastMonth.getDate()
			}

			if (months < 0) {
				years--
				months += 12
			}

			// Общие данные
			const totalDays = Math.floor(
				(now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)
			)
			const totalWeeks = Math.floor(totalDays / 7)
			const totalHours = totalDays * 24
			const totalMinutes = totalHours * 60
			const totalSeconds = totalMinutes * 60

			// Следующий день рождения
			const nextBirthYear = now.getFullYear()
			let nextBirthday = new Date(
				nextBirthYear,
				birth.getMonth(),
				birth.getDate()
			)

			if (nextBirthday < now) {
				nextBirthday = new Date(
					nextBirthYear + 1,
					birth.getMonth(),
					birth.getDate()
				)
			}

			const daysUntilBirthday = Math.ceil(
				(nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
			)
			const dayOfWeek = DAY_NAMES[nextBirthday.getDay()]

			return {
				years,
				months,
				days,
				totalDays,
				totalWeeks,
				totalHours,
				totalMinutes,
				totalSeconds,
				nextBirthday: {
					date: nextBirthday,
					daysUntil: daysUntilBirthday,
					dayOfWeek
				},
				zodiacSign: getZodiacSign(birth),
				chineseZodiac: getChineseZodiac(birth.getFullYear()),
				lifeStage: getLifeStage(years)
			}
		},
		[getZodiacSign, getChineseZodiac, getLifeStage]
	)

	const formatAgeText = useCallback((data: AgeData): string => {
		return `Мне ${data.years} лет, ${data.months} месяцев и ${data.days} дней
Всего дней прожито: ${data.totalDays.toLocaleString()}
До следующего дня рождения: ${data.nextBirthday.daysUntil} дней
Знак зодиака: ${data.zodiacSign}
Китайский гороскоп: ${data.chineseZodiac}`
	}, [])

	const handleCalculate = useCallback(() => {
		if (!birthDate) {
			toast.error(t('validation.dateRequired'))
			return
		}

		setIsCalculating(true)

		setTimeout(() => {
			try {
				const result = calculateAge(birthDate)
				setAgeData(result)
				toast.success(t('toast.calculated'))
			} catch (error) {
				toast.error(
					error instanceof Error ? error.message : t('toast.calculationError')
				)
				setAgeData(null)
			} finally {
				setIsCalculating(false)
			}
		}, 300)
	}, [birthDate, t, calculateAge])

	const copyToClipboard = useCallback(
		(text: string) => {
			navigator.clipboard.writeText(text)
			toast.success(t('toast.copied'))
		},
		[t]
	)

	const reset = useCallback(() => {
		setBirthDate(undefined)
		setAgeData(null)
		toast.success(t('toast.reset'))
	}, [t])

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			// Ctrl/Cmd + Enter to calculate
			if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
				e.preventDefault()
				handleCalculate()
			}
			// Ctrl/Cmd + R to reset
			if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
				e.preventDefault()
				reset()
			}
			// Ctrl/Cmd + Shift + C to copy results
			if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
				e.preventDefault()
				if (ageData) {
					copyToClipboard(formatAgeText(ageData))
				}
			}
		}

		window.addEventListener('keydown', handleKeyPress)
		return () => window.removeEventListener('keydown', handleKeyPress)
	}, [ageData, copyToClipboard, handleCalculate, reset, formatAgeText])

	const formatNumber = useCallback((num: number): string => {
		return num.toLocaleString('ru-RU')
	}, [])

	// Автоматический расчет при изменении даты
	useEffect(() => {
		if (birthDate) {
			const timer = setTimeout(() => {
				handleCalculate()
			}, 500)
			return () => clearTimeout(timer)
		} else {
			setAgeData(null)
		}
	}, [birthDate, handleCalculate])

	return (
		<WidgetLayout>
			{/* Input Section */}
			<WidgetSection title={t('sections.input')}>
				<div className='grid md:grid-cols-2 gap-6 items-end'>
					<WidgetInput
						label={t('inputs.birthDate.label')}
						description={t('inputs.birthDate.description')}
					>
						<Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
							<PopoverTrigger asChild>
								<Button
									variant='outline'
									className={cn(
										'w-full justify-start text-left font-normal',
										!birthDate && 'text-muted-foreground'
									)}
								>
									<CalendarIcon className='mr-2 h-4 w-4' />
									{birthDate ? (
										format(birthDate, 'PPP', {
											locale: locale === 'ru' ? ru : enUS
										})
									) : (
										<span>{t('inputs.birthDate.placeholder')}</span>
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent className='w-auto p-0' align='start'>
								<Calendar
									mode='single'
									selected={birthDate}
									onSelect={date => {
										setBirthDate(date)
										setIsCalendarOpen(false)
									}}
									disabled={date =>
										date > new Date() || date < new Date('1900-01-01')
									}
									initialFocus
									locale={locale === 'ru' ? ru : enUS}
									captionLayout='dropdown'
									fromYear={1900}
									toYear={new Date().getFullYear()}
								/>
							</PopoverContent>
						</Popover>
					</WidgetInput>

					<div className='flex gap-2'>
						<Button
							onClick={handleCalculate}
							disabled={isCalculating || !birthDate}
							className='flex items-center gap-2'
						>
							{isCalculating ? (
								<>
									<RefreshCw className='w-4 h-4 animate-spin' />
									{t('actions.calculating')}
								</>
							) : (
								<>
									<Calendar className='w-4 h-4' />
									{t('actions.calculate')}
								</>
							)}
						</Button>

						<Button onClick={reset} variant='outline' size='icon'>
							<RefreshCw className='w-4 h-4' />
						</Button>
					</div>
				</div>
			</WidgetSection>

			{/* Results */}
			{ageData && (
				<WidgetSection title={t('sections.results')}>
					<WidgetOutput>
						<div className='grid lg:grid-cols-2 gap-6'>
							{/* Main Age Info */}
							<div className='space-y-4'>
								<div className='text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border'>
									<div className='text-4xl font-bold text-blue-600 dark:text-blue-400'>
										{ageData.years}
									</div>
									<div className='text-sm text-muted-foreground mt-1'>
										{t('timeUnits.years', { count: ageData.years })}
									</div>

									<div className='flex justify-center gap-6 mt-4 text-sm'>
										<div className='text-center'>
											<div className='font-semibold'>{ageData.months}</div>
											<div className='text-muted-foreground'>
												{t('timeUnits.months')}
											</div>
										</div>
										<div className='text-center'>
											<div className='font-semibold'>{ageData.days}</div>
											<div className='text-muted-foreground'>
												{t('timeUnits.days')}
											</div>
										</div>
									</div>
								</div>

								<div className='grid grid-cols-2 gap-4'>
									<div className='text-center p-4 bg-muted/30 rounded-lg'>
										<div className='text-lg font-bold text-blue-600'>
											{formatNumber(ageData.totalDays)}
										</div>
										<div className='text-sm text-muted-foreground'>
											{t('statistics.totalDays')}
										</div>
									</div>

									<div className='text-center p-4 bg-muted/30 rounded-lg'>
										<div className='text-lg font-bold text-purple-600'>
											{formatNumber(ageData.totalWeeks)}
										</div>
										<div className='text-sm text-muted-foreground'>
											{t('statistics.totalWeeks')}
										</div>
									</div>

									<div className='text-center p-4 bg-muted/30 rounded-lg'>
										<div className='text-lg font-bold text-green-600'>
											{formatNumber(ageData.totalHours)}
										</div>
										<div className='text-sm text-muted-foreground'>
											{t('statistics.totalHours')}
										</div>
									</div>

									<div className='text-center p-4 bg-muted/30 rounded-lg'>
										<div className='text-lg font-bold text-blue-600'>
											{formatNumber(ageData.totalMinutes)}
										</div>
										<div className='text-sm text-muted-foreground'>
											{t('statistics.totalMinutes')}
										</div>
									</div>
								</div>
							</div>

							{/* Additional Info */}
							<div className='space-y-4'>
								{/* Next Birthday */}
								<div className='p-4 bg-gradient-to-r from-pink-50 to-red-50 dark:from-pink-950/20 dark:to-red-950/20 rounded-lg border'>
									<div className='flex items-center gap-2 mb-2'>
										<Cake className='w-4 h-4 text-pink-500' />
										<span className='font-medium'>
											{t('additionalInfo.nextBirthday')}
										</span>
									</div>
									<div className='text-lg font-bold text-pink-600 dark:text-pink-400'>
										{ageData.nextBirthday.daysUntil === 0
											? t('birthdayStatus.today')
											: ageData.nextBirthday.daysUntil === 1
												? t('birthdayStatus.tomorrow')
												: t('birthdayStatus.inDays', {
														days: ageData.nextBirthday.daysUntil
													})}
									</div>
									<div className='text-sm text-muted-foreground'>
										{ageData.nextBirthday.date.toLocaleDateString('ru-RU')} (
										{ageData.nextBirthday.dayOfWeek})
									</div>
								</div>

								{/* Life Stage */}
								<div className='p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg border'>
									<div className='flex items-center gap-2 mb-2'>
										<Heart className='w-4 h-4 text-green-500' />
										<span className='font-medium'>
											{t('additionalInfo.lifeStage')}
										</span>
									</div>
									<div className='text-lg font-bold text-green-600 dark:text-green-400'>
										{ageData.lifeStage}
									</div>
								</div>

								{/* Zodiac Signs */}
								<div className='grid grid-cols-1 gap-3'>
									<div className='p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-lg border'>
										<div className='font-medium text-purple-700 dark:text-purple-300 mb-1'>
											{t('additionalInfo.zodiacSign')}
										</div>
										<div className='text-lg font-bold text-purple-600 dark:text-purple-400'>
											{ageData.zodiacSign}
										</div>
									</div>

									<div className='p-4 bg-gradient-to-r from-amber-50 to-blue-50 dark:from-amber-950/20 dark:to-blue-950/20 rounded-lg border'>
										<div className='font-medium text-amber-700 dark:text-amber-300 mb-1'>
											{t('additionalInfo.chineseZodiac')}
										</div>
										<div className='text-lg font-bold text-amber-600 dark:text-amber-400'>
											{t('chineseZodiacPrefix')} {ageData.chineseZodiac}
										</div>
									</div>
								</div>
							</div>
						</div>
					</WidgetOutput>
				</WidgetSection>
			)}

			{/* Empty State */}
			{!ageData && !isCalculating && (
				<WidgetSection title={t('sections.placeholder')}>
					<div className='flex items-center justify-center h-40 text-muted-foreground'>
						<div className='text-center'>
							<Calendar className='w-12 h-12 mx-auto mb-3 opacity-50' />
							<p>{t('placeholder.enterDate')}</p>
							<p className='text-sm mt-2 opacity-75'>
								{t('placeholder.description')}
							</p>
						</div>
					</div>
				</WidgetSection>
			)}

			{/* Info */}
			<WidgetSection title={t('sections.about')}>
				<div className='grid md:grid-cols-2 gap-6 text-sm'>
					<div className='space-y-3'>
						<div>
							<h4 className='font-medium mb-1'>{t('info.whatCalculated')}</h4>
							<ul className='text-muted-foreground space-y-1'>
								<li>• {t('info.features.exactAge')}</li>
								<li>• {t('info.features.totalTime')}</li>
								<li>• {t('info.features.nextBirthday')}</li>
								<li>• {t('info.features.zodiacSigns')}</li>
							</ul>
						</div>
					</div>
					<div className='space-y-3'>
						<div>
							<h4 className='font-medium mb-1'>{t('info.interestingFacts')}</h4>
							<ul className='text-muted-foreground space-y-1'>
								<li>• {t('info.features.leapYears')}</li>
								<li>• {t('info.features.lifeStage')}</li>
								<li>• {t('info.features.dayOfWeek')}</li>
								<li>• {t('info.features.realTime')}</li>
							</ul>
						</div>
					</div>
				</div>
			</WidgetSection>

			{/* Keyboard Shortcuts */}
			<WidgetSection title='Keyboard Shortcuts'>
				<KeyboardShortcutInfo />
			</WidgetSection>
		</WidgetLayout>
	)
}

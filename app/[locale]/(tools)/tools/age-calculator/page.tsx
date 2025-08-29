'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
	Calendar as CalendarIcon,
	Clock,
	Gift,
	Copy,
	RefreshCw,
	Heart,
	Star,
	Cake,
	Users,
	Sparkles,
	TrendingUp,
	Activity,
	User
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
import { KeyboardShortcutInfo } from '@/components/widgets'
import { WidgetInput } from '@/components/widgets/WidgetInput'
import { WidgetOutput } from '@/components/widgets/WidgetOutput'
import { useTranslations, useLocale } from 'next-intl'
import { useWidgetKeyboard } from '@/lib/hooks/useWidgetKeyboard'

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

const FAMOUS_PEOPLE = [
	{
		name: 'Альберт Эйнштейн',
		date: new Date('1879-03-14'),
		category: 'Ученые',
		icon: '🧪'
	},
	{
		name: 'Леонардо да Винчи',
		date: new Date('1452-04-15'),
		category: 'Художники',
		icon: '🎨'
	},
	{
		name: 'Стив Джобс',
		date: new Date('1955-02-24'),
		category: 'Предприниматели',
		icon: '💼'
	},
	{
		name: 'Мария Кюри',
		date: new Date('1867-11-07'),
		category: 'Ученые',
		icon: '⚗️'
	},
	{
		name: 'Уильям Шекспир',
		date: new Date('1564-04-23'),
		category: 'Писатели',
		icon: '📚'
	},
	{
		name: 'Нельсон Мандела',
		date: new Date('1918-07-18'),
		category: 'Политики',
		icon: '🌍'
	}
]

export default function AgeCalculatorPage() {
	const t = useTranslations('widgets.ageCalculator')
	const locale = useLocale()
	const [birthDate, setBirthDate] = useState<Date | undefined>()
	const [ageData, setAgeData] = useState<AgeData | null>(null)
	const [isCalculating, setIsCalculating] = useState(false)
	const [isCalendarOpen, setIsCalendarOpen] = useState(false)

	// Locale-specific data
	const ZODIAC_SIGNS_LOCALE =
		locale === 'ru'
			? ZODIAC_SIGNS
			: [
					{ name: 'Capricorn', start: '12-22', end: '01-19' },
					{ name: 'Aquarius', start: '01-20', end: '02-18' },
					{ name: 'Pisces', start: '02-19', end: '03-20' },
					{ name: 'Aries', start: '03-21', end: '04-19' },
					{ name: 'Taurus', start: '04-20', end: '05-20' },
					{ name: 'Gemini', start: '05-21', end: '06-20' },
					{ name: 'Cancer', start: '06-21', end: '07-22' },
					{ name: 'Leo', start: '07-23', end: '08-22' },
					{ name: 'Virgo', start: '08-23', end: '09-22' },
					{ name: 'Libra', start: '09-23', end: '10-22' },
					{ name: 'Scorpio', start: '10-23', end: '11-21' },
					{ name: 'Sagittarius', start: '11-22', end: '12-21' }
				]

	const CHINESE_ZODIAC_LOCALE =
		locale === 'ru'
			? CHINESE_ZODIAC
			: [
					'Rat',
					'Ox',
					'Tiger',
					'Rabbit',
					'Dragon',
					'Snake',
					'Horse',
					'Goat',
					'Monkey',
					'Rooster',
					'Dog',
					'Pig'
				]

	const LIFE_STAGES_LOCALE =
		locale === 'ru'
			? LIFE_STAGES
			: [
					{ name: 'Infant', min: 0, max: 1 },
					{ name: 'Toddler', min: 1, max: 3 },
					{ name: 'Preschooler', min: 3, max: 6 },
					{ name: 'School Age', min: 6, max: 12 },
					{ name: 'Teenager', min: 12, max: 18 },
					{ name: 'Young Adult', min: 18, max: 30 },
					{ name: 'Adult', min: 30, max: 50 },
					{ name: 'Middle Age', min: 50, max: 65 },
					{ name: 'Senior', min: 65, max: 80 },
					{ name: 'Elderly', min: 80, max: 150 }
				]

	const DAY_NAMES_LOCALE =
		locale === 'ru'
			? DAY_NAMES
			: [
					'Sunday',
					'Monday',
					'Tuesday',
					'Wednesday',
					'Thursday',
					'Friday',
					'Saturday'
				]

	const FAMOUS_PEOPLE_LOCALE =
		locale === 'ru'
			? FAMOUS_PEOPLE
			: [
					{
						name: 'Albert Einstein',
						date: new Date('1879-03-14'),
						category: 'Scientists',
						icon: '🧪'
					},
					{
						name: 'Leonardo da Vinci',
						date: new Date('1452-04-15'),
						category: 'Artists',
						icon: '🎨'
					},
					{
						name: 'Steve Jobs',
						date: new Date('1955-02-24'),
						category: 'Entrepreneurs',
						icon: '💼'
					},
					{
						name: 'Marie Curie',
						date: new Date('1867-11-07'),
						category: 'Scientists',
						icon: '⚗️'
					},
					{
						name: 'William Shakespeare',
						date: new Date('1564-04-23'),
						category: 'Writers',
						icon: '📚'
					},
					{
						name: 'Nelson Mandela',
						date: new Date('1918-07-18'),
						category: 'Politicians',
						icon: '🌍'
					}
				]

	const getZodiacSign = useCallback(
		(date: Date): string => {
			const month = date.getMonth() + 1
			const day = date.getDate()
			const dateStr = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`

			for (const sign of ZODIAC_SIGNS_LOCALE) {
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

			return ZODIAC_SIGNS_LOCALE[0].name // Fallback
		},
		[ZODIAC_SIGNS_LOCALE]
	)

	const getChineseZodiac = useCallback(
		(year: number): string => {
			const baseYear = 1900 // Year of the Rat
			const index = (year - baseYear) % 12
			return CHINESE_ZODIAC_LOCALE[index]
		},
		[CHINESE_ZODIAC_LOCALE]
	)

	const getLifeStage = useCallback(
		(age: number): string => {
			const stage = LIFE_STAGES_LOCALE.find(s => age >= s.min && age < s.max)
			return stage
				? stage.name
				: locale === 'ru'
					? 'Неопределенный возраст'
					: 'Undefined age'
		},
		[LIFE_STAGES_LOCALE, locale]
	)

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
			const dayOfWeek = DAY_NAMES_LOCALE[nextBirthday.getDay()]

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
		[getZodiacSign, getChineseZodiac, getLifeStage, DAY_NAMES_LOCALE]
	)

	const formatAgeText = useCallback(
		(data: AgeData): string => {
			if (locale === 'ru') {
				return `Мне ${data.years} лет, ${data.months} месяцев и ${data.days} дней
Всего дней прожито: ${data.totalDays.toLocaleString()}
До следующего дня рождения: ${data.nextBirthday.daysUntil} дней
Знак зодиака: ${data.zodiacSign}
Китайский гороскоп: ${data.chineseZodiac}`
			}
			return `I am ${data.years} years, ${data.months} months and ${data.days} days old
Total days lived: ${data.totalDays.toLocaleString()}
Days until next birthday: ${data.nextBirthday.daysUntil}
Zodiac sign: ${data.zodiacSign}
Chinese zodiac: ${data.chineseZodiac}`
		},
		[locale]
	)

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
	useWidgetKeyboard({
		widgetId: 'age-calculator',
		shortcuts: [
			{
				key: 'Enter',
				primary: true,
				description: 'Calculate',
				action: () => {
					if (birthDate) {
						setAgeData(calculateAge(birthDate))
					}
				}
			},
			{
				key: 'r',
				primary: true,
				description: 'Reset',
				action: reset
			},
			{
				key: 'c',
				alt: true,
				description: 'Copy Result',
				action: () => {
					if (ageData) {
						copyToClipboard(formatAgeText(ageData))
					}
				},
				enabled: !!ageData
			}
		]
	})

	const formatNumber = useCallback((num: number): string => {
		return num.toLocaleString('ru-RU')
	}, [])

	// Автоматический расчет при изменении даты
	useEffect(() => {
		if (birthDate) {
			const timer = setTimeout(() => {
				try {
					const result = calculateAge(birthDate)
					setAgeData(result)
				} catch (error) {
					setAgeData(null)
				}
			}, 500)
			return () => clearTimeout(timer)
		} else {
			setAgeData(null)
		}
	}, [birthDate, calculateAge])

	return (
		<div className='max-w-7xl mx-auto space-y-8'>
			{/* Hero Section with Input */}
			<Card className='relative overflow-hidden'>
				<div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5' />

				<div className='relative p-8'>
					<div className='grid lg:grid-cols-2 gap-8'>
						{/* Input Column */}
						<div className='space-y-6'>
							<div>
								<label className='text-sm font-medium mb-2 block'>
									{t('inputs.birthDate.label')}
								</label>
								<div className='flex gap-2'>
									<Popover
										open={isCalendarOpen}
										onOpenChange={setIsCalendarOpen}
									>
										<PopoverTrigger asChild>
											<Button
												variant='outline'
												className={cn(
													'flex-1 justify-start text-left font-normal h-12',
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
									{birthDate && (
										<Button
											onClick={reset}
											variant='outline'
											size='icon'
											className='h-12'
										>
											<RefreshCw className='h-4 w-4' />
										</Button>
									)}
								</div>
							</div>

							{/* Famous People Examples */}
							<div>
								<h3 className='text-sm font-medium mb-3 flex items-center gap-2'>
									<Users className='w-4 h-4' />
									{t('famousPeople.title')}
								</h3>
								<div className='grid grid-cols-2 gap-2'>
									{FAMOUS_PEOPLE_LOCALE.map((person, index) => (
										<Button
											key={index}
											variant='ghost'
											size='sm'
											className='justify-start h-auto py-2 px-3'
											onClick={() => {
												setBirthDate(person.date)
												setIsCalendarOpen(false)
											}}
										>
											<span className='text-lg mr-2'>{person.icon}</span>
											<div className='text-left'>
												<div className='text-xs font-medium'>{person.name}</div>
												<div className='text-xs text-muted-foreground'>
													{format(person.date, 'dd.MM.yyyy')}
												</div>
											</div>
										</Button>
									))}
								</div>
							</div>
						</div>

						{/* Results Column */}
						<div className='space-y-6'>
							{!ageData && !isCalculating && (
								<div className='h-full flex items-center justify-center'>
									<div className='text-center'>
										<CalendarIcon className='w-16 h-16 mx-auto mb-4 text-muted-foreground/30' />
										<p className='text-lg font-medium text-muted-foreground'>
											{t('placeholder.enterDate')}
										</p>
										<p className='text-sm text-muted-foreground/80 mt-1'>
											{t('placeholder.description')}
										</p>
									</div>
								</div>
							)}

							{ageData && (
								<div className='space-y-6'>
									{/* Main Age Display */}
									<div className='text-center'>
										<div className='inline-flex items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20'>
											<div>
												<div className='text-5xl font-bold text-primary'>
													{ageData.years}
												</div>
												<div className='text-sm text-muted-foreground mt-1'>
													{t('timeUnits.years', { count: ageData.years })}
												</div>
												<div className='flex gap-6 mt-4 text-sm'>
													<div>
														<span className='font-semibold'>
															{ageData.months}
														</span>
														<span className='text-muted-foreground ml-1'>
															{t('timeUnits.months')}
														</span>
													</div>
													<div>
														<span className='font-semibold'>
															{ageData.days}
														</span>
														<span className='text-muted-foreground ml-1'>
															{t('timeUnits.days')}
														</span>
													</div>
												</div>
											</div>
										</div>
									</div>

									{/* Stats Grid */}
									<div className='grid grid-cols-2 gap-3'>
										<Card className='p-4 text-center'>
											<div className='text-2xl font-bold text-blue-600'>
												{formatNumber(ageData.totalDays)}
											</div>
											<div className='text-xs text-muted-foreground'>
												{t('statistics.totalDays')}
											</div>
										</Card>

										<Card className='p-4 text-center'>
											<div className='text-2xl font-bold text-purple-600'>
												{formatNumber(ageData.totalWeeks)}
											</div>
											<div className='text-xs text-muted-foreground'>
												{t('statistics.totalWeeks')}
											</div>
										</Card>

										<Card className='p-4 text-center'>
											<div className='text-2xl font-bold text-green-600'>
												{formatNumber(ageData.totalHours)}
											</div>
											<div className='text-xs text-muted-foreground'>
												{t('statistics.totalHours')}
											</div>
										</Card>

										<Card className='p-4 text-center'>
											<div className='text-2xl font-bold text-orange-600'>
												{formatNumber(ageData.totalMinutes)}
											</div>
											<div className='text-xs text-muted-foreground'>
												{t('statistics.totalMinutes')}
											</div>
										</Card>
									</div>

									{/* Copy Button */}
									<Button
										onClick={() => copyToClipboard(formatAgeText(ageData))}
										variant='outline'
										className='w-full'
									>
										<Copy className='w-4 h-4 mr-2' />
										{t('actions.copy')}
									</Button>
								</div>
							)}
						</div>
					</div>
				</div>
			</Card>

			{/* Additional Info Cards */}
			{ageData && (
				<div className='grid md:grid-cols-3 gap-6'>
					{/* Next Birthday */}
					<Card className='p-6'>
						<div className='flex items-start gap-4'>
							<div className='p-3 rounded-lg bg-pink-100 dark:bg-pink-950/20'>
								<Cake className='w-6 h-6 text-pink-600' />
							</div>
							<div className='flex-1'>
								<h3 className='font-semibold mb-1'>
									{t('additionalInfo.nextBirthday')}
								</h3>
								<p className='text-2xl font-bold text-pink-600 mb-1'>
									{ageData.nextBirthday.daysUntil === 0
										? t('birthdayStatus.today')
										: ageData.nextBirthday.daysUntil === 1
											? t('birthdayStatus.tomorrow')
											: t('birthdayStatus.inDays', {
													days: ageData.nextBirthday.daysUntil
												})}
								</p>
								<p className='text-sm text-muted-foreground'>
									{format(ageData.nextBirthday.date, 'dd MMMM yyyy', {
										locale: locale === 'ru' ? ru : enUS
									})}{' '}
									({ageData.nextBirthday.dayOfWeek})
								</p>
							</div>
						</div>
					</Card>

					{/* Zodiac Sign */}
					<Card className='p-6'>
						<div className='flex items-start gap-4'>
							<div className='p-3 rounded-lg bg-purple-100 dark:bg-purple-950/20'>
								<Star className='w-6 h-6 text-purple-600' />
							</div>
							<div className='flex-1'>
								<h3 className='font-semibold mb-1'>
									{t('additionalInfo.zodiacSign')}
								</h3>
								<p className='text-2xl font-bold text-purple-600 mb-1'>
									{ageData.zodiacSign}
								</p>
								<p className='text-sm text-muted-foreground'>
									{t('additionalInfo.chineseZodiac')}: {ageData.chineseZodiac}
								</p>
							</div>
						</div>
					</Card>

					{/* Life Stage */}
					<Card className='p-6'>
						<div className='flex items-start gap-4'>
							<div className='p-3 rounded-lg bg-green-100 dark:bg-green-950/20'>
								<Heart className='w-6 h-6 text-green-600' />
							</div>
							<div className='flex-1'>
								<h3 className='font-semibold mb-1'>
									{t('additionalInfo.lifeStage')}
								</h3>
								<p className='text-2xl font-bold text-green-600 mb-1'>
									{ageData.lifeStage}
								</p>
								<p className='text-sm text-muted-foreground'>
									{t('additionalInfo.lifeStageDescription')}
								</p>
							</div>
						</div>
					</Card>
				</div>
			)}

			{/* Info Cards */}
			<div className='grid md:grid-cols-2 gap-6'>
				<Card className='p-6'>
					<div className='flex items-start gap-4'>
						<div className='p-3 rounded-lg bg-blue-100 dark:bg-blue-950/20'>
							<TrendingUp className='w-6 h-6 text-blue-600' />
						</div>
						<div>
							<h4 className='font-semibold mb-2'>{t('info.whatCalculated')}</h4>
							<ul className='text-sm text-muted-foreground space-y-1'>
								<li>• {t('info.features.exactAge')}</li>
								<li>• {t('info.features.totalTime')}</li>
								<li>• {t('info.features.nextBirthday')}</li>
								<li>• {t('info.features.zodiacSigns')}</li>
							</ul>
						</div>
					</div>
				</Card>

				<Card className='p-6'>
					<div className='flex items-start gap-4'>
						<div className='p-3 rounded-lg bg-amber-100 dark:bg-amber-950/20'>
							<Sparkles className='w-6 h-6 text-amber-600' />
						</div>
						<div>
							<h4 className='font-semibold mb-2'>
								{t('info.interestingFacts')}
							</h4>
							<ul className='text-sm text-muted-foreground space-y-1'>
								<li>• {t('info.features.leapYears')}</li>
								<li>• {t('info.features.lifeStage')}</li>
								<li>• {t('info.features.dayOfWeek')}</li>
								<li>• {t('info.features.realTime')}</li>
							</ul>
						</div>
					</div>
				</Card>
			</div>
		</div>
	)
}

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	Clock,
	Globe,
	Calendar,
	Sun,
	Moon,
	Plus,
	X,
	ArrowRight,
	MapPin,
	Sunrise,
	Sunset,
	CalendarDays,
	Timer,
	Sparkles,
	CloudMoon,
	CloudSun,
	HardDrive
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

interface Timezone {
	name: string
	offset: string
	cities: string[]
	abbr: string
}

interface CityTime {
	id: string
	city: string
	timezone: string
	time: string
	date: string
	offset: string
	isDST: boolean
	isDay: boolean
	hour: number
	minute: number
	second: number
}

interface TimeConversion {
	fromTime: string
	fromDate: string
	fromTimezone: string
	toTimezone: string
	result: {
		time: string
		date: string
		dayDifference: number
	} | null
}

const popularTimezones: Timezone[] = [
	{
		name: 'UTC',
		offset: '+00:00',
		cities: ['London (Winter)', 'Reykjavik', 'Accra'],
		abbr: 'UTC'
	},
	{
		name: 'Europe/London',
		offset: '+00:00',
		cities: ['London', 'Dublin', 'Lisbon'],
		abbr: 'GMT'
	},
	{
		name: 'Europe/Paris',
		offset: '+01:00',
		cities: ['Paris', 'Berlin', 'Rome'],
		abbr: 'CET'
	},
	{
		name: 'Europe/Moscow',
		offset: '+03:00',
		cities: ['Moscow', 'Istanbul', 'Riyadh'],
		abbr: 'MSK'
	},
	{
		name: 'Asia/Dubai',
		offset: '+04:00',
		cities: ['Dubai', 'Muscat', 'Tbilisi'],
		abbr: 'GST'
	},
	{
		name: 'Asia/Kolkata',
		offset: '+05:30',
		cities: ['Mumbai', 'Delhi', 'Bangalore'],
		abbr: 'IST'
	},
	{
		name: 'Asia/Shanghai',
		offset: '+08:00',
		cities: ['Beijing', 'Shanghai', 'Hong Kong'],
		abbr: 'CST'
	},
	{
		name: 'Asia/Tokyo',
		offset: '+09:00',
		cities: ['Tokyo', 'Seoul', 'Osaka'],
		abbr: 'JST'
	},
	{
		name: 'Australia/Sydney',
		offset: '+11:00',
		cities: ['Sydney', 'Melbourne', 'Canberra'],
		abbr: 'AEDT'
	},
	{
		name: 'Pacific/Auckland',
		offset: '+13:00',
		cities: ['Auckland', 'Wellington'],
		abbr: 'NZDT'
	},
	{
		name: 'America/New_York',
		offset: '-05:00',
		cities: ['New York', 'Toronto', 'Miami'],
		abbr: 'EST'
	},
	{
		name: 'America/Chicago',
		offset: '-06:00',
		cities: ['Chicago', 'Houston', 'Mexico City'],
		abbr: 'CST'
	},
	{
		name: 'America/Denver',
		offset: '-07:00',
		cities: ['Denver', 'Phoenix', 'Calgary'],
		abbr: 'MST'
	},
	{
		name: 'America/Los_Angeles',
		offset: '-08:00',
		cities: ['Los Angeles', 'San Francisco', 'Seattle'],
		abbr: 'PST'
	},
	{
		name: 'America/Sao_Paulo',
		offset: '-03:00',
		cities: ['São Paulo', 'Rio de Janeiro', 'Buenos Aires'],
		abbr: 'BRT'
	}
]

const allTimezones = Intl.supportedValuesOf('timeZone')

// Analog Clock Component
function AnalogClock({ hour, minute, second, size = 100 }: { hour: number; minute: number; second: number; size?: number }) {
	const hourAngle = (hour % 12) * 30 + minute * 0.5
	const minuteAngle = minute * 6 + second * 0.1
	const secondAngle = second * 6

	return (
		<svg width={size} height={size} viewBox="0 0 100 100" className="transform -rotate-90">
			{/* Clock face */}
			<circle cx="50" cy="50" r="48" fill="currentColor" className="text-background" />
			<circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2" className="text-border" />
			
			{/* Hour markers */}
			{[...Array(12)].map((_, i) => {
				const angle = i * 30
				const isMainHour = i % 3 === 0
				const length = isMainHour ? 5 : 3
				const x1 = 50 + 40 * Math.cos((angle - 90) * Math.PI / 180)
				const y1 = 50 + 40 * Math.sin((angle - 90) * Math.PI / 180)
				const x2 = 50 + (40 - length) * Math.cos((angle - 90) * Math.PI / 180)
				const y2 = 50 + (40 - length) * Math.sin((angle - 90) * Math.PI / 180)
				
				return (
					<line
						key={i}
						x1={x1}
						y1={y1}
						x2={x2}
						y2={y2}
						stroke="currentColor"
						strokeWidth={isMainHour ? 2 : 1}
						className="text-muted-foreground"
					/>
				)
			})}
			
			{/* Hour hand */}
			<line
				x1="50"
				y1="50"
				x2={50 + 25 * Math.cos((hourAngle - 90) * Math.PI / 180)}
				y2={50 + 25 * Math.sin((hourAngle - 90) * Math.PI / 180)}
				stroke="currentColor"
				strokeWidth="3"
				strokeLinecap="round"
				className="text-foreground"
			/>
			
			{/* Minute hand */}
			<line
				x1="50"
				y1="50"
				x2={50 + 35 * Math.cos((minuteAngle - 90) * Math.PI / 180)}
				y2={50 + 35 * Math.sin((minuteAngle - 90) * Math.PI / 180)}
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				className="text-foreground"
			/>
			
			{/* Second hand */}
			<line
				x1="50"
				y1="50"
				x2={50 + 38 * Math.cos((secondAngle - 90) * Math.PI / 180)}
				y2={50 + 38 * Math.sin((secondAngle - 90) * Math.PI / 180)}
				stroke="currentColor"
				strokeWidth="1"
				strokeLinecap="round"
				className="text-red-500"
			/>
			
			{/* Center dot */}
			<circle cx="50" cy="50" r="3" fill="currentColor" className="text-foreground" />
		</svg>
	)
}

export default function WorldTimePage() {
	const t = useTranslations('widgets.worldTime')
	const [mounted, setMounted] = useState(false)
	const [currentTime, setCurrentTime] = useState(new Date())
	const [selectedCities, setSelectedCities] = useState<CityTime[]>([])
	const [conversion, setConversion] = useState<TimeConversion>({
		fromTime: '',
		fromDate: '',
		fromTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		toTimezone: 'UTC',
		result: null
	})
	const [searchTerm, setSearchTerm] = useState('')
	const [activeTab, setActiveTab] = useState('clocks')

	useEffect(() => {
		setMounted(true)
		// Set default conversion time
		const now = new Date()
		setConversion(prev => ({
			...prev,
			fromTime: now.toTimeString().slice(0, 5),
			fromDate: now.toISOString().slice(0, 10)
		}))
	}, [])

	useEffect(() => {
		if (!mounted) return
		
		// Load saved cities
		const saved = localStorage.getItem('worldTimeCities')
		if (saved) {
			const cities = JSON.parse(saved)
			updateCityTimes(cities)
		} else {
			// Add default cities
			const defaultCities = [
				{ city: 'New York', timezone: 'America/New_York' },
				{ city: 'London', timezone: 'Europe/London' },
				{ city: 'Tokyo', timezone: 'Asia/Tokyo' }
			]
			defaultCities.forEach(city => addCity(city.city, city.timezone))
		}
	}, [mounted])

	useEffect(() => {
		const timer = setInterval(() => {
			const now = new Date()
			setCurrentTime(now)
			updateCityTimes(selectedCities)
		}, 1000)

		return () => clearInterval(timer)
	}, [selectedCities])

	const updateCityTimes = (cities: any[]) => {
		const updated = cities.map(city => {
			const now = new Date()
			const formatter = new Intl.DateTimeFormat('en-US', {
				timeZone: city.timezone,
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				hour12: false
			})
			const dateFormatter = new Intl.DateTimeFormat('en-US', {
				timeZone: city.timezone,
				weekday: 'short',
				month: 'short',
				day: 'numeric'
			})

			const time = formatter.format(now)
			const [hourStr, minuteStr, secondStr] = time.split(':')
			const hour = parseInt(hourStr)
			const minute = parseInt(minuteStr)
			const second = parseInt(secondStr)
			const isDay = hour >= 6 && hour < 18

			const offset = getTimezoneOffset(city.timezone)

			return {
				...city,
				time,
				date: dateFormatter.format(now),
				offset,
				isDay,
				isDST: isDaylightSavingTime(city.timezone),
				hour,
				minute,
				second
			}
		})
		setSelectedCities(updated)
	}

	const getTimezoneOffset = (timezone: string): string => {
		const now = new Date()
		const formatter = new Intl.DateTimeFormat('en-US', {
			timeZone: timezone,
			timeZoneName: 'short'
		})
		const parts = formatter.formatToParts(now)
		const offsetPart = parts.find(part => part.type === 'timeZoneName')

		// Try to extract offset from timezone data
		const date = new Date()
		const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }))
		const tzDate = new Date(
			date.toLocaleString('en-US', { timeZone: timezone })
		)
		const offset = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60)

		const sign = offset >= 0 ? '+' : '-'
		const absOffset = Math.abs(offset)
		const hours = Math.floor(absOffset)
		const minutes = (absOffset - hours) * 60

		return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
	}

	const isDaylightSavingTime = (timezone: string): boolean => {
		const now = new Date()
		const jan = new Date(now.getFullYear(), 0, 1)
		const jul = new Date(now.getFullYear(), 6, 1)

		const janOffset = getTimezoneOffset(timezone)
		const julOffset = getTimezoneOffset(timezone)

		return janOffset !== julOffset
	}

	const addCity = (cityName: string, timezone: string) => {
		if (selectedCities.some(c => c.timezone === timezone)) {
			toast.error(t('toast.alreadyAdded'))
			return
		}

		const newCity = {
			id: crypto.randomUUID(),
			city: cityName,
			timezone,
			time: '',
			date: '',
			offset: '',
			isDST: false,
			isDay: true,
			hour: 0,
			minute: 0,
			second: 0
		}

		const updated = [...selectedCities, newCity]
		updateCityTimes(updated)
		localStorage.setItem(
			'worldTimeCities',
			JSON.stringify(updated.map(c => ({ city: c.city, timezone: c.timezone })))
		)
		toast.success(t('toast.cityAdded').replace('{city}', cityName))
	}

	const removeCity = (id: string) => {
		const updated = selectedCities.filter(c => c.id !== id)
		setSelectedCities(updated)
		localStorage.setItem(
			'worldTimeCities',
			JSON.stringify(updated.map(c => ({ city: c.city, timezone: c.timezone })))
		)
	}

	const convertTime = () => {
		if (!conversion.fromTime || !conversion.fromDate) {
			toast.error(t('toast.enterTimeDate'))
			return
		}

		try {
			const fromDateTime = new Date(
				`${conversion.fromDate}T${conversion.fromTime}:00`
			)

			// Create date in source timezone
			const formatter = new Intl.DateTimeFormat('en-US', {
				timeZone: conversion.toTimezone,
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				hour12: false
			})

			const parts = formatter.formatToParts(fromDateTime)
			const getPart = (type: string) =>
				parts.find(p => p.type === type)?.value || ''

			const resultTime = `${getPart('hour')}:${getPart('minute')}`
			const resultDate = `${getPart('year')}-${getPart('month')}-${getPart('day')}`

			// Calculate day difference
			const fromDate = new Date(conversion.fromDate)
			const toDate = new Date(resultDate)
			const dayDiff = Math.round(
				(toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
			)

			setConversion(prev => ({
				...prev,
				result: {
					time: resultTime,
					date: resultDate,
					dayDifference: dayDiff
				}
			}))
		} catch (error) {
			toast.error(t('toast.invalidDateTime'))
		}
	}

	const filteredTimezones = allTimezones.filter(tz =>
		tz.toLowerCase().includes(searchTerm.toLowerCase())
	)

	if (!mounted) {
		return null
	}

	return (
		<div className='max-w-6xl mx-auto space-y-8'>
			{/* Hero Section with Local Time */}
			<Card className='relative overflow-hidden'>
				<div className='absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent' />
				<CardContent className='relative p-8'>
					<div className='flex items-center justify-between'>
						<div>
							<h3 className='text-xl font-semibold mb-3 flex items-center gap-2'>
								<MapPin className='w-5 h-5' />
								{t('localTime')}
							</h3>
							<div className='flex items-center gap-6'>
								<div className='text-5xl font-mono font-bold tracking-tight'>
									{currentTime.toLocaleTimeString('en-US', { hour12: false })}
								</div>
								<AnalogClock 
									hour={currentTime.getHours()} 
									minute={currentTime.getMinutes()} 
									second={currentTime.getSeconds()} 
									size={120}
								/>
							</div>
							<div className='flex items-center gap-4 mt-4'>
								<Badge variant='secondary' className='px-3 py-1'>
									<Globe className='w-3 h-3 mr-1' />
									{Intl.DateTimeFormat().resolvedOptions().timeZone}
								</Badge>
								<p className='text-sm text-muted-foreground'>
									{currentTime.toLocaleDateString('en-US', {
										weekday: 'long',
										year: 'numeric',
										month: 'long',
										day: 'numeric'
									})}
								</p>
							</div>
						</div>
						<div className='hidden lg:block'>
							{currentTime.getHours() >= 6 && currentTime.getHours() < 18 ? (
								<CloudSun className='w-24 h-24 text-yellow-500 opacity-20' />
							) : (
								<CloudMoon className='w-24 h-24 text-blue-500 opacity-20' />
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Tabbed Interface */}
			<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="clocks" className="gap-2">
						<Clock className="w-4 h-4" />
						{t('tabs.worldClocks')}
					</TabsTrigger>
					<TabsTrigger value="converter" className="gap-2">
						<Timer className="w-4 h-4" />
						{t('tabs.converter')}
					</TabsTrigger>
				</TabsList>

				{/* World Clocks Tab */}
				<TabsContent value="clocks" className="space-y-6">
					<div className='flex items-center justify-between'>
						<h2 className='text-2xl font-semibold flex items-center gap-2'>
							<Sparkles className='w-6 h-6 text-primary' />
							{t('worldClocks')}
						</h2>
						<Select
							onValueChange={value => {
								const tz = popularTimezones.find(t => t.name === value)
								if (tz) addCity(tz.cities[0], tz.name)
							}}
						>
							<SelectTrigger className='w-[250px]'>
								<SelectValue placeholder={t('addCity')} />
							</SelectTrigger>
							<SelectContent>
								{popularTimezones.map((tz, index) => (
									<SelectItem key={`popular-${tz.name}-${index}`} value={tz.name}>
										<span className='flex items-center gap-2'>
											<Globe className='w-4 h-4' />
											{tz.cities[0]} ({tz.abbr})
										</span>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{selectedCities.map((city, index) => (
							<Card 
								key={city.id} 
								className='relative group overflow-hidden hover:shadow-lg transition-all duration-300'
								style={{ animationDelay: `${index * 100}ms` }}
							>
								<div className={cn(
									'absolute inset-0 bg-gradient-to-br transition-opacity duration-300',
									city.isDay 
										? 'from-yellow-100/50 to-orange-100/30 dark:from-yellow-900/20 dark:to-orange-900/10' 
										: 'from-blue-100/50 to-purple-100/30 dark:from-blue-900/20 dark:to-purple-900/10'
								)} />

								<CardContent className='relative p-6'>
									<Button
										onClick={() => removeCity(city.id)}
										size='icon'
										variant='ghost'
										className='absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8'
									>
										<X className='w-4 h-4' />
									</Button>
									
									<div className='flex items-start justify-between mb-4'>
										<div>
											<h3 className='font-semibold text-xl mb-1'>{city.city}</h3>
											<p className='text-sm text-muted-foreground'>{city.date}</p>
										</div>
										<div className='text-3xl mr-10'>
											{city.isDay ? (
												<Sun className='w-10 h-10 text-yellow-500' />
											) : (
												<Moon className='w-10 h-10 text-blue-500' />
											)}
										</div>
									</div>
									
									<div className='flex items-center justify-between'>
										<div>
											<div className='text-3xl font-mono font-bold'>
												{city.time}
											</div>
											<div className='flex items-center gap-2 mt-2'>
												<Badge variant='outline' className='text-xs'>
													UTC{city.offset}
												</Badge>
												{city.isDST && (
													<Badge variant='secondary' className='text-xs'>
														DST
													</Badge>
												)}
											</div>
										</div>
										<AnalogClock 
											hour={city.hour} 
											minute={city.minute} 
											second={city.second}
											size={80}
										/>
									</div>
								</CardContent>
							</Card>
						))}
						
						{/* Add City Card */}
						{selectedCities.length < 12 && (
							<Card className='border-dashed border-2 hover:border-primary transition-colors cursor-pointer'>
								<CardContent className='p-6 flex items-center justify-center h-full'>
									<div className='text-center'>
										<Plus className='w-12 h-12 mx-auto mb-3 text-muted-foreground' />
										<p className='text-sm text-muted-foreground'>{t('addMoreCities')}</p>
									</div>
								</CardContent>
							</Card>
						)}
					</div>
				</TabsContent>

				{/* Timezone Converter Tab */}
				<TabsContent value="converter" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<ArrowRight className='w-5 h-5' />
								{t('timezoneConverter')}
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='grid md:grid-cols-2 gap-8'>
								<div className='space-y-4'>
									<div>
										<Label htmlFor='from-time'>{t('fromTime')}</Label>
										<div className='grid grid-cols-2 gap-2 mt-2'>
											<div className='relative'>
												<Clock className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
												<Input
													id='from-time'
													type='time'
													value={conversion.fromTime}
													onChange={e =>
														setConversion(prev => ({
															...prev,
															fromTime: e.target.value
														}))
													}
													className='pl-10'
												/>
											</div>
											<div className='relative'>
												<CalendarDays className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
												<Input
													type='date'
													value={conversion.fromDate}
													onChange={e =>
														setConversion(prev => ({
															...prev,
															fromDate: e.target.value
														}))
													}
													className='pl-10'
												/>
											</div>
										</div>
									</div>

									<div>
										<Label htmlFor='from-timezone'>{t('fromTimezone')}</Label>
										<Select
											value={conversion.fromTimezone}
											onValueChange={value =>
												setConversion(prev => ({ ...prev, fromTimezone: value }))
											}
										>
											<SelectTrigger id='from-timezone' className='mt-2'>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<div className='p-2'>
													<Input
														placeholder={t('searchTimezone')}
														value={searchTerm}
														onChange={e => setSearchTerm(e.target.value)}
														className='mb-2'
													/>
												</div>
												{filteredTimezones.slice(0, 20).map((tz) => (
													<SelectItem key={tz} value={tz}>
														{tz}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>

								<div className='space-y-4'>
									<div>
										<Label htmlFor='to-timezone'>{t('toTimezone')}</Label>
										<Select
											value={conversion.toTimezone}
											onValueChange={value =>
												setConversion(prev => ({ ...prev, toTimezone: value }))
											}
										>
											<SelectTrigger id='to-timezone' className='mt-2'>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{popularTimezones.map((tz, index) => (
													<SelectItem key={`to-${tz.name}-${index}`} value={tz.name}>
														{tz.cities[0]} ({tz.abbr})
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<Button onClick={convertTime} className='w-full' size='lg'>
										<ArrowRight className='w-4 h-4 mr-2' />
										{t('convertTime')}
									</Button>
								</div>
							</div>

							{conversion.result && (
								<div className='mt-6 p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl'>
									<div className='flex items-center justify-between'>
										<div>
											<p className='text-sm text-muted-foreground mb-2'>{t('result')}</p>
											<p className='text-4xl font-mono font-bold mb-2'>
												{conversion.result.time}
											</p>
											<p className='text-base'>
												{new Date(conversion.result.date).toLocaleDateString(
													'en-US',
													{
														weekday: 'long',
														year: 'numeric',
														month: 'long',
														day: 'numeric'
													}
												)}
											</p>
										</div>
										{conversion.result.dayDifference !== 0 && (
											<Badge
												variant={
													conversion.result.dayDifference > 0
														? 'default'
														: 'secondary'
												}
												className='text-lg px-4 py-2'
											>
												{conversion.result.dayDifference > 0 ? '+' : ''}
												{conversion.result.dayDifference} {t('day')}
											</Badge>
										)}
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Info Section */}
			<Card className='overflow-hidden'>
				<div className='bg-gradient-to-r from-muted/50 to-muted/30'>
					<CardContent className='p-6'>
						<h3 className='font-semibold text-lg mb-4'>{t('about.title')}</h3>
						<div className='grid md:grid-cols-2 gap-6'>
							<div className='space-y-4'>
								<div className='flex items-start gap-3'>
									<Globe className='w-5 h-5 mt-0.5 text-primary' />
									<div>
										<h4 className='font-medium mb-1'>{t('about.accurate')}</h4>
										<p className='text-sm text-muted-foreground'>
											{t('about.accurateDesc')}
										</p>
									</div>
								</div>
								<div className='flex items-start gap-3'>
									<Sunrise className='w-5 h-5 mt-0.5 text-primary' />
									<div>
										<h4 className='font-medium mb-1'>{t('about.dst')}</h4>
										<p className='text-sm text-muted-foreground'>
											{t('about.dstDesc')}
										</p>
									</div>
								</div>
							</div>
							<div className='space-y-4'>
								<div className='flex items-start gap-3'>
									<MapPin className='w-5 h-5 mt-0.5 text-primary' />
									<div>
										<h4 className='font-medium mb-1'>{t('about.popular')}</h4>
										<p className='text-sm text-muted-foreground'>
											{t('about.popularDesc')}
										</p>
									</div>
								</div>
								<div className='flex items-start gap-3'>
									<HardDrive className='w-5 h-5 mt-0.5 text-primary' />
									<div>
										<h4 className='font-medium mb-1'>{t('about.storage')}</h4>
										<p className='text-sm text-muted-foreground'>
											{t('about.storageDesc')}
										</p>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</div>
			</Card>
		</div>
	)
}
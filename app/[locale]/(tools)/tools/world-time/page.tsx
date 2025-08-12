'use client'

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
	Sun,
	Moon,
	Plus,
	X,
	ArrowRight,
	MapPin,
	CalendarDays,
	Timer,
	Sparkles,
	CloudMoon,
	CloudSun,
	HardDrive,
	Sunrise
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { useWorldTime } from '@/lib/hooks/widgets'
import { AnalogClock } from '@/components/ui/analog-clock'

export default function WorldTimePage() {
	const t = useTranslations('widgets.worldTime')
	
	const {
		mounted,
		currentTime,
		selectedCities,
		conversion,
		searchTerm,
		activeTab,
		filteredTimezones,
		setSearchTerm,
		setActiveTab,
		addCity,
		removeCity,
		convertTime,
		updateConversion,
		popularTimezones
	} = useWorldTime({
		translations: {
			alreadyAdded: t('toast.alreadyAdded'),
			cityAdded: t('toast.cityAdded'),
			enterTimeDate: t('toast.enterTimeDate'),
			invalidDateTime: t('toast.invalidDateTime')
		}
	})

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
										? 'from-blue-100/50 to-blue-200/30 dark:from-blue-900/20 dark:to-blue-800/10' 
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
													onChange={e => updateConversion({ fromTime: e.target.value })}
													className='pl-10'
												/>
											</div>
											<div className='relative'>
												<CalendarDays className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
												<Input
													type='date'
													value={conversion.fromDate}
													onChange={e => updateConversion({ fromDate: e.target.value })}
													className='pl-10'
												/>
											</div>
										</div>
									</div>

									<div>
										<Label htmlFor='from-timezone'>{t('fromTimezone')}</Label>
										<Select
											value={conversion.fromTimezone}
											onValueChange={value => updateConversion({ fromTimezone: value })}
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
											onValueChange={value => updateConversion({ toTimezone: value })}
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
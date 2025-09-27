'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import {
	Settings,
	SunMoon,
	Sun,
	Moon,
	Monitor,
	Sparkles,
	Move,
	Circle,
	Square,
	Ban,
	Languages,
	Check,
	Palette,
	Globe
} from 'lucide-react'
import useThemeWithTransition, {
	TransitionType
} from '@/lib/hooks/useThemeWithTransition'
import { cn } from '@/lib/utils'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Theme settings types and data
const themes = [
	{
		value: 'light',
		label: 'Light',
		icon: Sun,
		description: 'Bright theme for daytime use'
	},
	{
		value: 'dark',
		label: 'Dark',
		icon: Moon,
		description: 'Dark theme for nighttime use'
	},
	{
		value: 'system',
		label: 'System',
		icon: Monitor,
		description: 'Follow system preference'
	}
]

const transitions: {
	value: TransitionType
	label: string
	icon: React.ComponentType<{ className?: string }>
	description: string
}[] = [
	{
		value: 'fade',
		label: 'Fade',
		icon: Sparkles,
		description: 'Smooth fade transition'
	},
	{
		value: 'scale',
		label: 'Scale',
		icon: Square,
		description: 'Scale in/out effect'
	},
	{
		value: 'slide',
		label: 'Slide',
		icon: Move,
		description: 'Slide from side'
	},
	{
		value: 'circle',
		label: 'Circle',
		icon: Circle,
		description: 'Expanding circle from click'
	},
	{
		value: 'none',
		label: 'None',
		icon: Ban,
		description: 'Instant switch'
	}
]

// Language settings types and data
interface Language {
	code: string
	name: string
	nativeName: string
	flag: string
	description: string
	rtl?: boolean
	inDevelopment?: boolean
}

const languages: Language[] = [
	{
		code: 'en',
		name: 'English',
		nativeName: 'English',
		flag: '🇺🇸',
		description: 'United States'
	},
	{
		code: 'ru',
		name: 'Russian',
		nativeName: 'Русский',
		flag: '🇷🇺',
		description: 'Россия'
	}
]

export default function SettingsPage() {
	const t = useTranslations('Settings')
	const router = useRouter()
	const pathname = usePathname()
	const locale = useLocale()
	const { theme, setTheme, transitionType, setTransitionType } =
		useThemeWithTransition()
	const [supportsViewTransitions, setSupportsViewTransitions] = useState(true)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
		setSupportsViewTransitions(
			typeof document !== 'undefined' && 'startViewTransition' in document
		)
	}, [])

	const handleLanguageChange = (newLocale: string) => {
		const newPathname = pathname.replace(`/${locale}/`, `/${newLocale}/`)
		router.push(newPathname)
	}

	const handleTransitionTypeChange = (newType: TransitionType) => {
		setTransitionType(newType)

		// Trigger a preview by temporarily switching theme
		if (mounted && supportsViewTransitions && newType !== 'none') {
			const fakeEvent = {
				currentTarget: {
					getBoundingClientRect: () => ({
						left: window.innerWidth / 2 - 50,
						top: window.innerHeight / 2 - 50,
						width: 100,
						height: 100
					})
				}
			} as React.MouseEvent

			const currentTheme = theme
			const previewTheme = currentTheme === 'dark' ? 'light' : 'dark'

			setTheme(previewTheme, fakeEvent)
			setTimeout(() => {
				setTheme(currentTheme!, fakeEvent)
			}, 600)
		}
	}

	if (!mounted) {
		return (
			<div className='container mx-auto py-8 px-4 max-w-4xl'>
				<div className='flex items-center gap-3 mb-8'>
					<Settings className='w-8 h-8' />
					<h1 className='text-3xl font-bold'>{t('title')}</h1>
				</div>
				<div className='animate-pulse space-y-8'>
					<div className='h-96 bg-muted rounded-lg'></div>
				</div>
			</div>
		)
	}

	return (
		<div className='container mx-auto py-8 px-4 max-w-4xl'>
			<div className='flex items-center gap-3 mb-2'>
				<Settings className='w-8 h-8' />
				<h1 className='text-3xl font-bold'>{t('title')}</h1>
			</div>
			<p className='text-muted-foreground mb-8'>{t('description')}</p>

			<Tabs defaultValue='appearance' className='space-y-8'>
				<TabsList className='grid w-full grid-cols-2'>
					<TabsTrigger value='appearance' className='flex items-center gap-2'>
						<Palette className='w-4 h-4' />
						{t('tabs.appearance')}
					</TabsTrigger>
					<TabsTrigger value='language' className='flex items-center gap-2'>
						<Globe className='w-4 h-4' />
						{t('tabs.language')}
					</TabsTrigger>
				</TabsList>

				{/* Appearance Tab */}
				<TabsContent value='appearance' className='space-y-8'>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<SunMoon className='w-5 h-5' />
								{t('theme.title')}
							</CardTitle>
							<CardDescription>{t('theme.description')}</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
								{themes.map(themeOption => {
									const Icon = themeOption.icon
									const isActive = theme === themeOption.value

									return (
										<div
											key={themeOption.value}
											className={cn(
												'cursor-pointer rounded-lg border-2 p-6 transition-all hover:shadow-md',
												isActive ? 'border-accent bg-accent/5' : 'border-border'
											)}
											onClick={e => setTheme(themeOption.value, e)}
										>
											<div className='flex flex-col items-center text-center space-y-3'>
												<div
													className={cn(
														'p-3 rounded-full',
														isActive
															? 'bg-accent text-accent-foreground'
															: 'bg-muted'
													)}
												>
													<Icon className='w-6 h-6' />
												</div>
												<div>
													<h3 className='font-semibold'>
														{t(`theme.options.${themeOption.value}.label`)}
													</h3>
													<p className='text-sm text-muted-foreground mt-1'>
														{t(
															`theme.options.${themeOption.value}.description`
														)}
													</p>
												</div>
												{isActive && <Check className='w-4 h-4 text-accent' />}
											</div>
										</div>
									)
								})}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Sparkles className='w-5 h-5' />
								{t('transition.title')}
							</CardTitle>
							<CardDescription>{t('transition.description')}</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid grid-cols-2 md:grid-cols-5 gap-3'>
								{transitions.map(transition => {
									const Icon = transition.icon
									const isActive = transitionType === transition.value

									return (
										<button
											key={transition.value}
											className={cn(
												'p-3 rounded-lg border-2 transition-all hover:shadow-sm',
												'flex flex-col items-center text-center space-y-2',
												isActive
													? 'border-accent bg-accent/5'
													: 'border-border hover:border-accent/50'
											)}
											onClick={() =>
												handleTransitionTypeChange(transition.value)
											}
										>
											<Icon
												className={cn('w-5 h-5', isActive && 'text-accent')}
											/>
											<div className='text-xs font-medium'>
												{t(`transition.options.${transition.value}`)}
											</div>
										</button>
									)
								})}
							</div>
							{!supportsViewTransitions && (
								<div className='text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg'>
									{t('transition.notSupported')}
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* Language Tab */}
				<TabsContent value='language' className='space-y-8'>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Languages className='w-5 h-5' />
								{t('language.title')}
							</CardTitle>
							<CardDescription>{t('language.description')}</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
								{languages.map(language => {
									const isActive = locale === language.code

									return (
										<div
											key={language.code}
											className={cn(
												'rounded-lg border-2 p-6 transition-all',
												language.inDevelopment
													? 'opacity-50 cursor-not-allowed border-border'
													: 'cursor-pointer hover:shadow-md',
												isActive && 'border-accent bg-accent/5'
											)}
											onClick={() =>
												!language.inDevelopment &&
												handleLanguageChange(language.code)
											}
										>
											<div className='flex flex-col items-center text-center space-y-3'>
												<div className='text-4xl'>{language.flag}</div>
												<div>
													<h3 className='font-semibold'>{language.name}</h3>
													<p className='text-sm text-muted-foreground mt-1'>
														{language.nativeName}
													</p>
												</div>
												{language.inDevelopment ? (
													<div className='text-xs text-muted-foreground'>
														{t('language.inDevelopment')}
													</div>
												) : isActive ? (
													<Check className='w-4 h-4 text-accent' />
												) : null}
											</div>
										</div>
									)
								})}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>{t('language.features.title')}</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='space-y-3'>
								<div className='flex items-start space-x-3'>
									<Check className='w-5 h-5 text-green-500 mt-0.5' />
									<div>
										<div className='font-medium'>
											{t('language.features.autoTranslation.title')}
										</div>
										<div className='text-sm text-muted-foreground'>
											{t('language.features.autoTranslation.description')}
										</div>
									</div>
								</div>

								<div className='flex items-start space-x-3'>
									<Check className='w-5 h-5 text-green-500 mt-0.5' />
									<div>
										<div className='font-medium'>
											{t('language.features.rtlSupport.title')}
										</div>
										<div className='text-sm text-muted-foreground'>
											{t('language.features.rtlSupport.description')}
										</div>
									</div>
								</div>

								<div className='flex items-start space-x-3'>
									<Check className='w-5 h-5 text-green-500 mt-0.5' />
									<div>
										<div className='font-medium'>
											{t('language.features.persistent.title')}
										</div>
										<div className='text-sm text-muted-foreground'>
											{t('language.features.persistent.description')}
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			<div className='mt-8 text-sm text-muted-foreground text-center'>
				{t('footer')}
			</div>
		</div>
	)
}

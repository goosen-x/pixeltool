'use client'

import { useState, useEffect } from 'react'

import { Settings, SunMoon, Sun, Moon, Monitor, Check } from 'lucide-react'
import useThemeWithTransition from '@/lib/hooks/useThemeWithTransition'
import { cn } from '@/lib/utils'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription
} from '@/components/ui/card'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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

export default function SettingsPage() {
	const { theme, setTheme } = useThemeWithTransition()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	// const handleLanguageChange = (newLocale: string) => {
	//	// For now, keep the same pathname since locale is no longer in URL
	//	const newPathname = pathname
	//	router.push(newPathname)
	// }

	if (!mounted) {
		return (
			<div className='container mx-auto py-8 px-4 max-w-4xl'>
				<div className='flex items-center gap-3 mb-8'>
					<Settings className='w-8 h-8' />
					<h1 className='text-3xl font-bold'>Настройки</h1>
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
				<h1 className='text-3xl font-bold'>Настройки</h1>
			</div>
			<p className='text-muted-foreground mb-8'>
				Настройте внешний вид и поведение приложения под ваши предпочтения.
			</p>

			<div className='space-y-8'>
				{/* Appearance Section */}
				<div className='space-y-8'>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<SunMoon className='w-5 h-5' />
								Тема
							</CardTitle>
							<CardDescription>
								Выберите предпочитаемую цветовую схему для интерфейса.
							</CardDescription>
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
											onClick={() => setTheme(themeOption.value)}
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
														{themeOption.value === 'light'
															? 'Светлая'
															: themeOption.value === 'dark'
																? 'Тёмная'
																: 'Системная'}
													</h3>
													<p className='text-sm text-muted-foreground mt-1'>
														{themeOption.value === 'light'
															? 'Яркая тема для дневного использования'
															: themeOption.value === 'dark'
																? 'Тёмная тема для ночного использования'
																: 'Следовать настройкам системы'}
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
				</div>
			</div>

			<div className='mt-8 text-sm text-muted-foreground text-center'>
				Настройки сохраняются автоматически в локальном хранилище браузера.
			</div>
		</div>
	)
}

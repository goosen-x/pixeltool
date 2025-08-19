'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
	Timer,
	Play,
	Pause,
	RotateCcw,
	Bell,
	Volume2,
	Clock,
	Target,
	Zap,
	Coffee,
	Briefcase,
	Brain,
	ChevronUp,
	ChevronDown,
	Settings2
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { WidgetContainer } from '@/components/widgets/base'

type TimerMode = 'countdown' | 'stopwatch' | 'pomodoro'
type PomodoroPhase = 'work' | 'shortBreak' | 'longBreak'

interface TimerState {
	hours: number
	minutes: number
	seconds: number
	milliseconds: number
}

interface PomodoroSettings {
	workDuration: number
	shortBreakDuration: number
	longBreakDuration: number
	sessionsUntilLongBreak: number
}

interface TimerPreset {
	name: string
	icon: any
	duration: number // in seconds
	color: string
}

const TIMER_PRESETS: TimerPreset[] = [
	{ name: '1m', icon: Zap, duration: 60, color: 'text-yellow-600' },
	{ name: '5m', icon: Coffee, duration: 300, color: 'text-orange-600' },
	{ name: '10m', icon: Coffee, duration: 600, color: 'text-green-600' },
	{ name: '15m', icon: Brain, duration: 900, color: 'text-blue-600' },
	{ name: '25m', icon: Target, duration: 1500, color: 'text-purple-600' },
	{ name: '45m', icon: Briefcase, duration: 2700, color: 'text-pink-600' }
]

export default function TimerCountdownPage() {
	const t = useTranslations('widgets.timerCountdown')
	const [mode, setMode] = useState<TimerMode>('countdown')
	const [isRunning, setIsRunning] = useState(false)
	const [isPaused, setIsPaused] = useState(false)
	const [time, setTime] = useState<TimerState>({
		hours: 0,
		minutes: 5,
		seconds: 0,
		milliseconds: 0
	})
	const [initialTime, setInitialTime] = useState<TimerState>({
		hours: 0,
		minutes: 5,
		seconds: 0,
		milliseconds: 0
	})
	const [soundEnabled, setSoundEnabled] = useState(true)
	const [showMilliseconds, setShowMilliseconds] = useState(false)
	const [showSettings, setShowSettings] = useState(false)

	// Pomodoro specific
	const [pomodoroPhase, setPomodoroPhase] = useState<PomodoroPhase>('work')
	const [pomodoroSession, setPomodoroSession] = useState(1)
	const [pomodoroSettings, setPomodoroSettings] = useState<PomodoroSettings>({
		workDuration: 25,
		shortBreakDuration: 5,
		longBreakDuration: 15,
		sessionsUntilLongBreak: 4
	})

	const intervalRef = useRef<NodeJS.Timeout | null>(null)
	const audioRef = useRef<HTMLAudioElement | null>(null)

	const config = {
		title: t('title'),
		description: t('description'),
		icon: <Clock className='w-6 h-6 text-primary' />,
		category: t('category')
	}

	// Initialize audio
	useEffect(() => {
		audioRef.current = new Audio('/notification.mp3')
		audioRef.current.volume = 0.5
	}, [])

	const handlePomodoroPhaseComplete = useCallback(() => {
		if (pomodoroPhase === 'work') {
			if (pomodoroSession % pomodoroSettings.sessionsUntilLongBreak === 0) {
				setPomodoroPhase('longBreak')
				setTime({
					hours: 0,
					minutes: pomodoroSettings.longBreakDuration,
					seconds: 0,
					milliseconds: 0
				})
				toast.success(t('longBreakTime'))
			} else {
				setPomodoroPhase('shortBreak')
				setTime({
					hours: 0,
					minutes: pomodoroSettings.shortBreakDuration,
					seconds: 0,
					milliseconds: 0
				})
				toast.success(t('shortBreakTime'))
			}
		} else {
			setPomodoroPhase('work')
			setPomodoroSession(prev => prev + 1)
			setTime({
				hours: 0,
				minutes: pomodoroSettings.workDuration,
				seconds: 0,
				milliseconds: 0
			})
			toast.success(t('workTime'))
		}
	}, [pomodoroPhase, pomodoroSession, pomodoroSettings, t])

	const handleTimerComplete = useCallback(() => {
		setIsRunning(false)
		setIsPaused(false)

		// Play sound
		if (soundEnabled && audioRef.current) {
			audioRef.current.play().catch(err => console.error('Error playing sound:', err))
		}

		// Handle Pomodoro phase transitions
		if (mode === 'pomodoro') {
			handlePomodoroPhaseComplete()
		} else {
			toast.success(t('timerComplete'))
		}
	}, [mode, soundEnabled, t, handlePomodoroPhaseComplete])

	const updateTimer = useCallback(() => {
		setTime(prevTime => {
			if (mode === 'countdown' || mode === 'pomodoro') {
				// Countdown logic
				let { hours, minutes, seconds, milliseconds } = prevTime

				if (showMilliseconds) {
					milliseconds -= 10
					if (milliseconds < 0) {
						milliseconds = 990
						seconds -= 1
					}
				} else {
					seconds -= 1
				}

				if (seconds < 0) {
					seconds = 59
					minutes -= 1
				}
				if (minutes < 0) {
					minutes = 59
					hours -= 1
				}

				if (hours < 0) {
					handleTimerComplete()
					return { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }
				}

				return { hours, minutes, seconds, milliseconds }
			} else {
				// Stopwatch logic
				let { hours, minutes, seconds, milliseconds } = prevTime

				if (showMilliseconds) {
					milliseconds += 10
					if (milliseconds >= 1000) {
						milliseconds = 0
						seconds += 1
					}
				} else {
					seconds += 1
				}

				if (seconds >= 60) {
					seconds = 0
					minutes += 1
				}
				if (minutes >= 60) {
					minutes = 0
					hours += 1
				}

				return { hours, minutes, seconds, milliseconds }
			}
		})
	}, [mode, showMilliseconds, handleTimerComplete])

	// Timer logic
	useEffect(() => {
		if (isRunning && !isPaused) {
			intervalRef.current = setInterval(() => {
				updateTimer()
			}, showMilliseconds ? 10 : 1000)
		} else {
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
			}
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
			}
		}
	}, [isRunning, isPaused, mode, showMilliseconds, updateTimer])

	const startTimer = () => {
		if (mode === 'countdown' && time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
			setTime({ ...initialTime })
		}
		setIsRunning(true)
		setIsPaused(false)
	}

	const pauseTimer = () => {
		setIsPaused(true)
	}

	const resumeTimer = () => {
		setIsPaused(false)
	}

	const resetTimer = () => {
		setIsRunning(false)
		setIsPaused(false)

		if (mode === 'countdown') {
			setTime({ ...initialTime })
		} else if (mode === 'stopwatch') {
			setTime({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
		} else if (mode === 'pomodoro') {
			setPomodoroPhase('work')
			setPomodoroSession(1)
			setTime({
				hours: 0,
				minutes: pomodoroSettings.workDuration,
				seconds: 0,
				milliseconds: 0
			})
		}
	}

	const handleModeChange = (newMode: TimerMode) => {
		resetTimer()
		setMode(newMode)

		if (newMode === 'pomodoro') {
			setTime({
				hours: 0,
				minutes: pomodoroSettings.workDuration,
				seconds: 0,
				milliseconds: 0
			})
		}
	}

	const loadPreset = (preset: TimerPreset) => {
		const hours = Math.floor(preset.duration / 3600)
		const minutes = Math.floor((preset.duration % 3600) / 60)
		const seconds = preset.duration % 60

		setInitialTime({ hours, minutes, seconds, milliseconds: 0 })
		setTime({ hours, minutes, seconds, milliseconds: 0 })
		toast.success(`${t('presetLoaded')}: ${preset.name}`)
	}

	const adjustTime = (field: 'hours' | 'minutes' | 'seconds', increment: boolean) => {
		if (isRunning) return

		const delta = increment ? 1 : -1
		const newTime = { ...initialTime }

		switch (field) {
			case 'hours':
				newTime.hours = Math.max(0, Math.min(23, newTime.hours + delta))
				break
			case 'minutes':
				newTime.minutes = Math.max(0, Math.min(59, newTime.minutes + delta))
				break
			case 'seconds':
				newTime.seconds = Math.max(0, Math.min(59, newTime.seconds + delta))
				break
		}

		setInitialTime(newTime)
		setTime(newTime)
	}

	const formatTime = (value: number, padLength: number = 2): string => {
		return value.toString().padStart(padLength, '0')
	}

	const getProgress = (): number => {
		if (mode === 'stopwatch') return 0

		const totalInitialSeconds =
			initialTime.hours * 3600 + initialTime.minutes * 60 + initialTime.seconds
		const totalCurrentSeconds = time.hours * 3600 + time.minutes * 60 + time.seconds

		if (totalInitialSeconds === 0) return 100

		return ((totalInitialSeconds - totalCurrentSeconds) / totalInitialSeconds) * 100
	}

	const getPomodoroPhaseInfo = () => {
		switch (pomodoroPhase) {
			case 'work':
				return {
					label: t('work'),
					color: 'text-red-600 dark:text-red-400',
					bgColor: 'bg-red-50 dark:bg-red-950/30',
					borderColor: 'border-red-200 dark:border-red-800'
				}
			case 'shortBreak':
				return {
					label: t('shortBreak'),
					color: 'text-green-600 dark:text-green-400',
					bgColor: 'bg-green-50 dark:bg-green-950/30',
					borderColor: 'border-green-200 dark:border-green-800'
				}
			case 'longBreak':
				return {
					label: t('longBreak'),
					color: 'text-blue-600 dark:text-blue-400',
					bgColor: 'bg-blue-50 dark:bg-blue-950/30',
					borderColor: 'border-blue-200 dark:border-blue-800'
				}
		}
	}

	return (
		<WidgetContainer config={config}>
			<div className='max-w-2xl mx-auto space-y-4'>
				{/* Mode Tabs */}
				<Tabs value={mode} onValueChange={(value) => handleModeChange(value as TimerMode)} className='w-full'>
					<TabsList className='grid w-full grid-cols-3'>
						<TabsTrigger value='countdown' className='gap-2'>
							<Clock className='w-4 h-4' />
							{t('timer')}
						</TabsTrigger>
						<TabsTrigger value='stopwatch' className='gap-2'>
							<Timer className='w-4 h-4' />
							{t('stopwatch')}
						</TabsTrigger>
						<TabsTrigger value='pomodoro' className='gap-2'>
							<Target className='w-4 h-4' />
							Pomodoro
						</TabsTrigger>
					</TabsList>

					<TabsContent value={mode} className='mt-4 space-y-4'>
						{/* Timer Display Card */}
						<Card className='p-6'>
							{/* Pomodoro Phase Indicator */}
							{mode === 'pomodoro' && (
								<div
									className={cn(
										'mb-4 p-2 rounded-lg text-center border',
										getPomodoroPhaseInfo().bgColor,
										getPomodoroPhaseInfo().borderColor
									)}
								>
									<div className={cn('font-medium text-sm', getPomodoroPhaseInfo().color)}>
										{getPomodoroPhaseInfo().label} • {t('session')} {pomodoroSession}
									</div>
								</div>
							)}

							{/* Time Display */}
							<div className='text-center mb-4'>
								<div className='text-6xl md:text-7xl font-mono font-bold tracking-tight'>
									{mode === 'countdown' && !isRunning ? (
										<div className='flex items-center justify-center gap-1'>
											<div className='flex flex-col items-center'>
												<Button
													variant='ghost'
													size='icon'
													className='h-6 w-6'
													onClick={() => adjustTime('hours', true)}
												>
													<ChevronUp className='h-4 w-4' />
												</Button>
												<span>{formatTime(time.hours)}</span>
												<Button
													variant='ghost'
													size='icon'
													className='h-6 w-6'
													onClick={() => adjustTime('hours', false)}
												>
													<ChevronDown className='h-4 w-4' />
												</Button>
											</div>
											<span className='mx-1'>:</span>
											<div className='flex flex-col items-center'>
												<Button
													variant='ghost'
													size='icon'
													className='h-6 w-6'
													onClick={() => adjustTime('minutes', true)}
												>
													<ChevronUp className='h-4 w-4' />
												</Button>
												<span>{formatTime(time.minutes)}</span>
												<Button
													variant='ghost'
													size='icon'
													className='h-6 w-6'
													onClick={() => adjustTime('minutes', false)}
												>
													<ChevronDown className='h-4 w-4' />
												</Button>
											</div>
											<span className='mx-1'>:</span>
											<div className='flex flex-col items-center'>
												<Button
													variant='ghost'
													size='icon'
													className='h-6 w-6'
													onClick={() => adjustTime('seconds', true)}
												>
													<ChevronUp className='h-4 w-4' />
												</Button>
												<span>{formatTime(time.seconds)}</span>
												<Button
													variant='ghost'
													size='icon'
													className='h-6 w-6'
													onClick={() => adjustTime('seconds', false)}
												>
													<ChevronDown className='h-4 w-4' />
												</Button>
											</div>
										</div>
									) : (
										<>
											{formatTime(time.hours)}:{formatTime(time.minutes)}:
											{formatTime(time.seconds)}
											{showMilliseconds && (
												<span className='text-3xl md:text-4xl text-muted-foreground'>
													.{formatTime(Math.floor(time.milliseconds / 10))}
												</span>
											)}
										</>
									)}
								</div>
							</div>

							{/* Progress Bar */}
							{(mode === 'countdown' || mode === 'pomodoro') && (
								<Progress value={getProgress()} className='h-2 mb-6' />
							)}

							{/* Control Buttons */}
							<div className='flex justify-center gap-2'>
								{!isRunning ? (
									<Button onClick={startTimer} size='lg' className='gap-2'>
										<Play className='w-5 h-5' />
										{t('start')}
									</Button>
								) : isPaused ? (
									<Button onClick={resumeTimer} size='lg' className='gap-2'>
										<Play className='w-5 h-5' />
										{t('resume')}
									</Button>
								) : (
									<Button
										onClick={pauseTimer}
										size='lg'
										variant='secondary'
										className='gap-2'
									>
										<Pause className='w-5 h-5' />
										{t('pause')}
									</Button>
								)}

								<Button onClick={resetTimer} size='lg' variant='outline' className='gap-2'>
									<RotateCcw className='w-5 h-5' />
									{t('reset')}
								</Button>

								<Button
									onClick={() => setShowSettings(!showSettings)}
									size='lg'
									variant='outline'
									className='gap-2'
								>
									<Settings2 className='w-5 h-5' />
								</Button>
							</div>
						</Card>

						{/* Quick Presets for Countdown */}
						{mode === 'countdown' && !isRunning && (
							<Card className='p-4'>
								<div className='grid grid-cols-6 gap-2'>
									{TIMER_PRESETS.map((preset, index) => (
										<Button
											key={index}
											onClick={() => loadPreset(preset)}
											variant='outline'
											size='sm'
											className='flex flex-col items-center gap-1 h-auto py-2'
										>
											<preset.icon className={cn('w-4 h-4', preset.color)} />
											<span className='text-xs'>{preset.name}</span>
										</Button>
									))}
								</div>
							</Card>
						)}

						{/* Settings Panel */}
						{showSettings && (
							<Card className='p-4'>
								<div className='space-y-3'>
									<div className='flex items-center justify-between'>
										<Label htmlFor='sound' className='flex items-center gap-2'>
											<Volume2 className='w-4 h-4' />
											{t('soundNotification')}
										</Label>
										<Switch
											id='sound'
											checked={soundEnabled}
											onCheckedChange={setSoundEnabled}
										/>
									</div>

									{mode === 'stopwatch' && (
										<div className='flex items-center justify-between'>
											<Label htmlFor='milliseconds' className='flex items-center gap-2'>
												<Zap className='w-4 h-4' />
												{t('showMilliseconds')}
											</Label>
											<Switch
												id='milliseconds'
												checked={showMilliseconds}
												onCheckedChange={setShowMilliseconds}
											/>
										</div>
									)}

									{mode === 'pomodoro' && !isRunning && (
										<div className='space-y-2 pt-2 border-t'>
											<h4 className='text-sm font-medium'>{t('pomodoroSettings')}</h4>
											<div className='grid grid-cols-2 gap-3'>
												<div>
													<Label htmlFor='work-duration' className='text-xs'>
														{t('workDuration')}
													</Label>
													<Input
														id='work-duration'
														type='number'
														min='1'
														max='60'
														value={pomodoroSettings.workDuration}
														onChange={e =>
															setPomodoroSettings(prev => ({
																...prev,
																workDuration: parseInt(e.target.value) || 25
															}))
														}
														className='h-8 text-sm'
													/>
												</div>
												<div>
													<Label htmlFor='short-break' className='text-xs'>
														{t('shortBreakDuration')}
													</Label>
													<Input
														id='short-break'
														type='number'
														min='1'
														max='30'
														value={pomodoroSettings.shortBreakDuration}
														onChange={e =>
															setPomodoroSettings(prev => ({
																...prev,
																shortBreakDuration: parseInt(e.target.value) || 5
															}))
														}
														className='h-8 text-sm'
													/>
												</div>
												<div>
													<Label htmlFor='long-break' className='text-xs'>
														{t('longBreakDuration')}
													</Label>
													<Input
														id='long-break'
														type='number'
														min='1'
														max='60'
														value={pomodoroSettings.longBreakDuration}
														onChange={e =>
															setPomodoroSettings(prev => ({
																...prev,
																longBreakDuration: parseInt(e.target.value) || 15
															}))
														}
														className='h-8 text-sm'
													/>
												</div>
												<div>
													<Label htmlFor='sessions' className='text-xs'>
														{t('sessionsUntilLongBreak')}
													</Label>
													<Input
														id='sessions'
														type='number'
														min='2'
														max='10'
														value={pomodoroSettings.sessionsUntilLongBreak}
														onChange={e =>
															setPomodoroSettings(prev => ({
																...prev,
																sessionsUntilLongBreak: parseInt(e.target.value) || 4
															}))
														}
														className='h-8 text-sm'
													/>
												</div>
											</div>
										</div>
									)}
								</div>
							</Card>
						)}
					</TabsContent>
				</Tabs>

				{/* Compact Info */}
				<Card className='p-4 bg-muted/50'>
					<div className='flex items-center gap-2 text-sm text-muted-foreground'>
						<Bell className='w-4 h-4' />
						<span>
							{t('shortcuts')}: <kbd className='px-1 py-0.5 bg-background rounded text-xs'>Space</kbd> -{' '}
							{t('startPause')}, <kbd className='px-1 py-0.5 bg-background rounded text-xs'>Ctrl+R</kbd> -{' '}
							{t('reset')}
						</span>
					</div>
				</Card>
			</div>
		</WidgetContainer>
	)
}
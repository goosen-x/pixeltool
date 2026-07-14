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
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
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

import { SlidingTimer } from '@/components/widgets/timer/SlidingTimer'
import { SlidingCountdown } from '@/components/widgets/timer/SlidingCountdown'
import { AnimatedProgressBar } from '@/components/widgets/timer/AnimatedProgressBar'

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
	const [smoothProgress, setSmoothProgress] = useState(0)

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

	const config = {
		title: '',
		description: '',
		icon: null,
		category: ''
	}

	// Initialize audio - using Web Audio API for better compatibility
	const playNotificationSound = useCallback(() => {
		if (!soundEnabled) return

		try {
			if ('AudioContext' in window || 'webkitAudioContext' in window) {
				const AudioContext =
					window.AudioContext || (window as any).webkitAudioContext
				const audioContext = new AudioContext()

				// Create a pleasant notification sound sequence
				const createTone = (
					frequency: number,
					startTime: number,
					duration: number
				) => {
					const oscillator = audioContext.createOscillator()
					const gainNode = audioContext.createGain()

					oscillator.connect(gainNode)
					gainNode.connect(audioContext.destination)

					oscillator.frequency.setValueAtTime(frequency, startTime)
					gainNode.gain.setValueAtTime(0, startTime)
					gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01)
					gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

					oscillator.start(startTime)
					oscillator.stop(startTime + duration)
				}

				// Pleasant notification sequence: C-E-G chord
				const currentTime = audioContext.currentTime
				createTone(523.25, currentTime, 0.3) // C5
				createTone(659.25, currentTime + 0.1, 0.3) // E5
				createTone(783.99, currentTime + 0.2, 0.4) // G5
			}
		} catch (error) {
			console.warn('Could not play notification sound:', error)
		}
	}, [soundEnabled])

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
				toast.success('Время длинного перерыва!')
			} else {
				setPomodoroPhase('shortBreak')
				setTime({
					hours: 0,
					minutes: pomodoroSettings.shortBreakDuration,
					seconds: 0,
					milliseconds: 0
				})
				toast.success('Время короткого перерыва!')
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
			toast.success('Время работы!')
		}
	}, [pomodoroPhase, pomodoroSession, pomodoroSettings])

	const handleTimerComplete = useCallback(() => {
		setIsRunning(false)
		setIsPaused(false)

		// Play sound
		playNotificationSound()

		// Handle Pomodoro phase transitions
		if (mode === 'pomodoro') {
			handlePomodoroPhaseComplete()
		} else {
			toast.success('Таймер завершен!')
		}
	}, [mode, handlePomodoroPhaseComplete, playNotificationSound])

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
			intervalRef.current = setInterval(
				() => {
					updateTimer()
				},
				showMilliseconds ? 10 : 1000
			)
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

	// Update smooth progress
	useEffect(() => {
		const newProgress = getProgress()
		setSmoothProgress(newProgress)
	}, [time, initialTime, mode])

	const startTimer = () => {
		if (
			mode === 'countdown' &&
			time.hours === 0 &&
			time.minutes === 0 &&
			time.seconds === 0
		) {
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
		} else if (newMode === 'stopwatch') {
			setTime({
				hours: 0,
				minutes: 0,
				seconds: 0,
				milliseconds: 0
			})
		} else if (newMode === 'countdown') {
			setTime({
				hours: 0,
				minutes: 5,
				seconds: 0,
				milliseconds: 0
			})
			setInitialTime({
				hours: 0,
				minutes: 5,
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
		toast.success(`Пресет загружен: ${preset.name}`)
	}

	const adjustTime = (
		field: 'hours' | 'minutes' | 'seconds',
		increment: boolean
	) => {
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
		const totalCurrentSeconds =
			time.hours * 3600 + time.minutes * 60 + time.seconds

		if (totalInitialSeconds === 0) return 100

		return (
			((totalInitialSeconds - totalCurrentSeconds) / totalInitialSeconds) * 100
		)
	}

	const getPomodoroPhaseInfo = () => {
		switch (pomodoroPhase) {
			case 'work':
				return {
					label: 'Работа',
					color: 'text-red-600 dark:text-red-400',
					bgColor: 'bg-red-50 dark:bg-red-950/30',
					borderColor: 'border-red-200 dark:border-red-800'
				}
			case 'shortBreak':
				return {
					label: 'Короткий перерыв',
					color: 'text-green-600 dark:text-green-400',
					bgColor: 'bg-green-50 dark:bg-green-950/30',
					borderColor: 'border-green-200 dark:border-green-800'
				}
			case 'longBreak':
				return {
					label: 'Длинный перерыв',
					color: 'text-blue-600 dark:text-blue-400',
					bgColor: 'bg-blue-50 dark:bg-blue-950/30',
					borderColor: 'border-blue-200 dark:border-blue-800'
				}
		}
	}

	return (
		<div className='w-full space-y-4'>
			{/* Mode Tabs */}
			<Tabs
				value={mode}
				onValueChange={value => handleModeChange(value as TimerMode)}
				className='w-full'
			>
				<TabsList className='grid w-full grid-cols-3'>
					<TabsTrigger value='countdown' className='gap-2'>
						<Clock className='w-4 h-4' />
						Таймер
					</TabsTrigger>
					<TabsTrigger value='stopwatch' className='gap-2'>
						<Timer className='w-4 h-4' />
						Stopwatch
					</TabsTrigger>
					<TabsTrigger value='pomodoro' className='gap-2'>
						<Target className='w-4 h-4' />
						Pomodoro
					</TabsTrigger>
				</TabsList>

				<TabsContent value={mode} className='mt-4 space-y-4'>
					{/* Timer Display Card */}
					<Card className='p-6 relative'>
						{/* Settings Dropdown - positioned in top right */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant='ghost'
									size='icon'
									className='absolute top-2 right-2 h-8 w-8'
								>
									<Settings2 className='h-4 w-4' />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='end' className='w-56'>
								<DropdownMenuLabel>Настройки</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className='flex items-center justify-between'
									onSelect={e => e.preventDefault()}
								>
									<Label
										htmlFor='dropdown-sound'
										className='flex items-center gap-2 cursor-pointer'
									>
										<Volume2 className='w-4 h-4' />
										Звуковое уведомление
									</Label>
									<Switch
										id='dropdown-sound'
										checked={soundEnabled}
										onCheckedChange={setSoundEnabled}
									/>
								</DropdownMenuItem>
								{mode === 'stopwatch' && (
									<DropdownMenuItem
										className='flex items-center justify-between'
										onSelect={e => e.preventDefault()}
									>
										<Label
											htmlFor='dropdown-milliseconds'
											className='flex items-center gap-2 cursor-pointer'
										>
											<Zap className='w-4 h-4' />
											Показывать миллисекунды
										</Label>
										<Switch
											id='dropdown-milliseconds'
											checked={showMilliseconds}
											onCheckedChange={setShowMilliseconds}
										/>
									</DropdownMenuItem>
								)}
								{mode === 'pomodoro' && !isRunning && (
									<>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											className='p-0'
											onSelect={e => e.preventDefault()}
										>
											<div className='px-2 py-1.5 w-full'>
												<div className='space-y-2'>
													<h4 className='text-sm font-medium'>
														Настройки Помодоро
													</h4>
													<div className='grid grid-cols-2 gap-2 text-xs'>
														<div>
															<Label
																htmlFor='dropdown-work'
																className='text-xs'
															>
																Продолжительность работы
															</Label>
															<Input
																id='dropdown-work'
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
																className='h-6 text-xs mt-1'
															/>
														</div>
														<div>
															<Label
																htmlFor='dropdown-short'
																className='text-xs'
															>
																Короткий перерыв
															</Label>
															<Input
																id='dropdown-short'
																type='number'
																min='1'
																max='30'
																value={pomodoroSettings.shortBreakDuration}
																onChange={e =>
																	setPomodoroSettings(prev => ({
																		...prev,
																		shortBreakDuration:
																			parseInt(e.target.value) || 5
																	}))
																}
																className='h-6 text-xs mt-1'
															/>
														</div>
														<div>
															<Label
																htmlFor='dropdown-long'
																className='text-xs'
															>
																Длинный перерыв
															</Label>
															<Input
																id='dropdown-long'
																type='number'
																min='1'
																max='60'
																value={pomodoroSettings.longBreakDuration}
																onChange={e =>
																	setPomodoroSettings(prev => ({
																		...prev,
																		longBreakDuration:
																			parseInt(e.target.value) || 15
																	}))
																}
																className='h-6 text-xs mt-1'
															/>
														</div>
														<div>
															<Label
																htmlFor='dropdown-sessions'
																className='text-xs'
															>
																Сессии до длинного перерыва
															</Label>
															<Input
																id='dropdown-sessions'
																type='number'
																min='2'
																max='10'
																value={pomodoroSettings.sessionsUntilLongBreak}
																onChange={e =>
																	setPomodoroSettings(prev => ({
																		...prev,
																		sessionsUntilLongBreak:
																			parseInt(e.target.value) || 4
																	}))
																}
																className='h-6 text-xs mt-1'
															/>
														</div>
													</div>
												</div>
											</div>
										</DropdownMenuItem>
									</>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
						{/* Pomodoro Phase Indicator */}
						{mode === 'pomodoro' && (
							<div
								className={cn(
									'mb-4 p-2 rounded-lg text-center border',
									getPomodoroPhaseInfo().bgColor,
									getPomodoroPhaseInfo().borderColor
								)}
							>
								<div
									className={cn(
										'font-medium text-sm',
										getPomodoroPhaseInfo().color
									)}
								>
									{getPomodoroPhaseInfo().label} • Сессия {pomodoroSession}
								</div>
							</div>
						)}

						{/* Time Display */}
						<div className='text-center mb-6 '>
							{mode === 'countdown' && !isRunning ? (
								<SlidingCountdown
									hours={time.hours}
									minutes={time.minutes}
									seconds={time.seconds}
									onTimeChange={adjustTime}
									isEditable={true}
								/>
							) : mode === 'stopwatch' ? (
								<SlidingTimer
									hours={time.hours}
									minutes={time.minutes}
									seconds={time.seconds}
									milliseconds={time.milliseconds}
									showMilliseconds={showMilliseconds}
								/>
							) : (
								<SlidingTimer
									hours={time.hours}
									minutes={time.minutes}
									seconds={time.seconds}
								/>
							)}
						</div>

						{/* Progress Bar */}
						{(mode === 'countdown' || mode === 'pomodoro') && (
							<div className='w-full mb-6'>
								<AnimatedProgressBar value={smoothProgress} className='h-3' />
							</div>
						)}

						{/* Control Buttons */}
						<div className='flex justify-center gap-2'>
							{!isRunning ? (
								<Button onClick={startTimer} size='lg' className='gap-2'>
									<Play className='w-5 h-5' />
									Старт
								</Button>
							) : isPaused ? (
								<Button onClick={resumeTimer} size='lg' className='gap-2'>
									<Play className='w-5 h-5' />
									Продолжить
								</Button>
							) : (
								<Button
									onClick={pauseTimer}
									size='lg'
									variant='secondary'
									className='gap-2'
								>
									<Pause className='w-5 h-5' />
									Пауза
								</Button>
							)}

							<Button
								onClick={resetTimer}
								size='lg'
								variant='outline'
								className='gap-2'
							>
								<RotateCcw className='w-5 h-5' />
								Сброс
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
				</TabsContent>
			</Tabs>
		</div>
	)
}

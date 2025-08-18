'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import {
	Timer,
	Play,
	Pause,
	RotateCcw,
	Bell,
	BellOff,
	Clock,
	Calendar,
	Zap,
	Volume2,
	VolumeX,
	Settings,
	Target,
	Coffee,
	Dumbbell,
	BookOpen,
	Briefcase,
	BarChart3,
	Info
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

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
	category: string
}

const TIMER_PRESETS: TimerPreset[] = [
	{ name: '30 секунд', icon: Zap, duration: 30, category: 'quick' },
	{ name: '1 минута', icon: Clock, duration: 60, category: 'quick' },
	{ name: '2 минуты', icon: Clock, duration: 120, category: 'quick' },
	{ name: '5 минут', icon: Coffee, duration: 300, category: 'quick' },
	{ name: '10 минут', icon: Coffee, duration: 600, category: 'break' },
	{ name: '15 минут', icon: Coffee, duration: 900, category: 'break' },
	{ name: '20 минут', icon: Target, duration: 1200, category: 'focus' },
	{ name: '25 минут', icon: Target, duration: 1500, category: 'focus' },
	{ name: '30 минут', icon: Briefcase, duration: 1800, category: 'work' },
	{ name: '45 минут', icon: BookOpen, duration: 2700, category: 'work' },
	{ name: '1 час', icon: Briefcase, duration: 3600, category: 'work' },
	{ name: '1.5 часа', icon: Dumbbell, duration: 5400, category: 'work' }
]

const ALARM_SOUNDS = [
	{ id: 'bell', name: 'Колокольчик', url: '/sounds/bell.mp3' },
	{ id: 'chime', name: 'Перезвон', url: '/sounds/chime.mp3' },
	{ id: 'alarm', name: 'Будильник', url: '/sounds/alarm.mp3' },
	{ id: 'notification', name: 'Уведомление', url: '/sounds/notification.mp3' }
]

export default function TimerCountdownPage() {
	const [mode, setMode] = useState<TimerMode>('countdown')
	const [isRunning, setIsRunning] = useState(false)
	const [isPaused, setIsPaused] = useState(false)
	const [time, setTime] = useState<TimerState>({
		hours: 0,
		minutes: 0,
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
	const [notificationEnabled, setNotificationEnabled] = useState(true)
	const [selectedSound, setSelectedSound] = useState('bell')
	const [showMilliseconds, setShowMilliseconds] = useState(false)

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

	useEffect(() => {
		// Request notification permission
		if (
			notificationEnabled &&
			'Notification' in window &&
			Notification.permission === 'default'
		) {
			Notification.requestPermission()
		}
	}, [notificationEnabled])

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			// Space to start/pause
			if (e.code === 'Space') {
				e.preventDefault()
				if (!isRunning) {
					startTimer()
				} else if (isPaused) {
					resumeTimer()
				} else {
					pauseTimer()
				}
			}
			// Ctrl/Cmd + R to reset
			if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
				e.preventDefault()
				resetTimer()
			}
			// Ctrl/Cmd + M to change mode
			if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
				e.preventDefault()
				const modes: TimerMode[] = ['countdown', 'stopwatch', 'pomodoro']
				const currentIndex = modes.indexOf(mode)
				const nextIndex = (currentIndex + 1) % modes.length
				handleModeChange(modes[nextIndex])
			}
		}

		window.addEventListener('keydown', handleKeyPress)
		return () => window.removeEventListener('keydown', handleKeyPress)
	}, [isRunning, isPaused, mode])

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
	}, [isRunning, isPaused, mode, showMilliseconds])

	const updateTimer = () => {
		setTime(prevTime => {
			if (mode === 'countdown') {
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
					// Timer finished
					handleTimerComplete()
					return { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }
				}

				return { hours, minutes, seconds, milliseconds }
			} else if (mode === 'stopwatch') {
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
			} else {
				// Pomodoro logic - uses countdown
				return prevTime // Return unchanged for now
			}
		})
	}

	const handleTimerComplete = () => {
		setIsRunning(false)
		setIsPaused(false)

		// Play sound
		if (soundEnabled && audioRef.current) {
			audioRef.current
				.play()
				.catch(err => console.error('Error playing sound:', err))
		}

		// Show notification
		if (
			notificationEnabled &&
			'Notification' in window &&
			Notification.permission === 'granted'
		) {
			new Notification('Таймер завершен!', {
				body:
					mode === 'pomodoro'
						? `${pomodoroPhase === 'work' ? 'Рабочая сессия' : 'Перерыв'} завершен!`
						: 'Время истекло!',
				icon: '/icon.png'
			})
		}

		// Handle Pomodoro phase transitions
		if (mode === 'pomodoro') {
			handlePomodoroPhaseComplete()
		} else {
			toast.success('Таймер завершен!')
		}
	}

	const handlePomodoroPhaseComplete = () => {
		if (pomodoroPhase === 'work') {
			if (pomodoroSession % pomodoroSettings.sessionsUntilLongBreak === 0) {
				setPomodoroPhase('longBreak')
				setInitialTime({
					hours: 0,
					minutes: pomodoroSettings.longBreakDuration,
					seconds: 0,
					milliseconds: 0
				})
				toast.success('Время для длинного перерыва!')
			} else {
				setPomodoroPhase('shortBreak')
				setInitialTime({
					hours: 0,
					minutes: pomodoroSettings.shortBreakDuration,
					seconds: 0,
					milliseconds: 0
				})
				toast.success('Время для короткого перерыва!')
			}
		} else {
			setPomodoroPhase('work')
			setPomodoroSession(prev => prev + 1)
			setInitialTime({
				hours: 0,
				minutes: pomodoroSettings.workDuration,
				seconds: 0,
				milliseconds: 0
			})
			toast.success('Время работать!')
		}

		// Reset timer with new duration
		setTime({
			hours: initialTime.hours,
			minutes: initialTime.minutes,
			seconds: initialTime.seconds,
			milliseconds: 0
		})
	}

	const startTimer = () => {
		if (mode === 'countdown' || mode === 'pomodoro') {
			if (time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
				setTime({ ...initialTime })
			}
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

		if (mode === 'countdown' || mode === 'pomodoro') {
			setTime({ ...initialTime })
		} else {
			setTime({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
		}

		if (mode === 'pomodoro') {
			setPomodoroPhase('work')
			setPomodoroSession(1)
		}
	}

	const handleModeChange = (newMode: TimerMode) => {
		resetTimer()
		setMode(newMode)

		if (newMode === 'pomodoro') {
			setInitialTime({
				hours: 0,
				minutes: pomodoroSettings.workDuration,
				seconds: 0,
				milliseconds: 0
			})
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
		toast.success(`Установлен таймер: ${preset.name}`)
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
					color: 'text-blue-600',
					bgColor: 'bg-blue-50 dark:bg-blue-950/20'
				}
			case 'shortBreak':
				return {
					label: 'Короткий перерыв',
					color: 'text-green-600',
					bgColor: 'bg-green-50 dark:bg-green-950/20'
				}
			case 'longBreak':
				return {
					label: 'Длинный перерыв',
					color: 'text-purple-600',
					bgColor: 'bg-purple-50 dark:bg-purple-950/20'
				}
		}
	}

	return (
		<div className='max-w-4xl mx-auto space-y-6'>
			{/* Mode Selection */}
			<Card className='p-6'>
				<RadioGroup
					value={mode}
					onValueChange={(value: TimerMode) => handleModeChange(value)}
				>
					<div className='grid grid-cols-3 gap-4'>
						<div
							className={cn(
								'relative flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-colors',
								mode === 'countdown'
									? 'bg-primary/10 border-primary'
									: 'hover:bg-muted/50'
							)}
							onClick={() => handleModeChange('countdown')}
						>
							<RadioGroupItem value='countdown' id='countdown' />
							<Label htmlFor='countdown' className='cursor-pointer'>
								<div className='flex items-center gap-2'>
									<Clock className='w-4 h-4' />
									<span>Таймер</span>
								</div>
								<p className='text-xs text-muted-foreground mt-1'>
									Обратный отсчет
								</p>
							</Label>
						</div>

						<div
							className={cn(
								'relative flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-colors',
								mode === 'stopwatch'
									? 'bg-primary/10 border-primary'
									: 'hover:bg-muted/50'
							)}
							onClick={() => handleModeChange('stopwatch')}
						>
							<RadioGroupItem value='stopwatch' id='stopwatch' />
							<Label htmlFor='stopwatch' className='cursor-pointer'>
								<div className='flex items-center gap-2'>
									<Timer className='w-4 h-4' />
									<span>Секундомер</span>
								</div>
								<p className='text-xs text-muted-foreground mt-1'>
									Прямой отсчет
								</p>
							</Label>
						</div>

						<div
							className={cn(
								'relative flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-colors',
								mode === 'pomodoro'
									? 'bg-primary/10 border-primary'
									: 'hover:bg-muted/50'
							)}
							onClick={() => handleModeChange('pomodoro')}
						>
							<RadioGroupItem value='pomodoro' id='pomodoro' />
							<Label htmlFor='pomodoro' className='cursor-pointer'>
								<div className='flex items-center gap-2'>
									<Target className='w-4 h-4' />
									<span>Pomodoro</span>
								</div>
								<p className='text-xs text-muted-foreground mt-1'>
									Техника фокуса
								</p>
							</Label>
						</div>
					</div>
				</RadioGroup>
			</Card>

			<div className='grid lg:grid-cols-2 gap-6'>
				{/* Timer Display */}
				<Card className='p-6'>
					<div className='space-y-6'>
						{/* Pomodoro Info */}
						{mode === 'pomodoro' && (
							<div
								className={cn(
									'p-3 rounded-lg text-center',
									getPomodoroPhaseInfo().bgColor
								)}
							>
								<div
									className={cn('font-medium', getPomodoroPhaseInfo().color)}
								>
									{getPomodoroPhaseInfo().label}
								</div>
								<div className='text-sm text-muted-foreground mt-1'>
									Сессия {pomodoroSession}
								</div>
							</div>
						)}

						{/* Time Display */}
						<div className='text-center'>
							<div className='text-6xl lg:text-7xl font-mono font-bold tracking-tight'>
								{formatTime(time.hours)}:{formatTime(time.minutes)}:
								{formatTime(time.seconds)}
								{showMilliseconds && (
									<span className='text-3xl lg:text-4xl text-muted-foreground'>
										.{formatTime(Math.floor(time.milliseconds / 10))}
									</span>
								)}
							</div>
						</div>

						{/* Progress Bar */}
						{(mode === 'countdown' || mode === 'pomodoro') && (
							<Progress value={getProgress()} className='h-2' />
						)}

						{/* Controls */}
						<div className='flex justify-center gap-3'>
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

						{/* Time Input (for countdown mode) */}
						{mode === 'countdown' && !isRunning && (
							<div className='grid grid-cols-3 gap-4'>
								<div>
									<Label htmlFor='hours'>Часы</Label>
									<Input
										id='hours'
										type='number'
										min='0'
										max='23'
										value={initialTime.hours}
										onChange={e =>
											setInitialTime(prev => ({
												...prev,
												hours: parseInt(e.target.value) || 0
											}))
										}
										className='mt-1'
									/>
								</div>
								<div>
									<Label htmlFor='minutes'>Минуты</Label>
									<Input
										id='minutes'
										type='number'
										min='0'
										max='59'
										value={initialTime.minutes}
										onChange={e =>
											setInitialTime(prev => ({
												...prev,
												minutes: parseInt(e.target.value) || 0
											}))
										}
										className='mt-1'
									/>
								</div>
								<div>
									<Label htmlFor='seconds'>Секунды</Label>
									<Input
										id='seconds'
										type='number'
										min='0'
										max='59'
										value={initialTime.seconds}
										onChange={e =>
											setInitialTime(prev => ({
												...prev,
												seconds: parseInt(e.target.value) || 0
											}))
										}
										className='mt-1'
									/>
								</div>
							</div>
						)}

						{/* Pomodoro Settings */}
						{mode === 'pomodoro' && !isRunning && (
							<div className='space-y-3'>
								<div className='grid grid-cols-2 gap-4'>
									<div>
										<Label htmlFor='work-duration'>Работа (мин)</Label>
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
											className='mt-1'
										/>
									</div>
									<div>
										<Label htmlFor='short-break'>Короткий перерыв (мин)</Label>
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
											className='mt-1'
										/>
									</div>
								</div>
								<div className='grid grid-cols-2 gap-4'>
									<div>
										<Label htmlFor='long-break'>Длинный перерыв (мин)</Label>
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
											className='mt-1'
										/>
									</div>
									<div>
										<Label htmlFor='sessions'>
											Сессий до длинного перерыва
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
											className='mt-1'
										/>
									</div>
								</div>
							</div>
						)}
					</div>
				</Card>

				{/* Settings and Presets */}
				<div className='space-y-6'>
					{/* Settings */}
					<Card className='p-6'>
						<h3 className='font-semibold mb-4 flex items-center gap-2'>
							<Settings className='w-5 h-5' />
							Настройки
						</h3>

						<div className='space-y-4'>
							<div className='flex items-center justify-between'>
								<Label htmlFor='sound' className='flex items-center gap-2'>
									{soundEnabled ? (
										<Volume2 className='w-4 h-4' />
									) : (
										<VolumeX className='w-4 h-4' />
									)}
									Звуковое уведомление
								</Label>
								<Switch
									id='sound'
									checked={soundEnabled}
									onCheckedChange={setSoundEnabled}
								/>
							</div>

							<div className='flex items-center justify-between'>
								<Label
									htmlFor='notification'
									className='flex items-center gap-2'
								>
									{notificationEnabled ? (
										<Bell className='w-4 h-4' />
									) : (
										<BellOff className='w-4 h-4' />
									)}
									Push-уведомления
								</Label>
								<Switch
									id='notification'
									checked={notificationEnabled}
									onCheckedChange={setNotificationEnabled}
								/>
							</div>

							<div className='flex items-center justify-between'>
								<Label
									htmlFor='milliseconds'
									className='flex items-center gap-2'
								>
									<Zap className='w-4 h-4' />
									Показывать миллисекунды
								</Label>
								<Switch
									id='milliseconds'
									checked={showMilliseconds}
									onCheckedChange={setShowMilliseconds}
								/>
							</div>

							{/* Sound Selection */}
							{soundEnabled && (
								<div>
									<Label htmlFor='alarm-sound'>Звук уведомления</Label>
									<select
										id='alarm-sound'
										value={selectedSound}
										onChange={e => setSelectedSound(e.target.value)}
										className='w-full mt-1 px-3 py-2 rounded-md border bg-background'
									>
										{ALARM_SOUNDS.map(sound => (
											<option key={sound.id} value={sound.id}>
												{sound.name}
											</option>
										))}
									</select>
								</div>
							)}
						</div>
					</Card>

					{/* Quick Presets (for countdown mode) */}
					{mode === 'countdown' && (
						<Card className='p-6'>
							<h3 className='font-semibold mb-4 flex items-center gap-2'>
								<Clock className='w-5 h-5' />
								Быстрые пресеты
							</h3>

							<div className='space-y-3'>
								{['quick', 'break', 'focus', 'work'].map(category => (
									<div key={category}>
										<h4 className='text-sm font-medium text-muted-foreground mb-2 capitalize'>
											{category === 'quick'
												? 'Быстрые'
												: category === 'break'
													? 'Перерывы'
													: category === 'focus'
														? 'Фокус'
														: 'Работа'}
										</h4>
										<div className='grid grid-cols-2 gap-2'>
											{TIMER_PRESETS.filter(
												preset => preset.category === category
											).map((preset, index) => (
												<Button
													key={index}
													onClick={() => loadPreset(preset)}
													variant='outline'
													size='sm'
													className='justify-start'
													disabled={isRunning}
												>
													<preset.icon className='w-4 h-4 mr-2' />
													{preset.name}
												</Button>
											))}
										</div>
									</div>
								))}
							</div>
						</Card>
					)}

					{/* Statistics */}
					{mode === 'pomodoro' && (
						<Card className='p-6'>
							<h3 className='font-semibold mb-4 flex items-center gap-2'>
								<BarChart3 className='w-5 h-5' />
								Статистика сессии
							</h3>

							<div className='space-y-3'>
								<div className='flex justify-between items-center p-3 rounded-lg bg-muted/50'>
									<span className='text-sm text-muted-foreground'>
										Завершено сессий
									</span>
									<Badge variant='secondary'>{pomodoroSession - 1}</Badge>
								</div>
								<div className='flex justify-between items-center p-3 rounded-lg bg-muted/50'>
									<span className='text-sm text-muted-foreground'>
										Текущая фаза
									</span>
									<Badge className={getPomodoroPhaseInfo().color}>
										{getPomodoroPhaseInfo().label}
									</Badge>
								</div>
								<div className='flex justify-between items-center p-3 rounded-lg bg-muted/50'>
									<span className='text-sm text-muted-foreground'>
										До длинного перерыва
									</span>
									<Badge variant='outline'>
										{pomodoroSettings.sessionsUntilLongBreak -
											((pomodoroSession - 1) %
												pomodoroSettings.sessionsUntilLongBreak)}
									</Badge>
								</div>
							</div>
						</Card>
					)}
				</div>
			</div>

			{/* Info */}
			<Card className='p-6 bg-muted/50'>
				<h3 className='font-semibold mb-4 flex items-center gap-2'>
					<Info className='w-4 h-4' />
					Информация о режимах
				</h3>
				<div className='grid md:grid-cols-3 gap-6 text-sm'>
					<div>
						<h4 className='font-medium mb-2'>Таймер</h4>
						<ul className='text-muted-foreground space-y-1'>
							<li>• Обратный отсчет времени</li>
							<li>• Настраиваемая длительность</li>
							<li>• Звуковые уведомления</li>
							<li>• Быстрые пресеты</li>
						</ul>
					</div>
					<div>
						<h4 className='font-medium mb-2'>Секундомер</h4>
						<ul className='text-muted-foreground space-y-1'>
							<li>• Прямой отсчет времени</li>
							<li>• Высокая точность</li>
							<li>• Пауза и продолжение</li>
							<li>• Без ограничений</li>
						</ul>
					</div>
					<div>
						<h4 className='font-medium mb-2'>Pomodoro</h4>
						<ul className='text-muted-foreground space-y-1'>
							<li>• Циклы работы и отдыха</li>
							<li>• Повышение продуктивности</li>
							<li>• Автоматические переходы</li>
							<li>• Настраиваемые интервалы</li>
						</ul>
					</div>
				</div>
			</Card>

			{/* Hidden audio element */}
			<audio
				ref={audioRef}
				src={ALARM_SOUNDS.find(s => s.id === selectedSound)?.url}
				preload='auto'
			/>
		</div>
	)
}

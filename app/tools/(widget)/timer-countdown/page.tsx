'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
	Timer,
	Play,
	Pause,
	RotateCcw,
	Volume2,
	VolumeX,
	Clock,
	Target,
	Zap,
	Coffee,
	Briefcase,
	Brain
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'

import { SlidingTimer } from '@/components/widgets/timer/SlidingTimer'
import { SlidingCountdown } from '@/components/widgets/timer/SlidingCountdown'
import { AnimatedProgressBar } from '@/components/widgets/timer/AnimatedProgressBar'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { TimerCountdownSeo } from './TimerCountdownSeo'

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
	const widget = getWidgetById('timer-countdown')!
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

	const phaseInfo = getPomodoroPhaseInfo()

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: три разных инструмента в одном — таймер,
				    секундомер и помодоро. Раньше это были вкладки во всю ширину,
				    а звук и миллисекунды прятались под безымянной шестерёнкой в
				    углу карточки. */}
				<div className={toolBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						{(
							[
								['countdown', 'Таймер'],
								['stopwatch', 'Секундомер'],
								['pomodoro', 'Помодоро']
							] as [TimerMode, string][]
						).map(([value, label]) => (
							<button
								key={value}
								type='button'
								onClick={() => handleModeChange(value)}
								aria-pressed={mode === value}
								className={toolPill(mode === value)}
							>
								{label}
							</button>
						))}
					</div>

					<div className='flex flex-wrap items-center gap-1.5 sm:ml-auto'>
						{mode === 'stopwatch' && (
							<button
								type='button'
								onClick={() => setShowMilliseconds(!showMilliseconds)}
								aria-pressed={showMilliseconds}
								title='Показывать сотые доли секунды'
								className={toolPill(showMilliseconds)}
							>
								миллисекунды
							</button>
						)}
						<Button
							size='icon'
							variant='ghost'
							onClick={() => setSoundEnabled(!soundEnabled)}
							title={soundEnabled ? 'Звук включён' : 'Звук выключен'}
							className={toolIconButton}
						>
							{soundEnabled ? (
								<Volume2 className='h-4 w-4' />
							) : (
								<VolumeX className='h-4 w-4' />
							)}
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={resetTimer}
							title='Сбросить'
							className={toolIconButton}
						>
							<RotateCcw className='h-4 w-4' />
						</Button>
					</div>
				</div>

				<div className='px-5 py-8 sm:px-6'>
					{mode === 'pomodoro' && (
						<p
							className={cn(
								'mb-6 text-center text-sm font-medium',
								phaseInfo.color
							)}
						>
							{phaseInfo.label} · сессия {pomodoroSession}
						</p>
					)}

					<div className='text-center'>
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

					{(mode === 'countdown' || mode === 'pomodoro') && (
						<AnimatedProgressBar
							value={smoothProgress}
							className='mt-8 h-1.5'
						/>
					)}

					<div className='mt-8 flex justify-center'>
						{!isRunning ? (
							<Button onClick={startTimer} className='cursor-pointer gap-2'>
								<Play className='h-4 w-4' />
								Старт
							</Button>
						) : isPaused ? (
							<Button onClick={resumeTimer} className='cursor-pointer gap-2'>
								<Play className='h-4 w-4' />
								Продолжить
							</Button>
						) : (
							<Button
								onClick={pauseTimer}
								variant='secondary'
								className='cursor-pointer gap-2'
							>
								<Pause className='h-4 w-4' />
								Пауза
							</Button>
						)}
					</div>
				</div>

				{/* Полоса частых интервалов: пока таймер не запущен, это самый
				    быстрый способ его завести. */}
				{mode === 'countdown' && !isRunning && (
					<div className={toolFooterBar}>
						<span className='mr-1 text-sm text-muted-foreground'>Частое</span>
						{TIMER_PRESETS.map((preset, index) => (
							<button
								key={index}
								type='button'
								onClick={() => loadPreset(preset)}
								className={toolPill(false, 'flex items-center gap-1.5')}
							>
								<preset.icon className='h-3.5 w-3.5' />
								{preset.name}
							</button>
						))}
					</div>
				)}

				{/* Полоса помодоро: длительности фаз. Раньше четыре поля жили
				    внутри выпадающего меню под шестерёнкой. */}
				{mode === 'pomodoro' && !isRunning && (
					<div className={toolFooterBar}>
						{(
							[
								['workDuration', 'работа', 1, 60],
								['shortBreakDuration', 'перерыв', 1, 30],
								['longBreakDuration', 'длинный', 1, 60],
								['sessionsUntilLongBreak', 'сессий', 2, 10]
							] as [keyof PomodoroSettings, string, number, number][]
						).map(([key, label, min, max]) => (
							<label
								key={key}
								className='flex items-center gap-2 text-sm text-muted-foreground'
							>
								{label}
								<input
									type='number'
									min={min}
									max={max}
									value={pomodoroSettings[key]}
									onChange={event =>
										setPomodoroSettings(prev => ({
											...prev,
											[key]: parseInt(event.target.value) || min
										}))
									}
									aria-label={label}
									className='w-16 rounded-md border bg-background px-2 py-1 text-center font-mono text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
								/>
							</label>
						))}
					</div>
				)}
			</Card>

			<TimerCountdownSeo />
		</WidgetSEOWrapper>
	)
}

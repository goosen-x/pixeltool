'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { KeyboardShortcutInfo } from '@/components/widgets'
import {
	Timer,
	Play,
	Pause,
	RotateCcw,
	SkipForward,
	Settings,
	BarChart3,
	Target,
	Volume2,
	VolumeX,
	Bell,
	Coffee
} from 'lucide-react'

type SessionType = 'work' | 'shortBreak' | 'longBreak'

interface TimerSettings {
	workDuration: number // in minutes
	shortBreakDuration: number
	longBreakDuration: number
	pomodorosUntilLongBreak: number
	soundEnabled: boolean
	autoStartBreaks: boolean
	autoStartPomodoros: boolean
	showNotifications: boolean
	dailyGoal: number
}

interface Statistics {
	completedPomodoros: number
	totalFocusTime: number // in seconds
	totalBreakTime: number // in seconds
	currentStreak: number
	date: string
}

const DEFAULT_SETTINGS: TimerSettings = {
	workDuration: 25,
	shortBreakDuration: 5,
	longBreakDuration: 15,
	pomodorosUntilLongBreak: 4,
	soundEnabled: true,
	autoStartBreaks: true,
	autoStartPomodoros: false,
	showNotifications: true,
	dailyGoal: 8
}

export default function PomodoroTimerPage() {
	const t = useTranslations('widgets.pomodoroTimer')

	// Timer state
	const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS)
	const [sessionType, setSessionType] = useState<SessionType>('work')
	const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60)
	const [isRunning, setIsRunning] = useState(false)
	const [completedPomodoros, setCompletedPomodoros] = useState(0)

	// Statistics
	const [stats, setStats] = useState<Statistics>({
		completedPomodoros: 0,
		totalFocusTime: 0,
		totalBreakTime: 0,
		currentStreak: 0,
		date: new Date().toDateString()
	})

	// UI state
	const [showSettings, setShowSettings] = useState(false)
	const [editingSettings, setEditingSettings] =
		useState<TimerSettings>(settings)

	// Refs
	const intervalRef = useRef<NodeJS.Timeout | null>(null)
	const audioRef = useRef<HTMLAudioElement | null>(null)

	// Load settings and stats from localStorage
	useEffect(() => {
		const savedSettings = localStorage.getItem('pomodoroSettings')
		const savedStats = localStorage.getItem('pomodoroStats')

		if (savedSettings) {
			const parsed = JSON.parse(savedSettings)
			setSettings(parsed)
			setEditingSettings(parsed)
			setTimeLeft(parsed.workDuration * 60)
		}

		if (savedStats) {
			const parsed = JSON.parse(savedStats)
			// Reset stats if it's a new day
			if (parsed.date !== new Date().toDateString()) {
				const newStats = {
					...parsed,
					completedPomodoros: 0,
					totalFocusTime: 0,
					totalBreakTime: 0,
					date: new Date().toDateString()
				}
				setStats(newStats)
				localStorage.setItem('pomodoroStats', JSON.stringify(newStats))
			} else {
				setStats(parsed)
			}
		}
	}, [])

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			// Space to start/pause
			if (e.code === 'Space') {
				e.preventDefault()
				toggleTimer()
			}
			// Ctrl/Cmd + R to reset
			if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
				e.preventDefault()
				resetTimer()
			}
			// Ctrl/Cmd + N to next session (skip)
			if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
				e.preventDefault()
				skipSession()
			}
			// Ctrl/Cmd + S to toggle settings
			if ((e.ctrlKey || e.metaKey) && e.key === 's') {
				e.preventDefault()
				setShowSettings(!showSettings)
			}
		}

		window.addEventListener('keydown', handleKeyPress)
		return () => window.removeEventListener('keydown', handleKeyPress)
	}, [showSettings])

	// Timer logic
	useEffect(() => {
		if (isRunning && timeLeft > 0) {
			intervalRef.current = setInterval(() => {
				setTimeLeft(prev => {
					if (prev <= 1) {
						handleSessionComplete()
						return 0
					}
					return prev - 1
				})

				// Update statistics
				if (sessionType === 'work') {
					setStats(prev => ({
						...prev,
						totalFocusTime: prev.totalFocusTime + 1
					}))
				} else {
					setStats(prev => ({
						...prev,
						totalBreakTime: prev.totalBreakTime + 1
					}))
				}
			}, 1000)
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
	}, [isRunning, timeLeft, sessionType])

	// Save stats to localStorage when they change
	useEffect(() => {
		localStorage.setItem('pomodoroStats', JSON.stringify(stats))
	}, [stats])

	// Handle session completion
	const handleSessionComplete = () => {
		setIsRunning(false)

		if (settings.soundEnabled) {
			playSound()
		}

		if (settings.showNotifications) {
			showNotification()
		}

		if (sessionType === 'work') {
			const newCompletedPomodoros = completedPomodoros + 1
			setCompletedPomodoros(newCompletedPomodoros)
			setStats(prev => ({
				...prev,
				completedPomodoros: prev.completedPomodoros + 1,
				currentStreak: prev.currentStreak + 1
			}))

			// Check if daily goal is reached
			if (stats.completedPomodoros + 1 === settings.dailyGoal) {
				toast.success(t('notifications.goalReached'))
			}

			// Determine next session
			if (newCompletedPomodoros % settings.pomodorosUntilLongBreak === 0) {
				setSessionType('longBreak')
				setTimeLeft(settings.longBreakDuration * 60)
				if (settings.autoStartBreaks) {
					setTimeout(() => setIsRunning(true), 1000)
				}
			} else {
				setSessionType('shortBreak')
				setTimeLeft(settings.shortBreakDuration * 60)
				if (settings.autoStartBreaks) {
					setTimeout(() => setIsRunning(true), 1000)
				}
			}
		} else {
			// Break completed
			setSessionType('work')
			setTimeLeft(settings.workDuration * 60)
			if (settings.autoStartPomodoros) {
				setTimeout(() => setIsRunning(true), 1000)
			}
		}
	}

	// Play notification sound
	const playSound = () => {
		if (!audioRef.current) {
			audioRef.current = new Audio('/notification.mp3')
		}
		audioRef.current.play().catch(() => {
			// Fallback beep sound using Web Audio API
			const audioContext = new (window.AudioContext ||
				(window as any).webkitAudioContext)()
			const oscillator = audioContext.createOscillator()
			oscillator.connect(audioContext.destination)
			oscillator.frequency.value = 800
			oscillator.start()
			oscillator.stop(audioContext.currentTime + 0.2)
		})
	}

	// Show desktop notification
	const showNotification = () => {
		if ('Notification' in window && Notification.permission === 'granted') {
			const title =
				sessionType === 'work' ? t('sessionComplete') : t('backToWork')
			const body =
				sessionType === 'work'
					? t('notifications.workComplete')
					: sessionType === 'longBreak'
						? t('notifications.longBreakComplete')
						: t('notifications.breakComplete')

			new Notification(title, { body, icon: '/favicon.ico' })
		}
	}

	// Request notification permission
	const requestNotificationPermission = () => {
		if ('Notification' in window && Notification.permission === 'default') {
			Notification.requestPermission()
		}
	}

	// Control functions
	const toggleTimer = () => {
		if (!isRunning && settings.showNotifications) {
			requestNotificationPermission()
		}
		setIsRunning(!isRunning)
	}

	const resetTimer = () => {
		setIsRunning(false)
		setTimeLeft(
			sessionType === 'work'
				? settings.workDuration * 60
				: sessionType === 'shortBreak'
					? settings.shortBreakDuration * 60
					: settings.longBreakDuration * 60
		)
		if (sessionType !== 'work') {
			setStats(prev => ({
				...prev,
				currentStreak: 0
			}))
		}
	}

	const skipSession = () => {
		setIsRunning(false)
		handleSessionComplete()
	}

	const saveSettings = () => {
		setSettings(editingSettings)
		localStorage.setItem('pomodoroSettings', JSON.stringify(editingSettings))
		setShowSettings(false)

		// Update current timer if not running
		if (!isRunning) {
			setTimeLeft(
				sessionType === 'work'
					? editingSettings.workDuration * 60
					: sessionType === 'shortBreak'
						? editingSettings.shortBreakDuration * 60
						: editingSettings.longBreakDuration * 60
			)
		}

		toast.success(t('settings.saved'))
	}

	// Format time display
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
	}

	// Format duration for stats
	const formatDuration = (seconds: number) => {
		const hours = Math.floor(seconds / 3600)
		const minutes = Math.floor((seconds % 3600) / 60)

		if (hours > 0) {
			return `${hours} ${hours === 1 ? t('hour') : t('hours')} ${minutes} ${t('minute')}`
		}
		return `${minutes} ${t('minute')}`
	}

	// Calculate progress
	const totalSeconds =
		sessionType === 'work'
			? settings.workDuration * 60
			: sessionType === 'shortBreak'
				? settings.shortBreakDuration * 60
				: settings.longBreakDuration * 60
	const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100

	// Get session colors
	const getSessionColor = () => {
		switch (sessionType) {
			case 'work':
				return 'text-red-600'
			case 'shortBreak':
				return 'text-green-600'
			case 'longBreak':
				return 'text-blue-600'
		}
	}

	return (
		<div className='container mx-auto p-4 max-w-6xl'>
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* Main Timer */}
				<div className='lg:col-span-2 space-y-6'>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center justify-between'>
								<span>{t('currentSession')}</span>
								<Badge variant='secondary' className={getSessionColor()}>
									{sessionType === 'work'
										? t('work')
										: sessionType === 'longBreak'
											? t('longBreakSession')
											: t('break')}
								</Badge>
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-6'>
							{/* Timer Display */}
							<div className='text-center'>
								<div
									className={`text-7xl font-mono font-bold ${getSessionColor()}`}
								>
									{formatTime(timeLeft)}
								</div>
								<Progress value={progress} className='mt-4' />
							</div>

							{/* Control Buttons */}
							<div className='flex justify-center gap-2'>
								<Button
									size='lg'
									onClick={toggleTimer}
									className='min-w-[100px]'
								>
									{isRunning ? (
										<>
											<Pause className='w-4 h-4 mr-2' />
											{t('pause')}
										</>
									) : (
										<>
											<Play className='w-4 h-4 mr-2' />
											{timeLeft === totalSeconds ? t('start') : t('resume')}
										</>
									)}
								</Button>
								<Button size='lg' variant='outline' onClick={resetTimer}>
									<RotateCcw className='w-4 h-4 mr-2' />
									{t('reset')}
								</Button>
								<Button size='lg' variant='outline' onClick={skipSession}>
									<SkipForward className='w-4 h-4 mr-2' />
									{t('skip')}
								</Button>
							</div>

							{/* Session Indicators */}
							<div className='flex justify-center gap-2'>
								{Array.from({ length: settings.pomodorosUntilLongBreak }).map(
									(_, i) => (
										<div
											key={i}
											className={`w-3 h-3 rounded-full ${
												i <
												completedPomodoros % settings.pomodorosUntilLongBreak
													? 'bg-red-600'
													: 'bg-gray-300'
											}`}
										/>
									)
								)}
							</div>
						</CardContent>
					</Card>

					{/* Settings */}
					{showSettings && (
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Settings className='w-4 h-4' />
									{t('settings.title')}
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div>
										<Label htmlFor='workDuration'>{t('workDuration')}</Label>
										<div className='flex items-center gap-2'>
											<Input
												id='workDuration'
												type='number'
												min='1'
												max='60'
												value={editingSettings.workDuration}
												onChange={e =>
													setEditingSettings({
														...editingSettings,
														workDuration: parseInt(e.target.value) || 25
													})
												}
											/>
											<span className='text-sm text-muted-foreground'>
												{t('minutes')}
											</span>
										</div>
									</div>
									<div>
										<Label htmlFor='shortBreak'>{t('shortBreak')}</Label>
										<div className='flex items-center gap-2'>
											<Input
												id='shortBreak'
												type='number'
												min='1'
												max='30'
												value={editingSettings.shortBreakDuration}
												onChange={e =>
													setEditingSettings({
														...editingSettings,
														shortBreakDuration: parseInt(e.target.value) || 5
													})
												}
											/>
											<span className='text-sm text-muted-foreground'>
												{t('minutes')}
											</span>
										</div>
									</div>
									<div>
										<Label htmlFor='longBreak'>{t('longBreak')}</Label>
										<div className='flex items-center gap-2'>
											<Input
												id='longBreak'
												type='number'
												min='5'
												max='60'
												value={editingSettings.longBreakDuration}
												onChange={e =>
													setEditingSettings({
														...editingSettings,
														longBreakDuration: parseInt(e.target.value) || 15
													})
												}
											/>
											<span className='text-sm text-muted-foreground'>
												{t('minutes')}
											</span>
										</div>
									</div>
									<div>
										<Label htmlFor='pomodorosUntilLongBreak'>
											{t('pomodorosUntilLongBreak')}
										</Label>
										<Input
											id='pomodorosUntilLongBreak'
											type='number'
											min='2'
											max='10'
											value={editingSettings.pomodorosUntilLongBreak}
											onChange={e =>
												setEditingSettings({
													...editingSettings,
													pomodorosUntilLongBreak: parseInt(e.target.value) || 4
												})
											}
										/>
									</div>
								</div>

								<div className='space-y-3'>
									<div className='flex items-center justify-between'>
										<Label
											htmlFor='soundEnabled'
											className='flex items-center gap-2'
										>
											{editingSettings.soundEnabled ? (
												<Volume2 className='w-4 h-4' />
											) : (
												<VolumeX className='w-4 h-4' />
											)}
											{t('settings.soundEnabled')}
										</Label>
										<Switch
											id='soundEnabled'
											checked={editingSettings.soundEnabled}
											onCheckedChange={checked =>
												setEditingSettings({
													...editingSettings,
													soundEnabled: checked
												})
											}
										/>
									</div>
									<div className='flex items-center justify-between'>
										<Label htmlFor='autoStartBreaks'>
											{t('settings.autoStartBreaks')}
										</Label>
										<Switch
											id='autoStartBreaks'
											checked={editingSettings.autoStartBreaks}
											onCheckedChange={checked =>
												setEditingSettings({
													...editingSettings,
													autoStartBreaks: checked
												})
											}
										/>
									</div>
									<div className='flex items-center justify-between'>
										<Label htmlFor='autoStartPomodoros'>
											{t('settings.autoStartPomodoros')}
										</Label>
										<Switch
											id='autoStartPomodoros'
											checked={editingSettings.autoStartPomodoros}
											onCheckedChange={checked =>
												setEditingSettings({
													...editingSettings,
													autoStartPomodoros: checked
												})
											}
										/>
									</div>
									<div className='flex items-center justify-between'>
										<Label
											htmlFor='showNotifications'
											className='flex items-center gap-2'
										>
											<Bell className='w-4 h-4' />
											{t('settings.showNotifications')}
										</Label>
										<Switch
											id='showNotifications'
											checked={editingSettings.showNotifications}
											onCheckedChange={checked =>
												setEditingSettings({
													...editingSettings,
													showNotifications: checked
												})
											}
										/>
									</div>
								</div>

								<div className='flex gap-2'>
									<Button onClick={saveSettings}>{t('settings.save')}</Button>
									<Button
										variant='outline'
										onClick={() => {
											setEditingSettings(settings)
											setShowSettings(false)
										}}
									>
										{t('settings.cancel')}
									</Button>
								</div>
							</CardContent>
						</Card>
					)}
				</div>

				{/* Right Sidebar */}
				<div className='space-y-6'>
					{/* Statistics */}
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<BarChart3 className='w-4 h-4' />
								{t('todayStats')}
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-3'>
							<div className='flex items-center justify-between'>
								<span className='text-sm text-muted-foreground'>
									{t('completedPomodoros')}
								</span>
								<Badge variant='secondary'>{stats.completedPomodoros}</Badge>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-sm text-muted-foreground'>
									{t('totalFocusTime')}
								</span>
								<span className='text-sm font-medium'>
									{formatDuration(stats.totalFocusTime)}
								</span>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-sm text-muted-foreground'>
									{t('totalBreakTime')}
								</span>
								<span className='text-sm font-medium'>
									{formatDuration(stats.totalBreakTime)}
								</span>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-sm text-muted-foreground'>
									{t('currentStreak')}
								</span>
								<Badge variant='outline'>{stats.currentStreak}</Badge>
							</div>
						</CardContent>
					</Card>

					{/* Daily Goal */}
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Target className='w-4 h-4' />
								{t('goals.title')}
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-3'>
							<div className='flex items-center justify-between'>
								<span className='text-sm text-muted-foreground'>
									{t('goals.goal')}
								</span>
								<Badge>{settings.dailyGoal}</Badge>
							</div>
							<div className='space-y-2'>
								<div className='flex items-center justify-between text-sm'>
									<span>{t('goals.progress')}</span>
									<span className='font-medium'>
										{stats.completedPomodoros} / {settings.dailyGoal}
									</span>
								</div>
								<Progress
									value={(stats.completedPomodoros / settings.dailyGoal) * 100}
									className='h-2'
								/>
							</div>
						</CardContent>
					</Card>

					{/* Quick Actions */}
					<Card>
						<CardContent className='pt-6'>
							<Button
								variant='outline'
								className='w-full'
								onClick={() => setShowSettings(!showSettings)}
							>
								<Settings className='w-4 h-4 mr-2' />
								{showSettings ? t('settings.hide') : t('settings.show')}
							</Button>
						</CardContent>
					</Card>

					{/* Tips */}
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Coffee className='w-4 h-4' />
								{t('tips.title')}
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-2 text-sm text-muted-foreground'>
							<p>• {t('tips.tip1')}</p>
							<p>• {t('tips.tip2')}</p>
							<p>• {t('tips.tip3')}</p>
							<p>• {t('tips.tip4')}</p>
						</CardContent>
					</Card>

					{/* Keyboard Shortcuts */}
					<KeyboardShortcutInfo />
				</div>
			</div>
		</div>
	)
}

'use client'

import { useState, useEffect } from 'react'
import { Activity } from 'lucide-react'
import { sendHeartbeat } from '@/lib/session'

export const OnlineUsers = () => {
	const [onlineCount, setOnlineCount] = useState(1)
	const [isBlinking, setIsBlinking] = useState(true)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		// Send initial heartbeat
		sendHeartbeat()

		// Send heartbeat every 30 seconds
		const heartbeatInterval = setInterval(() => {
			sendHeartbeat()
		}, 30000)

		// Функция для получения реальных данных
		const fetchOnlineUsers = async () => {
			try {
				const response = await fetch('/api/analytics/online', {
					cache: 'no-store',
					headers: {
						'Cache-Control': 'no-cache',
						Pragma: 'no-cache'
					}
				})

				if (response.ok) {
					const data = await response.json()
					// Show at least 1 user (current user) even if Redis returns 0
					const count = Math.max(1, data.onlineUsers || 0)
					setOnlineCount(count)
					console.log('🔄 Online users updated:', count, '(Redis:', data.onlineUsers, ')')

					// Добавляем эффект мигания при обновлении
					setIsBlinking(true)
					setTimeout(() => setIsBlinking(false), 2000)
				} else {
					// Show current user even on API error
					setOnlineCount(1)
				}
			} catch (error) {
				console.error('Failed to fetch online users:', error)
				// Show current user even on error
				setOnlineCount(1)
			} finally {
				setIsLoading(false)
			}
		}

		// Загружаем данные сразу
		fetchOnlineUsers()

		// Обновляем каждые 10 секунд для более актуальных данных
		const fetchInterval = setInterval(fetchOnlineUsers, 10000)

		return () => {
			clearInterval(heartbeatInterval)
			clearInterval(fetchInterval)
		}
	}, [])

	// Always show at least current user (minimum 1)
	// Component is now always visible when not loading

	return (
		<div className='inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 rounded-full bg-gradient-to-r from-green-500/15 to-emerald-500/15 border border-green-500/30 backdrop-blur-sm shadow-lg hover:shadow-green-500/20 transition-all duration-300'>
			{/* Animated green dot */}
			<div className='relative flex items-center justify-center'>
				<div className='absolute w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full animate-ping opacity-100' />
				<div className='absolute w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse' />
				<div
					className={`w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-300 rounded-full ${isBlinking ? 'animate-bounce' : ''}`}
				/>
			</div>

			<Activity className='hidden sm:block w-4 h-4 text-green-600 dark:text-green-400' />

			<div className='flex items-center gap-1'>
				{isLoading ? (
					<div className='w-6 h-3 sm:w-8 sm:h-4 bg-green-600/20 dark:bg-green-400/20 rounded animate-pulse' />
				) : (
					<span
						className={`text-xs sm:text-sm font-bold text-green-700 dark:text-green-300 transition-all duration-300 ${isBlinking ? 'scale-110' : ''}`}
					>
						{onlineCount.toLocaleString()}
					</span>
				)}
				<span className='text-[10px] sm:text-xs font-medium text-green-600/80 dark:text-green-400/80'>
					онлайн
				</span>
			</div>
		</div>
	)
}

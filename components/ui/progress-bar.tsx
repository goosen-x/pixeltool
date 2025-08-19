'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
	isLoading: boolean
	className?: string
}

export function ProgressBar({ isLoading, className }: ProgressBarProps) {
	const [progress, setProgress] = useState(0)
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		if (isLoading) {
			setIsVisible(true)
			setProgress(0)

			// Simulate progress
			const timer1 = setTimeout(() => setProgress(30), 100)
			const timer2 = setTimeout(() => setProgress(60), 200)
			const timer3 = setTimeout(() => setProgress(90), 300)

			return () => {
				clearTimeout(timer1)
				clearTimeout(timer2)
				clearTimeout(timer3)
			}
		} else {
			setProgress(100)
			const hideTimer = setTimeout(() => {
				setIsVisible(false)
				setProgress(0)
			}, 300)

			return () => clearTimeout(hideTimer)
		}
	}, [isLoading])

	if (!isVisible) return null

	return (
		<div
			className={cn(
				'fixed top-0 left-0 right-0 z-50 h-1 bg-transparent',
				className
			)}
		>
			<div
				className='h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-300 ease-out shadow-[0_0_10px_rgba(var(--primary),0.5)]'
				style={{
					width: `${progress}%`,
					transition:
						progress === 100 ? 'width 300ms ease-out' : 'width 400ms ease-out'
				}}
			/>
		</div>
	)
}

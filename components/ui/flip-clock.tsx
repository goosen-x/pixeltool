'use client'

import { useEffect, useState, useRef } from 'react'
import { cn } from '@/lib/utils'

interface FlipUnitProps {
	current: string
	previous: string
}

function FlipUnit({ current, previous }: FlipUnitProps) {
	const [displayCurrent, setDisplayCurrent] = useState(current)
	const [displayPrevious, setDisplayPrevious] = useState(previous)
	const [animating, setAnimating] = useState(false)

	useEffect(() => {
		if (current !== previous) {
			setAnimating(true)
			setDisplayPrevious(previous)
			setDisplayCurrent(current)
			
			const timer = setTimeout(() => {
				setAnimating(false)
			}, 600)
			
			return () => clearTimeout(timer)
		}
	}, [current, previous])

	return (
		<div className='flip-clock-unit'>
			<div className='flip-card'>
				<div className='flip-card-face flip-card-face-front'>
					<div className='flip-card-top'>
						<span>{animating ? displayPrevious : displayCurrent}</span>
					</div>
					<div className='flip-card-bottom'>
						<span>{animating ? displayPrevious : displayCurrent}</span>
					</div>
				</div>
				
				{animating && (
					<>
						<div className='flip-card-face flip-card-face-top flip-animation-top'>
							<div className='flip-card-top'>
								<span>{displayPrevious}</span>
							</div>
						</div>
						
						<div className='flip-card-face flip-card-face-bottom flip-animation-bottom'>
							<div className='flip-card-bottom'>
								<span>{displayCurrent}</span>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	)
}

interface FlipClockProps {
	hours: number
	minutes: number
	seconds: number
	showMilliseconds?: boolean
	milliseconds?: number
}

export function FlipClock({
	hours,
	minutes,
	seconds,
	showMilliseconds = false,
	milliseconds = 0
}: FlipClockProps) {
	const [time, setTime] = useState({ hours, minutes, seconds, milliseconds })
	const [prevTime, setPrevTime] = useState({ hours, minutes, seconds, milliseconds })

	useEffect(() => {
		if (
			hours !== time.hours ||
			minutes !== time.minutes ||
			seconds !== time.seconds ||
			milliseconds !== time.milliseconds
		) {
			setPrevTime(time)
			setTime({ hours, minutes, seconds, milliseconds })
		}
	}, [hours, minutes, seconds, milliseconds, time])

	const formatNumber = (num: number): string => {
		return num.toString().padStart(2, '0')
	}

	const hoursStr = formatNumber(time.hours)
	const minutesStr = formatNumber(time.minutes)
	const secondsStr = formatNumber(time.seconds)
	const millisecondsStr = formatNumber(Math.floor(time.milliseconds / 10))

	const prevHoursStr = formatNumber(prevTime.hours)
	const prevMinutesStr = formatNumber(prevTime.minutes)
	const prevSecondsStr = formatNumber(prevTime.seconds)
	const prevMillisecondsStr = formatNumber(Math.floor(prevTime.milliseconds / 10))

	return (
		<div className='flip-clock-container'>
			<div className='flip-clock'>
				{/* Hours */}
				<div className='flip-clock-group'>
					<FlipUnit current={hoursStr[0]} previous={prevHoursStr[0]} />
					<FlipUnit current={hoursStr[1]} previous={prevHoursStr[1]} />
				</div>
				
				<div className='flip-clock-separator'>:</div>
				
				{/* Minutes */}
				<div className='flip-clock-group'>
					<FlipUnit current={minutesStr[0]} previous={prevMinutesStr[0]} />
					<FlipUnit current={minutesStr[1]} previous={prevMinutesStr[1]} />
				</div>
				
				<div className='flip-clock-separator'>:</div>
				
				{/* Seconds */}
				<div className='flip-clock-group'>
					<FlipUnit current={secondsStr[0]} previous={prevSecondsStr[0]} />
					<FlipUnit current={secondsStr[1]} previous={prevSecondsStr[1]} />
				</div>
				
				{/* Milliseconds */}
				{showMilliseconds && (
					<>
						<div className='flip-clock-separator flip-clock-separator-small'>.</div>
						<div className='flip-clock-group'>
							<FlipUnit current={millisecondsStr[0]} previous={prevMillisecondsStr[0]} />
							<FlipUnit current={millisecondsStr[1]} previous={prevMillisecondsStr[1]} />
						</div>
					</>
				)}
			</div>
		</div>
	)
}
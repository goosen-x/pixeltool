'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface FlipDigitProps {
	digit: string
}

function FlipDigit({ digit }: FlipDigitProps) {
	const [currentDigit, setCurrentDigit] = useState(digit)
	const [previousDigit, setPreviousDigit] = useState(digit)
	const [isFlipping, setIsFlipping] = useState(false)

	useEffect(() => {
		if (digit !== currentDigit) {
			setPreviousDigit(currentDigit)
			setIsFlipping(true)
			
			setTimeout(() => {
				setCurrentDigit(digit)
			}, 250)
			
			setTimeout(() => {
				setIsFlipping(false)
			}, 500)
		}
	}, [digit, currentDigit])

	return (
		<div className="flip-digit-simple">
			{/* Static card showing current digit */}
			<div className="flip-card-static">
				<div className="flip-card-upper">
					<span>{currentDigit}</span>
				</div>
				<div className="flip-card-lower">
					<span>{currentDigit}</span>
				</div>
			</div>

			{/* Animated cards */}
			{isFlipping && (
				<>
					{/* Upper card flipping down */}
					<div className="flip-card-upper flip-card-flip-upper">
						<span>{previousDigit}</span>
					</div>
					{/* Lower card flipping up */}
					<div className="flip-card-lower flip-card-flip-lower">
						<span>{digit}</span>
					</div>
				</>
			)}
		</div>
	)
}

interface FlipClockSimpleProps {
	hours: number
	minutes: number
	seconds: number
	showMilliseconds?: boolean
	milliseconds?: number
}

export function FlipClockSimple({
	hours,
	minutes,
	seconds,
	showMilliseconds = false,
	milliseconds = 0
}: FlipClockSimpleProps) {
	const formatNumber = (num: number): string => {
		return num.toString().padStart(2, '0')
	}

	const timeString = {
		h1: formatNumber(hours)[0],
		h2: formatNumber(hours)[1],
		m1: formatNumber(minutes)[0],
		m2: formatNumber(minutes)[1],
		s1: formatNumber(seconds)[0],
		s2: formatNumber(seconds)[1],
		ms1: formatNumber(Math.floor(milliseconds / 10))[0],
		ms2: formatNumber(Math.floor(milliseconds / 10))[1]
	}

	return (
		<div className="flip-clock-simple-container">
			<div className="flip-clock-simple">
				{/* Hours */}
				<div className="flip-digit-group">
					<FlipDigit digit={timeString.h1} />
					<FlipDigit digit={timeString.h2} />
				</div>
				
				<div className="flip-clock-colon">:</div>
				
				{/* Minutes */}
				<div className="flip-digit-group">
					<FlipDigit digit={timeString.m1} />
					<FlipDigit digit={timeString.m2} />
				</div>
				
				<div className="flip-clock-colon">:</div>
				
				{/* Seconds */}
				<div className="flip-digit-group">
					<FlipDigit digit={timeString.s1} />
					<FlipDigit digit={timeString.s2} />
				</div>
				
				{/* Milliseconds */}
				{showMilliseconds && (
					<>
						<div className="flip-clock-colon flip-clock-colon-small">.</div>
						<div className="flip-digit-group">
							<FlipDigit digit={timeString.ms1} />
							<FlipDigit digit={timeString.ms2} />
						</div>
					</>
				)}
			</div>
		</div>
	)
}
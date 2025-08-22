'use client'

import { useEffect, useState, useRef } from 'react'
import { cn } from '@/lib/utils'

interface FlipDigitProps {
	value: number
	prevValue: number
}

function FlipDigit({ value, prevValue }: FlipDigitProps) {
	const [isFlipping, setIsFlipping] = useState(false)
	const [currentValue, setCurrentValue] = useState(value)
	const [displayValue, setDisplayValue] = useState(value)

	useEffect(() => {
		if (value !== prevValue) {
			setIsFlipping(true)
			setCurrentValue(prevValue)
			
			// Start flip animation
			setTimeout(() => {
				setDisplayValue(value)
			}, 300)

			// End animation
			setTimeout(() => {
				setIsFlipping(false)
				setCurrentValue(value)
			}, 600)
		}
	}, [value, prevValue])

	return (
		<div className="flip-digit">
			{/* Background static bottom half */}
			<div className="digit-static" data-value={displayValue} />
			
			{/* Stack of digit cards */}
			<div className={cn("digit-card", isFlipping && "flipping")} data-value={currentValue} data-next={displayValue}>
				{/* Top half */}
				<div className="digit-top" />
				{/* Bottom half (flips) */}
				<div className="digit-bottom" />
			</div>
		</div>
	)
}

interface FlipNumberProps {
	value: number
	maxValue?: number
}

function FlipNumber({ value, maxValue = 99 }: FlipNumberProps) {
	const [prevValue, setPrevValue] = useState(value)
	
	useEffect(() => {
		if (value !== prevValue) {
			const timer = setTimeout(() => {
				setPrevValue(value)
			}, 50)
			return () => clearTimeout(timer)
		}
	}, [value, prevValue])

	const tensDigit = Math.floor(value / 10) % 10
	const onesDigit = value % 10
	const prevTensDigit = Math.floor(prevValue / 10) % 10
	const prevOnesDigit = prevValue % 10

	return (
		<div className="flip-number">
			<FlipDigit value={tensDigit} prevValue={prevTensDigit} />
			<FlipDigit value={onesDigit} prevValue={prevOnesDigit} />
		</div>
	)
}

interface FlipClockAdvancedProps {
	hours: number
	minutes: number
	seconds: number
	showMilliseconds?: boolean
	milliseconds?: number
}

export function FlipClockAdvanced({
	hours,
	minutes,
	seconds,
	showMilliseconds = false,
	milliseconds = 0
}: FlipClockAdvancedProps) {
	return (
		<div className="flip-clock-advanced">
			<div className="flip-clock-inner">
				<FlipNumber value={hours} maxValue={23} />
				<div className="flip-separator">
					<span className="flip-separator-dot"></span>
					<span className="flip-separator-dot"></span>
				</div>
				<FlipNumber value={minutes} maxValue={59} />
				<div className="flip-separator">
					<span className="flip-separator-dot"></span>
					<span className="flip-separator-dot"></span>
				</div>
				<FlipNumber value={seconds} maxValue={59} />
				{showMilliseconds && (
					<>
						<div className="flip-separator flip-separator-small">
							<span className="flip-separator-dot"></span>
						</div>
						<FlipNumber value={Math.floor(milliseconds / 10)} maxValue={99} />
					</>
				)}
			</div>
		</div>
	)
}
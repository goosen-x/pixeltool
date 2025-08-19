'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
	Play,
	Pause,
	SkipForward,
	SkipBack,
	X,
	CheckCircle,
	Circle,
	ChevronRight,
	Sparkles,
	Target,
	MousePointer,
	Keyboard,
	Monitor
} from 'lucide-react'
import { cn } from '@/lib/utils'
// import { motion, AnimatePresence } from 'framer-motion'

interface TutorialStep {
	id: string
	title: string
	description: string
	element?: string // CSS selector for highlighting
	position?: 'top' | 'bottom' | 'left' | 'right'
	action?: {
		type: 'click' | 'input' | 'hover' | 'keyboard'
		target?: string
		value?: string
		keys?: string[]
	}
	validation?: () => boolean
	onComplete?: () => void
}

interface WidgetTutorialProps {
	steps: TutorialStep[]
	widgetId: string
	onComplete?: () => void
	onSkip?: () => void
	autoStart?: boolean
}

export function WidgetTutorial({
	steps,
	widgetId,
	onComplete,
	onSkip,
	autoStart = false
}: WidgetTutorialProps) {
	const [currentStepIndex, setCurrentStepIndex] = useState(0)
	const [isActive, setIsActive] = useState(autoStart)
	const [isPaused, setIsPaused] = useState(false)
	const [completedSteps, setCompletedSteps] = useState<string[]>([])
	const [highlightedElement, setHighlightedElement] =
		useState<HTMLElement | null>(null)

	const currentStep = steps[currentStepIndex]
	const progress = ((currentStepIndex + 1) / steps.length) * 100

	useEffect(() => {
		if (isActive && currentStep?.element && !isPaused) {
			const element = document.querySelector(currentStep.element) as HTMLElement
			if (element) {
				setHighlightedElement(element)
				element.scrollIntoView({ behavior: 'smooth', block: 'center' })

				// Add highlight class
				element.classList.add('tutorial-highlight')

				return () => {
					element.classList.remove('tutorial-highlight')
				}
			}
		} else {
			setHighlightedElement(null)
		}
	}, [currentStep, isActive, isPaused])

	useEffect(() => {
		// Listen for user actions to auto-advance
		if (isActive && currentStep?.action && !isPaused) {
			const handleAction = (e: Event) => {
				const target = e.target as HTMLElement

				if (
					currentStep.action?.type === 'click' &&
					currentStep.action.target &&
					target.matches(currentStep.action.target)
				) {
					handleStepComplete()
				}
			}

			const handleKeyboard = (e: KeyboardEvent) => {
				if (
					currentStep.action?.type === 'keyboard' &&
					currentStep.action.keys?.includes(e.key)
				) {
					handleStepComplete()
				}
			}

			document.addEventListener('click', handleAction)
			document.addEventListener('keydown', handleKeyboard)

			return () => {
				document.removeEventListener('click', handleAction)
				document.removeEventListener('keydown', handleKeyboard)
			}
		}
	}, [currentStep, isActive, isPaused])

	const handleStepComplete = () => {
		const stepId = currentStep.id
		setCompletedSteps(prev => [...prev, stepId])
		currentStep.onComplete?.()

		if (currentStepIndex < steps.length - 1) {
			setCurrentStepIndex(currentStepIndex + 1)
		} else {
			handleTutorialComplete()
		}
	}

	const handleTutorialComplete = () => {
		setIsActive(false)
		localStorage.setItem(`tutorial-completed-${widgetId}`, 'true')
		onComplete?.()
	}

	const handleSkip = () => {
		setIsActive(false)
		onSkip?.()
	}

	const handlePrevious = () => {
		if (currentStepIndex > 0) {
			setCurrentStepIndex(currentStepIndex - 1)
		}
	}

	const handleNext = () => {
		handleStepComplete()
	}

	const getActionIcon = (type?: string) => {
		switch (type) {
			case 'click':
				return <MousePointer className='w-4 h-4' />
			case 'keyboard':
				return <Keyboard className='w-4 h-4' />
			default:
				return <Target className='w-4 h-4' />
		}
	}

	const getPositionClasses = (position?: string) => {
		switch (position) {
			case 'top':
				return 'bottom-full mb-2 left-1/2 -translate-x-1/2'
			case 'bottom':
				return 'top-full mt-2 left-1/2 -translate-x-1/2'
			case 'left':
				return 'right-full mr-2 top-1/2 -translate-y-1/2'
			case 'right':
				return 'left-full ml-2 top-1/2 -translate-y-1/2'
			default:
				return 'top-full mt-2 left-1/2 -translate-x-1/2'
		}
	}

	if (!isActive) {
		return (
			<Button
				onClick={() => setIsActive(true)}
				variant='outline'
				size='sm'
				className='gap-2'
			>
				<Play className='w-4 h-4' />
				Start Tutorial
			</Button>
		)
	}

	return (
		<>
			{/* Overlay */}
			<div className='fixed inset-0 bg-black/50 z-40' onClick={handleSkip} />

			{/* Tutorial Card */}
			<div
				className={cn(
					'fixed z-50 transition-all duration-300',
					highlightedElement
						? 'absolute'
						: 'fixed inset-0 flex items-center justify-center p-4',
					highlightedElement && getPositionClasses(currentStep.position)
				)}
				style={{
					...(highlightedElement && {
						position: 'absolute',
						top: highlightedElement.offsetTop,
						left: highlightedElement.offsetLeft
					})
				}}
			>
				<Card className='w-full max-w-md p-6 space-y-4'>
					{/* Header */}
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							<Sparkles className='w-5 h-5 text-primary' />
							<h3 className='font-semibold'>Interactive Tutorial</h3>
						</div>
						<Button
							onClick={handleSkip}
							variant='ghost'
							size='icon'
							className='h-8 w-8'
						>
							<X className='w-4 h-4' />
						</Button>
					</div>

					{/* Progress */}
					<div className='space-y-2'>
						<Progress value={progress} className='h-2' />
						<div className='flex items-center justify-between text-xs text-muted-foreground'>
							<span>
								Step {currentStepIndex + 1} of {steps.length}
							</span>
							<span>{Math.round(progress)}% complete</span>
						</div>
					</div>

					{/* Content */}
					<div className='space-y-3'>
						<div className='flex items-start gap-3'>
							{getActionIcon(currentStep.action?.type)}
							<div className='flex-1'>
								<h4 className='font-medium mb-1'>{currentStep.title}</h4>
								<p className='text-sm text-muted-foreground'>
									{currentStep.description}
								</p>
							</div>
						</div>

						{currentStep.action && (
							<div className='flex items-center gap-2 p-3 bg-muted/50 rounded-lg'>
								<span className='text-sm font-medium'>Action:</span>
								{currentStep.action.type === 'click' && (
									<Badge variant='secondary' className='gap-1'>
										<MousePointer className='w-3 h-3' />
										Click {currentStep.action.target}
									</Badge>
								)}
								{currentStep.action.type === 'keyboard' && (
									<Badge variant='secondary' className='gap-1'>
										<Keyboard className='w-3 h-3' />
										Press {currentStep.action.keys?.join(' + ')}
									</Badge>
								)}
								{currentStep.action.type === 'input' && (
									<Badge variant='secondary'>
										Type: {currentStep.action.value}
									</Badge>
								)}
							</div>
						)}
					</div>

					{/* Step indicators */}
					<div className='flex items-center justify-center gap-1'>
						{steps.map((step, index) => (
							<div
								key={step.id}
								className={cn(
									'w-2 h-2 rounded-full transition-all',
									index === currentStepIndex
										? 'w-6 bg-primary'
										: completedSteps.includes(step.id)
											? 'bg-primary/50'
											: 'bg-muted-foreground/30'
								)}
							/>
						))}
					</div>

					{/* Controls */}
					<div className='flex items-center justify-between'>
						<Button
							onClick={handlePrevious}
							variant='outline'
							size='sm'
							disabled={currentStepIndex === 0}
						>
							<SkipBack className='w-4 h-4 mr-2' />
							Previous
						</Button>

						<Button
							onClick={() => setIsPaused(!isPaused)}
							variant='ghost'
							size='icon'
						>
							{isPaused ? (
								<Play className='w-4 h-4' />
							) : (
								<Pause className='w-4 h-4' />
							)}
						</Button>

						<Button onClick={handleNext} size='sm'>
							{currentStepIndex === steps.length - 1 ? 'Complete' : 'Next'}
							<ChevronRight className='w-4 h-4 ml-2' />
						</Button>
					</div>
				</Card>
			</div>

			{/* Highlight overlay for specific element */}
			{highlightedElement && (
				<div
					className='fixed z-45 pointer-events-none border-2 border-primary rounded-lg animate-pulse'
					style={{
						top: highlightedElement.offsetTop - 4,
						left: highlightedElement.offsetLeft - 4,
						width: highlightedElement.offsetWidth + 8,
						height: highlightedElement.offsetHeight + 8
					}}
				/>
			)}
		</>
	)
}

// CSS for highlighting elements
export const tutorialStyles = `
  .tutorial-highlight {
    position: relative;
    z-index: 41 !important;
    box-shadow: 0 0 0 4px rgba(var(--primary), 0.3);
    animation: tutorial-pulse 2s infinite;
  }

  @keyframes tutorial-pulse {
    0% {
      box-shadow: 0 0 0 4px rgba(var(--primary), 0.3);
    }
    50% {
      box-shadow: 0 0 0 8px rgba(var(--primary), 0.1);
    }
    100% {
      box-shadow: 0 0 0 4px rgba(var(--primary), 0.3);
    }
  }
`

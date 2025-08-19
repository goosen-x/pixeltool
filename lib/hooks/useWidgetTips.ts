import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

interface WidgetTip {
	id: string
	title: string
	description: string
	icon?: React.ReactNode
	category?: 'basic' | 'advanced' | 'pro' | 'shortcut'
	action?: {
		label: string
		onClick: () => void
	}
}

interface UseWidgetTipsProps {
	widgetId: string
	tips: WidgetTip[]
	onTipComplete?: (tipId: string) => void
}

export function useWidgetTips({
	widgetId,
	tips,
	onTipComplete
}: UseWidgetTipsProps) {
	const [completedTips, setCompletedTips] = useState<string[]>([])
	const [currentTipIndex, setCurrentTipIndex] = useState(0)
	const [isShowingTips, setIsShowingTips] = useState(false)

	const storageKey = `widget-tips-completed-${widgetId}`

	// Load completed tips from localStorage
	useEffect(() => {
		const stored = localStorage.getItem(storageKey)
		if (stored) {
			try {
				setCompletedTips(JSON.parse(stored))
			} catch (e) {
				// Invalid data, reset
				localStorage.removeItem(storageKey)
			}
		}
	}, [storageKey])

	// Save completed tips to localStorage
	useEffect(() => {
		if (completedTips.length > 0) {
			localStorage.setItem(storageKey, JSON.stringify(completedTips))
		}
	}, [completedTips, storageKey])

	const markTipAsCompleted = useCallback(
		(tipId: string) => {
			setCompletedTips(prev => {
				if (!prev.includes(tipId)) {
					const updated = [...prev, tipId]
					onTipComplete?.(tipId)

					// Show progress toast
					const completionRate = Math.round(
						(updated.length / tips.length) * 100
					)
					if (completionRate === 100) {
						toast.success("🎉 You've mastered all tips for this widget!")
					} else if (completionRate % 25 === 0) {
						toast.success(`${completionRate}% of tips completed!`)
					}

					return updated
				}
				return prev
			})
		},
		[tips.length, onTipComplete]
	)

	const resetTips = useCallback(() => {
		setCompletedTips([])
		setCurrentTipIndex(0)
		localStorage.removeItem(storageKey)
		toast.success('Tips progress reset')
	}, [storageKey])

	const getUncompletedTips = useCallback(() => {
		return tips.filter(tip => !completedTips.includes(tip.id))
	}, [tips, completedTips])

	const getNextUncompletedTip = useCallback(() => {
		const uncompleted = getUncompletedTips()
		return uncompleted[0] || null
	}, [getUncompletedTips])

	const showNextTip = useCallback(() => {
		const uncompleted = getUncompletedTips()
		if (uncompleted.length > 0) {
			const nextIndex = tips.findIndex(tip => tip.id === uncompleted[0].id)
			setCurrentTipIndex(nextIndex)
			setIsShowingTips(true)
		} else {
			toast.info("You've seen all the tips!")
		}
	}, [tips, getUncompletedTips])

	const completionRate =
		tips.length > 0 ? Math.round((completedTips.length / tips.length) * 100) : 0

	return {
		completedTips,
		currentTipIndex,
		setCurrentTipIndex,
		isShowingTips,
		setIsShowingTips,
		markTipAsCompleted,
		resetTips,
		getUncompletedTips,
		getNextUncompletedTip,
		showNextTip,
		completionRate,
		totalTips: tips.length,
		completedCount: completedTips.length
	}
}

// Predefined tip collections for common widget types
export const calculatorTips: WidgetTip[] = [
	{
		id: 'input-validation',
		title: 'Smart Input Validation',
		description:
			'The calculator automatically validates your input and shows helpful error messages',
		category: 'basic'
	},
	{
		id: 'keyboard-nav',
		title: 'Keyboard Navigation',
		description: 'Use Tab to move between fields and Enter to calculate',
		category: 'shortcut'
	},
	{
		id: 'copy-results',
		title: 'Copy Results',
		description: 'Click any result value to copy it to your clipboard',
		category: 'basic'
	},
	{
		id: 'save-calculations',
		title: 'Save Calculations',
		description: 'Use Ctrl/Cmd + S to save your current calculation',
		category: 'advanced'
	}
]

export const converterTips: WidgetTip[] = [
	{
		id: 'paste-input',
		title: 'Quick Paste',
		description:
			'Use Ctrl/Cmd + V to paste content directly into the input field',
		category: 'shortcut'
	},
	{
		id: 'batch-convert',
		title: 'Batch Conversion',
		description:
			'Convert multiple items at once by separating them with commas',
		category: 'advanced'
	},
	{
		id: 'format-options',
		title: 'Format Options',
		description: 'Click the settings icon to customize output format',
		category: 'basic'
	},
	{
		id: 'history',
		title: 'Conversion History',
		description: 'Your last 10 conversions are saved locally',
		category: 'pro'
	}
]

export const generatorTips: WidgetTip[] = [
	{
		id: 'randomize',
		title: 'Randomize Settings',
		description: 'Click the dice icon to randomize all settings',
		category: 'basic'
	},
	{
		id: 'presets',
		title: 'Use Presets',
		description: 'Save time with pre-configured settings for common use cases',
		category: 'basic'
	},
	{
		id: 'bulk-generate',
		title: 'Bulk Generation',
		description: 'Generate multiple items at once using the quantity field',
		category: 'advanced'
	},
	{
		id: 'export-options',
		title: 'Export Options',
		description: 'Export results as JSON, CSV, or plain text',
		category: 'pro'
	}
]

export const editorTips: WidgetTip[] = [
	{
		id: 'syntax-highlight',
		title: 'Syntax Highlighting',
		description:
			'The editor automatically detects and highlights your code syntax',
		category: 'basic'
	},
	{
		id: 'auto-format',
		title: 'Auto Format',
		description: 'Press Shift + Alt + F to format your code',
		category: 'shortcut'
	},
	{
		id: 'find-replace',
		title: 'Find & Replace',
		description: 'Use Ctrl/Cmd + F to find and Ctrl/Cmd + H to replace',
		category: 'shortcut'
	},
	{
		id: 'live-preview',
		title: 'Live Preview',
		description: 'See changes in real-time in the preview pane',
		category: 'basic'
	}
]

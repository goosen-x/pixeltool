import { useCallback } from 'react'
import { toast } from 'sonner'

interface UseResetOptions<T> {
	translations?: {
		reset?: string
	}
	successMessage?: string
	onReset?: () => void
}

interface UseResetReturn {
	reset: () => void
	resetWithConfirmation: (confirmMessage?: string) => void
}

/**
 * Reusable hook for resetting state with optional confirmation and feedback
 *
 * @param resetFunction Function that resets the state
 * @param options Configuration options for reset behavior
 * @returns Object with reset functions
 */
export function useReset<T>(
	resetFunction: () => void,
	options: UseResetOptions<T> = {}
): UseResetReturn {
	const { translations, successMessage = 'Reset successful', onReset } = options

	const reset = useCallback(() => {
		resetFunction()
		onReset?.()

		const message = translations?.reset || successMessage
		toast.success(message)
	}, [resetFunction, onReset, translations, successMessage])

	const resetWithConfirmation = useCallback(
		(confirmMessage = 'Are you sure you want to reset?') => {
			if (window.confirm(confirmMessage)) {
				reset()
			}
		},
		[reset]
	)

	return {
		reset,
		resetWithConfirmation
	}
}

/**
 * Simple reset hook without toast notifications
 * Useful when you want to handle notifications manually
 *
 * @param resetFunction Function that resets the state
 * @param options Configuration options
 * @returns Object with reset functions
 */
export function useSimpleReset<T>(
	resetFunction: () => void,
	options: { onReset?: () => void } = {}
): Pick<UseResetReturn, 'reset'> {
	const { onReset } = options

	const reset = useCallback(() => {
		resetFunction()
		onReset?.()
	}, [resetFunction, onReset])

	return { reset }
}

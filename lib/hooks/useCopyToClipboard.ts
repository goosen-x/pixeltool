import { useState, useCallback } from 'react'
import { toast } from 'sonner'

interface UseCopyToClipboardOptions {
	translations?: {
		copied?: string
		copyError?: string
	}
	successMessage?: string
	errorMessage?: string
	resetDelay?: number
}

interface UseCopyToClipboardReturn {
	copyToClipboard: (text: string, label?: string) => Promise<void>
	copiedItem: string | null
	isCopying: boolean
}

/**
 * Reusable hook for copying text to clipboard with visual feedback
 *
 * @param options Configuration options for copy behavior
 * @returns Object with copyToClipboard function and state
 */
export function useCopyToClipboard(
	options: UseCopyToClipboardOptions = {}
): UseCopyToClipboardReturn {
	const {
		translations,
		successMessage,
		errorMessage,
		resetDelay = 2000
	} = options

	const [copiedItem, setCopiedItem] = useState<string | null>(null)
	const [isCopying, setIsCopying] = useState(false)

	const copyToClipboard = useCallback(
		async (text: string, label?: string) => {
			if (!text || isCopying) return

			setIsCopying(true)

			try {
				await navigator.clipboard.writeText(text)
				const itemLabel = label || 'text'
				setCopiedItem(itemLabel)

				// Use provided messages or translations, with fallbacks
				const message =
					successMessage ||
					translations?.copied?.replace('{item}', itemLabel) ||
					`${itemLabel} copied to clipboard!`

				toast.success(message)

				// Clear copied state after delay
				setTimeout(() => setCopiedItem(null), resetDelay)
			} catch (error) {
				const message =
					errorMessage ||
					translations?.copyError ||
					'Failed to copy to clipboard'

				toast.error(message)
				console.error('Copy failed:', error)
			} finally {
				setIsCopying(false)
			}
		},
		[isCopying, successMessage, errorMessage, translations, resetDelay]
	)

	return {
		copyToClipboard,
		copiedItem,
		isCopying
	}
}

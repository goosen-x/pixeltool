import { useEffect, useCallback } from 'react'
import { toast } from 'sonner'

interface UseWidgetShareProps {
	title: string
	description?: string
	url?: string
	onShare?: () => void
}

export function useWidgetShare({
	title,
	description,
	url,
	onShare
}: UseWidgetShareProps) {
	const shareUrl =
		url || (typeof window !== 'undefined' ? window.location.href : '')

	// Native Web Share API
	const shareNative = useCallback(async () => {
		if (!navigator.share) {
			toast.error('Sharing is not supported on this device')
			return false
		}

		try {
			await navigator.share({
				title,
				text: description,
				url: shareUrl
			})
			onShare?.()
			return true
		} catch (error) {
			if ((error as Error).name !== 'AbortError') {
				toast.error('Failed to share')
			}
			return false
		}
	}, [title, description, shareUrl, onShare])

	// Copy link to clipboard
	const copyLink = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(shareUrl)
			toast.success('Link copied to clipboard!')
			return true
		} catch (error) {
			toast.error('Failed to copy link')
			return false
		}
	}, [shareUrl])

	// Keyboard shortcut handler
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Ctrl/Cmd + Shift + S
			if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
				e.preventDefault()
				shareNative()
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [shareNative])

	// Share to specific platform
	const shareToPlatform = useCallback(
		(platform: string) => {
			const encodedUrl = encodeURIComponent(shareUrl)
			const encodedTitle = encodeURIComponent(title)
			const encodedDescription = encodeURIComponent(description || '')

			const shareUrls: Record<string, string> = {
				twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
				facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
				linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
				whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
				telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
				reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
				email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
			}

			const url = shareUrls[platform]
			if (url) {
				window.open(url, '_blank', 'width=600,height=400')
				onShare?.()
			}
		},
		[title, description, shareUrl, onShare]
	)

	return {
		shareNative,
		copyLink,
		shareToPlatform,
		shareUrl,
		canShare: typeof navigator !== 'undefined' && !!navigator.share
	}
}

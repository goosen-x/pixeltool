'use client'

import { useState, useEffect } from 'react'
import { Cookie, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
// import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'

export function CookieConsent() {
	const [isVisible, setIsVisible] = useState(false)
	// const t = useTranslations('cookieConsent')

	useEffect(() => {
		// Check if user has already accepted cookies
		const hasAcceptedCookies = localStorage.getItem('cookieConsent')
		if (!hasAcceptedCookies) {
			// Show after a small delay for better UX
			const timer = setTimeout(() => setIsVisible(true), 1000)
			return () => clearTimeout(timer)
		}
	}, [])

	const handleAccept = () => {
		localStorage.setItem('cookieConsent', 'accepted')
		setIsVisible(false)
	}

	const handleDecline = () => {
		localStorage.setItem('cookieConsent', 'declined')
		setIsVisible(false)
	}

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ y: 100, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: 100, opacity: 0 }}
					transition={{ type: 'spring', stiffness: 300, damping: 30 }}
					className='fixed bottom-0 left-0 right-0 z-50 p-4'
				>
					<div className='mx-auto max-w-2xl'>
						<div className='relative rounded-xl bg-card/95 backdrop-blur-md border shadow-lg p-4 sm:p-5'>
							<button
								onClick={handleDecline}
								className='absolute top-3 right-3 p-1.5 rounded-lg hover:bg-muted transition-colors'
								aria-label='Закрыть'
							>
								<X className='h-4 w-4' />
							</button>

							<div className='flex items-center gap-4 pr-10'>
								<div className='flex-shrink-0 hidden sm:block'>
									<div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
										<Cookie className='h-5 w-5 text-primary' />
									</div>
								</div>

								<div className='flex-1'>
									<p className='text-sm text-foreground'>
										Мы используем файлы cookie для улучшения вашего опыта.
										Продолжая, вы соглашаетесь с их использованием.
									</p>
								</div>

								<Button
									onClick={handleAccept}
									size='sm'
									className='flex-shrink-0 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90'
								>
									Принять
								</Button>
							</div>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

import {
	Home,
	Layers,
	FolderOpen,
	Briefcase,
	BookOpen,
	Mail
} from 'lucide-react'

interface ScrollSpyProps {
	className?: string
}

export const ScrollSpy = ({ className }: ScrollSpyProps) => {
	const [activeSection, setActiveSection] = useState('main')
	const [isVisible, setIsVisible] = useState(false)
	const [isExpanded, setIsExpanded] = useState(false)

	const sections = [
		{ id: 'main', label: 'Главная', icon: Home },
		{ id: 'techstack', label: 'Технологии', icon: Layers },
		{ id: 'projects', label: 'Проекты', icon: FolderOpen },
		{ id: 'experience', label: 'Опыт', icon: Briefcase },
		{ id: 'blog', label: 'Блог', icon: BookOpen },
		{ id: 'contact', label: 'Контакты', icon: Mail }
	]

	useEffect(() => {
		// Handle visibility based on scroll
		const handleScroll = () => {
			const scrollY = window.scrollY
			setIsVisible(scrollY > 200)
		}

		window.addEventListener('scroll', handleScroll)
		handleScroll() // Initial check

		// Use Intersection Observer for section detection
		const observerOptions = {
			root: null,
			// Adjust rootMargin to trigger 100px earlier (200px from top instead of 300px)
			// This ensures correct section detection when clicking anchors
			rootMargin: '-200px 0px -40% 0px',
			threshold: 0
		}

		const observerCallback = (entries: IntersectionObserverEntry[]) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					setActiveSection(entry.target.id)
				}
			})
		}

		const observer = new IntersectionObserver(observerCallback, observerOptions)

		// Observe all sections
		sections.forEach(section => {
			const element = document.getElementById(section.id)
			if (element) {
				observer.observe(element)
			}
		})

		return () => {
			window.removeEventListener('scroll', handleScroll)
			observer.disconnect()
		}
	}, [])

	const handleClick = (sectionId: string) => {
		const element = document.getElementById(sectionId)
		if (element) {
			const headerOffset = 300 // Larger offset for better section visibility
			const elementPosition =
				element.getBoundingClientRect().top + window.scrollY
			const offsetPosition = elementPosition - headerOffset

			window.scrollTo({
				top: offsetPosition,
				behavior: 'smooth'
			})
		}
	}

	return (
		<AnimatePresence>
			{isVisible && (
				<div
					className={cn(
						'fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block',
						className
					)}
					onMouseEnter={() => setIsExpanded(true)}
					onMouseLeave={() => setIsExpanded(false)}
				>
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						transition={{ duration: 0.3 }}
					>
						<nav
							className={cn(
								'bg-background/95 backdrop-blur-md border border-border/50 rounded-xl shadow-xl transition-all duration-300',
								isExpanded ? 'p-3' : 'p-2'
							)}
						>
							<ul className='space-y-1'>
								{sections.map(section => (
									<li key={section.id}>
										<button
											onClick={() => handleClick(section.id)}
											className={cn(
												'flex items-center text-sm transition-all duration-300 w-full',
												'hover:bg-accent/10 rounded-lg group',
												'focus:outline-none focus:ring-2 focus:ring-accent/20',
												isExpanded ? 'gap-3 p-2' : 'gap-0 p-1.5 justify-center'
											)}
										>
											<section.icon
												className={cn(
													'transition-all duration-300 flex-shrink-0',
													isExpanded ? 'w-4 h-4' : 'w-5 h-5',
													activeSection === section.id
														? 'text-accent'
														: 'text-muted-foreground/50 group-hover:text-muted-foreground'
												)}
											/>
											<AnimatePresence mode='wait'>
												{isExpanded && (
													<motion.div
														initial={{ opacity: 0, width: 0 }}
														animate={{ opacity: 1, width: 'auto' }}
														exit={{ opacity: 0, width: 0 }}
														transition={{ duration: 0.2 }}
														style={{
															overflow: 'hidden',
															flex: 1
														}}
													>
														<span
															className={cn(
																'text-left flex-1 overflow-hidden whitespace-nowrap block',
																activeSection === section.id
																	? 'text-foreground font-medium'
																	: 'text-muted-foreground group-hover:text-foreground/80'
															)}
														>
															{section.label}
														</span>
													</motion.div>
												)}
											</AnimatePresence>
											{isExpanded && (
												<div className='relative flex items-center justify-center'>
													<span
														className={cn(
															'w-1.5 h-1.5 rounded-full transition-all duration-300',
															activeSection === section.id
																? 'bg-accent'
																: 'bg-transparent'
														)}
													/>
													{activeSection === section.id && (
														<span className='absolute w-3 h-3 rounded-full border-2 border-accent/30 animate-ping' />
													)}
												</div>
											)}
										</button>
									</li>
								))}
							</ul>
						</nav>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	)
}

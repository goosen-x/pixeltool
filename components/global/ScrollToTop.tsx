'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

// Отступ кнопки от правого нижнего угла и зазор до плашки GooseLabs.
const EDGE = 16
const SIZE = 44
const CLEARANCE = 8

export function ScrollToTop() {
	const [isVisible, setIsVisible] = useState(false)
	// Плашка GooseLabs в футере стоит в том же правом нижнем углу. Если кнопка
	// её задевает, она поднимается ровно настолько, чтобы не перекрывать.
	const [lift, setLift] = useState(0)

	useEffect(() => {
		const update = () => {
			setIsVisible(window.scrollY > 300)

			const vw = document.documentElement.clientWidth
			const vh = window.innerHeight
			const btn = {
				left: vw - EDGE - SIZE,
				right: vw - EDGE,
				top: vh - EDGE - SIZE,
				bottom: vh - EDGE
			}
			let need = 0
			document.querySelectorAll('[data-gooselabs-credit]').forEach(el => {
				const r = el.getBoundingClientRect()
				if (r.width === 0) return
				const crossX = r.left < btn.right && r.right > btn.left
				const crossY = r.top - CLEARANCE < btn.bottom && r.bottom > btn.top
				if (crossX && crossY) need = Math.max(need, btn.bottom - (r.top - CLEARANCE))
			})
			setLift(need)
		}

		update()
		window.addEventListener('scroll', update, { passive: true })
		window.addEventListener('resize', update)
		return () => {
			window.removeEventListener('scroll', update)
			window.removeEventListener('resize', update)
		}
	}, [])

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		})
	}

	return (
		<button
			onClick={scrollToTop}
			className={cn(
				'fixed bottom-4 right-4 z-50 cursor-pointer p-3 rounded-full bg-primary text-primary-foreground shadow-lg transition-[opacity,transform,scale] duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
				!isVisible && 'pointer-events-none'
			)}
			style={{
				opacity: isVisible ? 1 : 0,
				transform: `translateY(${isVisible ? -lift : 40}px)`
			}}
			aria-label='Scroll to top'
		>
			<ArrowUp className='w-5 h-5' />
		</button>
	)
}

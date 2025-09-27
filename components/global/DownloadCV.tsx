'use client'

import { useRef, useState } from 'react'
import { FiDownload } from 'react-icons/fi'
import { motion } from 'framer-motion'
// import { useTranslations } from 'next-intl'

const CYCLES_PER_LETTER = 2
const SHUFFLE_TIME = 50

export const DownloadCV = () => {
	// const t = useTranslations('Header.cv')

	const TARGET_TEXT = 'Скачать резюме'
	const TARGET_HREF = '/dmitry-borisenko-cv.pdf'
	const TARGET_FILENAME = 'dmitry-borisenko-cv.pdf'
	const CHARS = '!@#$%^&*():{};|,.<>/?'
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

	const [text, setText] = useState(TARGET_TEXT)
	const [isHovered, setIsHovered] = useState(false)

	const scramble = () => {
		let pos = 0

		intervalRef.current = setInterval(() => {
			const scrambled = TARGET_TEXT.split('')
				.map((char, index) => {
					if (pos / CYCLES_PER_LETTER > index) {
						return char
					}

					const randomCharIndex = Math.floor(Math.random() * CHARS.length)
					const randomChar = CHARS[randomCharIndex]

					return randomChar
				})
				.join('')

			setText(scrambled)
			pos++

			if (pos >= TARGET_TEXT.length * CYCLES_PER_LETTER) {
				stopScramble()
			}
		}, SHUFFLE_TIME)
	}

	const stopScramble = () => {
		clearInterval(intervalRef.current || undefined)

		setText(TARGET_TEXT)
	}

	return (
		<motion.div
			style={{ display: 'inline-block' }}
			whileHover={{
				scale: 1.025
			}}
			whileTap={{
				scale: 0.975
			}}
		>
			<a
				className='h-8 group relative overflow-hidden cursor-pointer rounded-md border border-input bg-background px-4 py-1 font-medium uppercase text-foreground hover:text-accent min-w-48 text-sm shadow-xs flex items-center'
				href={TARGET_HREF}
				download={TARGET_FILENAME}
				onMouseEnter={() => {
					scramble()
					setIsHovered(true)
				}}
				onMouseLeave={() => {
					stopScramble()
					setIsHovered(false)
				}}
			>
				<div className='relative z-10 flex items-center gap-2'>
					<FiDownload className='mr-2 shrink-0' />
					<span className='text-nowrap tracking-wide'>{text}</span>
				</div>
				<motion.span
					initial={{ y: '100%' }}
					animate={{
						y: isHovered ? ['100%', '-100%', '100%'] : '100%',
						opacity: isHovered ? 1 : 0
					}}
					transition={{
						y: {
							duration: isHovered ? 1.2 : 0.3,
							ease: 'easeInOut',
							times: [0, 0.5, 1]
						},
						opacity: {
							duration: 0.3
						}
					}}
					style={{
						position: 'absolute',
						inset: 0,
						zIndex: 0,
						background:
							'linear-gradient(to top, transparent 0%, transparent 40%, hsl(var(--accent)) 50%, transparent 60%, transparent 100%)'
					}}
				/>
			</a>
		</motion.div>
	)
}

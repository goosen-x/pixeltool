'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface FAQItem {
	question: string
	answer: string
}

interface FAQProps {
	items: FAQItem[]
	title?: string
}

export function FAQ({ items, title = 'Frequently Asked Questions' }: FAQProps) {
	const [openIndex, setOpenIndex] = useState<number | null>(null)

	// Generate Schema.org FAQ structured data
	const faqSchema = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: items.map(item => ({
			'@type': 'Question',
			name: item.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: item.answer
			}
		}))
	}

	return (
		<div className='mt-12'>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
			/>

			<h2 className='text-2xl font-heading font-bold mb-6'>{title}</h2>

			<div className='space-y-4'>
				{items.map((item, index) => (
					<motion.div
						key={index}
						className='border rounded-lg overflow-hidden backdrop-blur-sm bg-background/60'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							delay: index * 0.1,
							duration: 0.5,
							ease: [0.4, 0, 0.2, 1]
						}}
						whileHover={{ scale: 1.01 }}
					>
						<button
							className='w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-all duration-200'
							onClick={() => setOpenIndex(openIndex === index ? null : index)}
						>
							<span className='font-medium pr-4'>{item.question}</span>
							<motion.div
								animate={{ rotate: openIndex === index ? 180 : 0 }}
								transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
								className='flex-shrink-0'
							>
								<ChevronDown className='w-5 h-5' />
							</motion.div>
						</button>

						<AnimatePresence initial={false}>
							{openIndex === index && (
								<motion.div
									initial={{ height: 0, opacity: 0 }}
									animate={{ height: 'auto', opacity: 1 }}
									exit={{ height: 0, opacity: 0 }}
									transition={{
										duration: 0.3,
										ease: [0.4, 0, 0.2, 1]
									}}
									className='overflow-hidden'
								>
									<div className='px-6 py-4 border-t bg-muted/30'>
										<p className='text-muted-foreground'>{item.answer}</p>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				))}
			</div>
		</div>
	)
}

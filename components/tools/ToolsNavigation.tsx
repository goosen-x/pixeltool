'use client'

import { Button } from '@/components/ui/button'
import { TrendingUp, Layers, Clock, Search } from 'lucide-react'
import { useCallback } from 'react'

export function ToolsNavigation() {
	const scrollToSection = useCallback((sectionId: string) => {
		const section = document.getElementById(sectionId)
		section?.scrollIntoView({ behavior: 'smooth' })
	}, [])

	return (
		<div className='flex flex-wrap justify-center gap-2'>
			<Button
				variant='default'
				size='sm'
				className='gap-2'
				onClick={() => scrollToSection('popular-tools')}
			>
				<TrendingUp className='w-4 h-4' />
				Популярные
			</Button>
			<Button
				variant='outline'
				size='sm'
				className='gap-2'
				onClick={() => scrollToSection('categories')}
			>
				<Layers className='w-4 h-4' />
				Категории
			</Button>
			<Button
				variant='outline'
				size='sm'
				className='gap-2'
				onClick={() => scrollToSection('recent-tools')}
			>
				<Clock className='w-4 h-4' />
				Новые
			</Button>
			<Button
				variant='outline'
				size='sm'
				className='gap-2'
				onClick={() => scrollToSection('all-tools')}
			>
				<Search className='w-4 h-4' />
				Все инструменты
			</Button>
		</div>
	)
}
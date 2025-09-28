'use client'

import { Card } from '@/components/ui/card'
// import { useTranslations } from 'next-intl'

export function SymbolInfo() {
	// const t = useTranslations('widgets.specialSymbolsPicker')

	return (
		<Card className='p-6 bg-muted/50'>
			<h3 className='font-semibold mb-3'>О специальных символах</h3>
			<p className='text-sm text-muted-foreground mb-4'>
				Коллекция специальных символов Unicode для копирования и вставки.
				Включает стрелки, математические символы, валюты и другие полезные
				знаки.
			</p>

			<div className='grid md:grid-cols-2 gap-4 mt-4'>
				<div>
					<h4 className='font-medium mb-2'>Возможности</h4>
					<ul className='space-y-1 text-sm text-muted-foreground'>
						<li>• Большая коллекция символов</li>
						<li>• Удобные категории</li>
						<li>• Копирование в один клик</li>
						<li>• История использования</li>
					</ul>
				</div>
				<div>
					<h4 className='font-medium mb-2'>Советы</h4>
					<ul className='space-y-1 text-sm text-muted-foreground'>
						<li>• Кликните для копирования</li>
						<li>• Используйте категории для быстрого поиска</li>
						<li>• Работает во всех приложениях</li>
						<li>• Полная поддержка Unicode</li>
					</ul>
				</div>
			</div>
		</Card>
	)
}

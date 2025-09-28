import { Card } from '@/components/ui/card'
// import { useTranslations } from 'next-intl'

export function EmojiInfo() {
	// const t = useTranslations('widgets.emojiList')

	return (
		<Card className='p-6 bg-muted/50'>
			<h3 className='font-semibold mb-3'>О списке эмодзи</h3>
			<div className='grid md:grid-cols-2 gap-4 text-sm text-muted-foreground'>
				<div>
					<h4 className='font-medium text-foreground mb-2'>Как использовать</h4>
					<ul className='space-y-1'>
						<li>• Скопировать любой эмодзи одним кликом</li>
						<li>• Скачать эмодзи как PNG изображение</li>
						<li>• Искать эмодзи по названию или ключевым словам</li>
						<li>• Переключаться между категориями</li>
						<li>• Просматривать недавно использованные эмодзи</li>
					</ul>
				</div>
				<div>
					<h4 className='font-medium text-foreground mb-2'>Возможности</h4>
					<ul className='space-y-1'>
						<li>• 1500+ эмодзи во всех категориях</li>
						<li>• Мгновенное копирование</li>
						<li>• Скачать как PNG</li>
						<li>• История недавних эмодзи</li>
						<li>• Работает на всех устройствах</li>
					</ul>
				</div>
			</div>
			<p className='text-xs mt-4'>
				Примечание: отображение эмодзи может различаться в зависимости от вашей
				операционной системы и браузера.
			</p>
			<div className='mt-4 p-4 bg-background rounded-lg'>
				<h4 className='font-medium text-foreground mb-2 text-sm'>
					Использование в соцсетях
				</h4>
				<p className='text-xs'>
					Эмодзи отлично подходят для социальных сетей, мессенджеров и
					электронной почты. Они помогают выразить эмоции и сделать ваши
					сообщения более яркими и запоминающимися.
				</p>
			</div>
		</Card>
	)
}

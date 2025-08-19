'use client'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
	Code2,
	Palette,
	Briefcase,
	FileText,
	Lock,
	Film,
	BarChart,
	Activity,
	Layers
} from 'lucide-react'

interface CategoryCardProps {
	categoryKey: string
	name: string
	count: number
	gradient: string
	locale: string
}

const categoryTranslations: Record<string, Record<string, string>> = {
	webdev: { ru: 'Веб-разработка', en: 'Web Development' },
	design: { ru: 'Дизайн', en: 'Design' },
	business: { ru: 'Бизнес и финансы', en: 'Business & Finance' },
	content: { ru: 'Создание контента', en: 'Content Creation' },
	security: { ru: 'Безопасность', en: 'Security & Privacy' },
	multimedia: { ru: 'Мультимедиа', en: 'Multimedia' },
	analytics: { ru: 'Аналитика и данные', en: 'Analytics & Data' },
	lifestyle: { ru: 'Здоровье и образ жизни', en: 'Health & Lifestyle' }
}

const iconMap: Record<string, any> = {
	webdev: Code2,
	design: Palette,
	business: Briefcase,
	content: FileText,
	security: Lock,
	multimedia: Film,
	analytics: BarChart,
	lifestyle: Activity,
	default: Layers
}

export function CategoryCard({
	categoryKey,
	name,
	count,
	gradient,
	locale
}: CategoryCardProps) {
	const Icon = iconMap[categoryKey] || iconMap.default
	const displayName = categoryTranslations[categoryKey]?.[locale] || name

	return (
		<Card className='group p-5 bg-background/60 backdrop-blur-sm border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300'>
			<div className='flex flex-col items-start text-left gap-3'>
				<div
					className={cn(
						'p-4 rounded-xl bg-gradient-to-br',
						gradient,
						'group-hover:scale-110 transition-transform'
					)}
				>
					<Icon className='w-8 h-8 text-white' />
				</div>
				<div>
					<h3 className='font-semibold group-hover:text-primary transition-colors'>
						{displayName}
					</h3>
					<p className='text-sm text-muted-foreground mt-1'>
						{count} {locale === 'ru' ? 'инструментов' : 'tools'}
					</p>
				</div>
			</div>
		</Card>
	)
}

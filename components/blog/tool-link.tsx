'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink, ArrowRight } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { CornerBadge } from '@/components/tools/CornerBadge'

type IconComponentType = React.ComponentType<{ className?: string }>

/**
 * Имя иконки приходит из displayName компонента lucide («Grid3x3»), а экспорт
 * называется иначе («Grid3X3»). Прямой поиск по ключу поэтому промахивается —
 * ищем ещё и по displayName, без учёта регистра.
 */
const resolveIcon = (name: string): IconComponentType => {
	const icons = LucideIcons as unknown as Record<string, IconComponentType>

	const direct = icons[name]
	if (direct) return direct

	const target = name.toLowerCase()
	const found = Object.values(icons).find(
		icon =>
			typeof icon === 'object' &&
			icon !== null &&
			(icon as { displayName?: string }).displayName?.toLowerCase() === target
	)

	return found || LucideIcons.Wrench
}

interface ToolLinkProps {
	href: string
	title: string
	subtitle?: string
	description?: string
	iconName?: string
	gradient?: string
}

export function ToolLink({
	href,
	title,
	subtitle,
	description,
	iconName = 'Wrench',
	gradient = 'from-blue-500 to-cyan-500'
}: ToolLinkProps) {
	const isExternal = href.startsWith('http')

	const IconComponent = resolveIcon(iconName)

	return (
		<Link
			href={href}
			target={isExternal ? '_blank' : undefined}
			rel={isExternal ? 'noopener noreferrer' : undefined}
			className='group relative my-8 block cursor-pointer overflow-hidden rounded-3xl px-6 py-8 sm:px-10 sm:py-10'
		>
			{/* Фон карточки: паттерн клипуется по скруглению. Квадратный
			    бейдж-уголок (CornerBadge) сидит поверх, вплотную в углу — тот же
			    приём, что и в ToolCard/hero, вырезать под него дыру не нужно */}
			<span className='pointer-events-none absolute inset-0 overflow-hidden rounded-3xl bg-muted dark:bg-card'>
				<Image
					src='/images/patterns/contour-1.png'
					alt=''
					aria-hidden
					width={760}
					height={760}
					className='absolute -right-72 top-1/2 w-[36rem] max-w-none -translate-y-1/2 select-none opacity-[0.07] transition duration-500 group-hover:scale-110 group-hover:opacity-[0.16] dark:opacity-[0.1] dark:group-hover:opacity-[0.2] dark:invert'
				/>
			</span>

			<CornerBadge icon={IconComponent} gradient={gradient} />

			<div className='relative min-w-0 space-y-3'>
				<div className='flex items-center gap-2'>
					<h4 className='text-2xl font-bold tracking-tight text-foreground text-balance sm:text-3xl'>
						{title}
					</h4>
					{isExternal && (
						<ExternalLink className='h-5 w-5 flex-shrink-0 text-muted-foreground' />
					)}
				</div>
				{subtitle && (
					<p className='text-sm font-medium text-primary/80'>{subtitle}</p>
				)}
				{description && (
					<p className='text-base leading-relaxed text-muted-foreground'>
						{description}
					</p>
				)}
				<div className='pt-1'>
					<span className='inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors group-hover:bg-primary/90'>
						Попробовать
						<ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-0.5' />
					</span>
				</div>
			</div>
		</Link>
	)
}

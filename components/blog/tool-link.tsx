'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import * as LucideIcons from 'lucide-react'

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
	const buttonText = 'Попробовать →'

	const IconComponent = resolveIcon(iconName)

	return (
		<Link
			href={href}
			target={isExternal ? '_blank' : undefined}
			rel={isExternal ? 'noopener noreferrer' : undefined}
			className='group relative my-8 block cursor-pointer overflow-hidden rounded-3xl border bg-muted px-6 py-8 transition-colors hover:border-primary/40 dark:bg-card sm:px-10 sm:py-10'
		>
			{/* Тот же контурный паттерн, что в блоке «Не нашли нужный инструмент?» */}
			<Image
				src='/images/patterns/contour-1.png'
				alt=''
				aria-hidden
				width={760}
				height={760}
				className='pointer-events-none absolute -right-72 top-1/2 w-[36rem] max-w-none -translate-y-1/2 select-none opacity-[0.07] dark:opacity-[0.1] dark:invert'
			/>

			<div className='relative grid items-center gap-6 sm:grid-cols-[auto_1fr] sm:gap-8'>
				{/* Градиент иконки — фирменный цвет инструмента, как на карточках
				    по всему сайту */}
				<div className='hidden sm:block'>
					<div
						className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient}`}
					>
						<IconComponent className='h-8 w-8 text-white' />
					</div>
				</div>

				<div className='min-w-0 space-y-3'>
					<div className='flex items-center gap-2'>
						<h4 className='text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-3xl'>
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
						<span className='inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors group-hover:bg-primary/90'>
							{buttonText}
						</span>
					</div>
				</div>
			</div>
		</Link>
	)
}

import Link from 'next/link'
import { GooseLabsCredit } from '@/components/layout/GooseLabsCredit'

const LINKS = [
	{ href: '/tools', label: 'Инструменты' },
	{ href: '/blog', label: 'Блог' },
	{ href: '/contact', label: 'Контакты' }
]

/**
 * Футер для страниц инструментов.
 *
 * Общий футер здесь не подходит: раскладка инструмента держит фиксированную
 * высоту с внутренней прокруткой, и большой футер снаружи распирал колонки,
 * ломая сайдбар. Этот живёт внутри прокручиваемой области и занимает одну строку.
 */
export function CompactFooter() {
	const year = new Date().getFullYear()

	return (
		<footer className='mt-16 border-t pt-6 pb-4'>
			<div className='flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row'>
				<div className='flex flex-col items-center gap-3 sm:items-start'>
					<span>© {year} PixelTool</span>
					{/* От lg плашка живёт в правом сайдбаре (ProjectsRightSidebar). */}
					<div className='lg:hidden'>
						<GooseLabsCredit placement='tool_footer' />
					</div>
				</div>

				<nav className='flex items-center gap-5'>
					{LINKS.map(link => (
						<Link
							key={link.href}
							href={link.href}
							className='cursor-pointer transition-colors hover:text-foreground'
						>
							{link.label}
						</Link>
					))}
				</nav>
			</div>
		</footer>
	)
}

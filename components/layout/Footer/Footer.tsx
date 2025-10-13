import Link from 'next/link'
import {
	Code2,
	Github,
	Mail,
	ExternalLink,
	Heart,
	Sparkles
} from 'lucide-react'
import { Logo } from '@/components/global/Logo'

export const Footer = () => {
	const year = new Date().getFullYear()

	const footerLinks = {
		tools: {
			title: 'Инструменты',
			links: [
				{ label: 'Все инструменты', href: '/tools' },
				{ label: 'CSS инструменты', href: '/tools?category=css' },
				{ label: 'HTML инструменты', href: '/tools?category=html' },
				{ label: 'JavaScript инструменты', href: '/tools?category=javascript' }
			]
		},
		company: {
			title: 'Компания',
			links: [
				{ label: 'О нас', href: '/about' },
				{ label: 'Блог', href: '/blog' },
				{ label: 'Контакты', href: '/contact' }
			]
		},
		legal: {
			title: 'Юридическое',
			links: [
				{ label: 'Политика конфиденциальности', href: '/privacy' },
				{ label: 'Условия использования', href: '/terms' }
			]
		}
	}

	const socialLinks = [
		{
			icon: Github,
			href: 'https://github.com/goosen-x/pixeltool',
			label: 'GitHub',
			showExternal: true
		},
		{
			icon: Mail,
			href: '/contact',
			label: 'Связаться',
			showExternal: false
		}
	]

	return (
		<footer className='border-t border-border/50 bg-background'>
			<div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
				{/* Main Footer Content */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-12'>
					{/* Brand Section */}
					<div className='lg:col-span-4'>
						<Link
							href='/'
							className='inline-flex items-center gap-3 text-xl font-bold hover:opacity-80 transition-opacity mb-4'
						>
							<Logo size={32} />
							<span className='font-heading bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
								PixelTool
							</span>
						</Link>
						<p className='text-sm text-muted-foreground mb-6 leading-relaxed max-w-sm'>
							Профессиональные веб-инструменты для разработчиков и дизайнеров.
							Работают прямо в браузере, быстро и бесплатно.
						</p>

						{/* Social Links */}
						<div className='flex gap-3'>
							{socialLinks.map((social, idx) => (
								<Link
									key={idx}
									href={social.href}
									target={social.showExternal ? '_blank' : undefined}
									rel={social.showExternal ? 'noopener noreferrer' : undefined}
									className='group p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-200 border border-transparent hover:border-border/50'
									aria-label={social.label}
								>
									<div className='relative'>
										<social.icon className='w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors' />
										{social.showExternal && (
											<ExternalLink className='w-2.5 h-2.5 absolute -top-1 -right-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity' />
										)}
									</div>
								</Link>
							))}
						</div>
					</div>

					{/* Links Sections */}
					<div className='lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8'>
						{/* Tools */}
						<div>
							<h3 className='text-sm font-semibold mb-4 text-foreground'>
								{footerLinks.tools.title}
							</h3>
							<ul className='space-y-3'>
								{footerLinks.tools.links.map((link, idx) => (
									<li key={idx}>
										<Link
											href={link.href}
											className='text-sm text-muted-foreground hover:text-foreground transition-colors'
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>

						{/* Company */}
						<div>
							<h3 className='text-sm font-semibold mb-4 text-foreground'>
								{footerLinks.company.title}
							</h3>
							<ul className='space-y-3'>
								{footerLinks.company.links.map((link, idx) => (
									<li key={idx}>
										<Link
											href={link.href}
											className='text-sm text-muted-foreground hover:text-foreground transition-colors'
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>

						{/* Legal */}
						<div>
							<h3 className='text-sm font-semibold mb-4 text-foreground'>
								{footerLinks.legal.title}
							</h3>
							<ul className='space-y-3'>
								{footerLinks.legal.links.map((link, idx) => (
									<li key={idx}>
										<Link
											href={link.href}
											className='text-sm text-muted-foreground hover:text-foreground transition-colors'
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className='pt-8 border-t border-border/50'>
					<div className='flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground'>
						<div className='flex items-center gap-2'>
							<span>© {year} PixelTool.</span>
							<span className='hidden sm:inline'>Все права защищены.</span>
						</div>

						<div className='flex items-center gap-1.5 text-xs'>
							<span>Сделано с</span>
							<Heart className='w-3.5 h-3.5 text-red-500 fill-current animate-pulse' />
							<span>для разработчиков</span>
						</div>
					</div>
				</div>
			</div>
		</footer>
	)
}

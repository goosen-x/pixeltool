import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { 
	Code2, 
	Palette, 
	Zap, 
	Globe, 
	Star,
	Github,
	Twitter,
	Linkedin,
	Heart,
	Terminal,
	Sparkles,
	ArrowUpRight
} from 'lucide-react'
import { Logo } from '@/components/global/Logo'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const Footer = async () => {
	const year = new Date().getFullYear()
	const t = await getTranslations('Footer')
	const tWidgets = await getTranslations('widgets')

	// Tool categories for quick access
	const toolCategories = [
		{
			title: 'Developer Tools',
			icon: Code2,
			tools: [
				'Color Converter',
				'JSON Formatter',
				'Base64 Encoder',
				'Regex Tester'
			]
		},
		{
			title: 'Design Tools',
			icon: Palette,
			tools: [
				'Gradient Generator',
				'Shadow Generator',
				'Palette Creator',
				'Favicon Generator'
			]
		},
		{
			title: 'Productivity',
			icon: Zap,
			tools: [
				'Password Generator',
				'Lorem Ipsum',
				'QR Code Generator',
				'URL Shortener'
			]
		}
	]

	const stats = [
		{ label: '50+', sublabel: 'Professional Tools' },
		{ label: '100K+', sublabel: 'Monthly Users' },
		{ label: '99.9%', sublabel: 'Uptime' },
		{ label: 'Free', sublabel: 'Forever' }
	]

	return (
		<footer className='bg-muted/30 border-t'>
			<div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
				{/* Main Footer Content */}
				<div className='grid gap-12 lg:grid-cols-5'>
					{/* Brand Section */}
					<div className='lg:col-span-2 space-y-6'>
						<div className='flex items-center gap-3'>
							<Logo size={48} />
							<div>
								<h2 className='text-2xl font-heading font-bold'>PixelTool</h2>
								<p className='text-sm text-muted-foreground'>
									Professional tools for developers
								</p>
							</div>
						</div>
						
						<p className='text-muted-foreground leading-relaxed max-w-md'>
							{t('description')}
						</p>

						{/* Stats */}
						<div className='grid grid-cols-2 gap-4 max-w-sm'>
							{stats.map((stat, idx) => (
								<div key={idx} className='text-center p-3 rounded-lg bg-background/50'>
									<div className='text-xl font-heading font-bold text-primary'>
										{stat.label}
									</div>
									<div className='text-xs text-muted-foreground'>
										{stat.sublabel}
									</div>
								</div>
							))}
						</div>

						{/* Social Links */}
						<div className='flex items-center gap-3'>
							<Link 
								href='https://github.com/yourusername' 
								className='p-2.5 rounded-lg bg-background hover:bg-primary/10 hover:text-primary transition-all'
								target='_blank'
							>
								<Github className='w-5 h-5' />
							</Link>
							<Link 
								href='https://twitter.com/yourusername' 
								className='p-2.5 rounded-lg bg-background hover:bg-primary/10 hover:text-primary transition-all'
								target='_blank'
							>
								<Twitter className='w-5 h-5' />
							</Link>
							<Link 
								href='https://linkedin.com/in/yourusername' 
								className='p-2.5 rounded-lg bg-background hover:bg-primary/10 hover:text-primary transition-all'
								target='_blank'
							>
								<Linkedin className='w-5 h-5' />
							</Link>
						</div>
					</div>

					{/* Tool Categories */}
					{toolCategories.map((category, idx) => (
						<div key={idx} className='space-y-4'>
							<div className='flex items-center gap-2'>
								<category.icon className='w-5 h-5 text-primary' />
								<h3 className='font-heading font-semibold'>
									{category.title}
								</h3>
							</div>
							<ul className='space-y-2'>
								{category.tools.map((tool, toolIdx) => (
									<li key={toolIdx}>
										<Link 
											href='#' 
											className='text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group'
										>
											{tool}
											<ArrowUpRight className='w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all' />
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				{/* Newsletter Section */}
				<div className='mt-12 pt-12 border-t'>
					<div className='mx-auto max-w-2xl text-center space-y-6'>
						<div className='flex justify-center'>
							<Badge variant='outline' className='gap-1'>
								<Terminal className='w-3 h-3' />
								Stay Updated
							</Badge>
						</div>
						<h3 className='text-2xl font-heading font-bold'>
							Get notified about new tools
						</h3>
						<p className='text-muted-foreground'>
							Join 10,000+ developers who receive updates about new tools and features
						</p>
						<form className='flex flex-col sm:flex-row gap-3 max-w-md mx-auto'>
							<input
								type='email'
								placeholder='your@email.com'
								className='flex-1 px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
							/>
							<Button className='gap-2'>
								Subscribe
								<Sparkles className='w-4 h-4' />
							</Button>
						</form>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className='mt-12 pt-8 border-t'>
					<div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
						<div className='flex items-center gap-6 text-sm text-muted-foreground'>
							<span>© {year} PixelTool</span>
							<Link href='/privacy' className='hover:text-primary transition-colors'>
								Privacy
							</Link>
							<Link href='/terms' className='hover:text-primary transition-colors'>
								Terms
							</Link>
							<Link href='/api' className='hover:text-primary transition-colors'>
								API
							</Link>
						</div>
						<div className='flex items-center gap-2 text-sm text-muted-foreground'>
							<span>Made with</span>
							<Heart className='w-4 h-4 text-red-500 fill-red-500' />
							<span>by</span>
							<Link 
								href='https://github.com/yourusername' 
								className='font-medium hover:text-primary transition-colors'
								target='_blank'
							>
								Dmitry Borisenko
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	)
}
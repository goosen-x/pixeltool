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
	ArrowUpRight,
	Mail,
	ExternalLink,
	Rocket
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
		{ label: '5K+', sublabel: 'Active Developers' },
		{ label: '99.9%', sublabel: 'Uptime' },
		{ label: 'Free', sublabel: 'Forever' }
	]

	return (
		<footer className='relative'>
			{/* Gradient Background */}
			<div className='absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-muted/50' />
			<div className='absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5' />
			
			{/* Decorative Elements */}
			<div className='absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-border to-transparent' />
			<div className='absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-border to-transparent' />
			
			<div className='relative'>
				<div className='mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8'>
					{/* Hero Section */}
					<div className='text-center mb-16'>
						<div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6'>
							<Rocket className='w-4 h-4 text-primary' />
							<span className='text-sm font-medium text-primary'>50+ Professional Tools</span>
						</div>
						<h2 className='text-4xl md:text-5xl font-heading font-bold mb-4'>
							<span className='bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent'>
								PixelTool
							</span>
						</h2>
						<p className='text-xl text-muted-foreground max-w-2xl mx-auto mb-8'>
							The ultimate toolkit for developers, designers, and digital creators. 
							Everything you need, right in your browser.
						</p>
						
						{/* CTA Buttons */}
						<div className='flex flex-col sm:flex-row gap-4 justify-center'>
							<Button size='lg' className='gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90'>
								<Terminal className='w-5 h-5' />
								Explore Tools
							</Button>
							<Button size='lg' variant='outline' className='gap-2'>
								<Github className='w-5 h-5' />
								Star on GitHub
								<ExternalLink className='w-4 h-4' />
							</Button>
						</div>
					</div>

					{/* Stats Grid */}
					<div className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-16'>
						{stats.map((stat, idx) => (
							<div key={idx} className='group text-center p-6 rounded-2xl bg-background/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:scale-105'>
								<div className='text-3xl md:text-4xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2'>
									{stat.label}
								</div>
								<div className='text-sm text-muted-foreground font-medium'>
									{stat.sublabel}
								</div>
							</div>
						))}
					</div>

					{/* Tool Categories Grid */}
					<div className='grid md:grid-cols-3 gap-8 mb-16'>
						{toolCategories.map((category, idx) => (
							<div key={idx} className='group p-6 rounded-2xl bg-background/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300'>
								<div className='flex items-center gap-3 mb-4'>
									<div className='p-3 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20'>
										<category.icon className='w-6 h-6 text-primary' />
									</div>
									<h3 className='text-xl font-heading font-bold'>
										{category.title}
									</h3>
								</div>
								<ul className='space-y-3'>
									{category.tools.map((tool, toolIdx) => (
										<li key={toolIdx}>
											<Link 
												href='#' 
												className='flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-all group/item'
											>
												<span className='text-muted-foreground group-hover/item:text-foreground transition-colors'>
													{tool}
												</span>
												<ArrowUpRight className='w-4 h-4 text-muted-foreground opacity-0 group-hover/item:opacity-100 transition-all' />
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>

					{/* Newsletter Section */}
					<div className='relative mb-16'>
						<div className='absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl' />
						<div className='relative p-8 md:p-12 text-center'>
							<div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 border border-border/50 mb-6'>
								<Mail className='w-4 h-4 text-primary' />
								<span className='text-sm font-medium'>Join the Community</span>
							</div>
							<h3 className='text-3xl md:text-4xl font-heading font-bold mb-4'>
								Stay ahead of the curve
							</h3>
							<p className='text-lg text-muted-foreground mb-8 max-w-2xl mx-auto'>
								Get notified about new tools, features, and updates. Join 10,000+ developers who trust us.
							</p>
							<form className='flex flex-col sm:flex-row gap-4 max-w-md mx-auto'>
								<input
									type='email'
									placeholder='your@email.com'
									className='flex-1 px-6 py-3 rounded-xl border border-border/50 bg-background/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
								/>
								<Button size='lg' className='gap-2 bg-gradient-to-r from-primary to-accent'>
									Subscribe
									<Sparkles className='w-4 h-4' />
								</Button>
							</form>
						</div>
					</div>

					{/* Social Links */}
					<div className='flex justify-center gap-4 mb-12'>
						{[
							{ icon: Github, href: 'https://github.com/goosen-x/pixeltool', label: 'GitHub' },
							{ icon: Twitter, href: 'https://twitter.com/yourusername', label: 'Twitter' },
							{ icon: Linkedin, href: 'https://linkedin.com/in/dmitryborisenko', label: 'LinkedIn' },
							{ icon: Mail, href: 'mailto:contact@pixeltool.pro', label: 'Email' }
						].map((social, idx) => (
							<Link
								key={idx}
								href={social.href}
								target='_blank'
								className='group p-4 rounded-xl bg-background/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300'
								aria-label={social.label}
							>
								<social.icon className='w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors' />
							</Link>
						))}
					</div>

					{/* Bottom Bar */}
					<div className='pt-8 border-t border-border/50'>
						<div className='flex flex-col md:flex-row justify-between items-center gap-6'>
							<div className='flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-muted-foreground'>
								<span>© {year} PixelTool. All rights reserved.</span>
								<Link href='/privacy' className='hover:text-primary transition-colors'>
									Privacy Policy
								</Link>
								<Link href='/terms' className='hover:text-primary transition-colors'>
									Terms of Service
								</Link>
								<Link href='/api' className='hover:text-primary transition-colors'>
									API Documentation
								</Link>
							</div>
							<div className='flex items-center gap-2 text-sm text-muted-foreground'>
								<span>Crafted with</span>
								<Heart className='w-4 h-4 text-red-500 fill-red-500 animate-pulse' />
								<span>by</span>
								<Link 
									href='https://github.com/goosen-x/pixeltool' 
									className='font-medium text-primary hover:text-accent transition-colors'
									target='_blank'
								>
									Dmitry Borisenko
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	)
}
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

	const stats = [
		{ label: '50+', sublabel: t('stats.professionalTools') },
		{ label: '5K+', sublabel: t('stats.activeDevelopers') },
		{ label: '99.9%', sublabel: t('stats.uptime') },
		{ label: 'Free', sublabel: t('stats.forever') }
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
							<span className='text-sm font-medium text-primary'>
								{t('badge')}
							</span>
						</div>
						<h2 className='text-4xl md:text-5xl font-heading font-bold mb-4'>
							<span className='bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent'>
								{t('title')}
							</span>
						</h2>
						<p className='text-xl text-muted-foreground max-w-2xl mx-auto mb-8'>
							{t('heroDescription')}
						</p>

						{/* CTA Buttons */}
						<div className='flex flex-col sm:flex-row gap-4 justify-center'>
							<Button
								size='lg'
								className='gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90'
							>
								<Terminal className='w-5 h-5' />
								{t('exploreTools')}
							</Button>
							<Button size='lg' variant='outline' className='gap-2'>
								<Github className='w-5 h-5' />
								{t('starOnGitHub')}
								<ExternalLink className='w-4 h-4' />
							</Button>
						</div>
					</div>

					{/* Stats Grid */}
					<div className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-16'>
						{stats.map((stat, idx) => (
							<div
								key={idx}
								className='group text-center p-6 rounded-2xl bg-background/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:scale-105'
							>
								<div className='text-3xl md:text-4xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2'>
									{stat.label}
								</div>
								<div className='text-sm text-muted-foreground font-medium'>
									{stat.sublabel}
								</div>
							</div>
						))}
					</div>

					{/* Newsletter Section */}
					<div className='relative mb-16'>
						<div className='absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl' />
						<div className='relative p-8 md:p-12 text-center'>
							<div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 border border-border/50 mb-6'>
								<Mail className='w-4 h-4 text-primary' />
								<span className='text-sm font-medium'>
									{t('newsletter.badge')}
								</span>
							</div>
							<p className='text-3xl md:text-4xl font-heading font-bold mb-4'>
								{t('newsletter.title')}
							</p>
							<p className='text-lg text-muted-foreground mb-8 max-w-2xl mx-auto'>
								{t('newsletter.description')}
							</p>
							<form className='flex flex-col sm:flex-row gap-4 max-w-md mx-auto'>
								<input
									type='email'
									placeholder={t('newsletter.placeholder')}
									aria-label={t('newsletter.placeholder')}
									className='flex-1 px-6 py-3 rounded-xl border border-border/50 bg-background/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
								/>
								<Button
									size='lg'
									className='gap-2 bg-gradient-to-r from-primary to-accent'
								>
									{t('newsletter.subscribe')}
									<Sparkles className='w-4 h-4' />
								</Button>
							</form>
						</div>
					</div>

					{/* Social Links */}
					<div className='flex justify-center gap-4 mb-12'>
						{[
							{
								icon: Github,
								href: 'https://github.com/goosen-x/pixeltool',
								label: 'GitHub'
							},
							{
								icon: Twitter,
								href: 'https://twitter.com/yourusername',
								label: 'Twitter'
							},
							{
								icon: Linkedin,
								href: 'https://linkedin.com/in/dmitryborisenko',
								label: 'LinkedIn'
							},
							{
								icon: Mail,
								href: 'mailto:contact@pixeltool.pro',
								label: 'Email'
							}
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
						<div className='flex items-center justify-center text-sm text-muted-foreground'>
							<span>{t('legal.copyright', { year })}</span>
						</div>
					</div>
				</div>
			</div>
		</footer>
	)
}

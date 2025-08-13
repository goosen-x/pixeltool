import { Block } from '@/components/ui/block'
import { useTranslations } from 'next-intl'
import { OptimizedImage } from '@/components/ui/optimized-image'
import Link from 'next/link'
import React from 'react'
import { FiArrowRight } from 'react-icons/fi'
import { 
	Sparkles, 
	Code2, 
	Palette, 
	Zap, 
	ArrowRight,
	Github,
	Linkedin,
	Mail,
	ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import avatarImg from '@/public/images/avatar.jpeg'

export const HeaderBlock = () => {
	const t = useTranslations('SectionMain')

	const email = 'dmitryborisenko.msk@gmail.com'
	const subject = t('email.subject')
	const body = t('email.body')

	const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
		subject
	)}&body=${encodeURIComponent(body)}`

	return (
		<Block className='col-span-12 row-span-2 md:col-span-8 relative overflow-hidden'>
			{/* Background Gradients */}
			<div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5' />
			<div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl' />
			<div className='absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-2xl' />
			
			{/* Content */}
			<div className='relative z-10'>
				{/* Status Badge */}
				<div className='mb-6'>
					<Badge variant='outline' className='gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm border-primary/20'>
						<div className='w-2 h-2 bg-green-500 rounded-full animate-pulse' />
						<span className='text-sm font-medium'>Available for projects</span>
					</Badge>
				</div>

				{/* Avatar with enhanced styling */}
				<div className='relative mb-8'>
					<div className='absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-lg scale-110 opacity-50' />
					<OptimizedImage
						className='relative group-hover/block:z-0 size-24 rounded-full object-cover border-2 border-primary/20 group-hover/block:w-32 group-hover/block:h-32 group-hover/block:border-primary/40 transition-all duration-500 shadow-xl'
						src={avatarImg.src}
						width={500}
						height={500}
						alt='Borisenko Dmitry'
					/>
					<div className='absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full border-2 border-background flex items-center justify-center'>
						<Sparkles className='w-3 h-3 text-white' />
					</div>
				</div>

				{/* Main Heading */}
				<div className='mb-8'>
					<h1 className='text-4xl lg:text-5xl xl:text-6xl font-heading font-bold leading-tight mb-4'>
						<span className='bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent'>
							{t('name')}
						</span>
					</h1>
					<p className='text-xl lg:text-2xl text-muted-foreground font-medium mb-2'>
						{t('job')}
					</p>
					<p className='text-lg text-muted-foreground max-w-lg leading-relaxed'>
						Building exceptional digital experiences with modern tools and technologies. 
						Passionate about creating innovative solutions for web development.
					</p>
				</div>

				{/* Feature Highlights */}
				<div className='flex flex-wrap gap-3 mb-8'>
					{[
						{ icon: Code2, label: 'Full-Stack Dev', color: 'from-blue-500 to-cyan-500' },
						{ icon: Palette, label: 'UI/UX Design', color: 'from-purple-500 to-pink-500' },
						{ icon: Zap, label: 'Performance', color: 'from-yellow-500 to-orange-500' }
					].map((item, idx) => (
						<div key={idx} className='flex items-center gap-2 px-3 py-2 rounded-full bg-background/60 backdrop-blur-sm border border-border/50'>
							<div className={`p-1.5 rounded-full bg-gradient-to-r ${item.color}`}>
								<item.icon className='w-3 h-3 text-white' />
							</div>
							<span className='text-sm font-medium text-muted-foreground'>{item.label}</span>
						</div>
					))}
				</div>

				{/* CTA Buttons */}
				<div className='flex flex-col sm:flex-row gap-4 mb-8'>
					<Button 
						asChild
						size='lg' 
						className='gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300'
					>
						<Link href={mailtoLink}>
							<Mail className='w-5 h-5' />
							{t('contact')}
							<ArrowRight className='w-4 h-4' />
						</Link>
					</Button>
					
					<Button 
						asChild
						variant='outline' 
						size='lg' 
						className='gap-2 bg-background/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 hover:bg-primary/5'
					>
						<Link href='/tools' target='_blank'>
							<Sparkles className='w-5 h-5' />
							View My Tools
							<ExternalLink className='w-4 h-4' />
						</Link>
					</Button>
				</div>

				{/* Social Links */}
				<div className='flex gap-3'>
					{[
						{ icon: Github, href: 'https://github.com/goosen-x/pixeltool', label: 'GitHub' },
						{ icon: Linkedin, href: 'https://linkedin.com/in/dmitryborisenko', label: 'LinkedIn' },
						{ icon: Mail, href: mailtoLink, label: 'Email' }
					].map((social, idx) => (
						<Link
							key={idx}
							href={social.href}
							target={social.href.startsWith('http') ? '_blank' : undefined}
							className='group p-3 rounded-xl bg-background/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300'
							aria-label={social.label}
						>
							<social.icon className='w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors' />
						</Link>
					))}
				</div>
			</div>
		</Block>
	)
}

import { Mail, MapPin, Clock, Phone } from 'lucide-react'
import { FaTelegram, FaGithub, FaLinkedin } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'

type Props = {
	locale: string
}

export default function ContactInfo({ locale }: Props) {
	const contactItems = [
		{
			icon: Mail,
			label: 'Email',
			value: 'dmitryborisenko.msk@gmail.com',
			href: 'mailto:dmitryborisenko.msk@gmail.com'
		},
		{
			icon: Phone,
			label: 'Telegram',
			value: '@borisenko_dmitry',
			href: 'https://t.me/borisenko_dmitry'
		},
		{
			icon: MapPin,
			label: 'Местоположение',
			value: 'Москва, Россия'
		},
		{
			icon: Clock,
			label: 'Часовой пояс',
			value: 'GMT+3 (Moscow)'
		}
	]

	const socialLinks = [
		{
			name: 'GitHub',
			icon: FaGithub,
			href: 'https://github.com/goosen-x',
			color: 'hover:text-gray-900 dark:hover:text-gray-100'
		},
		{
			name: 'LinkedIn',
			icon: FaLinkedin,
			href: 'https://www.linkedin.com/in/dmitry-borisenko-9a8144128/',
			color: 'hover:text-blue-600 dark:hover:text-blue-400'
		},
		{
			name: 'Telegram',
			icon: FaTelegram,
			href: 'https://t.me/borisenko_dmitry',
			color: 'hover:text-blue-500 dark:hover:text-blue-400'
		},
		{
			name: 'Twitter/X',
			icon: FaXTwitter,
			href: 'https://x.com/Brsnk_Dmtr',
			color: 'hover:text-gray-900 dark:hover:text-gray-100'
		}
	]

	return (
		<div className='space-y-8'>
			{/* Contact Details */}
			<div className='space-y-6'>
				{contactItems.map((item, index) => (
					<div key={index} className='flex items-start gap-4'>
						<div className='flex-shrink-0'>
							<div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center'>
								<item.icon className='w-5 h-5 text-primary' />
							</div>
						</div>
						<div className='flex-1'>
							<h3 className='font-semibold text-foreground mb-1'>
								{item.label}
							</h3>
							{item.href ? (
								<a
									href={item.href}
									target={item.href.startsWith('mailto:') ? '_self' : '_blank'}
									rel={
										item.href.startsWith('mailto:')
											? undefined
											: 'noopener noreferrer'
									}
									className='text-muted-foreground hover:text-primary transition-colors'
								>
									{item.value}
								</a>
							) : (
								<p className='text-muted-foreground'>{item.value}</p>
							)}
						</div>
					</div>
				))}
			</div>

			{/* Social Media */}
			<div>
				<h3 className='font-semibold text-foreground mb-4'>Социальные сети</h3>
				<div className='flex gap-4'>
					{socialLinks.map(social => (
						<a
							key={social.name}
							href={social.href}
							target='_blank'
							rel='noopener noreferrer'
							className={`w-12 h-12 bg-card border rounded-lg flex items-center justify-center text-muted-foreground transition-colors ${social.color}`}
							title={social.name}
						>
							<social.icon className='w-5 h-5' />
						</a>
					))}
				</div>
			</div>
		</div>
	)
}

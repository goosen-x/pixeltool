import { getTranslations } from 'next-intl/server'
import ContactForm from '@/components/contact/ContactForm'
import ContactInfo from '@/components/contact/ContactInfo'

type Props = {
	params: Promise<{
		locale: string
	}>
}

export default async function ContactPage(props: Props) {
	const params = await props.params
	const t = await getTranslations('contact')

	return (
		<main className='min-h-screen bg-background'>
			<div className='max-w-7xl mx-auto px-5 py-12'>
				{/* Header */}
				<div className='text-center mb-16'>
					<h1 className='text-4xl md:text-6xl font-bold text-foreground mb-4'>
						{t('title')}
					</h1>
					<p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
						{t('subtitle')}
					</p>
				</div>

				{/* Content Grid */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
					{/* Contact Form */}
					<div className='space-y-8'>
						<div>
							<h2 className='text-2xl font-bold text-foreground mb-4'>
								{t('form.title')}
							</h2>
							<p className='text-muted-foreground mb-6'>
								{t('form.description')}
							</p>
						</div>
						<ContactForm />
					</div>

					{/* Contact Information */}
					<div className='space-y-8'>
						<div>
							<h2 className='text-2xl font-bold text-foreground mb-4'>
								{t('info.title')}
							</h2>
							<p className='text-muted-foreground mb-6'>
								{t('info.description')}
							</p>
						</div>
						<ContactInfo locale={params.locale} />
					</div>
				</div>
			</div>
		</main>
	)
}

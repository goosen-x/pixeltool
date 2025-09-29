// import { getTranslations } from 'next-intl/server'
import ContactForm from '@/components/contact/ContactForm'
import ContactInfo from '@/components/contact/ContactInfo'

// Force dynamic rendering to avoid build-time errors
export const dynamic = 'force-dynamic'

type Props = {
	params: Promise<{
		locale: string
	}>
}

export default async function ContactPage(props: Props) {
	const params = await props.params
	// const t = await getTranslations('contact')

	return (
		<main className='min-h-screen bg-background'>
			<div className='max-w-7xl mx-auto px-5 py-12'>
				{/* Header */}
				<div className='text-center mb-16'>
					<h1 className='text-4xl md:text-6xl font-bold text-foreground mb-4'>
						Свяжитесь с нами
					</h1>
					<p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
						Мы всегда рады помочь и ответить на ваши вопросы
					</p>
				</div>

				{/* Content Grid */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
					{/* Contact Form */}
					<div className='space-y-8'>
						<div>
							<h2 className='text-2xl font-bold text-foreground mb-4'>
								Отправить сообщение
							</h2>
							<p className='text-muted-foreground mb-6'>
								Заполните форму ниже, и мы ответим вам в течение 24 часов
							</p>
						</div>
						<ContactForm />
					</div>

					{/* Contact Information */}
					<div className='space-y-8'>
						<div>
							<h2 className='text-2xl font-bold text-foreground mb-4'>
								Контактная информация
							</h2>
							<p className='text-muted-foreground mb-6'>
								Найдите нас в социальных сетях или напишите на email
							</p>
						</div>
						<ContactInfo locale={params.locale} />
					</div>
				</div>
			</div>
		</main>
	)
}

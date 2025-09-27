import { Block } from '@/components/ui/block'
// import { useTranslations } from 'next-intl'
// import { useTranslation } from 'react-i18next'

export const AboutBlock = () => {
	// const t = useTranslations('SectionMain')

	return (
		<Block className='col-span-12 md:col-span-8 md:row-span-2 text-2xl leading-snug px-2 py-6 md:px-6 md:py-6'>
			<p className='indent-8 text-pretty text-lg text-accent/60 mr-2 md:text-2xl'>
				'Привет! Я фуллстек разработчик из России.'
			</p>
			<p className='text-foreground indent-8 text-pretty text-lg md:text-2xl'>
				'Я увлечен созданием интерактивных и красивых веб-интерфейсов. Мне нравится кодинг и дизайн, чтобы создавать сайты, которые не только выглядят хорошо, но и обеспечивают приятный пользовательский опыт. Я постоянно стремлюсь к совершенству и неустанно изучаю новые технологии и тренды в веб-разработке.'
			</p>
			<p className='text-foreground indent-8 text-pretty text-lg md:text-2xl'>
				'Это помогает мне создавать современные и инновационные проекты, которые соответствуют высшим стандартам. Мне нравится решать творческие задачи и находить элегантные решения сложных проблем. Мне важно, чтобы каждый проект, над которым я работаю, был не только функциональным, но и оставлял положительное впечатление у пользователей.'
			</p>
		</Block>
	)
}

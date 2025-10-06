import { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

import { SectionTitle } from '@/components/global/SectionTitle'
import { Timeline } from '@/components/ui/timeline'
import { ExperienceItem } from './widgets/experienceItem'

export type ExperienceData = {
	title: string
	job: string
	company: string
	city: string
	companyUrl: string | null
	description: string
	images: string[]
}

export const SectionExperience = ({
	className,
	...rest
}: ComponentPropsWithoutRef<'section'>) => {
	const companies = [
		{
			name: 'mba',
			images: ['/images/mba-experience-3.png', '/images/mba-experience-2.png']
		},
		{
			name: 'dobrostock',
			images: ['/images/dobrostok.png', '/images/dobrostok-2.png']
		},
		{ name: 'inspro', images: ['/images/inspro.png'] },
		{ name: 'mbloq', images: ['/images/mbloq.png'] }
	]

	// Static experience data in Russian
	const experienceData = {
		mba: {
			title: '2023-Сейчас',
			job: 'Фуллстек разработчик',
			company: 'MBA',
			city: 'Москва',
			companyUrl: 'https://www.moscow.mba/',
			description:
				'Разрабатывал и поддерживал веб-приложения для Московской бизнес-академии и нескольких образовательных организаций, используя Next.js на фронтенде, Strapi с PostgreSQL на бэкенде. Работал с Portainer для управления контейнерами, исправлял ошибки и занимался DevOps задачами, связанными с CI/CD и автоматизацией развертывания'
		},
		dobrostock: {
			title: 'Начало 2023',
			job: 'Фуллстек разработчик',
			company: 'Dobrostok',
			city: 'Москва',
			companyUrl: 'https://dobrostock.ru/',
			description:
				'Разработал панель администратора для авторов фотостока Dobrostok, используя T3 стек и Next.js, предоставляя простой в использовании интерфейс для управления контентом. Реализовал систему аутентификации с использованием NextAuth. Оптимизировал изображения на бэкенде, что улучшило производительность сайта и сократило время загрузки'
		},
		inspro: {
			title: '2020-2022',
			job: 'Фронтенд разработчик',
			company: 'InsPro',
			city: 'Москва',
			companyUrl: '',
			description:
				'Разработал фронтенд части для CRM системы страховой компании InsPro, используя React.js и TypeScript. Интегрировал с различными API для работы со страховыми продуктами. Создал интерактивные дашборды для анализа страховых случаев и управления клиентской базой'
		},
		mbloq: {
			title: '2019-2020',
			job: 'Junior разработчик',
			company: 'MBLOQ',
			city: 'Москва',
			companyUrl: '',
			description:
				'Начинал карьеру разработчика в команде MBLOQ, работая над различными веб-проектами. Изучал современные технологии веб-разработки, включая JavaScript, HTML5, CSS3. Участвовал в разработке корпоративных веб-сайтов и небольших веб-приложений'
		}
	}

	const timelineData = companies.map(company => {
		const data = experienceData[company.name as keyof typeof experienceData]
		return {
			title: data.title,
			content: (
				<ExperienceItem
					itemData={{
						title: data.title,
						job: data.job,
						company: data.company,
						city: data.city,
						companyUrl: data.companyUrl === '' ? null : data.companyUrl,
						description: data.description,
						images: company.images
					}}
				/>
			)
		}
	})

	return (
		<section className={cn(className)} {...rest}>
			<SectionTitle className='col-span-12' title='Опыт работы' />
			<Timeline data={timelineData} />
		</section>
	)
}

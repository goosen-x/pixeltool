import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { widgets, widgetCategories, getWidgetsByCategory } from '@/lib/constants/widgets'

interface ProjectCard {
	id: string
	title: string
	description: string
	icon: React.ReactNode
	gradient: string
	path: string
}

const categoryDescriptions = {
	css: 'Tools for working with CSS, layouts, and styling',
	media: 'Tools for working with images, videos, and content',
	dev: 'Tools for developers and debugging',
	productivity: 'Tools for productivity and content creation',
	settings: 'Customize your experience and preferences'
}

export default async function ProjectsPage({
	params
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const t = await getTranslations('projectsPage')
	const widgetT = await getTranslations('widgets')

	const getProjectCards = (category: keyof typeof widgetCategories): ProjectCard[] => {
		return getWidgetsByCategory(category).map(widget => {
			const Icon = widget.icon
			return {
				id: widget.id,
				title: widgetT(`${widget.translationKey}.title`),
				description: widgetT(`${widget.translationKey}.description`),
				icon: <Icon className="w-8 h-8" />,
				gradient: widget.gradient,
				path: widget.path
			}
		})
	}

	const categories = Object.entries(widgetCategories).map(([key, title]) => ({
		id: key,
		title,
		description: categoryDescriptions[key as keyof typeof categoryDescriptions] || '',
		projects: getProjectCards(key as keyof typeof widgetCategories)
	}))

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-12">
				<h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
				<p className="text-xl text-muted-foreground">
					{t('description')}
				</p>
			</div>

			<div className="space-y-12">
				{categories.map((category) => (
					<section key={category.id}>
						<div className="mb-6">
							<h2 className="text-2xl font-semibold mb-2">{category.title}</h2>
							<p className="text-muted-foreground">{category.description}</p>
						</div>

						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{category.projects.map((project) => (
								<Link 
									key={project.id} 
									href={`/${locale}/tools/${project.path}`}
									className="block group"
								>
									<Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
										<CardHeader>
											<div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${project.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
												{project.icon}
											</div>
											<CardTitle className="text-lg">{project.title}</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-sm text-muted-foreground">
												{project.description}
											</p>
										</CardContent>
									</Card>
								</Link>
							))}
						</div>
					</section>
				))}
			</div>
		</div>
	)
}
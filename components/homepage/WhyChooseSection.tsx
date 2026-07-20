import { Zap, Globe, Terminal } from 'lucide-react'
import { widgets, widgetCategories } from '@/lib/constants/widgets'
import { CardPattern } from '@/components/tools/CardPattern'
import { CornerBadge } from '@/components/tools/CornerBadge'

// Карточки в стиле ToolCard (тот же угол-бейдж с вырезами и контурный
// паттерн-фон), чтобы секция не выбивалась из общего дизайна карточек
// инструментов — раньше здесь был отдельный стиль (icon-квадрат без выреза).
// Бейджи — монохромная шкала: чёрный слева, к каждой следующей карточке
// светлее к серому (не цветной акцент, чтобы секция читалась спокойнее).
const features = [
	{
		icon: Zap,
		gradient: 'from-neutral-900 to-neutral-700',
		pattern: 0,
		title: 'Молниеносная скорость',
		description:
			'Все инструменты работают прямо в браузере без задержек. Никаких загрузок, установок или ожидания.',
		tags: ['0ms задержка', 'Офлайн режим']
	},
	{
		icon: Globe,
		gradient: 'from-neutral-700 to-neutral-500',
		pattern: 1,
		title: 'Всегда под рукой',
		description:
			'Ничего скачивать не нужно — открывается сразу в любом браузере, на любом устройстве.',
		tags: ['Без установки', 'Без регистрации']
	},
	{
		icon: Terminal,
		gradient: 'from-neutral-500 to-neutral-400',
		pattern: 4,
		title: `${widgets.length} инструментов`,
		description:
			'От QR-кодов и генератора паролей до CSS-инструментов и работы с текстом — всё нужное под рукой.',
		tags: [
			`${Object.keys(widgetCategories).length} категорий`,
			'От бытовых до рабочих'
		]
	}
] as const

export function WhyChooseSection() {
	return (
		<section className='relative px-4 py-12 sm:py-16 md:py-20 sm:px-6 lg:px-8 overflow-hidden'>
			<div className='absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent' />
			<div className='absolute left-0 top-1/2 -translate-y-1/2 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-r from-primary/10 to-transparent rounded-full blur-2xl sm:blur-3xl' />
			<div className='absolute right-0 top-1/2 -translate-y-1/2 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-l from-accent/10 to-transparent rounded-full blur-2xl sm:blur-3xl' />

			<div className='relative mx-auto max-w-7xl'>
				<div className='text-center mb-12 sm:mb-20'>
					<h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 sm:mb-6'>
						Почему выбирают PixelTool?
					</h2>
					<p className='text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4'>
						Не надо искать отдельный сайт под каждую мелочь. Всё нужное — под
						рукой и работает сразу.
					</p>
				</div>

				<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
					{features.map(feature => (
						<div
							key={feature.title}
							className='group relative flex h-full flex-col overflow-hidden rounded-3xl px-6 py-7'
						>
							<span className='pointer-events-none absolute inset-0 overflow-hidden rounded-3xl bg-muted dark:bg-card'>
								<span className='absolute inset-0 text-foreground opacity-[0.02] transition-opacity duration-500 group-hover:opacity-[0.04] dark:opacity-[0.03]'>
									<CardPattern variant={feature.pattern} />
								</span>
							</span>

							<CornerBadge icon={feature.icon} gradient={feature.gradient} />

							<div className='relative flex flex-1 flex-col'>
								<h3 className='pr-14 text-balance text-xl sm:text-2xl font-heading font-bold text-foreground'>
									{feature.title}
								</h3>
								<p className='mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground'>
									{feature.description}
								</p>
								<div className='mt-5 flex flex-col gap-3 sm:flex-row'>
									{feature.tags.map(tag => (
										<div key={tag} className='flex items-center gap-2'>
											<div className='h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500' />
											<span className='text-xs sm:text-sm text-muted-foreground'>
												{tag}
											</span>
										</div>
									))}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}

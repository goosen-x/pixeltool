import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ToolsExplorer } from '@/components/tools/ToolsExplorer'
import { CategoryContent } from '@/components/tools/CategoryContent'
import { CatalogStructuredData } from '@/components/seo/CatalogStructuredData'
import { FeedbackModal } from '@/components/feedback'

export default function ToolsPage() {
	return (
		<div className='container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8'>
			<CatalogStructuredData category='' />

			<ToolsExplorer category='' />

			<CategoryContent category='' />

			{/* Карточка-секция в том же ключе, что и шапка */}
			<section className='relative mb-12 overflow-hidden rounded-3xl border bg-muted px-6 py-12 dark:bg-card sm:px-10 sm:py-14'>
				<Image
					src='/images/patterns/contour-1.png'
					alt=''
					aria-hidden
					width={760}
					height={760}
					className='pointer-events-none absolute -right-[36rem] -top-16 w-[72rem] max-w-none select-none opacity-[0.08] dark:opacity-[0.1] dark:invert'
				/>

				{/* Картинка слева, текст справа. Без левитации: рядом с кнопкой она
				    отвлекала бы от неё */}
				<div className='relative grid items-center gap-8 lg:grid-cols-[auto_1fr] lg:gap-16'>
					<div className='hidden lg:block'>
						<div className='relative h-40 w-56 xl:h-44 xl:w-64'>
							<Image
								src='/images/categories/suggest.png'
								alt=''
								aria-hidden
								fill
								sizes='256px'
								className='object-contain drop-shadow-2xl'
							/>
						</div>
					</div>

					<div className='max-w-xl space-y-4'>
						<h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
							Не нашли нужный инструмент?
						</h2>
						<p className='text-base leading-relaxed text-muted-foreground sm:text-lg'>
							Инструменты добавляются постоянно. Расскажите, чего вам не
							хватает, — это лучший способ повлиять на то, что появится
							следующим.
						</p>

						{/* Тот же попап, что открывается из карточки обратной связи в
						    сайдбаре, — заводить под это отдельную страницу незачем */}
						<div className='pt-2'>
							<FeedbackModal
								defaultType='feature'
								trigger={
									<Button size='lg' className='cursor-pointer'>
										Предложить инструмент
									</Button>
								}
							/>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}

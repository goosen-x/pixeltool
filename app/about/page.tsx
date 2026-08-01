import { Metadata } from 'next'
import Link from 'next/link'
import markdownStyles from '@/components/blog/markdown-styles.module.css'

export const metadata: Metadata = {
	title: 'О нас — PixelTool',
	description:
		'PixelTool — бесплатные онлайн-инструменты для работы с CSS, HTML, JSON, текстом и изображениями. Всё нужное под рукой, прямо в браузере.',
	alternates: { canonical: '/about' },
	openGraph: {
		title: 'О нас — PixelTool',
		description:
			'PixelTool — бесплатные онлайн-инструменты для работы с CSS, HTML, JSON, текстом и изображениями.',
		url: 'https://pixeltool.pro/about',
		siteName: 'PixelTool',
		type: 'website'
	}
}

export default function AboutPage() {
	return (
		<main className='min-h-screen bg-background'>
			<div className='max-w-3xl mx-auto px-5 py-12'>
				<div className='text-center mb-12'>
					<h1 className='text-4xl md:text-6xl font-bold text-foreground mb-4'>
						О нас
					</h1>
					<p className='text-xl text-muted-foreground'>Всё нужное под рукой</p>
				</div>

				<div className={markdownStyles['markdown']}>
					<p>
						PixelTool — коллекция бесплатных онлайн-инструментов для
						повседневных задач: генераторы CSS и QR-кодов, конвертеры цветов и
						единиц, проверка HTML и JSON, работа с текстом и изображениями. Все
						инструменты работают прямо в браузере — без установки программ и
						регистрации.
					</p>

					<h2>Кому это нужно</h2>
					<p>
						Изначально PixelTool задумывался как набор инструментов для
						разработчиков, но большинство задач на сайте — общечеловеческие:
						узнать разрешение экрана, посчитать символы в тексте, сгенерировать
						пароль или QR-код. Поэтому сайт не ограничивается нишей
						веб-разработки — им пользуются и дизайнеры, и студенты, и все, кому
						просто нужен быстрый инструмент под рукой.
					</p>

					<h2>Как это устроено</h2>
					<p>
						Большинство инструментов считают всё локально, в вашем браузере —
						данные не уходят на сервер. Сайт использует Яндекс.Метрику для общей
						статистики посещаемости; подробнее — в{' '}
						<Link href='/privacy' className='cursor-pointer'>
							политике конфиденциальности
						</Link>
						.
					</p>

					<h2>Обратная связь</h2>
					<p>
						Нашли ошибку или есть идея нового инструмента? Напишите через{' '}
						<Link href='/contact' className='cursor-pointer'>
							форму обратной связи
						</Link>{' '}
						— мы читаем все сообщения.
					</p>
				</div>
			</div>
		</main>
	)
}

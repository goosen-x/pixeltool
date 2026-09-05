import Link from 'next/link'

export function TextToSpeechSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Голос вашей системы, а не нейросеть
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Инструмент озвучивает текст через{' '}
					<code className='rounded bg-muted px-1.5 py-0.5 text-sm'>
						Speech Synthesis API
					</code>{' '}
					, встроенный синтезатор речи браузера и операционной системы. Текст
					никуда не отправляется и озвучивается прямо на устройстве, поэтому
					запускается мгновенно и без ограничений по числу прослушиваний. Есть и
					обратная сторона. Голоса и их качество — ровно то, что установлено в
					системе, а не студийная запись диктора. Список доступных голосов в
					выпадающем меню меняется от устройства к устройству, на телефоне и на
					компьютере он может быть разным.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Что можно подкрутить и в каких пределах:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Настройка</th>
								<th className='py-2 pr-4 font-medium'>Диапазон</th>
								<th className='py-2 pr-4 font-medium'>Шаг</th>
								<th className='py-2 font-medium'>Что меняет</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Скорость</td>
								<td className='py-2 pr-4 font-mono'>0,25–3</td>
								<td className='py-2 pr-4 font-mono'>0,25</td>
								<td className='py-2'>темп речи, 1 это обычный</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>Тон</td>
								<td className='py-2 pr-4 font-mono'>0,1–2</td>
								<td className='py-2 pr-4 font-mono'>0,1</td>
								<td className='py-2'>высота голоса, ниже или выше</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-4 text-muted-foreground'>
					Набор голосов приходит из операционной системы и в разных браузерах
					отличается, поэтому список в инструменте у каждого свой.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Зачем слушать текст, который можно прочитать
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Самое практичное применение — вычитка собственного текста. Опечатки,
					пропущенные слова и корявые фразы на слух заметны там, где глаз уже
					«замылился» и достраивает текст по памяти, а не по факту написанного.
					Второе применение связано с доступностью, чтение вслух облегчает
					восприятие текста при нарушениях зрения и дислексии. Третье —
					послушать длинную статью или документ, пока занимаешься чем-то ещё.
					Перед озвучкой длинного текста удобно заранее прикинуть его объём в{' '}
					<Link
						href='/tools/text-counter'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						счётчике символов
					</Link>
					.
				</p>
			</section>
		</div>
	)
}

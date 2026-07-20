'use client'

import Link from 'next/link'
import { GuideCodeBlock } from '@/components/widgets/GuideCodeBlock'

function Code({ children }: { children: string }) {
	return (
		<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
			{children}
		</code>
	)
}

export function ClampGuide() {
	return (
		<section className='mt-12 max-w-3xl mx-auto text-left text-foreground'>
			<h2 className='text-2xl font-bold tracking-tight'>
				Как работает <Code>clamp()</Code>
			</h2>
			<p className='mt-3 leading-relaxed'>
				<Code>clamp()</Code> принимает три значения — минимум, предпочтительное
				и максимум — и держит результат в этих границах. Предпочтительное обычно
				завязано на ширину экрана через <Code>vw</Code>, поэтому размер плавно
				меняется вместе с окном, но никогда не проваливается ниже минимума и не
				улетает выше максимума.
			</p>
			<GuideCodeBlock
				className='mt-4'
				code={`/* clamp(минимум, предпочтительное, максимум) */
h1 {
  font-size: clamp(2rem, 1.5rem + 2vw, 4rem);
}`}
			/>
			<p className='mt-3 leading-relaxed'>
				Этот заголовок не станет меньше 32px и больше 64px, а между этими
				границами будет плавно расти вместе с шириной окна — без единого
				медиазапроса.
			</p>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Формула, если считать вручную
			</h2>
			<p className='mt-3 leading-relaxed'>
				Калькулятор выше делает это автоматически, но для понимания полезно
				знать саму формулу. Коэффициент масштабирования — это разница размеров,
				делённая на разницу ширин экрана; базовое значение — минимум минус
				коэффициент масштабирования, умноженный на минимальную ширину.
			</p>
			<GuideCodeBlock
				className='mt-4'
				code={`Дано: 16px при 320px viewport → 24px при 1200px viewport

коэффициент масштабирования = (24 − 16) / (1200 − 320) = 0.00909  →  0.909vw
базовое значение = 16 − 0.00909 × 320 = 13.09px  →  0.818rem

font-size: clamp(1rem, 0.818rem + 0.909vw, 1.5rem);`}
			/>
			<p className='mt-3 leading-relaxed'>
				Частая опечатка — подставить одинаковые числа в оба слагаемых формулы.
				Тогда кривая уезжает: на 320px вместо ровно 16px получится 17.5px.
				Проверяйте расчёт на обеих границах viewport.
			</p>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Почему нельзя писать только <Code>vw</Code>
			</h2>
			<p className='mt-3 leading-relaxed'>
				Самая частая и самая незаметная ошибка — задать предпочтительное
				значение чистым <Code>vw</Code>, без слагаемого в <Code>rem</Code>.{' '}
				<Code>vw</Code> зависит только от ширины окна и не реагирует на
				масштабирование страницы (Ctrl/Cmd + или зум браузера) — человек
				увеличил шрифт в настройках, а текст на сайте не изменился. Это нарушает
				WCAG 1.4.4: страница обязана оставаться читаемой при увеличении до 200%.
			</p>
			<GuideCodeBlock
				className='mt-4'
				code={`/* Плохо: размер зависит только от ширины окна, не от зума */
font-size: clamp(1rem, 2.5vw, 2rem);

/* Хорошо: rem-слагаемое реагирует на настройки пользователя */
font-size: clamp(1rem, 0.75rem + 1.5vw, 2rem);`}
			/>
			<p className='mt-3 leading-relaxed'>
				Ориентир: вклад <Code>rem</Code>-слагаемого должен быть заметным — не
				меньше половины итогового значения на типичной ширине экрана. Сам
				калькулятор выше уже считает такое слагаемое автоматически.
			</p>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Поддержка браузерами
			</h2>
			<p className='mt-3 leading-relaxed'>
				<Code>clamp()</Code> — часть Baseline с 2020 года и работает во всех
				современных браузерах без исключений. Запасные значения и полифилы не
				нужны.
			</p>

			<p className='mt-8 leading-relaxed'>
				Разбор формул, типичных ошибок и продвинутых техник (адаптивная сетка,{' '}
				<Code>cqi</Code> для компонентов, разница с <Code>line-clamp</Code>) — в{' '}
				<Link
					href='/blog/css-clamp-complete-guide'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					полном руководстве по CSS clamp()
				</Link>
				.
			</p>
		</section>
	)
}

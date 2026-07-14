'use client'

import Link from 'next/link'

interface AnimationExample {
	title: string
	desc: string
	demoClass: string
	code: string
}

// Демо-классы объявлены в <style> ниже: живой предпросмотр рядом с кодом.
const EXAMPLES: AnimationExample[] = [
	{
		title: 'Появление элемента',
		desc: 'Самая частая анимация: блок всплывает снизу и проявляется. fill-mode: both удерживает конечное состояние, иначе элемент мигнёт обратно.',
		demoClass: 'guide-demo-fade',
		code: `@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: none; }
}

.card {
  animation: fadeInUp 0.5s ease both;
}`
	},
	{
		title: 'Пульсация',
		desc: 'Мягко привлекает внимание к кнопке или индикатору. Работает бесконечно, поэтому не ставьте её на важный текст.',
		demoClass: 'guide-demo-pulse',
		code: `@keyframes pulse {
  0%, 100% { transform: scale(1);    opacity: 1;   }
  50%      { transform: scale(1.08); opacity: 0.8; }
}

.badge {
  animation: pulse 1.5s ease-in-out infinite;
}`
	},
	{
		title: 'Загрузка — спиннер',
		desc: 'Бесконечное вращение с линейной функцией времени: любая другая даст рывок на стыке оборотов.',
		demoClass: 'guide-demo-spin',
		code: `@keyframes spin {
  to { transform: rotate(360deg); }
}

.loader {
  animation: spin 0.8s linear infinite;
}`
	},
	{
		title: 'Мерцание — скелетон',
		desc: 'Заглушка на месте ещё не загруженного контента. Двигаем градиент, а не размеры, — вёрстка не пересчитывается.',
		demoClass: 'guide-demo-shimmer',
		code: `@keyframes shimmer {
  from { background-position: -200% 0; }
  to   { background-position:  200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s linear infinite;
}`
	},
	{
		title: 'Встряска при ошибке',
		desc: 'Короткое движение по горизонтали — понятный сигнал о неверном пароле или незаполненном поле.',
		demoClass: 'guide-demo-shake',
		code: `@keyframes shake {
  0%, 100%      { transform: translateX(0);    }
  20%, 60%      { transform: translateX(-6px); }
  40%, 80%      { transform: translateX(6px);  }
}

.input.error {
  animation: shake 0.4s ease;
}`
	}
]

const PROPS: { name: string; desc: string }[] = [
	{
		name: 'animation-name',
		desc: 'Имя правила @keyframes, которое нужно проиграть.'
	},
	{
		name: 'animation-duration',
		desc: 'Длительность одного цикла. Для интерфейса обычно 0.2–0.6s: дольше — и движение начинает раздражать.'
	},
	{
		name: 'animation-timing-function',
		desc: 'Кривая скорости: ease, linear, ease-in-out или своя cubic-bezier().'
	},
	{
		name: 'animation-delay',
		desc: 'Задержка перед стартом. Разные задержки у соседних элементов дают эффект каскада.'
	},
	{
		name: 'animation-iteration-count',
		desc: 'Число повторов. Значение infinite крутит анимацию бесконечно.'
	},
	{
		name: 'animation-direction',
		desc: 'Направление. Значение alternate проигрывает каждый второй цикл задом наперёд — движение идёт туда-обратно без рывка.'
	},
	{
		name: 'animation-fill-mode',
		desc: 'Что показывать до и после анимации. Значение both оставляет элемент в конечном кадре.'
	}
]

const DEMO_CSS = `
@keyframes guideFadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: none; }
}
@keyframes guidePulse {
  0%, 100% { transform: scale(1);    opacity: 1;   }
  50%      { transform: scale(1.08); opacity: 0.8; }
}
@keyframes guideSpin {
  to { transform: rotate(360deg); }
}
@keyframes guideShimmer {
  from { background-position: -200% 0; }
  to   { background-position:  200% 0; }
}
@keyframes guideShake {
  0%, 100% { transform: translateX(0);    }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px);  }
}

.guide-demo-fade    { animation: guideFadeInUp 2s ease infinite; }
.guide-demo-pulse   { animation: guidePulse 1.5s ease-in-out infinite; }
.guide-demo-spin    {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  border: 3px solid currentColor;
  border-top-color: transparent;
  opacity: 0.6;
  animation: guideSpin 0.8s linear infinite;
}
.guide-demo-shimmer {
  width: 100%;
  height: 2.5rem;
  border-radius: 0.5rem;
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
  background-size: 200% 100%;
  animation: guideShimmer 1.4s linear infinite;
}
.guide-demo-shake   { animation: guideShake 0.4s ease infinite; }

.guide-hover-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.guide-hover-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

@media (prefers-reduced-motion: reduce) {
  .guide-demo-fade,
  .guide-demo-pulse,
  .guide-demo-spin,
  .guide-demo-shimmer,
  .guide-demo-shake,
  .guide-hover-card {
    animation: none !important;
    transition: none !important;
  }
}
`

function Code({ children }: { children: string }) {
	return (
		<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
			{children}
		</code>
	)
}

function Demo({ example }: { example: AnimationExample }) {
	// У шиммера и спиннера вся геометрия задана в самом демо-классе
	const bare =
		example.demoClass === 'guide-demo-shimmer' ||
		example.demoClass === 'guide-demo-spin'

	return (
		<div className='mt-4 flex h-24 items-center justify-center rounded-lg bg-secondary px-8'>
			{bare ? (
				<div className={example.demoClass} />
			) : (
				<div
					className={`${example.demoClass} h-10 w-28 rounded-lg bg-primary`}
					aria-hidden
				/>
			)}
		</div>
	)
}

export function AnimationGuide() {
	return (
		<section className='mt-12 max-w-3xl mx-auto text-left text-foreground'>
			<style>{DEMO_CSS}</style>

			<h2 className='text-2xl font-bold tracking-tight'>
				Как сделать анимацию в CSS
			</h2>
			<p className='mt-3 leading-relaxed'>
				Анимация собирается из двух частей. Сначала вы описываете кадры в
				правиле <Code>@keyframes</Code>: что происходит в начале и в конце.
				Потом подключаете их к элементу свойством <Code>animation</Code> — имя и
				длительность обязательны, остальное по необходимости.
			</p>
			<pre className='mt-4 overflow-x-auto rounded-lg bg-secondary p-4 text-sm'>
				<code className='font-mono text-secondary-foreground'>{`/* 1. описываем кадры */
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* 2. подключаем к элементу */
.card {
  animation: fadeIn 0.5s ease both;
}`}</code>
			</pre>
			<p className='mt-3 leading-relaxed'>
				Кадров может быть сколько угодно — вместо <Code>from</Code> и{' '}
				<Code>to</Code> пишите проценты: <Code>0%</Code>, <Code>50%</Code>,{' '}
				<Code>100%</Code>. Конструктор выше собирает такой код визуально: вы
				двигаете ползунки, а он отдаёт готовое правило.
			</p>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Готовые CSS-анимации
			</h2>
			<p className='mt-3 leading-relaxed'>
				Пять анимаций, которые закрывают почти все задачи интерфейса. Демо слева
				крутятся бесконечно, чтобы их было видно, — в коде повтор стоит только
				там, где он нужен по смыслу.
			</p>
			<div className='mt-4 space-y-5'>
				{EXAMPLES.map(ex => (
					<div
						key={ex.title}
						className='rounded-xl border bg-card p-5 text-left'
					>
						<h3 className='font-semibold'>{ex.title}</h3>
						<p className='mt-1 text-sm text-foreground'>{ex.desc}</p>
						<Demo example={ex} />
						<pre className='mt-3 overflow-x-auto rounded-lg bg-secondary p-4 text-sm'>
							<code className='font-mono text-secondary-foreground'>
								{ex.code}
							</code>
						</pre>
					</div>
				))}
			</div>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Анимация кнопки при наведении
			</h2>
			<p className='mt-3 leading-relaxed'>
				Для наведения <Code>@keyframes</Code> обычно не нужен — хватает{' '}
				<Code>transition</Code>. Она оживляет переход между обычным состоянием и{' '}
				<Code>:hover</Code>, и это дешевле. Наведите курсор на карточку ниже.
			</p>
			<div className='mt-4 flex h-32 items-center justify-center rounded-lg bg-secondary'>
				<div className='guide-hover-card flex h-20 w-40 cursor-pointer items-center justify-center rounded-lg border bg-card text-sm font-medium'>
					Наведите на меня
				</div>
			</div>
			<pre className='mt-3 overflow-x-auto rounded-lg bg-secondary p-4 text-sm'>
				<code className='font-mono text-secondary-foreground'>{`.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}`}</code>
			</pre>
			<p className='mt-3 leading-relaxed'>
				Тень для такой карточки удобно подобрать в{' '}
				<Link
					href='/tools/css-box-shadow-generator'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					генераторе теней
				</Link>
				.
			</p>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				animation или transition
			</h2>
			<p className='mt-3 leading-relaxed'>
				Разница в том, кто запускает движение.{' '}
				<strong>Transition реагирует на событие</strong> — наведение, клик,
				добавление класса — и умеет переходить только между двумя состояниями.{' '}
				<strong>Animation живёт сама</strong>: стартует без событий, проходит
				через любое число кадров и может повторяться бесконечно. Наведение и
				клик — <Code>transition</Code>; лоадер, пульсация, появление при
				загрузке страницы — <Code>animation</Code>.
			</p>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Свойства анимации
			</h2>
			<div className='mt-4 overflow-x-auto'>
				<table className='w-full border-collapse text-sm'>
					<thead>
						<tr className='border-b text-left'>
							<th className='py-2 pr-4 font-semibold'>Свойство</th>
							<th className='py-2 font-semibold'>Что делает</th>
						</tr>
					</thead>
					<tbody>
						{PROPS.map(p => (
							<tr key={p.name} className='border-b align-top last:border-0'>
								<td className='py-2 pr-4'>
									<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-xs'>
										{p.name}
									</code>
								</td>
								<td className='py-2'>{p.desc}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<p className='mt-3 leading-relaxed'>
				Всё это записывается одной строкой:{' '}
				<Code>
					animation: pulse 1.5s ease-in-out 0s infinite alternate both
				</Code>
				. Свою кривую скорости можно собрать в{' '}
				<Link
					href='/tools/css-bezier-curve-generator'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					генераторе cubic-bezier
				</Link>
				.
			</p>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Почему анимация дёргается
			</h2>
			<p className='mt-3 leading-relaxed'>
				Почти всегда причина одна: анимируются свойства, которые меняют вёрстку.{' '}
				<Code>width</Code>, <Code>height</Code>, <Code>margin</Code>,{' '}
				<Code>top</Code> и <Code>left</Code> заставляют браузер пересчитывать
				раскладку страницы на каждом кадре. А <Code>transform</Code> и{' '}
				<Code>opacity</Code> считаются на видеокарте и вёрстку не трогают.
				Поэтому сдвиг делайте через <Code>transform: translate()</Code>, а
				увеличение — через <Code>transform: scale()</Code>, а не изменением
				размеров.
			</p>
			<p className='mt-3 leading-relaxed'>
				И не забудьте про тех, кому движение мешает физически: часть людей
				отключает анимации в настройках системы. Уважьте эту настройку —
				достаточно одного медиазапроса.
			</p>
			<pre className='mt-4 overflow-x-auto rounded-lg bg-secondary p-4 text-sm'>
				<code className='font-mono text-secondary-foreground'>{`@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}`}</code>
			</pre>
			<p className='mt-3 leading-relaxed'>
				Больше приёмов и разбор сложных случаев — в{' '}
				<Link
					href='/blog/css-animations'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					подробном гайде по CSS-анимациям
				</Link>
				.
			</p>
		</section>
	)
}

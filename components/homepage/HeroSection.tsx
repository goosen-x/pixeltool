import type { CSSProperties } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { widgets, widgetCategories } from '@/lib/constants/widgets'
import { cn } from '@/lib/utils'
import { FlipFadeText } from '@/components/ui/flip-fade-text'
import { DitherHeroBackground } from '@/components/homepage/DitherHeroBackground'
import { RandomToolButton } from '@/components/homepage/RandomToolButton'

// Вогнутый («инвертированный») угол: квадрат 48×48, залитый цветом фона страницы,
// с четвертью-кругом-вырезом — создаёт плавную дугу, огибающую белый блок внутрь
// тёмного фрейма. Цвет берём из темы (hsl(var(--background))) — работает и в тёмной.
function Notch({
	focal,
	className,
	transform
}: {
	focal: string
	className: string
	transform: string
}) {
	return (
		<span
			aria-hidden
			className={cn('pointer-events-none absolute z-0 h-12 w-12', className)}
			style={{
				// Переход не в нуль пикселей, а через полупиксельную полосу: жёсткий
				// стоп даёт ступеньки и светлый шов по дуге (как в .tool-link-cutout).
				background: `radial-gradient(circle at ${focal}, transparent 47.5px, hsl(var(--background)) 48px)`,
				transform
			}}
		/>
	)
}

// Feathering по всем четырём сторонам: горизонтальный и вертикальный градиенты
// пересекаются (intersect), поэтому каждая сторона гаснет независимо. Без
// intersect маски складываются (add) — края остаются прямыми, гаснут только углы.
const featherMask: CSSProperties = {
	maskImage:
		'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
	WebkitMaskImage:
		'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
	maskComposite: 'intersect'
}

// Список категорий берём из widgetCategories — единственного источника правды,
// чтобы новая категория появлялась здесь сама. Маршрут — app/tools/[category].
// Порядок захардкожен по ВИЗУАЛЬНОЙ ширине названия — список выключен вправо,
// и так левый край складывается в ровную лесенку. Считать по числу символов
// нельзя: кириллица шире латиницы, из-за чего «Генераторы» занимает больше
// места, чем «JavaScript», хотя в обоих ровно по 10 букв. Подписи по-прежнему
// берутся из widgetCategories — здесь только порядок.
const NAV_ORDER = [
	'css',
	'html',
	'text',
	'utilities',
	'javascript',
	'generators',
	'security'
] as const satisfies readonly (keyof typeof widgetCategories)[]

const navLinks = NAV_ORDER.map((key, i) => ({
	label: widgetCategories[key],
	href: `/tools/${key}`,
	n: String(i + 1).padStart(2, '0')
}))

export function HeroSection() {
	return (
		<section className='p-4 sm:p-6 lg:px-8'>
			{/* Скругление через clip-path, а не overflow-hidden + rounded-*: в Chrome
			    предок со СКРУГЛЁННОЙ обрезкой и асимметричным радиусом (здесь
			    bl+tr) отключает маскирование backdrop-filter у потомков — feathering
			    у блюра под заголовком переставал работать. clip-path даёт ту же
			    форму без этого побочного эффекта. */}
			<div
				className='relative flex min-h-[580px] flex-col overflow-hidden bg-[#060912] md:min-h-[calc(100dvh-8rem)]'
				style={{ clipPath: 'inset(0 round 0 1.5rem 0 1.5rem)' }}
			>
				{/* Дизеринг-фон — живой шейдер Dithering (Paper Shaders, оптимизирован) */}
				<DitherHeroBackground />

				{/* Верхний левый бренд-блок с вогнутыми углами — оверлей, не влияет на
				    вертикальное центрирование основного контента */}
				{/* min-h-20 (80px) не косметика: выемка — 48px, собственный радиус угла —
				    24px, и при высоте меньше 72px дуга выемки налезает на скругление
				    бейджа, оставляя на стыке тонкую белую иглу. */}
				<div className='absolute left-0 top-0 z-20 flex min-h-20 items-center rounded-br-3xl bg-background py-4 pl-6 pr-6 sm:pl-8'>
					<Notch
						focal='bottom right'
						className='bottom-0 left-0'
						transform='translateY(100%)'
					/>
					<Notch
						focal='bottom right'
						className='right-0 top-0'
						transform='translateX(100%)'
					/>
					<div className='relative z-10 leading-tight'>
						<span className='text-sm font-medium text-muted-foreground'>
							{widgets.length} онлайн-инструментов
						</span>
					</div>
				</div>

				{/* Основной контент — по центру всей высоты героя */}
				<div className='relative z-10 flex flex-1 flex-col justify-center px-6 py-8 sm:px-8 lg:px-10'>
					{/* top-20 (5rem), а не translate: transform на предке слоя с
					    backdrop-filter сделал бы его backdrop root и блюр перестал бы
					    видеть фон под собой */}
					<div className='relative top-20 w-fit max-w-3xl'>
						{/* Читаемость: backdrop-blur под текстом (z-0), растворяется к краям.
						    Радиальный градиент по всему эллипсу даёт резкие края в углах,
						    здесь же — две linear-gradient маски с mask-composite: intersect:
						    мягкое feathering независимо по каждой стороне. */}
						<div
							aria-hidden
							className='pointer-events-none absolute -inset-24 z-0'
							style={{
								backdropFilter: 'blur(10px)',
								WebkitBackdropFilter: 'blur(10px)',
								...featherMask
							}}
						/>
						{/* Тёмная плёнка — тот же feathering */}
						<div
							aria-hidden
							className='pointer-events-none absolute -inset-24 z-0'
							style={{
								background: 'rgba(0, 0, 0, 0.28)',
								...featherMask
							}}
						/>

						{/* Текст — поверх блюра (z-10) */}
						<div className='relative z-10'>
							{/* SEO-заголовок скрыт для глаз, визуальный — с flip-fade словом */}
							<h1 className='sr-only'>
								Онлайн-инструменты для любых задач: случайные числа, пароли,
								QR-коды и эмодзи — всегда под рукой, без регистрации
							</h1>
							<div
								aria-hidden
								className='font-heading text-[clamp(1.5rem,8vw,4.5rem)] font-bold leading-[1.05] tracking-tight text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.5)]'
							>
								{/* Слова и их порядок — из docs/seo/wordstat.md, секция «Главная».
								    Сортировка по пригодному спросу: случайные числа 507k,
								    пароли 103k, QR 41k, эмодзи (541k валовых, но хвост —
								    игры и стикеры, нам достаётся «эмодзи скопировать» ~16k).
								    Были «Калькуляторы» и «Конвертеры» — рекламировали то,
								    чего в продукте нет.
								    Пасхалка: смайлики после «Эмодзи» и отдельным словом в
								    цикле — кайомодзи «переворот стола», для тех, кто
								    досматривает цикл до конца. */}
								<FlipFadeText
									words={[
										'Случайные числа',
										'Пароли',
										'QR-коды',
										'Эмодзи 🔥😉',
										'Каомодзи (◕‿◕)'
									]}
									// Сборка слова занимает ~1,8 с (12 букв × stagger 0,1 с +
									// 0,6 с анимации), поэтому интервал должен быть заметно
									// больше — иначе слово улетает, не успев прочитаться
									interval={5000}
									className='min-h-0 justify-start'
									// gap-0 гасит gap-[0.1em] внутри FlipFadeText: буквы там —
									// отдельные flex-элементы, и этот зазор давал разрядку,
									// до которой tracking не дотягивается
									textClassName='font-heading gap-0 text-[clamp(1.5rem,8vw,4.5rem)] md:text-[clamp(1.5rem,8vw,4.5rem)] font-bold normal-case tracking-tight text-primary dark:text-primary'
								/>
								<div className='whitespace-nowrap'>всегда под рукой</div>
							</div>

							<p className='mt-5 max-w-xl text-lg leading-relaxed text-white/85 [text-shadow:0_1px_16px_rgba(0,0,0,0.6)] sm:text-xl'>
								Случайные числа, пароли, QR-коды, эмодзи, работа с текстом и
								инструменты для разработки — всегда под рукой.
							</p>

							{/* Две кнопки — два разных намерения, а не одно продублированное:
							    «не знаю, что мне надо» → каталог, «знаю, но не что конкретно» →
							    случайный тул (RandomToolButton — путь неизвестен на рендере,
							    выбирается в момент клика, поэтому кнопка, а не ссылка).
							    corner-shape задаём классом: глобальное правило в globals.css
							    ловит <button>, а это <a> у первой кнопки — до него оно не
							    достаёт. */}
							<div className='mt-8 flex flex-col gap-3 sm:flex-row'>
								<Link
									href='/tools'
									className='group inline-flex cursor-pointer items-center justify-center gap-2 rounded-full [corner-shape:squircle] bg-primary px-7 py-3 font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-primary/40'
								>
									Все инструменты
									<ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
								</Link>
								<RandomToolButton className='inline-flex cursor-pointer items-center justify-center gap-2 rounded-full [corner-shape:squircle] border-2 border-primary/70 bg-[#081020]/40 px-7 py-3 font-medium text-white backdrop-blur-sm transition-colors hover:border-primary hover:bg-primary/20' />
							</div>
						</div>
					</div>
				</div>

				{/* Нижний правый блок с вогнутыми углами — мини-навигация, оверлей */}
				<div className='absolute bottom-0 right-0 z-20 hidden rounded-tl-3xl bg-background p-6 md:block lg:p-8'>
					<Notch
						focal='top left'
						className='right-0 top-0'
						transform='translateY(-100%)'
					/>
					<Notch
						focal='top left'
						className='bottom-0 left-0'
						transform='translateX(-100%)'
					/>
					<ul className='relative z-10 flex flex-col items-end gap-2.5'>
						{navLinks.map(item => (
							<li key={item.href} className='flex w-full justify-end'>
								<Link
									href={item.href}
									className='group inline-flex cursor-pointer items-baseline gap-x-3 text-foreground'
								>
									<span className='font-mono text-[10px] leading-none tracking-[0.22em] text-neutral-400'>
										{item.n}
									</span>
									<span className='select-none text-[0.65em] leading-none text-neutral-300'>
										—
									</span>
									<span className='text-right font-medium tracking-tight text-muted-foreground transition-colors group-hover:text-primary'>
										{item.label}
									</span>
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	)
}

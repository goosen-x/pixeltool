import { cn } from '@/lib/utils'

/**
 * Переключатель-«таблетка» в шапке и подвале инструмента.
 *
 * Единый вид на все режимы, наборы и фильтры: активное состояние подсвечено
 * рамкой и заливкой в 10% основного цвета, а не сплошной заливкой. Сплошная
 * заливка на четырёх включённых тумблерах рядом кричит громче, чем результат
 * работы инструмента, ради которого человек пришёл.
 *
 * Класс `bg-accent` здесь не используется намеренно: в этой теме accent —
 * насыщенный синий (--accent 217 91% 60%), и на маленьком чипе он забивает
 * собой текст.
 */
export const toolPill = (active: boolean, extra?: string) =>
	cn(
		'cursor-pointer rounded-full border px-3 py-1 text-sm transition-colors',
		'hover:border-primary/50 hover:bg-background',
		'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
		active
			? 'border-primary bg-primary/10 text-primary'
			: 'border-transparent text-muted-foreground',
		extra
	)

/**
 * Двухпозиционный переключатель для полос инструмента.
 *
 * Когда вариантов ровно два (px/rem, CSS/Tailwind, светлая/тёмная), это не
 * набор фильтров, а один переключатель состояния — трек с двумя подписанными
 * сегментами читается как единое целое, а не как список кнопок. Наборы из
 * трёх и более вариантов остаются `toolPill`: там нет одной оси «туда-сюда».
 */
export const toolToggleTrack =
	'inline-flex items-center overflow-hidden rounded-lg border bg-muted/40 p-1'

export const toolToggleOption = (active: boolean, extra?: string) =>
	cn(
		'cursor-pointer rounded-full px-3 py-0.5 text-sm transition-colors',
		'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
		active
			? 'bg-background text-foreground shadow-sm'
			: 'text-muted-foreground hover:text-foreground',
		extra
	)

/** Верхняя полоса инструмента: режимы слева, действия справа. */
export const toolBar =
	'flex flex-wrap items-center gap-x-6 gap-y-3 border-b bg-muted/30 px-5 py-3 sm:px-6'

/** Нижняя полоса с параметрами — та же полоса, но под рабочей областью. */
export const toolFooterBar =
	'flex flex-wrap items-center gap-x-6 gap-y-3 border-t bg-muted/30 px-5 py-3 sm:px-6'

/**
 * Иконка-действие в полосе: тихая, проявляется цветом на наведении.
 *
 * `hover:bg-muted` перекрывает `hover:bg-accent` из ghost-варианта кнопки
 * намеренно: accent в этой теме — насыщенный синий (--accent 217 91% 60%), и
 * на кнопке 32×32 он превращается в синий квадрат, который кричит громче
 * содержимого страницы. Тот же дефект был у звёздочки избранного в сайдбаре.
 */
export const toolIconButton =
	'h-8 w-8 cursor-pointer text-muted-foreground hover:bg-muted hover:text-foreground'

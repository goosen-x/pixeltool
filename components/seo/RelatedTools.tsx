import { publicWidgets, getRecommendedWidgets } from '@/lib/constants/widgets'
import { RelatedToolsCarousel } from '@/components/seo/RelatedToolsCarousel'

interface RelatedToolsProps {
	currentTool: string
	category?: string
}

/**
 * Сначала берём инструменты, явно прописанные в recommendedTools, потом
 * добираем соседями по категории. Набираем с запасом: в кадре карусели три
 * карточки, и если слайдов ровно три, embla отключает зацикливание — крутить
 * становится нечего.
 */
const MAX_RELATED = 9

export function RelatedTools({
	currentTool,
	category = 'css'
}: RelatedToolsProps) {
	const recommended = getRecommendedWidgets(currentTool).slice(0, MAX_RELATED)

	const sameCategory = publicWidgets.filter(
		widget =>
			widget.id !== currentTool &&
			!recommended.some(item => item.id === widget.id) &&
			widget.category === category
	)

	let relatedTools = [...recommended, ...sameCategory].slice(0, MAX_RELATED)

	// У части категорий (security, javascript, health) всего 3 тула на весь
	// каталог: без текущего и явных рекомендаций может остаться 1–2 карточки.
	// Карусели нужен минимум три слайда, поэтому добираем чем угодно public.
	const MIN_RELATED = 3
	if (relatedTools.length < MIN_RELATED) {
		const filler = publicWidgets.filter(
			widget =>
				widget.id !== currentTool &&
				!relatedTools.some(item => item.id === widget.id)
		)
		relatedTools = [...relatedTools, ...filler].slice(0, MIN_RELATED)
	}

	if (relatedTools.length === 0) {
		return null
	}

	return (
		// Ширину не ограничиваем: блок стоит рядом с «Часто задаваемые вопросы»
		// в общем контейнере, и любой max-w здесь сдвинет заголовок относительно
		// заголовка FAQ. Карточки от разъезжания удерживает basis в карусели.
		<section className='mt-16'>
			{/* Тот же размер, что у h2 в обучающих блоках */}
			<h2 className='text-2xl font-bold tracking-tight'>Похожие инструменты</h2>
			<p className='mt-1 text-sm text-muted-foreground'>
				Другие полезные инструменты из той же категории
			</p>
			<RelatedToolsCarousel widgets={relatedTools} />
		</section>
	)
}

import { widgets, getRecommendedWidgets } from '@/lib/constants/widgets'
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

	const sameCategory = widgets.filter(
		widget =>
			widget.id !== currentTool &&
			!recommended.some(item => item.id === widget.id) &&
			widget.category === category
	)

	const relatedTools = [...recommended, ...sameCategory].slice(0, MAX_RELATED)

	if (relatedTools.length === 0) {
		return null
	}

	return (
		// Та же ширина, что у обучающих блоков (*Guide.tsx), — иначе карусель
		// растягивается на всю страницу и карточки выглядят непомерно широкими.
		<section className='mt-16 max-w-3xl mx-auto'>
			{/* Тот же размер, что у h2 в обучающих блоках */}
			<h2 className='text-2xl font-bold tracking-tight'>Похожие инструменты</h2>
			<p className='mt-1 text-sm text-muted-foreground'>
				Другие полезные инструменты из той же категории
			</p>
			<RelatedToolsCarousel widgets={relatedTools} />
		</section>
	)
}

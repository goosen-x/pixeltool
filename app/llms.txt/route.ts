import { widgetCategories, getWidgetsByCategory } from '@/lib/constants/widgets'
import { CATEGORY_META } from '@/lib/constants/categories'
import { unitPairs } from '@/lib/constants/unit-pairs'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'

/**
 * Формат llmstxt.org — собирается из тех же данных, что каталог и футер,
 * чтобы не разъезжаться с реальным списком разделов при их изменении.
 *
 * Перечисляем не только категории, но и каждый тул: раньше в файле было 11
 * ссылок на разделы, и модель, которую спросили про конкретный инструмент,
 * не видела ни одной страницы, где он живёт. Полные тексты вынесены в
 * llms-full.txt, здесь только карта.
 */
function buildLlmsTxt(): string {
	const sections = Object.entries(widgetCategories).map(([key, title]) => {
		const meta = CATEGORY_META[key as keyof typeof CATEGORY_META]
		const widgets = getWidgetsByCategory(
			key as keyof typeof widgetCategories
		).filter(w => !w.demo)

		const toolLines = widgets.map(widget => {
			// description бывает длинным на пару предложений — в карте нужна
			// одна строка, поэтому режем по первому предложению.
			const summary = (widget.description || '').split(/(?<=[.!?])\s/)[0]
			return `- [${widget.title}](${BASE_URL}/tools/${widget.path}): ${summary}`
		})

		return `## ${title} (${widgets.length})\n\n${meta.description}\n\n${toolLines.join('\n')}`
	})

	// Страницы пар единиц — не отдельные тулы, а SEO-страницы одного хаба,
	// поэтому идут своим блоком, а не внутри категории «Утилиты».
	const pairLines = unitPairs.map(
		pair => `- [${pair.h1}](${BASE_URL}/tools/unit-converter/${pair.slug})`
	)

	return `# PixelTool

> Онлайн-инструменты для повседневных и рабочих задач: случайные числа, QR-коды, пароли, работа с текстом и кодом, конвертеры единиц. Всё считается прямо в браузере: файлы и введённые данные никуда не отправляются, регистрация не нужна.

Полные тексты описаний, инструкций и статей: ${BASE_URL}/llms-full.txt

Инструменты сгруппированы по разделам:

${sections.join('\n\n')}

## Конвертер единиц измерения

Хаб: [${BASE_URL}/tools/unit-converter](${BASE_URL}/tools/unit-converter). Отдельные страницы под конкретные пары единиц:

${pairLines.join('\n')}

## Другое

- [Все инструменты](${BASE_URL}/tools)
- [Блог](${BASE_URL}/blog): разборы и инструкции по расчётам, единицам измерения, тексту и форматам данных
- [RSS блога](${BASE_URL}/rss.xml)

## Optional

- [О проекте](${BASE_URL}/about)
- [Контакты](${BASE_URL}/contact)
- [Политика конфиденциальности](${BASE_URL}/privacy)
- [Условия использования](${BASE_URL}/terms)

Файл сгенерирован: ${new Date().toISOString().slice(0, 10)}
`
}

export async function GET() {
	return new Response(buildLlmsTxt(), {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	})
}

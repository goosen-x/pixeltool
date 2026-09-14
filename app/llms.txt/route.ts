import { widgetCategories, getWidgetsByCategory } from '@/lib/constants/widgets'
import { CATEGORY_META } from '@/lib/constants/categories'
import { getWidgetByPath } from '@/lib/constants/widgets'
import { TOOL_SUBPAGE_FAMILIES } from '@/lib/seo/tool-subpages'

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

	// SEO-подстраницы — не отдельные тулы, а страницы одного хаба, поэтому
	// идут своими блоками, а не внутри категорий. Раньше здесь были только
	// пары единиц, и модель, которую спросили «сколько дней до лета» или
	// «даты знака Лев», не видела ни одной из остальных 24 страниц.
	const subpageSections = TOOL_SUBPAGE_FAMILIES.map(family => {
		const hub = getWidgetByPath(family.parentPath)
		const hubTitle = hub?.title || family.parentPath
		const hubUrl = `${BASE_URL}/tools/${family.parentPath}`
		const lines = family.items.map(
			item => `- [${item.label}](${hubUrl}/${item.slug})`
		)

		return `## ${hubTitle}\n\nХаб: [${hubUrl}](${hubUrl}). Отдельные страницы:\n\n${lines.join('\n')}`
	})

	return `# PixelTool

> Онлайн-инструменты для повседневных и рабочих задач: случайные числа, QR-коды, пароли, работа с текстом и кодом, конвертеры единиц. Всё считается прямо в браузере: файлы и введённые данные никуда не отправляются, регистрация не нужна.

Полные тексты описаний, инструкций и статей: ${BASE_URL}/llms-full.txt

Инструменты сгруппированы по разделам:

${sections.join('\n\n')}

${subpageSections.join('\n\n')}

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

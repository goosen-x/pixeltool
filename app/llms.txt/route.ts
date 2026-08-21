import { widgetCategories, getWidgetsByCategory } from '@/lib/constants/widgets'
import { CATEGORY_META } from '@/lib/constants/categories'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'

/**
 * Формат llmstxt.org — собирается из тех же данных, что каталог и футер,
 * чтобы не разъезжаться с реальным списком разделов при их изменении.
 */
function buildLlmsTxt(): string {
	const categoryLines = Object.entries(widgetCategories).map(([key, title]) => {
		const meta = CATEGORY_META[key as keyof typeof CATEGORY_META]
		const count = getWidgetsByCategory(
			key as keyof typeof widgetCategories
		).filter(w => !w.demo).length
		return `- [${title}](${BASE_URL}/tools/${key}): ${meta.description} (${count})`
	})

	return `# PixelTool

> Онлайн-инструменты для повседневных и рабочих задач: случайные числа, QR-коды, пароли, работа с текстом и кодом, конвертеры. Всё считается прямо в браузере — файлы и введённые данные никуда не отправляются, регистрация не нужна.

## Разделы инструментов

${categoryLines.join('\n')}

## Другое

- [Все инструменты](${BASE_URL}/tools)
- [Блог](${BASE_URL}/blog)
- [Контакты](${BASE_URL}/contact)
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

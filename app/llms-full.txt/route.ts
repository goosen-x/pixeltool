import { widgetCategories, getWidgetsByCategory } from '@/lib/constants/widgets'
import { CATEGORY_META } from '@/lib/constants/categories'
import { unitPairs } from '@/lib/constants/unit-pairs'
import { getAllPostsFromFiles } from '@/lib/api-file'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'

/**
 * Полная выгрузка содержания сайта одним файлом: описания всех тулов, тексты
 * страниц конвертера единиц и статьи блога целиком. llms.txt рядом остаётся
 * картой, сюда модель идёт за самим содержанием.
 *
 * Файл большой (несколько сотен килобайт) и собирается на лету из тех же
 * источников, что и страницы, поэтому отдаём его с часовым кэшем и без
 * ISR-ревалидации: пересборка дешевле, чем риск отдать устаревший срез.
 */
function buildLlmsFullTxt(): string {
	const parts: string[] = []

	parts.push(`# PixelTool: полное содержание

> Онлайн-инструменты для повседневных и рабочих задач. Всё считается в браузере, без регистрации и отправки данных на сервер. Карта разделов: ${BASE_URL}/llms.txt

Файл собран автоматически из описаний инструментов, страниц конвертера единиц и статей блога.`)

	// 1. Инструменты по разделам
	parts.push('# Инструменты')

	for (const [key, title] of Object.entries(widgetCategories)) {
		const meta = CATEGORY_META[key as keyof typeof CATEGORY_META]
		const widgets = getWidgetsByCategory(
			key as keyof typeof widgetCategories
		).filter(w => !w.demo)

		if (widgets.length === 0) continue

		parts.push(`## ${title} (${widgets.length})\n\n${meta.description}`)

		for (const widget of widgets) {
			const lines = [
				`### ${widget.title}`,
				'',
				`URL: ${BASE_URL}/tools/${widget.path}`,
				''
			]

			if (widget.description) lines.push(widget.description, '')
			if (widget.useCase) lines.push(`Когда пригодится: ${widget.useCase}`, '')
			if (widget.metaDescription) lines.push(widget.metaDescription, '')

			parts.push(lines.join('\n').trimEnd())
		}
	}

	// 2. Конвертер единиц: у каждой пары свой текст и свои вопросы
	parts.push(
		`# Конвертер единиц измерения\n\nХаб: ${BASE_URL}/tools/unit-converter`
	)

	for (const pair of unitPairs) {
		const faqs = pair.faqs
			.map(faq => `**${faq.question}**\n\n${faq.answer}`)
			.join('\n\n')

		parts.push(
			[
				`## ${pair.h1}`,
				'',
				`URL: ${BASE_URL}/tools/unit-converter/${pair.slug}`,
				'',
				pair.intro,
				'',
				faqs
			].join('\n')
		)
	}

	// 3. Статьи блога целиком
	const posts = getAllPostsFromFiles().filter(post => !post.demo)
	parts.push(`# Статьи блога (${posts.length})`)

	for (const post of posts) {
		parts.push(
			[
				`## ${post.title}`,
				'',
				`URL: ${BASE_URL}/blog/${post.slug}`,
				`Дата: ${String(post.date).slice(0, 10)}`,
				'',
				post.excerpt,
				'',
				post.content.trim()
			].join('\n')
		)
	}

	parts.push(`Файл сгенерирован: ${new Date().toISOString().slice(0, 10)}`)

	return parts.join('\n\n') + '\n'
}

export async function GET() {
	return new Response(buildLlmsFullTxt(), {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	})
}

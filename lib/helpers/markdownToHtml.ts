import { remark } from 'remark'
import html from 'remark-html'
import gfm from 'remark-gfm'
import remarkLiveCode from '@/lib/remark-plugins/remark-live-code'
import remarkToolLink from '@/lib/remark-plugins/remark-tool-link'
import remarkBaseline from '@/lib/remark-plugins/remark-baseline'

export default async function markdownToHtml(
	markdown: string
): Promise<string> {
	const result = await remark()
		// Без remark-gfm таблицы в постах не работали вовсе: markdown-разметка
		// выводилась как обычный текст с палками. Плагин также включает
		// зачёркивание, списки задач и автоссылки
		.use(gfm)
		.use(remarkToolLink)
		.use(remarkBaseline)
		.use(remarkLiveCode)
		.use(html, { sanitize: false })
		.process(markdown)

	// Add language classes to code blocks
	let htmlString = result.toString()

	// Replace code blocks with language classes
	htmlString = htmlString.replace(
		/<pre><code class="language-(\w+)">/g,
		'<pre class="language-$1"><code class="language-$1">'
	)

	// Also handle code blocks without language specified
	htmlString = htmlString.replace(
		/<pre><code>/g,
		'<pre class="language-plaintext"><code class="language-plaintext">'
	)

	return htmlString
}

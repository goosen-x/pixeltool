import { remark } from 'remark'
import html from 'remark-html'
import gfm from 'remark-gfm'
import { codeToHtml } from 'shiki'
import remarkLiveCode from '@/lib/remark-plugins/remark-live-code'
import remarkToolLink from '@/lib/remark-plugins/remark-tool-link'

// Код-блоки в статьях всегда тёмные (в обеих темах сайта) — берём одну
// проверенную VS Code-тему Shiki. Подсветка считается на этапе сборки: в
// браузер уходит готовый HTML, без JS-подсветки и мерцания.
const SHIKI_THEME = 'github-dark'

// remark-html экранирует содержимое код-блоков в HTML-сущности. Shiki ждёт
// сырой код (и экранирует сам), поэтому сущности разворачиваем обратно.
function decodeEntities(text: string): string {
	return text
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&amp;/g, '&')
}

// Shiki-алиасы: у нас в статьях встречаются js, json, html, css, yaml и plain.
function normalizeLang(lang: string): string {
	if (lang === 'plaintext') return 'text'
	return lang
}

// Один код-блок → шапка (точки + язык + «Копировать») и подсвеченный Shiki-код.
// Кнопка копирования оживляется делегированием клика в PostBody.
async function highlightBlock(lang: string, rawCode: string): Promise<string> {
	const code = decodeEntities(rawCode).replace(/\n$/, '')
	let shiki: string
	try {
		shiki = await codeToHtml(code, {
			lang: normalizeLang(lang),
			theme: SHIKI_THEME
		})
	} catch {
		// Незнакомый язык — не роняем сборку, показываем как обычный текст
		shiki = await codeToHtml(code, { lang: 'text', theme: SHIKI_THEME })
	}

	// Стили шапки заданы инлайном намеренно: класс-правила из globals в контексте
	// .markdown перебивались, а инлайн применяется гарантированно — как фон Shiki.
	const dot =
		'display:inline-block;width:0.75rem;height:0.75rem;border-radius:9999px'
	return `<div class="code-block" style="margin:1.5rem 0;border:1px solid #30363d;border-radius:0.75rem;overflow:hidden">
	<div class="code-block__header" style="display:flex;align-items:center;gap:0.5rem;background:#1c2128;padding:0.6rem 0.9rem;border-bottom:1px solid #30363d">
		<span style="${dot};background:#ff5f56"></span>
		<span style="${dot};background:#febc2e"></span>
		<span style="${dot};background:#28c840"></span>
		<span style="margin-left:0.35rem;margin-right:auto;font-size:0.75rem;letter-spacing:0.02em;color:#8b949e;font-family:ui-monospace,SFMono-Regular,monospace">${lang}</span>
		<button type="button" class="code-block__copy" aria-label="Копировать код" style="font-size:0.75rem;color:#adbac7;padding:0.28rem 0.65rem;border:1px solid #30363d;border-radius:0.375rem;background:transparent;cursor:pointer;transition:background 0.15s,border-color 0.15s">Копировать</button>
	</div>
	${shiki}
</div>`
}

export default async function markdownToHtml(
	markdown: string
): Promise<string> {
	const result = await remark()
		// Без remark-gfm таблицы в постах не работали вовсе: markdown-разметка
		// выводилась как обычный текст с палками. Плагин также включает
		// зачёркивание, списки задач и автоссылки
		.use(gfm)
		.use(remarkToolLink)
		.use(remarkLiveCode)
		.use(html, { sanitize: false })
		.process(markdown)

	// Внешние ссылки (абсолютный http-адрес) открываем в новой вкладке, чтобы не
	// уводить читателя со статьи. Внутренние (относительные /...) не трогаем.
	const htmlString = result
		.toString()
		.replace(
			/<a href="(https?:\/\/[^"]+)"/g,
			'<a href="$1" target="_blank" rel="noopener noreferrer"'
		)

	// Собираем код-блоки (с языком и без) и подсвечиваем каждый через Shiki.
	// Replace асинхронный, поэтому сначала копим совпадения, потом склеиваем.
	const codeBlockRegex =
		/<pre><code(?: class="language-(\w+)")?>([\s\S]*?)<\/code><\/pre>/g
	const matches = [...htmlString.matchAll(codeBlockRegex)]

	if (matches.length === 0) return htmlString

	const highlighted = await Promise.all(
		matches.map(m => highlightBlock(m[1] || 'text', m[2]))
	)

	let out = ''
	let lastIndex = 0
	matches.forEach((m, i) => {
		out += htmlString.slice(lastIndex, m.index)
		out += highlighted[i]
		lastIndex = (m.index ?? 0) + m[0].length
	})
	out += htmlString.slice(lastIndex)

	return out
}

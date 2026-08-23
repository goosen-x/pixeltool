// Автоматическая отправка ошибок тулов в тот же канал, что уже принимает
// ручные отзывы (/api/feedback → Telegram + site_messages). Раньше при
// сбое человек просто видел текст ошибки на экране, а мы о ней не узнавали,
// пока пользователь сам не напишет через форму обратной связи — то есть
// почти никогда. url сервер берёт из заголовка Referer сам, передавать
// его явно не нужно.
export async function reportClientError(params: {
	title: string
	description: string
	widget: string
}) {
	try {
		await fetch('/api/feedback', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				type: 'bug',
				title: params.title,
				description: params.description,
				widget: params.widget
			})
		})
	} catch {
		// Best-effort: если само уведомление об ошибке не долетело, письменной
		// формы обратной связи всё равно можно достучаться — не блокируем UI.
	}
}

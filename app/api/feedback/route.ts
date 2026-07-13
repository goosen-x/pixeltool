import { NextRequest, NextResponse } from 'next/server'

interface FeedbackRequest {
	type: 'bug' | 'feature' | 'general'
	title: string
	description: string
	email?: string
	widget?: string
	userAgent?: string
	url?: string
}

export async function POST(request: NextRequest) {
	try {
		const body: FeedbackRequest = await request.json()

		// Basic validation
		if (!body.title || !body.description || !body.type) {
			return NextResponse.json(
				{ error: 'Missing required fields: title, description, type' },
				{ status: 400 }
			)
		}

		// Add metadata
		const feedbackData = {
			...body,
			timestamp: new Date().toISOString(),
			userAgent: request.headers.get('user-agent'),
			ip:
				request.headers.get('x-forwarded-for') ||
				request.headers.get('x-real-ip'),
			url: request.headers.get('referer')
		}

		// Раньше ошибка доставки глоталась, и запрос всё равно отвечал 200:
		// человек видел «отзыв отправлен», а до нас ничего не доходило.
		// Теперь провал доставки — это провал запроса, и он виден.
		try {
			await sendToTelegram(feedbackData)
		} catch (telegramError) {
			console.error('Не удалось доставить отзыв в Telegram:', telegramError)

			return NextResponse.json(
				{
					error: 'Не удалось отправить отзыв. Попробуйте ещё раз.',
					details:
						telegramError instanceof Error
							? telegramError.message
							: String(telegramError)
				},
				{ status: 502 }
			)
		}

		return NextResponse.json(
			{ message: 'Feedback submitted successfully' },
			{ status: 200 }
		)
	} catch (error) {
		console.error('Error processing feedback:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}

// Helper functions (examples)

function generateFeedbackEmail(data: any) {
	return `
    <h2>New ${data.type} feedback</h2>
    <p><strong>Title:</strong> ${data.title}</p>
    <p><strong>Description:</strong></p>
    <p>${data.description.replace(/\n/g, '<br>')}</p>
    ${data.email ? `<p><strong>Email:</strong> ${data.email}</p>` : ''}
    ${data.widget ? `<p><strong>Widget:</strong> ${data.widget}</p>` : ''}
    <p><strong>URL:</strong> ${data.url}</p>
    <p><strong>User Agent:</strong> ${data.userAgent}</p>
    <p><strong>Timestamp:</strong> ${data.timestamp}</p>
  `
}

async function createGitHubIssue(data: any) {
	// Example GitHub API integration
	const labels = {
		bug: ['bug'],
		feature: ['enhancement'],
		general: ['question']
	}

	const issue = {
		title: data.title,
		body: `
**Type:** ${data.type}

**Description:**
${data.description}

**Additional Info:**
- Email: ${data.email || 'Not provided'}
- Widget: ${data.widget || 'Not specified'}
- URL: ${data.url}
- User Agent: ${data.userAgent}
- Timestamp: ${data.timestamp}
    `,
		labels: labels[data.type as keyof typeof labels]
	}

	// Uncomment to enable GitHub integration
	// const response = await fetch(`https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/issues`, {
	//   method: 'POST',
	//   headers: {
	//     'Authorization': `token ${process.env.GITHUB_TOKEN}`,
	//     'Content-Type': 'application/json'
	//   },
	//   body: JSON.stringify(issue)
	// })

	// return response.json()
}

/**
 * Telegram HTML вместо Markdown.
 *
 * С parse_mode: 'Markdown' и неэкранированным текстом любой отзыв, где есть
 * `*`, `_`, `[` или обратная кавычка, Telegram отклонял с ошибкой разбора —
 * то есть ровно те отзывы, где человек приводит код или путь. HTML требует
 * экранировать всего три символа, и это надёжно.
 */
const escapeHtml = (value: unknown): string =>
	String(value ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')

async function sendToTelegram(data: any) {
	const botToken = process.env.TELEGRAM_BOT_TOKEN
	const chatId = process.env.TELEGRAM_CHAT_ID

	if (!botToken || !chatId) {
		throw new Error('Telegram credentials not configured')
	}

	const typeEmoji: Record<string, string> = {
		bug: '🐛',
		feature: '💡',
		general: '💬'
	}

	const emoji = typeEmoji[data.type] || '📝'

	const lines = [
		`${emoji} <b>Обратная связь: ${escapeHtml(data.type).toUpperCase()}</b>`,
		'',
		`<b>Заголовок</b>`,
		escapeHtml(data.title),
		'',
		`<b>Описание</b>`,
		escapeHtml(data.description),
		''
	]

	if (data.email) lines.push(`<b>Email:</b> ${escapeHtml(data.email)}`)
	if (data.widget) lines.push(`<b>Инструмент:</b> ${escapeHtml(data.widget)}`)
	if (data.url) lines.push(`<b>Страница:</b> ${escapeHtml(data.url)}`)

	lines.push(
		`<b>Время:</b> ${escapeHtml(new Date(data.timestamp).toLocaleString('ru-RU'))}`
	)

	if (data.userAgent) {
		lines.push(`<b>Браузер:</b> ${escapeHtml(data.userAgent.slice(0, 120))}`)
	}

	const response = await fetch(
		`https://api.telegram.org/bot${botToken}/sendMessage`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				chat_id: chatId,
				text: lines.join('\n'),
				parse_mode: 'HTML',
				disable_web_page_preview: true
			})
		}
	)

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}))
		throw new Error(
			`Telegram API error: ${errorData.description || response.status}`
		)
	}
}

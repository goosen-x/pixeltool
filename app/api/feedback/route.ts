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

		// Send to Telegram
		try {
			await sendToTelegram(feedbackData)
		} catch (telegramError) {
			console.error('Failed to send to Telegram:', telegramError)
			// Don't fail the request if Telegram fails
		}

		// Log for debugging
		console.log('Feedback received:', feedbackData)

		return NextResponse.json(
			{
				message: 'Feedback submitted successfully',
				id: Date.now().toString() // In production, use proper ID generation
			},
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

async function sendToTelegram(data: any) {
	const botToken = process.env.TELEGRAM_BOT_TOKEN
	const chatId = process.env.TELEGRAM_CHAT_ID

	if (!botToken || !chatId) {
		console.warn('Telegram credentials not configured')
		return
	}

	// Emoji по типу обратной связи
	const typeEmoji = {
		bug: '🐛',
		feature: '💡',
		general: '💬'
	}

	const emoji = typeEmoji[data.type as keyof typeof typeEmoji] || '📝'

	// Форматируем сообщение с Telegram Markdown
	const message = `
${emoji} *Новая обратная связь: ${data.type.toUpperCase()}*

📌 *Заголовок:*
${data.title}

📝 *Описание:*
${data.description}

${data.email ? `📧 *Email:* ${data.email}` : ''}
${data.widget ? `🔧 *Виджет:* ${data.widget}` : ''}
${data.url ? `🔗 *URL:* ${data.url}` : ''}

🕐 *Время:* ${new Date(data.timestamp).toLocaleString('ru-RU')}
${data.userAgent ? `💻 *User Agent:* ${data.userAgent.slice(0, 100)}...` : ''}
	`.trim()

	try {
		const response = await fetch(
			`https://api.telegram.org/bot${botToken}/sendMessage`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					chat_id: chatId,
					text: message,
					parse_mode: 'Markdown',
					disable_web_page_preview: true
				})
			}
		)

		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(
				`Telegram API error: ${errorData.description || 'Unknown error'}`
			)
		}

		console.log('Feedback sent to Telegram successfully')
	} catch (error) {
		console.error('Error sending to Telegram:', error)
		throw error
	}
}

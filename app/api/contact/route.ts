import { NextRequest, NextResponse } from 'next/server'

interface ContactRequest {
	name: string
	email: string
	subject: string
	message: string
}

// Тот же паттерн и те же TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID, что и у
// app/api/feedback/route.ts — один бот на все уведомления сайта.
const escapeHtml = (value: unknown): string =>
	String(value ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')

async function sendToTelegram(data: ContactRequest) {
	const botToken = process.env.TELEGRAM_BOT_TOKEN
	const chatId = process.env.TELEGRAM_CHAT_ID

	if (!botToken || !chatId) {
		throw new Error('Telegram credentials not configured')
	}

	const lines = [
		'📬 <b>Новое сообщение с формы контактов</b>',
		'',
		`<b>Имя:</b> ${escapeHtml(data.name)}`,
		`<b>Email:</b> ${escapeHtml(data.email)}`,
		`<b>Тема:</b> ${escapeHtml(data.subject)}`,
		'',
		`<b>Сообщение</b>`,
		escapeHtml(data.message),
		'',
		`<b>Время:</b> ${escapeHtml(new Date().toLocaleString('ru-RU'))}`
	]

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

export async function POST(request: NextRequest) {
	try {
		const body: ContactRequest = await request.json()

		if (!body.name || !body.email || !body.subject || !body.message) {
			return NextResponse.json(
				{ error: 'Заполните все поля формы' },
				{ status: 400 }
			)
		}

		try {
			await sendToTelegram(body)
		} catch (telegramError) {
			console.error(
				'Не удалось доставить сообщение с формы контактов в Telegram:',
				telegramError
			)

			return NextResponse.json(
				{
					error: 'Не удалось отправить сообщение. Попробуйте ещё раз.',
					details:
						telegramError instanceof Error
							? telegramError.message
							: String(telegramError)
				},
				{ status: 502 }
			)
		}

		return NextResponse.json({ message: 'Message sent' }, { status: 200 })
	} catch (error) {
		console.error('Error processing contact form:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}

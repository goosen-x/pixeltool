import { NextRequest, NextResponse } from 'next/server'
import { telegramFetch } from '@/lib/telegram/proxy-fetch'
import { getDb } from '@/lib/db'
import { parseAttribution, sendLead } from '@/lib/lead-message'

interface ContactRequest {
	name: string
	email: string
	subject: string
	message: string
	attribution?: unknown
}

// Заявки со всех сайтов GooseLabs идут в один бот лидов
// (TELEGRAM_LEADS_BOT_TOKEN/TELEGRAM_LEADS_CHAT_ID), формат общий: lib/lead-message.ts.
// Отзывы и баг-репорты (app/api/feedback) идут в общий бот уведомлений.
async function sendToTelegram(data: ContactRequest) {
	const sent = await sendLead(
		{
			site: 'pixeltool.pro',
			siteTag: 'pixeltool',
			form: 'Контакты',
			formTag: 'contact',
			fields: [
				['Имя', data.name],
				['Email', data.email],
				['Тема', data.subject],
				['Сообщение', data.message]
			],
			attribution: data.attribution
		},
		telegramFetch
	)
	if (!sent) throw new Error('Заявка не доставлена в бот лидов')
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

		// Сначала БД — это гарантированная копия. Telegram дальше best-effort:
		// его падение больше не значит, что сообщение потеряно навсегда.
		const db = await getDb()
		const {
			rows: [row]
		} = await db.query<{ id: number }>(
			`INSERT INTO site_messages (source, name, email, subject, message, meta)
			 VALUES ('contact', $1, $2, $3, $4, $5) RETURNING id`,
			[
				body.name,
				body.email,
				body.subject,
				body.message,
				JSON.stringify({
					attribution: parseAttribution(body.attribution) ?? null
				})
			]
		)

		try {
			await sendToTelegram(body)
			await db.query(
				`UPDATE site_messages SET telegram_sent_at = now() WHERE id = $1`,
				[row.id]
			)
		} catch (telegramError) {
			console.error(
				'Сообщение с формы контактов сохранено, но не доставлено в Telegram:',
				telegramError
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

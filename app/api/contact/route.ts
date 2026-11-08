import { NextRequest, NextResponse } from 'next/server'
import { telegramFetch } from '@/lib/telegram/proxy-fetch'
import { submitLead } from '@/lib/lead-message'

interface ContactRequest {
	name: string
	email: string
	subject: string
	message: string
	attribution?: unknown
}

// Заявки со всех сайтов GooseLabs пишутся в одну базу (таблица site_leads)
// и идут в один бот лидов. Формат и хранение общие: lib/lead-message.ts,
// lib/lead-store.ts, lib/attribution.ts.
function toLead(data: ContactRequest) {
	return {
		site: 'pixeltool.pro',
		siteTag: 'pixeltool',
		form: 'Контакты',
		formTag: 'contact',
		fields: [
			['Имя', data.name],
			['Email', data.email],
			['Тема', data.subject],
			['Сообщение', data.message]
		] as [string, string][],
		contact: {
			name: data.name,
			email: data.email,
			message: `${data.subject}\n\n${data.message}`
		},
		attribution: data.attribution
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

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
			return NextResponse.json(
				{ error: 'Некорректный формат email' },
				{ status: 400 }
			)
		}

		const ok = await submitLead(toLead(body), telegramFetch)
		if (!ok) {
			return NextResponse.json(
				{ error: 'Не удалось отправить сообщение. Попробуйте позже.' },
				{ status: 500 }
			)
		}

		return NextResponse.json({ message: 'Message sent', success: true })
	} catch (error) {
		console.error('Error processing contact form:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}

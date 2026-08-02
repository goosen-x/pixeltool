import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'
import { z } from 'zod'
import { getDb } from '@/lib/db'
import { isMailConfigured, sendMail } from '@/lib/mail'

const leadSchema = z.object({
	email: z.string().trim().email(),
	// Скрытое поле формы — реальные пользователи его не видят и не заполняют,
	// боты обычно заполняют всё подряд.
	company: z.string().max(0).optional(),
	source: z.string().max(100).optional()
})

const PDF_PATH = join(process.cwd(), 'public/downloads/pixeltool-10-tools.pdf')

export async function POST(request: NextRequest) {
	let parsed: z.infer<typeof leadSchema>

	try {
		parsed = leadSchema.parse(await request.json())
	} catch {
		return NextResponse.json(
			{ error: 'Введите корректный email' },
			{ status: 400 }
		)
	}

	if (parsed.company) {
		// Похоже на бота (заполнено honeypot-поле) — тихо отвечаем успехом,
		// не подсказываем боту, что его вычислили.
		return NextResponse.json({ ok: true })
	}

	const { email, source } = parsed

	try {
		const db = await getDb()
		await db.query(
			'INSERT INTO leads (email, source) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING',
			[email, source ?? null]
		)
	} catch (error) {
		console.error('Не удалось сохранить lead в БД:', error)
		return NextResponse.json(
			{ error: 'Не удалось сохранить email. Попробуйте позже.' },
			{ status: 500 }
		)
	}

	if (!isMailConfigured()) {
		console.error('SMTP не настроен — email сохранён, но PDF не отправлен')
		return NextResponse.json({ ok: true })
	}

	try {
		await sendMail({
			to: email,
			subject: 'Ваша подборка инструментов PixelTool',
			html: `
				<p>Привет!</p>
				<p>Как обещали — подборка из 10 полезных инструментов PixelTool во вложении.</p>
				<p>Все инструменты всегда под рукой: <a href="https://pixeltool.pro/tools">pixeltool.pro/tools</a></p>
			`,
			attachments: [{ filename: 'pixeltool-10-tools.pdf', path: PDF_PATH }]
		})

		const db = await getDb()
		await db.query('UPDATE leads SET pdf_sent_at = now() WHERE email = $1', [
			email
		])
	} catch (error) {
		console.error('Не удалось отправить письмо с PDF:', error)
		// Email уже сохранён — пользователь не должен видеть ошибку из-за
		// временного сбоя почты, письмо можно переотправить вручную позже.
	}

	return NextResponse.json({ ok: true })
}

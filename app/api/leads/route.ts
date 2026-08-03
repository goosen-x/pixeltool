import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'
import { z } from 'zod'
import { getDb } from '@/lib/db'
import { isMailConfigured, sendMail } from '@/lib/mail'
import { LEGAL_VERSION_DATE } from '@/lib/legal/operator'

const leadSchema = z.object({
	email: z.string().trim().email(),
	// Скрытое поле формы — реальные пользователи его не видят и не заполняют,
	// боты обычно заполняют всё подряд.
	company: z.string().max(0).optional(),
	source: z.string().max(100).optional(),
	// Согласие на обработку ПД обязательно: literal(true) — не «по умолчанию
	// true», а именно присланное клиентом подтверждение. Проверка на сервере,
	// потому что клиентскую галочку обходят через devtools.
	consentData: z.literal(true),
	// Согласие на рекламу добровольное: без него человек получает только
	// запрошенную шпаргалку.
	consentAds: z.boolean().optional()
})

const PDF_PATH = join(
	process.cwd(),
	'public/downloads/pixeltool-goryachie-klavishi.pdf'
)

export async function POST(request: NextRequest) {
	let parsed: z.infer<typeof leadSchema>

	try {
		parsed = leadSchema.parse(await request.json())
	} catch (error) {
		// Сообщение должно совпадать с тем, что человек видит в форме: «введите
		// корректный email» в ответ на неотмеченную галку сбивает с толку.
		const missingConsent =
			error instanceof z.ZodError &&
			error.issues.some(issue => issue.path[0] === 'consentData')

		return NextResponse.json(
			{
				error: missingConsent
					? 'Отметьте согласие на обработку персональных данных'
					: 'Введите корректный email'
			},
			{ status: 400 }
		)
	}

	if (parsed.company) {
		// Похоже на бота (заполнено honeypot-поле) — тихо отвечаем успехом,
		// не подсказываем боту, что его вычислили.
		return NextResponse.json({ ok: true })
	}

	const { email, source, consentAds } = parsed

	try {
		const db = await getDb()
		// Повторная отправка формы тем же адресом — не дубль, а обновление
		// согласия: человек мог в этот раз отметить рекламу или наоборот.
		await db.query(
			`INSERT INTO leads (email, source, consent_data_at, consent_ads_at, consent_version)
			 VALUES ($1, $2, now(), $3, $4)
			 ON CONFLICT (email) DO UPDATE SET
			   consent_data_at = now(),
			   consent_ads_at = CASE WHEN $3::timestamptz IS NULL THEN NULL ELSE now() END,
			   consent_version = $4`,
			[
				email,
				source ?? null,
				consentAds ? new Date() : null,
				LEGAL_VERSION_DATE
			]
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
			subject: 'Шпаргалка горячих клавиш от PixelTool',
			html: `
				<p>Привет!</p>
				<p>Как обещали — горячие клавиши для Windows, macOS, браузера, Excel, видеозвонков и презентаций во вложении.</p>
				<p>Все инструменты всегда под рукой: <a href="https://pixeltool.pro/tools">pixeltool.pro/tools</a></p>
			`,
			attachments: [
				{ filename: 'pixeltool-goryachie-klavishi.pdf', path: PDF_PATH }
			]
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

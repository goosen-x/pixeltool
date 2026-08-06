import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'
import { z } from 'zod'
import { getDb } from '@/lib/db'
import { isMailConfigured, sendMail } from '@/lib/mail'
import {
	LEAD_MAGNET_IMAGES,
	leadMagnetHtml,
	leadMagnetSubject,
	leadMagnetText
} from '@/lib/mail/lead-magnet-email'
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
	consentAds: z.boolean().optional(),
	// Какая версия шпаргалки нужна. Клиент определяет ОС сам и показывает
	// человеку переключатель — здесь просто доверяем присланному значению,
	// подделка ничем не грозит (обе версии лежат публично).
	os: z.enum(['windows', 'macos']).optional()
})

// Две версии: сочетания на macOS отличаются не только модификатором
// (Alt + = против Cmd + Shift + T в Excel), поэтому это разные файлы,
// а не одна шпаргалка с колонкой «на Mac».
const PDF_FILES = {
	windows: 'pixeltool-goryachie-klavishi-windows.pdf',
	macos: 'pixeltool-goryachie-klavishi-macos.pdf'
} as const

// macOS по умолчанию — так решено для случая, когда ОС не определилась
// (телефон, нестандартный браузер): человек всё равно может переключить
// вручную в форме.
const DEFAULT_OS = 'macos'

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

	const { email, source, consentAds, os } = parsed
	const variant = os ?? DEFAULT_OS

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
			subject: leadMagnetSubject(variant),
			html: leadMagnetHtml(
				variant,
				`mailto:${process.env.SMTP_USER}?subject=unsubscribe`
			),
			text: leadMagnetText(variant),
			attachments: [
				{
					filename: PDF_FILES[variant],
					path: join(process.cwd(), 'public/downloads', PDF_FILES[variant])
				},
				...LEAD_MAGNET_IMAGES
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

import nodemailer, { type Transporter } from 'nodemailer'

let transporter: Transporter | null = null

// SMTP_* задаются в .env.production на сервере (через GitHub secrets, тот же
// принцип, что и DATABASE_URL — см. .github/workflows/deploy.yml). Без них
// письма просто не уходят: вызывающий код обязан явно проверить isMailConfigured().
export function isMailConfigured(): boolean {
	return Boolean(
		process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD
	)
}

function getTransporter(): Transporter {
	if (!transporter) {
		transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: Number(process.env.SMTP_PORT) || 587,
			secure: Number(process.env.SMTP_PORT) === 465,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASSWORD
			}
		})
	}
	return transporter
}

export async function sendMail(options: {
	to: string
	subject: string
	html: string
	// Текстовая версия обязательна: письмо без text/plain части — заметный
	// спам-сигнал у Gmail и Mail.ru, они ждут multipart/alternative.
	text: string
	attachments?: { filename: string; path: string }[]
	headers?: Record<string, string>
}) {
	const from = process.env.SMTP_FROM || process.env.SMTP_USER
	const mailbox = process.env.SMTP_USER

	await getTransporter().sendMail({
		from,
		// Ответ на письмо должен приходить живому человеку, а не в никуда:
		// молчащий обратный адрес фильтры тоже считают признаком рассылки.
		replyTo: mailbox,
		...options,
		headers: {
			// List-Unsubscribe — ссылка «Отписаться» в интерфейсе почты. Пока
			// mailto (отдельной ручки отписки нет), это валидный вариант и он
			// соответствует обещанию в оферте (documents.ts, п. 6.3).
			'List-Unsubscribe': `<mailto:${mailbox}?subject=unsubscribe>`,
			...options.headers
		}
	})
}

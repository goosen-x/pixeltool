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
	attachments?: { filename: string; path: string }[]
}) {
	const from = process.env.SMTP_FROM || process.env.SMTP_USER
	await getTransporter().sendMail({ from, ...options })
}

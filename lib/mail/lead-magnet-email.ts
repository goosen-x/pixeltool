import { join } from 'path'

// Вёрстка письма живёт отдельно от роута: HTML для почты — это таблицы и
// инлайновые стили, его нельзя писать «как обычную страницу», и в теле
// обработчика формы он мешал бы читать логику.
//
// Правила, из которых собран шаблон:
// - только таблицы и inline-стили: <style> в <head> режут Outlook и часть
//   мобильных клиентов, внешние CSS не работают нигде;
// - ширина 600px — исторический безопасный максимум, шире обрезают;
// - картинки прикладываются вложениями с cid, а не ссылками: внешние
//   картинки клиенты по умолчанию блокируют, и письмо приходит пустым;
// - у каждой картинки заданы width/height и alt — пока картинка не
//   загрузилась (или отключена), макет не должен разъезжаться;
// - кнопка сделана таблицей, а не <a> с padding: Outlook игнорирует
//   padding у ссылок и кнопка схлопывается в текст.

const ROOT = process.cwd()

export const LEAD_MAGNET_IMAGES = [
	{
		filename: 'header.png',
		path: join(ROOT, 'assets/email/header.png'),
		cid: 'pixeltool-header'
	},
	{
		filename: 'logo.png',
		path: join(ROOT, 'assets/email/logo.png'),
		cid: 'pixeltool-logo'
	}
]

const INK = '#111827'
const MUTED = '#6b7280'
const ACCENT = '#2563eb'
const DARK = '#0b0f19'

type Os = 'windows' | 'macos'

const osLabel = (os: Os) => (os === 'macos' ? 'macOS' : 'Windows')

// Что внутри — списком: человек оставлял почту ради конкретного файла, и
// первым делом хочет понять, что в нём. Списку в письме нужен не <ul>, а
// таблица: отступы у списков клиенты считают по-разному.
const CONTENTS: Record<Os, string[]> = {
	macos: [
		'Система: Spotlight, Mission Control, скриншоты, Finder',
		'Браузер: вкладки, история, масштаб, инкогнито',
		'Работа с текстом: правка, перемещение, форматирование',
		'Таблицы, Zoom, Google Meet и презентации'
	],
	windows: [
		'Система: окна, рабочие столы, скриншоты, Проводник',
		'Браузер: вкладки, история, масштаб, инкогнито',
		'Работа с текстом: правка, перемещение, форматирование',
		'Таблицы, Zoom, Google Meet и презентации'
	]
}

function contentRows(os: Os): string {
	return CONTENTS[os]
		.map(
			item => `
			<tr>
				<td style="padding:0 0 10px 0;vertical-align:top;width:22px;color:${ACCENT};font-size:15px;line-height:22px;">&bull;</td>
				<td style="padding:0 0 10px 0;color:${INK};font-size:15px;line-height:22px;">${item}</td>
			</tr>`
		)
		.join('')
}

export function leadMagnetSubject(os: Os): string {
	return `100 горячих клавиш для ${osLabel(os)} — ваша шпаргалка`
}

export function leadMagnetHtml(os: Os, unsubscribeMailto: string): string {
	const label = osLabel(os)

	return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<!-- Разрешаем клиенту рисовать письмо и в тёмной теме, иначе Gmail на
     Android инвертирует цвета сам и делает это грубее. -->
<meta name="color-scheme" content="light dark">
<title>${leadMagnetSubject(os)}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;">
<!-- Прехедер: строка, которую список писем показывает после темы. Без него
     туда попадает первое, что найдётся в разметке. Скрыт из тела письма. -->
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">
	Шпаргалка во вложении: система, браузер, текст, таблицы, звонки и презентации.
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f4f6;">
<tr><td align="center" style="padding:24px 12px;">

	<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background:#ffffff;border-radius:14px;overflow:hidden;">

		<tr>
			<td style="background:${DARK};padding:20px 28px;">
				<table role="presentation" cellpadding="0" cellspacing="0" border="0">
					<tr>
						<td style="padding-right:10px;"><img src="cid:pixeltool-logo" width="26" height="26" alt="" style="display:block;border:0;border-radius:6px;"></td>
						<td style="color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:17px;font-weight:600;">PixelTool</td>
					</tr>
				</table>
			</td>
		</tr>

		<tr>
			<td style="background:${DARK};font-size:0;line-height:0;">
				<img src="cid:pixeltool-header" width="600" height="170" alt="" style="display:block;width:100%;height:auto;border:0;">
			</td>
		</tr>

		<tr>
			<td style="padding:32px 28px 8px 28px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
				<h1 style="margin:0 0 12px 0;color:${INK};font-size:24px;line-height:31px;font-weight:700;">100 горячих клавиш для ${label}</h1>
				<p style="margin:0 0 22px 0;color:${MUTED};font-size:15px;line-height:23px;">
					Шпаргалка во вложении — можно распечатать и положить рядом с монитором.
				</p>

				<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
					${contentRows(os)}
				</table>
			</td>
		</tr>

		<tr>
			<td style="padding:22px 28px 34px 28px;">
				<table role="presentation" cellpadding="0" cellspacing="0" border="0">
					<tr>
						<td style="background:${ACCENT};border-radius:8px;">
							<a href="https://pixeltool.pro/tools" style="display:inline-block;padding:13px 26px;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:15px;font-weight:600;text-decoration:none;">Открыть инструменты</a>
						</td>
					</tr>
				</table>
				<p style="margin:14px 0 0 0;color:${MUTED};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:13px;line-height:20px;">
					49 бесплатных инструментов: QR-коды, пароли, конвертеры, генераторы.
				</p>
			</td>
		</tr>

		<tr>
			<td style="padding:18px 28px 24px 28px;background:#f9fafb;border-top:1px solid #e5e7eb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
				<p style="margin:0;color:${MUTED};font-size:12px;line-height:19px;">
					Вы получили это письмо, потому что запросили шпаргалку на
					<a href="https://pixeltool.pro" style="color:${MUTED};">pixeltool.pro</a>.
					<a href="${unsubscribeMailto}" style="color:${MUTED};">Отписаться</a>
				</p>
			</td>
		</tr>

	</table>

</td></tr>
</table>
</body>
</html>`
}

export function leadMagnetText(os: Os): string {
	const label = osLabel(os)
	return [
		`100 горячих клавиш для ${label}`,
		'',
		'Шпаргалка во вложении — можно распечатать и положить рядом с монитором.',
		'',
		...CONTENTS[os].map(item => `— ${item}`),
		'',
		'49 бесплатных инструментов: https://pixeltool.pro/tools',
		'',
		'Вы получили это письмо, потому что запросили шпаргалку на pixeltool.pro.',
		'Чтобы отписаться, ответьте на письмо словом «отписаться».'
	].join('\n')
}

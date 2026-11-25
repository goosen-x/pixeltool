/**
 * Копирование невидимого символа в буфер обмена.
 *
 * navigator.clipboard есть не везде: во встроенных браузерах Telegram и VK на
 * Android (оттуда приходит заметная часть людей, которым нужен пустой ник) его
 * нет вовсе или writeText отклоняется без жеста пользователя. Раньше в таком
 * случае человек видел только «Не удалось скопировать символ». Запасной путь
 * через скрытое поле и execCommand('copy') устарел, но в этих WebView работает.
 */
export async function copyInvisible(text: string): Promise<boolean> {
	if (!text) return false

	try {
		if (navigator.clipboard?.writeText) {
			await navigator.clipboard.writeText(text)
			return true
		}
	} catch {
		// пробуем запасной путь ниже
	}

	return copyViaTextarea(text)
}

function copyViaTextarea(text: string): boolean {
	if (typeof document === 'undefined') return false

	const textarea = document.createElement('textarea')
	textarea.value = text
	textarea.setAttribute('readonly', '')
	// Вне экрана, но не display:none: из скрытого поля выделение не копируется.
	textarea.style.position = 'fixed'
	textarea.style.top = '0'
	textarea.style.left = '-9999px'
	textarea.style.opacity = '0'
	document.body.appendChild(textarea)

	try {
		textarea.select()
		textarea.setSelectionRange(0, text.length)
		return document.execCommand('copy')
	} catch {
		return false
	} finally {
		document.body.removeChild(textarea)
	}
}

/**
 * Сайт отвечает, но с негодным сертификатом. Раньше такие случаи уходили в общее
 * «не удалось соединиться» и человек думал, что сломан сайт целиком или наш
 * инструмент (отзыв 24.11.2026: yuriyp.ru отдаёт сертификат от scan-build.ru).
 * Для владельца сайта это важная находка: соцсети и мессенджеры по такой ссылке
 * превью тоже не соберут.
 */

const NO_PREVIEW =
	'Соцсети и мессенджеры по такой ссылке превью тоже не соберут.'

const ALTNAME = `Сертификат безопасности (SSL) у сайта выписан на другой домен, поэтому защищённое соединение не устанавливается. Браузер покажет на этой ссылке предупреждение. ${NO_PREVIEW} Владельцу сайта нужно выпустить сертификат именно для этого адреса, например бесплатный от Let's Encrypt.`

const EXPIRED = `У сайта истёк сертификат безопасности (SSL), защищённое соединение не устанавливается. Браузер покажет на этой ссылке предупреждение. ${NO_PREVIEW} Сертификат нужно продлить.`

const NOT_YET_VALID = `Сертификат безопасности (SSL) у сайта ещё не начал действовать: дата начала в нём позже сегодняшней. ${NO_PREVIEW} Проверьте сертификат и часы на сервере.`

const UNTRUSTED = `Сертификат безопасности (SSL) у сайта не подтверждён известным центром сертификации: он самоподписанный или на сервере не хватает промежуточного сертификата. Браузер иногда такую страницу всё же открывает, но соцсети и мессенджеры превью по ней не соберут. На сервер нужно поставить полную цепочку сертификатов.`

const CODES: Record<string, string> = {
	ERR_TLS_CERT_ALTNAME_INVALID: ALTNAME,
	CERT_HAS_EXPIRED: EXPIRED,
	CERT_NOT_YET_VALID: NOT_YET_VALID,
	DEPTH_ZERO_SELF_SIGNED_CERT: UNTRUSTED,
	SELF_SIGNED_CERT_IN_CHAIN: UNTRUSTED,
	UNABLE_TO_VERIFY_LEAF_SIGNATURE: UNTRUSTED,
	UNABLE_TO_GET_ISSUER_CERT: UNTRUSTED,
	UNABLE_TO_GET_ISSUER_CERT_LOCALLY: UNTRUSTED
}

/** Текст для человека, если fetch упал на сертификате сайта; иначе null. */
export function tlsCertMessage(error: unknown): string | null {
	if (!(error instanceof Error)) return null
	const cause = error.cause
	if (typeof cause !== 'object' || cause === null || !('code' in cause)) {
		return null
	}
	return CODES[String((cause as { code?: unknown }).code)] ?? null
}

// Минимальный S3-клиент для файлов состояния в reg.ru Cloud.
//
// Без зависимостей: только node:https и node:crypto, потому что этот код
// гоняется в CI сразу после деплоя, где `npm install` не делается, и в
// контейнере агента, где нет ни aws-cli, ни boto3, ни pip.
//
// fetch() здесь не подходит: у эндпоинта самоподписанный сертификат, а
// отключить проверку у глобального fetch в Node 20 без undici из npm нельзя.
// node:https такую опцию принимает напрямую.
import { createHmac, createHash } from 'node:crypto'
import { request as httpsRequest } from 'node:https'

const SERVICE = 's3'

/** @returns {{accessKey: string, secretKey: string, region: string, bucket: string, host: string} | null} */
export function readS3Config() {
	const accessKey = process.env.S3_ACCESS_KEY_ID
	const secretKey = process.env.S3_SECRET_ACCESS_KEY
	if (!accessKey || !secretKey) return null
	return {
		accessKey,
		secretKey,
		region: process.env.S3_REGION || 'ru-1',
		bucket: process.env.S3_BUCKET || 'pixeltool',
		host: process.env.S3_ENDPOINT_HOST || 's3.regru.cloud'
	}
}

function sign(key, value) {
	return createHmac('sha256', key).update(value, 'utf8').digest()
}

function authorize(config, method, path, payload, amzDate, dateStamp) {
	const payloadHash = createHash('sha256').update(payload).digest('hex')
	const canonicalHeaders =
		`host:${config.host}\n` +
		`x-amz-content-sha256:${payloadHash}\n` +
		`x-amz-date:${amzDate}\n`
	const signedHeaders = 'host;x-amz-content-sha256;x-amz-date'
	const canonicalRequest = [
		method,
		path,
		'',
		canonicalHeaders,
		signedHeaders,
		payloadHash
	].join('\n')

	const scope = `${dateStamp}/${config.region}/${SERVICE}/aws4_request`
	const stringToSign = [
		'AWS4-HMAC-SHA256',
		amzDate,
		scope,
		createHash('sha256').update(canonicalRequest).digest('hex')
	].join('\n')

	let key = sign(`AWS4${config.secretKey}`, dateStamp)
	key = sign(key, config.region)
	key = sign(key, SERVICE)
	key = sign(key, 'aws4_request')
	const signature = createHmac('sha256', key)
		.update(stringToSign, 'utf8')
		.digest('hex')

	return {
		payloadHash,
		authorization:
			`AWS4-HMAC-SHA256 Credential=${config.accessKey}/${scope}, ` +
			`SignedHeaders=${signedHeaders}, Signature=${signature}`
	}
}

function send(config, method, path, payload) {
	const now = new Date()
	const amzDate = now
		.toISOString()
		.replace(/[-:]/g, '')
		.replace(/\.\d{3}/, '')
	const dateStamp = amzDate.slice(0, 8)
	const { payloadHash, authorization } = authorize(
		config,
		method,
		path,
		payload,
		amzDate,
		dateStamp
	)

	return new Promise((resolve, reject) => {
		const req = httpsRequest(
			{
				host: config.host,
				path,
				method,
				// Сертификат эндпоинта самоподписанный — аналог --no-verify-ssl
				// у aws-cli. Данные здесь несекретные (список URL сайта), а
				// ключи уходят в заголовке уже подписанными.
				rejectUnauthorized: false,
				headers: {
					Host: config.host,
					'x-amz-date': amzDate,
					'x-amz-content-sha256': payloadHash,
					'Content-Length': Buffer.byteLength(payload),
					Authorization: authorization
				}
			},
			res => {
				const chunks = []
				res.on('data', chunk => chunks.push(chunk))
				res.on('end', () =>
					resolve({
						status: res.statusCode ?? 0,
						body: Buffer.concat(chunks).toString('utf8')
					})
				)
			}
		)
		req.on('error', reject)
		req.setTimeout(30000, () => req.destroy(new Error('S3: таймаут 30с')))
		if (payload.length > 0) req.write(payload)
		req.end()
	})
}

/**
 * Читает объект. Возвращает null, если его ещё нет (404) — это штатный случай
 * первого запуска, а не ошибка.
 * @returns {Promise<string | null>}
 */
export async function getObject(config, key) {
	const { status, body } = await send(
		config,
		'GET',
		`/${config.bucket}/${key}`,
		Buffer.alloc(0)
	)
	if (status === 404) return null
	if (status !== 200) {
		throw new Error(`S3 GET ${key}: HTTP ${status} ${body.slice(0, 300)}`)
	}
	return body
}

export async function putObject(config, key, text) {
	const { status, body } = await send(
		config,
		'PUT',
		`/${config.bucket}/${key}`,
		Buffer.from(text, 'utf8')
	)
	if (status !== 200 && status !== 201) {
		throw new Error(`S3 PUT ${key}: HTTP ${status} ${body.slice(0, 300)}`)
	}
}

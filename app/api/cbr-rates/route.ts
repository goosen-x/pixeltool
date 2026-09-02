import { NextResponse } from 'next/server'

/**
 * Курсы валют Центробанка.
 *
 * ЦБ отдаёт дневной срез XML в кодировке windows-1251 — не UTF-8, поэтому
 * ответ читается как ArrayBuffer и декодируется вручную. Через `response.text()`
 * названия валют превратились бы в кракозябры.
 *
 * Курс публикуется раз в рабочий день и в течение дня не меняется, поэтому
 * ответ кэшируется на час: чаще ходить незачем, а держать пользователя в
 * ожидании чужого сервера на каждом нажатии — тем более.
 */
export const revalidate = 3600

const CBR_URL = 'https://www.cbr.ru/scripts/XML_daily.asp'

export interface CbrRate {
	code: string
	name: string
	/** За сколько единиц валюты указан курс: у иены и вона это 100. */
	nominal: number
	/** Рублей за nominal единиц. */
	value: number
}

function parseRates(xml: string): CbrRate[] {
	const rates: CbrRate[] = []
	const blocks = xml.match(/<Valute[^>]*>[\s\S]*?<\/Valute>/g) ?? []

	for (const block of blocks) {
		const code = block.match(/<CharCode>(.*?)<\/CharCode>/)?.[1]
		const name = block.match(/<Name>(.*?)<\/Name>/)?.[1]
		const nominal = block.match(/<Nominal>(.*?)<\/Nominal>/)?.[1]
		// Дробная часть отделена запятой — русский формат в исходнике
		const value = block.match(/<Value>(.*?)<\/Value>/)?.[1]

		if (!code || !name || !nominal || !value) continue

		rates.push({
			code,
			name,
			nominal: Number(nominal),
			value: Number(value.replace(',', '.'))
		})
	}

	return rates
}

export async function GET() {
	try {
		const response = await fetch(CBR_URL, {
			next: { revalidate },
			headers: { 'User-Agent': 'pixeltool.pro currency converter' }
		})

		if (!response.ok) {
			return NextResponse.json(
				{ error: 'Центробанк не ответил' },
				{ status: 502 }
			)
		}

		const buffer = await response.arrayBuffer()
		const xml = new TextDecoder('windows-1251').decode(buffer)

		const date = xml.match(/Date="([\d.]+)"/)?.[1] ?? null
		const rates = parseRates(xml)

		if (rates.length === 0) {
			return NextResponse.json(
				{ error: 'Не удалось разобрать ответ Центробанка' },
				{ status: 502 }
			)
		}

		return NextResponse.json({ date, rates })
	} catch {
		return NextResponse.json(
			{ error: 'Не удалось получить курсы' },
			{ status: 502 }
		)
	}
}

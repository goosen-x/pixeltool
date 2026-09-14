import { describe, it, expect } from 'vitest'
import { parseWebmasterCsv } from '@/lib/webmaster-stats/parse-csv'

const header = 'URL,Период,Показы,Клики,CTR,Позиция,Позиция клика'
const row = (period: string) =>
	`${header}\n/tools/invisible-character,${period},26869,350,1.3,7.91,5.63\n`

describe('parseWebmasterCsv', () => {
	it('принимает период в ISO', () => {
		const [stat] = parseWebmasterCsv(row('2026-09-01 - 2026-09-13'))
		expect(stat.periodStart).toBe('2026-09-01')
		expect(stat.periodEnd).toBe('2026-09-13')
	})

	// Вебмастер отдаёт даты как 01.09.2026, а схема ждёт ISO. Импорт падал на
	// валидации Zod, и по сообщению нельзя было понять, что дело в формате.
	it('принимает период в российском формате', () => {
		const [stat] = parseWebmasterCsv(row('01.09.2026 - 13.09.2026'))
		expect(stat.periodStart).toBe('2026-09-01')
		expect(stat.periodEnd).toBe('2026-09-13')
	})

	it('принимает длинное тире как разделитель периода', () => {
		const [stat] = parseWebmasterCsv(row('01.09.2026 — 13.09.2026'))
		expect(stat.periodStart).toBe('2026-09-01')
		expect(stat.periodEnd).toBe('2026-09-13')
	})

	it('читает числовые колонки и необязательную позицию клика', () => {
		const [stat] = parseWebmasterCsv(row('01.09.2026 - 13.09.2026'))
		expect(stat).toMatchObject({
			path: '/tools/invisible-character',
			impressions: 26869,
			clicks: 350,
			ctr: 1.3,
			avgPosition: 7.91,
			avgClickPosition: 5.63
		})
	})

	it('оставляет пустую позицию клика как null, а не нулём', () => {
		const csv = `${header}\n/tools/a,01.09.2026 - 13.09.2026,10,0,0,9.1,\n`
		expect(parseWebmasterCsv(csv)[0].avgClickPosition).toBeNull()
	})
})

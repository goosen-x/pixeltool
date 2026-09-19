import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { getApplicationCategory } from '@/lib/seo/widget-schemas'
import { widgets, widgetCategories } from '@/lib/constants/widgets'

/**
 * Значения applicationCategory из словаря schema.org. Список закрытый:
 * значения вне его поисковик игнорирует молча, без предупреждений.
 */
const SCHEMA_ORG_VALUES = new Set([
	'BusinessApplication',
	'DesignApplication',
	'DeveloperApplication',
	'DriverApplication',
	'EducationalApplication',
	'EntertainmentApplication',
	'FinanceApplication',
	'GameApplication',
	'HealthApplication',
	'HomeApplication',
	'LifestyleApplication',
	'MultimediaApplication',
	'MedicalApplication',
	'ReferenceApplication',
	'SecurityApplication',
	'SocialNetworkingApplication',
	'SportsApplication',
	'TravelApplication',
	'UtilitiesApplication',
	'VideoApplication'
])

describe('getApplicationCategory', () => {
	it('у каждой категории виджетов значение из словаря schema.org', () => {
		for (const category of Object.keys(widgetCategories)) {
			expect(SCHEMA_ORG_VALUES).toContain(getApplicationCategory(category))
		}
	})

	it('каждый инструмент получает валидное значение', () => {
		for (const widget of widgets) {
			expect(SCHEMA_ORG_VALUES).toContain(getApplicationCategory(widget.category))
		}
	})

	it('разработке достаётся DeveloperApplication, остальным — нет', () => {
		expect(getApplicationCategory('development')).toBe('DeveloperApplication')
		expect(getApplicationCategory('generators')).toBe('UtilitiesApplication')
		expect(getApplicationCategory('finance')).toBe('FinanceApplication')
		expect(getApplicationCategory('esoteric')).toBe('LifestyleApplication')
	})
})

/**
 * Значение стояло захардкоженным в пяти местах сразу: на странице тула, в
 * каталоге, на главной (дважды) и в шести шаблонах SEO-подстраниц. Из-за
 * этого Google подписывал «Рандомайзер» как «Инструменты разработки», а
 * несуществующее 'UtilityApplication' игнорировал целиком.
 */
describe('разметка не содержит захардкоженных категорий', () => {
	function collectSources(dir: string, acc: string[] = []): string[] {
		for (const entry of readdirSync(dir)) {
			if (entry === 'node_modules' || entry.startsWith('.')) continue
			const full = join(dir, entry)
			if (statSync(full).isDirectory()) collectSources(full, acc)
			else if (/\.tsx?$/.test(entry)) acc.push(full)
		}
		return acc
	}

	it('нигде не осталось несуществующего UtilityApplication', () => {
		const offenders = [...collectSources('app'), ...collectSources('components')]
			.filter(file => {
				const body = readFileSync(file, 'utf-8')
				// Исключаем строки-комментарии: в них значение упоминается как
				// объяснение, почему так делать нельзя.
				return body
					.split('\n')
					.some(
						line =>
							line.includes("'UtilityApplication'") &&
							!line.trimStart().startsWith('//') &&
							!line.trimStart().startsWith('*')
					)
			})
		expect(offenders).toEqual([])
	})
})

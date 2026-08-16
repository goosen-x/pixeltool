import { describe, it, expect } from 'vitest'
import { textToAscii } from '@/lib/utils/ascii-converter'

describe('textToAscii — шрифт block', () => {
	it('рисует те же контуры, что standard, но сплошным блоком', () => {
		const standard = textToAscii('A', 'standard')
		const block = textToAscii('A', 'block')

		// Пробелы (форма буквы) должны совпадать построчно...
		const standardShape = standard
			.split('\n')
			.map(line => line.replace(/[^ ]/g, 'X'))
		const blockShape = block.split('\n').map(line => line.replace(/[^ ]/g, 'X'))
		expect(blockShape).toEqual(standardShape)

		// ...а все не-пробельные символы — быть блоком █, а не буквой A.
		expect(block).not.toContain('A')
		expect(block).toContain('█')
	})

	it('работает для кириллицы так же, как для латиницы', () => {
		const block = textToAscii('Ж', 'block')
		expect(block).toContain('█')
		expect(block).not.toContain('Ж')
	})

	it('неизвестные шрифты откатываются на standard', () => {
		// @ts-expect-error проверяем рантайм-фоллбэк на некорректном значении
		expect(textToAscii('A', 'nonsense')).toBe(textToAscii('A', 'standard'))
	})
})

import { describe, expect, it } from 'vitest'
import { checkJsSyntax } from '@/lib/js-syntax-check'

describe('checkJsSyntax', () => {
	it('принимает import/export, разбирая код как модуль', () => {
		const r = checkJsSyntax(
			`export const sum = (a, b) => a + b;\nimport { x } from './utils.js';`
		)
		expect(r.valid).toBe(true)
		expect(r.module).toBe(true)
		expect(r.stats).toMatchObject({ imports: 1, exports: 1, functions: 1 })
	})

	it('принимает await на верхнем уровне', () => {
		expect(checkJsSyntax(`const r = await fetch('/x')`).valid).toBe(true)
	})

	it('понимает JSX', () => {
		expect(
			checkJsSyntax(`const A = () => <div className="a">{x}</div>`).valid
		).toBe(true)
		const r = checkJsSyntax(`const A = <div>hi</span>`)
		expect(r.valid).toBe(false)
		expect(r.error?.message).toMatch(/Закрывающий тег/)
	})

	it('даёт реальную строку и столбец ошибки и подсказку про скобку', () => {
		const r = checkJsSyntax(
			`function broken() {\n  const x = 10\n  if (x > 5 {\n  }\n}`
		)
		expect(r.valid).toBe(false)
		expect(r.error).toMatchObject({ line: 3, column: 13 })
		expect(r.error?.hint).toMatch(/круглая скобка/)
	})

	it('ловит незакрытую строку и обрыв кода', () => {
		expect(checkJsSyntax(`const s = 'abc\nconst b = 2`).error?.message).toMatch(
			/Строка не закрыта/
		)
		expect(checkJsSyntax(`function f() {`).error?.hint).toMatch(/оборвался/)
	})

	it('подсказывает опечатку в ключевом слове', () => {
		expect(checkJsSyntax('fucntion f() {}').error?.hint).toMatch(/«function»/)
	})

	it('ловит return вне функции и повторное объявление', () => {
		expect(checkJsSyntax('return 5').valid).toBe(false)
		expect(checkJsSyntax('let a = 1; let a = 2;').error?.message).toMatch(
			/уже объявлена/
		)
	})

	it('в режиме ES5 отклоняет const и подсказывает выбрать Latest', () => {
		const r = checkJsSyntax('const a = () => 1', 'es5')
		expect(r.valid).toBe(false)
		expect(r.error?.hint).toMatch(/Latest/)
		expect(checkJsSyntax('a?.b ?? c', 'es6').valid).toBe(false)
		expect(checkJsSyntax('a?.b ?? c', 'es2020').valid).toBe(true)
	})

	it('предупреждает по токенам, не по тексту в строках', () => {
		expect(
			checkJsSyntax(`const s = "console.log var x == 1"`).warnings
		).toEqual([])
		const w = checkJsSyntax(
			`var a = 1; if (a == 1) console.log(a); a === 1`
		).warnings
		expect(w).toHaveLength(3)
	})

	it('предупреждения работают и в коде с JSX', () => {
		expect(checkJsSyntax(`var A = <b>{x}</b>`).warnings).toHaveLength(1)
	})
})

describe('текст ошибки', () => {
	it('называет неожиданный символ', () => {
		expect(checkJsSyntax('if (x > 5 {}').error?.message).toBe(
			'Неожиданный символ «{»'
		)
		expect(checkJsSyntax('a = 1 +').error?.message).toBe(
			'Код неожиданно закончился'
		)
	})
})

describe('пример «ES6 модули» со страницы', () => {
	it('проходит проверку', () => {
		const code = `import { sum, multiply } from './math.js';\n\nexport const total = (items) => items.reduce(sum, 0);\nexport default function double(x) {\n  return multiply(x, 2);\n}`
		expect(checkJsSyntax(code, 'es6').valid).toBe(true)
	})
})

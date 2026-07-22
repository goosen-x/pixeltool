import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../use-local-storage'

describe('useLocalStorage', () => {
	beforeEach(() => {
		// Clear localStorage before each test
		window.localStorage.clear()
		// Clear console mocks
		vi.clearAllMocks()
	})

	afterEach(() => {
		// Clean up after each test
		window.localStorage.clear()
	})

	it('returns initial value when localStorage is empty', () => {
		const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

		expect(result.current[0]).toBe('initial')
	})

	it('returns value from localStorage if it exists', () => {
		window.localStorage.setItem('existing-key', JSON.stringify('stored value'))

		const { result } = renderHook(() =>
			useLocalStorage('existing-key', 'initial')
		)

		expect(result.current[0]).toBe('stored value')
	})

	it('updates localStorage when value changes', () => {
		const { result } = renderHook(() =>
			useLocalStorage('update-key', 'initial')
		)

		act(() => {
			result.current[1]('updated value')
		})

		expect(result.current[0]).toBe('updated value')
		expect(window.localStorage.getItem('update-key')).toBe('"updated value"')
	})

	it('handles function updates', () => {
		const { result } = renderHook(() => useLocalStorage('counter', 0))

		act(() => {
			result.current[1](prev => prev + 1)
		})

		expect(result.current[0]).toBe(1)

		act(() => {
			result.current[1](prev => prev + 1)
		})

		expect(result.current[0]).toBe(2)
		expect(window.localStorage.getItem('counter')).toBe('2')
	})

	it('works with complex objects', () => {
		const complexObject = {
			name: 'John',
			age: 30,
			hobbies: ['reading', 'coding']
		}
		const { result } = renderHook(() =>
			useLocalStorage('complex', complexObject)
		)

		expect(result.current[0]).toEqual(complexObject)

		act(() => {
			result.current[1]({ ...complexObject, age: 31 })
		})

		expect(result.current[0]).toEqual({ ...complexObject, age: 31 })
		expect(JSON.parse(window.localStorage.getItem('complex') || '{}')).toEqual({
			...complexObject,
			age: 31
		})
	})

	it('handles localStorage errors gracefully', () => {
		const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

		// jsdom's Storage is backed by a Proxy that intercepts all property
		// access, so assigning `window.localStorage.setItem = vi.fn()` directly
		// doesn't actually override the method (the assignment is swallowed by
		// the proxy instead of shadowing it). Spying on the prototype method
		// does override real calls made through `window.localStorage.setItem`.
		const setItemSpy = vi
			.spyOn(Storage.prototype, 'setItem')
			.mockImplementation(() => {
				throw new Error('Storage error')
			})

		const { result } = renderHook(() => useLocalStorage('error-key', 'initial'))

		act(() => {
			result.current[1]('new value')
		})

		// Value should still update in state even if localStorage fails
		expect(result.current[0]).toBe('new value')
		expect(consoleSpy).toHaveBeenCalledWith(
			'Error setting localStorage key "error-key":',
			expect.any(Error)
		)

		setItemSpy.mockRestore()
		consoleSpy.mockRestore()
	})

	it('handles invalid JSON in localStorage', () => {
		const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

		// Set invalid JSON
		window.localStorage.setItem('invalid-json', 'not valid json')

		const { result } = renderHook(() =>
			useLocalStorage('invalid-json', 'fallback')
		)

		// Should return the initial value when JSON parsing fails
		expect(result.current[0]).toBe('fallback')
		expect(consoleSpy).toHaveBeenCalledWith(
			'Error reading localStorage key "invalid-json":',
			expect.any(Error)
		)

		consoleSpy.mockRestore()
	})

	// Не удаляем global.window целиком: React DOM 19 читает `window` при
	// планировании обновлений ещё до рендера нашего компонента (падает внутри
	// react-dom, а не в хуке), так что рендер через RTL в jsdom в принципе
	// невозможен без window. Реальный SSR-путь хука (`typeof window ===
	// 'undefined'`) здесь недостижим — вместо этого проверяем эквивалентный по
	// внешнему контракту случай «чтение из storage недоступно», для которого
	// хук проходит через тот же try/catch и возвращает initialValue.
	it('returns initial value when localStorage is unavailable', () => {
		const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
		const getItemSpy = vi
			.spyOn(Storage.prototype, 'getItem')
			.mockImplementation(() => {
				throw new Error('localStorage unavailable')
			})

		const { result } = renderHook(() =>
			useLocalStorage('ssr-key', 'ssr-initial')
		)

		expect(result.current[0]).toBe('ssr-initial')

		getItemSpy.mockRestore()
		consoleSpy.mockRestore()
	})
})

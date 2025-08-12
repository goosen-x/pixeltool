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
    
    const { result } = renderHook(() => useLocalStorage('existing-key', 'initial'))
    
    expect(result.current[0]).toBe('stored value')
  })

  it('updates localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('update-key', 'initial'))
    
    act(() => {
      result.current[1]('updated value')
    })
    
    expect(result.current[0]).toBe('updated value')
    expect(window.localStorage.getItem('update-key')).toBe('"updated value"')
  })

  it('handles function updates', () => {
    const { result } = renderHook(() => useLocalStorage('counter', 0))
    
    act(() => {
      result.current[1]((prev) => prev + 1)
    })
    
    expect(result.current[0]).toBe(1)
    
    act(() => {
      result.current[1]((prev) => prev + 1)
    })
    
    expect(result.current[0]).toBe(2)
    expect(window.localStorage.getItem('counter')).toBe('2')
  })

  it('works with complex objects', () => {
    const complexObject = { name: 'John', age: 30, hobbies: ['reading', 'coding'] }
    const { result } = renderHook(() => useLocalStorage('complex', complexObject))
    
    expect(result.current[0]).toEqual(complexObject)
    
    act(() => {
      result.current[1]({ ...complexObject, age: 31 })
    })
    
    expect(result.current[0]).toEqual({ ...complexObject, age: 31 })
    expect(JSON.parse(window.localStorage.getItem('complex') || '{}')).toEqual({
      ...complexObject,
      age: 31,
    })
  })

  it('handles localStorage errors gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    
    // Mock localStorage to throw an error
    const originalSetItem = window.localStorage.setItem
    window.localStorage.setItem = vi.fn(() => {
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
    
    // Restore original localStorage
    window.localStorage.setItem = originalSetItem
    consoleSpy.mockRestore()
  })

  it('handles invalid JSON in localStorage', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    
    // Set invalid JSON
    window.localStorage.setItem('invalid-json', 'not valid json')
    
    const { result } = renderHook(() => useLocalStorage('invalid-json', 'fallback'))
    
    // Should return the initial value when JSON parsing fails
    expect(result.current[0]).toBe('fallback')
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error reading localStorage key "invalid-json":',
      expect.any(Error)
    )
    
    consoleSpy.mockRestore()
  })

  it('returns initial value when window is undefined (SSR)', () => {
    const originalWindow = global.window
    // @ts-ignore
    delete global.window
    
    const { result } = renderHook(() => useLocalStorage('ssr-key', 'ssr-initial'))
    
    expect(result.current[0]).toBe('ssr-initial')
    
    // Restore window
    global.window = originalWindow
  })
})
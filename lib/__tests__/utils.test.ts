import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('cn utility', () => {
	it('merges class names correctly', () => {
		expect(cn('foo', 'bar')).toBe('foo bar')
		expect(cn('foo bar', 'baz')).toBe('foo bar baz')
	})

	it('handles conditional classes', () => {
		expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
		expect(cn('foo', true && 'bar', 'baz')).toBe('foo bar baz')
		expect(cn('foo', undefined, 'baz')).toBe('foo baz')
		expect(cn('foo', null, 'baz')).toBe('foo baz')
	})

	it('handles arrays', () => {
		expect(cn(['foo', 'bar'])).toBe('foo bar')
		expect(cn('foo', ['bar', 'baz'])).toBe('foo bar baz')
	})

	it('handles objects', () => {
		expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz')
		expect(cn('base', { active: true, disabled: false })).toBe('base active')
	})

	it('merges Tailwind classes correctly', () => {
		expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
		expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
		expect(cn('hover:bg-red-500', 'hover:bg-blue-500')).toBe(
			'hover:bg-blue-500'
		)
	})

	it('handles empty inputs', () => {
		expect(cn()).toBe('')
		expect(cn('')).toBe('')
		expect(cn('', '')).toBe('')
	})

	it('trims whitespace', () => {
		expect(cn('  foo  ', '  bar  ')).toBe('foo bar')
		expect(cn('foo  bar', 'baz')).toBe('foo bar baz')
	})

	it('handles complex scenarios', () => {
		const result = cn(
			'base-class',
			'override-class',
			{
				'conditional-true': true,
				'conditional-false': false
			},
			['array-class-1', 'array-class-2'],
			undefined,
			null,
			false && 'should-not-appear',
			true && 'should-appear'
		)

		expect(result).toBe(
			'base-class override-class conditional-true array-class-1 array-class-2 should-appear'
		)
	})
})

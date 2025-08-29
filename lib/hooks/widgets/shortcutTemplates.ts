import { KeyboardShortcut } from '../useWidgetKeyboard'

// Action interfaces for different widget types
export interface CalculatorActions {
	calculate: () => void
	copy: () => void
	reset: () => void
	loadExample?: () => void
}

export interface ConverterActions {
	convert: () => void
	swap?: () => void
	copy: () => void
	reset: () => void
}

export interface GeneratorActions {
	generate: () => void
	regenerate?: () => void
	copy: () => void
	download?: () => void
	reset?: () => void
}

export interface EditorActions {
	format?: () => void
	validate?: () => void
	copy: () => void
	clear: () => void
	save?: () => void
}

// Template creators for different widget types
export const createCalculatorShortcuts = (
	actions: CalculatorActions
): KeyboardShortcut[] => [
	{
		key: 'Enter',
		ctrl: true,
		description: 'Calculate',
		action: actions.calculate
	},
	{
		key: 'c',
		ctrl: true,
		shift: true,
		description: 'Copy result',
		action: actions.copy
	},
	{
		key: 'r',
		ctrl: true,
		shift: true,
		description: 'Reset form',
		action: actions.reset
	},
	...(actions.loadExample
		? [
				{
					key: 'e',
					ctrl: true,
					description: 'Load example',
					action: actions.loadExample
				}
			]
		: [])
]

export const createConverterShortcuts = (
	actions: ConverterActions
): KeyboardShortcut[] => [
	{
		key: 'Enter',
		ctrl: true,
		description: 'Convert',
		action: actions.convert
	},
	...(actions.swap
		? [
				{
					key: 's',
					ctrl: true,
					description: 'Swap units',
					action: actions.swap
				}
			]
		: []),
	{
		key: 'c',
		ctrl: true,
		shift: true,
		description: 'Copy result',
		action: actions.copy
	},
	{
		key: 'r',
		ctrl: true,
		shift: true,
		description: 'Reset',
		action: actions.reset
	}
]

export const createGeneratorShortcuts = (
	actions: GeneratorActions
): KeyboardShortcut[] => [
	{
		key: 'g',
		ctrl: true,
		description: 'Generate',
		action: actions.generate
	},
	...(actions.regenerate
		? [
				{
					key: 'r',
					ctrl: true,
					description: 'Regenerate',
					action: actions.regenerate
				}
			]
		: []),
	{
		key: 'c',
		ctrl: true,
		shift: true,
		description: 'Copy',
		action: actions.copy
	},
	...(actions.download
		? [
				{
					key: 'd',
					ctrl: true,
					description: 'Download',
					action: actions.download
				}
			]
		: []),
	...(actions.reset
		? [
				{
					key: 'k',
					ctrl: true,
					description: 'Clear',
					action: actions.reset
				}
			]
		: [])
]

export const createEditorShortcuts = (
	actions: EditorActions
): KeyboardShortcut[] => [
	...(actions.format
		? [
				{
					key: 'f',
					primary: true,
					shift: true,
					description: 'Format',
					action: actions.format
				}
			]
		: []),
	...(actions.validate
		? [
				{
					key: 'Enter',
					ctrl: true,
					description: 'Validate',
					action: actions.validate
				}
			]
		: []),
	{
		key: 'c',
		ctrl: true,
		shift: true,
		description: 'Copy',
		action: actions.copy
	},
	{
		key: 'k',
		ctrl: true,
		description: 'Clear',
		action: actions.clear
	},
	...(actions.save
		? [
				{
					key: 's',
					ctrl: true,
					description: 'Save',
					action: actions.save
				}
			]
		: [])
]

// Utility shortcuts for simple widgets
export const createSimpleShortcuts = (
	primaryAction: () => void,
	copyAction: () => void,
	resetAction?: () => void
): KeyboardShortcut[] => [
	{
		key: 'Enter',
		ctrl: true,
		description: 'Execute',
		action: primaryAction
	},
	{
		key: 'c',
		ctrl: true,
		shift: true,
		description: 'Copy result',
		action: copyAction
	},
	...(resetAction
		? [
				{
					key: 'r',
					ctrl: true,
					shift: true,
					description: 'Reset',
					action: resetAction
				}
			]
		: [])
]

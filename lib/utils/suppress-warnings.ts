// Temporary suppression of React 19 ref deprecation warnings
// This can be removed once Radix UI and other libraries are updated for React 19

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
	const originalError = console.error
	console.error = (...args) => {
		if (
			args[0] &&
			typeof args[0] === 'string' &&
			args[0].includes('Accessing element.ref was removed in React 19')
		) {
			// Suppress this specific warning
			return
		}
		originalError.apply(console, args)
	}
}

export {}

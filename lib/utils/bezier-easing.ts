// Bezier curve utilities for easing functions

export interface Point {
	x: number
	y: number
}

export interface BezierCurve {
	p1: Point
	p2: Point
}

// Newton's method for finding roots
const NEWTON_ITERATIONS = 4
const NEWTON_MIN_SLOPE = 0.001
const SUBDIVISION_PRECISION = 0.0000001
const SUBDIVISION_MAX_ITERATIONS = 10

// Sample table size
const SAMPLE_TABLE_SIZE = 11

// Calculate bezier value at time t
function calcBezier(t: number, a: number, b: number): number {
	return (((1 - 3 * b + 3 * a) * t + (3 * b - 6 * a)) * t + 3 * a) * t
}

// Calculate bezier derivative at time t
function getSlope(t: number, a: number, b: number): number {
	return 3 * (1 - 3 * b + 3 * a) * t * t + 2 * (3 * b - 6 * a) * t + 3 * a
}

// Binary subdivision for finding t
function binarySubdivide(x: number, a: number, b: number): number {
	let currentX: number
	let currentT: number
	let i = 0
	let t = x

	do {
		currentT = a + (b - a) / 2
		currentX = calcBezier(currentT, a, b) - x
		if (currentX > 0) {
			b = currentT
		} else {
			a = currentT
		}
		t = currentT
	} while (
		Math.abs(currentX) > SUBDIVISION_PRECISION &&
		++i < SUBDIVISION_MAX_ITERATIONS
	)

	return t
}

// Create sample table for performance
function createSampleTable(x1: number, x2: number): Float32Array {
	const sampleTable = new Float32Array(SAMPLE_TABLE_SIZE)

	for (let i = 0; i < SAMPLE_TABLE_SIZE; ++i) {
		sampleTable[i] = calcBezier(i / (SAMPLE_TABLE_SIZE - 1), x1, x2)
	}

	return sampleTable
}

// Get T for X using Newton-Raphson
function getTForX(
	x: number,
	x1: number,
	x2: number,
	sampleTable: Float32Array
): number {
	let intervalStart = 0
	let currentSample = 1

	// Find interval
	for (
		;
		currentSample !== SAMPLE_TABLE_SIZE - 1 && sampleTable[currentSample] <= x;
		++currentSample
	) {
		intervalStart += 1 / (SAMPLE_TABLE_SIZE - 1)
	}
	--currentSample

	// Interpolate
	const dist =
		(x - sampleTable[currentSample]) /
		(sampleTable[currentSample + 1] - sampleTable[currentSample])
	let guessForT = intervalStart + dist / (SAMPLE_TABLE_SIZE - 1)

	const initialSlope = getSlope(guessForT, x1, x2)

	// Use Newton-Raphson if slope is good
	if (initialSlope >= NEWTON_MIN_SLOPE) {
		for (let i = 0; i < NEWTON_ITERATIONS; ++i) {
			const currentSlope = getSlope(guessForT, x1, x2)
			if (currentSlope === 0) return guessForT

			const currentX = calcBezier(guessForT, x1, x2) - x
			guessForT -= currentX / currentSlope
		}
	} else if (initialSlope === 0) {
		return guessForT
	} else {
		// Fallback to binary subdivision
		guessForT = binarySubdivide(
			x,
			intervalStart,
			intervalStart + 1 / (SAMPLE_TABLE_SIZE - 1)
		)
	}

	return guessForT
}

// Create bezier easing function
export function createBezierEasing(
	x1: number,
	y1: number,
	x2: number,
	y2: number
) {
	// Pre-calculate sample table
	const sampleTable = createSampleTable(x1, x2)

	// Return easing function
	return function (t: number): number {
		if (t === 0) return 0
		if (t === 1) return 1

		return calcBezier(getTForX(t, x1, x2, sampleTable), y1, y2)
	}
}

// Generate points for curve visualization
export function generateCurvePoints(
	curve: BezierCurve,
	samples: number = 100
): Point[] {
	const points: Point[] = []
	const easing = createBezierEasing(
		curve.p1.x,
		curve.p1.y,
		curve.p2.x,
		curve.p2.y
	)

	for (let i = 0; i <= samples; i++) {
		const t = i / samples
		points.push({
			x: t,
			y: easing(t)
		})
	}

	return points
}

// Common easing presets
export const EASING_PRESETS = {
	linear: { name: 'Linear', p1: { x: 0, y: 0 }, p2: { x: 1, y: 1 } },
	ease: { name: 'Ease', p1: { x: 0.25, y: 0.1 }, p2: { x: 0.25, y: 1 } },
	easeIn: { name: 'Ease In', p1: { x: 0.42, y: 0 }, p2: { x: 1, y: 1 } },
	easeOut: { name: 'Ease Out', p1: { x: 0, y: 0 }, p2: { x: 0.58, y: 1 } },
	easeInOut: {
		name: 'Ease In Out',
		p1: { x: 0.42, y: 0 },
		p2: { x: 0.58, y: 1 }
	},
	easeInSine: {
		name: 'Ease In Sine',
		p1: { x: 0.12, y: 0 },
		p2: { x: 0.39, y: 0 }
	},
	easeOutSine: {
		name: 'Ease Out Sine',
		p1: { x: 0.61, y: 1 },
		p2: { x: 0.88, y: 1 }
	},
	easeInOutSine: {
		name: 'Ease In Out Sine',
		p1: { x: 0.37, y: 0 },
		p2: { x: 0.63, y: 1 }
	},
	easeInQuad: {
		name: 'Ease In Quad',
		p1: { x: 0.11, y: 0 },
		p2: { x: 0.5, y: 0 }
	},
	easeOutQuad: {
		name: 'Ease Out Quad',
		p1: { x: 0.5, y: 1 },
		p2: { x: 0.89, y: 1 }
	},
	easeInOutQuad: {
		name: 'Ease In Out Quad',
		p1: { x: 0.45, y: 0 },
		p2: { x: 0.55, y: 1 }
	},
	easeInCubic: {
		name: 'Ease In Cubic',
		p1: { x: 0.32, y: 0 },
		p2: { x: 0.67, y: 0 }
	},
	easeOutCubic: {
		name: 'Ease Out Cubic',
		p1: { x: 0.33, y: 1 },
		p2: { x: 0.68, y: 1 }
	},
	easeInOutCubic: {
		name: 'Ease In Out Cubic',
		p1: { x: 0.65, y: 0 },
		p2: { x: 0.35, y: 1 }
	},
	easeInQuart: {
		name: 'Ease In Quart',
		p1: { x: 0.5, y: 0 },
		p2: { x: 0.75, y: 0 }
	},
	easeOutQuart: {
		name: 'Ease Out Quart',
		p1: { x: 0.25, y: 1 },
		p2: { x: 0.5, y: 1 }
	},
	easeInOutQuart: {
		name: 'Ease In Out Quart',
		p1: { x: 0.76, y: 0 },
		p2: { x: 0.24, y: 1 }
	},
	easeInQuint: {
		name: 'Ease In Quint',
		p1: { x: 0.64, y: 0 },
		p2: { x: 0.78, y: 0 }
	},
	easeOutQuint: {
		name: 'Ease Out Quint',
		p1: { x: 0.22, y: 1 },
		p2: { x: 0.36, y: 1 }
	},
	easeInOutQuint: {
		name: 'Ease In Out Quint',
		p1: { x: 0.83, y: 0 },
		p2: { x: 0.17, y: 1 }
	},
	easeInExpo: {
		name: 'Ease In Expo',
		p1: { x: 0.7, y: 0 },
		p2: { x: 0.84, y: 0 }
	},
	easeOutExpo: {
		name: 'Ease Out Expo',
		p1: { x: 0.16, y: 1 },
		p2: { x: 0.3, y: 1 }
	},
	easeInOutExpo: {
		name: 'Ease In Out Expo',
		p1: { x: 0.87, y: 0 },
		p2: { x: 0.13, y: 1 }
	},
	easeInCirc: {
		name: 'Ease In Circ',
		p1: { x: 0.55, y: 0 },
		p2: { x: 1, y: 0.45 }
	},
	easeOutCirc: {
		name: 'Ease Out Circ',
		p1: { x: 0, y: 0.55 },
		p2: { x: 0.45, y: 1 }
	},
	easeInOutCirc: {
		name: 'Ease In Out Circ',
		p1: { x: 0.85, y: 0 },
		p2: { x: 0.15, y: 1 }
	},
	easeInBack: {
		name: 'Ease In Back',
		p1: { x: 0.36, y: 0 },
		p2: { x: 0.66, y: -0.56 }
	},
	easeOutBack: {
		name: 'Ease Out Back',
		p1: { x: 0.34, y: 1.56 },
		p2: { x: 0.64, y: 1 }
	},
	easeInOutBack: {
		name: 'Ease In Out Back',
		p1: { x: 0.68, y: -0.6 },
		p2: { x: 0.32, y: 1.6 }
	}
}

// Format bezier curve for CSS
export function formatCubicBezier(curve: BezierCurve): string {
	return `cubic-bezier(${curve.p1.x.toFixed(2)}, ${curve.p1.y.toFixed(2)}, ${curve.p2.x.toFixed(2)}, ${curve.p2.y.toFixed(2)})`
}

// Parse cubic-bezier string
export function parseCubicBezier(str: string): BezierCurve | null {
	const match = str.match(
		/cubic-bezier\s*\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^)]+)\s*\)/
	)
	if (!match) return null

	return {
		p1: { x: parseFloat(match[1]), y: parseFloat(match[2]) },
		p2: { x: parseFloat(match[3]), y: parseFloat(match[4]) }
	}
}

// Get SVG path for bezier curve
export function getBezierPath(
	width: number,
	height: number,
	curve: BezierCurve
): string {
	const startX = 0
	const startY = height
	const endX = width
	const endY = 0

	const cp1X = curve.p1.x * width
	const cp1Y = height - curve.p1.y * height
	const cp2X = curve.p2.x * width
	const cp2Y = height - curve.p2.y * height

	return `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`
}

// Get handle positions for curve editor
export function getHandlePositions(
	width: number,
	height: number,
	curve: BezierCurve
) {
	return {
		p1: {
			x: curve.p1.x * width,
			y: height - curve.p1.y * height
		},
		p2: {
			x: curve.p2.x * width,
			y: height - curve.p2.y * height
		}
	}
}

// Update curve from handle position
export function updateCurveFromHandle(
	handleName: 'p1' | 'p2',
	x: number,
	y: number,
	width: number,
	height: number,
	curve: BezierCurve
): BezierCurve {
	const normalizedX = Math.max(0, Math.min(1, x / width))
	const normalizedY = Math.max(-2, Math.min(2, 1 - y / height))

	return {
		...curve,
		[handleName]: { x: normalizedX, y: normalizedY }
	}
}

export interface Fraction {
	num: number
	den: number
}

function gcd(a: number, b: number): number {
	a = Math.abs(a)
	b = Math.abs(b)
	while (b) {
		;[a, b] = [b, a % b]
	}
	return a || 1
}

/** Знак переносится в числитель, дробь делится на НОД. */
export function simplify(f: Fraction): Fraction {
	if (f.den === 0) return f
	const sign = f.den < 0 ? -1 : 1
	const num = f.num * sign
	const den = f.den * sign
	const divisor = gcd(num, den)
	return { num: num / divisor, den: den / divisor }
}

export function add(a: Fraction, b: Fraction): Fraction {
	return simplify({ num: a.num * b.den + b.num * a.den, den: a.den * b.den })
}

export function subtract(a: Fraction, b: Fraction): Fraction {
	return simplify({ num: a.num * b.den - b.num * a.den, den: a.den * b.den })
}

export function multiply(a: Fraction, b: Fraction): Fraction {
	return simplify({ num: a.num * b.num, den: a.den * b.den })
}

/** null при делении на дробь с числителем 0. */
export function divide(a: Fraction, b: Fraction): Fraction | null {
	if (b.num === 0) return null
	return simplify({ num: a.num * b.den, den: a.den * b.num })
}

export function toDecimal(f: Fraction): number {
	return f.num / f.den
}

/** Целая часть + правильная дробь, для неправильных дробей (|num| >= den). */
export function toMixedNumber(f: Fraction): {
	whole: number
	num: number
	den: number
} {
	const whole = Math.trunc(f.num / f.den)
	const remainder = Math.abs(f.num % f.den)
	return { whole, num: remainder, den: f.den }
}

export function formatFraction(f: Fraction): string {
	return `${f.num}/${f.den}`
}

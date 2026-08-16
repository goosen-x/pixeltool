export function tokenize(text: string): string[] {
	return (
		text
			.toLowerCase()
			.replace(/ё/g, 'е')
			.match(/[a-zа-я0-9]+/g) ?? []
	)
}

export function jaccardSimilarity(a: string[], b: string[]): number {
	const setA = new Set(a)
	const setB = new Set(b)
	if (setA.size === 0 || setB.size === 0) return 0

	let intersection = 0
	for (const token of setA) {
		if (setB.has(token)) intersection++
	}

	const union = new Set([...setA, ...setB]).size
	return intersection / union
}

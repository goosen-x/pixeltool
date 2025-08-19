import React from 'react'

export function highlightText(text: string, query: string) {
	if (!query.trim()) return text

	const parts = text.split(new RegExp(`(${query})`, 'gi'))

	return (
		<>
			{parts.map((part, index) =>
				part.toLowerCase() === query.toLowerCase() ? (
					<mark
						key={index}
						className='bg-yellow-200 dark:bg-yellow-900 px-0.5 rounded-sm'
					>
						{part}
					</mark>
				) : (
					<span key={index}>{part}</span>
				)
			)}
		</>
	)
}

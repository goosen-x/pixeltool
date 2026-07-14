import React from 'react'

/** В запросе может оказаться «(» или «*» — без экранирования RegExp упадёт. */
function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function highlightText(text: string, query: string) {
	if (!query.trim()) return text

	const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, 'gi'))

	return (
		<>
			{parts.map((part, index) =>
				part.toLowerCase() === query.toLowerCase() ? (
					<mark
						key={index}
						className='rounded-sm bg-blue-100 px-0.5 text-blue-900 dark:bg-blue-500/30 dark:text-blue-100'
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

import '@testing-library/jest-dom'
import { vi } from 'vitest'
import React from 'react'

// Mock next/navigation
vi.mock('next/navigation', () => ({
	useRouter: () => ({
		push: vi.fn(),
		replace: vi.fn(),
		prefetch: vi.fn(),
		back: vi.fn()
	}),
	usePathname: () => '/',
	useSearchParams: () => new URLSearchParams(),
	useParams: () => ({})
}))

// Mock next-intl
vi.mock('next-intl', () => ({
	useTranslations: () => (key: string) => key,
	useLocale: () => 'en'
}))

// Mock next/image
vi.mock('next/image', () => ({
	default: ({ src, alt, ...props }: any) => {
		// eslint-disable-next-line @next/next/no-img-element
		return React.createElement('img', { src, alt, ...props })
	}
}))

// Add custom matchers if needed
global.ResizeObserver = vi.fn().mockImplementation(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn()
}))

/**
 * jsdom не реализует matchMedia, а компоненты шапки читают его в эффектах
 * (тема, брейкпоинты). Без заглушки любой render(<Header />) падает на
 * commitPassiveMountOnFiber, и ошибка выглядит как поломка React, хотя дело
 * в отсутствующем API окружения.
 */
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: (query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn()
	})
})

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn()
}))

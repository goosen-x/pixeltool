import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
	// A list of all locales that are supported
	locales: ['en', 'ru'],

	// Used when no locale matches
	defaultLocale: 'en',

	// Disable locale detection from browser headers
	localeDetection: false
})

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
	createNavigation(routing)

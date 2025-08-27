import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Teacher Programs Admin | Admin Panel',
	description: 'Administrative interface for managing teacher-program assignments',
	robots: 'noindex, nofollow' // Скрыть от поисковых систем
}

export default function AdminLayout({
	children
}: {
	children: React.ReactNode
}) {
	return <>{children}</>
}
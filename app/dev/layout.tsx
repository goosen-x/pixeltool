import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { NOINDEX } from '@/lib/seo/noindex'

// Метаданные layout наследуются всеми страницами ветки, если те не переопределят
// robots своим значением. Страховка на случай новой страницы под /dev, где блок
// robots забыли прописать: раньше он копировался в каждую страницу руками.
export const metadata: Metadata = {
	robots: NOINDEX
}

export default function DevLayout({ children }: { children: ReactNode }) {
	return children
}

import type { Metadata } from 'next'
import {
	GestureLabPage,
	NOINDEX,
	VARIANTS
} from '@/components/dev/GestureLabPage'

const variant = VARIANTS.find(v => v.slug === 'pritsel')!

export const metadata: Metadata = {
	title: `${variant.title} — стенд пипетки`,
	robots: NOINDEX
}

export default function Page() {
	return <GestureLabPage slug='pritsel' />
}

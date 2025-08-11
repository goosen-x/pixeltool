import Header from '@/components/global/Header'
import { Footer } from '@/components/layout'
import { ReactNode } from 'react'

type Props = {
	children: ReactNode
	params: Promise<{ locale: string }>
}

export default async function MainLayout({ children, params }: Props) {
	const locale = (await params).locale

	return (
		<>
			<Header />
			{children}
			<Footer />
		</>
	)
}
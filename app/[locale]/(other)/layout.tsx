import Header from '@/components/global/Header'
import { Footer } from '@/components/layout'
import { ReactNode } from 'react'

type Props = {
	children: ReactNode
	params: Promise<{ locale: string }>
}

export default async function OtherLayout({ children, params }: Props) {
	const locale = (await params).locale

	return (
		<main className='min-h-screen w-full'>
			<Header />
			{children}
			<Footer />
		</main>
	)
}

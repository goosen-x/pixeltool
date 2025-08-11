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
		<main className='h-screen w-full flex flex-col'>
			<Header />
			<div className='flex-1 overflow-hidden'>
				{children}
			</div>
		</main>
	)
}

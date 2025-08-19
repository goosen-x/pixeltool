import { ReactNode } from 'react'

interface WidgetWrapperProps {
	children: ReactNode
}

export function WidgetWrapper({ children }: WidgetWrapperProps) {
	return (
		<div className='min-h-screen bg-background'>
			<main className='container mx-auto px-4 py-6 sm:py-8 lg:py-12'>
				<div className='mx-auto max-w-6xl'>{children}</div>
			</main>
		</div>
	)
}

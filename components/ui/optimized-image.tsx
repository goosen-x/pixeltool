'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps extends Omit<ImageProps, 'onLoadingComplete'> {
	fallback?: string
}

export function OptimizedImage({
	className,
	alt,
	fallback = '/images/placeholder.png',
	...props
}: OptimizedImageProps) {
	const [isLoading, setIsLoading] = useState(true)
	const [hasError, setHasError] = useState(false)

	return (
		<div className={cn('relative overflow-hidden', className)}>
			{isLoading && (
				<div className='absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 animate-pulse' />
			)}

			<Image
				{...props}
				alt={alt}
				src={hasError ? fallback : props.src}
				className={cn(
					'transition-opacity duration-300',
					isLoading ? 'opacity-0' : 'opacity-100',
					className
				)}
				onLoad={() => setIsLoading(false)}
				onError={() => {
					setHasError(true)
					setIsLoading(false)
				}}
				loading='lazy'
			/>
		</div>
	)
}

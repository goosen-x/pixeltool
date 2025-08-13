'use client'

import { cn } from '@/lib/utils'

interface RippleLoaderProps {
  className?: string
}

export const RippleLoader = ({ className }: RippleLoaderProps) => {
  return (
    <div className={cn('ripple-loader', className)}>
      <div className="ripple-cell" />
      <div className="ripple-cell d-1" />
      <div className="ripple-cell d-2" />
      <div className="ripple-cell d-3" />
      <div className="ripple-cell d-4" />
      <div className="ripple-cell" />
      <div className="ripple-cell d-1" />
      <div className="ripple-cell d-2" />
      <div className="ripple-cell d-3" />
    </div>
  )
}
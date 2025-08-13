'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

export function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true)
      setProgress(0)
      
      // Simulate progress
      setTimeout(() => setProgress(30), 100)
      setTimeout(() => setProgress(60), 500)
      setTimeout(() => setProgress(90), 1000)
    }

    const handleComplete = () => {
      setProgress(100)
      setTimeout(() => {
        setIsLoading(false)
        setProgress(0)
      }, 200)
    }

    // Start loading immediately when component mounts with a route change
    handleStart()
    
    // Complete after a short delay
    const timer = setTimeout(handleComplete, 1200)
    
    return () => {
      clearTimeout(timer)
      handleComplete()
    }
  }, [pathname, searchParams])

  if (!isLoading && progress === 0) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-0.5 bg-transparent">
      <div 
        className={cn(
          "h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-500 ease-out",
          "shadow-[0_0_20px_rgba(var(--primary),0.6)]",
          "relative overflow-hidden"
        )}
        style={{ 
          width: `${progress}%`,
        }}
      >
        {/* Animated shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer" />
      </div>
    </div>
  )
}
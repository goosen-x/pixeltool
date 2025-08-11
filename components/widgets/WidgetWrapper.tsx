'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { WidgetSkeleton, WidgetSkeletonSimple } from './WidgetSkeleton'

interface WidgetWrapperProps {
  children: React.ReactNode
  simple?: boolean
}

export function WidgetWrapper({ children, simple = false }: WidgetWrapperProps) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [showContent, setShowContent] = useState(true)
  const previousPathRef = useRef(pathname)
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const contentTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Check if we're navigating between different widgets
    const currentWidget = pathname.split('/').pop()
    const previousWidget = previousPathRef.current.split('/').pop()
    
    // Only show loading if navigating between different widgets
    if (currentWidget !== previousWidget && previousWidget !== undefined) {
      // Hide content immediately
      setShowContent(false)
      
      // Show skeleton after a brief delay
      if (contentTimeoutRef.current) {
        clearTimeout(contentTimeoutRef.current)
      }
      
      contentTimeoutRef.current = setTimeout(() => {
        setIsLoading(true)
      }, 100)
      
      // Clear any existing loading timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
      
      // Hide skeleton and show content
      loadingTimeoutRef.current = setTimeout(() => {
        setIsLoading(false)
        setShowContent(true)
      }, 500)
    }
    
    previousPathRef.current = pathname

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
      if (contentTimeoutRef.current) {
        clearTimeout(contentTimeoutRef.current)
      }
    }
  }, [pathname])

  if (isLoading) {
    return simple ? <WidgetSkeletonSimple /> : <WidgetSkeleton />
  }

  if (!showContent) {
    return null
  }

  return (
    <div 
      key={pathname}
      className="widget-fade-in"
    >
      {children}
    </div>
  )
}
'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Copy, Check, Star, StarOff } from 'lucide-react'
import { toast } from 'sonner'

interface CaseCardProps {
  type: string
  title: string
  result: string
  icon?: React.ReactNode
  gradient?: string
  isFavorite?: boolean
  onToggleFavorite?: () => void
  className?: string
}

export function CaseCard({
  type,
  title,
  result,
  icon,
  gradient = 'from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900',
  isFavorite = false,
  onToggleFavorite,
  className
}: CaseCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result)
      setCopied(true)
      toast.success(`Copied ${title}!`)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy')
    }
  }

  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg',
        'border-muted-foreground/20',
        className
      )}
    >
      <div
        className={cn(
          'absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20',
          'bg-gradient-to-br',
          gradient
        )}
      />
      
      <CardContent className='relative p-4'>
        <div className='flex items-start justify-between gap-2 mb-3'>
          <div className='flex items-center gap-2'>
            {icon && (
              <div className='text-muted-foreground'>
                {icon}
              </div>
            )}
            <div>
              <h3 className='font-medium text-sm'>{title}</h3>
              <Badge variant='outline' className='mt-1 text-xs'>
                {type}
              </Badge>
            </div>
          </div>
          
          <div className='flex items-center gap-1'>
            {onToggleFavorite && (
              <Button
                size='icon'
                variant='ghost'
                className='h-8 w-8'
                onClick={onToggleFavorite}
              >
                {isFavorite ? (
                  <Star className='h-4 w-4 fill-current text-yellow-500' />
                ) : (
                  <StarOff className='h-4 w-4' />
                )}
              </Button>
            )}
            
            <Button
              size='icon'
              variant='ghost'
              className={cn(
                'h-8 w-8 transition-colors',
                copied && 'text-green-600 dark:text-green-400'
              )}
              onClick={handleCopy}
            >
              {copied ? (
                <Check className='h-4 w-4' />
              ) : (
                <Copy className='h-4 w-4' />
              )}
            </Button>
          </div>
        </div>
        
        <div className='relative'>
          <code className='block w-full p-3 bg-muted/50 rounded text-sm font-mono overflow-x-auto'>
            {result || <span className='text-muted-foreground italic'>Empty result</span>}
          </code>
        </div>
      </CardContent>
    </Card>
  )
}
'use client'

import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SymbolGridProps {
  symbols: string[]
  onCopySymbol: (symbol: string) => void
  copiedSymbol: string | null
}

export function SymbolGrid({ symbols, onCopySymbol, copiedSymbol }: SymbolGridProps) {
  if (symbols.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <div className="text-6xl mb-4">🔍</div>
        <p className="text-lg font-medium">No symbols found</p>
        <p className="text-sm">Try adjusting your search or category</p>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2 p-4'>
      {symbols.map((symbol, index) => (
        <div key={`${symbol}-${index}`} className='relative group'>
          <Button
            onClick={() => onCopySymbol(symbol)}
            variant={copiedSymbol === symbol ? 'default' : 'ghost'}
            size='lg'
            className={cn(
              'h-12 w-12 p-0 text-2xl hover:scale-110 transition-transform',
              copiedSymbol === symbol && 'ring-2 ring-primary'
            )}
          >
            {symbol}
          </Button>

          {/* Copy feedback */}
          {copiedSymbol === symbol && (
            <div className='absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded z-10'>
              Copied!
            </div>
          )}

          {/* Copy icon on hover */}
          <div className='absolute -top-1 -right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none'>
            <Copy className='h-3 w-3 text-muted-foreground' />
          </div>
        </div>
      ))}
    </div>
  )
}
'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PlatformMockup } from './PlatformMockup'

export type Platform = 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok' | 'all'

interface PlatformConfig {
  id: Platform
  name: string
  icon: string
  color: string
  bgGradient: string
  characterLimit?: number
}

const platforms: PlatformConfig[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📷',
    color: 'text-pink-600',
    bgGradient: 'from-purple-400 to-pink-400',
    characterLimit: 2200
  },
  {
    id: 'facebook', 
    name: 'Facebook',
    icon: '👥',
    color: 'text-blue-600',
    bgGradient: 'from-blue-500 to-blue-600',
    characterLimit: 63206
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: '🐦',
    color: 'text-sky-500',
    bgGradient: 'from-sky-400 to-sky-500',
    characterLimit: 280
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    color: 'text-blue-700',
    bgGradient: 'from-blue-600 to-blue-700',
    characterLimit: 3000
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    color: 'text-pink-500',
    bgGradient: 'from-pink-500 via-red-500 to-yellow-500',
    characterLimit: 2200
  },
  {
    id: 'all',
    name: 'All Platforms',
    icon: '🌐',
    color: 'text-gray-600',
    bgGradient: 'from-gray-400 to-gray-500'
  }
]

interface PlatformSelectorProps {
  selectedPlatform: Platform
  onSelectPlatform: (platform: Platform) => void
  text?: string
  t: (key: string) => string
}

export function PlatformSelector({ 
  selectedPlatform, 
  onSelectPlatform, 
  text = '',
  t 
}: PlatformSelectorProps) {
  const getCharacterStatus = (platform: PlatformConfig, textLength: number) => {
    if (!platform.characterLimit) return null
    
    const isOverLimit = textLength > platform.characterLimit
    const percentage = (textLength / platform.characterLimit) * 100
    
    return {
      count: textLength,
      limit: platform.characterLimit,
      isOverLimit,
      percentage: Math.min(percentage, 100)
    }
  }

  return (
    <div className="space-y-6">
      {/* Platform Selection Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {platforms.map((platform) => {
          const isSelected = selectedPlatform === platform.id
          const textLength = text.length
          const status = getCharacterStatus(platform, textLength)
          
          return (
            <Card 
              key={platform.id}
              className={cn(
                'cursor-pointer transition-all hover:scale-105 hover:shadow-md',
                isSelected 
                  ? 'ring-2 ring-primary border-primary' 
                  : 'border-muted-foreground/20 hover:border-muted-foreground/40'
              )}
              onClick={() => onSelectPlatform(platform.id)}
            >
              <div className="p-4 text-center space-y-2">
                {/* Icon with gradient background */}
                <div className={cn(
                  'w-12 h-12 mx-auto rounded-full flex items-center justify-center text-2xl mb-2',
                  'bg-gradient-to-br',
                  platform.bgGradient
                )}>
                  <span className="filter drop-shadow-sm">
                    {platform.icon}
                  </span>
                </div>
                
                {/* Platform name */}
                <div className={cn(
                  'font-medium text-sm',
                  isSelected ? 'text-primary' : 'text-foreground'
                )}>
                  {t(`platforms.${platform.id === 'all' ? 'allPlatforms' : platform.id}`)}
                </div>
                
                {/* Character limit indicator */}
                {status && (
                  <div className="space-y-1">
                    <div className={cn(
                      'text-xs',
                      status.isOverLimit ? 'text-destructive' : 'text-muted-foreground'
                    )}>
                      {status.count}/{status.limit}
                    </div>
                    <div className="w-full bg-muted rounded-full h-1">
                      <div 
                        className={cn(
                          'h-1 rounded-full transition-all',
                          status.isOverLimit 
                            ? 'bg-destructive' 
                            : status.percentage > 80 
                              ? 'bg-warning' 
                              : 'bg-primary'
                        )}
                        style={{ width: `${status.percentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Selected Platform Preview */}
      {selectedPlatform !== 'all' && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className="text-2xl">
              {platforms.find(p => p.id === selectedPlatform)?.icon}
            </span>
            {t('preview.platformPreview').replace('{platform}', t(`platforms.${selectedPlatform}`))}
          </h3>
          
          <div className="flex justify-center">
            <PlatformMockup 
              platform={selectedPlatform as Exclude<Platform, 'all'>}
              text={text}
              className="shadow-xl"
            />
          </div>
        </div>
      )}

      {/* Multiple Platform Preview for 'all' */}
      {selectedPlatform === 'all' && text && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {t('preview.title')} - {t('platforms.allPlatforms')}
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.slice(0, 5).map((platform) => (
              <div key={platform.id} className="space-y-2">
                <h4 className="font-medium text-center flex items-center justify-center gap-2">
                  <span>{platform.icon}</span>
                  {t(`platforms.${platform.id}`)}
                </h4>
                <PlatformMockup
                  platform={platform.id as Exclude<Platform, 'all'>}
                  text={text}
                  className="mx-auto scale-90"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
'use client'

import { Button } from '@/components/ui/button'
import { 
  Twitter, 
  Facebook, 
  Linkedin, 
  Link2, 
  Mail,
  MessageCircle,
  Share2,
  Check
} from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface ShareData {
  title: string
  description?: string
  url?: string
  hashtags?: string[]
}

interface SocialShareButtonsProps {
  data: ShareData
  className?: string
  variant?: 'default' | 'compact' | 'dropdown'
  showLabels?: boolean
}

export function SocialShareButtons({ 
  data, 
  className,
  variant = 'default',
  showLabels = true 
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  
  // Get current URL if not provided
  const shareUrl = data.url || (typeof window !== 'undefined' ? window.location.href : '')
  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(data.title)
  const encodedDescription = encodeURIComponent(data.description || '')
  const hashtags = data.hashtags?.join(',') || ''

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}${hashtags ? `&hashtags=${hashtags}` : ''}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
  }

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400')
    toast.success(`Opened ${platform} share dialog`)
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success('Link copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.title,
          text: data.description,
          url: shareUrl
        })
        toast.success('Shared successfully!')
      } catch (error) {
        // User cancelled share
        if ((error as Error).name !== 'AbortError') {
          toast.error('Failed to share')
        }
      }
    } else {
      // Fallback to copy link
      handleCopyLink()
    }
  }

  const shareButtons = [
    {
      icon: Twitter,
      label: 'Twitter',
      color: 'hover:text-[#1DA1F2]',
      onClick: () => handleShare('twitter')
    },
    {
      icon: Facebook,
      label: 'Facebook',
      color: 'hover:text-[#1877F2]',
      onClick: () => handleShare('facebook')
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      color: 'hover:text-[#0A66C2]',
      onClick: () => handleShare('linkedin')
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      color: 'hover:text-[#25D366]',
      onClick: () => handleShare('whatsapp')
    },
    {
      icon: copied ? Check : Link2,
      label: copied ? 'Copied!' : 'Copy Link',
      color: copied ? 'text-green-500' : 'hover:text-primary',
      onClick: handleCopyLink
    }
  ]

  if (variant === 'dropdown') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className={className}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {shareButtons.map((button) => (
            <DropdownMenuItem
              key={button.label}
              onClick={button.onClick}
              className={cn("cursor-pointer", button.color)}
            >
              <button.icon className="h-4 w-4 mr-2" />
              {button.label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => handleShare('email')}
            className="cursor-pointer"
          >
            <Mail className="h-4 w-4 mr-2" />
            Email
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {shareButtons.slice(0, 3).map((button) => (
          <Button
            key={button.label}
            variant="ghost"
            size="icon"
            onClick={button.onClick}
            className={cn("h-8 w-8", button.color)}
            title={button.label}
          >
            <button.icon className="h-4 w-4" />
          </Button>
        ))}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNativeShare}
          className="h-8 w-8"
          title="More sharing options"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  // Default variant
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {shareButtons.map((button) => (
        <Button
          key={button.label}
          variant="outline"
          size="sm"
          onClick={button.onClick}
          className={cn("transition-colors", button.color)}
        >
          <button.icon className="h-4 w-4" />
          {showLabels && <span className="ml-2">{button.label}</span>}
        </Button>
      ))}
    </div>
  )
}
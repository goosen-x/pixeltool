'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useEmoji } from '@/lib/hooks/useEmoji'
import { EmojiGrid, EmojiSearch, EmojiInfo } from '@/components/tools/emoji'
import { type CategoryId } from '@/lib/data/emoji-data'

export default function EmojiListPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all' | 'recent'>('all')
  
  const {
    mounted,
    recentEmojis,
    copiedEmoji,
    downloadingEmoji,
    copyEmoji,
    downloadEmojiAsImage,
    getFilteredEmojis,
    clearRecentEmojis,
    emojiCategories
  } = useEmoji()

  // Handle emoji copy with toast notification
  const handleCopyEmoji = async (emoji: string) => {
    const success = await copyEmoji(emoji)
    if (success) {
      toast.success(`Copied ${emoji} to clipboard!`)
    } else {
      toast.error('Failed to copy emoji')
    }
  }

  // Handle emoji download with toast notification
  const handleDownloadEmoji = async (emoji: string) => {
    const success = await downloadEmojiAsImage(emoji)
    if (success) {
      toast.success(`Downloaded ${emoji} as PNG image!`)
    } else {
      toast.error('Failed to download emoji')
    }
  }

  // Get filtered emojis based on search and category
  const filteredEmojis = getFilteredEmojis(searchTerm, selectedCategory)

  // Don't render until mounted (to avoid hydration issues)
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <Card className="animate-pulse h-96" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <h1 className="text-3xl font-bold">Emoji List & Picker</h1>
              <Badge variant="secondary" className="text-sm">
                {emojiCategories.reduce((total, cat) => total + cat.emojis.length, 0)}+ emojis
              </Badge>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse, copy, and download emojis from our comprehensive collection. 
              Perfect for social media, messaging, and web development.
            </p>
          </div>

          {/* Main Card */}
          <Card className="overflow-hidden">
            <EmojiSearch
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              hasRecentEmojis={recentEmojis.length > 0}
              onClearRecentEmojis={clearRecentEmojis}
            />

            {/* Results Count */}
            <div className="px-4 py-2 bg-muted/50 border-b">
              <p className="text-sm text-muted-foreground">
                {selectedCategory === 'recent' ? (
                  `${filteredEmojis.length} recent emoji${filteredEmojis.length !== 1 ? 's' : ''}`
                ) : (
                  `${filteredEmojis.length} emoji${filteredEmojis.length !== 1 ? 's' : ''} found`
                )}
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>

            <EmojiGrid
              emojis={filteredEmojis}
              onCopyEmoji={handleCopyEmoji}
              onDownloadEmoji={handleDownloadEmoji}
              copiedEmoji={copiedEmoji}
              downloadingEmoji={downloadingEmoji}
              searchTerm={searchTerm}
            />
          </Card>

          {/* Info Section */}
          <EmojiInfo />
        </div>
      </div>
    </div>
  )
}
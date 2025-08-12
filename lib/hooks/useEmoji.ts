import { useState, useEffect, useCallback } from 'react'
import { emojiCategories, type CategoryId } from '@/lib/data/emoji-data'

interface UseEmojiProps {
  maxRecentEmojis?: number
}

export function useEmoji({ maxRecentEmojis = 30 }: UseEmojiProps = {}) {
  const [mounted, setMounted] = useState(false)
  const [recentEmojis, setRecentEmojis] = useState<string[]>([])
  const [copiedEmoji, setCopiedEmoji] = useState<string | null>(null)
  const [downloadingEmoji, setDownloadingEmoji] = useState<string | null>(null)

  // Load recent emojis from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentEmojis')
    if (saved) {
      setRecentEmojis(JSON.parse(saved))
    }
    setMounted(true)
  }, [])

  // Save recent emojis to localStorage
  const saveRecentEmojis = useCallback((emojis: string[]) => {
    localStorage.setItem('recentEmojis', JSON.stringify(emojis))
    setRecentEmojis(emojis)
  }, [])

  // Copy emoji to clipboard
  const copyEmoji = useCallback(async (emoji: string) => {
    try {
      await navigator.clipboard.writeText(emoji)
      setCopiedEmoji(emoji)
      
      // Add to recent emojis
      const newRecent = [emoji, ...recentEmojis.filter(e => e !== emoji)]
        .slice(0, maxRecentEmojis)
      saveRecentEmojis(newRecent)
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedEmoji(null), 2000)
      
      return true
    } catch (error) {
      console.error('Failed to copy emoji:', error)
      return false
    }
  }, [recentEmojis, maxRecentEmojis, saveRecentEmojis])

  // Download emoji as PNG image
  const downloadEmojiAsImage = useCallback(async (emoji: string) => {
    setDownloadingEmoji(emoji)
    
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas context not available')

      canvas.width = 256
      canvas.height = 256

      // Set font and draw emoji
      ctx.font = '200px Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(emoji, 128, 128)

      // Convert to blob and download
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Failed to create blob'))
        }, 'image/png')
      })

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `emoji-${emoji}-256x256.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      return true
    } catch (error) {
      console.error('Failed to download emoji:', error)
      return false
    } finally {
      setDownloadingEmoji(null)
    }
  }, [])

  // Filter emojis by search term and category
  const getFilteredEmojis = useCallback((searchTerm: string, selectedCategory: CategoryId | 'all' | 'recent') => {
    if (selectedCategory === 'recent') {
      return searchTerm
        ? recentEmojis.filter(emoji => emoji.includes(searchTerm.toLowerCase()))
        : recentEmojis
    }

    const categoriesToSearch = selectedCategory === 'all' 
      ? emojiCategories 
      : emojiCategories.filter(cat => cat.id === selectedCategory)

    const allEmojis = categoriesToSearch.flatMap(cat => cat.emojis)
    
    return searchTerm
      ? allEmojis.filter(emoji => emoji.includes(searchTerm.toLowerCase()))
      : allEmojis
  }, [recentEmojis])

  // Clear recent emojis
  const clearRecentEmojis = useCallback(() => {
    localStorage.removeItem('recentEmojis')
    setRecentEmojis([])
  }, [])

  return {
    // State
    mounted,
    recentEmojis,
    copiedEmoji,
    downloadingEmoji,
    
    // Actions
    copyEmoji,
    downloadEmojiAsImage,
    getFilteredEmojis,
    clearRecentEmojis,
    
    // Data
    emojiCategories
  }
}
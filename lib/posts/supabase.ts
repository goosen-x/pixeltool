// Blog posts functions using Supabase
import { supabase } from '@/lib/supabase/client'
import { unstable_cache } from 'next/cache'
// Define BlogPost type locally
interface BlogPost {
  id: string
  slug: string
  title: string
  description: string
  content: string
  date: string
  tags: string[]
  image: string | null
  author: string
  read_time: number
  is_published: boolean
  created_at: string
  updated_at: string
}

// Cache configuration
const POSTS_CACHE_TAG = 'posts'
const POST_CACHE_TAG = (slug: string) => `post-${slug}`

// Get all published posts
export const getAllPosts = unstable_cache(
  async (): Promise<BlogPost[]> => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('is_published', true)
      .order('date', { ascending: false })
    
    if (error) {
      console.error('Error fetching posts:', error)
      return []
    }
    
    return data || []
  },
  [POSTS_CACHE_TAG],
  {
    revalidate: 3600, // 1 hour
    tags: [POSTS_CACHE_TAG]
  }
)

// Get single post by slug
export const getPostBySlug = unstable_cache(
  async (slug: string): Promise<BlogPost | null> => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()
    
    if (error) {
      console.error('Error fetching post:', error)
      return null
    }
    
    return data
  },
  ['post-by-slug'],
  {
    revalidate: 3600,
    tags: ['post-by-slug']
  }
)

// Get posts by tag
export const getPostsByTag = unstable_cache(
  async (tag: string): Promise<BlogPost[]> => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('is_published', true)
      .contains('tags', [tag])
      .order('date', { ascending: false })
    
    if (error) {
      console.error('Error fetching posts by tag:', error)
      return []
    }
    
    return data || []
  },
  ['posts-by-tag'],
  {
    revalidate: 3600,
    tags: ['posts-by-tag']
  }
)

// Get recent posts
export const getRecentPosts = unstable_cache(
  async (limit: number = 5): Promise<BlogPost[]> => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('is_published', true)
      .order('date', { ascending: false })
      .limit(limit)
    
    if (error) {
      console.error('Error fetching recent posts:', error)
      return []
    }
    
    return data || []
  },
  ['recent-posts'],
  {
    revalidate: 3600,
    tags: ['recent-posts']
  }
)

// Get all unique tags
export const getAllTags = unstable_cache(
  async (): Promise<string[]> => {
    const { data, error } = await supabase
      .from('posts')
      .select('tags')
      .eq('is_published', true)
    
    if (error) {
      console.error('Error fetching tags:', error)
      return []
    }
    
    const allTags = new Set<string>()
    data?.forEach(post => {
      post.tags?.forEach((tag: string) => allTags.add(tag))
    })
    
    return Array.from(allTags).sort()
  },
  ['all-tags'],
  {
    revalidate: 3600,
    tags: ['all-tags']
  }
)

// Count posts
export const getPostsCount = unstable_cache(
  async (): Promise<number> => {
    const { count, error } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true)
    
    if (error) {
      console.error('Error counting posts:', error)
      return 0
    }
    
    return count || 0
  },
  ['posts-count'],
  {
    revalidate: 3600,
    tags: ['posts-count']
  }
)

// Search posts
export async function searchPosts(query: string): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('is_published', true)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,content.ilike.%${query}%`)
    .order('date', { ascending: false })
  
  if (error) {
    console.error('Error searching posts:', error)
    return []
  }
  
  return data || []
}
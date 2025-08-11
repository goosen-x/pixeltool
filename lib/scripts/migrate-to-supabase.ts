#!/usr/bin/env tsx
import { sql as neonSql } from '@vercel/postgres'
import { supabase } from '@/lib/supabase/client'

async function migrateToSupabase() {
  console.log('🚀 Starting migration from Neon to Supabase...\n')
  
  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('❌ Supabase not configured! Please set environment variables.')
    process.exit(1)
  }
  
  try {
    // 1. Migrate posts
    console.log('📝 Migrating posts...')
    try {
      const posts = await neonSql`SELECT * FROM posts`
      console.log(`Found ${posts.rows.length} posts to migrate`)
      
      for (const post of posts.rows) {
        const { error } = await supabase.from('posts').upsert({
          id: post.id,
          slug: post.slug,
          title: post.title,
          description: post.description,
          content: post.content,
          date: post.date,
          tags: post.tags,
          image: post.image,
          author: post.author,
          read_time: post.read_time,
          is_published: post.is_published,
          created_at: post.created_at,
          updated_at: post.updated_at
        })
        
        if (error) {
          console.error(`Failed to migrate post ${post.slug}:`, error)
        } else {
          console.log(`✅ Migrated post: ${post.slug}`)
        }
      }
    } catch (error) {
      console.log('⚠️  No posts table found in Neon or error accessing it')
    }
    
    // 2. Migrate widgets
    console.log('\n🧩 Migrating widgets...')
    try {
      const widgets = await neonSql`SELECT * FROM widgets`
      console.log(`Found ${widgets.rows.length} widgets to migrate`)
      
      for (const widget of widgets.rows) {
        const { error } = await supabase.from('widgets').upsert({
          id: widget.id,
          slug: widget.slug,
          icon: widget.icon,
          category: widget.category,
          is_new: widget.is_new,
          is_popular: widget.is_popular,
          created_at: widget.created_at,
          updated_at: widget.updated_at
        })
        
        if (error) {
          console.error(`Failed to migrate widget ${widget.id}:`, error)
        } else {
          console.log(`✅ Migrated widget: ${widget.id}`)
        }
      }
    } catch (error) {
      console.log('⚠️  No widgets table found in Neon or error accessing it')
    }
    
    // 3. Migrate widget translations
    console.log('\n🌐 Migrating widget translations...')
    try {
      const translations = await neonSql`SELECT * FROM widget_translations`
      console.log(`Found ${translations.rows.length} translations to migrate`)
      
      for (const trans of translations.rows) {
        const { error } = await supabase.from('widget_translations').upsert({
          widget_id: trans.widget_id,
          locale: trans.locale,
          title: trans.title,
          description: trans.description,
          created_at: trans.created_at,
          updated_at: trans.updated_at
        })
        
        if (error) {
          console.error(`Failed to migrate translation for ${trans.widget_id}:`, error)
        }
      }
      console.log('✅ Translations migrated')
    } catch (error) {
      console.log('⚠️  No widget_translations table found')
    }
    
    // 4. Migrate widget FAQs
    console.log('\n❓ Migrating widget FAQs...')
    try {
      const faqs = await neonSql`SELECT * FROM widget_faqs`
      console.log(`Found ${faqs.rows.length} FAQs to migrate`)
      
      for (const faq of faqs.rows) {
        const { error } = await supabase.from('widget_faqs').insert({
          widget_id: faq.widget_id,
          locale: faq.locale,
          question: faq.question,
          answer: faq.answer,
          sort_order: faq.sort_order,
          created_at: faq.created_at,
          updated_at: faq.updated_at
        })
        
        if (error && !error.message.includes('duplicate')) {
          console.error(`Failed to migrate FAQ:`, error)
        }
      }
      console.log('✅ FAQs migrated')
    } catch (error) {
      console.log('⚠️  No widget_faqs table found')
    }
    
    // 5. Migrate related widgets
    console.log('\n🔗 Migrating widget relations...')
    try {
      const related = await neonSql`SELECT * FROM widget_related`
      console.log(`Found ${related.rows.length} relations to migrate`)
      
      for (const rel of related.rows) {
        const { error } = await supabase.from('widget_related').upsert({
          widget_id: rel.widget_id,
          related_widget_id: rel.related_widget_id,
          created_at: rel.created_at
        })
        
        if (error && !error.message.includes('duplicate')) {
          console.error(`Failed to migrate relation:`, error)
        }
      }
      console.log('✅ Relations migrated')
    } catch (error) {
      console.log('⚠️  No widget_related table found')
    }
    
    // 6. Migrate widget tags
    console.log('\n🏷️  Migrating widget tags...')
    try {
      const tags = await neonSql`SELECT * FROM widget_tags`
      console.log(`Found ${tags.rows.length} tags to migrate`)
      
      for (const tag of tags.rows) {
        const { error } = await supabase.from('widget_tags').upsert({
          widget_id: tag.widget_id,
          tag: tag.tag,
          created_at: tag.created_at
        })
        
        if (error && !error.message.includes('duplicate')) {
          console.error(`Failed to migrate tag:`, error)
        }
      }
      console.log('✅ Tags migrated')
    } catch (error) {
      console.log('⚠️  No widget_tags table found')
    }
    
    console.log('\n🎉 Migration completed!')
    console.log('\nNext steps:')
    console.log('1. Update your .env.local to use Supabase credentials')
    console.log('2. Test your application')
    console.log('3. Once verified, you can disable the Neon database')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
migrateToSupabase()
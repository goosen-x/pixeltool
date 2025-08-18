#!/usr/bin/env tsx
import fs from 'fs'
import path from 'path'

// Load .env.local manually
const envPath = path.join(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')
envContent.split('\n').forEach(line => {
	const [key, value] = line.split('=')
	if (key && value) {
		process.env[key.trim()] = value.trim()
	}
})

import { createClient } from '@supabase/supabase-js'

async function testSupabase() {
	console.log('🧪 Testing Supabase...\n')

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

	const supabase = createClient(supabaseUrl, supabaseKey)

	// Test 1: Check posts
	console.log('📝 Checking posts...')
	const { data: posts, error: postsError } = await supabase
		.from('posts')
		.select('*')
		.order('date', { ascending: false })

	if (postsError) {
		console.error('❌ Error:', postsError)
	} else {
		console.log(`✅ Found ${posts?.length || 0} posts`)
		posts?.forEach(post => {
			console.log(`   - ${post.slug}: ${post.title}`)
		})
	}

	// Test 2: Check widgets
	console.log('\n🧩 Checking widgets...')
	const { data: widgets, error: widgetsError } = await supabase
		.from('widgets')
		.select('*')
		.limit(5)

	if (widgetsError) {
		console.error('❌ Error:', widgetsError)
	} else {
		console.log(`✅ Found ${widgets?.length || 0} widgets`)
	}

	// Test 3: Check if app reads from Supabase
	console.log('\n🔍 Checking app integration...')
	console.log('Environment variables:')
	console.log(
		`NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌'}`
	)
	console.log(
		`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌'}`
	)
	console.log(
		`USE_WIDGET_CONSTANTS: ${process.env.USE_WIDGET_CONSTANTS || 'not set'}`
	)

	console.log('\n✨ Test complete!')

	if (posts && posts.length > 0) {
		console.log(
			'\n✅ Supabase is working! Posts are being read from the database.'
		)
	} else {
		console.log('\n⚠️  No posts found. You may need to:')
		console.log('1. Check if RLS is blocking reads')
		console.log('2. Re-run the migration')
		console.log('3. Check Supabase dashboard')
	}
}

testSupabase()

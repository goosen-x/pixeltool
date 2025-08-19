#!/usr/bin/env tsx
import { isSupabaseConfigured } from '@/lib/db/supabase-adapter'
import { supabase } from '@/lib/supabase/client'

async function verifySupabaseSetup() {
	console.log('🔍 Verifying Supabase Setup\n')

	// Check 1: Environment Variables
	console.log('1️⃣ Environment Variables:')
	const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
	const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
	console.log(
		`   NEXT_PUBLIC_SUPABASE_URL: ${hasUrl ? '✅ Set' : '❌ Missing'}`
	)
	console.log(
		`   NEXT_PUBLIC_SUPABASE_ANON_KEY: ${hasKey ? '✅ Set' : '❌ Missing'}`
	)
	console.log(
		`   Supabase Configured: ${isSupabaseConfigured() ? '✅ Yes' : '❌ No'}`
	)

	if (!isSupabaseConfigured()) {
		console.log(
			'\n❌ Supabase is not configured. Please add the environment variables to .env.local'
		)
		process.exit(1)
	}

	// Check 2: Connection Test
	console.log('\n2️⃣ Connection Test:')
	try {
		const { error } = await supabase.from('posts').select('count').limit(1)
		if (error) {
			if (error.message.includes('relation "posts" does not exist')) {
				console.log('   ⚠️  Tables not created yet - run migration SQL')
			} else {
				console.log(`   ❌ Connection error: ${error.message}`)
			}
		} else {
			console.log('   ✅ Successfully connected to Supabase')
		}
	} catch (error) {
		console.log(`   ❌ Connection failed: ${error}`)
	}

	// Check 3: Table Status
	console.log('\n3️⃣ Table Status:')
	const tables = [
		'posts',
		'widgets',
		'widget_translations',
		'widget_faqs',
		'widget_analytics'
	]

	for (const table of tables) {
		try {
			const { count, error } = await supabase
				.from(table)
				.select('*', { count: 'exact', head: true })

			if (error) {
				console.log(`   ${table}: ❌ Not found`)
			} else {
				console.log(`   ${table}: ✅ Found (${count || 0} records)`)
			}
		} catch {
			console.log(`   ${table}: ❌ Error checking`)
		}
	}

	// Next Steps
	console.log('\n📝 Next Steps:')
	console.log(
		'1. If tables are missing, run the migration SQL in Supabase dashboard'
	)
	console.log(
		'2. If you have data in Neon, run: npx tsx lib/scripts/migrate-to-supabase.ts'
	)
	console.log('3. Test the application: npm run dev')
	console.log(
		'4. Check functionality: npx tsx lib/scripts/test-supabase-functionality.ts'
	)
}

// Run verification
verifySupabaseSetup()

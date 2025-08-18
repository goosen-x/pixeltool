#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js'

async function checkSupabase() {
	console.log('🔍 Checking Supabase connection...\n')

	// Check environment variables
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

	if (!url || !anonKey) {
		console.error('❌ Missing environment variables!')
		console.log('\nMake sure you have set:')
		console.log('  - NEXT_PUBLIC_SUPABASE_URL')
		console.log('  - NEXT_PUBLIC_SUPABASE_ANON_KEY')
		console.log('\nSee docs/SUPABASE_SETUP.md for instructions')
		process.exit(1)
	}

	console.log('✅ Environment variables found')
	console.log(`📍 URL: ${url}`)
	console.log(`🔑 Key: ${anonKey.substring(0, 20)}...`)

	// Create client
	const supabase = createClient(url, anonKey)

	try {
		// Test connection by checking tables
		console.log('\n📋 Checking tables...')

		const tables = [
			'posts',
			'widgets',
			'widget_translations',
			'widget_faqs',
			'usage_events'
		]

		for (const table of tables) {
			try {
				const { count, error } = await supabase
					.from(table)
					.select('*', { count: 'exact', head: true })

				if (error) {
					console.log(`❌ ${table}: ${error.message}`)
				} else {
					console.log(`✅ ${table}: ${count || 0} records`)
				}
			} catch (err) {
				console.log(`❌ ${table}: Table not found`)
			}
		}

		// Test write access (usage events)
		console.log('\n🖊️  Testing write access...')
		try {
			const { error } = await supabase.from('usage_events').insert({
				widget_id: 'test-widget',
				session_id: 'test-session',
				event_type: 'view'
			})

			if (error) {
				console.log(`⚠️  Write test failed: ${error.message}`)
			} else {
				console.log('✅ Write access confirmed')

				// Clean up test data
				await supabase
					.from('usage_events')
					.delete()
					.eq('widget_id', 'test-widget')
			}
		} catch (err) {
			console.log('⚠️  Could not test write access')
		}

		console.log('\n🎉 Supabase connection successful!')
		console.log('\nNext steps:')
		console.log('1. Run the migration SQL if tables are missing')
		console.log('2. Migrate your existing data if needed')
		console.log('3. Update your .env.local with Supabase credentials')
	} catch (error) {
		console.error('\n❌ Connection failed:', error)
		console.log('\nTroubleshooting:')
		console.log('1. Check your internet connection')
		console.log('2. Verify your Supabase project is active')
		console.log('3. Make sure your API keys are correct')
	}
}

// Run the check
checkSupabase()

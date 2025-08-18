# Supabase Migration Checklist

## ✅ Pre-Migration Steps

### 1. Create Supabase Account

- [ ] Go to [supabase.com](https://supabase.com)
- [ ] Sign up / Login
- [ ] Create new project
- [ ] Save database password

### 2. Get Credentials

- [ ] Go to Settings → API
- [ ] Copy `Project URL`
- [ ] Copy `anon public` key
- [ ] Go to Settings → Database
- [ ] Copy connection string

### 3. Update Environment

- [ ] Create/update `.env.local`:

```bash
# Supabase (add these)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Keep Neon for now (don't remove yet)
POSTGRES_URL=...
POSTGRES_URL_NON_POOLING=...
```

## ✅ Migration Steps

### 4. Run Database Schema

- [ ] Open Supabase Dashboard
- [ ] Go to SQL Editor
- [ ] Create new query
- [ ] Paste contents of `lib/supabase/migrations/001_initial_schema.sql`
- [ ] Click Run
- [ ] Verify tables created (check Table Editor)

### 5. Test Connection

```bash
npx tsx lib/scripts/check-supabase.ts
```

- [ ] Connection successful
- [ ] Tables found

### 6. Migrate Data (if you have existing data)

```bash
npx tsx lib/scripts/migrate-to-supabase.ts
```

- [ ] Posts migrated
- [ ] Widgets migrated (if any)
- [ ] Check data in Supabase Table Editor

### 7. Test Application

```bash
npm run dev
```

- [ ] Homepage loads
- [ ] Blog posts display
- [ ] Widgets work
- [ ] No database errors in console

## ✅ Post-Migration

### 8. Verify Everything Works

- [ ] Create a test blog post (if you have admin)
- [ ] Check widget stats load
- [ ] Test search functionality
- [ ] Verify all pages load

### 9. Clean Up (After 1-2 days of testing)

- [ ] Remove Neon environment variables
- [ ] Cancel Neon subscription (if paid)
- [ ] Update any documentation

## 🚀 Quick Commands

```bash
# Check current database
npx tsx lib/scripts/check-database.ts

# Check Supabase specifically
npx tsx lib/scripts/check-supabase.ts

# Force static data (if issues)
USE_WIDGET_CONSTANTS=true npm run dev

# Check logs
npm run dev 2>&1 | grep -i "database\|supabase"
```

## 🆘 Troubleshooting

### "relation does not exist"

- Run the schema migration SQL again
- Make sure you're in the right Supabase project

### "Invalid API key"

- Check NEXT_PUBLIC_SUPABASE_ANON_KEY is correct
- Make sure it's the `anon` key, not `service_role`

### Data not showing

- Check if migration completed
- Verify data exists in Supabase Table Editor
- Clear Next.js cache: `rm -rf .next`

### Slow performance

- Enable connection pooling in Supabase
- Check your region (should be close to users)

## 📊 Monitor Usage

In Supabase Dashboard:

- Check Database → Reports for usage
- Monitor API → Logs for errors
- Set up alerts for limits

## 🎯 Success Criteria

You've successfully migrated when:

- ✅ All pages load without errors
- ✅ Data displays correctly
- ✅ No Neon connection attempts in logs
- ✅ Supabase dashboard shows activity
- ✅ Performance is same or better

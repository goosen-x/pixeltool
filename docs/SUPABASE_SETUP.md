# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or login
3. Click "New project"
4. Fill in:
   - Project name: `portfolio` (or your choice)
   - Database password: (save this!)
   - Region: Choose closest to you
5. Click "Create new project"

## 2. Get Your Credentials

After project creation, go to:

1. **Settings** → **API**
2. Copy these values:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Settings** → **Database**
4. Copy the connection string → `DATABASE_URL`

## 3. Update Environment Variables

Create or update `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

## 4. Run Database Migration

1. Go to Supabase Dashboard
2. Click **SQL Editor**
3. Click **New query**
4. Copy & paste the contents of:
   ```
   lib/supabase/migrations/001_initial_schema.sql
   ```
5. Click **Run**

## 5. Migrate Existing Data (Optional)

If you have existing data in Neon:

```bash
# Run migration script
npx tsx lib/scripts/migrate-to-supabase.ts
```

## 6. Update Your Code

The project is already configured to use Supabase when available. Just restart
your dev server:

```bash
npm run dev
```

## 7. Verify Setup

Check if everything works:

```bash
# Test database connection
npx tsx lib/scripts/check-supabase.ts
```

## Features You Get with Supabase

1. **Always On** - No cold starts
2. **Realtime** - Live updates (optional)
3. **Auth** - Built-in authentication (optional)
4. **Storage** - File uploads (optional)
5. **Edge Functions** - Serverless functions (optional)

## Troubleshooting

### "relation does not exist" error

- Make sure you ran the migration SQL
- Check you're in the right project

### "Invalid API key" error

- Double-check your env variables
- Make sure you're using the `anon` key, not `service_role`

### Connection timeout

- Check your database password
- Verify the connection string format

## Next Steps

1. **Enable Realtime** (optional):
   - Go to Database → Replication
   - Enable tables you want realtime updates for

2. **Set up Auth** (optional):
   - Go to Authentication → Providers
   - Enable providers you want

3. **Configure Storage** (optional):
   - Go to Storage → Create bucket
   - Set up policies for public/private access

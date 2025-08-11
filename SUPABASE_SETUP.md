# Supabase Setup Instructions

## 1. Run Analytics Migration

Since you got an error about existing indexes, use the safe migration script:

Go to your Supabase dashboard → SQL Editor and run:

```sql
-- Copy and paste the contents of:
-- lib/supabase/migrations/002_analytics_tables_safe.sql
```

This script checks for existing objects before creating them, so it won't fail if some parts are already created.

## 2. Check Analytics Setup

Run this script to verify everything is set up correctly:

```bash
npx tsx lib/scripts/check-analytics-setup.ts
```

## 3. Populate Widgets Table

If the check script shows 0 widgets, populate the widgets table:

```bash
npx tsx lib/scripts/populate-widgets-supabase.ts
```

## 4. Verify Setup

Your Supabase database should now have:
- ✅ Posts table (with your blog posts)
- ✅ Widgets table (with all widget data)
- ✅ Widget translations
- ✅ Widget FAQs
- ✅ Usage events table (for analytics)

## 4. Test Analytics

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Visit any widget page (e.g., http://localhost:3000/en/projects/age-calculator)

3. Check Supabase dashboard → Table Editor → usage_events
   - You should see new events being tracked

## Analytics Data Being Tracked

- **Page Views**: Each time a widget is viewed
- **Session Start/End**: When users start and end their sessions
- **Session Duration**: How long users spend on each widget
- **User Agent**: Browser and device information
- **Referrer**: Where users came from
- **Screen Resolution**: User's screen size
- **Locale**: Language preference

## Usage Stats Display

The "Usage Stats" section in the widget sidebar will show:
- **Views today**: Number of views in the current day
- **Total uses**: Total views in the selected timeframe (7 days by default)
- **Avg. session**: Average time users spend on the widget

The stats will update in real-time as users interact with your widgets!
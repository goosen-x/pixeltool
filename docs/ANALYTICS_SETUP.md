# Analytics Setup Guide

## Current Status

The analytics system is designed to track widget usage, but currently returns **mock data** when the database tables are not available.

## How It Works

1. **With Database**: Tracks real usage events (views, sessions, duration)
2. **Without Database**: Returns consistent mock data based on widget ID
3. **API Endpoint**: `/api/analytics/stats/[widgetId]`

## Mock Data

When the `usage_events` table doesn't exist, the system returns:
- **Views Today**: 50-500 (consistent per widget)
- **Total Views**: 1,000-50,000
- **Unique Sessions**: Based on widget ID
- **Average Session**: 1-5 minutes

The mock data is deterministic - same widget always shows same numbers.

## Setting Up Real Analytics

### 1. Create Database Tables

Run the schema file in your Neon/Postgres database:

```sql
-- Execute the contents of:
-- lib/db/schema-analytics.sql
```

### 2. Track Events (Optional)

To track real events, you can call the track API:

```typescript
// Track a widget view
await fetch('/api/analytics/track', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    widgetId: 'css-clamp-calculator',
    eventType: 'view'
  })
})
```

### 3. Benefits of Real Analytics

- Track actual usage patterns
- Identify popular widgets
- Measure engagement time
- Improve based on data

## Why Mock Data?

1. **No Database Dependency** - Works without setup
2. **Consistent UX** - Shows realistic numbers
3. **Portfolio Ready** - Looks professional
4. **Easy Migration** - Can switch to real data anytime

## Privacy Considerations

If you implement real analytics:
- Only track anonymous sessions
- Don't collect personal data
- Add privacy policy
- Consider GDPR compliance

## Alternative Solutions

1. **Google Analytics** - Free, powerful, but requires setup
2. **Plausible** - Privacy-focused, paid
3. **Umami** - Self-hosted, open source
4. **Static Numbers** - Just hardcode the values

For a portfolio project, mock data is often the best choice!
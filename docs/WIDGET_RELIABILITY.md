# Widget System Reliability Guide

## Current Architecture

The widget system now uses a **Static-First Hybrid Approach**:

1. **Static Data** - Primary source, always available
2. **Database** - Enhancement layer for fresh data
3. **Memory Cache** - 24-hour cache for database results
4. **Timeout Protection** - 1.5-2 second timeout for all DB queries

## How It Works

```
User Request
    ↓
Load Static Data (instant)
    ↓
Check DB Available (with timeout)
    ↓
If DB Available:
  - Try to fetch fresh data (2s timeout)
  - Cache result for 24 hours
  - Return enhanced data
If DB Not Available:
  - Return static data immediately
```

## Configuration

### Environment Variables

```bash
# Force static data only (skip DB completely)
USE_WIDGET_CONSTANTS=true

# Database connection (optional)
POSTGRES_URL=...
```

### Performance Characteristics

- **First Load**: < 50ms (static data)
- **With DB**: < 2s max (timeout protection)
- **Cached**: < 10ms (memory cache)
- **Reliability**: 100% (always returns data)

## Benefits

1. **Always Works** - Even if Neon is sleeping or down
2. **Fast Initial Load** - Static data loads instantly
3. **Fresh Data When Available** - DB updates when possible
4. **No User Impact** - Timeouts handled gracefully
5. **24-Hour Cache** - Reduces DB load significantly

## Testing

```bash
# Test with database
npm run dev

# Test without database
USE_WIDGET_CONSTANTS=true npm run dev

# Check database status
npx tsx lib/scripts/check-database.ts
```

## Monitoring

The system logs database issues only in development mode to avoid noise in production.

To monitor database availability:

```typescript
import { checkWidgetsDbReady } from '@/lib/db/check-widgets-db'

const isDbAvailable = await checkWidgetsDbReady()
console.log('Database available:', isDbAvailable)
```

## Future Improvements

1. **Progressive Enhancement** - Update UI when fresh data arrives
2. **Service Worker** - Cache static data for offline use
3. **Edge Functions** - Move DB queries closer to users
4. **Webhook Updates** - Invalidate cache on content changes

## Rollback Plan

If issues occur, you can instantly rollback to static-only mode:

1. Set `USE_WIDGET_CONSTANTS=true` in environment
2. Or remove database connection strings
3. The app will automatically use static data only
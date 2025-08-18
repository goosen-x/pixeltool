# Widget Database Migration Guide

This guide explains how to migrate widget data from constants to the database.

## Overview

The widget system has been updated to support database storage while maintaining
backward compatibility with the existing constants. The system automatically
falls back to constants if the database is not available.

## Migration Steps

### 1. Database Schema Setup

First, ensure your database connection is configured in `.env.local`:

```bash
# Copy from Vercel dashboard
POSTGRES_URL="..."
POSTGRES_URL_NON_POOLING="..."
POSTGRES_USER="..."
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="..."
```

### 2. Run the Migration

Execute the migration script:

```bash
npx tsx lib/scripts/migrate-widgets-to-db.ts
```

This script will:

- Create the necessary database tables
- Migrate all widget data from constants
- Migrate all FAQ data
- Set up relationships and tags

### 3. Verify Migration

The migration script will output statistics showing:

- Number of widgets migrated
- Number of translations created
- Number of FAQs migrated
- Number of tags and relationships created

## Database Schema

The migration creates the following tables:

- `widgets` - Main widget data
- `widget_translations` - Localized titles and descriptions
- `widget_faqs` - Frequently asked questions
- `widget_related` - Related widget relationships
- `widget_tags` - Widget tags

## How It Works

The new system uses a hybrid approach:

1. **Check Database** - On each request, the system checks if the database is
   ready
2. **Use Database** - If available, data is fetched from the database
3. **Fallback to Constants** - If not available, the system uses the existing
   constants

This ensures the application continues to work even if:

- The database is not set up
- There's a database connection issue
- You're running locally without a database

## Benefits

- **Dynamic Updates** - Change widget data without redeploying
- **Better Performance** - Cached database queries
- **Scalability** - Handle more widgets efficiently
- **Localization** - Easier to manage translations
- **SEO** - Better structured data for search engines

## Future Improvements

- Admin panel for managing widgets
- API endpoints for widget data
- Analytics integration
- User favorites/bookmarks
- Widget usage tracking

## Rollback

If you need to rollback to using constants only:

1. The system automatically falls back if the database is not available
2. To force constants usage, you can set an environment variable:
   ```bash
   USE_WIDGET_CONSTANTS=true
   ```

## Troubleshooting

### Migration Fails

1. Check database connection in `.env.local`
2. Ensure database user has CREATE TABLE permissions
3. Check the error message for specific issues

### Widgets Not Loading

1. Check if migration completed successfully
2. Verify database tables were created
3. Check application logs for errors

### Performance Issues

1. Ensure indexes were created properly
2. Check database query performance
3. Verify caching is working correctly

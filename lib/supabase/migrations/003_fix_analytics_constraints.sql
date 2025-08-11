-- Fix analytics table constraints

-- First, let's check if there's a check constraint on event_type
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'usage_events'::regclass 
AND contype = 'c';

-- If there's a constraint limiting event_type values, drop it
ALTER TABLE usage_events 
DROP CONSTRAINT IF EXISTS usage_events_event_type_check;

-- Add a more flexible constraint or none at all
-- Option 1: No constraint (most flexible)
-- The event_type column already exists as VARCHAR(50), which is sufficient

-- Option 2: If you want to limit to specific values, use this instead:
-- ALTER TABLE usage_events 
-- ADD CONSTRAINT usage_events_event_type_check 
-- CHECK (event_type IN ('view', 'session_start', 'session_end', 'action', 'test', 'time_spent'));

-- Verify the table structure
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_name = 'usage_events'
ORDER BY ordinal_position;
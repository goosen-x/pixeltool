-- Add user_agent column if it doesn't exist
ALTER TABLE usage_events 
ADD COLUMN IF NOT EXISTS user_agent TEXT;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'usage_events'
ORDER BY ordinal_position;
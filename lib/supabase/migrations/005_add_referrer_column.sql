-- Add referrer column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'usage_events' 
    AND column_name = 'referrer'
  ) THEN
    ALTER TABLE usage_events ADD COLUMN referrer TEXT;
  END IF;
END $$;

-- Verify table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'usage_events'
ORDER BY ordinal_position;
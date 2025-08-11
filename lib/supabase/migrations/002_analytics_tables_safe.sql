-- Safe version of analytics tables migration
-- This script checks for existing objects before creating them

-- Create usage_events table for analytics (if not exists)
CREATE TABLE IF NOT EXISTS usage_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  widget_id VARCHAR(255) NOT NULL,
  session_id VARCHAR(255) NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance (if not exist)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_usage_events_widget_id') THEN
    CREATE INDEX idx_usage_events_widget_id ON usage_events(widget_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_usage_events_session_id') THEN
    CREATE INDEX idx_usage_events_session_id ON usage_events(session_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_usage_events_timestamp') THEN
    CREATE INDEX idx_usage_events_timestamp ON usage_events(timestamp);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_usage_events_event_type') THEN
    CREATE INDEX idx_usage_events_event_type ON usage_events(event_type);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_usage_events_widget_timestamp') THEN
    CREATE INDEX idx_usage_events_widget_timestamp ON usage_events(widget_id, timestamp);
  END IF;
END $$;

-- Enable RLS (if not already enabled)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'usage_events' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE usage_events ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous inserts" ON usage_events;
DROP POLICY IF EXISTS "Allow authenticated reads" ON usage_events;
DROP POLICY IF EXISTS "Allow anonymous widget stats" ON usage_events;

-- Create policies
CREATE POLICY "Allow anonymous inserts" ON usage_events
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated reads" ON usage_events
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Allow anonymous widget stats" ON usage_events
  FOR SELECT TO anon
  USING (true);

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS get_widget_stats(VARCHAR(255), INTERVAL);
DROP FUNCTION IF EXISTS track_usage_event(VARCHAR(255), VARCHAR(255), VARCHAR(50), TEXT, TEXT, JSONB);

-- Create function to get widget stats
CREATE OR REPLACE FUNCTION get_widget_stats(
  p_widget_id VARCHAR(255),
  p_timeframe INTERVAL DEFAULT INTERVAL '7 days'
)
RETURNS TABLE (
  views_today BIGINT,
  total_views BIGINT,
  unique_sessions_today BIGINT,
  total_sessions BIGINT,
  average_session_seconds INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH today_stats AS (
    SELECT 
      COUNT(*) FILTER (WHERE event_type = 'view') as views_today,
      COUNT(DISTINCT session_id) as unique_sessions_today
    FROM usage_events 
    WHERE widget_id = p_widget_id 
      AND DATE(timestamp) = CURRENT_DATE
  ),
  total_stats AS (
    SELECT 
      COUNT(*) FILTER (WHERE event_type = 'view') as total_views,
      COUNT(DISTINCT session_id) as total_sessions
    FROM usage_events 
    WHERE widget_id = p_widget_id
      AND timestamp >= NOW() - p_timeframe
  ),
  session_durations AS (
    SELECT 
      session_id,
      EXTRACT(EPOCH FROM (MAX(timestamp) - MIN(timestamp))) as duration_seconds
    FROM usage_events 
    WHERE widget_id = p_widget_id
      AND timestamp >= NOW() - p_timeframe
    GROUP BY session_id
    HAVING COUNT(*) > 1
      AND EXTRACT(EPOCH FROM (MAX(timestamp) - MIN(timestamp))) BETWEEN 5 AND 1800
  )
  SELECT 
    t.views_today,
    ts.total_views,
    t.unique_sessions_today,
    ts.total_sessions,
    COALESCE(AVG(sd.duration_seconds)::INTEGER, 0) as average_session_seconds
  FROM today_stats t
  CROSS JOIN total_stats ts
  CROSS JOIN (
    SELECT AVG(duration_seconds) as duration_seconds
    FROM session_durations
  ) sd;
END;
$$;

-- Create function to track event
CREATE OR REPLACE FUNCTION track_usage_event(
  p_widget_id VARCHAR(255),
  p_session_id VARCHAR(255),
  p_event_type VARCHAR(50),
  p_user_agent TEXT DEFAULT NULL,
  p_referrer TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_event_id UUID;
BEGIN
  INSERT INTO usage_events (
    widget_id,
    session_id,
    event_type,
    user_agent,
    referrer,
    metadata
  ) VALUES (
    p_widget_id,
    p_session_id,
    p_event_type,
    p_user_agent,
    p_referrer,
    p_metadata
  ) RETURNING id INTO v_event_id;
  
  RETURN v_event_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_widget_stats TO anon;
GRANT EXECUTE ON FUNCTION track_usage_event TO anon;

-- Verify table structure
SELECT 
  'Analytics tables setup complete!' as status,
  COUNT(*) as existing_events
FROM usage_events;
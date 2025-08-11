-- Schema for analytics and usage tracking
-- This schema stores widget usage events and statistics

-- Create usage_events table for tracking widget usage
CREATE TABLE IF NOT EXISTS usage_events (
  id SERIAL PRIMARY KEY,
  widget_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'session_start', 'session_end', 'interaction')),
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_usage_events_widget_id ON usage_events(widget_id);
CREATE INDEX IF NOT EXISTS idx_usage_events_session_id ON usage_events(session_id);
CREATE INDEX IF NOT EXISTS idx_usage_events_timestamp ON usage_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_usage_events_event_type ON usage_events(event_type);
CREATE INDEX IF NOT EXISTS idx_usage_events_widget_timestamp ON usage_events(widget_id, timestamp DESC);

-- Create aggregated stats table for faster queries (optional)
CREATE TABLE IF NOT EXISTS widget_stats_daily (
  id SERIAL PRIMARY KEY,
  widget_id TEXT NOT NULL,
  date DATE NOT NULL,
  total_views INTEGER DEFAULT 0,
  unique_sessions INTEGER DEFAULT 0,
  total_interactions INTEGER DEFAULT 0,
  average_session_duration INTEGER DEFAULT 0, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(widget_id, date)
);

-- Create index for daily stats
CREATE INDEX IF NOT EXISTS idx_widget_stats_daily_widget_date ON widget_stats_daily(widget_id, date DESC);

-- Function to clean up old events (optional, for data retention)
CREATE OR REPLACE FUNCTION cleanup_old_events(days_to_keep INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM usage_events 
  WHERE timestamp < CURRENT_TIMESTAMP - INTERVAL '1 day' * days_to_keep;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Example: To track a widget view
-- INSERT INTO usage_events (widget_id, session_id, event_type) 
-- VALUES ('css-clamp-calculator', 'session-123', 'view');
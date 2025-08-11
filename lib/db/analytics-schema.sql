-- Analytics schema for tracking widget usage
-- Run this in your Neon PostgreSQL console

-- Table for tracking usage events
CREATE TABLE IF NOT EXISTS usage_events (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  widget_id VARCHAR(100) NOT NULL,
  event_type VARCHAR(50) NOT NULL, -- 'view', 'session_start', 'session_end', 'action'
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  ip_address INET,
  locale VARCHAR(10),
  metadata JSONB -- Additional data like screen size, etc.
);

-- Table for aggregated daily stats (for performance)
CREATE TABLE IF NOT EXISTS daily_widget_stats (
  id SERIAL PRIMARY KEY,
  widget_id VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  total_views INTEGER DEFAULT 0,
  unique_sessions INTEGER DEFAULT 0,
  total_session_duration INTERVAL DEFAULT '0 seconds',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(widget_id, date)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_usage_events_timestamp ON usage_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_usage_events_widget_date ON usage_events(widget_id, DATE(timestamp));
CREATE INDEX IF NOT EXISTS idx_usage_events_session ON usage_events(session_id);
CREATE INDEX IF NOT EXISTS idx_usage_events_type ON usage_events(event_type);
CREATE INDEX IF NOT EXISTS idx_daily_stats_widget_date ON daily_widget_stats(widget_id, date);

-- Function to aggregate daily stats
CREATE OR REPLACE FUNCTION update_daily_stats(target_date DATE DEFAULT CURRENT_DATE)
RETURNS VOID AS $$
BEGIN
  INSERT INTO daily_widget_stats (widget_id, date, total_views, unique_sessions, total_session_duration)
  SELECT 
    widget_id,
    target_date,
    COUNT(*) FILTER (WHERE event_type = 'view') as total_views,
    COUNT(DISTINCT session_id) as unique_sessions,
    COALESCE(SUM(
      CASE 
        WHEN event_type = 'session_end' 
        THEN EXTRACT(EPOCH FROM (timestamp - session_start.timestamp)) * INTERVAL '1 second'
        ELSE INTERVAL '0'
      END
    ), INTERVAL '0') as total_session_duration
  FROM usage_events ue
  LEFT JOIN LATERAL (
    SELECT timestamp 
    FROM usage_events 
    WHERE session_id = ue.session_id AND event_type = 'session_start' 
    LIMIT 1
  ) session_start ON true
  WHERE DATE(ue.timestamp) = target_date
  GROUP BY widget_id
  ON CONFLICT (widget_id, date) 
  DO UPDATE SET
    total_views = EXCLUDED.total_views,
    unique_sessions = EXCLUDED.unique_sessions,
    total_session_duration = EXCLUDED.total_session_duration,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
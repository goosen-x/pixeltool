-- Initial schema for portfolio application
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  tags TEXT[] DEFAULT '{}',
  image TEXT,
  author TEXT DEFAULT 'Dmitry Borisenko',
  read_time INTEGER DEFAULT 5,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for posts
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_date ON posts(date DESC);
CREATE INDEX IF NOT EXISTS idx_posts_is_published ON posts(is_published);
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING GIN(tags);

-- Create widgets table
CREATE TABLE IF NOT EXISTS widgets (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  category TEXT NOT NULL,
  is_new BOOLEAN DEFAULT false,
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Widget translations table
CREATE TABLE IF NOT EXISTS widget_translations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  widget_id TEXT NOT NULL REFERENCES widgets(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'ru')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(widget_id, locale)
);

-- Widget FAQs table
CREATE TABLE IF NOT EXISTS widget_faqs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  widget_id TEXT NOT NULL REFERENCES widgets(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'ru')),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Related widgets table
CREATE TABLE IF NOT EXISTS widget_related (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  widget_id TEXT NOT NULL REFERENCES widgets(id) ON DELETE CASCADE,
  related_widget_id TEXT NOT NULL REFERENCES widgets(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(widget_id, related_widget_id),
  CHECK (widget_id != related_widget_id)
);

-- Widget tags table
CREATE TABLE IF NOT EXISTS widget_tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  widget_id TEXT NOT NULL REFERENCES widgets(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(widget_id, tag)
);

-- Usage events table for analytics
CREATE TABLE IF NOT EXISTS usage_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  widget_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'session_start', 'session_end', 'interaction')),
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_widgets_slug ON widgets(slug);
CREATE INDEX IF NOT EXISTS idx_widgets_category ON widgets(category);
CREATE INDEX IF NOT EXISTS idx_widget_translations_widget_id ON widget_translations(widget_id);
CREATE INDEX IF NOT EXISTS idx_widget_faqs_widget_id ON widget_faqs(widget_id);
CREATE INDEX IF NOT EXISTS idx_widget_related_widget_id ON widget_related(widget_id);
CREATE INDEX IF NOT EXISTS idx_widget_tags_widget_id ON widget_tags(widget_id);
CREATE INDEX IF NOT EXISTS idx_usage_events_widget_id ON usage_events(widget_id);
CREATE INDEX IF NOT EXISTS idx_usage_events_timestamp ON usage_events(timestamp);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_widgets_updated_at BEFORE UPDATE ON widgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_widget_translations_updated_at BEFORE UPDATE ON widget_translations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_widget_faqs_updated_at BEFORE UPDATE ON widget_faqs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_related ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_events ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public posts are viewable by everyone" ON posts
  FOR SELECT USING (is_published = true);

CREATE POLICY "Widgets are viewable by everyone" ON widgets
  FOR SELECT USING (true);

CREATE POLICY "Widget translations are viewable by everyone" ON widget_translations
  FOR SELECT USING (true);

CREATE POLICY "Widget FAQs are viewable by everyone" ON widget_faqs
  FOR SELECT USING (true);

CREATE POLICY "Widget relations are viewable by everyone" ON widget_related
  FOR SELECT USING (true);

CREATE POLICY "Widget tags are viewable by everyone" ON widget_tags
  FOR SELECT USING (true);

-- Allow anonymous inserts for usage events
CREATE POLICY "Anyone can insert usage events" ON usage_events
  FOR INSERT WITH CHECK (true);

-- Create views for easier querying
CREATE OR REPLACE VIEW public_posts AS
  SELECT * FROM posts WHERE is_published = true
  ORDER BY date DESC;

CREATE OR REPLACE VIEW widgets_with_translations AS
  SELECT 
    w.*,
    wt.locale,
    wt.title,
    wt.description
  FROM widgets w
  JOIN widget_translations wt ON w.id = wt.widget_id;
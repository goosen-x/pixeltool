-- Schema for widgets data storage
-- This schema stores all widget-related data including translations, FAQs, and relationships

-- Drop existing tables if they exist (be careful in production!)
DROP TABLE IF EXISTS widget_tags CASCADE;
DROP TABLE IF EXISTS widget_related CASCADE;
DROP TABLE IF EXISTS widget_faqs CASCADE;
DROP TABLE IF EXISTS widget_translations CASCADE;
DROP TABLE IF EXISTS widgets CASCADE;

-- Main widgets table
CREATE TABLE widgets (
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
CREATE TABLE widget_translations (
  id SERIAL PRIMARY KEY,
  widget_id TEXT NOT NULL REFERENCES widgets(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'ru')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(widget_id, locale)
);

-- Widget FAQs table
CREATE TABLE widget_faqs (
  id SERIAL PRIMARY KEY,
  widget_id TEXT NOT NULL REFERENCES widgets(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'ru')),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Related widgets table
CREATE TABLE widget_related (
  id SERIAL PRIMARY KEY,
  widget_id TEXT NOT NULL REFERENCES widgets(id) ON DELETE CASCADE,
  related_widget_id TEXT NOT NULL REFERENCES widgets(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(widget_id, related_widget_id),
  CHECK (widget_id != related_widget_id)
);

-- Widget tags table
CREATE TABLE widget_tags (
  id SERIAL PRIMARY KEY,
  widget_id TEXT NOT NULL REFERENCES widgets(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(widget_id, tag)
);

-- Create indexes for better performance
CREATE INDEX idx_widgets_slug ON widgets(slug);
CREATE INDEX idx_widgets_category ON widgets(category);
CREATE INDEX idx_widgets_is_new ON widgets(is_new);
CREATE INDEX idx_widgets_is_popular ON widgets(is_popular);
CREATE INDEX idx_widget_translations_widget_id ON widget_translations(widget_id);
CREATE INDEX idx_widget_translations_locale ON widget_translations(locale);
CREATE INDEX idx_widget_faqs_widget_id ON widget_faqs(widget_id);
CREATE INDEX idx_widget_faqs_locale ON widget_faqs(locale);
CREATE INDEX idx_widget_related_widget_id ON widget_related(widget_id);
CREATE INDEX idx_widget_related_related_widget_id ON widget_related(related_widget_id);
CREATE INDEX idx_widget_tags_widget_id ON widget_tags(widget_id);
CREATE INDEX idx_widget_tags_tag ON widget_tags(tag);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_widgets_updated_at BEFORE UPDATE ON widgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_widget_translations_updated_at BEFORE UPDATE ON widget_translations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_widget_faqs_updated_at BEFORE UPDATE ON widget_faqs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Fix RLS policies for widgets tables

-- First check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('widgets', 'widget_translations', 'widget_faqs', 'widget_tags', 'widget_related');

-- Temporarily disable RLS to insert data
ALTER TABLE widgets DISABLE ROW LEVEL SECURITY;
ALTER TABLE widget_translations DISABLE ROW LEVEL SECURITY;
ALTER TABLE widget_faqs DISABLE ROW LEVEL SECURITY;
ALTER TABLE widget_tags DISABLE ROW LEVEL SECURITY;
ALTER TABLE widget_related DISABLE ROW LEVEL SECURITY;

-- Or if you want to keep RLS enabled, add policies for anonymous access
-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read" ON widgets;
DROP POLICY IF EXISTS "Allow authenticated write" ON widgets;
DROP POLICY IF EXISTS "Allow anon insert" ON widgets;

-- Create new policies for widgets table
CREATE POLICY "Allow public read" ON widgets
  FOR SELECT TO public
  USING (true);

CREATE POLICY "Allow anon insert" ON widgets
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon update" ON widgets
  FOR UPDATE TO anon
  USING (true);

-- Similar policies for related tables
CREATE POLICY "Allow public read" ON widget_translations
  FOR SELECT TO public
  USING (true);

CREATE POLICY "Allow anon insert" ON widget_translations
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read" ON widget_faqs
  FOR SELECT TO public
  USING (true);

CREATE POLICY "Allow anon insert" ON widget_faqs
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read" ON widget_tags
  FOR SELECT TO public
  USING (true);

CREATE POLICY "Allow anon insert" ON widget_tags
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read" ON widget_related
  FOR SELECT TO public
  USING (true);

CREATE POLICY "Allow anon insert" ON widget_related
  FOR INSERT TO anon
  WITH CHECK (true);

-- Re-enable RLS with new policies
ALTER TABLE widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_related ENABLE ROW LEVEL SECURITY;

-- Verify policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('widgets', 'widget_translations', 'widget_faqs', 'widget_tags', 'widget_related')
ORDER BY tablename, policyname;
-- Fix RLS policies to allow INSERT and UPDATE with anon key

-- Drop old restrictive policies if they exist
DROP POLICY IF EXISTS "Allow service role full access" ON cached_pages;

-- Allow public (anon key) to INSERT
CREATE POLICY "Allow public insert" ON cached_pages
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow public (anon key) to UPDATE
CREATE POLICY "Allow public update" ON cached_pages
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Allow public (anon key) to DELETE (for cache invalidation)
CREATE POLICY "Allow public delete" ON cached_pages
  FOR DELETE
  TO public
  USING (true);


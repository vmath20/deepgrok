-- Create cached_mindmaps table for storing generated mindmaps

CREATE TABLE cached_mindmaps (
  id BIGSERIAL PRIMARY KEY,
  page_url TEXT UNIQUE NOT NULL,
  mindmap_markdown TEXT NOT NULL,
  cached_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on URL for fast lookups
CREATE INDEX idx_cached_mindmaps_url ON cached_mindmaps(page_url);

-- Create index on cached_at for expiration queries
CREATE INDEX idx_cached_mindmaps_cached_at ON cached_mindmaps(cached_at);

-- Enable Row Level Security (RLS)
ALTER TABLE cached_mindmaps ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read" ON cached_mindmaps
  FOR SELECT
  TO public
  USING (true);

-- Allow public insert
CREATE POLICY "Allow public insert" ON cached_mindmaps
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow public update
CREATE POLICY "Allow public update" ON cached_mindmaps
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Allow public delete
CREATE POLICY "Allow public delete" ON cached_mindmaps
  FOR DELETE
  TO public
  USING (true);

-- Function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_mindmaps_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cached_mindmaps_updated_at
  BEFORE UPDATE ON cached_mindmaps
  FOR EACH ROW
  EXECUTE FUNCTION update_mindmaps_updated_at();


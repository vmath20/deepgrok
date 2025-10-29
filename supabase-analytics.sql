-- Create visitor_analytics table for tracking unique users

CREATE TABLE visitor_analytics (
  id BIGSERIAL PRIMARY KEY,
  visitor_id TEXT UNIQUE NOT NULL,
  first_visit TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_visit TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  visit_count INTEGER NOT NULL DEFAULT 1,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on visitor_id for fast lookups
CREATE INDEX idx_visitor_analytics_visitor_id ON visitor_analytics(visitor_id);

-- Create index on first_visit for date-based queries
CREATE INDEX idx_visitor_analytics_first_visit ON visitor_analytics(first_visit);

-- Enable Row Level Security (RLS)
ALTER TABLE visitor_analytics ENABLE ROW LEVEL SECURITY;

-- Allow public insert (for tracking new visitors)
CREATE POLICY "Allow public insert" ON visitor_analytics
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow public update (for updating visit count)
CREATE POLICY "Allow public update" ON visitor_analytics
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Allow public read (for analytics dashboard)
CREATE POLICY "Allow public read" ON visitor_analytics
  FOR SELECT
  TO public
  USING (true);

-- Function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_visitor_analytics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_visitor_analytics_updated_at
  BEFORE UPDATE ON visitor_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_visitor_analytics_updated_at();


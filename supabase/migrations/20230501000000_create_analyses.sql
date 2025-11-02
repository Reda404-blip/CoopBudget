-- Create analyses table
CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  data JSONB,
  status VARCHAR(50) DEFAULT 'completed',
  is_public BOOLEAN DEFAULT false
);

-- Create analyses_tags table for tagging analyses
CREATE TABLE IF NOT EXISTS analyses_tags (
  analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
  tag VARCHAR(50),
  PRIMARY KEY (analysis_id, tag)
);

-- Add RLS policies
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses_tags ENABLE ROW LEVEL SECURITY;

-- Policies for analyses
CREATE POLICY "Analyses are viewable by everyone" 
  ON analyses FOR SELECT 
  USING (is_public OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own analyses" 
  ON analyses FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analyses" 
  ON analyses FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analyses" 
  ON analyses FOR DELETE 
  USING (auth.uid() = user_id);

-- Policies for analyses_tags
CREATE POLICY "Analyses tags are viewable by everyone" 
  ON analyses_tags FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert tags for their own analyses" 
  ON analyses_tags FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM analyses 
    WHERE analyses.id = analyses_tags.analysis_id 
    AND analyses.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete tags for their own analyses" 
  ON analyses_tags FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM analyses 
    WHERE analyses.id = analyses_tags.analysis_id 
    AND analyses.user_id = auth.uid()
  ));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at on analyses
CREATE TRIGGER update_analyses_updated_at
BEFORE UPDATE ON analyses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
